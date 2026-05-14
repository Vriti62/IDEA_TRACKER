package com.ideasTracker.project.ideas.services;

import com.ideasTracker.project.Initiative.entity.Initiative;
import com.ideasTracker.project.Initiative.repository.InitiativeRepository;
import com.ideasTracker.project.agent.AIService;
import com.ideasTracker.project.enums.Status;
import com.ideasTracker.project.ideas.dto.IdeaCreateRequest;
import com.ideasTracker.project.ideas.dto.IdeaUpdateRequest;
import com.ideasTracker.project.ideas.dto.IdeaResponse;
import com.ideasTracker.project.ideas.entity.Idea;
import com.ideasTracker.project.ideas.repository.IdeaRepository;
import com.ideasTracker.project.users.entity.User;
import com.ideasTracker.project.users.repository.UserRepository;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.util.*;

@Service
public class IdeaService {

    private final IdeaRepository ideaRepository;
    private final AIService aiService;
    private final InitiativeRepository initiativeRepository;
    private final UserRepository userRepository;

    public IdeaService(IdeaRepository ideaRepository,
                       AIService aiService,
                       InitiativeRepository initiativeRepository,
                       UserRepository userRepository) {
        this.ideaRepository = ideaRepository;
        this.aiService = aiService;
        this.initiativeRepository = initiativeRepository;
        this.userRepository = userRepository;
    }

    public IdeaResponse createIdea(IdeaCreateRequest req, User loggedInUser) {
        Initiative initiative = initiativeRepository.findById(req.getInitiativeId())
                .orElseThrow(() -> new RuntimeException("Initiative not found"));

        Idea idea = new Idea();
        idea.setTitle(req.getTitle());
        idea.setProblemStatement(req.getProblemStatement());
        idea.setPotentialSolution(req.getPotentialSolution());
        idea.setStatus(Status.OPEN);

        idea.setCreatedBy(loggedInUser);
        idea.setInitiative(initiative);

        Idea saved = ideaRepository.save(idea);
        return IdeaResponse.from(saved);
    }

    @Transactional(readOnly = true)
    public Page<IdeaResponse> getAllIdeas(Status status, String keyword, Pageable pageable) {
        if (status != null && keyword != null) {
            return ideaRepository
                    .findByStatusAndTitleContainingIgnoreCase(status, keyword, pageable)
                    .map(IdeaResponse::from);
        }
        if (status != null) {
            return ideaRepository
                    .findByStatus(status, pageable)
                    .map(IdeaResponse::from);
        }
        if (keyword != null) {
            return ideaRepository
                    .findByTitleContainingIgnoreCase(keyword, pageable)
                    .map(IdeaResponse::from);
        }
        return ideaRepository.findAll(pageable).map(IdeaResponse::from);
    }

    public IdeaResponse updateIdea(Long id, IdeaUpdateRequest req) {
        Idea idea = ideaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Idea not found"));

        if (req.getTitle() != null) idea.setTitle(req.getTitle());
        if (req.getProblemStatement() != null) idea.setProblemStatement(req.getProblemStatement());
        if (req.getPotentialSolution() != null) idea.setPotentialSolution(req.getPotentialSolution());

        return IdeaResponse.from(ideaRepository.save(idea));
    }

    public IdeaResponse updateStatus(Long id, Status status) {
        Idea idea = ideaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Idea not found"));

        idea.setStatus(status);
        return IdeaResponse.from(ideaRepository.save(idea));
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
            throw new RuntimeException("AI analysis failed", e);
        }

