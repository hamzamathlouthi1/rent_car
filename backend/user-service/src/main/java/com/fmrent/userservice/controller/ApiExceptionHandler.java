package com.fmrent.userservice.controller;
import java.util.Map; import org.springframework.http.*; import org.springframework.security.authentication.BadCredentialsException; import org.springframework.web.bind.MethodArgumentNotValidException; import org.springframework.web.bind.annotation.*;
@RestControllerAdvice
public class ApiExceptionHandler {
    @ExceptionHandler(IllegalStateException.class) ResponseEntity<Map<String,String>> conflict(IllegalStateException ex) { return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", ex.getMessage())); }
    @ExceptionHandler(BadCredentialsException.class) ResponseEntity<Map<String,String>> unauthorized(BadCredentialsException ex) { return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", ex.getMessage())); }
    @ExceptionHandler(MethodArgumentNotValidException.class) ResponseEntity<Map<String,String>> invalid(MethodArgumentNotValidException ex) { String message = ex.getBindingResult().getFieldErrors().stream().findFirst().map(e -> e.getField()+" : "+e.getDefaultMessage()).orElse("Données invalides."); return ResponseEntity.badRequest().body(Map.of("message", message)); }
    @ExceptionHandler(IllegalArgumentException.class) ResponseEntity<Map<String,String>> badRequest(IllegalArgumentException ex) { return ResponseEntity.badRequest().body(Map.of("message", ex.getMessage())); }
}
