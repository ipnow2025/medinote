// 진료기록 엔티티
export interface MedicalRecord {
  id: number
  userId: number
  visitDate: Date
  hospitalName: string
  doctorName: string
  department: string
  diagnosis: string
  symptoms: string
  prescription: string
  notes?: string
  nextAppointment?: Date
  createdAt: Date
  updatedAt: Date
}

// CREATE TABLE SQL
export const CREATE_MEDICAL_RECORD_TABLE = `
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
`
