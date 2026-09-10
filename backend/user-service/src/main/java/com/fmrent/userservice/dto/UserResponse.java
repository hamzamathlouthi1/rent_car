package com.fmrent.userservice.dto;
import com.fmrent.userservice.model.*;
import java.time.Instant;
public record UserResponse(Long id, String firstName, String lastName, String email, Role role, Instant createdAt) { public static UserResponse from(User user) { return new UserResponse(user.getId(), user.getFirstName(), user.getLastName(), user.getEmail(), user.getRole(), user.getCreatedAt()); } }
