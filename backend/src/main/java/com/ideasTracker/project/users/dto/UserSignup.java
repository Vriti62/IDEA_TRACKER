package com.ideasTracker.project.users.dto;

import com.ideasTracker.project.enums.Role;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserSignup {
    private String username;
    private String email;
    private String password;
    public Role role=Role.USER; // default role for new signups
}
