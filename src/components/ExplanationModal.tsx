
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Question } from "@/data/questions";
import { BookOpen, ExternalLink, MessageSquare } from "lucide-react";
import { useState } from "react";
import QuestionFeedback from "./QuestionFeedback";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ExplanationModalProps {
  question: Question;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  questionId?: string; // Database ID of the question
}

const ExplanationModal = ({ question, isOpen, onClose, onNext, questionId }: ExplanationModalProps) => {
  // Use references if available, otherwise use the single reference in an array
  const referencesToShow = question.references?.length ? question.references : (question.reference ? [question.reference] : []);
  const [activeTab, setActiveTab] = useState<string>("explanation");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen size={20} className="text-cyber-blue" />
            Explanation
          </DialogTitle>
          <DialogDescription>
            Understanding the correct answer
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="explanation" className="flex items-center gap-1">
              <BookOpen size={16} />
              Explanation
            </TabsTrigger>
            <TabsTrigger value="feedback" className="flex items-center gap-1">
              <MessageSquare size={16} />
              Feedback
            </TabsTrigger>
          </TabsList>

          <TabsContent value="explanation" className="py-4">
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
              {question.explanation}
            </p>
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                <ExternalLink size={16} className="text-cyber-blue" />
                References:
              </h4>
              <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                {referencesToShow.map((ref, index) => (
                  <li key={index} className="ml-4 list-disc">{ref}</li>
                ))}
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="feedback" className="py-4">
            {questionId ? (
              <QuestionFeedback questionId={questionId} />
            ) : (
              <p className="text-sm text-gray-500 italic">Feedback is only available for saved questions.</p>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Close</Button>
          <Button className="bg-cyber-blue hover:bg-cyber-blue/90" onClick={onNext}>Next Question</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExplanationModal;
