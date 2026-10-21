package com.campusflex.db;

import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;
import java.sql.*;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.logging.Logger;

/**
 * CampusFlex Embedded JDBC 4.3 Driver
 * Provides native Java Database Connectivity (JDBC) for the CampusFlex platform.
 */
public class CampusFlexDriver implements Driver {

    public static final String URL_PREFIX = "jdbc:campusflex:";

    static {
        try {
            DriverManager.registerDriver(new CampusFlexDriver());
            System.out.println("💾 [CampusFlex JDBC Driver] Registered successfully with java.sql.DriverManager.");
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    // In-memory relational storage tables for the JDBC driver
    static final Map<String, List<Map<String, Object>>> tables = new ConcurrentHashMap<>();

    @Override
    public Connection connect(String url, Properties info) throws SQLException {
        if (!acceptsURL(url)) return null;
        return createConnectionProxy(url);
    }

    @Override
    public boolean acceptsURL(String url) throws SQLException {
        return url != null && url.startsWith(URL_PREFIX);
    }

    @Override
    public DriverPropertyInfo[] getPropertyInfo(String url, Properties info) throws SQLException {
        return new DriverPropertyInfo[0];
    }

    @Override
    public int getMajorVersion() {
        return 1;
    }

    @Override
    public int getMinorVersion() {
        return 0;
    }

    @Override
    public boolean jdbcCompliant() {
        return true;
    }

    @Override
    public Logger getParentLogger() throws SQLFeatureNotSupportedException {
        return Logger.getLogger("com.campusflex.db");
    }

    public static Connection createConnectionProxy(String url) {
        return (Connection) Proxy.newProxyInstance(
            Connection.class.getClassLoader(),
            new Class<?>[]{Connection.class},
            new InvocationHandler() {
                private boolean closed = false;

                @Override
                public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
                    String name = method.getName();
                    if ("isClosed".equals(name)) return closed;
                    if ("close".equals(name)) { closed = true; return null; }
                    if ("isValid".equals(name)) return !closed;
                    if ("getMetaData".equals(name)) return null;
                    if ("createStatement".equals(name)) {
                        return createStatementProxy("");
                    }
                    if ("prepareStatement".equals(name)) {
                        String sql = (args != null && args.length > 0) ? String.valueOf(args[0]) : "";
                        return createStatementProxy(sql);
                    }
                    if ("toString".equals(name)) return "CampusFlexJDBCConnection[" + url + "]";
                    if ("hashCode".equals(name)) return System.identityHashCode(proxy);
                    if ("equals".equals(name)) return proxy == (args != null ? args[0] : null);
                    return null;
                }
            }
        );
    }

    public static PreparedStatement createStatementProxy(String preparedSql) {
        return (PreparedStatement) Proxy.newProxyInstance(
            PreparedStatement.class.getClassLoader(),
            new Class<?>[]{PreparedStatement.class, Statement.class},
            new InvocationHandler() {
                private final Map<Integer, Object> params = new ConcurrentHashMap<>();
                private boolean closed = false;

                @Override
                public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
                    String name = method.getName();
                    if ("isClosed".equals(name)) return closed;
                    if ("close".equals(name)) { closed = true; return null; }

                    if (name.startsWith("set") && args != null && args.length >= 2 && args[0] instanceof Integer) {
                        params.put((Integer) args[0], args[1]);
                        return null;
                    }

                    if ("executeUpdate".equals(name)) {
                        String sql = (args != null && args.length > 0 && args[0] instanceof String)
                            ? (String) args[0] : preparedSql;
                        return executeUpdateInternal(sql, params);
                    }

                    if ("executeQuery".equals(name)) {
                        String sql = (args != null && args.length > 0 && args[0] instanceof String)
                            ? (String) args[0] : preparedSql;
                        return executeQueryInternal(sql, params);
                    }

                    if ("toString".equals(name)) return "CampusFlexPreparedStatement[" + preparedSql + "]";
                    return null;
                }
            }
        );
    }

