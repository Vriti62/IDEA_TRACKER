package com.ideasTracker.project.reviewIdeas.dto;

import lombok.*;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewResponse {

    private Long id;
    private Long ideaId;

    private String reviewerName;

    private int score;
    private String comment;

    private Instant reviewedAt;
}