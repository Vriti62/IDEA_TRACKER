package com.ideasTracker.project.reviewIdeas.mapper;

import com.ideasTracker.project.reviewIdeas.dto.ReviewResponse;
import com.ideasTracker.project.reviewIdeas.entity.IdeaReview;
import org.springframework.stereotype.Component;

@Component
public class ReviewMapper {

    public ReviewResponse toResponse(IdeaReview review) {
        return ReviewResponse.builder()
                .id(review.getId())
                .ideaId(review.getIdea().getId())
                .reviewerName(review.getReviewer().getName())
                .score(review.getScore())
                .comment(review.getReviewComment())
                .reviewedAt(review.getReviewedAt())
                .build();
    }
}