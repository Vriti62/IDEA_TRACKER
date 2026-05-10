package com.ideasTracker.project.reviewIdeas.repository;
import com.ideasTracker.project.reviewIdeas.entity.IdeaReview;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface IdeaReviewRepository extends JpaRepository<IdeaReview, Long> {
    List<IdeaReview> findByReviewerId(Long reviewerId);
    List<IdeaReview> findByIdeaId(Long ideaId);
}