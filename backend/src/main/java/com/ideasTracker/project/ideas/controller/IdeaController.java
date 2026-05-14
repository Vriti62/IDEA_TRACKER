package com.ideasTracker.project.ideas.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.util.List;
import java.util.Map;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import jakarta.validation.Valid;
import com.ideasTracker.project.enums.Status;
import com.ideasTracker.project.ideas.dto.IdeaCreateRequest;
import com.ideasTracker.project.ideas.dto.IdeaResponse;
import com.ideasTracker.project.ideas.dto.IdeaUpdateRequest;
import com.ideasTracker.project.ideas.dto.IdeaUpdateRequestStatus;
import com.ideasTracker.project.ideas.services.IdeaService;
import com.ideasTracker.project.users.entity.User;
import com.ideasTracker.project.users.repository.UserRepository;

@RestController
@RequestMapping("/api/ideas")
public class IdeaController {

    private final IdeaService ideaService;
    private final UserRepository userRepository;

    public IdeaController(IdeaService ideaService, UserRepository userRepository) {
        this.ideaService = ideaService;
        this.userRepository = userRepository;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{initiativeId}/ideas")
    public ResponseEntity<List<IdeaResponse>> getIdeasForInitiative(@PathVariable Long initiativeId) {
        return ResponseEntity.ok(ideaService.getIdeasByInitiative(initiativeId));
    }

    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @PostMapping
    public ResponseEntity<IdeaResponse> createIdea(
            @Valid @RequestBody IdeaCreateRequest req,
            Principal principal
    ) {
        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        IdeaResponse response = ideaService.createIdea(req, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<Page<IdeaResponse>> getAll(
            @RequestParam(required = false) Status status,
            @RequestParam(required = false) String keyword,
            Pageable pageable
    ) {
        return ResponseEntity.ok(ideaService.getAllIdeas(status, keyword, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<IdeaResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ideaService.getIdeaById(id));
    }

    @PreAuthorize("hasRole('USER')")
    @PutMapping("/{id}")
    public ResponseEntity<IdeaResponse> update(
            @PathVariable Long id,
            @RequestBody IdeaUpdateRequest request
    ) {
        return ResponseEntity.ok(ideaService.updateIdea(id, request));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{id}/status")
    public ResponseEntity<IdeaResponse> updateStatus(
            @PathVariable Long id,
            @RequestBody IdeaUpdateRequestStatus req
    ) {
        return ResponseEntity.ok(ideaService.updateStatus(id, req.getStatus()));
    }

    @PreAuthorize("hasRole('REVIEWER')")
    @PostMapping("/{id}/analyze")
    public ResponseEntity<IdeaResponse> analyzeIdea(@PathVariable Long id) {
        return ResponseEntity.ok(ideaService.analyzeIdea(id));
    }

    /**
     
     * POST /api/ideas/parse-excel
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/parse-excel")
    public ResponseEntity<Map<String, Object>> uploadIdeasExcel(
            @RequestParam("file") MultipartFile file,
            Principal principal
    ) {
        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(ideaService.parseAndCreateIdeasExcel(file, user));
    }

    
@PreAuthorize("hasRole('ADMIN')")
@GetMapping("/{initiativeId}/export-excel")
public ResponseEntity<ByteArrayResource> exportIdeasExcel(
        @PathVariable Long initiativeId
) {
    ByteArrayResource file =
            ideaService.exportIdeasByInitiativeExcel(initiativeId);

    return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION,
                    "attachment; filename=ideas_initiative_" + initiativeId + ".xlsx")
            .contentType(
                MediaType.parseMediaType(
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                )
            )
            .body(file);
}

}

