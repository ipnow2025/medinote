// 복용약물 엔티티
export interface Medication {
  id: number
  userId: number
  medicationName: string
  dosage: string
  frequency: string
  startDate: Date
  endDate?: Date
  isActive: boolean
  notes?: string
  createdAt: Date
  updatedAt: Date
}

// CREATE TABLE SQL
export const CREATE_MEDICATION_TABLE = `
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
`
