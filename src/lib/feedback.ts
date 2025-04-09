import { supabase } from './supabase';

export interface Feedback {
  id: string;
  user_id: string;
  question_id: string;
  feedback_type: string;
  feedback_text: string;
  created_at: string;
}

/**
 * Gets all feedback for a specific question
 */
export async function getQuestionFeedback(questionId: string): Promise<Feedback[]> {
  const { data, error } = await supabase
    .from('feedback')
    .select('*')
    .eq('question_id', questionId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error getting question feedback:', error);
    throw error;
  }
  
  return data || [];
}

/**
 * Gets all feedback submitted by a user
 */
export async function getUserFeedback(userId: string): Promise<Feedback[]> {
  const { data, error } = await supabase
    .from('feedback')
    .select(`
      id,
      user_id,
      question_id,
      feedback_type,
      feedback_text,
      created_at,
      questions:question_id (
        id,
        question
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error getting user feedback:', error);
    throw error;
  }
  
  return data || [];
}

/**
 * Submits feedback for a question
 */
export async function submitFeedback(
  userId: string,
  questionId: string,
  feedbackType: string,
  feedbackText: string
): Promise<void> {
  const { error } = await supabase
    .from('feedback')
    .insert([{
      user_id: userId,
      question_id: questionId,
      feedback_type: feedbackType,
      feedback_text: feedbackText
    }]);
  
  if (error) {
    console.error('Error submitting feedback:', error);
    throw error;
  }
}
