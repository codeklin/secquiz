import { useState } from "react";
import { Shield, Phone, AlignLeft, X, LogOut, User, Settings, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/lib/auth";
import { UserAvatar } from "@/components/UserAvatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Header = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, isAdmin, user, logout } = useAuthStore();

  const handleLoginClick = () => {
    navigate('/signin');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-cyber-navy shadow-md py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div
          className="flex items-center gap-2 cursor-pointer transition-transform duration-300 hover:scale-105"
          onClick={() => navigate('/')}
        >
          <Shield size={28} className="text-cyber-blue animate-pulse-glow" />
          <span className="text-xl font-bold text-white">SecQuiz</span>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-white hover:text-cyber-blue transition-colors duration-300"
          >
            Home
          </Button>
          <Button
            variant="ghost"
            onClick={() => navigate('/topics')}
            className="text-white hover:text-cyber-blue transition-colors duration-300"
          >
            Topics
          </Button>
          <Button
            variant="ghost"
            onClick={() => navigate('/progress')}
            className="text-white hover:text-cyber-blue transition-colors duration-300"
          >
            Progress
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="text-white hover:text-cyber-blue transition-colors duration-300 flex items-center gap-2"
              >
                <Phone size={18} className="text-green-400" />
                Contact
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <a
                  href="https://wa.me/2347031098097"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Phone size={16} className="text-green-500" />
                  WhatsApp +234 703 109 8097
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-white hover:text-cyber-blue transition-all duration-300 p-0 h-10 w-10 rounded-full hover:scale-110"
                  aria-label="User menu"
                >
                  <UserAvatar name={user?.name || user?.email} size="md" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-3 py-2 flex items-center gap-3 border-b mb-2">
                  <UserAvatar name={user?.name || user?.email} size="sm" />
                  <div>
                    <div className="text-sm font-medium">{user?.name || 'User'}</div>
                    {user?.email && <div className="text-xs text-gray-500 truncate">{user?.email}</div>}
                  </div>
                </div>
                {isAdmin && (
                  <DropdownMenuItem onClick={() => navigate('/admin')}>
                    <Shield className="mr-2 h-4 w-4 text-cyber-blue" />
                    <span>Admin Dashboard</span>
                  </DropdownMenuItem>
                )}
                {isAdmin ? (
                  <DropdownMenuItem onClick={() => navigate('/topics')}>
                    <Settings className="mr-2 h-4 w-4 text-gray-500" />
                    <span>Manage Topics</span>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={() => navigate('/topics')}>
                    <ChevronRight className="mr-2 h-4 w-4 text-gray-500" />
                    <span>View Topics</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4 text-red-500" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="outline"
              onClick={handleLoginClick}
              className="border-cyber-blue text-cyber-blue hover:bg-cyber-blue hover:text-white transition-all duration-300"
            >
              Sign In
            </Button>
          )}

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="md:hidden text-white"
              >
                {isOpen ? <X className="text-white" /> : <AlignLeft />}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-cyber-navy border-l border-cyber-blue/30 w-[80%] sm:w-[300px]">
              <SheetHeader>
                <SheetTitle className="text-white">Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 mt-6">
                <Button
                  variant="ghost"
                  onClick={() => { navigate('/'); setIsOpen(false); }}
                  className="w-full justify-start text-white hover:text-cyber-blue transition-colors duration-300"
                >
                  Home
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => { navigate('/topics'); setIsOpen(false); }}
                  className="w-full justify-start text-white hover:text-cyber-blue transition-colors duration-300"
                >
                  Topics
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => { navigate('/progress'); setIsOpen(false); }}
                  className="w-full justify-start text-white hover:text-cyber-blue transition-colors duration-300"
                >
                  Progress
                </Button>

                {isAuthenticated && (
                  <>
                    <div className="px-2 py-3 flex items-center gap-3 border-b border-gray-700 mb-1">
                      <UserAvatar name={user?.name || user?.email} size="sm" />
                      <div className="text-sm font-medium text-gray-300 truncate">
                        {user?.name || user?.email}
                      </div>
                    </div>
                    {isAdmin && (
                      <Button
                        variant="ghost"
                        onClick={() => { navigate('/admin'); setIsOpen(false); }}
                        className="w-full justify-start text-white hover:text-cyber-blue transition-colors duration-300"
                      >
                        <Shield className="mr-2 h-4 w-4 text-cyber-blue" />
                        Admin Dashboard
                      </Button>
                    )}
                    {isAdmin ? (
                      <Button
                        variant="ghost"
                        onClick={() => { navigate('/topics'); setIsOpen(false); }}
                        className="w-full justify-start text-white hover:text-cyber-blue transition-colors duration-300"
                      >
                        <Settings className="mr-2 h-4 w-4 text-gray-400" />
                        Manage Topics
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        onClick={() => { navigate('/topics'); setIsOpen(false); }}
                        className="w-full justify-start text-white hover:text-cyber-blue transition-colors duration-300"
                      >
                        <ChevronRight className="mr-2 h-4 w-4 text-gray-400" />
                        View Topics
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      onClick={() => { handleLogout(); setIsOpen(false); }}
                      className="w-full justify-start text-white hover:text-red-400 transition-colors duration-300"
                    >
                      <LogOut className="mr-2 h-4 w-4 text-red-400" />
                      Logout
                    </Button>
                  </>
                )}
                <a
                  href="https://wa.me/2347031098097"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-white hover:text-cyber-blue transition-colors duration-300"
                  >
                    <Phone size={16} className="mr-2 text-green-500" />
                    Contact
                  </Button>
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
