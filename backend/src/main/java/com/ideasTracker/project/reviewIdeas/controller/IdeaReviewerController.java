package com.ideasTracker.project.reviewIdeas.controller;

import com.ideasTracker.project.reviewIdeas.dto.ReviewRequest;
import com.ideasTracker.project.reviewIdeas.dto.ReviewResponse;
import com.ideasTracker.project.reviewIdeas.service.IdeaReviewService;
import com.ideasTracker.project.users.entity.User;
import com.ideasTracker.project.users.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ideas")
public class IdeaReviewerController {

    private final IdeaReviewService reviewService;
    private final UserRepository userRepository;

    public IdeaReviewerController(IdeaReviewService reviewService, UserRepository userRepository) {
        this.reviewService = reviewService;
        this.userRepository = userRepository;
    }

    // reviewer -- submits review
    @PreAuthorize("hasRole('REVIEWER')")
    @PostMapping("/{id}/review")
    public ResponseEntity<ReviewResponse> submitReview(
            @PathVariable Long id,
            @RequestBody ReviewRequest req,
            Authentication auth
    ) {
        //auth.getName() is username
        User reviewer = userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new RuntimeException("Reviewer user not found"));

        return ResponseEntity.ok(
                reviewService.submitReview(
                        id,
                        reviewer,
                        req.getScore(),
                        req.getComment()
                )
        );
    }

    // admin+reviewer can view reviews (so you can show reviewer remarks in UI)
    @PreAuthorize("hasAnyRole('ADMIN','REVIEWER')")
    @GetMapping("/{id}/reviews")
    public ResponseEntity<List<ReviewResponse>> getReviewsForIdea(@PathVariable Long id) {
        return ResponseEntity.ok(reviewService.getReviewsForIdea(id));
    }
}
