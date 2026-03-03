package com.kodflix.auth.service;

import com.kodflix.auth.dto.*;
import com.kodflix.auth.entity.User;
import com.kodflix.auth.repository.UserRepository;
import com.kodflix.auth.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @Transactional
    public AuthResponse signUp(SignUpRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }
        if (userRepository.existsByUserId(req.getUserId())) {
            throw new IllegalArgumentException("User ID already taken");
        }
        if (!req.getPassword().equals(req.getConfirmPassword())) {
            throw new IllegalArgumentException("Passwords do not match");
        }
        User user = new User();
        user.setUserId(req.getUserId());
        user.setUsername(req.getUsername());
        user.setEmail(req.getEmail().trim().toLowerCase());
        user.setPhoneNumber(req.getPhoneNumber() != null ? req.getPhoneNumber().trim() : null);
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setRole("ROLE_USER");
        user = userRepository.save(user);
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
        return new AuthResponse(token, toUserResponse(user));
    }

    public AuthResponse login(LoginRequest req) {
        String input = req.getUsernameOrEmail().trim();
        User user = userRepository.findByEmail(input.toLowerCase())
                .or(() -> userRepository.findByUserId(input))
                .orElseThrow(() -> new IllegalArgumentException("Invalid username or password"));
        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid username or password");
        }
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
        return new AuthResponse(token, toUserResponse(user));
    }

    public UserResponse me(String username) {
        User user = userRepository.findByEmail(username)
                .or(() -> userRepository.findByUserId(username))
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return toUserResponse(user);
    }

    private static UserResponse toUserResponse(User u) {
        UserResponse r = new UserResponse();
        r.setId(u.getId());
        r.setUserId(u.getUserId());
        r.setUsername(u.getUsername());
        r.setEmail(u.getEmail());
        r.setPhoneNumber(u.getPhoneNumber());
        r.setRole(u.getRole());
        r.setCreatedAt(u.getCreatedAt());
        return r;
    }
}
