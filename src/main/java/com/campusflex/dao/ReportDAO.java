package com.campusflex.dao;

import com.campusflex.model.Report;
import com.campusflex.model.enums.ReportStatus;

import java.util.List;

public interface ReportDAO {
    Report create(Report report);
    List<Report> findAll();
    List<Report> findByStatus(ReportStatus status);
    boolean updateStatus(Long reportId, ReportStatus status);
}
