package com.ideasTracker.project.reviewIdeas.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import com.ideasTracker.project.ideas.entity.Idea;
import com.ideasTracker.project.users.entity.User;

@Entity
@Table(name = "idea_reviews")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IdeaReview {

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    private Idea idea;

    @ManyToOne
    private User reviewer;

    private int score; // 1–10 or 1–5

    @Column(length = 1000)
    private String reviewComment;

    private Instant reviewedAt;
}
