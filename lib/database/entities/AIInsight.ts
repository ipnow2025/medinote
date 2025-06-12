// AI 인사이트 엔티티
export interface AIInsight {
  id: number
  userId: number
  category: string
  title: string
  content: string
  priority: "low" | "medium" | "high"
  isRead: boolean
  sourceData?: string
  createdAt: Date
  updatedAt: Date
}

// CREATE TABLE SQL
export const CREATE_AI_INSIGHT_TABLE = `
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
`