        return IdeaResponse.from(ideaRepository.save(idea));
    }

    public List<IdeaResponse> getIdeasByInitiative(Long initiativeId) {
        return ideaRepository.findByInitiativeId(initiativeId)
                .stream()
                .map(IdeaResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public IdeaResponse getIdeaById(Long id) {
        Idea idea = ideaRepository.findByIdWithRelations(id)
                .orElseThrow(() -> new RuntimeException("Idea not found"));
        return IdeaResponse.from(idea);
    }

    /**
     * columns:
     * A: initiativeId (required)
     * B: title (required)
     * C: problemStatement (required)
     * D: potentialSolution (optional)
     * E. owner (createdBy)
     */
    public Map<String, Object> parseAndCreateIdeasExcel(MultipartFile file, User loggedInUser) {
        int created = 0;
        int skipped = 0;
        List<String> errors = new ArrayList<>();

        DataFormatter formatter = new DataFormatter();

        try (InputStream is = file.getInputStream();
             Workbook workbook = new XSSFWorkbook(is)) {

            Sheet sheet = workbook.getSheetAt(0);

            // start from row 1 (skip header row 0)
            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) { skipped++; continue; }

                String initiativeIdStr = formatter.formatCellValue(row.getCell(0)).trim();
                String title = formatter.formatCellValue(row.getCell(1)).trim();
                String problem = formatter.formatCellValue(row.getCell(2)).trim();
                String solution = formatter.formatCellValue(row.getCell(3)).trim();
                String ownerUsername = formatter.formatCellValue(row.getCell(4)).trim();

                if (initiativeIdStr.isEmpty() || title.isEmpty() || problem.isEmpty() || ownerUsername.isEmpty()) {
                    skipped++;
                    continue;
                }

                Long initiativeId;
                try {
                    initiativeId = Long.parseLong(initiativeIdStr);
                } catch (Exception ex) {
                    errors.add("Row " + (i + 1) + ": invalid initiativeId '" + initiativeIdStr + "'");
                    skipped++;
                    continue;
                }

                Initiative initiative = initiativeRepository.findById(initiativeId).orElse(null);
                if (initiative == null) {
                    errors.add("Row " + (i + 1) + ": initiative not found for id=" + initiativeId);
                    skipped++;
                    continue;
                }

                User owner = userRepository.findByUsername(ownerUsername).orElse(null);
                if (owner == null) {
                    errors.add("Row " + (i + 1) + ": owner not found for username=" + ownerUsername);
                    skipped++;
                    continue;
                }

                Idea idea = new Idea();
                idea.setInitiative(initiative);
                idea.setCreatedBy(loggedInUser);
                idea.setStatus(Status.OPEN);
                idea.setTitle(title);
                idea.setProblemStatement(problem);
                idea.setPotentialSolution(solution.isEmpty() ? null : solution);
                idea.setCreatedBy(owner);

                ideaRepository.save(idea);
                created++;
            }

        } catch (Exception e) {
            throw new RuntimeException("Failed to read Excel and create ideas", e);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("created", created);
        result.put("skipped", skipped);
        result.put("errors", errors);
        return result;
    }


    //export excel 
    
public ByteArrayResource exportIdeasByInitiativeExcel(Long initiativeId) {
    List<Idea> ideas = ideaRepository.findByInitiativeId(initiativeId);

    try (Workbook workbook = new XSSFWorkbook();
         ByteArrayOutputStream out = new ByteArrayOutputStream()) {

        Sheet sheet = workbook.createSheet("Ideas");

        // Header row
        Row header = sheet.createRow(0);
        String[] cols = {
            "Idea ID", "Title", "Problem Statement", "Potential Solution",
            "Status", "Created By", "Initiative ID", "Initiative Title", "Created At"
        };

        for (int i = 0; i < cols.length; i++) {
            header.createCell(i).setCellValue(cols[i]);
        }

        // Data rows
        int rowIdx = 1;
        for (Idea idea : ideas) {
            Row row = sheet.createRow(rowIdx++);

            row.createCell(0).setCellValue(idea.getId());
            row.createCell(1).setCellValue(idea.getTitle());
            row.createCell(2).setCellValue(idea.getProblemStatement());
            row.createCell(3).setCellValue(
                idea.getPotentialSolution() != null ? idea.getPotentialSolution() : ""
            );
            row.createCell(4).setCellValue(idea.getStatus().name());
            row.createCell(5).setCellValue(
                idea.getCreatedBy() != null ? idea.getCreatedBy().getUsername() : "Anonymous"
            );
            row.createCell(6).setCellValue(idea.getInitiative().getId());
            row.createCell(7).setCellValue(idea.getInitiative().getTitle());
            row.createCell(8).setCellValue(
                idea.getCreatedAt() != null ? idea.getCreatedAt().toString() : ""
            );
        }

        workbook.write(out);
        return new ByteArrayResource(out.toByteArray());

    } catch (Exception e) {
        throw new RuntimeException("Failed to export ideas Excel", e);
    }
}

}