CREATE TABLE car_images (
  id BIGINT NOT NULL AUTO_INCREMENT,
  car_id BIGINT NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  image_file_id VARCHAR(100) NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  CONSTRAINT pk_car_images PRIMARY KEY (id),
  CONSTRAINT fk_car_images_car FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO car_images (car_id, image_url, image_file_id, display_order)
SELECT id, image_url, image_file_id, 0 FROM cars;
