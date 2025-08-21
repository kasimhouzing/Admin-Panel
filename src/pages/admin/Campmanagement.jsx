
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Edit, Trash2, Users, Building, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { fetchcampmanagement, fetchlaborsmanagement, updateLaborerRoom, fetchroommanagement, insertRoom, deallocateLaborer, deactivateRoom } from "../../../api";

const campManagement = () => {
    const { toast } = useToast();

    // ---------- ROOMS ----------
    const [rooms, setRooms] = useState([]);

    // ---------- DIALOG / FORM STATE ----------
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDialogEdit, setIsDialogEdit] = useState(false);
    const [isAllocateDialogOpen, setIsAllocateDialogOpen] = useState(false);
    const [editingRoom, setEditingRoom] = useState(null);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [allocationName, setAllocationName] = useState("");
    const [error, setError] = useState(null);
    const [allocatedLabors, setAllocatedLabors] = useState([]);

    // Corrected state for all labors
    const [labors, setLabors] = useState([]);

    // Corrected state for selected labors in the allocation dialog
    const [selectedLabors, setSelectedLabors] = useState([]);

    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        capacity: "",
        laborss: [],
    });
    const [searchTerm, setSearchTerm] = useState("");

    const fetchRooms = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await fetchcampmanagement();
            const mappedData = data.map(room => ({
                id: room.id,
                room: room.room,
                capacity: room.capacity,
                actualOccupancy: room.actual,
            }));
            setRooms(mappedData);
        } catch (err) {
            console.error("Failed to fetch room data:", err);
            setError("Failed to fetch room data.");
        } finally {
            setIsLoading(false);
        }
    };
    const fetchLabors = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await fetchlaborsmanagement();
            const mappedData = data.map(labor => ({
                id: labor.lab_id,
                lab_Name: labor.lab_name,
                Mobile_Number: labor.mobile_number,
                Aadhar_Number: labor.aadhar_number,
                Photo_Upload: labor.photo_upload || 'placeholder.jpg',
            }));
            setLabors(mappedData);
        } catch (err) {
            console.error("Failed to fetch labors data:!", err);
            setError("Failed to fetch labors data!.");
        } finally {
            setIsLoading(false);
        }
    };


    const fetchLaborsroom = async (roomName) => {
        setIsLoading(true);
        try {
            const data = await fetchroommanagement(roomName);
            const mappedData = data.map((laborroom) => ({
                lab_id: laborroom.lab_id,
                room: laborroom.room,
                lab_Name: laborroom.lab_name, // Corrected from lab_Name to lab_name
                Mobile_Number: laborroom.mobile_number, // Corrected from Mobile_Number to mobile_number
            }));
            setAllocatedLabors(mappedData);
        } catch (err) {
            console.error("Failed to fetch labors data:", err);
            setError("Failed to fetch labors data.");
        } finally {
            setIsLoading(false);
        }
    };


    useEffect(() => {
        fetchRooms();
        fetchLabors();
    }, []);

    // A new useEffect to fetch allocated labors whenever the editing room changes
    useEffect(() => {
        if (editingRoom && isDialogEdit) {
            fetchLaborsroom(editingRoom.room);
        }
    }, [editingRoom, isDialogEdit]);

    // ---------- FILTERED LABORS ----------
    const filteredlaborers = labors.filter((labor) =>
        labor.lab_Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        labor.Mobile_Number?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // ---------- CRUD for rooms ----------
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.capacity) {
            toast({
                title: "Error",
                description: "Please fill in all fields",
                variant: "destructive",
            });
            return;
        }

        if (editingRoom) {
            // This is the logic for updating an existing room
            // You would place your update API call here
            const updatedRoom = {
                id: editingRoom.id,
                room: formData.name, // Updated from 'name' to 'room'
                capacity: parseInt(formData.capacity, 10),
                allocated: editingRoom.allocated,
                actualOccupancy: editingRoom.actualOccupancy,
            };

            setRooms((prev) =>
                prev.map((r) => (r.id === editingRoom.id ? updatedRoom : r))
            );
            toast({ title: "Success", description: "Room updated successfully" });
        } else {
            // This is the new logic for adding a new room via the API
            try {
                await insertRoom(formData.name, parseInt(formData.capacity, 10));

                toast({ title: "Success", description: "Room added successfully" });

                // Re-fetch all rooms to update the table with the new data
                fetchRooms();
            } catch (error) {
                console.error("Failed to add room:", error);
                toast({
                    title: "Error",
                    description: "Failed to add room. Please try again.",
                    variant: "destructive",
                });
            }
        }

        // Reset the form and close the dialog regardless of success or failure
        setFormData({ name: "", capacity: "", labors: [] });
        setEditingRoom(null);
        setIsDialogOpen(false);
    };

    const handleEdit = (room) => { // Removed lab_id parameter as it's not needed here
        setEditingRoom(room);
        setFormData({
            room: room.room,
            capacity: room.capacity,
            lab_Name: room.lab_Name,
            Mobile_Number: room.Mobile_Number || [],
        });
        setIsDialogEdit(true);
    };

    const handleDelete = async (roomId) => {
        try {
            await deactivateRoom(roomId); // Call the API to soft-delete the room

            // After successful API call, update the local state to reflect the change
            setRooms((prev) => prev.filter((r) => r.id !== roomId));

            toast({ title: "Success", description: "Room deleted successfully" });
        } catch (error) {
            console.error("Failed to delete room:", error);
            toast({
                title: "Error",
                description: "Failed to delete room. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleDeleteLaborFromRoom = async (laborIdToDelete) => {
        if (!editingRoom) return;

        try {
            // Call the API function to deallocate the laborer on the server
            await deallocateLaborer(laborIdToDelete);

            // Optimistically update the UI after a successful API call
            setAllocatedLabors((prev) => prev.filter((labor) => labor.lab_id !== laborIdToDelete));

            toast({
                title: "Success",
                description: "Labor removed from room successfully.",
            });
        } catch (error) {
            console.error("Failed to delete labor from room:", error);
            toast({
                title: "Error",
                description: "Failed to remove labor. Please try again.",
                variant: "destructive",
            });
        }
    };

    // ---------- ALLOCATION ----------
    const handleAllocateClick = (room) => {
        setSelectedRoom(room);
        setAllocationName(
            room.allocated && room.allocated !== "Available" ? room.allocated : ""
        );
        setSelectedLabors([]);
        setIsAllocateDialogOpen(true);
    };

    // Function to toggle the selection of a labor.
    const toggleLaborSelection = (id) => {
        setSelectedLabors(prevSelected => {
            if (prevSelected.includes(id)) {
                return prevSelected.filter(laborId => laborId !== id);
            } else {
                return [...prevSelected, id];
            }
        });
    };
    const confirmAllocation = async (e) => {
        e.preventDefault(); // stops page refresh
        if (!selectedRoom) return;

        if (selectedLabors.length > selectedRoom.capacity) {
            toast({
                title: "Error",
                description: `Allocation of ${selectedLabors.length} labors exceeds room capacity of ${selectedRoom.capacity}.`,
                variant: "destructive",
            });
            return;
        }

        try {
            const updatePromises = selectedLabors.map(labId =>
                updateLaborerRoom(labId, selectedRoom.room)
            );

            await Promise.all(updatePromises);

            setRooms((prev) =>
                prev.map((r) =>
                    r.id === selectedRoom.id
                        ? {
                            ...r,
                            allocated: `${selectedLabors.length} Labors`,
                            allocatedLabors: [...selectedLabors],
                            actualOccupancy: selectedLabors.length,
                        }
                        : r
                )
            );

            toast({
                title: "Success",
                description: `Allocated ${selectedLabors.length} labors to room ${selectedRoom.room}`,
            });

            setIsAllocateDialogOpen(false);
            setSelectedRoom(null);
            setSelectedLabors([]);
        } catch (error) {
            console.error("Failed to allocate room:", error);
            toast({
                title: "Error",
                description: "Failed to allocate room. Please try again.",
                variant: "destructive",
            });
        }
    };

    const resetForm = () => {
        setFormData({ name: "", capacity: "", labors: [] });
        setEditingRoom(null);
    };

    const handleLaborToggle = (laborId) => {
        setFormData((prev) => ({
            ...prev,
            labors: prev.labors.includes(laborId)
                ? prev.labors.filter((id) => id !== laborId)
                : [...prev.labors, laborId],
        }));
    };

    const handleConfirm = () => {
        confirmAllocation({
            roomId: selectedRoom?.id,
            allocationName: allocationName || undefined,
            labors: selectedLabors,
        });
        setIsAllocateDialogOpen(false);
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold text-black">
                        Room Management
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Manage and allocate rooms efficiently
                    </p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-gradient-to-r from-primary to-primary-glow">
                            <Plus className="w-4 h-4 mr-2" /> Add Room
                        </Button>
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-md bg-card border-sm:max-w-screen-lg p-6 rounded-lg shadow-xl overflow-y-auto max-h-[80vh]">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                                <Building className="w-5 h-5 text-primary" />
                                Add New Room
                            </DialogTitle>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                            <div>
                                <Label>Room Name</Label>
                                <Input
                                    type="text"
                                    placeholder="Enter room name"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData((p) => ({ ...p, name: e.target.value }))
                                    }
                                />
                            </div>

                            <div>
                                <Label>Capacity</Label>
                                <Input
                                    type="number"
                                    placeholder="Enter room capacity"
                                    value={formData.capacity}
                                    onChange={(e) =>
                                        setFormData((p) => ({ ...p, capacity: e.target.value }))
                                    }
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-primary to-primary-glow"
                            >
                                Save Room
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>


            {/* //Edit */}

            <Dialog open={isDialogEdit} onOpenChange={setIsDialogEdit}>
                <DialogContent className="sm:max-w-md bg-card border-sm:max-w-screen-lg p-6 rounded-lg shadow-xl overflow-y-auto max-h-[80vh]">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                            <Building className="w-5 h-5 text-primary" />
                            Edit Room: {editingRoom?.room}
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                        <div>
                            <Label htmlFor="name">Room Name</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="Enter room name"
                                value={formData.room}
                                onChange={(e) =>
                                    setFormData((p) => ({ ...p, room: e.target.value }))
                                }
                            />
                        </div>

                        <div>
                            <Label htmlFor="capacity">Capacity</Label>
                            <Input
                                id="capacity"
                                type="number"
                                placeholder="Enter room capacity"
                                value={formData.capacity}
                                onChange={(e) =>
                                    setFormData((p) => ({ ...p, capacity: e.target.value }))
                                }
                            />
                        </div>

                        <div>
                            <Label>Allocated Labors</Label>
                            <div className="border rounded-lg p-2 max-h-40 overflow-y-auto">
                                {isLoading ? (
                                    <div>Loading...</div>
                                ) : error ? (
                                    <div>Error: {error}</div>
                                ) : (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>ID</TableHead>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Mobile</TableHead>
                                                <TableHead>Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {allocatedLabors.length > 0 ? (
                                                allocatedLabors.map((laborroom) => (
                                                    <TableRow key={laborroom.lab_id}>
                                                        <TableCell>{laborroom.lab_id}</TableCell>
                                                        <TableCell>{laborroom.lab_Name}</TableCell>
                                                        <TableCell>{laborroom.Mobile_Number}</TableCell>
                                                        <TableCell>
                                                            <Button
                                                                size="sm"
                                                                variant="destructive"
                                                                onClick={() =>
                                                                    handleDeleteLaborFromRoom(laborroom.lab_id)
                                                                }
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={4} className="text-center">
                                                        No laborers found for this room.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                )}
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-primary to-primary-glow"
                        >
                            Save Changes
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>


            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-card to-secondary border-border">
                    <CardHeader className="flex items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Rooms
                        </CardTitle>
                        <Building className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">
                            {rooms.length}
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-card to-secondary border-border">
                    <CardHeader className="flex items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Capacity
                        </CardTitle>
                        <Users className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">
                            {rooms.reduce((sum, r) => sum + r.capacity, 0)}
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-card to-secondary border-border">
                    <CardHeader className="flex items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Allocated Rooms
                        </CardTitle>
                        <Users className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">
                            {rooms.filter((r) => r.allocated !== "Available").length}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Rooms Table */}
            <Card className="bg-card border-border shadow-lg">
                <CardHeader>
                    <CardTitle className="text-xl font-semibold">Rooms List</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-lg border border-border overflow-auto max-h-[400px]">
                        <Table>
                            <TableHeader className="sticky top-0 z-10 bg-muted/50">
                                <TableRow>
                                    <TableHead className="font-semibold w-24">Sr. No.</TableHead>
                                    <TableHead className="font-semibold">Room Name</TableHead>
                                    <TableHead className="font-semibold">Capacity</TableHead>
                                    <TableHead className="font-semibold">Actual</TableHead>
                                    <TableHead className="font-semibold">Allocation</TableHead>
                                    <TableHead className="font-semibold w-40">Actions</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {rooms.map((room, index) => (
                                    <TableRow
                                        key={room.id}
                                        className="hover:bg-muted/20 transition-colors"
                                    >
                                        <TableCell className="font-medium w-24">
                                            {index + 1}
                                        </TableCell>
                                        <TableCell className="font-medium">{room.room}</TableCell>
                                        <TableCell>{room.capacity}</TableCell>
                                        <TableCell>{room.actualOccupancy}</TableCell>
                                        <TableCell className="font-medium">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleAllocateClick(room)}
                                                className="hover:bg-primary hover:text-primary-foreground transition-colors"
                                            >
                                                Allocate
                                            </Button>
                                        </TableCell>

                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleEdit(room)}
                                                    className="hover:bg-primary hover:text-primary-foreground transition-colors"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>

                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        if (window.confirm("Are you sure you want to delete this room? This action cannot be undone.")) {
                                                            handleDelete(room.id);
                                                        }
                                                    }}
                                                    className="hover:bg-destructive hover:text-destructive-foreground transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}

                                {rooms.length === 0 && (
                                    <TableRow>
                                        <TableCell
                                            colSpan={5}
                                            className="text-center py-8 text-muted-foreground"
                                        >
                                            No rooms found. Add your first room to get started.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Allocation Dialog */}
            <Dialog open={isAllocateDialogOpen} onOpenChange={setIsAllocateDialogOpen}>
                <DialogContent className="sm:max-w-lg w-[95vw] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Allocate Room</DialogTitle>
                        <p className="text-sm text-muted-foreground">
                            Select labors to allocate to the room.
                        </p>
                    </DialogHeader>

                    {selectedRoom && (
                        <div className="py-4">
                            <div className="mb-3 text-sm">
                                <strong>Room:</strong> {selectedRoom.roomName}
                            </div>

                            <div className="mb-3">
                                <div className="flex gap-2 items-center">
                                    <Search className="w-4 h-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search by name or mobile number..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* This section has been modified to show only one laborer data entry */}
                            <div className="space-y-4">
                                {filteredlaborers.length > 0 ? (
                                    <div key={filteredlaborers[0].id} className="border rounded-lg shadow-sm p-4 bg-background">
                                        <div className="grid grid-cols-[1fr_2fr] items-center gap-4 border-b pb-2 mb-2">
                                            <div className="font-semibold">Details</div>
                                            <div className="flex items-center justify-end">
                                                <label htmlFor={`select-${filteredlaborers[0].id}`} className="sr-only">Select</label>
                                                <input
                                                    id={`select-${filteredlaborers[0].id}`}
                                                    type="checkbox"
                                                    checked={selectedLabors.includes(filteredlaborers[0].id)}
                                                    onChange={() => toggleLaborSelection(filteredlaborers[0].id)}
                                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-[1fr_2fr] items-center gap-4 py-1">
                                            <div className="text-sm text-muted-foreground">ID</div>
                                            <div className="text-sm font-medium">{filteredlaborers[0].id}</div>
                                        </div>
                                        <div className="grid grid-cols-[1fr_2fr] items-center gap-4 py-1">
                                            <div className="text-sm text-muted-foreground">Name</div>
                                            <div className="text-sm font-medium">{filteredlaborers[0].lab_Name}</div>
                                        </div>
                                        <div className="grid grid-cols-[1fr_2fr] items-center gap-4 py-1">
                                            <div className="text-sm text-muted-foreground">Phone</div>
                                            <div className="text-sm font-medium">{filteredlaborers[0].Mobile_Number}</div>
                                        </div>
                                        <div className="grid grid-cols-[1fr_2fr] items-center gap-4 py-1">
                                            <div className="text-sm text-muted-foreground">Aadhar No.</div>
                                            <div className="text-sm font-medium">{filteredlaborers[0].Aadhar_Number}</div>
                                        </div>
                                        <div className="grid grid-cols-[1fr_2fr] items-center gap-4 py-1">
                                            <div className="text-sm text-muted-foreground">Aadhar Image</div>
                                            <div className="flex justify-end">
                                                <img
                                                    src={`http://localhost:3000/${filteredlaborers[0].Photo_Upload}`}
                                                    alt={`Aadhar of ${filteredlaborers[0].lab_Name}`}
                                                    className="h-10 w-10 object-cover rounded-md shadow-md"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = "https://placehold.co/40x40/f3f4f6/a3a3a3?text=N/A";
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-4 text-muted-foreground">
                                        No laborers found.
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <div className="w-full flex justify-end">
                            <Button onClick={confirmAllocation} disabled={selectedLabors.length === 0}>
                                Confirm Allocation
                            </Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default campManagement;
