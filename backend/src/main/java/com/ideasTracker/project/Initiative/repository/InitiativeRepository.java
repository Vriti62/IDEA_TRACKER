package com.ideasTracker.project.Initiative.repository;

import com.ideasTracker.project.Initiative.entity.Initiative;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InitiativeRepository extends JpaRepository<Initiative, Long> {
}