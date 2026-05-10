package com.ideasTracker.project.Initiative.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InitiativeResponse {
    private Long id;
    private String title;
    private String description;
    private String status = "ONGOING"; // default status when created
}
