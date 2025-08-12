import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash2, Users, Building } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const RoomManagement = () => {
  const [rooms, setRooms] = useState([
    { id: '1', name: 'Conference Room A', capacity: 20, allocated: 'Meeting Team' },
    { id: '2', name: 'Training Room B', capacity: 30, allocated: 'HR Department' },
    { id: '3', name: 'Board Room', capacity: 12, allocated: 'Executive Team' },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [formData, setFormData] = useState({ name: '', capacity: '' });
  const { toast } = useToast();

  const allocateOptions = [
    'Meeting Team',
    'HR Department',
    'Executive Team',
    'Development Team',
    'Marketing Team',
    'Sales Team',
    'Finance Team',
    'Available'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.capacity) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    const roomData = {
      id: editingRoom?.id || Date.now().toString(),
      name: formData.name,
      capacity: parseInt(formData.capacity),
      allocated: editingRoom?.allocated || 'Available'
    };

    if (editingRoom) {
      setRooms(prev => prev.map(room => 
        room.id === editingRoom.id ? roomData : room
      ));
      toast({
        title: "Success",
        description: "Room updated successfully"
      });
    } else {
      setRooms(prev => [...prev, roomData]);
      toast({
        title: "Success",
        description: "Room added successfully"
      });
    }

    setFormData({ name: '', capacity: '' });
    setEditingRoom(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (room) => {
    setEditingRoom(room);
    setFormData({ name: room.name, capacity: room.capacity.toString() });
    setIsDialogOpen(true);
  };

  const handleDelete = (roomId) => {
    setRooms(prev => prev.filter(room => room.id !== roomId));
    toast({
      title: "Success",
      description: "Room deleted successfully"
    });
  };

  const handleAllocate = (roomId, allocation) => {
    setRooms(prev => prev.map(room =>
      room.id === roomId ? { ...room, allocated: allocation } : room
    ));
    toast({
      title: "Success",
      description: `Room allocated to ${allocation}`
    });
  };

  const resetForm = () => {
    setFormData({ name: '', capacity: '' });
    setEditingRoom(null);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Room Management
            </h1>
            <p className="text-muted-foreground text-lg">
              Manage and allocate rooms efficiently
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-primary to-primary-glow hover:shadow-lg transition-all duration-300">
                <Plus className="w-4 h-4 mr-2" />
                Add Room
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-card border-border">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                  <Building className="w-5 h-5 text-primary" />
                  {editingRoom ? 'Edit Room' : 'Add New Room'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Room Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter room name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="border-border focus:ring-primary focus:border-primary"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="capacity" className="text-sm font-medium">
                    Capacity
                  </Label>
                  <Input
                    id="capacity"
                    type="number"
                    placeholder="Enter room capacity"
                    value={formData.capacity}
                    onChange={(e) => setFormData(prev => ({ ...prev, capacity: e.target.value }))}
                    className="border-border focus:ring-primary focus:border-primary"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-primary to-primary-glow hover:shadow-lg transition-all duration-300"
                >
                  {editingRoom ? 'Update Room' : 'Add Room'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-card to-secondary border-border hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Rooms
              </CardTitle>
              <Building className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{rooms.length}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-card to-secondary border-border hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Capacity
              </CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {rooms.reduce((sum, room) => sum + room.capacity, 0)}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-card to-secondary border-border hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Allocated Rooms
              </CardTitle>
              <Users className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {rooms.filter(room => room.allocated !== 'Available').length}
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
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">Sr. No.</TableHead>
                    <TableHead className="font-semibold">Name</TableHead>
                    <TableHead className="font-semibold">Capacity</TableHead>
                    <TableHead className="font-semibold">Allocate</TableHead>
                    <TableHead className="font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rooms.map((room, index) => (
                    <TableRow key={room.id} className="hover:bg-muted/20 transition-colors">
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell className="font-medium">{room.name}</TableCell>
                      <TableCell>{room.capacity}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="hover:bg-primary hover:text-primary-foreground transition-colors"
                            >
                              {room.allocated}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" className="bg-popover border-border">
                            {allocateOptions.map((option) => (
                              <DropdownMenuItem
                                key={option}
                                onClick={() => handleAllocate(room.id, option)}
                                className="cursor-pointer hover:bg-accent hover:text-accent-foreground"
                              >
                                {option}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
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
                            onClick={() => handleDelete(room.id)}
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
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No rooms found. Add your first room to get started.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RoomManagement;