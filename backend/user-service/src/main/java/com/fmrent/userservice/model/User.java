package com.fmrent.userservice.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "users", uniqueConstraints = @UniqueConstraint(name = "uk_users_email", columnNames = "email"))
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(nullable = false, length = 50) private String firstName;
    @Column(nullable = false, length = 50) private String lastName;
    @Column(nullable = false, length = 190) private String email;
    @Column(nullable = false) private String password;
    @Column(name = "profile_picture", columnDefinition = "bytea") private byte[] profilePicture;
    @Column(name = "profile_picture_content_type", length = 50) private String profilePictureContentType;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 20) private Role role = Role.USER;
    @Column(nullable = false, updatable = false) private Instant createdAt = Instant.now();

    protected User() {}
    public User(String firstName, String lastName, String email, String password) { this.firstName = firstName; this.lastName = lastName; this.email = email; this.password = password; }
    public User(String firstName, String lastName, String email, String password, Role role) { this(firstName, lastName, email, password); this.role = role; }
    public Long getId() { return id; } public String getFirstName() { return firstName; } public String getLastName() { return lastName; }
    public String getEmail() { return email; } public String getPassword() { return password; } public Role getRole() { return role; } public Instant getCreatedAt() { return createdAt; }
    public byte[] getProfilePicture() { return profilePicture; } public String getProfilePictureContentType() { return profilePictureContentType; }
    public void changePassword(String password) { this.password = password; }
    public void setProfilePicture(byte[] picture, String contentType) { this.profilePicture = picture; this.profilePictureContentType = contentType; }
    public void clearProfilePicture() { this.profilePicture = null; this.profilePictureContentType = null; }
    public void configureAdmin(String firstName, String lastName, String password) { this.firstName = firstName; this.lastName = lastName; this.password = password; this.role = Role.ADMIN; }
}
