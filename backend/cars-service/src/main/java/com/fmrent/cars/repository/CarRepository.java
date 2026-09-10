package com.fmrent.cars.repository; import com.fmrent.cars.model.Car; import java.util.List; import org.springframework.data.jpa.repository.JpaRepository;
public interface CarRepository extends JpaRepository<Car,Long>{List<Car> findAllByOrderByCreatedAtDesc();}
