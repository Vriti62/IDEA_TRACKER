package com.ideasTracker.project.Initiative.repository;

import com.ideasTracker.project.Initiative.entity.Initiative;
import com.ideasTracker.project.ideas.entity.Idea;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface InitiativeRepository extends JpaRepository<Initiative, Long> {
    public interface IdeaRepository extends JpaRepository<Idea, Long> {

    List<Idea> findByInitiativeId(Long initiativeId);
}
}