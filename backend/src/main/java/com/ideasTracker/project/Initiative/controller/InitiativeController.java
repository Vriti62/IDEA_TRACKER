package com.ideasTracker.project.Initiative.controller;

import com.ideasTracker.project.Initiative.dto.AssignReviewersRequest;
import com.ideasTracker.project.Initiative.entity.Initiative;
import com.ideasTracker.project.Initiative.repository.InitiativeRepository;
import com.ideasTracker.project.Initiative.service.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/initiatives")
public class InitiativeController {

    private final InitiativeService service;

    public InitiativeController(InitiativeService service) {
        this.service = service;
    }

    // ADMIN
    @PostMapping
    public ResponseEntity<Initiative> create(@RequestBody Map<String, String> body) {
        return ResponseEntity.ok(
                service.createInitiative(body.get("title"), body.get("description"))
        );
    }

    // ADMIN
    @PatchMapping("/{id}/assign")
    public ResponseEntity<Initiative> assign(
            @PathVariable Long id,
            @RequestBody List<Long> reviewerIds
    ) {
        return ResponseEntity.ok(service.assignReviewers(id, reviewerIds));
    }

    // REVIEWER
    @GetMapping("/reviewer/{userId}")
    public ResponseEntity<List<Initiative>> getForReviewer(@PathVariable Long userId) {
        return ResponseEntity.ok(service.getByReviewer(userId));
    }
}