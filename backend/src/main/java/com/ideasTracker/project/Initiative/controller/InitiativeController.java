package com.ideasTracker.project.Initiative.controller;

import com.ideasTracker.project.Initiative.dto.AssignReviewersRequest;
import com.ideasTracker.project.Initiative.entity.Initiative;
import com.ideasTracker.project.Initiative.repository.InitiativeRepository;
import com.ideasTracker.project.ideas.repository.IdeaRepository;
import com.ideasTracker.project.Initiative.dto.CreateInitiativeRequest;
import com.ideasTracker.project.Initiative.service.*;
import com.ideasTracker.project.ideas.dto.IdeaResponse;
import com.ideasTracker.project.ideas.services.IdeaService;
import com.ideasTracker.project.users.entity.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
@RestController
@RequestMapping("/api/initiatives")
public class InitiativeController {

    private final InitiativeService initiativeService;

    public InitiativeController(InitiativeService initiativeService) {
        this.initiativeService = initiativeService;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<Initiative> create(
            @RequestBody CreateInitiativeRequest req
    ) {
        return ResponseEntity.ok(
                initiativeService.createInitiative(
                        req.getTitle(),
                        req.getDescription()
                )
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{id}/assign")
    public ResponseEntity<Void> assign(
            @PathVariable Long id,
            @RequestBody AssignReviewersRequest req
    ) {
        initiativeService.assignReviewers(id, req.getReviewerIds());
        return ResponseEntity.ok().build();
    }


    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<Initiative>> getAllInitiativesAdmin() {
        return ResponseEntity.ok(
                initiativeService.getAllInitiatives()
        );
    }


    @GetMapping("/public")
    public ResponseEntity<List<Initiative>> getPublicInitiatives() {
        return ResponseEntity.ok(
                initiativeService.getAllInitiatives()
        );
    }

    @PreAuthorize("hasAnyRole('ADMIN','REVIEWER')")
    @GetMapping("/{initiativeId}/ideas")
    public ResponseEntity<List<IdeaResponse>> getIdeasForInitiative(
            @PathVariable Long initiativeId
    ) {
        return ResponseEntity.ok(
                initiativeService.getIdeasByInitiative(initiativeId)
        );
    }

    @PreAuthorize("hasRole('REVIEWER')")
    @GetMapping("/my")
    public ResponseEntity<List<Initiative>> getMyInitiatives(
            @AuthenticationPrincipal org.springframework.security.core.userdetails.UserDetails principal
    ) {
        return ResponseEntity.ok(
                initiativeService.getByReviewerUsername(
                        principal.getUsername()
                )
        );
    }
}
