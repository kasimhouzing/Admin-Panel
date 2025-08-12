import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import LoginManagement from "./pages/admin/LoginManagement";
import ContractorManagement from "./pages/admin/ContractorManagement";
import LaborManagement from "./pages/admin/LaborManagement";
import AttendanceReport from "./pages/admin/AttendanceReport";
import Login from "./pages/admin/Login";
import Campmanagement from "./pages/admin/campManagement";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="logins" element={<LoginManagement />} />
            <Route path="contractors" element={<ContractorManagement />} />
            <Route path="laborers" element={<LaborManagement />} />
            <Route path="attendance" element={<AttendanceReport />} />
            <Route path="Campmanagement" element={<Campmanagement />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
