package com.ideasTracker.project.ideas.services;

import com.ideasTracker.project.Initiative.entity.Initiative;
import com.ideasTracker.project.Initiative.repository.InitiativeRepository;
import com.ideasTracker.project.agent.AIService;
import com.ideasTracker.project.enums.Status;
import com.ideasTracker.project.ideas.dto.IdeaCreateRequest;
import com.ideasTracker.project.ideas.dto.IdeaUpdateRequest;
import com.ideasTracker.project.ideas.dto.IdeaResponse;
import com.ideasTracker.project.ideas.entity.Idea;
import com.ideasTracker.project.ideas.mapper.IdeaMapper;
import com.ideasTracker.project.ideas.repository.IdeaRepository;
import com.ideasTracker.project.users.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Service
public class IdeaService {

    private final IdeaRepository ideaRepository;
    private final UserRepository userRepository;
    private final IdeaMapper mapper;
    private final AIService aiService;
    private final InitiativeRepository initiativeRepository;

    public IdeaService(IdeaRepository ideaRepository, UserRepository userRepository, IdeaMapper mapper,  AIService aiService, InitiativeRepository initiativeRepository) {
        this.ideaRepository = ideaRepository;
        this.userRepository = userRepository;
        this.mapper = mapper;
        this.aiService = aiService;
        this.initiativeRepository = initiativeRepository;
    }

    public IdeaResponse createIdea(IdeaCreateRequest req) {

        Initiative initiative = initiativeRepository.findById(req.getInitiativeId())
            .orElseThrow(() -> new RuntimeException("Initiative not found"));

        Idea idea = mapper.toEntity(req);
        idea.setInitiative(initiative);
        idea.setStatus(Status.OPEN);

        return mapper.toResponse(
            ideaRepository.save(idea)
        );
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

    //update done by reviewer/admin only to update the status!
    public IdeaResponse updateStatus(Long id, Status status) {
        Idea idea = ideaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Idea not found"));

        idea.setStatus(status);

        return mapper.toResponse(ideaRepository.save(idea));
    }
    public void deleteIdea(Long id) {
        ideaRepository.deleteById(id);
    }

    public IdeaResponse analyzeIdea(Long id) {

        Idea idea = ideaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Idea not found"));

        try {
            String aiResult = aiService.analyzeIdea(
                    idea.getTitle(),
                    idea.getPotentialSolution(),  
                    idea.getProblemStatement()
            );

            idea.setAiSummary(aiResult);

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("AI analysis failed", e);
        }

        return mapper.toResponse(ideaRepository.save(idea));
    }

    public List<IdeaResponse> getIdeasByInitiative(Long initiativeId) {
        return ideaRepository.findByInitiativeId(initiativeId)
                .stream()
                .map(mapper::toResponse)
                .toList();
    }
}