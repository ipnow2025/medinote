// TypeORM Entity 정의 (실제 구현 시 사용할 스키마)
export interface User {
  id: number
  memberId: string
  memberName: string
  email?: string
  phone?: string
  birthDate?: Date
  gender?: "M" | "F"
  createdAt: Date
  updatedAt: Date
}

// CREATE TABLE SQL
export const CREATE_USER_TABLE = `
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
`
