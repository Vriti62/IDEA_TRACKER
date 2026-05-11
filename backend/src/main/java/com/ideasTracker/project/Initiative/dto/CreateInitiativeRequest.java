package com.ideasTracker.project.Initiative.dto;

import java.time.Instant;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateInitiativeRequest {
    private String title;
    private String description;
    private Instant created_at;
}
