package com.ideasTracker.project.Initiative.service;

import com.ideasTracker.project.Initiative.entity.Initiative;
import com.ideasTracker.project.Initiative.repository.InitiativeRepository;
import com.ideasTracker.project.enums.Role;
import com.ideasTracker.project.ideas.dto.IdeaResponse;
import com.ideasTracker.project.ideas.services.IdeaService;
import com.ideasTracker.project.users.entity.User;
import com.ideasTracker.project.users.repository.UserRepository;

import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;


import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.FormulaEvaluator;

import java.io.InputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class InitiativeService {

    private final InitiativeRepository initiativeRepository;
    private final UserRepository userRepository;

    public InitiativeService(
            InitiativeRepository initiativeRepository,
            UserRepository userRepository
    ) {
        this.initiativeRepository = initiativeRepository;
        this.userRepository = userRepository;
    }

    //  ADMIN: create initiative
    public Initiative createInitiative(String title, String description) {
        Initiative initiative = Initiative.builder()
                .title(title)
                .description(description)
                .build();

        return initiativeRepository.save(initiative);
    }

    //  ADMIN: assign reviewers
    public Initiative assignReviewers(Long initiativeId, List<Long> reviewerIds) {

        Initiative initiative = initiativeRepository.findById(initiativeId)
                .orElseThrow(() -> new RuntimeException("Initiative not found"));

        List<User> reviewers = userRepository.findAllById(reviewerIds)
                .stream()
                .filter(u -> u.getRole() == Role.REVIEWER)
                .toList();

        initiative.setReviewers(reviewers);
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


public void parseAndCreateInitiatives(MultipartFile file) {

    DataFormatter formatter = new DataFormatter();

    try (InputStream is = file.getInputStream();
         Workbook workbook = new XSSFWorkbook(is)) {

        Sheet sheet = workbook.getSheetAt(0);

        // Helps if the Excel has formulas
        FormulaEvaluator evaluator = workbook.getCreationHelper().createFormulaEvaluator();

        for (int i = 1; i <= sheet.getLastRowNum(); i++) { // skip header row 0
            Row row = sheet.getRow(i);
            if (row == null) continue;

            Cell titleCell = row.getCell(0);
            Cell descCell = row.getCell(1);

            
            String title = titleCell == null ? "" : formatter.formatCellValue(titleCell, evaluator).trim();
            String description = descCell == null ? "" : formatter.formatCellValue(descCell, evaluator).trim();

            if (title.isEmpty()) continue;

            Initiative initiative = new Initiative();
            initiative.setTitle(title);
            initiative.setDescription(description);

            initiativeRepository.save(initiative);
        }

    } catch (Exception e) {
        throw new RuntimeException("Failed to read Excel and create initiatives", e);
    }
}
}





