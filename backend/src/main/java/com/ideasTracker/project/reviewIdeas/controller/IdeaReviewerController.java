package com.ideasTracker.project.reviewIdeas.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.security.core.Authentication;

import com.ideasTracker.project.reviewIdeas.dto.ReviewRequest;
import com.ideasTracker.project.reviewIdeas.dto.ReviewResponse;
import com.ideasTracker.project.reviewIdeas.service.IdeaReviewService;
import com.ideasTracker.project.users.entity.User;

public class IdeaReviewerController {
    private IdeaReviewService reviewService;

    public IdeaReviewerController(IdeaReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PreAuthorize("hasRole('REVIEWER')")
@PostMapping("/ideas/{id}/review")
public ResponseEntity<ReviewResponse> submitReview(
        @PathVariable Long id,
        @RequestBody ReviewRequest req,
        Authentication auth
) {
    User reviewer = (User) auth.getPrincipal();
    return ResponseEntity.ok(
        reviewService.submitReview(
            id, 
            reviewer, 
            req.getScore(), 
            req.getComment()
        )
    );
}
}
