import { useQuestionCounter } from '@/hooks/useQuestionCounter';
import { Button } from '@/components/ui/button';

export default function DebugCounter() {
  const { questionsAnswered, incrementCounter, resetCounter, QUESTION_LIMIT } = useQuestionCounter();

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border z-50">
      <h3 className="font-bold mb-2">Debug Counter</h3>
      <p>Questions Answered: {questionsAnswered}</p>
      <p>Question Limit: {QUESTION_LIMIT}</p>
      <p>Remaining: {QUESTION_LIMIT - questionsAnswered}</p>
      <div className="flex gap-2 mt-2">
        <Button size="sm" onClick={incrementCounter}>Increment</Button>
        <Button size="sm" variant="destructive" onClick={resetCounter}>Reset</Button>
      </div>
    </div>
  );
}
