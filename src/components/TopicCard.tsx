
import { Link, useNavigate } from "react-router-dom";
import { Award, Code, Key, Shield, Activity, UserCheck, Network, Lock, FileCode, Database, Edit, Plus } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuthStore } from "@/lib/auth";

interface TopicCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  showActions?: boolean;
}

const TopicCard = ({ id, title, description, imageUrl, showActions = false }: TopicCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  // Color palettes for different cards
  const colorPalettes = [
    { bg: "bg-amber-100", category: "bg-amber-500", title: "text-amber-800", hover: "shadow-amber-300/50" },
    { bg: "bg-pink-100", category: "bg-pink-500", title: "text-pink-800", hover: "shadow-pink-300/50" },
    { bg: "bg-purple-100", category: "bg-purple-500", title: "text-purple-800", hover: "shadow-purple-300/50" },
    { bg: "bg-blue-100", category: "bg-blue-500", title: "text-blue-800", hover: "shadow-blue-300/50" },
    { bg: "bg-teal-100", category: "bg-teal-500", title: "text-teal-800", hover: "shadow-teal-300/50" },
    { bg: "bg-orange-100", category: "bg-orange-500", title: "text-orange-800", hover: "shadow-orange-300/50" },
    { bg: "bg-green-100", category: "bg-green-500", title: "text-green-800", hover: "shadow-green-300/50" },
    { bg: "bg-cyan-100", category: "bg-cyan-500", title: "text-cyan-800", hover: "shadow-cyan-300/50" },
    { bg: "bg-indigo-100", category: "bg-indigo-500", title: "text-indigo-800", hover: "shadow-indigo-300/50" },
    { bg: "bg-rose-100", category: "bg-rose-500", title: "text-rose-800", hover: "shadow-rose-300/50" },
  ];

  // Get a consistent color palette based on id
  const paletteIndex = Math.abs(id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)) % colorPalettes.length;
  const palette = colorPalettes[paletteIndex];

  // Default icon
  const defaultIcon = <Shield className="h-5 w-5 text-white" />;

  // Format the category name (uppercase)
  const categoryName = "CYBERSECURITY";

  // For navigation to edit page
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuthStore();

  // Handle edit button click
  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent the card link from activating
    e.stopPropagation();
    navigate(`/edit-topic/${id}`);
  };

  // Handle add questions button click
  const handleAddQuestionsClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent the card link from activating
    e.stopPropagation();
    navigate(`/add-questions/${id}`);
  };

  return (
    <Link to={`/quiz/${id}`}>
      <Card
        className={`overflow-hidden border-0 transition-all duration-500 ${palette.bg} ${
          isHovered ? `scale-[1.02] shadow-xl ${palette.hover}` : 'shadow-md'
        } h-full animate-fadeIn`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardHeader className="p-6">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-medium text-white px-3 py-1 rounded-full uppercase ${palette.category} transition-all duration-300 ${isHovered ? 'scale-105' : ''}`}>
                {categoryName}
              </span>
            </div>

            <div className={`p-2 rounded-full ${palette.category} transition-all duration-300 ${isHovered ? 'rotate-12 scale-110' : ''}`}>
              {defaultIcon}
            </div>
          </div>

          <h3 className={`text-xl font-bold mb-2 ${palette.title} transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`}>{title}</h3>
          <p className="text-sm text-gray-600 mb-4">{description}</p>

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-500">Cybersecurity Quiz</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 pt-0">
          <div className="mt-2 flex justify-between items-center">
            <span className="text-xs text-gray-500">Test your knowledge</span>

            {showActions && isAuthenticated && isAdmin && (
              <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                <Button
                  size="sm"
                  variant="outline"
                  className="p-1 h-8 w-8"
                  onClick={handleEditClick}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="p-1 h-8 w-8"
                  onClick={handleAddQuestionsClick}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default TopicCard;
