package com.ideasTracker.project.Initiative.controller;

import com.ideasTracker.project.Initiative.dto.AssignReviewersRequest;
import com.ideasTracker.project.Initiative.entity.Initiative;
import com.ideasTracker.project.Initiative.repository.InitiativeRepository;
import com.ideasTracker.project.Initiative.dto.CreateInitiativeRequest;
import com.ideasTracker.project.Initiative.service.*;
import com.ideasTracker.project.ideas.dto.IdeaResponse;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/initiatives")
public class InitiativeController {

    private final InitiativeService service;

    public InitiativeController(InitiativeService service) {
        this.service = service;
    }

    // admin
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<Initiative> create(@RequestBody CreateInitiativeRequest req) {
        return ResponseEntity.ok(
                service.createInitiative(req.getTitle(), req.getDescription())
        );
    }

    // admin
    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{id}/assign")
    public ResponseEntity<Initiative> assign(
            @PathVariable Long id,
            @RequestBody AssignReviewersRequest req
    ) {
        return ResponseEntity.ok(service.assignReviewers(id, req.getReviewerIds()));
    }

    // reviewer's all initiatives
    @PreAuthorize("hasRole('REVIEWER' && 'ADMIN')")
    @GetMapping("/reviewer/{userId}")
    public ResponseEntity<List<Initiative>> getForReviewer(@PathVariable Long userId) {
        return ResponseEntity.ok(service.getByReviewer(userId));
    }

    // admin--get all initiatives
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<Initiative>> getAllInitiatives() {
        return ResponseEntity.ok(service.getAllInitiatives());
    }

    // admin-- get ideas under an initiative
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{initiativeId}/ideas")
    public ResponseEntity<List<IdeaResponse>> getIdeasForInitiative(
            @PathVariable Long initiativeId
    ) {
        return ResponseEntity.ok(
            service.getIdeasByInitiative(initiativeId)
        );
    }
}