package com.ideasTracker.project.ideas.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import com.ideasTracker.project.enums.Status;
@Entity
@Table(name = "ideas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class Idea {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(name = "problem_statement", nullable = false, columnDefinition = "TEXT")
    private String problemStatement;

    @Column(name = "potential_solution", columnDefinition = "TEXT")
    private String potentialSolution;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    @Column(name = "created_by")
    private Long createdBy; // TEMP

    @Column(name = "created_at")
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
        updatedAt = Instant.now();
        status = status.OPEN;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = Instant.now();
    }
}