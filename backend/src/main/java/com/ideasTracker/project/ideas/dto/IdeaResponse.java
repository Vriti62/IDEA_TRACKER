package com.ideasTracker.project.ideas.dto;

import com.ideasTracker.project.enums.Status;
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
    private String createdByName;
    private Instant createdAt;
    private Instant updatedAt;
}