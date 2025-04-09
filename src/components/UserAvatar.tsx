import { User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  src?: string;
  name?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function UserAvatar({ src, name, className, size = "md" }: UserAvatarProps) {
  // Get initials from name
  const getInitials = (name?: string) => {
    if (!name) return "U";
    
    const parts = name.split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    
    return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
  };

  // Size classes
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12"
  };

  return (
    <Avatar className={cn(sizeClasses[size], "border-2 border-cyber-blue/30", className)}>
      <AvatarImage src={src} alt={name || "User"} />
      <AvatarFallback className="bg-cyber-navy text-cyber-blue">
        {src ? (
          <User className="h-4 w-4" />
        ) : (
          getInitials(name)
        )}
      </AvatarFallback>
    </Avatar>
  );
}
