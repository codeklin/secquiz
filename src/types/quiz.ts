export interface Question {
  id: string;
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
}

export interface Topic {
  id: string;
  name: string;
  description: string;
  icon: string;
  questionCount: number;
  category?: string;
  duration?: string;
  modules?: number;
}

export interface QuizResult {
  score: number;
  totalQuestions: number;
  timeTaken: number;
  topicId: string;
}