package com.ideasTracker.project.ideas.repository;

import com.ideasTracker.project.ideas.dto.IdeaResponse;
import com.ideasTracker.project.ideas.entity.Idea;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.ideasTracker.project.enums.Status;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface IdeaRepository extends JpaRepository<Idea,Long>{
        Page<Idea> findByStatus(Status status, Pageable pageable);

        Page<Idea> findByTitleContainingIgnoreCase(String keyword, Pageable pageable);
        Page<Idea> findByStatusAndTitleContainingIgnoreCase(Status status, String keyword, Pageable pageable);

        List<Idea> findByInitiativeId(Long initiativeId);
        
}
