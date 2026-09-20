package com.campusflex.dao;

import com.campusflex.model.TimetableEntry;
import com.campusflex.model.enums.DayOfWeek;

import java.util.List;

public interface TimetableDAO {
    TimetableEntry addEntry(TimetableEntry entry);
    List<TimetableEntry> findByStudentId(Long studentId);
    List<TimetableEntry> findByStudentIdAndDay(Long studentId, DayOfWeek dayOfWeek);
    boolean deleteEntry(Long id, Long studentId);
    boolean clearTimetable(Long studentId);
}
