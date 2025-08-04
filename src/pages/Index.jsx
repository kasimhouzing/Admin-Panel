import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, ClipboardList, Shield, ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-admin-bg">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary to-primary-hover text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <Building2 className="h-16 w-16 mx-auto mb-6" />
            <h1 className="text-5xl font-bold mb-6">
              Lodha Stella
            </h1>
            <h2 className="text-3xl font-semibold mb-4">
              Camp Management System
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Comprehensive administration panel for managing construction site operations,
              labor attendance, and contractor relationships.
            </p>
            <div className="flex justify-center space-x-4">
              <Link to="/login">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                  Admin Login
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-foreground mb-4">
            Complete Site Management Solution
          </h3>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Streamline your construction site operations with our comprehensive
            admin panel designed specifically for camp and labor management.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="text-center">
              <div className="bg-blue-50 p-3 rounded-full w-fit mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle>Login Management</CardTitle>
              <CardDescription>
                Manage access for camp bosses, supervisors, and foremen
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="text-center">
              <div className="bg-green-50 p-3 rounded-full w-fit mx-auto mb-4">
                <Building2 className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle>Contractor Management</CardTitle>
              <CardDescription>
                Track and manage labor contractors and suppliers
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="text-center">
              <div className="bg-purple-50 p-3 rounded-full w-fit mx-auto mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle>Labor Management</CardTitle>
              <CardDescription>
                Comprehensive laborer registration and tracking
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="text-center">
              <div className="bg-orange-50 p-3 rounded-full w-fit mx-auto mb-4">
                <ClipboardList className="h-8 w-8 text-orange-600" />
              </div>
              <CardTitle>Attendance Reports</CardTitle>
              <CardDescription>
                Real-time attendance tracking and reporting
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* About Section */}
      <div className="bg-muted py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2 items-center">
            <div>
              <h3 className="text-3xl font-bold text-foreground mb-6">
                About Camp Management
              </h3>
              <p className="text-lg text-muted-foreground mb-6">
                Camp is a place where laborers stay on site. They sleep, rest, and have food there.
                Our application helps camp bosses monitor laborers effectively while providing
                comprehensive administrative tools for project managers.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-primary mr-3" />
                  <span className="text-foreground">Secure login management system</span>
                </div>
                <div className="flex items-center">
                  <ClipboardList className="h-5 w-5 text-primary mr-3" />
                  <span className="text-foreground">Real-time attendance tracking</span>
                </div>
                <div className="flex items-center">
                  <Building2 className="h-5 w-5 text-primary mr-3" />
                  <span className="text-foreground">Contractor and labor management</span>
                </div>
              </div>
            </div>
            <Card className="border-border shadow-sm">
              <CardHeader>
                <CardTitle>System Architecture</CardTitle>
                <CardDescription>Two-part solution for comprehensive management</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-primary/10 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">Admin Panel</h4>
                  <p className="text-sm text-muted-foreground">
                    Complete administrative control for project managers
                  </p>
                </div>
                <div className="p-4 bg-secondary/50 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">Camp Boss Mobile App</h4>
                  <p className="text-sm text-muted-foreground">
                    Mobile application for on-site attendance management
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-admin-sidebar text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 Lodha Group. All rights reserved.</p>
          <p className="text-sm opacity-75 mt-2">Camp Management System - Phase 1</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;