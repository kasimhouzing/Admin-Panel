import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, UserCog, ClipboardList, TrendingUp, AlertTriangle } from "lucide-react";

export default function Dashboard() {
  const stats = [
    {
      title: "Total Laborers",
      value: "248",
      change: "+12 this week",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Active Contractors",
      value: "15",
      change: "+2 this month",
      icon: Building2,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Camp Managers",
      value: "8",
      change: "All active",
      icon: UserCog,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Today's Attendance",
      value: "92%",
      change: "+5% vs yesterday",
      icon: ClipboardList,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  const recentActivity = [
    { action: "New laborer registered", user: "Rajesh Kumar", time: "2 hours ago", type: "success" },
    { action: "Attendance marked", user: "Camp Boss - Site A", time: "3 hours ago", type: "info" },
    { action: "Contractor added", user: "ABC Construction", time: "5 hours ago", type: "success" },
    { action: "Low attendance alert", user: "Site B", time: "1 day ago", type: "warning" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening at your construction sites.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-foreground">Recent Activity</CardTitle>
            <CardDescription>Latest updates from your sites</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'success' ? 'bg-green-500' :
                  activity.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                }`} />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium text-foreground">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.user} • {activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-foreground">Site Status</CardTitle>
            <CardDescription>Current status of all construction sites</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
              <div>
                <p className="font-medium text-green-900">Site A - Tower 1</p>
                <p className="text-sm text-green-700">95% Attendance</p>
              </div>
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>

            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div>
                <p className="font-medium text-yellow-900">Site B - Tower 2</p>
                <p className="text-sm text-yellow-700">78% Attendance</p>
              </div>
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
            </div>

            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div>
                <p className="font-medium text-blue-900">Site C - Basement</p>
                <p className="text-sm text-blue-700">88% Attendance</p>
              </div>
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}