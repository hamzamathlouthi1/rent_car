package com.fmrent.reservations.repository;
import com.fmrent.reservations.model.Reservation; import java.time.LocalDate; import java.util.List; import org.springframework.data.jpa.repository.*; import org.springframework.data.repository.query.Param;
public interface ReservationRepository extends JpaRepository<Reservation,Long>{List<Reservation> findByUserEmailOrderByCreatedAtDesc(String email);List<Reservation> findAllByOrderByCreatedAtDesc();
 @Query("select r from Reservation r where r.carId=:carId and r.status in (com.fmrent.reservations.model.ReservationStatus.PENDING,com.fmrent.reservations.model.ReservationStatus.APPROVED) and r.startDate <= :to and r.endDate >= :from") List<Reservation> conflicts(@Param("carId")Long carId,@Param("from")LocalDate from,@Param("to")LocalDate to);}
