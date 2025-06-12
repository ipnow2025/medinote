-- 메디노트 데이터베이스 스키마 생성

-- 사용자 테이블
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  member_id VARCHAR(50) NOT NULL UNIQUE,
  member_name VARCHAR(100) NOT NULL,
  email VARCHAR(100),
  phone VARCHAR(20),
  birth_date DATE,
  gender ENUM('M', 'F'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_member_id (member_id)
);

-- 진료기록 테이블
CREATE TABLE medical_records (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  visit_date DATE NOT NULL,
  hospital_name VARCHAR(200) NOT NULL,
  doctor_name VARCHAR(100) NOT NULL,
  department VARCHAR(100) NOT NULL,
  diagnosis TEXT NOT NULL,
  symptoms TEXT,
  prescription TEXT,
  notes TEXT,
  next_appointment DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_visit_date (visit_date)
);

-- 복용약물 테이블
CREATE TABLE medications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  medication_name VARCHAR(200) NOT NULL,
  dosage VARCHAR(100) NOT NULL,
  frequency VARCHAR(100) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_is_active (is_active)
);

-- 진료 예약 테이블
CREATE TABLE appointments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  appointment_date DATETIME NOT NULL,
  hospital_name VARCHAR(200) NOT NULL,
  doctor_name VARCHAR(100) NOT NULL,
  department VARCHAR(100) NOT NULL,
  purpose TEXT,
  status ENUM('scheduled', 'completed', 'cancelled') DEFAULT 'scheduled',
  reminder_sent BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_appointment_date (appointment_date),
  INDEX idx_status (status)
);

-- AI 인사이트 테이블
CREATE TABLE ai_insights (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  category VARCHAR(100) NOT NULL,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
  is_read BOOLEAN DEFAULT FALSE,
  source_data JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_category (category),
  INDEX idx_priority (priority),
  INDEX idx_is_read (is_read)
);

-- 건강 지표 테이블
CREATE TABLE health_metrics (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  metric_type VARCHAR(50) NOT NULL, -- 'blood_pressure', 'blood_sugar', 'weight', 'heart_rate' 등
  value VARCHAR(100) NOT NULL,
  unit VARCHAR(20) NOT NULL,
  measured_at DATETIME NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_metric_type (metric_type),
  INDEX idx_measured_at (measured_at)
);

-- 운동 기록 테이블
CREATE TABLE exercise_records (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  exercise_type VARCHAR(100) NOT NULL,
  duration_minutes INT NOT NULL,
  intensity ENUM('low', 'medium', 'high') DEFAULT 'medium',
  calories_burned INT,
  notes TEXT,
  exercise_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_exercise_date (exercise_date)
);
