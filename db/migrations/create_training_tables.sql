-- Database Migration for Training Tables
-- This file creates the necessary tables for Center Training and Batch Training

-- Table 1: Center Training (Tab 1)
CREATE TABLE IF NOT EXISTS center_training (
  id INT AUTO_INCREMENT PRIMARY KEY,
  start_training_date DATE NOT NULL,
  end_training_date DATE NOT NULL,
  center VARCHAR(255) NOT NULL,
  strength INT NOT NULL,
  technology VARCHAR(255) NOT NULL,
  trainer_name VARCHAR(255) NOT NULL,
  trainer_type VARCHAR(100) NOT NULL,
  certification VARCHAR(255) NOT NULL,
  training_status VARCHAR(50) NOT NULL,
  examination_status VARCHAR(50) NOT NULL,
  employee_id VARCHAR(100) NOT NULL,
  fdp VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_center (center),
  INDEX idx_technology (technology),
  INDEX idx_employee_id (employee_id),
  INDEX idx_training_dates (start_training_date, end_training_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 2: Batch Training (Tab 2)
CREATE TABLE IF NOT EXISTS batch_training (
  id INT AUTO_INCREMENT PRIMARY KEY,
  start_training_date DATE NOT NULL,
  end_training_date DATE NOT NULL,
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
  fdp VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_batch (batch),
  INDEX idx_departments (departments),
  INDEX idx_technology (technology),
  INDEX idx_employee_id (employee_id),
  INDEX idx_training_dates (start_training_date, end_training_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample data for Center Training
INSERT INTO center_training 
  (start_training_date, end_training_date, center, strength, technology, 
   trainer_name, trainer_type, certification, training_status, 
   examination_status, employee_id, fdp) 
VALUES 
  ('2024-01-15', '2024-02-15', 'Main Campus', 30, 'React.js', 
   'John Doe', 'Internal', 'AWS Certified', 'Y', 
   'Completed', 'EMP001', 'Advanced Web Development'),
  ('2024-02-01', '2024-03-01', 'Branch Campus', 25, 'Python', 
   'Jane Smith', 'External', 'Python Expert', 'Y', 
   'Pending', 'EMP002', 'Data Science Fundamentals');

-- Sample data for Batch Training
INSERT INTO batch_training 
  (start_training_date, end_training_date, batch, departments, year_sem, 
   strength, technology, lab_no, trainer_name, trainer_type, certification, 
   training_status, examination_status, employee_id, fdp) 
VALUES 
  ('2024-01-10', '2024-02-10', 'Batch A', 'Computer Science', '3rd Year - Sem 5', 
   35, 'Machine Learning', 'Lab 101', 'Dr. Robert Brown', 'Internal', 'ML Certified', 
   'Y', 'Completed', 'EMP003', 'AI and ML Workshop'),
  ('2024-02-05', '2024-03-05', 'Batch B', 'Information Technology', '2nd Year - Sem 4', 
   40, 'Cloud Computing', 'Lab 202', 'Sarah Johnson', 'External', 'Azure Certified', 
   'Y', 'In Progress', 'EMP004', 'Cloud Technologies');
