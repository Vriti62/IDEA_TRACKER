package com.ideasTracker.project.users.dto;

import com.ideasTracker.project.enums.Role;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {
    public Long id;
    private String username;
    private String email;
    private Role role;
}



