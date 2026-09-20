package com.campusflex.model;

import java.time.LocalDateTime;

public class Rating {
    private Long id;
    private Long evaluatorId;
    private String evaluatorName;
    private Long evaluateeId;
    private String evaluateeName;
    private Long jobId;
    private String jobTitle;
    private Integer rating; // 1-5
    private String reviewText;
    private LocalDateTime createdAt = LocalDateTime.now();

    public Rating() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getEvaluatorId() { return evaluatorId; }
    public void setEvaluatorId(Long evaluatorId) { this.evaluatorId = evaluatorId; }

    public String getEvaluatorName() { return evaluatorName; }
    public void setEvaluatorName(String evaluatorName) { this.evaluatorName = evaluatorName; }

    public Long getEvaluateeId() { return evaluateeId; }
    public void setEvaluateeId(Long evaluateeId) { this.evaluateeId = evaluateeId; }

    public String getEvaluateeName() { return evaluateeName; }
    public void setEvaluateeName(String evaluateeName) { this.evaluateeName = evaluateeName; }

    public Long getJobId() { return jobId; }
    public void setJobId(Long jobId) { this.jobId = jobId; }

    public String getJobTitle() { return jobTitle; }
    public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public String getReviewText() { return reviewText; }
    public void setReviewText(String reviewText) { this.reviewText = reviewText; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
