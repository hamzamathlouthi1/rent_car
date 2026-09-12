package com.fmrent.userservice.service;

import com.fmrent.userservice.dto.*; import com.fmrent.userservice.model.User; import com.fmrent.userservice.repository.UserRepository; import com.fmrent.userservice.security.JwtService;
import java.util.Locale;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service; import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
public class AuthService {
    private final UserRepository users; private final PasswordEncoder passwords; private final JwtService jwt;
    public AuthService(UserRepository users, PasswordEncoder passwords, JwtService jwt) { this.users = users; this.passwords = passwords; this.jwt = jwt; }
    @Transactional public AuthResponse register(RegisterRequest request) {
        String email = normalize(request.email()); if (users.existsByEmail(email)) throw new IllegalStateException("Un compte existe déjà avec cette adresse e-mail.");
        User user = users.save(new User(request.firstName().trim(), request.lastName().trim(), email, passwords.encode(request.password())));
        return new AuthResponse(jwt.generate(email, user.getRole()), UserResponse.from(user));
    }
    @Transactional(readOnly=true) public AuthResponse login(LoginRequest request) {
        String email = normalize(request.email()); User user = users.findByEmail(email).orElseThrow(() -> new BadCredentialsException("Identifiants incorrects."));
        if (!passwords.matches(request.password(), user.getPassword())) throw new BadCredentialsException("Identifiants incorrects.");
        return new AuthResponse(jwt.generate(email, user.getRole()), UserResponse.from(user));
    }
    @Transactional(readOnly=true) public UserResponse current(String email) { return users.findByEmail(email).map(UserResponse::from).orElseThrow(); }
    @Transactional public void changePassword(String email, ChangePasswordRequest request) { User user = find(email); if (!passwords.matches(request.currentPassword(), user.getPassword())) throw new BadCredentialsException("Mot de passe actuel incorrect."); user.changePassword(passwords.encode(request.newPassword())); }
    @Transactional public void saveProfilePicture(String email, MultipartFile file) { if (file == null || file.isEmpty()) throw new IllegalArgumentException("Sélectionnez une image."); String type = file.getContentType(); if (!"image/jpeg".equals(type) && !"image/png".equals(type) && !"image/webp".equals(type)) throw new IllegalArgumentException("Utilisez une image JPG, PNG ou WebP."); if (file.getSize() > 2 * 1024 * 1024) throw new IllegalArgumentException("L'image doit faire moins de 2 Mo."); try { find(email).setProfilePicture(file.getBytes(), type); } catch (java.io.IOException ex) { throw new IllegalStateException("Impossible de sauvegarder l'image.", ex); } }
    @Transactional public void deleteProfilePicture(String email) { find(email).clearProfilePicture(); }
    @Transactional(readOnly=true) public org.springframework.http.ResponseEntity<byte[]> profilePicture(String email) { User user = find(email); if (user.getProfilePicture() == null) return org.springframework.http.ResponseEntity.notFound().build(); return org.springframework.http.ResponseEntity.ok().contentType(org.springframework.http.MediaType.parseMediaType(user.getProfilePictureContentType())).body(user.getProfilePicture()); }
    private User find(String email) { return users.findByEmail(normalize(email)).orElseThrow(); }
    private String normalize(String email) { return email.trim().toLowerCase(Locale.ROOT); }
}
