import { Question } from '@/types/quiz';
import { supabase } from './supabase';

export interface Topic {
  id: string;
  title: string;
  description: string;
  image_url: string;
}

export async function getTopics(): Promise<Topic[]> {
  const { data, error } = await supabase
    .from('topics')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function getQuestions(topicId: string): Promise<Question[]> {
  try {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('topic_id', topicId);

    if (error) throw error;

    // Ensure proper formatting of questions
    return data.map(q => ({
      id: q.id,
      question: q.question,
      options: Array.isArray(q.options) ? q.options : JSON.parse(q.options || '[]'),
      correct_answer: q.correct_answer,
      explanation: q.explanation
    }));
  } catch (error) {
    console.error('Error in getQuestions:', error);
    throw error;
  }
}

export async function saveQuizResult(userId: string, topicId: string, score: number, totalQuestions: number) {
  // First save the quiz result
  const { error } = await supabase
    .from('quiz_results')
    .insert([
      {
        user_id: userId,
        topic_id: topicId,
        score,
        total_questions: totalQuestions,
      }
    ]);

  if (error) throw error;

  // Then update the user progress
  try {
    // Check if a progress record exists for this user and topic
    const { data: existingProgress, error: progressError } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('topic_id', topicId)
      .single();

    if (progressError && progressError.code !== 'PGRST116') {
      // An error occurred other than "no rows returned"
      throw progressError;
    }

    if (existingProgress) {
      // Update existing progress
      await supabase
        .from('user_progress')
        .update({
          questions_attempted: existingProgress.questions_attempted + totalQuestions,
          questions_correct: existingProgress.questions_correct + score,
          last_activity: new Date().toISOString()
        })
        .eq('id', existingProgress.id);
    } else {
      // Create new progress record
      await supabase
        .from('user_progress')
        .insert([
          {
            user_id: userId,
            topic_id: topicId,
            questions_attempted: totalQuestions,
            questions_correct: score,
            last_activity: new Date().toISOString()
          }
        ]);
    }
  } catch (progressError) {
    console.error('Error updating user progress:', progressError);
    // Don't throw the error here to avoid failing the quiz result save
    // Just log it and continue
  }
}
