
import { Check, X } from "lucide-react";

interface QuizOptionProps {
  option: string;
  selected: boolean;
  correct?: boolean;
  onClick: () => void;
}

const QuizOption = ({ 
  option, 
  selected, 
  correct, 
  onClick 
}: QuizOptionProps) => {
  const getStyles = () => {
    let baseClasses = "flex items-center p-4 border rounded-lg cursor-pointer transition-all";
    
    if (correct === undefined) {
      // Not showing results yet
      if (selected) {
        return `${baseClasses} border-cyber-blue bg-cyber-blue/10`;
      }
      return `${baseClasses} border-gray-200 hover:border-cyber-blue hover:bg-cyber-blue/5`;
    } else {
      // Showing results
      if (correct && selected) {
        return `${baseClasses} border-cyber-green bg-cyber-green/10 text-cyber-green`;
      } else if (correct && !selected) {
        return `${baseClasses} border-cyber-green bg-cyber-green/5 border-dashed`;
      } else if (!correct && selected) {
        return `${baseClasses} border-cyber-red bg-cyber-red/10 text-cyber-red`;
      } else {
        return `${baseClasses} border-gray-200 opacity-70`;
      }
    }
  };

  const renderCheckbox = () => {
    if (correct !== undefined) {
      if (correct) {
        return (
          <div className="mr-3 flex items-center justify-center w-6 h-6 bg-cyber-green rounded-full">
            <Check size={14} className="text-white" />
          </div>
        );
      } else if (selected) {
        return (
          <div className="mr-3 flex items-center justify-center w-6 h-6 bg-cyber-red rounded-full">
            <X size={14} className="text-white" />
          </div>
        );
      }
    }
    
    return (
      <div className={`mr-3 w-6 h-6 border-2 ${selected ? 'border-cyber-blue' : 'border-gray-300'} rounded-full flex items-center justify-center`}>
        {selected && <div className="w-3 h-3 bg-cyber-blue rounded-full"></div>}
      </div>
    );
  };

  return (
    <div className={getStyles()} onClick={onClick}>
      {renderCheckbox()}
      <div className="no-copy">{option}</div>
    </div>
  );
};

export default QuizOption;
