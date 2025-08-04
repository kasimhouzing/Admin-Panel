import { useState } from "react";
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

export default function ContractorManagement() {
  const { toast } = useToast();
  const [contractors, setContractors] = useState([
    {
      id: "1",
      name: "Rajesh Sharma",
      companyName: "ABC Construction Pvt Ltd",
      phone: "+91 9876543210",
      email: "rajesh@abcconstruction.com",
      address: "123 Industrial Area, Mumbai, Maharashtra 400001",
      referenceFrom: "Previous Project - Lodha Park",
      totalLaborers: 45,
      status: "active",
      documents: ["license.pdf", "registration.pdf"]
    },
    {
      id: "2",
      name: "Sunil Patil",
      companyName: "XYZ Builders & Contractors",
      phone: "+91 9876543211",
      email: "sunil@xyzbuilders.com",
      address: "456 Construction Hub, Pune, Maharashtra 411001",
      referenceFrom: "Referral - Lodha Palava",
      totalLaborers: 62,
      status: "active",
      documents: ["license.pdf", "pan.pdf", "gst.pdf"]
    },
    {
      id: "3",
      name: "Amit Singh",
      companyName: "Singh Contractors",
      phone: "+91 9876543212",
      email: "amit@singhcontractors.com",
      address: "789 Builder's Lane, Thane, Maharashtra 400601",
      referenceFrom: "Direct Application",
      totalLaborers: 28,
      status: "suspended",
      documents: ["license.pdf"]
    }
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingContractor, setEditingContractor] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    companyName: "",
    phone: "",
    email: "",
    address: "",
    referenceFrom: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingContractor) {
      setContractors(contractors.map(contractor =>
        contractor.id === editingContractor.id
          ? { ...contractor, ...formData }
          : contractor
      ));
      toast({
        title: "Contractor Updated",
        description: "Contractor details have been successfully updated.",
      });
      setEditingContractor(null);
    } else {
      const newContractor = {
        id: (contractors.length + 1).toString(),
        ...formData,
        totalLaborers: 0,
        status: "active",
        documents: []
      };
      setContractors([...contractors, newContractor]);
      toast({
        title: "Contractor Added",
        description: "New contractor has been successfully added to the system.",
      });
    }

    setFormData({ name: "", companyName: "", phone: "", email: "", address: "", referenceFrom: "" });
    setIsAddDialogOpen(false);
  };

  const handleEdit = (contractor) => {
    setEditingContractor(contractor);
    setFormData({
      name: contractor.name,
      companyName: contractor.companyName,
      phone: contractor.phone,
      email: contractor.email,
      address: contractor.address,
      referenceFrom: contractor.referenceFrom
    });
    setIsAddDialogOpen(true);
  };

  const handleSuspend = (contractorId) => {
    setContractors(contractors.map(contractor =>
      contractor.id === contractorId
        ? { ...contractor, status: contractor.status === "active" ? "suspended" : "active" }
        : contractor
    ));
    toast({
      title: "Contractor Status Changed",
      description: "Contractor status has been updated.",
    });
  };

  const handleDelete = (contractorId) => {
    setContractors(contractors.filter(contractor => contractor.id !== contractorId));
    toast({
      title: "Contractor Deleted",
      description: "Contractor has been permanently removed from the system.",
      variant: "destructive"
    });
  };

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
              setFormData({ name: "", companyName: "", phone: "", email: "", address: "", referenceFrom: "" });
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
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contact person name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Complete business address"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="referenceFrom">Reference From</Label>
                <Input
                  id="referenceFrom"
                  value={formData.referenceFrom}
                  onChange={(e) => setFormData({ ...formData, referenceFrom: e.target.value })}
                  placeholder="How did you find this contractor?"
                  required
                />
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
                  <Button type="button" variant="outline" size="sm" className="mt-2">
                    Choose Files
                  </Button>
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
        <CardHeader>
          <CardTitle>Manage Labor Contractors</CardTitle>
          <CardDescription>
            View and manage all registered labor contractors and suppliers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sr</TableHead>
                <TableHead>Name (Company)</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Total Laborers</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Documents</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contractors.map((contractor, index) => (
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
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span className="font-medium">{contractor.totalLaborers}</span>
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
                        onClick={() => handleSuspend(contractor.id)}
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
                              This action cannot be undone. This will permanently delete the contractor
                              and all associated data from the system.
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