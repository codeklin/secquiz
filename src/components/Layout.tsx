import { ReactNode, useEffect, useState } from "react";
import Header from "./Header";
import MobileNav from "./MobileNav";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Generate random positions for background circles
  const circles = Array.from({ length: 8 }).map((_, index) => ({
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: `${Math.random() * 20 + 10}rem`,
    color: [
      "bg-blue-500/10",
      "bg-green-500/10",
      "bg-purple-500/10",
      "bg-pink-500/10",
      "bg-yellow-500/10",
      "bg-indigo-500/10",
      "bg-cyan-500/10",
      "bg-orange-500/10",
    ][index % 8],
    animationDelay: `${index * 0.5}s`,
  }));

  return (
    <div className={`flex flex-col min-h-screen transition-opacity duration-500 ${mounted ? 'opacity-100' : 'opacity-0'} overflow-hidden`}>
      {/* Background circles */}
      {circles.map((circle, index) => (
        <div
          key={index}
          className={`fixed rounded-full blur-3xl ${circle.color} animate-pulse opacity-50 z-0`}
          style={{
            top: circle.top,
            left: circle.left,
            width: circle.size,
            height: circle.size,
            animationDelay: circle.animationDelay,
          }}
        />
      ))}

      <Header />
      <main className="flex-grow relative z-10 mb-16 md:mb-0">
        {children}
      </main>
      <footer className="bg-cyber-navy text-white py-6 relative z-10 md:pb-0 pb-16 text-center md:text-left">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0 text-center md:text-left">
              <div className="flex items-center gap-2">
                <span className="font-bold">SecQuiz</span>
              </div>
              <p className="hidden md:block text-sm text-gray-400 mt-1">Master cybersecurity through interactive quizzes</p>
            </div>
            <div className="hidden md:block text-sm text-gray-400">
              © {new Date().getFullYear()} SecQuiz. All rights reserved. JDev-Live | Gigsdev.
            </div>
          </div>
        </div>
      </footer>
      <MobileNav />
    </div>
  );
};

export default Layout;
