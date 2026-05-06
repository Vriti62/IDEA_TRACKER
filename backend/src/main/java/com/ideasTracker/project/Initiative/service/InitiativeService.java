package com.ideasTracker.project.Initiative.service;

import com.ideasTracker.project.Initiative.entity.Initiative;
import com.ideasTracker.project.Initiative.repository.InitiativeRepository;
import com.ideasTracker.project.enums.Role;
import com.ideasTracker.project.users.entity.User;
import com.ideasTracker.project.users.repository.UserRepository;
import org.springframework.stereotype.Service;


import java.util.List;
@Service
public class InitiativeService {

    private final InitiativeRepository initiativeRepository;
    private final UserRepository userRepository;

    public InitiativeService(InitiativeRepository initiativeRepository,
                             UserRepository userRepository) {
        this.initiativeRepository = initiativeRepository;
        this.userRepository = userRepository;
    }

    // admin creates initiative
    public Initiative createInitiative(String title, String description) {
        Initiative initiative = Initiative.builder()
                .title(title)
                .description(description)
                .build();

        return initiativeRepository.save(initiative);
    }

    // admin assigns reviewers
    public Initiative assignReviewers(Long initiativeId, List<Long> reviewerIds) {

        Initiative initiative = initiativeRepository.findById(initiativeId)
                .orElseThrow(() -> new RuntimeException("Not found"));

        List<User> reviewers = userRepository.findAllById(reviewerIds);

        // filter only reviewers
        reviewers = reviewers.stream()
                .filter(u -> u.getRole() == Role.REVIEWER)
                .toList();

        initiative.setReviewers(reviewers);

        return initiativeRepository.save(initiative);
    }

    // reviewer view their initiatives
    public List<Initiative> getByReviewer(Long userId) {
        return initiativeRepository.findAll().stream()
                .filter(i -> i.getReviewers().stream()
                        .anyMatch(r -> r.getId().equals(userId)))
                .toList();
    }
}