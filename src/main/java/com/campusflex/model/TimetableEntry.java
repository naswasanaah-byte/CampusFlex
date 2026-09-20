package com.campusflex.model;

import com.campusflex.model.enums.DayOfWeek;

import java.time.LocalTime;

public class TimetableEntry {
    private Long id;
    private Long studentId;
    private DayOfWeek dayOfWeek;
    private LocalTime startTime;
    private LocalTime endTime;
    private String subjectName;
    private String type; // e.g., "Lecture", "Lab", "Tutorial"

    public TimetableEntry() {}

    public TimetableEntry(Long id, Long studentId, DayOfWeek dayOfWeek, LocalTime startTime, LocalTime endTime, String subjectName, String type) {
        this.id = id;
        this.studentId = studentId;
        this.dayOfWeek = dayOfWeek;
        this.startTime = startTime;
        this.endTime = endTime;
        this.subjectName = subjectName;
        this.type = type;
    }

    /**
     * Checks if this lecture conflicts with a given day and time window.
     */
    public boolean conflictsWith(DayOfWeek targetDay, LocalTime targetStart, LocalTime targetEnd) {
        if (this.dayOfWeek != targetDay) {
            return false;
        }
        // Conflict occurs if targetStart < this.endTime AND targetEnd > this.startTime
        return targetStart.isBefore(this.endTime) && targetEnd.isAfter(this.startTime);
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public DayOfWeek getDayOfWeek() { return dayOfWeek; }
    public void setDayOfWeek(DayOfWeek dayOfWeek) { this.dayOfWeek = dayOfWeek; }

    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }

    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }

    public String getSubjectName() { return subjectName; }
    public void setSubjectName(String subjectName) { this.subjectName = subjectName; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
}
