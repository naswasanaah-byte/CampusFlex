# CampusFlex — "Smart Jobs. Flexible Future."

> **CampusFlex** is a production-style, student-centered part-time job discovery and intelligent timetable-aware matching platform. It solves a real-world problem faced by college students: finding verified, flexible part-time work that fits cleanly around their academic lecture schedules, while empowering local employers to recruit student talent based on skill fit and availability.

---

## 🌟 Key Problem Solved

### The Student Challenge
Students frequently encounter part-time job postings on WhatsApp groups, Telegram, Facebook, and Instagram. These posts are often:
- Outdated or expired
- Duplicated across channels
- Difficult to filter by working hours
- Not properly verified (safety & scam risks)
- **Incompatible with college lecture timetables** (causing attendance shortages)

### The Employer Challenge
Local businesses and startups struggle to find reliable student workers who match required:
- Technical / soft skills
- Working hour windows (evenings, weekends, free lecture days)
- Location proximity
- Course department alignment

### The CampusFlex Solution
CampusFlex connects both sides through **Timetable-Aware Smart Job Matching**. Students input their weekly lecture timetable (e.g. Mon 09:00–12:00 Data Structures), and CampusFlex evaluates job listings, calculating a **0–100% Fit Score** while flagging schedule collisions before application!

---

## 🛠️ Technology Stack & Architecture

- **Backend**: Java 17+, Spring Boot 3.2.3, REST APIs
- **Database Access Technology**: **Pure Explicit JDBC** (`Connection`, `PreparedStatement`, `ResultSet`, `Statement.RETURN_GENERATED_KEYS`, explicit transaction boundaries `conn.setAutoCommit(false)` / `conn.commit()`)
- **Database**: H2 (Embedded MySQL Mode for instant zero-config execution) / MySQL Server compatible DDL
- **Frontend**: Responsive Single Page Application (HTML5, CSS3, ES6 JavaScript)
- **UI/UX Branding**: `#6C3EF4` Primary Purple, `#8B5CF6` Secondary Purple, `#F8F9FC` Background, Card layouts, Mobile Bottom Navigation + Desktop Sidebar Navigation
- **Build System**: Apache Maven

### Layered Architecture
```
  [ Frontend SPA (HTML5/CSS3/JS) ]
                 ↓ REST APIs
    [ Controller Layer (Spring Web) ]
                 ↓
     [ Service Layer (Business & Matching Engine) ]
                 ↓
    [ DAO Layer (Explicit JDBC Repositories) ]
                 ↓ PreparedStatement / ResultSet / Transactions
      [ Relational Database (MySQL / H2) ]
```

---

## 🚀 Quick Start & How to Run

### Prerequisites
- JDK 17 or higher
- Apache Maven (or embedded wrapper)

### Running the Application
From the project root folder `/home/ugp/.gemini/antigravity/scratch/campusflex`:

```bash
mvn spring-boot:run
```

Once launched, open your web browser at:
👉 **`http://localhost:8080`**

H2 Database Web Console available at:
👉 **`http://localhost:8080/h2-console`** *(JDBC URL: `jdbc:h2:mem:campusflexdb`)*

---

## 🔑 Demo Login Accounts

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Student** | `student@campusflex.com` | `Student123!` | Ananya Verma (NIT Calicut CS 5th Sem) |
| **Employer** | `brightacademy@campusflex.com` | `Employer123!` | Bright Academy Calicut (Verified Employer) |
| **Admin** | `admin@campusflex.com` | `Admin123!` | CampusFlex Platform Moderation Team |

---

## 🎓 WHERE OOP CONCEPTS ARE USED (Academic Reference)

CampusFlex is designed to serve as an academic benchmark for **Java Object-Oriented Programming (OOP)**, **JDBC**, and **Software Architecture**:

### 1. Encapsulation
- **Where**: Model classes (`User`, `StudentProfile`, `EmployerProfile`, `Job`, `TimetableEntry`, `Application`).
- **Why**: All entity fields are declared `private` and accessed via getter/setter methods. Internal state calculations, such as `profile.calculateCompletionPercentage()` and `profile.getMissingFields()`, are encapsulated directly within `StudentProfile.java`.

### 2. Inheritance
- **Where**: Domain user class hierarchy under `com.campusflex.model`.
- **Why**: `abstract class User` provides common security attributes (`id`, `email`, `phone`, `passwordHash`, `role`, `createdAt`). It is extended by:
  - `StudentUser extends User` (contains `StudentProfile`)
  - `EmployerUser extends User` (contains `EmployerProfile`)
  - `AdminUser extends User` (contains `AdminProfile`)

### 3. Polymorphism
- **Where**: Abstract method overriding and interface references.
- **Why**: `User` declares abstract `public abstract String getDisplayName()`. Each subclass provides its own dynamic behavior:
  - `StudentUser` returns student full name or email.
  - `EmployerUser` returns company name or email.
  - `AdminUser` returns admin full name or email.
  Polymorphism allows `AuthenticationService` and `RestController` methods to process generic `User` references without checking exact concrete types for display rendering.

### 4. Abstraction
- **Where**: Model interfaces (`Authenticatable`, `Notifiable`, `Searchable`, `Matchable`) and DAO interfaces.
- **Why**: Hides implementation details behind essential contracts. For instance, `Job` implements `Searchable` and `Matchable`, enabling the `MatchingService` to compute match scores without exposing database queries.

