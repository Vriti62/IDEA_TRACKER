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
    private Long initiativeId;
    private String initiativeTitle;
    private String createdByUsername;
    private Instant createdAt;
    private Instant updatedAt;


public static IdeaResponse from(Idea idea) {
    IdeaResponse res = new IdeaResponse();

    res.setId(idea.getId());
    res.setTitle(idea.getTitle());
    res.setProblemStatement(idea.getProblemStatement());
    res.setPotentialSolution(idea.getPotentialSolution());
    res.setStatus(idea.getStatus());
    
    
    if (idea.getInitiative() != null) {
        res.setInitiativeId(idea.getInitiative().getId());
        res.setInitiativeTitle(idea.getInitiative().getTitle());
    } else {
        res.setInitiativeId(null);
        res.setInitiativeTitle(null);
    }


    res.setCreatedAt(idea.getCreatedAt());
    res.setUpdatedAt(idea.getUpdatedAt());

    res.setCreatedByUsername(
        idea.getCreatedBy() != null
            ? idea.getCreatedBy().getUsername()
            : "Anonymous"
    );

      res.setInitiativeTitle(
        idea.getInitiative() != null
            ? idea.getInitiative().getTitle()
            : "-"
    );

    return res;
}
}