package com.fmrent.userservice.service;

import com.fmrent.userservice.dto.*; import com.fmrent.userservice.model.User; import com.fmrent.userservice.repository.UserRepository; import com.fmrent.userservice.security.JwtService;
import java.util.Locale;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service; import org.springframework.transaction.annotation.Transactional;

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
    private String normalize(String email) { return email.trim().toLowerCase(Locale.ROOT); }
}
