package com.ideasTracker.project.Initiative.controller;

import com.ideasTracker.project.Initiative.dto.AssignReviewersRequest;
import com.ideasTracker.project.Initiative.entity.Initiative;
import com.ideasTracker.project.Initiative.repository.InitiativeRepository;
import com.ideasTracker.project.Initiative.dto.CreateInitiativeRequest;
import com.ideasTracker.project.Initiative.service.*;
import com.ideasTracker.project.ideas.dto.IdeaResponse;
import com.ideasTracker.project.ideas.services.IdeaService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
@RestController
@RequestMapping("/api/initiatives")
public class InitiativeController {

    private final InitiativeService service;
    private final IdeaService ideaService;

    public InitiativeController(InitiativeService service, IdeaService ideaService) {
        this.service = service;
        this.ideaService = ideaService;
    }

    // admin-- create initiative
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<Initiative> create(@RequestBody CreateInitiativeRequest req) {
        return ResponseEntity.ok(
                service.createInitiative(req.getTitle(), req.getDescription())
        );
    }

    // admin- assign reviewers
    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{id}/assign")
    public ResponseEntity<Initiative> assign(
            @PathVariable Long id,
            @RequestBody AssignReviewersRequest req
    ) {
        return ResponseEntity.ok(service.assignReviewers(id, req.getReviewerIds()));
    }

    // admin-- get ALL initiatives (admin dashboard)
    @PreAuthorize("hasAnyRole('ADMIN', 'REVIEWER','USER')")
    @GetMapping
    public ResponseEntity<List<Initiative>> getAllInitiativesAdmin() {
        return ResponseEntity.ok(service.getAllInitiatives());
    }

    // initiatives for dropdown
    @GetMapping("/public")
    public ResponseEntity<List<Initiative>> getPublicInitiatives() {
        return ResponseEntity.ok(service.getAllInitiatives());
    }

    // admin-- ideas under an initiative
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{initiativeId}/ideas")
    public ResponseEntity<List<IdeaResponse>> getIdeasForInitiative(
            @PathVariable Long initiativeId
    ) {
        return ResponseEntity.ok(
                ideaService.getIdeasByInitiative(initiativeId)
        );
    }

    
@PostMapping("/parse-excel")
public ResponseEntity<String> parseExcel(
        @RequestParam("file") MultipartFile file
) {
    service.parseAndCreateInitiatives(file);
    return ResponseEntity.ok("Initiatives created successfully");
}
}


