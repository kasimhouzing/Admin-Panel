import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Ban, Trash2, Phone, Mail, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function LoginManagement() {
  const { toast } = useToast();
  // Initial user data, updated to reflect potential new fields for demonstration
  const [users, setUsers] = useState([
    {
      id: "1",
      nameOfInductee: "Raj Kumar",
      dateOfBirth: "1980-05-20",
      age: 44,
      gender: "Male",
      designation: "Camp Boss",
      bloodGroup: "O+",
      photoUpload: "raj_photo.jpg", // Placeholder for file name
      selfDeclarationUpload: "raj_self_dec.pdf", // Placeholder for file name
      medicalCertificateUpload: "raj_medical.pdf", // Placeholder for file name
      additionalDocument1Upload: "", // Placeholder for file name
      additionalDocument2Upload: "", // Placeholder for file name
      reportedToIncharge: "N/A",
      appointmentLetterUpload: "raj_appointment.pdf", // Placeholder for file name
      vendor: "Lodha Group",
      adharFrontUpload: "raj_adhar_front.jpg", // Placeholder for file name
      adharNumber: "1234 5678 9012",
      mobileNumber: "+91 9876543210",
      email: "raj.kumar@lodha.com",
      lastLogin: "2024-01-15 09:30 AM",
      status: "active"
    },
    {
      id: "2",
      nameOfInductee: "Suresh Patil",
      dateOfBirth: "1985-11-10",
      age: 39,
      gender: "Male",
      designation: "Site Supervisor",
      bloodGroup: "A+",
      photoUpload: "suresh_photo.jpg",
      selfDeclarationUpload: "suresh_self_dec.pdf",
      medicalCertificateUpload: "suresh_medical.pdf",
      additionalDocument1Upload: "",
      additionalDocument2Upload: "",
      reportedToIncharge: "Raj Kumar (Camp Boss)", // Updated to match dynamic option format
      appointmentLetterUpload: "suresh_appointment.pdf",
      vendor: "Shapoorji Pallonji",
      adharFrontUpload: "suresh_adhar_front.jpg",
      adharNumber: "2345 6789 0123",
      mobileNumber: "+91 9876543211",
      email: "suresh.patil@lodha.com",
      lastLogin: "2024-01-14 06:45 PM",
      status: "active"
    },
    {
      id: "3",
      nameOfInductee: "Mohammed Khan",
      dateOfBirth: "1990-03-25",
      age: 34,
      gender: "Male",
      designation: "Foreman",
      bloodGroup: "B-",
      photoUpload: "mohammed_photo.jpg",
      selfDeclarationUpload: "mohammed_self_dec.pdf",
      medicalCertificateUpload: "mohammed_medical.pdf",
      additionalDocument1Upload: "",
      additionalDocument2Upload: "",
      reportedToIncharge: "Suresh Patil (Site Supervisor)", // Updated to match dynamic option format
      appointmentLetterUpload: "mohammed_appointment.pdf",
      vendor: "L&T Construction",
      adharFrontUpload: "mohammed_adhar_front.jpg",
      adharNumber: "3456 7890 1234",
      mobileNumber: "+91 9876543212",
      email: "mohammed.khan@lodha.com",
      lastLogin: "2024-01-10 02:15 PM",
      status: "suspended"
    },
    {
      id: "4",
      nameOfInductee: "Priya Sharma",
      dateOfBirth: "1995-07-12",
      age: 29,
      gender: "Female",
      designation: "Labourer",
      bloodGroup: "AB+",
      photoUpload: "priya_photo.jpg",
      selfDeclarationUpload: "priya_self_dec.pdf",
      medicalCertificateUpload: "priya_medical.pdf",
      additionalDocument1Upload: "priya_skill_cert.pdf",
      additionalDocument2Upload: "",
      reportedToIncharge: "Mohammed Khan (Foreman)", // Updated to match dynamic option format
      appointmentLetterUpload: "priya_appointment.pdf",
      vendor: "Tata Projects",
      adharFrontUpload: "priya_adhar_front.jpg",
      adharNumber: "4567 8901 2345",
      mobileNumber: "+91 9876543213",
      email: "priya.sharma@example.com",
      lastLogin: "Never",
      status: "active"
    }
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    nameOfInductee: "",
    dateOfBirth: "",
    age: "",
    gender: "",
    designation: "",
    bloodGroup: "",
    photoUpload: "",
    selfDeclarationUpload: "",
    medicalCertificateUpload: "",
    additionalDocument1Upload: "",
    additionalDocument2Upload: "",
    reportedToIncharge: "",
    appointmentLetterUpload: "",
    vendor: "",
    adharFrontUpload: "",
    adharNumber: "",
    mobileNumber: "",
    email: ""
  });

  // Static data for dropdowns
  const designations = [
    "Camp Boss",
    "Site Supervisor",
    "Foreman",
    "Safety Officer",
    "Security Guard",
    "Labourer",
    "Electrician",
    "Plumber",
    "Carpenter",
    "Mason"
  ];

  const genders = ["Male", "Female", "Other"];
  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const vendors = ["Lodha Group", "Shapoorji Pallonji", "L&T Construction", "Tata Projects", "Other"];

  // Dynamically generate incharge options from existing users
  const inchargeOptions = users.map(user => `${user.nameOfInductee} (${user.designation})`);
  // Add a "N/A" option for top-level personnel
  if (!inchargeOptions.includes("N/A")) {
    inchargeOptions.unshift("N/A");
  }

  // Helper function to handle file input changes
  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      // In a real application, you would upload the file to a server
      // and store the returned URL or file ID.
      // For this example, we'll just store the file name.
      setFormData({ ...formData, [fieldName]: file.name });
    } else {
      setFormData({ ...formData, [fieldName]: "" });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingUser) {
      // Update existing user
      setUsers(users.map(user =>
        user.id === editingUser.id
          ? { ...user, ...formData, age: parseInt(formData.age) }
          : user
      ));
      toast({
        title: "User Updated",
        description: "User details have been successfully updated.",
      });
      setEditingUser(null);
    } else {
      // Add new user/labourer
      const newUser = {
        id: (users.length + 1).toString(), // Simple ID generation
        ...formData,
        age: parseInt(formData.age), // Ensure age is a number
        lastLogin: "Never", // New users haven't logged in yet
        status: "active" // Default status for new users
      };
      setUsers([...users, newUser]);
      toast({
        title: "User Added",
        description: "New user has been successfully added to the system.",
      });
    }

    // Reset form and close dialog
    setFormData({
      nameOfInductee: "",
      dateOfBirth: "",
      age: "",
      gender: "",
      designation: "",
      bloodGroup: "",
      photoUpload: "",
      selfDeclarationUpload: "",
      medicalCertificateUpload: "",
      additionalDocument1Upload: "",
      additionalDocument2Upload: "",
      reportedToIncharge: "",
      appointmentLetterUpload: "",
      vendor: "",
      adharFrontUpload: "",
      adharNumber: "",
      mobileNumber: "",
      email: ""
    });
    setIsAddDialogOpen(false);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      nameOfInductee: user.nameOfInductee,
      dateOfBirth: user.dateOfBirth,
      age: user.age,
      gender: user.gender,
      designation: user.designation,
      bloodGroup: user.bloodGroup,
      // For file inputs, we can't pre-fill the file itself for security reasons.
      // We'll just show the existing file name as a placeholder.
      photoUpload: user.photoUpload,
      selfDeclarationUpload: user.selfDeclarationUpload,
      medicalCertificateUpload: user.medicalCertificateUpload,
      additionalDocument1Upload: user.additionalDocument1Upload,
      additionalDocument2Upload: user.additionalDocument2Upload,
      reportedToIncharge: user.reportedToIncharge,
      appointmentLetterUpload: user.appointmentLetterUpload,
      vendor: user.vendor,
      adharFrontUpload: user.adharFrontUpload,
      adharNumber: user.adharNumber,
      mobileNumber: user.mobileNumber,
      email: user.email
    });
    setIsAddDialogOpen(true);
  };

  const handleSuspend = (userId) => {
    setUsers(users.map(user =>
      user.id === userId
        ? { ...user, status: user.status === "active" ? "suspended" : "active" }
        : user
    ));
    toast({
      title: "User Status Changed",
      description: "User access has been updated.",
    });
  };

  const handleDelete = (userId) => {
    setUsers(users.filter(user => user.id !== userId));
    toast({
      title: "User Deleted",
      description: "User has been permanently removed from the system.",
      variant: "destructive"
    });
  };

  return (
    // Main container for the page content, now with a wider max-width and centered
    <div className="space-y-6 p-6 bg-background text-foreground min-h-screen max-w-screen-xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Login & Labourer Management</h2>
          <p className="text-muted-foreground mt-1">
            Manage access for camp bosses, supervisors, foremen, and labourers
          </p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="w-full md:w-auto px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
              onClick={() => {
                setEditingUser(null);
                setFormData({
                  nameOfInductee: "",
                  dateOfBirth: "",
                  age: "",
                  gender: "",
                  designation: "",
                  bloodGroup: "",
                  photoUpload: "",
                  selfDeclarationUpload: "",
                  medicalCertificateUpload: "",
                  additionalDocument1Upload: "",
                  additionalDocument2Upload: "",
                  reportedToIncharge: "",
                  appointmentLetterUpload: "",
                  vendor: "",
                  adharFrontUpload: "",
                  adharNumber: "",
                  mobileNumber: "",
                  email: ""
                });
              }}>
              <Plus className="h-4 w-4 mr-2" />
              Add New User / Labourer
            </Button>
          </DialogTrigger>
          {/* Dialog content, now even wider */}
          <DialogContent className="sm:max-w-screen-lg p-6 rounded-lg shadow-xl overflow-y-auto max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold text-primary">{editingUser ? "Edit User Details" : "Add New User / Labourer"}</DialogTitle>
              <DialogDescription className="text-muted-foreground mt-1">
                {editingUser ? "Update the details for the selected user." : "Enter the comprehensive details for the new user or labourer."}
              </DialogDescription>
            </DialogHeader>
            {/* Form layout remains two columns on medium and larger screens */}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              {/* Personal Details Section */}
              <div className="md:col-span-2 text-lg font-semibold text-primary-foreground bg-primary/10 p-3 rounded-md shadow-sm">Personal Details</div>
              <div className="space-y-2">
                <Label htmlFor="nameOfInductee">Name of Inductee</Label>
                <Input
                  id="nameOfInductee"
                  value={formData.nameOfInductee}
                  onChange={(e) => setFormData({ ...formData, nameOfInductee: e.target.value })}
                  placeholder="Full Name"
                  required
                  className="rounded-md border-input focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date Of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  required
                  className="rounded-md border-input focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  placeholder="Age"
                  required
                  className="rounded-md border-input focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })} required>
                  <SelectTrigger className="rounded-md border-input focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    {genders.map((gender) => (
                      <SelectItem key={gender} value={gender}>
                        {gender}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bloodGroup">Blood Group</Label>
                <Select value={formData.bloodGroup} onValueChange={(value) => setFormData({ ...formData, bloodGroup: value })} required>
                  <SelectTrigger className="rounded-md border-input focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                    <SelectValue placeholder="Select Blood Group" />
                  </SelectTrigger>
                  <SelectContent>
                    {bloodGroups.map((group) => (
                      <SelectItem key={group} value={group}>
                        {group}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Contact Details Section */}
              <div className="md:col-span-2 text-lg font-semibold text-primary-foreground bg-primary/10 p-3 rounded-md shadow-sm mt-6">Contact Details</div>
              <div className="space-y-2">
                <Label htmlFor="mobileNumber">Mobile Number</Label>
                <Input
                  id="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                  placeholder="+91 XXXXXXXXXX"
                  required
                  className="rounded-md border-input focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email ID</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@lodha.com"
                  required
                  className="rounded-md border-input focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="adharNumber">Aadhar Number</Label>
                <Input
                  id="adharNumber"
                  value={formData.adharNumber}
                  onChange={(e) => setFormData({ ...formData, adharNumber: e.target.value })}
                  placeholder="XXXX XXXX XXXX"
                  required
                  className="rounded-md border-input focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                />
              </div>
              {/* Added empty div to push next section to new row if needed */}
              <div className="hidden md:block"></div>


              {/* Work Details Section */}
              <div className="md:col-span-2 text-lg font-semibold text-primary-foreground bg-primary/10 p-3 rounded-md shadow-sm mt-6">Work Details</div>
              <div className="space-y-2">
                <Label htmlFor="designation">Designation/Trade</Label>
                <Select value={formData.designation} onValueChange={(value) => setFormData({ ...formData, designation: value })} required>
                  <SelectTrigger className="rounded-md border-input focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                    <SelectValue placeholder="Select Designation/Trade" />
                  </SelectTrigger>
                  <SelectContent>
                    {designations.map((designation) => (
                      <SelectItem key={designation} value={designation}>
                        {designation}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="vendor">Select Vendor</Label>
                <Select value={formData.vendor} onValueChange={(value) => setFormData({ ...formData, vendor: value })} required>
                  <SelectTrigger className="rounded-md border-input focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                    <SelectValue placeholder="Select Vendor" />
                  </SelectTrigger>
                  <SelectContent>
                    {vendors.map((vendor) => (
                      <SelectItem key={vendor} value={vendor}>
                        {vendor}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reportedToIncharge">Reported to Incharge</Label>
                <Select value={formData.reportedToIncharge} onValueChange={(value) => setFormData({ ...formData, reportedToIncharge: value })} required>
                  <SelectTrigger className="rounded-md border-input focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                    <SelectValue placeholder="Select Incharge" />
                  </SelectTrigger>
                  <SelectContent>
                    {inchargeOptions.map((incharge) => (
                      <SelectItem key={incharge} value={incharge}>
                        {incharge}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Added empty div to push next section to new row if needed */}
              <div className="hidden md:block"></div>

              {/* Document Uploads Section */}
              <div className="md:col-span-2 text-lg font-semibold text-primary-foreground bg-primary/10 p-3 rounded-md shadow-sm mt-6">Document Uploads</div>

              <div className="space-y-2">
                <Label htmlFor="photoUpload">Photo Upload</Label>
                <Input
                  id="photoUpload"
                  type="file"
                  onChange={(e) => handleFileChange(e, "photoUpload")}
                  className="rounded-md border-input focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                />
                {formData.photoUpload && <p className="text-xs text-muted-foreground mt-1">Current: {formData.photoUpload}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="selfDeclarationUpload">Self Declaration Upload</Label>
                <Input
                  id="selfDeclarationUpload"
                  type="file"
                  onChange={(e) => handleFileChange(e, "selfDeclarationUpload")}
                  className="rounded-md border-input focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                />
                {formData.selfDeclarationUpload && <p className="text-xs text-muted-foreground mt-1">Current: {formData.selfDeclarationUpload}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="medicalCertificateUpload">Medical Certificate (Form 28)</Label>
                <Input
                  id="medicalCertificateUpload"
                  type="file"
                  onChange={(e) => handleFileChange(e, "medicalCertificateUpload")}
                  className="rounded-md border-input focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                />
                {formData.medicalCertificateUpload && <p className="text-xs text-muted-foreground mt-1">Current: {formData.medicalCertificateUpload}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="appointmentLetterUpload">Appointment Letter Upload</Label>
                <Input
                  id="appointmentLetterUpload"
                  type="file"
                  onChange={(e) => handleFileChange(e, "appointmentLetterUpload")}
                  className="rounded-md border-input focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                />
                {formData.appointmentLetterUpload && <p className="text-xs text-muted-foreground mt-1">Current: {formData.appointmentLetterUpload}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="adharFrontUpload">Aadhar Front Upload</Label>
                <Input
                  id="adharFrontUpload"
                  type="file"
                  onChange={(e) => handleFileChange(e, "adharFrontUpload")}
                  className="rounded-md border-input focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                />
                {formData.adharFrontUpload && <p className="text-xs text-muted-foreground mt-1">Current: {formData.adharFrontUpload}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="additionalDocument1Upload">Additional Document 1</Label>
                <Input
                  id="additionalDocument1Upload"
                  type="file"
                  onChange={(e) => handleFileChange(e, "additionalDocument1Upload")}
                  className="rounded-md border-input focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                />
                {formData.additionalDocument1Upload && <p className="text-xs text-muted-foreground mt-1">Current: {formData.additionalDocument1Upload}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="additionalDocument2Upload">Additional Document 2</Label>
                <Input
                  id="additionalDocument2Upload"
                  type="file"
                  onChange={(e) => handleFileChange(e, "additionalDocument2Upload")}
                  className="rounded-md border-input focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                />
                {formData.additionalDocument2Upload && <p className="text-xs text-muted-foreground mt-1">Current: {formData.additionalDocument2Upload}</p>}
              </div>

              <div className="flex justify-end space-x-2 pt-6 md:col-span-2"> {/* Ensure buttons span both columns */}
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)} className="px-5 py-2 rounded-md">
                  Cancel
                </Button>
                <Button type="submit" className="px-5 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90">
                  {editingUser ? "Update Details" : "Add User"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-border shadow-lg rounded-lg">
        <CardHeader className="border-b border-border pb-4">
          <CardTitle className="text-xl font-semibold text-foreground">Registered Users & Labourers</CardTitle>
          <CardDescription className="text-muted-foreground">
            Activate, deactivate, or manage user and labourer credentials
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[50px]">Sr</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Designation/Trade</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user, index) => (
                  <TableRow key={user.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>
                      <div className="font-medium text-foreground">{user.nameOfInductee}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Mail className="h-3.5 w-3.5" />
                        {user.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="px-3 py-1 text-xs font-semibold rounded-full bg-secondary text-secondary-foreground">
                        {user.designation}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Phone className="h-3.5 w-3.5" />
                        {user.mobileNumber}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        {user.lastLogin}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.status === "active" ? "default" : "destructive"} className="px-3 py-1 text-xs font-semibold rounded-full">
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full hover:bg-blue-100/50 text-blue-600 hover:text-blue-700"
                          onClick={() => handleEdit(user)}
                          title="Edit User"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={`rounded-full ${user.status === "active" ? "hover:bg-yellow-100/50 text-yellow-600 hover:text-yellow-700" : "hover:bg-green-100/50 text-green-600 hover:text-green-700"}`}
                          onClick={() => handleSuspend(user.id)}
                          title={user.status === "active" ? "Suspend User" : "Activate User"}
                        >
                          <Ban className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full hover:bg-red-100/50 text-red-600 hover:text-red-700" title="Delete User">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="rounded-lg shadow-xl">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-xl font-semibold text-destructive">Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription className="text-muted-foreground">
                                This action cannot be undone. This will permanently delete the user
                                and remove their access from the system.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="pt-4">
                              <AlertDialogCancel className="px-5 py-2 rounded-md">Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(user.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90 px-5 py-2 rounded-md"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

