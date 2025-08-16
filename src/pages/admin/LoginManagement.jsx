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
import { Plus, Edit, Ban, Trash2, Phone, Mail, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Import all API functions
import {
  fetchLoginmanagement,
  Addloginmanagement,
  updateLoginmanagement,
  suspendLoginmanagement,
  deleteLoginmanagement
} from "../../../api";



export default function LoginManagement() {
  const { toast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    phone: "",
    email: ""
  });

  const designations = [
    "Camp Boss",
    "Site Supervisor",
    "Foreman",
    "Safety Officer"
  ];

  const fetchUsersData = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchLoginmanagement();
      const mappedData = data.map(user => ({
        id: user.id,
        name: user.name,
        designation: user.designation,
        phone: user.phone,
        email: user.email,
        lastLogin: user.last_login || "Never", // Handle cases where last_login might be null
        status: user.status
      }));
      setUsers(mappedData);
    } catch (err) {
      setError("Failed to fetch user data.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersData();
  }, []);



  // Function that handles form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingUser) {
        // This is a safety net in case the state was set incorrectly.
        if (!editingUser.id) {
          console.error("Error: User ID is missing for the update operation.");
          toast({
            title: "Update Failed",
            description: "User ID not found. Please try again.",
            variant: "destructive"
          });
          return;
        }

        // The API call is now safe.
        await updateLoginmanagement(editingUser.id, formData);
        toast({
          title: "User Updated",
          description: "User details have been successfully updated.",
        });
      } else {
        // Call the create API
        await Addloginmanagement(formData);
        toast({
          title: "User Added",
          description: "New user has been successfully added to the system.",
        });
      }

      // After a successful API call, refresh the table
      fetchUsersData();
      setFormData({ name: "", designation: "", phone: "", email: "" });
      setEditingUser(null);
      setIsAddDialogOpen(false);
    } catch (err) {
      toast({
        title: "Action Failed",
        description: err.message || "An error occurred. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Function that handles editing
  const handleEdit = (user) => {

    setEditingUser(user);
    setFormData({
      name: user.name,
      designation: user.designation,
      phone: user.phone,
      email: user.email
    });
    setIsAddDialogOpen(true);
  };

  const handleSuspend = async (userId) => {
    try {
      const userToUpdate = users.find(user => user.id === userId);
      const newStatus = userToUpdate.status === "active" ? "suspended" : "active";

      await suspendLoginmanagement(userId, newStatus);
      fetchUsersData(); // Refresh the data

      toast({
        title: "User Status Changed",
        description: "User access has been updated.",
      });
    } catch (err) {
      toast({
        title: "Action Failed",
        description: err.message || "An error occurred while updating status.",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (userId) => {
    try {
      await deleteLoginmanagement(userId);
      fetchUsersData();
      toast({
        title: "User Deactivated",
        description: "User has been deactivated and is no longer visible in the active list.",
      });
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || "An error occurred while deactivating the user.";
      toast({
        title: "Action Failed",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };



  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredlogin = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Login Management</h2>
          <p className="text-muted-foreground">
            Manage access for camp bosses, supervisors, and foremen
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingUser(null);
              setFormData({ name: "", designation: "", phone: "", email: "" });
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Login
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingUser ? "Edit User" : "Add New Login"}</DialogTitle>
              <DialogDescription>
                {editingUser ? "Update user details below." : "Enter the details for the new user login."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter full name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="designation">Designation</Label>
                <Select value={formData.designation} onValueChange={(value) => setFormData({ ...formData, designation: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select designation" />
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
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 9876543210"
                  required
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
                />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingUser ? "Update" : "Submit"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-card border-border shadow-lg">
        <CardHeader className="relative">
          <CardTitle className="font-semibold">Manage Logins</CardTitle>
          <CardDescription>
            Activate, deactivate, or manage user login credentials
          </CardDescription>
          <Input
            type="text"
            placeholder="Search by name, designation, or number..."
            value={searchTerm}
            onChange={handleSearch}
            className="absolute right-6 top-6 w-64 rounded-md border-input focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          />
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Sr</TableHead>
                  <TableHead className="font-semibold">Name</TableHead>
                  <TableHead className="font-semibold">Designation</TableHead>
                  <TableHead className="font-semibold">Phone Number</TableHead>
                  <TableHead className="font-semibold">Last Login</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredlogin.map((user, index) => (
                  <TableRow key={user.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {user.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{user.designation}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Phone className="h-3 w-3 mr-1 text-muted-foreground" />+91{" "}
                        {user.phone}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                        {new Date(user.lastLogin).toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={user.status === "active" ? "default" : "destructive"}
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(user)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSuspend(user.id)}
                        >
                          <Ban className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle className="font-semibold">Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete the user and remove their
                                access from the system.
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
        </CardContent>
      </Card>

    </div >
  );
}