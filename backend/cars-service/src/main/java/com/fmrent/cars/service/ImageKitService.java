package com.fmrent.cars.service;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ImageKitService {
    private final RestClient client;

    public ImageKitService(@Value("${imagekit.private-key}") String key) {
        String basic = Base64.getEncoder()
                .encodeToString((key + ":").getBytes(StandardCharsets.UTF_8));
        this.client = RestClient.builder()
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Basic " + basic)
                .build();
    }

    public UploadResult upload(MultipartFile file) {
        try {
            String fileName = file.getOriginalFilename() == null ? "car.jpg" : file.getOriginalFilename();
            MediaType mediaType = MediaType.parseMediaType(
                    file.getContentType() == null ? MediaType.IMAGE_JPEG_VALUE : file.getContentType());
            HttpHeaders fileHeaders = new HttpHeaders();
            fileHeaders.setContentType(mediaType);
            ByteArrayResource resource = new ByteArrayResource(file.getBytes()) {
                @Override public String getFilename() { return fileName; }
            };

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("file", new HttpEntity<>(resource, fileHeaders));
            body.add("fileName", fileName);
            body.add("folder", "/fm-rent/cars");

            return client.post()
                    .uri("https://upload.imagekit.io/api/v1/files/upload")
                    .contentType(MediaType.MULTIPART_FORM_DATA)
                    .body(body)
                    .retrieve()
                    .body(UploadResult.class);
        } catch (Exception ex) {
            throw new IllegalStateException("Échec de l'upload ImageKit.", ex);
        }
    }

    public void delete(String fileId) {
        client.delete().uri("https://api.imagekit.io/v1/files/{id}", fileId)
                .retrieve().toBodilessEntity();
    }

    public record UploadResult(@JsonProperty("fileId") String fileId, String url) {}
}
