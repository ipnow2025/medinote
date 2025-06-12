// 진료 예약 엔티티
export interface Appointment {
  id: number
  userId: number
  appointmentDate: Date
  hospitalName: string
  doctorName: string
  department: string
  purpose?: string
  status: "scheduled" | "completed" | "cancelled"
  reminderSent: boolean
  notes?: string
  createdAt: Date
  updatedAt: Date
}

// CREATE TABLE SQL
export const CREATE_APPOINTMENT_TABLE = `
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
`
