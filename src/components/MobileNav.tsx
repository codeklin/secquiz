import { useNavigate } from 'react-router-dom';
import { Home, BookOpen, Activity, User } from 'lucide-react';
import { useAuthStore } from '@/lib/auth';

const MobileNav = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const handleNavigation = (path: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-cyber-navy border-t border-cyber-blue/30 md:hidden z-50">
      <div className="flex justify-around items-center py-3">
        <button
          onClick={handleNavigation('/')}
          className="flex flex-col items-center text-white hover:text-cyber-blue transition-colors duration-300"
        >
          <Home size={20} />
          <span className="text-xs mt-1">Home</span>
        </button>
        
        <button
          onClick={handleNavigation('/topics')}
          className="flex flex-col items-center text-white hover:text-cyber-blue transition-colors duration-300"
        >
          <BookOpen size={20} />
          <span className="text-xs mt-1">Topics</span>
        </button>
        
        <button
          onClick={handleNavigation('/progress')}
          className="flex flex-col items-center text-white hover:text-cyber-blue transition-colors duration-300"
        >
          <Activity size={20} />
          <span className="text-xs mt-1">Progress</span>
        </button>
        
        <button
          onClick={handleNavigation(isAuthenticated ? '/profile' : '/login')}
          className="flex flex-col items-center text-white hover:text-cyber-blue transition-colors duration-300"
        >
          <User size={20} />
          <span className="text-xs mt-1">{isAuthenticated ? 'Profile' : 'Login'}</span>
        </button>
      </div>
    </nav>
  );
};

export default MobileNav;
