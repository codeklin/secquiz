import { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import Routes from "./Routes";
import { SupabaseProvider } from "./components/SupabaseProvider";
import SessionCheck from "./components/SessionCheck";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 5000,
      refetchOnWindowFocus: false,
    },
  },
});

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="w-8 h-8 border-2 border-cyber-blue border-t-transparent rounded-full animate-spin" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <TooltipProvider>
        <SupabaseProvider>
          <SessionCheck />
          <Suspense fallback={<LoadingSpinner />}>
            <Layout>
              <Routes />
            </Layout>
          </Suspense>
          <Toaster />
          <Sonner />
        </SupabaseProvider>
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
