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
import { Plus, Edit, Ban, Trash2, Phone, MapPin, Building, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function LaborManagement() {
  const { toast } = useToast();
  const [laborers, setLaborers] = useState([
    {
      id: "LAB001",
      name: "Rajesh Kumar",
      gender: "Male",
      domicile: "Uttar Pradesh",
      phone: "+91 9876543210",
      contractorId: "1",
      contractorName: "ABC Construction Pvt Ltd",
      joinDate: "2024-01-01",
      idNumber: "LAB001",
      status: "active"
    },
    {
      id: "LAB002",
      name: "Sunita Devi",
      gender: "Female",
      domicile: "Bihar",
      phone: "+91 9876543211",
      contractorId: "1",
      contractorName: "ABC Construction Pvt Ltd",
      joinDate: "2024-01-05",
      idNumber: "LAB002",
      status: "active"
    },
    {
      id: "LAB003",
      name: "Mohammed Ali",
      gender: "Male",
      domicile: "West Bengal",
      phone: "+91 9876543212",
      contractorId: "2",
      contractorName: "XYZ Builders & Contractors",
      joinDate: "2024-01-10",
      idNumber: "LAB003",
      status: "suspended"
    }
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingLaborer, setEditingLaborer] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    domicile: "",
    phone: "",
    contractorId: ""
  });

  const contractors = [
    { id: "1", name: "ABC Construction Pvt Ltd" },
    { id: "2", name: "XYZ Builders & Contractors" },
    { id: "3", name: "Singh Contractors" }
  ];

  const states = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
    "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
    "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
    "Uttarakhand", "West Bengal"
  ];

  const generateId = () => {
    const nextId = laborers.length + 1;
    return `LAB${nextId.toString().padStart(3, '0')}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingLaborer) {
      setLaborers(laborers.map(laborer =>
        laborer.id === editingLaborer.id
          ? {
              ...laborer,
              ...formData,
              contractorName: contractors.find(c => c.id === formData.contractorId)?.name || ""
            }
          : laborer
      ));
      toast({
        title: "Laborer Updated",
        description: "Laborer details have been successfully updated.",
      });
      setEditingLaborer(null);
    } else {
      const newLaborer = {
        id: generateId(),
        ...formData,
        contractorName: contractors.find(c => c.id === formData.contractorId)?.name || "",
        joinDate: new Date().toISOString().split('T')[0],
        idNumber: generateId(),
        status: "active"
      };
      setLaborers([...laborers, newLaborer]);
      toast({
        title: "Laborer Added",
        description: "New laborer has been successfully added to the system.",
      });
    }

    setFormData({ name: "", gender: "", domicile: "", phone: "", contractorId: "" });
    setIsAddDialogOpen(false);
  };

  const handleEdit = (laborer) => {
    setEditingLaborer(laborer);
    setFormData({
      name: laborer.name,
      gender: laborer.gender,
      domicile: laborer.domicile,
      phone: laborer.phone,
      contractorId: laborer.contractorId
    });
    setIsAddDialogOpen(true);
  };

  const handleSuspend = (laborerId) => {
    setLaborers(laborers.map(laborer =>
      laborer.id === laborerId
        ? { ...laborer, status: laborer.status === "active" ? "suspended" : "active" }
        : laborer
    ));
    toast({
      title: "Laborer Status Changed",
      description: "Laborer status has been updated.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Labor Management</h2>
          <p className="text-muted-foreground">
            Manage all laborers working on construction sites
          </p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingLaborer(null);
              setFormData({ name: "", gender: "", domicile: "", phone: "", contractorId: "" });
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Laborer
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingLaborer ? "Edit Laborer" : "Add Labor"}</DialogTitle>
              <DialogDescription>
                {editingLaborer ? "Update laborer details below." : "Enter the details for the new laborer."}
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
                <Label htmlFor="gender">Gender</Label>
                <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="domicile">Domicile (From which State)</Label>
                <Select value={formData.domicile} onValueChange={(value) => setFormData({ ...formData, domicile: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {states.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
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
                <Label htmlFor="contractorId">Contractor</Label>
                <Select value={formData.contractorId} onValueChange={(value) => setFormData({ ...formData, contractorId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select contractor" />
                  </SelectTrigger>
                  <SelectContent>
                    {contractors.map((contractor) => (
                      <SelectItem key={contractor.id} value={contractor.id}>
                        {contractor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingLaborer ? "Update" : "Submit"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle>Manage Laborers</CardTitle>
          <CardDescription>
            View and manage all registered laborers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sr</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Domicile</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Contractor</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {laborers.map((laborer, index) => (
                <TableRow key={laborer.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <div className="font-medium">{laborer.name}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{laborer.idNumber}</Badge>
                  </TableCell>
                  <TableCell>{laborer.gender}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                      {laborer.domicile}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <Phone className="h-3 w-3 mr-1 text-muted-foreground" />
                      {laborer.phone}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <Building className="h-3 w-3 mr-1 text-muted-foreground" />
                      {laborer.contractorName}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                      {laborer.joinDate}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={laborer.status === "active" ? "default" : "destructive"}>
                      {laborer.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(laborer)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSuspend(laborer.id)}
                      >
                        <Ban className="h-4 w-4" />
                      </Button>
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