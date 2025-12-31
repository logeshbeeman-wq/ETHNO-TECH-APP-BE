-- Database Migration for Training Tables
-- This file creates the center_training table for managing training data

-- Center Training Table
DROP TABLE IF EXISTS center_training;
CREATE TABLE IF NOT EXISTS center_training (
  id INT AUTO_INCREMENT PRIMARY KEY,
  center_id INT,
  start_training_date DATE NOT NULL,
  end_training_date DATE NOT NULL,
  center VARCHAR(100) NOT NULL,
  batch VARCHAR(100) NOT NULL,
  departments VARCHAR(255) NOT NULL,
  year_sem VARCHAR(50) NOT NULL,
  strength INT NOT NULL,
  technology VARCHAR(255) NOT NULL,
  lab_no VARCHAR(100) NOT NULL,
  trainer_name VARCHAR(255) NOT NULL,
  trainer_type VARCHAR(100) NOT NULL,
  certification VARCHAR(255) NOT NULL,
  training_status VARCHAR(50) NOT NULL,
  examination_status VARCHAR(50) NOT NULL,
  employee_id VARCHAR(100) NOT NULL,
  fdp_received VARCHAR(255) NOT NULL,
  fdp_taken VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_center_id (center_id),
  INDEX idx_batch (batch),
  INDEX idx_departments (departments),
  INDEX idx_technology (technology),
  INDEX idx_employee_id (employee_id),
  INDEX idx_training_dates (start_training_date, end_training_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample data for Center Training
INSERT INTO center_training 
  (center_id, start_training_date, end_training_date, center, batch, departments, year_sem, 
   strength, technology, lab_no, trainer_name, trainer_type, certification, 
   training_status, examination_status, employee_id, fdp_received, fdp_taken) 
VALUES 
  (1, '2024-01-10', '2024-02-10', 'NCK University', '2019-2023', 'Computer Science', '3rd Year - Sem 5', 
   35, 'Machine Learning', 'Lab 101', 'Dr. Robert Brown', 'Internal-contract', 'ML Certified', 
   'Y', 'Completed', 'EMP003', 'AI and ML Workshop', 'Cloud Technologies'),
  (2, '2024-02-05', '2024-03-05', 'Bangalore Center', '2023-2024', 'Information Technology', '2nd Year - Sem 4', 
   40, 'Cloud Computing', 'Lab 202', 'Sarah Johnson', 'Permanent', 'Azure Certified', 
   'Y', 'In Progress', 'EMP004', 'Cloud Technologies', 'Cloud Technologies'),
   (3, '2024-02-05', '2024-03-05', 'Mumbai Center', '2024-2025', 'Information Technology', '2nd Year - Sem 4', 
   40, 'Cloud Computing', 'Lab 202', 'Sarah Johnson', 'Permanent', 'Azure Certified', 
   'Y', 'In Progress', 'EMP004', 'Cloud Technologies', 'Cloud Technologies');
