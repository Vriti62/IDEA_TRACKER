package com.ideasTracker.project.users.dto;

import com.ideasTracker.project.enums.Role;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserSignup {
    private String name;
    private String email;
    private String password;
    public Role role;
}