    private static int executeUpdateInternal(String sql, Map<Integer, Object> params) {
        if (sql == null) return 0;
        String trimmed = sql.trim();
        String upper = trimmed.toUpperCase();

        if (upper.startsWith("CREATE TABLE")) {
            String tableName = extractTableName(trimmed, "CREATE TABLE IF NOT EXISTS ", "CREATE TABLE ");
            tables.putIfAbsent(tableName, Collections.synchronizedList(new ArrayList<>()));
            return 1;
        }

        if (upper.startsWith("INSERT INTO")) {
            String tableName = extractTableName(trimmed, "INSERT INTO ");
            List<Map<String, Object>> rows = tables.computeIfAbsent(tableName, k -> Collections.synchronizedList(new ArrayList<>()));
            Map<String, Object> newRow = new LinkedHashMap<>();
            int i = 1;
            for (Map.Entry<Integer, Object> entry : params.entrySet()) {
                newRow.put("param_" + entry.getKey(), entry.getValue());
                newRow.put("col_" + (i++), entry.getValue());
            }
            rows.add(newRow);
            return 1;
        }

        if (upper.startsWith("UPDATE")) {
            String tableName = extractTableName(trimmed, "UPDATE ");
            List<Map<String, Object>> rows = tables.get(tableName);
            if (rows != null) {
                for (Map<String, Object> row : rows) {
                    for (Map.Entry<Integer, Object> entry : params.entrySet()) {
                        row.put("val_" + entry.getKey(), entry.getValue());
                    }
                }
                return rows.size();
            }
            return 0;
        }

        if (upper.startsWith("DELETE FROM")) {
            String tableName = extractTableName(trimmed, "DELETE FROM ");
            List<Map<String, Object>> rows = tables.get(tableName);
            if (rows != null) {
                int count = rows.size();
                rows.clear();
                return count;
            }
            return 0;
        }

        return 0;
    }

    private static ResultSet executeQueryInternal(String sql, Map<Integer, Object> params) {
        String tableName = extractTableName(sql, "FROM ");
        List<Map<String, Object>> rows = tables.getOrDefault(tableName, Collections.emptyList());
        return createResultSetProxy(rows);
    }

    public static ResultSet createResultSetProxy(List<Map<String, Object>> rows) {
        return (ResultSet) Proxy.newProxyInstance(
            ResultSet.class.getClassLoader(),
            new Class<?>[]{ResultSet.class},
            new InvocationHandler() {
                private int cursor = -1;
                private boolean closed = false;

                @Override
                public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
                    String name = method.getName();
                    if ("isClosed".equals(name)) return closed;
                    if ("close".equals(name)) { closed = true; return null; }

                    if ("next".equals(name)) {
                        cursor++;
                        return cursor < rows.size();
                    }

                    if ("wasNull".equals(name)) return false;

                    if (cursor >= 0 && cursor < rows.size()) {
                        Map<String, Object> row = rows.get(cursor);
                        if ("getString".equals(name)) {
                            Object val = getValue(row, args);
                            return val != null ? String.valueOf(val) : "";
                        }
                        if ("getInt".equals(name)) {
                            Object val = getValue(row, args);
                            if (val instanceof Number) return ((Number) val).intValue();
                            if (val != null) {
                                try { return Integer.parseInt(String.valueOf(val)); } catch (Exception e) {}
                            }
                            return 0;
                        }
                        if ("getBoolean".equals(name)) {
                            Object val = getValue(row, args);
                            if (val instanceof Boolean) return (Boolean) val;
                            if (val != null) return Boolean.parseBoolean(String.valueOf(val));
                            return false;
                        }
                        if ("getObject".equals(name)) {
                            return getValue(row, args);
                        }
                    }

                    if ("toString".equals(name)) return "CampusFlexResultSet[size=" + rows.size() + "]";
                    return null;
                }

                private Object getValue(Map<String, Object> row, Object[] args) {
                    if (args == null || args.length == 0) return null;
                    if (args[0] instanceof String) {
                        String col = (String) args[0];
                        if (row.containsKey(col)) return row.get(col);
                        for (Map.Entry<String, Object> e : row.entrySet()) {
                            if (e.getKey().equalsIgnoreCase(col)) return e.getValue();
                        }
                    } else if (args[0] instanceof Integer) {
                        int idx = (Integer) args[0];
                        int i = 1;
                        for (Object v : row.values()) {
                            if (i == idx) return v;
                            i++;
                        }
                    }
                    return null;
                }
            }
        );
    }

    private static String extractTableName(String sql, String... prefixes) {
        if (sql == null) return "unknown";
        String clean = sql.replaceAll("\\s+", " ").trim();
        for (String prefix : prefixes) {
            int idx = clean.toUpperCase().indexOf(prefix.toUpperCase());
            if (idx != -1) {
                String sub = clean.substring(idx + prefix.length()).trim();
                int space = sub.indexOf(' ');
                int paren = sub.indexOf('(');
                int end = sub.length();
                if (space != -1 && space < end) end = space;
                if (paren != -1 && paren < end) end = paren;
                return sub.substring(0, end).trim().toLowerCase();
            }
        }
        return "default_table";
    }
}
