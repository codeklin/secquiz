import { supabase } from './supabase';

export interface UserProgress {
  id: string;
  user_id: string;
  topic_id: string;
  questions_attempted: number;
  questions_correct: number;
  last_activity: string;
  completion_percentage: number;
}

/**
 * Gets a user's progress for all topics
 */
export async function getUserTopicProgress(userId: string): Promise<UserProgress[]> {
  const { data, error } = await supabase
    .from('user_progress')
    .select(`
      id,
      user_id,
      topic_id,
      questions_attempted,
      questions_correct,
      last_activity,
      completion_percentage
    `)
    .eq('user_id', userId);
  
  if (error) {
    console.error('Error getting user topic progress:', error);
    throw error;
  }
  
  return data || [];
}

/**
 * Gets a user's progress for a specific topic
 */
export async function getUserTopicProgressByTopic(userId: string, topicId: string): Promise<UserProgress | null> {
  const { data, error } = await supabase
    .from('user_progress')
    .select(`
      id,
      user_id,
      topic_id,
      questions_attempted,
      questions_correct,
      last_activity,
      completion_percentage
    `)
    .eq('user_id', userId)
    .eq('topic_id', topicId)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') {
      // No data found
      return null;
    }
    console.error('Error getting user topic progress:', error);
    throw error;
  }
  
  return data;
}

/**
 * Updates a user's progress for a specific topic
 */
export async function updateUserTopicProgress(
  userId: string, 
  topicId: string, 
  questionsAttempted: number, 
  questionsCorrect: number
): Promise<void> {
  // First check if a record exists
  const existingProgress = await getUserTopicProgressByTopic(userId, topicId);
  
  if (existingProgress) {
    // Update existing record
    const { error } = await supabase
      .from('user_progress')
      .update({
        questions_attempted: existingProgress.questions_attempted + questionsAttempted,
        questions_correct: existingProgress.questions_correct + questionsCorrect,
        last_activity: new Date().toISOString()
      })
      .eq('id', existingProgress.id);
    
    if (error) {
      console.error('Error updating user topic progress:', error);
      throw error;
    }
  } else {
    // Create new record
    const { error } = await supabase
      .from('user_progress')
      .insert([{
        user_id: userId,
        topic_id: topicId,
        questions_attempted: questionsAttempted,
        questions_correct: questionsCorrect,
        last_activity: new Date().toISOString()
      }]);
    
    if (error) {
      console.error('Error creating user topic progress:', error);
      throw error;
    }
  }
}
