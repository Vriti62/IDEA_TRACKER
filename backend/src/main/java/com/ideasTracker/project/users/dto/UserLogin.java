package com.ideasTracker.project.users.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserLogin {
    private String username;
    private String password;
}
