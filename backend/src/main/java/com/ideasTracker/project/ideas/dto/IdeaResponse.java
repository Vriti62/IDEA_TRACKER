package com.ideasTracker.project.ideas.dto;

import com.ideasTracker.project.enums.Status;
import com.ideasTracker.project.ideas.entity.Idea;

import java.time.Instant;
import lombok.*;
import jakarta.validation.constraints.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class IdeaResponse {
    private Long id;
    @NotBlank
    private String title;
    @NotBlank
    private String problemStatement;
    private String potentialSolution;
    private Status status;
    private String aiSummary;
    private String createdByUsername;
    private Instant createdAt;
    private Instant updatedAt;


 public static IdeaResponse from(Idea idea) {
        return IdeaResponse.builder()
                .id(idea.getId())
                .title(idea.getTitle())
                .problemStatement(idea.getProblemStatement())
                .potentialSolution(idea.getPotentialSolution())
                .status(idea.getStatus())
                .aiSummary(idea.getAiSummary())
                .createdByUsername(
                        idea.getCreatedBy() != null
                                ? idea.getCreatedBy().getUsername()
                                : null
                )
                .createdAt(idea.getCreatedAt())   
                .updatedAt(idea.getUpdatedAt())   
                .build();
    }

}