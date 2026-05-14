package com.ideasTracker.project.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(Customizer.withDefaults())
.authorizeHttpRequests(auth -> auth
    // Public
    .requestMatchers("/api/auth/**").permitAll()

    // Ideas
    .requestMatchers(HttpMethod.GET, "/api/ideas/**").permitAll()
    .requestMatchers(HttpMethod.POST, "/api/ideas").hasAnyRole("USER", "ADMIN")
    .requestMatchers(HttpMethod.POST, "/api/ideas/parse-excel").hasAnyRole("USER", "ADMIN")
    .requestMatchers(HttpMethod.GET, "/api/ideas/*/export-excel").hasAnyRole("USER","REVIEWER","ADMIN")
    .requestMatchers(HttpMethod.POST, "/api/ideas/*/analyze").hasRole("REVIEWER")
    .requestMatchers(HttpMethod.PATCH, "/api/ideas/**").hasRole("ADMIN")

    // Initiatives
    .requestMatchers(HttpMethod.GET, "/api/initiatives/**").hasAnyRole("USER","REVIEWER","ADMIN")
    .requestMatchers(HttpMethod.POST, "/api/initiatives/**").hasRole("ADMIN")
    .requestMatchers(HttpMethod.PATCH, "/api/initiatives/**").hasRole("ADMIN")

    .anyRequest().authenticated()

)




            .httpBasic(Customizer.withDefaults());

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            HttpSecurity http,
            UserDetailsService userDetailsService
    ) throws Exception {
        AuthenticationManagerBuilder builder =
                http.getSharedObject(AuthenticationManagerBuilder.class);

        builder
            .userDetailsService(userDetailsService)
            .passwordEncoder(passwordEncoder());

        return builder.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
