
import { useEffect, useState } from "react";
import HomePage from "./HomePage";

const Index = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Reduce loading time and add cleanup
    const timer = setTimeout(() => {
      setLoading(false);
    }, 100); // Reduced from 300ms to 100ms

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-cyber-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <HomePage />;
};

export default Index;
