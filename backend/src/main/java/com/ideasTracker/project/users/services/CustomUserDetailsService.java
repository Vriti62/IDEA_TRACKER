package com.ideasTracker.project.users.services;

import com.ideasTracker.project.users.entity.User;
import com.ideasTracker.project.users.repository.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

@Override
public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    System.out.println("AUTH lookup username = " + username);

    User user = userRepository.findByUsername(username)
        .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

    System.out.println("AUTH DB username = " + user.getUsername());

    System.out.println("AUTH DB hash = " + user.getPassword());
    System.out.println(
        "PASSWORD MATCHES = " +
        new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder()
        .matches("password", user.getPassword())
        );

    return new org.springframework.security.core.userdetails.User(
        user.getUsername(),
        user.getPassword(),
        List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
    );
}

}