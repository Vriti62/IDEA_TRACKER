package com.ideasTracker.project.ideas.dto;

import com.ideasTracker.project.enums.Status;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IdeaUpdateRequestStatus {
    private Status status;
}
