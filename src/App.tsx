import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import ContactOptions from "./pages/ContactOptions";
import Offers from "./pages/Offers";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import AdminDevelopments from "./pages/AdminDevelopments";
import DataPipeline from "./pages/DataPipeline";
import ErrorLog from "./pages/ErrorLog";
import BulkImport from "./pages/BulkImport";
import Scheduling from "./pages/Scheduling";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();


const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/contact-options" element={<ContactOptions />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
          <Route path="/admin/developments" element={<ProtectedRoute><AdminDevelopments /></ProtectedRoute>} />
          <Route path="/admin/bulk-import" element={<ProtectedRoute><BulkImport /></ProtectedRoute>} />
          <Route path="/admin/error-log" element={<ProtectedRoute><ErrorLog /></ProtectedRoute>} />
          <Route path="/admin/scheduling" element={<ProtectedRoute><Scheduling /></ProtectedRoute>} />
          <Route path="/data-pipeline" element={<ProtectedRoute><DataPipeline /></ProtectedRoute>} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
