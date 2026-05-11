package com.ideasTracker.project.Initiative.entity;

import com.ideasTracker.project.Initiative.service.InitiativeService;
import com.ideasTracker.project.users.entity.User;
import com.ideasTracker.project.users.services.UserService;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
@Entity
@Table(name = "initiatives")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Initiative {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;

    @ManyToMany
    @JoinTable(
        name = "initiative_reviewers",
        joinColumns = @JoinColumn(name = "initiative_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    @Builder.Default
    private List<User> reviewers=new ArrayList<>();
    private Instant created_at;

    
}