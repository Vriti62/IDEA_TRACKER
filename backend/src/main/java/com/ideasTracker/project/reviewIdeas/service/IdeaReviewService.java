package com.ideasTracker.project.reviewIdeas.service;

import java.time.Instant;
import java.util.List;

import org.springframework.stereotype.Service;

import com.ideasTracker.project.ideas.entity.Idea;
import com.ideasTracker.project.ideas.repository.IdeaRepository;
import com.ideasTracker.project.reviewIdeas.dto.ReviewResponse;
import com.ideasTracker.project.reviewIdeas.entity.IdeaReview;
import com.ideasTracker.project.reviewIdeas.mapper.ReviewMapper;
import com.ideasTracker.project.reviewIdeas.repository.IdeaReviewRepository;
import com.ideasTracker.project.users.entity.User;

@Service
public class IdeaReviewService {

    private final IdeaRepository ideaRepo;
    private final IdeaReviewRepository reviewRepo;
    private final ReviewMapper reviewMapper;

    public IdeaReviewService(
            IdeaRepository ideaRepo,
            IdeaReviewRepository reviewRepo,
            ReviewMapper reviewMapper
    ) {
        this.ideaRepo = ideaRepo;
        this.reviewRepo = reviewRepo;
        this.reviewMapper = reviewMapper;
    }

    public ReviewResponse submitReview(
            Long ideaId,
            User reviewer,
            int score,
            String comment
    ) {
        Idea idea = ideaRepo.findById(ideaId)
                .orElseThrow(() -> new RuntimeException("Idea not found"));

        IdeaReview review = new IdeaReview();
        review.setIdea(idea);
        review.setReviewer(reviewer);
        review.setScore(score);
        review.setReviewComment(comment);
        review.setReviewedAt(Instant.now());

        IdeaReview saved = reviewRepo.save(review);

        return reviewMapper.toResponse(saved);
    }

    
    public List<ReviewResponse> getReviewsForIdea(Long ideaId) {
        return reviewRepo.findByIdeaId(ideaId)
                .stream()
                .map(reviewMapper::toResponse)
                .toList();
    }

}