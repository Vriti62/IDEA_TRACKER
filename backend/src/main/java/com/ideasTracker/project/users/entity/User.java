package com.ideasTracker.project.users.entity;

import lombok.*;
import jakarta.persistence.*;
import com.ideasTracker.project.enums.Role;

@Entity
@Table(name="users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder


public class User {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    public Long id;
    private String name;
    @Column(unique = true)
    private String email;
    private String password;
    @Enumerated(EnumType.STRING)
    private Role role;
}
