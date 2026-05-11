package com.ideasTracker.project.ideas.controller;

import com.ideasTracker.project.ideas.dto.IdeaCreateRequest;
import com.ideasTracker.project.ideas.dto.IdeaResponse;
import com.ideasTracker.project.ideas.dto.IdeaUpdateRequest;
import com.ideasTracker.project.ideas.dto.IdeaUpdateRequestStatus;
import com.ideasTracker.project.ideas.services.IdeaService;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

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

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{initiativeId}/ideas")
    public ResponseEntity<List<IdeaResponse>> getIdeasForInitiative(
            @PathVariable Long initiativeId
    ) {
        return ResponseEntity.ok(ideaService.getIdeasByInitiative(initiativeId));
    }
    
    @PreAuthorize("hasRole('USER')")
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
        System.out.println("hello");
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
    //admin/reviewer only endpoint
    @PatchMapping("/{id}/status")
    public ResponseEntity<IdeaResponse> updateStatus(
            @PathVariable Long id,
            @RequestBody IdeaUpdateRequestStatus req
    ) {
        return ResponseEntity.ok(
                ideaService.updateStatus(id, req.getStatus())
        );
    }

    @PreAuthorize("hasRole('REVIEWER')")
    @PostMapping("/{id}/analyze")
    public ResponseEntity<IdeaResponse> analyzeIdea(@PathVariable Long id) {
        return ResponseEntity.ok(ideaService.analyzeIdea(id));
    }


    //excel parsing 
    @PostMapping("/api/ideas/parse-excel")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Map<String, String>> parseIdeaExcel(
            @RequestParam("file") MultipartFile file
    ) throws Exception {
        return ResponseEntity.ok(ideaService.parseIdeaExcel(file));
    }


//
//    @DeleteMapping("/{id}")
//    public ResponseEntity<Void> delete(@PathVariable Long id) {
//        ideaService.deleteIdea(id);
//        return ResponseEntity.noContent().build();
//    }

}