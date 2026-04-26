package com.ideasTracker.project.ideas.controller;

import com.ideasTracker.project.ideas.dto.IdeaCreateRequest;
import com.ideasTracker.project.ideas.dto.IdeaResponse;
import com.ideasTracker.project.ideas.dto.IdeaUpdateRequest;
import com.ideasTracker.project.ideas.services.IdeaService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import jakarta.validation.Valid;
import com.ideasTracker.project.enums.Status;

@RestController
@RequestMapping("/api/ideas")
public class IdeaController {

    private final IdeaService ideaService;

    public IdeaController(IdeaService ideaService) {

        this.ideaService = ideaService;
    }

    @PostMapping
    public ResponseEntity<IdeaResponse> createIdea(@Valid @RequestBody IdeaCreateRequest req) {
        IdeaResponse response = ideaService.createIdea(req);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
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

    @PutMapping("/{id}")
    public ResponseEntity<IdeaResponse> update(
            @PathVariable Long id,
            @RequestBody IdeaUpdateRequest request
    ) {
        return ResponseEntity.ok(ideaService.updateIdea(id, request));
    }
//
//    @DeleteMapping("/{id}")
//    public ResponseEntity<Void> delete(@PathVariable Long id) {
//        ideaService.deleteIdea(id);
//        return ResponseEntity.noContent().build();
//    }

}