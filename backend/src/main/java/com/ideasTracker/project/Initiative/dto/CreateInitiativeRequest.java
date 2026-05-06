package com.ideasTracker.project.Initiative.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateInitiativeRequest {
    private String title;
    private String description;
}
