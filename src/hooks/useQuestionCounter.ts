import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface QuestionCounterState {
  questionsAnswered: number;
  incrementCounter: () => void;
  resetCounter: () => void;
  hasReachedLimit: () => boolean;
  QUESTION_LIMIT: number;
  setQuestionLimit: (limit: number) => void;
}

export const useQuestionCounter = create<QuestionCounterState>()(
  persist(
    (set, get) => ({
      questionsAnswered: 0,
      QUESTION_LIMIT: 10,
      incrementCounter: () => set((state) => ({ questionsAnswered: state.questionsAnswered + 1 })),
      resetCounter: () => set({ questionsAnswered: 0 }),
      hasReachedLimit: () => get().questionsAnswered >= get().QUESTION_LIMIT,
      setQuestionLimit: (limit: number) => set({ QUESTION_LIMIT: limit }),
    }),
    {
      name: 'question-counter',
    }
  )
);
