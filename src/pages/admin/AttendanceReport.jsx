import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar, Download, Filter, Search, Users, TrendingUp, Clock } from "lucide-react";

// interface AttendanceRecord {
//   id: string;
//   laborerId: string;
//   laborerName: string;
//   contractorName: string;
//   date: string;
//   checkIn: string;
//   checkOut: string;
//   status: "present" | "absent" | "late" | "half-day";
//   markedBy: string;
// }

export default function AttendanceReport() {
  const [attendanceRecords] = useState([
    {
      id: "1",
      laborerId: "LAB001",
      laborerName: "Rajesh Kumar",
      contractorName: "ABC Construction Pvt Ltd",
      date: "2024-01-15",
      checkIn: "08:00 AM",
      checkOut: "06:00 PM",
      status: "present",
      markedBy: "Camp Boss - Raj"
    },
    {
      id: "2",
      laborerId: "LAB002",
      laborerName: "Sunita Devi",
      contractorName: "ABC Construction Pvt Ltd",
      date: "2024-01-15",
      checkIn: "08:15 AM",
      checkOut: "06:00 PM",
      status: "late",
      markedBy: "Camp Boss - Raj"
    },
    {
      id: "3",
      laborerId: "LAB003",
      laborerName: "Mohammed Ali",
      contractorName: "XYZ Builders & Contractors",
      date: "2024-01-15",
      checkIn: "-",
      checkOut: "-",
      status: "absent",
      markedBy: "Camp Boss - Suresh"
    },
    {
      id: "4",
      laborerId: "LAB001",
      laborerName: "Rajesh Kumar",
      contractorName: "ABC Construction Pvt Ltd",
      date: "2024-01-14",
      checkIn: "08:00 AM",
      checkOut: "02:00 PM",
      status: "half-day",
      markedBy: "Camp Boss - Raj"
    }
  ]);

  const [filterDate, setFilterDate] = useState("");
  const [filterContractor, setFilterContractor] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const contractors = ["ABC Construction Pvt Ltd", "XYZ Builders & Contractors", "Singh Contractors"];

  const getStatusColor = (status) => {
    switch (status) {
      case "present": return "default";
      case "late": return "secondary";
      case "half-day": return "outline";
      case "absent": return "destructive";
      default: return "default";
    }
  };

  const filteredRecords = attendanceRecords.filter(record => {
    return (
      (!filterDate || record.date === filterDate) &&
      (filterContractor === "all" || !filterContractor || record.contractorName === filterContractor) &&
      (filterStatus === "all" || !filterStatus || record.status === filterStatus)
    );
  });

  // Calculate statistics
  const totalRecords = filteredRecords.length;
  const presentCount = filteredRecords.filter(r => r.status === "present").length;
  const lateCount = filteredRecords.filter(r => r.status === "late").length;
  const absentCount = filteredRecords.filter(r => r.status === "absent").length;
  const attendanceRate = totalRecords > 0 ? ((presentCount + lateCount) / totalRecords * 100).toFixed(1) : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Attendance Report</h2>
          <p className="text-muted-foreground">
            Track and monitor laborer attendance across all sites
          </p>
        </div>

        <Button>
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Records
            </CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalRecords}</div>
            <p className="text-xs text-muted-foreground">
              Attendance entries
            </p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Present
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{presentCount}</div>
            <p className="text-xs text-muted-foreground">
              On time arrivals
            </p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Attendance Rate
            </CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{attendanceRate}%</div>
            <p className="text-xs text-muted-foreground">
              Overall attendance
            </p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Absent
            </CardTitle>
            <Users className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{absentCount}</div>
            <p className="text-xs text-muted-foreground">
              No show today
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filters
          </CardTitle>
          <CardDescription>Filter attendance records by date, contractor, or status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="filterDate">Date</Label>
              <Input
                id="filterDate"
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="filterContractor">Contractor</Label>
              <Select value={filterContractor} onValueChange={setFilterContractor}>
                <SelectTrigger>
                  <SelectValue placeholder="All contractors" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All contractors</SelectItem>
                  {contractors.map((contractor) => (
                    <SelectItem key={contractor} value={contractor}>
                      {contractor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="filterStatus">Status</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="present">Present</SelectItem>
                  <SelectItem value="late">Late</SelectItem>
                  <SelectItem value="half-day">Half Day</SelectItem>
                  <SelectItem value="absent">Absent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setFilterDate("");
                  setFilterContractor("all");
                  setFilterStatus("all");
                }}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Table */}
      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle>Attendance Records</CardTitle>
          <CardDescription>
            Detailed attendance records for all laborers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sr</TableHead>
                <TableHead>Laborer ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Contractor</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Check In</TableHead>
                <TableHead>Check Out</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Marked By</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.map((record, index) => (
                <TableRow key={record.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{record.laborerId}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">{record.laborerName}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{record.contractorName}</TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                      {record.date}
                    </div>
                  </TableCell>
                  <TableCell>{record.checkIn}</TableCell>
                  <TableCell>{record.checkOut}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(record.status)}>
                      {record.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{record.markedBy}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredRecords.length === 0 && (
            <div className="text-center py-8">
              <Search className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No attendance records found with current filters.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}