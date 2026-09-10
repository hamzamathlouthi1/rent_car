ALTER TABLE reservations
  ADD COLUMN cin_recto_file_id VARCHAR(120) NOT NULL,
  ADD COLUMN cin_verso_file_id VARCHAR(120) NOT NULL,
  ADD COLUMN permis_file_id VARCHAR(120) NOT NULL;
