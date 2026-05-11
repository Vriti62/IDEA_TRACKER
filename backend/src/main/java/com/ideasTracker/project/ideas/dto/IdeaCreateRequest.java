package com.ideasTracker.project.ideas.dto;

import java.time.Instant;

import com.ideasTracker.project.enums.Status;
import lombok.*;
import jakarta.validation.constraints.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class IdeaCreateRequest {

    @NotBlank
    private String title;
    @NotBlank
    private String problemStatement;
    private String potentialSolution;
    @NotNull
        private Long initiativeId;


}