package com.ideasTracker.project.agent;

//import lombok.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Value;

import java.util.Map;

@Service
public class AIService {

    @Value("${groq.api.key}")
    private String API_KEY;

    public String analyzeIdea(String title, String solution, String problem ) {

        try {
            String url = "https://api.groq.com/openai/v1/chat/completions";

            RestTemplate restTemplate = new RestTemplate();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(API_KEY);

            String prompt =
                    "You are an AI assistant helping reviewers evaluate innovation ideas in an enterprise idea management system.\n\n" +
                            "Evaluate the following idea:\n\n" +
                            "Title: " + title + "\n" +
                            "Problem: " + problem + "\n" +
                            "Proposed Solution: " + solution + "\n\n" +
                            "Review the idea specifically on:\n" +
                            "1. Clarity of problem definition\n" +
                            "2. Feasibility of the solution\n" +
                            "3. Innovation and business value\n\n" +
                            "Return your response in this format:\n" +
                            "- Summary (2–3 lines)\n" +
                            "- Score out of 10 with justification\n" +
                            "- One concrete, actionable improvement";;

            Map<String, Object> requestBody = Map.of(
                    "model", "llama-3.1-8b-instant",
                    "messages", java.util.List.of(
                            Map.of(
                                    "role", "user",
                                    "content", prompt
                            )
                    )
            );

            HttpEntity<Map<String, Object>> request =
                    new HttpEntity<>(requestBody, headers);

            ResponseEntity<Map> response =
                    restTemplate.postForEntity(url, request, Map.class);

            if (response.getBody() == null) {
                return "AI returned empty response";
            }

            Map choice = (Map) ((java.util.List) response.getBody().get("choices")).get(0);
            Map message = (Map) choice.get("message");

            return message.get("content").toString();

        } catch (Exception e) {
            System.out.println("AI ERROR START");
            e.printStackTrace();
            System.out.println("AI ERROR END");

            return "AI ERROR: " + e.getMessage();
        }
    }
}