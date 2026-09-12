ALTER TABLE reservations
  ALTER COLUMN start_date TYPE TIMESTAMP(0) USING start_date::timestamp,
  ALTER COLUMN end_date TYPE TIMESTAMP(0) USING end_date::timestamp;
