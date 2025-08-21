import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Ban, Trash2, Phone, Mail, Clock, Eye, Calendar, User, ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
//import Image from 'next/image';

// Assuming these functions are correctly implemented elsewhere
import { fetchlabormanagementdata, addlabormanagement, updatelabormanagement, suspendLabormanagement, getLabourerDetails, deleteLabourer } from "../../../api";

export default function LoginManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const [labourer, setLabourer] = useState(null);
  const [users, setUsers] = useState([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [viewingUser, setViewingUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(10);

  const [formData, setFormData] = useState({
    nameOfInductee: "",
    dateOfBirth: "",
    age: "",
    gender: "",
    bloodGroup: "",
    mobileNumber: "",
    email: "",
    adharNumber: "",
    designation: "",
    vendor: "",
    reportedToIncharge: "",
    photoUpload: "",
    selfDeclarationUpload: "",
    medicalCertificateUpload: "",
    appointmentLetterUpload: "",
    adharFrontUpload: "",
    additionalDocument1Upload: "",
    additionalDocument2Upload: "",
    laborerId: "", // Corrected key to match the form field
  });

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

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  const fetchlabormanagement = async () => {
    setLoading(true); // Set loading to true before fetching
    try {
      const data = await fetchlabormanagementdata();
      const mapped = data.map((user) => ({
        id: user.lab_id,
        laborerId: user.laborer_id, // Ensure this maps from the API response
        nameOfInductee: user.lab_name,
        dateOfBirth: user.date_of_birth,
        email: user.email_id,
        mobileNumber: user.mobile_number,
        age: user.age,
        gender: user.gender,
        designation: user.designation_trade,
        bloodGroup: user.blood_group,
        status: user.status || "active",
      }));
      setUsers(mapped);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load labour management data.");
      setLoading(false);
      toast({
        title: "Fetch Error",
        description: "Failed to load labour management data.",
        variant: "destructive",
      });
    }
  };

  // This useEffect fetches all labourers on initial load.
  useEffect(() => {
    fetchlabormanagement();
  }, []);

  // This useEffect fetches detailed user info when a user is selected for viewing.
  useEffect(() => {
    const fetchLabourerDetails = async () => {
      if (viewingUser && viewingUser.id) { // Check if both viewingUser and lab_id exist
        setLoading(true);
        setError(null);
        try {
          const details = await getLabourerDetails(viewingUser.id); // Pass lab_id
          setLabourer(details);
          setViewingUser(details); // Update viewing user with full details
        } catch (err) {
          // ... error handling
        } finally {
          setLoading(false);
        }
      }
    };

    fetchLabourerDetails();
  }, [viewingUser]);

  const inchargeOptions = ["N/A", ...users.map(user => `${user.nameOfInductee} (${user.designation})`)];

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, [fieldName]: file.name });
    } else {
      setFormData({ ...formData, [fieldName]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newLabourerData = {
      lab_Name: formData.nameOfInductee,
      Date_Of_Birth: formData.dateOfBirth,
      Age: parseInt(formData.age),
      Gender: formData.gender,
      Blood_Group: formData.bloodGroup,
      Mobile_Number: formData.mobileNumber,
      Email_ID: formData.email,
      Aadhar_Number: formData.adharNumber,
      Designation_Trade: formData.designation,
      Select_Vendor: formData.vendor,
      Reported_to_Incharge: formData.reportedToIncharge,
      Photo_Upload: formData.photoUpload,
      Self_Declaration_Upload: formData.selfDeclarationUpload,
      Medical_Certificate: formData.medicalCertificateUpload,
      Appointment_Letter_Upload: formData.appointmentLetterUpload,
      Aadhar_Front_Upload: formData.adharFrontUpload,
      Additional_Document_1: formData.additionalDocument1Upload,
      Additional_Document_2: formData.additionalDocument2Upload,
      // Corrected key to match the API's expected field
      Laborer_ID: formData.laborerId
    };

    try {
      if (editingUser) {
        await updatelabormanagement(editingUser.id, newLabourerData);
        fetchlabormanagement(); // Re-fetch to get updated data
        toast({
          title: "User Updated",
          description: "User details have been successfully updated.",
        });
        setEditingUser(null);
      } else {
        const newLabourer = await addlabormanagement(newLabourerData);
        fetchlabormanagement(); // Re-fetch to get new data
        toast({
          title: "User Added",
          description: "New user has been successfully added to the system.",
        });
      }
    } catch (error) {
      console.error("Failed to add or update user:", error);
      toast({
        title: "Error",
        description: "Failed to save user data. Please try again.",
        variant: "destructive",
      });
    } finally {
      resetFormData();
      setIsAddDialogOpen(false);
    }
  };

  const handleViewUser = async (labId) => {
    setLabourer(null);
    setError(null);
    setLoading(true);

    try {
      const details = await getLabourerDetails(labId);
      setLabourer(details);
      setViewingUser(details); // Open the dialog by setting the viewing user
    } catch (err) {
      console.error('Failed to fetch labourer details:', err);
      setError(err.response?.data?.error || 'Failed to fetch details.');
      setViewingUser(null); // Close dialog on error
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    if (!user || typeof user !== 'object') {
      console.error("Invalid user object passed to handleEdit.");
      return;
    }
    setEditingUser(user);
    setFormData({
      nameOfInductee: user.nameOfInductee || '',
      dateOfBirth: user.dateOfBirth || '',
      age: user.age || '',
      gender: user.gender || '',
      designation: user.designation || '',
      bloodGroup: user.bloodGroup || '',
      photoUpload: user.photoUpload || '',
      selfDeclarationUpload: user.selfDeclarationUpload || '',
      medicalCertificateUpload: user.medicalCertificateUpload || '',
      additionalDocument1Upload: user.additionalDocument1Upload || '',
      additionalDocument2Upload: user.additionalDocument2Upload || '',
      reportedToIncharge: user.reportedToIncharge || '',
      appointmentLetterUpload: user.appointmentLetterUpload || '',
      vendor: user.vendor || '',
      adharFrontUpload: user.adharFrontUpload || '',
      adharNumber: user.adharNumber || '',
      mobileNumber: user.mobileNumber || '',
      email: user.email || '',
      laborerId: user.laborerId || '' // Corrected key here as well
    });
    setIsAddDialogOpen(true);
  };

  const handleSuspend = async (userId) => {
    const userToUpdate = users.find(user => user.id === userId);

    if (!userToUpdate) return;

    const newStatus = userToUpdate.status === "active" ? "suspended" : "active";

    try {
      await suspendLabormanagement(userId, newStatus);
      setUsers(users.map(user =>
        user.id === userId
          ? { ...user, status: newStatus }
          : user
      ));
      toast({
        title: "User Status Changed",
        description: `User access has been set to ${newStatus}.`,
      });
    } catch (error) {
      console.error("Failed to update user status:", error);
      toast({
        title: "Error",
        description: "Failed to update user status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const resetFormData = () => {
    setFormData({
      nameOfInductee: "",
      dateOfBirth: "",
      age: "",
      gender: "",
      bloodGroup: "",
      mobileNumber: "",
      email: "",
      adharNumber: "",
      designation: "",
      vendor: "",
      reportedToIncharge: "",
      photoUpload: "",
      selfDeclarationUpload: "",
      medicalCertificateUpload: "",
      appointmentLetterUpload: "",
      adharFrontUpload: "",
      additionalDocument1Upload: "",
      additionalDocument2Upload: "",
      laborerId: "", // Corrected key
    });
  };

  const handleDelete = async (labId) => {
    try {
      const result = await deleteLabourer(labId);
      if (result.success) {
        toast({
          title: "User Deleted",
          description: result.message,
        });
        fetchlabormanagement();
      } else {
        toast({
          title: "Deletion Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to delete labourer:", error);
      toast({
        title: "Error",
        description: "Failed to delete labourer. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Pagination Logic
  const filteredUsers = users.filter((user) =>
    (user.nameOfInductee || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.mobileNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.laborerId || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredUsers.slice(indexOfFirstRecord, indexOfLastRecord);
  const nPages = Math.ceil(filteredUsers.length / recordsPerPage);

  const nextPage = () => {
    if (currentPage < nPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= nPages) {
      setCurrentPage(pageNumber);
    }
  };

  const pageNumbers = [...Array(nPages + 1).keys()].slice(1);

  return (
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
                  email: "",
                  laborerId: ""
                });
              }}>
              <Plus className="h-4 w-4 mr-2" />
              Add New User / Labourer
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-screen-lg p-6 rounded-lg shadow-xl overflow-y-auto max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold text-primary">{editingUser ? "Edit User Details" : "Add New User / Labourer"}</DialogTitle>
              <DialogDescription className="text-muted-foreground mt-1">
                {editingUser ? "Update the details for the selected user." : "Enter the comprehensive details for the new user or labourer."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div className="md:col-span-2 text-lg font-semibold text-primary-foreground bg-primary/90 p-3 rounded-md shadow-sm">Personal Details</div>
              <div className="space-y-2">
                <Label htmlFor="laborerId">Laborer ID</Label>
                <Input
                  id="laborerId"
                  value={formData.laborerId} // Corrected to use laborerId
                  onChange={(e) => setFormData({ ...formData, laborerId: e.target.value })}
                  placeholder="Enter Laborer ID"
                  required
                  className="rounded-md border-input focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                />
              </div>
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
              <div className="md:col-span-2 text-lg font-semibold text-primary-foreground bg-primary/90 p-3 rounded-md shadow-sm mt-6">Contact Details</div>
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
              <div className="hidden md:block"></div>
              <div className="md:col-span-2 text-lg font-semibold text-primary-foreground bg-primary/90 p-3 rounded-md shadow-sm mt-6">Work Details</div>
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
              <div className="hidden md:block"></div>
              <div className="md:col-span-2 text-lg font-semibold text-primary-foreground bg-primary/90 p-3 rounded-md shadow-sm mt-6">Document Uploads</div>
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
                {formData.appointmentLetterUpload && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Current: {typeof formData.appointmentLetterUpload === 'string' ? formData.appointmentLetterUpload : formData.appointmentLetterUpload.name}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="adharFrontUpload">Aadhar Front Upload</Label>
                <Input
                  id="adharFrontUpload"
                  type="file"
                  onChange={(e) => handleFileChange(e, "adharFrontUpload")}
                  className="rounded-md border-input focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                />
                {formData.adharFrontUpload && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Current: {typeof formData.adharFrontUpload === 'string' ? formData.adharFrontUpload : formData.adharFrontUpload.name}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="additionalDocument1Upload">Additional Document 1</Label>
                <Input
                  id="additionalDocument1Upload"
                  type="file"
                  onChange={(e) => handleFileChange(e, "additionalDocument1Upload")}
                  className="rounded-md border-input focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                />
                {formData.additionalDocument1Upload && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Current: {typeof formData.additionalDocument1Upload === 'string' ? formData.additionalDocument1Upload : formData.additionalDocument1Upload.name}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="additionalDocument2Upload">Additional Document 2</Label>
                <Input
                  id="additionalDocument2Upload"
                  type="file"
                  onChange={(e) => handleFileChange(e, "additionalDocument2Upload")}
                  className="rounded-md border-input focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                />
                {formData.additionalDocument2Upload && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Current: {typeof formData.additionalDocument2Upload === 'string' ? formData.additionalDocument2Upload : formData.additionalDocument2Upload.name}
                  </p>
                )}
              </div>
              <div className="flex justify-end space-x-2 pt-6 md:col-span-2">
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
      {loading && (
        <div className="text-center p-8">
          <p>Loading data...</p>
        </div>
      )}
      {error && (
        <div className="text-center p-8 text-red-500">
          <p>Error: {error}</p>
        </div>
      )}
      {!loading && !error && users.length === 0 && (
        <div className="text-center p-8 text-muted-foreground">
          <p>No users or labourers found.</p>
        </div>
      )}
      {!loading && !error && users.length > 0 && (
        <Card className="bg-card border-border shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-border p-4">
            <div className="flex flex-col">
              <CardTitle className="text-2xl font-bold tracking-tight text-foreground">Registered Users & Labourers</CardTitle>
              <CardDescription className="text-muted-foreground mt-1">
                Activate, deactivate, or manage user and labourer credentials
              </CardDescription>
            </div>
            <Input
              type="text"
              placeholder="Search by name, ID or number..."
              value={searchTerm}
              onChange={handleSearch}
              className="max-w-xs rounded-md border-input focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            />
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold">Sr</TableHead>
                      <TableHead className="font-semibold">Name / ID</TableHead>
                      <TableHead className="font-semibold">Designation</TableHead>
                      <TableHead className="font-semibold">Contact</TableHead>
                      <TableHead className="font-semibold">Gender / Blood Group</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold">Documents</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentRecords.map((user, index) => (
                      <TableRow key={user.id}>
                        <TableCell>{indexOfFirstRecord + index + 1}</TableCell>
                        <TableCell>
                          <div>{user.nameOfInductee}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            ID: {user.laborerId || "-"}
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(user.dateOfBirth).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {user.age} years
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{user.designation}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {user.mobileNumber || "-"}
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {user.email || "-"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>{user.gender}</div>
                          <div>{user.bloodGroup}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.status === "active" ? "success" : "destructive"}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewUser(user.id)}
                          >
                            <Eye className="h-4 w-4 text-blue-600" />
                          </Button>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-1 justify-end">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleEdit(user)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            {/* Suspend/Activate Alert Dialog */}
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="icon" variant="ghost">
                                  <Ban className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Are you sure you want to {user.status === 'active' ? 'suspend' : 'activate'} this user?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action will change the user's status. They can be restored later.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleSuspend(user.id)}
                                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                                  >
                                    Confirm
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                            {/* Delete Alert Dialog */}
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will deactivate the labor from the system. They can be restored later if needed, but will no longer appear in the active list.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(user.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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
            </div>
            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4">
              <Button
                variant="outline"
                onClick={prevPage}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              <div className="flex space-x-1">
                {pageNumbers.map(page => (
                  <Button
                    key={page}
                    variant={page === currentPage ? "default" : "outline"}
                    onClick={() => goToPage(page)}
                  >
                    {page}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                onClick={nextPage}
                disabled={currentPage === nPages}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Dialog open={!!viewingUser} onOpenChange={(open) => !open && setViewingUser(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Labourer Details and Documents</DialogTitle>
            <DialogDescription>Details and photos of the selected labourer</DialogDescription>
          </DialogHeader>
          {viewingUser && (
            <div className="grid gap-6 py-4 max-h-[70vh] overflow-y-auto pr-2">
              {/* Personal Information Section */}
              <div className="border rounded-lg p-4 bg-muted/50">
                <h3 className="text-md font-medium mb-4">Personal Information</h3>
                <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
                  <div className="flex flex-col"><span className="font-semibold">Laborer ID:</span><span>{viewingUser.laborer_id || "-"}</span></div>
                  <div className="flex flex-col"><span className="font-semibold">Name:</span><span>{viewingUser.lab_name}</span></div>
                  <div className="flex flex-col"><span className="font-semibold">Date of Birth:</span><span>{new Date(viewingUser.date_of_birth).toLocaleDateString()}</span></div>
                  <div className="flex flex-col"><span className="font-semibold">Age:</span><span>{viewingUser.age}</span></div>
                  <div className="flex flex-col"><span className="font-semibold">Gender:</span><span>{viewingUser.gender}</span></div>
                  <div className="flex flex-col"><span className="font-semibold">Blood Group:</span><span>{viewingUser.blood_group}</span></div>
                  <div className="flex flex-col col-span-2"><span className="font-semibold">Mobile Number:</span><span>{viewingUser.mobile_number}</span></div>
                  <div className="flex flex-col col-span-2"><span className="font-semibold">Email ID:</span><span>{viewingUser.email_id}</span></div>
                  <div className="flex flex-col col-span-2"><span className="font-semibold">Aadhar Number:</span><span>{viewingUser.aadhar_number}</span></div>
                  <div className="flex flex-col"><span className="font-semibold">Designation:</span><span>{viewingUser.designation_trade}</span></div>
                  <div className="flex flex-col"><span className="font-semibold">Vendor:</span><span>{viewingUser.select_vendor}</span></div>
                  <div className="flex flex-col col-span-2"><span className="font-semibold">Reported to Incharge:</span><span>{viewingUser.reported_to_incharge}</span></div>
                </div>
              </div>
              {/* Document Status Section */}
              <div className="border rounded-lg p-4">
                <h3 className="text-md font-medium mb-4">Document Status</h3>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span>Photo Upload:</span>
                    <Badge variant={viewingUser.photo_upload ? "default" : "secondary"}>
                      {viewingUser.photo_upload ? "Uploaded" : "Not Uploaded"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Self Declaration:</span>
                    <Badge variant={viewingUser.self_declaration_upload ? "default" : "secondary"}>
                      {viewingUser.self_declaration_upload ? "Uploaded" : "Not Uploaded"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Medical Certificate:</span>
                    <Badge variant={viewingUser.medical_certificate ? "default" : "secondary"}>
                      {viewingUser.medical_certificate ? "Uploaded" : "Not Uploaded"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Appointment Letter:</span>
                    <Badge variant={viewingUser.appointment_letter_upload ? "default" : "secondary"}>
                      {viewingUser.appointment_letter_upload ? "Uploaded" : "Not Uploaded"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Aadhar Front:</span>
                    <Badge variant={viewingUser.aadhar_front_upload ? "default" : "secondary"}>
                      {viewingUser.aadhar_front_upload ? "Uploaded" : "Not Uploaded"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Additional Document 1:</span>
                    <Badge variant={viewingUser.additional_document_1 ? "default" : "secondary"}>
                      {viewingUser.additional_document_1 ? "Uploaded" : "Not Uploaded"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Additional Document 2:</span>
                    <Badge variant={viewingUser.additional_document_2 ? "default" : "secondary"}>
                      {viewingUser.additional_document_2 ? "Uploaded" : "Not Uploaded"}
                    </Badge>
                  </div>
                </div>
              </div>
              {/* Images Section - New Code */}
              <div className="border rounded-lg p-4">
                <h3 className="text-md font-medium mb-4">Uploaded Documents</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Conditional rendering for Photo Upload */}
                  {viewingUser.photo_upload && viewingUser.photo_upload_url && (
                    <div className="flex flex-col items-center">
                      <span className="font-semibold text-sm mb-2">Labourer Photo</span>
                      <div className="relative w-full h-48 border rounded-lg overflow-hidden">
                        <Image
                          src={viewingUser.photo_upload_url}
                          alt="Labourer Photo"
                          layout="fill"
                          objectFit="contain"
                          className="p-2"
                        />
                      </div>
                    </div>
                  )}
                  {/* Conditional rendering for Aadhar Front */}
                  {viewingUser.aadhar_front_upload && viewingUser.aadhar_front_url && (
                    <div className="flex flex-col items-center">
                      <span className="font-semibold text-sm mb-2">Aadhar Front</span>
                      <div className="relative w-full h-48 border rounded-lg overflow-hidden">
                        <Image
                          src={viewingUser.aadhar_front_url}
                          alt="Aadhar Front"
                          layout="fill"
                          objectFit="contain"
                          className="p-2"
                        />
                      </div>
                    </div>
                  )}
                  {/* You can add more image sections here for other documents like Medical Certificate, etc. */}
                  {/* Example for Medical Certificate */}
                  {viewingUser.medical_certificate && viewingUser.medical_certificate_url && (
                    <div className="flex flex-col items-center">
                      <span className="font-semibold text-sm mb-2">Medical Certificate</span>
                      <div className="relative w-full h-48 border rounded-lg overflow-hidden">
                        <Image
                          src={viewingUser.medical_certificate_url}
                          alt="Medical Certificate"
                          layout="fill"
                          objectFit="contain"
                          className="p-2"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}