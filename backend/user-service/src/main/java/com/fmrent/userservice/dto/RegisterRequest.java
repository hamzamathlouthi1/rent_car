package com.fmrent.userservice.dto;
import jakarta.validation.constraints.*;
public record RegisterRequest(@NotBlank @Size(max=50) String firstName, @NotBlank @Size(max=50) String lastName, @NotBlank @Email @Size(max=190) String email, @NotBlank @Size(min=8,max=72) String password) {}
