package com.ideasTracker.project.Initiative.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssignReviewersRequest {
    private List<Long> reviewerIds;
}
