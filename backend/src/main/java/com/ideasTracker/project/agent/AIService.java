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

    public String analyzeIdea(String ideaText) {

        try {
            String url = "https://api.groq.com/openai/v1/chat/completions";

            RestTemplate restTemplate = new RestTemplate();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(API_KEY);

            String prompt = "Analyze this idea:\n" + ideaText +
                    "\nGive:\n1. Summary\n2. Score out of 10\n3. One improvement";

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
            System.out.println("🔥 AI ERROR START 🔥");
            e.printStackTrace();
            System.out.println("🔥 AI ERROR END 🔥");

            return "AI ERROR: " + e.getMessage();
        }
    }
}