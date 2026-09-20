package com.campusflex.controller;

import com.campusflex.exception.AuthenticationException;
import com.campusflex.model.Rating;
import com.campusflex.model.User;
import com.campusflex.service.RatingService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ratings")
public class RatingController {

    private final RatingService ratingService;

    public RatingController(RatingService ratingService) {
        this.ratingService = ratingService;
    }

    @PostMapping
    public ResponseEntity<Rating> submitRating(@RequestBody Map<String, Object> body, HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null) {
            throw new AuthenticationException("Please log in to submit a rating.");
        }

        Long evaluateeId = Long.parseLong(body.get("evaluateeId").toString());
        Long jobId = Long.parseLong(body.get("jobId").toString());
        int starRating = Integer.parseInt(body.get("rating").toString());
        String reviewText = (String) body.get("reviewText");

        Rating rating = ratingService.addRating(user.getId(), evaluateeId, jobId, starRating, reviewText);
        return ResponseEntity.ok(rating);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Map<String, Object>> getUserRatings(@PathVariable Long userId) {
        List<Rating> ratings = ratingService.getRatingsForUser(userId);
        double avg = ratingService.getAverageRating(userId);

        Map<String, Object> res = new HashMap<>();
        res.put("ratings", ratings);
        res.put("averageRating", Math.round(avg * 10.0) / 10.0);
        return ResponseEntity.ok(res);
    }
}
