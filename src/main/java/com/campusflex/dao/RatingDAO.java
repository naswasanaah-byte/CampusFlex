package com.campusflex.dao;

import com.campusflex.model.Rating;

import java.util.List;

public interface RatingDAO {
    Rating create(Rating rating);
    List<Rating> findByEvaluateeId(Long evaluateeId);
    boolean hasAlreadyRated(Long evaluatorId, Long evaluateeId, Long jobId);
    double getAverageRating(Long evaluateeId);
}
