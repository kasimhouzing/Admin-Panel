import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Ban, Trash2, Phone, Mail, Building, Users, Upload, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";


// Import the suspendContractor function
import { fetchContractormanagement, addContractor, updateContractor, deleteContractor, suspendContractor } from "../../../api";

export default function ContractorManagement() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [contractors, setContractors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingContractor, setEditingContractor] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    companyName: "",
    phone: "",
    address: "",
    email: "",
    referenceFrom: "",
    totalLaborers: "",
    documents: []
  });

  const fetchContractors = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchContractormanagement();
      // Filter out soft-deleted contractors on the client-side
      const activeContractors = data.filter(contractor => contractor.active !== false);

      const mappedData = activeContractors.map(contractor => ({
        id: contractor.id,
        name: contractor.name,
        companyName: contractor.company_name,
        phone: contractor.phone,
        email: contractor.email,
        address: contractor.address,
        referenceFrom: contractor.reference_from,
        totalLaborers: contractor.total_laborers,
        status: contractor.status,
        documents: contractor.documents || []
      }));
      setContractors(mappedData);
    } catch (err) {
      setError("Failed to fetch contractor data.");
      toast({
        title: "Error",
        description: "Failed to load contractors. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContractors();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, documents: [...e.target.files] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Map formData to API format
    const apiData = {
      name: formData.name,
      companyName: formData.companyName,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      referenceFrom: formData.referenceFrom,
      totalLaborers: parseInt(formData.totalLaborers, 10),
      documents: formData.documents.map(file => file.name),
      status: formData.status, // Simulating document handling
    };

    try {
      if (editingContractor) {
        await updateContractor(editingContractor.id, apiData);
        toast({
          title: "Contractor Updated",
          description: "Contractor details have been successfully updated.",
        });
      } else {
        await addContractor(apiData);
        toast({
          title: "Contractor Added",
          description: "New contractor has been successfully added to the system.",
        });
      }
      // Refresh the list after a successful operation
      fetchContractors();
      setIsAddDialogOpen(false);
    } catch (err) {
      toast({
        title: "Error",
        description: `Failed to ${editingContractor ? "update" : "add"} contractor. Please try again.`,
        variant: "destructive"
      });
    } finally {
      setFormData({
        name: "",
        companyName: "",
        phone: "",
        email: "",
        address: "",
        referenceFrom: "",
        totalLaborers: "",
        documents: []
      });
      setEditingContractor(null);
    }
  };

  const handleEdit = (contractor) => {
    setEditingContractor(contractor);
    setFormData({
      name: contractor.name,
      companyName: contractor.companyName,
      phone: contractor.phone,
      email: contractor.email,
      address: contractor.address,
      referenceFrom: contractor.referenceFrom,
      totalLaborers: contractor.totalLaborers,
      documents: contractor.documents,
      status: contractor.status,
    });
    setIsAddDialogOpen(true);
  };

  const handleSuspend = async (contractorId, currentStatus) => {
    try {
      const newStatus = currentStatus === "active" ? "suspended" : "active";

      await suspendContractor(contractorId, newStatus);

      fetchContractors();
      toast({
        title: "Contractor Status Changed",
        description: `Contractor status has been changed to ${newStatus}.`,
      });
    } catch (err) {
      console.error("Error changing contractor status:", err);
      toast({
        title: "Error",
        description: "Failed to change contractor status. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Change the handleDelete function to reflect soft deletion
  const handleDelete = async (contractorId) => {
    try {
      await deleteContractor(contractorId);
      // After soft deleting, refetch the list to remove the contractor from the view
      fetchContractors();
      toast({
        title: "Contractor Deactivated",
        description: "Contractor has been deactivated from the system.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to deactivate contractor. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p>Loading contractors...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96 text-red-500">
        <p>{error}</p>
      </div>
    );
  }
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };


  const filteredContractors = contractors.filter((contractor) =>
    contractor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contractor.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Contractor Management</h2>
          <p className="text-muted-foreground">
            Manage labor contractors and suppliers for your construction sites
          </p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingContractor(null);
              setFormData({
                name: "",
                companyName: "",
                phone: "",
                email: "",
                address: "",
                referenceFrom: "",
                totalLaborers: "",
                documents: []
              });
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Contractor
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingContractor ? "Edit Contractor" : "Add Labor Contractor"}</DialogTitle>
              <DialogDescription>
                {editingContractor ? "Update contractor details below." : "Enter the details for the new labor contractor."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Contact person name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="Company/Contractor name"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 9876543210"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="contractor@company.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Complete business address"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="referenceFrom">Reference From</Label>
                  <Input
                    id="referenceFrom"
                    value={formData.referenceFrom}
                    onChange={handleChange}
                    placeholder="How did you find this contractor?"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="totalLaborers">Total Laborers</Label>
                  <Input
                    id="totalLaborers"
                    type="number"
                    value={formData.totalLaborers}
                    onChange={handleChange}
                    placeholder="e.g., 50"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="documents">Upload Documents</Label>
                <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PDF, JPG, PNG up to 10MB each
                  </p>
                  <Input
                    id="documents"
                    type="file"
                    className="hidden"
                    multiple
                    onChange={handleFileChange}
                  />
                  <Label htmlFor="documents" className="inline-flex mt-2 items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
                    Choose Files
                  </Label>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingContractor ? "Update" : "Submit"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>


      <Card className="border-border shadow-sm">
        <CardHeader className="relative">
          <CardTitle>Manage Labor Contractors</CardTitle>
          <CardDescription>
            View and manage all registered labor contractors and suppliers
          </CardDescription>
          <Input
            type="text"
            placeholder="Search by name, or number..."
            value={searchTerm}
            onChange={handleSearch}
            className="absolute right-6 top-6 w-64 rounded-md border-input focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          />
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sr</TableHead>
                <TableHead>Name (Company)</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Documents</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContractors.map((contractor, index) => (
                <TableRow key={contractor.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{contractor.name}</div>
                      <div className="text-sm text-muted-foreground flex items-center">
                        <Building className="h-3 w-3 mr-1" />
                        {contractor.companyName}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Phone className="h-3 w-3 mr-1 text-muted-foreground" />
                        {contractor.phone}
                      </div>
                      <div className="flex items-center text-sm">
                        <Mail className="h-3 w-3 mr-1 text-muted-foreground" />
                        {contractor.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={contractor.status === "active" ? "default" : "destructive"}>
                      {contractor.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{contractor.documents.length} files</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(contractor)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSuspend(contractor.id, contractor.status)}
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
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will deactivate the contractor from the system. They can be restored later if needed, but will no longer appear in the active list.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(contractor.id)}
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
        </CardContent>
      </Card>
    </div>
  );
}