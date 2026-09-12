package com.fmrent.userservice.controller;
import com.fmrent.userservice.dto.*; import com.fmrent.userservice.service.AuthService; import jakarta.validation.Valid; import java.security.Principal;
import org.springframework.http.HttpStatus; import org.springframework.web.bind.annotation.*; import org.springframework.web.multipart.MultipartFile; import org.springframework.http.ResponseEntity;
@RestController @RequestMapping("/api/auth")
public class AuthController {
    private final AuthService auth; public AuthController(AuthService auth) { this.auth = auth; }
    @PostMapping("/register") @ResponseStatus(HttpStatus.CREATED) public AuthResponse register(@Valid @RequestBody RegisterRequest request) { return auth.register(request); }
    @PostMapping("/login") public AuthResponse login(@Valid @RequestBody LoginRequest request) { return auth.login(request); }
    @GetMapping("/me") public UserResponse me(Principal principal) { return auth.current(principal.getName()); }
    @PutMapping("/me/password") @ResponseStatus(HttpStatus.NO_CONTENT) public void changePassword(Principal principal, @Valid @RequestBody ChangePasswordRequest request) { auth.changePassword(principal.getName(), request); }
    @PutMapping("/me/profile-picture") @ResponseStatus(HttpStatus.NO_CONTENT) public void profilePicture(Principal principal, @RequestPart("file") MultipartFile file) { auth.saveProfilePicture(principal.getName(), file); }
    @DeleteMapping("/me/profile-picture") @ResponseStatus(HttpStatus.NO_CONTENT) public void deleteProfilePicture(Principal principal) { auth.deleteProfilePicture(principal.getName()); }
    @GetMapping("/me/profile-picture") public ResponseEntity<byte[]> getProfilePicture(Principal principal) { return auth.profilePicture(principal.getName()); }
}
