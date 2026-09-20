package com.campusflex;

import com.campusflex.model.TimetableEntry;
import com.campusflex.model.enums.DayOfWeek;
import org.junit.jupiter.api.Test;

import java.time.LocalTime;

import static org.junit.jupiter.api.Assertions.*;

class TimetableConflictTest {

    @Test
    void testLectureTimeOverlap() {
        TimetableEntry lecture = new TimetableEntry(1L, 1L, DayOfWeek.MONDAY,
                LocalTime.of(9, 0), LocalTime.of(12, 0), "Data Structures", "Lecture");

        // Job during lecture (10:00 - 14:00) -> Conflicts!
        assertTrue(lecture.conflictsWith(DayOfWeek.MONDAY, LocalTime.of(10, 0), LocalTime.of(14, 0)));

        // Job after lecture (13:00 - 17:00) -> No conflict!
        assertFalse(lecture.conflictsWith(DayOfWeek.MONDAY, LocalTime.of(13, 0), LocalTime.of(17, 0)));

        // Job on different day -> No conflict!
        assertFalse(lecture.conflictsWith(DayOfWeek.TUESDAY, LocalTime.of(10, 0), LocalTime.of(14, 0)));
    }
}
