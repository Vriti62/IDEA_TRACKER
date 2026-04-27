package com.ideasTracker.project.ideas.services;

import com.ideasTracker.project.enums.Status;
import com.ideasTracker.project.ideas.dto.IdeaCreateRequest;
import com.ideasTracker.project.ideas.dto.IdeaUpdateRequest;
import com.ideasTracker.project.ideas.dto.IdeaResponse;
import com.ideasTracker.project.ideas.entity.Idea;
import com.ideasTracker.project.ideas.mapper.IdeaMapper;
import com.ideasTracker.project.ideas.repository.IdeaRepository;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Service
public class IdeaService {

    private final IdeaRepository ideaRepository;
    private final IdeaMapper mapper;

    public IdeaService(IdeaRepository ideaRepository, IdeaMapper mapper) {
        this.ideaRepository = ideaRepository;
        this.mapper = mapper;
    }

    public IdeaResponse createIdea(IdeaCreateRequest req) {
        Idea idea = mapper.toEntity(req);
        idea.setStatus(Status.OPEN);
        return mapper.toResponse(ideaRepository.save(idea));
    }

    public Page<IdeaResponse> getAllIdeas(Status status, String keyword, Pageable pageable) {

        if (status != null && keyword != null) {
            return ideaRepository
                    .findByStatusAndTitleContainingIgnoreCase(status, keyword, pageable)
                    .map(mapper::toResponse);
        }

        if (status != null) {
            return ideaRepository
                    .findByStatus(status, pageable)
                    .map(mapper::toResponse);
        }

        if (keyword != null) {
            return ideaRepository
                    .findByTitleContainingIgnoreCase(keyword, pageable)
                    .map(mapper::toResponse);
        }

        return ideaRepository.findAll(pageable)
                .map(mapper::toResponse);
    }

    public IdeaResponse getIdeaById(Long id) {
        Idea idea = ideaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Idea not found"));
        return mapper.toResponse(idea);
    }

    public IdeaResponse updateIdea(Long id, IdeaUpdateRequest req) {
        Idea idea = ideaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Idea not found"));

        if (req.getTitle() != null) {
            idea.setTitle(req.getTitle());
        }

        if (req.getProblemStatement() != null) {
            idea.setProblemStatement(req.getProblemStatement());
        }

        if (req.getPotentialSolution() != null) {
            idea.setPotentialSolution(req.getPotentialSolution());
        }


        return mapper.toResponse(ideaRepository.save(idea));
    }

    //update done by system/admin only to update the status!
    public IdeaResponse updateStatus(Long id, Status status) {
        Idea idea = ideaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Idea not found"));

        idea.setStatus(status);

        return mapper.toResponse(ideaRepository.save(idea));
    }
    public void deleteIdea(Long id) {
        ideaRepository.deleteById(id);
    }
}