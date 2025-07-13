export interface Exercise {
  id: number;
  levelId: number;
  title: string;
  description: string;
  type: 'multiple_choice' | 'true_false' | 'fill_blank' | 'matching';
  content: string; // JSON string with exercise content
  correctAnswer: string;
  options?: string[]; // For multiple choice questions
  points: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateExerciseDto {
  title?: string;
  description?: string;
  type?: 'multiple_choice' | 'true_false' | 'fill_blank' | 'matching';
  content?: string;
  correctAnswer?: string;
  options?: string[];
  points?: number;
  isActive?: boolean;
} 