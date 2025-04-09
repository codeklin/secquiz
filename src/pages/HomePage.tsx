import { Shield, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import TopicCard from "@/components/TopicCard";
import { topics } from "@/data/questions";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/lib/auth";

const HomePage = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuthStore();
  const [animatedItems, setAnimatedItems] = useState<boolean>(false);

  useEffect(() => {
    // Trigger animations after component mount
    setTimeout(() => setAnimatedItems(true), 100);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-cyber-navy py-16 md:py-24 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className={`flex-1 transition-all duration-700 transform ${animatedItems ? 'translate-x-0 opacity-100' : 'translate-x-[-50px] opacity-0'}`}>
              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
                Master <span className="text-cyber-blue">Cybersecurity</span> Through Interactive Quizzes
              </h1>
              <p className="text-lg text-gray-300 mb-8">
                Test your knowledge, improve your skills, and prep for certifications with SecQuiz - the ultimate cybersecurity quiz application.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  className="bg-cyber-blue hover:bg-cyber-blue/90 text-white px-8 py-6 transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg"
                  size="lg"
                  onClick={() => navigate('/topics')}
                >
                  Start Learning
                </Button>
                <Button
                  variant="outline"
                  className="border-white text-green hover:bg-white/10 px-8 py-6 transition-all duration-300 hover:translate-y-[-2px]"
                  size="lg"
                  onClick={() => navigate('/progress')}
                >
                  View Progress
                </Button>
              </div>
            </div>
            <div className={`flex-1 flex justify-center transition-all duration-700 delay-300 transform ${animatedItems ? 'translate-x-0 opacity-100' : 'translate-x-[50px] opacity-0'}`}>
              <div className="w-64 h-64 bg-cyber-blue/10 rounded-full flex items-center justify-center animate-pulse-glow">
                <Shield size={120} className="text-cyber-blue" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Topics */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className={`text-2xl md:text-3xl font-bold mb-2 transition-all duration-500 ${animatedItems ? 'translate-y-0 opacity-100' : 'translate-y-[20px] opacity-0'}`}>Featured Topics</h2>
          <p className={`text-gray-600 dark:text-gray-400 mb-8 transition-all duration-500 delay-100 ${animatedItems ? 'translate-y-0 opacity-100' : 'translate-y-[20px] opacity-0'}`}>Choose a category to start practicing</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.slice(0, 3).map((topic, index) => (
              <div
                key={topic.id}
                className={`transition-all duration-500 transform ${animatedItems ? 'translate-y-0 opacity-100' : 'translate-y-[30px] opacity-0'}`}
                style={{ transitionDelay: `${300 + (index * 100)}ms` }}
              >
                <TopicCard
                  id={topic.id}
                  title={topic.name}
                  description={topic.description}
                  imageUrl="/topics/default.jpg"
                />
              </div>
            ))}
          </div>

          <div className={`mt-10 text-center transition-all duration-500 delay-700 ${animatedItems ? 'translate-y-0 opacity-100' : 'translate-y-[20px] opacity-0'}`}>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                variant="outline"
                className="border-cyber-blue text-cyber-blue hover:bg-cyber-blue/10 group transition-all duration-300"
                onClick={() => navigate('/topics')}
              >
                View All Topics
                <ChevronRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>

              {isAdmin && (
                <Button
                  variant="outline"
                  className="border-purple-500 text-purple-500 hover:bg-purple-500/10 group transition-all duration-300"
                  onClick={() => navigate('/admin-setup')}
                >
                  Admin Setup
                  <ChevronRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              )}

              {isAdmin && (
                <Button
                  variant="outline"
                  className="border-green-500 text-green-500 hover:bg-green-500/10 group transition-all duration-300"
                  onClick={() => navigate('/setup-topics')}
                >
                  Setup Sample Topics
                  <ChevronRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="hidden md:block py-16 bg-green-50 dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <h2 className={`text-2xl md:text-3xl font-bold mb-8 text-center transition-all duration-500 ${animatedItems ? 'translate-y-0 opacity-100' : 'translate-y-[20px] opacity-0'}`}>Why SecQuiz?</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield size={24} className="text-cyber-blue " />,
                title: "Expert-Crafted Questions",
                description: "Questions aligned with industry standards and certification exams.",
                bgColor: "bg-purple-500/20"
              },
              {
                icon: <Shield size={24} className="text-cyber-blue" />,
                title: "Detailed Explanations",
                description: "Learn from your mistakes with thorough explanations and references.",
                bgColor: "bg-teal-500/20"
              },
              {
                icon: <Shield size={24} className="text-cyber-blue" />,
                title: "Track Your Progress",
                description: "Monitor your improvement over time with detailed statistics.",
                bgColor: "bg-orange-500/20"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg transition-all duration-500 transform hover:translate-y-[-5px] hover:shadow-xl ${animatedItems ? 'translate-y-0 opacity-100' : 'translate-y-[30px] opacity-0'}`}
                style={{ transitionDelay: `${700 + (index * 100)}ms` }}
              >
                <div className={`w-12 h-12 rounded-full ${feature.bgColor} flex items-center justify-center mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-xl mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
