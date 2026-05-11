package com.ideasTracker.project.Initiative.service;

import com.ideasTracker.project.Initiative.entity.Initiative;
import com.ideasTracker.project.Initiative.repository.InitiativeRepository;
import com.ideasTracker.project.ideas.mapper.*;
import com.ideasTracker.project.ideas.repository.IdeaRepository;
import com.ideasTracker.project.enums.Role;
import com.ideasTracker.project.ideas.dto.IdeaResponse;
import com.ideasTracker.project.ideas.services.IdeaService;
import com.ideasTracker.project.users.entity.User;
import com.ideasTracker.project.users.repository.UserRepository;
import com.ideasTracker.project.Initiative.service.InitiativeService;

import jakarta.transaction.Transactional;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

@Service
public class InitiativeService {

    private final InitiativeRepository initiativeRepository;
    private final UserRepository userRepository;
    private final IdeaRepository ideaRepository;

    public InitiativeService(
            InitiativeRepository initiativeRepository,
            UserRepository userRepository,
            IdeaRepository ideaRepository
    ) {
        this.initiativeRepository = initiativeRepository;
        this.userRepository = userRepository;
        this.ideaRepository = ideaRepository;
    }

    //  ADMIN: create initiative
    public Initiative createInitiative(String title, String description) {
        Initiative initiative = Initiative.builder()
                .title(title)
                .description(description)
                .build();

        return initiativeRepository.save(initiative);
    }

    @Transactional public Initiative assignReviewers(Long initiativeId, List<Long> reviewerIds) {

    Initiative initiative = initiativeRepository.findById(initiativeId)
        .orElseThrow(() -> new RuntimeException("Initiative not found"));

    List<User> reviewers = userRepository.findAllById(reviewerIds)
        .stream()
        .filter(u -> u.getRole() == Role.REVIEWER)
        .toList();

    if (initiative.getReviewers() == null) {
        initiative.setReviewers(new ArrayList<>());
    }

    initiative.getReviewers().clear();
    initiative.getReviewers().addAll(reviewers);

    return initiativeRepository.save(initiative);
}


    //  REVIEWER: view own initiatives
    public List<Initiative> getByReviewer(Long userId) {
        return initiativeRepository.findAll()
                .stream()
                .filter(i -> i.getReviewers()
                        .stream()
                        .anyMatch(r -> r.getId().equals(userId)))
                .toList();
    }

  
    public List<Initiative> getAllInitiatives() {
        return initiativeRepository.findAll();
    }

    public List<Initiative> getByReviewerUsername(String username) {
    User reviewer = userRepository.findByUsername(username)
        .orElseThrow(() -> new RuntimeException("User not found"));

    return initiativeRepository.findAll()
        .stream()
        .filter(i -> i.getReviewers()
            .stream()
            .anyMatch(r -> r.getId().equals(reviewer.getId())))
        .toList();
}
public List<IdeaResponse> getIdeasByInitiative(Long initiativeId) {
    return ideaRepository.findByInitiativeId(initiativeId)
            .stream()
            .map(IdeaResponse::from)
            .toList();
}



}