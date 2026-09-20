package com.campusflex.service;

import com.campusflex.dao.RatingDAO;
import com.campusflex.exception.ValidationException;
import com.campusflex.model.Rating;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RatingService {

    private final RatingDAO ratingDAO;

    public RatingService(RatingDAO ratingDAO) {
        this.ratingDAO = ratingDAO;
    }

    public Rating addRating(Long evaluatorId, Long evaluateeId, Long jobId, int starRating, String reviewText) {
        if (starRating < 1 || starRating > 5) {
            throw new ValidationException("Rating must be between 1 and 5 stars.");
        }

        if (ratingDAO.hasAlreadyRated(evaluatorId, evaluateeId, jobId)) {
            throw new ValidationException("You have already submitted a rating for this job engagement.");
        }

        Rating rating = new Rating();
        rating.setEvaluatorId(evaluatorId);
        rating.setEvaluateeId(evaluateeId);
        rating.setJobId(jobId);
        rating.setRating(starRating);
        rating.setReviewText(reviewText);

        return ratingDAO.create(rating);
    }

    public List<Rating> getRatingsForUser(Long evaluateeId) {
        return ratingDAO.findByEvaluateeId(evaluateeId);
    }

    public double getAverageRating(Long evaluateeId) {
        return ratingDAO.getAverageRating(evaluateeId);
    }
}
