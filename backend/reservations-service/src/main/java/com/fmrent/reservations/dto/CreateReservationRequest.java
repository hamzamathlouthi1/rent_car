package com.fmrent.reservations.dto;
import jakarta.validation.constraints.*; import java.time.LocalDate;
public record CreateReservationRequest(@NotNull Long carId,@NotBlank @Pattern(regexp="^[+0-9 ()-]{8,25}$") String phone,@NotBlank @Size(max=150) String pickupLocation,@NotNull @FutureOrPresent LocalDate startDate,@NotNull LocalDate endDate){}
