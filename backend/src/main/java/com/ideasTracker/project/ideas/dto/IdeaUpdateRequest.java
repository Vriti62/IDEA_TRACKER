package com.ideasTracker.project.ideas.dto;

import com.ideasTracker.project.enums.Status;
import lombok.*;
import jakarta.validation.constraints.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IdeaUpdateRequest {

    private String title;
    private String problemStatement;
    private String potentialSolution;
    private Status status;

}