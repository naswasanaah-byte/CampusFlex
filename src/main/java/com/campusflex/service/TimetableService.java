package com.campusflex.service;

import com.campusflex.dao.TimetableDAO;
import com.campusflex.exception.ValidationException;
import com.campusflex.model.TimetableEntry;
import com.campusflex.model.enums.DayOfWeek;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class TimetableService {

    private final TimetableDAO timetableDAO;

    public TimetableService(TimetableDAO timetableDAO) {
        this.timetableDAO = timetableDAO;
    }

    public List<TimetableEntry> getStudentTimetable(Long studentId) {
        return timetableDAO.findByStudentId(studentId);
    }

    public TimetableEntry addLecture(Long studentId, DayOfWeek day, LocalTime startTime, LocalTime endTime, String subjectName, String type) {
        if (startTime == null || endTime == null || startTime.isAfter(endTime) || startTime.equals(endTime)) {
            throw new ValidationException("Start time must be strictly before end time.");
        }
        if (subjectName == null || subjectName.trim().isEmpty()) {
            throw new ValidationException("Subject name is required.");
        }

        // Check internal timetable overlaps
        List<TimetableEntry> existing = timetableDAO.findByStudentIdAndDay(studentId, day);
        for (TimetableEntry entry : existing) {
            if (entry.conflictsWith(day, startTime, endTime)) {
                throw new ValidationException("Time slot overlaps with existing lecture: " + entry.getSubjectName());
            }
        }

        TimetableEntry entry = new TimetableEntry(null, studentId, day, startTime, endTime, subjectName.trim(), type);
        return timetableDAO.addEntry(entry);
    }

    public boolean deleteLecture(Long entryId, Long studentId) {
        return timetableDAO.deleteEntry(entryId, studentId);
    }

    public boolean clearTimetable(Long studentId) {
        return timetableDAO.clearTimetable(studentId);
    }

    /**
     * Checks if a target job schedule conflicts with any student lectures.
     * returns a list of conflict messages if any exist.
     */
    public List<String> findScheduleConflicts(Long studentId, String workingDaysStr, LocalTime jobStart, LocalTime jobEnd) {
        List<String> conflicts = new ArrayList<>();
        if (workingDaysStr == null || jobStart == null || jobEnd == null) return conflicts;

        List<TimetableEntry> timetable = timetableDAO.findByStudentId(studentId);
        if (timetable.isEmpty()) return conflicts;

        String[] days = workingDaysStr.split(",");
        for (String dayStr : days) {
            try {
                DayOfWeek day = parseDayOfWeek(dayStr.trim());
                for (TimetableEntry entry : timetable) {
                    if (entry.conflictsWith(day, jobStart, jobEnd)) {
                        conflicts.add(String.format("Schedule conflict on %s (%s - %s) with lecture '%s'",
                                day.name(), entry.getStartTime(), entry.getEndTime(), entry.getSubjectName()));
                    }
                }
            } catch (Exception ignored) {}
        }
        return conflicts;
    }

    private DayOfWeek parseDayOfWeek(String dayStr) {
        String upper = dayStr.toUpperCase();
        if (upper.startsWith("MON")) return DayOfWeek.MONDAY;
        if (upper.startsWith("TUE")) return DayOfWeek.TUESDAY;
        if (upper.startsWith("WED")) return DayOfWeek.WEDNESDAY;
        if (upper.startsWith("THU")) return DayOfWeek.THURSDAY;
        if (upper.startsWith("FRI")) return DayOfWeek.FRIDAY;
        if (upper.startsWith("SAT")) return DayOfWeek.SATURDAY;
        if (upper.startsWith("SUN")) return DayOfWeek.SUNDAY;
        return DayOfWeek.valueOf(upper);
    }
}