### 5. Interfaces & DAO Pattern
- **Where**: `UserDAO`, `StudentDAO`, `EmployerDAO`, `JobDAO`, `ApplicationDAO`, `TimetableDAO`, `NotificationDAO`, `MessageDAO`, `ReportDAO`, `RatingDAO`.
- **Why**: Decouples business logic in the Service layer from direct database operations. Implementations (`UserDAOImpl`, etc.) use explicit JDBC without leaking SQL details into Services or Controllers.

### 6. Pure Explicit JDBC & Transaction Management
- **Where**: `ApplicationService.acceptApplicant()` and `JobDAOImpl`.
- **Why**: Demonstrates manual JDBC transaction handling using `Connection`:
  ```java
  conn.setAutoCommit(false); // Begin Transaction
  try {
      applicationDAO.updateStatus(applicationId, ApplicationStatus.ACCEPTED);
      jobDAO.decrementVacancies(conn, jobId); // Atomic decrement
      if (updatedJob.getVacancies() <= 0) {
          jobDAO.updateStatus(jobId, JobStatus.FILLED);
      }
      notificationDAO.create(...);
      conn.commit(); // Commit Transaction
  } catch (Exception ex) {
      conn.rollback(); // Rollback on error
  }
  ```

### 7. Method Overloading & Method Overriding
- **Where**:
  - **Overloading**: `JobDAO.searchJobs(...)` supports multiple parameter variations; `TimetableEntry` constructors.
  - **Overriding**: `@Override` annotations on interface methods and `User.getDisplayName()`.

### 8. Java Collections Framework
- **Where**: `ArrayList`, `HashMap`, `Set`.
- **Why**:
  - `List<Skill>` and `List<TimetableEntry>` store student skills and lecture entries.
  - `HashMap<String, Object>` formatted for REST API responses and match metrics.
  - `Set<String>` used in `MatchingService` for $O(1)$ skill overlap matching.

### 9. Enums
- **Where**: Type-safe domain constants: `UserRole`, `WorkType`, `SalaryType`, `JobStatus`, `ApplicationStatus`, `VerificationStatus`, `ReportStatus`, `DayOfWeek`.

### 10. Exception Handling & Global Advice
- **Where**: Custom exception hierarchy (`ResourceNotFoundException`, `AuthenticationException`, `ValidationException`, `DatabaseException`) handled globally via `@RestControllerAdvice GlobalExceptionHandler`.

---

## ⚡ CampusFlex Matching Algorithm Breakdown

The smart rule-based matching engine (`MatchingService.java`) evaluates jobs against a student's profile and active lecture timetable:

$$\text{Composite Fit Score} = (S \cdot 0.30) + (T \cdot 0.25) + (L \cdot 0.15) + (C \cdot 0.10) + (W \cdot 0.10) + (P \cdot 0.10)$$

Where:
- $S$: Skill Overlap Score (30%)
- $T$: Lecture Schedule Compatibility Score (25%) — **Hard Penalty**: If a lecture overlaps with job hours, score is capped at max 45% and flagged with **"⚠ Schedule Conflict"**.
- $L$: Location Proximity (15%)
- $C$: Department / Job Category Alignment (10%)
- $W$: Preferred Work Mode (Remote / On-Site / Hybrid) (10%)
- $P$: Target Pay Rate Expectation (10%)

---

## 📁 Project Directory Structure

```
campusflex/
├── pom.xml
├── README.md
└── src/
    ├── main/
    │   ├── java/
    │   │   └── com/
    │   │       └── campusflex/
    │   │           ├── CampusFlexApplication.java
    │   │           ├── controller/     # AuthController, StudentController, JobController, ApplicationController...
    │   │           ├── dao/            # UserDAO, StudentDAO, JobDAO, TimetableDAO...
    │   │           │   └── impl/       # Explicit JDBC Implementations
    │   │           ├── exception/      # Custom Exceptions & GlobalExceptionHandler
    │   │           ├── model/          # User, StudentUser, EmployerUser, Job, TimetableEntry...
    │   │           │   ├── enums/      # UserRole, WorkType, JobStatus, DayOfWeek...
    │   │           │   └── interfaces/ # Authenticatable, Searchable, Matchable...
    │   │           ├── security/       # PasswordUtils (SHA-256 Hashing)
    │   │           └── service/        # MatchingService, TimetableService, ApplicationService...
    │   └── resources/
    │       ├── application.properties
    │       ├── schema.sql              # MySQL / H2 DDL
    │       ├── data.sql                # Realistic Kerala/India seed data
    │       └── static/                 # Single Page Responsive Web App
    │           ├── index.html
    │           ├── css/style.css       # #6C3EF4 Responsive Theme
    │           └── js/                 # app.js, auth.js, timetable.js, jobs.js, chat.js, admin.js
    └── test/
        └── java/
            └── com/
                └── campusflex/         # Unit Tests (MatchingServiceTest, TimetableConflictTest)
```

---

## 📜 License & Accreditation
Designed and developed for **CampusFlex — Smart Jobs. Flexible Future.**
Demonstrating Object-Oriented Programming, Advanced JDBC Architecture, and Responsive UI/UX Systems.
