import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, ClipboardList, ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="h-screen bg-admin-bg flex flex-col overflow-hidden">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary to-primary-hover text-primary-foreground py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Building2 className="h-12 w-12 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-2">
              Lodha Stella
            </h1>
            <h2 className="text-2xl font-semibold mb-2">
              Site Management System
            </h2>
            <p className="text-md mb-6 max-w-xl mx-auto opacity-90">
              Comprehensive administration panel for managing construction site operations,
              labor attendance, and contractor relationships.
            </p>
            <div className="flex justify-center">
              <Link to="/login">
                <Button variant="secondary" className="text-base px-6 py-2">
                  Admin Login
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-foreground mb-2">
            Site Management Solution
          </h3>
          <p className="text-md text-muted-foreground max-w-2xl mx-auto">
            Streamline your construction site operations with our comprehensive admin panel.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="text-center">
              <div className="bg-blue-50 p-3 rounded-full w-fit mx-auto mb-3">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>Login</CardTitle>
              <CardDescription>
                Manage access for all site personnel.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="text-center">
              <div className="bg-green-50 p-3 rounded-full w-fit mx-auto mb-3">
                <Building2 className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>Contractor</CardTitle>
              <CardDescription>
                Track and manage labor contractors.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="text-center">
              <div className="bg-purple-50 p-3 rounded-full w-fit mx-auto mb-3">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle>Labor</CardTitle>
              <CardDescription>
                Comprehensive laborer registration.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="text-center">
              <div className="bg-orange-50 p-3 rounded-full w-fit mx-auto mb-3">
                <ClipboardList className="h-6 w-6 text-orange-600" />
              </div>
              <CardTitle>Reports</CardTitle>
              <CardDescription>
                Real-time attendance and reports.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-admin-sidebar text-white py-2">
        <div className="max-w-7xl mx-auto px-3 text-center">
          <p className="text-xs opacity-75">&copy; 2025 RealTeck Group. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;