package com.fmrent.userservice.config;

import com.fmrent.userservice.model.*;
import com.fmrent.userservice.repository.UserRepository;
import java.util.Locale;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class AdminInitializer implements ApplicationRunner {
    private final UserRepository users; private final PasswordEncoder encoder;
    private final String email, password, firstName, lastName;
    public AdminInitializer(UserRepository users, PasswordEncoder encoder, @Value("${app.admin.email}") String email,
            @Value("${app.admin.password}") String password, @Value("${app.admin.first-name}") String firstName,
            @Value("${app.admin.last-name}") String lastName) {
        this.users=users; this.encoder=encoder; this.email=email.trim().toLowerCase(Locale.ROOT); this.password=password; this.firstName=firstName.trim(); this.lastName=lastName.trim();
    }
    @Override @Transactional public void run(ApplicationArguments args) {
        if (password.length() < 12) throw new IllegalStateException("ADMIN_PASSWORD must contain at least 12 characters.");
        User admin=users.findByEmail(email).orElseGet(() -> new User(firstName,lastName,email,encoder.encode(password),Role.ADMIN));
        if (admin.getId()!=null) admin.configureAdmin(firstName,lastName,encoder.encode(password));
        users.save(admin);
    }
}
