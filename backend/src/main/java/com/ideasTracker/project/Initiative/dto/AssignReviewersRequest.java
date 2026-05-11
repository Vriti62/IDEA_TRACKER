package com.ideasTracker.project.Initiative.dto;

import lombok.*;

import java.time.Instant;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssignReviewersRequest {

    private List<Long> reviewerIds;

    public List<Long> getReviewerIds() {
        return reviewerIds;
    }

    public void setReviewerIds(List<Long> reviewerIds) {
        this.reviewerIds = reviewerIds;
    }
    private Instant created_at;
}
