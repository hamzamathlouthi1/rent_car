package com.fmrent.reservations.controller;
import com.fmrent.reservations.dto.*; import com.fmrent.reservations.model.Reservation; import com.fmrent.reservations.service.ReservationService; import jakarta.validation.Valid; import java.time.LocalDate; import java.util.List; import org.springframework.http.*; import org.springframework.security.core.Authentication; import org.springframework.web.bind.annotation.*; import org.springframework.web.multipart.MultipartFile;
@RestController public class ReservationController {private final ReservationService service;public ReservationController(ReservationService service){this.service=service;}
 @PostMapping(value="/api/reservations",consumes=MediaType.MULTIPART_FORM_DATA_VALUE) ResponseEntity<Reservation> create(@Valid @RequestPart("data")CreateReservationRequest request,@RequestPart MultipartFile cinRecto,@RequestPart MultipartFile cinVerso,@RequestPart MultipartFile permis,Authentication auth){return ResponseEntity.status(HttpStatus.CREATED).body(service.create(request,cinRecto,cinVerso,permis,auth.getName()));}
 @GetMapping("/api/reservations/availability/{carId}") List<UnavailablePeriod> availability(@PathVariable Long carId,@RequestParam LocalDate from,@RequestParam LocalDate to){return service.availability(carId,from,to);}
 @GetMapping("/api/reservations/mine") List<Reservation> mine(Authentication auth){return service.mine(auth.getName());}
 @GetMapping("/api/admin/reservations") List<Reservation> all(){return service.all();}
 @PatchMapping("/api/admin/reservations/{id}/approve") Reservation approve(@PathVariable Long id){return service.approve(id);}
 @DeleteMapping("/api/admin/reservations/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) void delete(@PathVariable Long id){service.delete(id);}}
