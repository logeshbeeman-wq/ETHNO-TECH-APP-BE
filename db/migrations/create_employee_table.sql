-- Database Migration for Employee Table
-- This file creates the Employee table with the specified columns

DROP TABLE IF EXISTS employees;

CREATE TABLE IF NOT EXISTS employees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id VARCHAR(50) NOT NULL UNIQUE,
  center_name VARCHAR(255),
  trainer_name VARCHAR(255),
  designation VARCHAR(100),
  grade VARCHAR(50),
  qualification VARCHAR(255),
  overall_experience VARCHAR(100),
  ethnotech_experience VARCHAR(100),
  subjects TEXT,
  address TEXT,
  contact_detail VARCHAR(100),
  emergency_contact_detail VARCHAR(100),
  blood_group VARCHAR(10),
  photo_name VARCHAR(255),
  photo_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_employee_id (employee_id),
  INDEX idx_center_name (center_name),
  INDEX idx_trainer_name (trainer_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample data for Employees
INSERT INTO employees 
  (employee_id, center_name, trainer_name, designation, grade, qualification, overall_experience, ethnotech_experience, subjects, address, contact_detail, emergency_contact_detail, blood_group, photo_name, photo_url)
VALUES 
  ('EMP001', 'Chennai Center', 'Dr. Rajesh Kumar', 'Senior Trainer', 'A', 'B.E (CSE)', '10 years', '4 years', 'Java, Python, MERN', '123 Chennai St, Chennai', '9876543210', '9876543211', 'O+', 'photo1', 'https://example.com/p1.jpg'),
  ('EMP002', 'Bangalore Center', 'Prof. Anita Sharma', 'Expert Trainer', 'A+', 'M.Tech (AI)', '12 years', '6 years', 'Data Science, Machine Learning', '456 Bangalore Rd, Bangalore', '9876543220', '9876543221', 'A+', 'photo2', 'https://example.com/p2.jpg'),
  ('ET0167', 'MAILAM', 'SEBASTIAN RAJ T', 'Senior IT Specialist', 'G4', 'B.E (EEE)', '16 years', '3 years', '1. EMBEDDED USING C, 2. INTRODUCTION TO IOT, 3. EMBEDDED USING ARDUINO, 4. IOT USING PYTHON, 5. CCNA L1, 6. CCNA L2, 7. CYBERSECURITY, 8. AUTOCAD, 9. ELECTRICAL WIRING & ESTIMATION, 10. PYTHON, 11. WEB PROGRAMMING 1, 12. BASIC EXCEL, 13. EXCEL EXPERT, 14. TALLY, 15. TALLY WITH GST & TDS, 16. PLC AUTOMATION, 17. INDUSTRIAL IOT SCHNEIDER, 18. SOLAR IOT, 19. HTML 5, 20. AUTOCAD ELECTRICAL', '27/1918, VKS PANDIYAN NAGAR, VAZHUDHAREDDY, VILLUPURAM-605401', '7904905120', '9884924235', 'A1 +', 'https://drive.google.com/file/d/1HVNcz73NqlYlCAAMfE3GJVb0-IOThQJd/preview', 'https://drive.google.com/uc?export=view&id=1HVNcz73NqlYlCAAMfE3GJVb0-IOThQJd');

