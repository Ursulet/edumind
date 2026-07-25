"use client";

import { useState, useEffect } from "react";
import { Button, Card, CardContent, Input, Label, Badge } from "@edumind/ui";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  
  // Create User form
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "USER",
    childFirstName: "",
    childLastName: "",
    childDob: ""
  });

  // Child form for adding to existing user
  const [childFirstName, setChildFirstName] = useState("");
  const [childLastName, setChildLastName] = useState("");
  const [childDob, setChildDob] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/v1/admin/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async () => {
    try {
      const res = await fetch(`/api/v1/admin/users/create`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newUser)
      });
      
      if (res.ok) {
        setNewUser({
          firstName: "", lastName: "", email: "", password: "", role: "USER", childFirstName: "", childLastName: "", childDob: ""
        });
        setShowCreateModal(false);
        fetchUsers();
        alert("Utilizatorul a fost creat cu succes!");
      } else {
        const err = await res.json();
        alert("Eroare: " + err.message);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const updateRole = async (userId: string, role: string) => {
    try {
      const res = await fetch(`/api/v1/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ role })
      });
      if (res.ok) {
        fetchUsers();
      } else {
        alert("A apărut o eroare la actualizarea rolului.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const addChild = async () => {
    if (!selectedUser || selectedUser.role !== "PARENT") {
      alert("Alegeți un cont de Părinte valid.");
      return;
    }
    try {
      const res = await fetch(`/api/v1/admin/users/${selectedUser.id}/children`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          firstName: childFirstName, 
          lastName: childLastName, 
          dob: childDob 
        })
      });
      
      if (res.ok) {
        setChildFirstName("");
        setChildLastName("");
        setChildDob("");
        setSelectedUser(null);
        fetchUsers();
        alert("Copilul a fost adăugat cu succes.");
      } else {
        const err = await res.json();
        alert("Eroare: " + err.message);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-[#E3DED3] pb-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#1F2622]">Management Utilizatori</h1>
          <p className="text-sm text-[#6B746F]">Schimbă roluri și gestionează conturile părinților din platformă.</p>
        </div>
        <Button 
          className="bg-[#1F2622] text-white hover:bg-[#2A332E]"
          onClick={() => setShowCreateModal(true)}
        >
          Creează Utilizator Nou
        </Button>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="bg-[#FFFDF8] w-full max-w-md max-h-[90vh] overflow-y-auto">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-bold">Creează Cont Nou</h2>
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs">Email</Label>
                  <Input value={newUser.email} onChange={(e) => setNewUser({...newUser, email: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Parolă</Label>
                  <Input type="password" value={newUser.password} onChange={(e) => setNewUser({...newUser, password: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Prenume</Label>
                    <Input value={newUser.firstName} onChange={(e) => setNewUser({...newUser, firstName: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Nume</Label>
                    <Input value={newUser.lastName} onChange={(e) => setNewUser({...newUser, lastName: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Rol</Label>
                  <select className="w-full text-sm border-[#E3DED3] rounded-md px-3 py-2 bg-white" value={newUser.role} onChange={(e) => setNewUser({...newUser, role: e.target.value})}>
                    <option value="USER">User Simplu</option>
                    <option value="PARENT">Părinte</option>
                    <option value="SPECIALIST">Specialist</option>
                    <option value="DEPARTMENT_ADMIN">Director</option>
                  </select>
                </div>
                
                {newUser.role === "PARENT" && (
                  <div className="pt-4 border-t border-[#E3DED3] space-y-3">
                    <h3 className="text-sm font-semibold">Date Copil (Opțional)</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label className="text-xs">Prenume Copil</Label>
                        <Input value={newUser.childFirstName} onChange={(e) => setNewUser({...newUser, childFirstName: e.target.value})} />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Nume Copil</Label>
                        <Input value={newUser.childLastName} onChange={(e) => setNewUser({...newUser, childLastName: e.target.value})} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="pt-4 flex gap-2">
                <Button className="flex-1 bg-[#1F2622] text-white" onClick={handleCreateUser}>Creează</Button>
                <Button variant="outline" onClick={() => setShowCreateModal(false)}>Anulează</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <p className="text-sm text-[#6B746F]">Se încarcă...</p>
          ) : (
            <Card className="bg-[#FFFDF8] border-[#E3DED3] shadow-sm overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-[#F7F5F0] text-[#6B746F]">
                  <tr>
                    <th className="px-4 py-3 font-semibold">User / Email</th>
                    <th className="px-4 py-3 font-semibold">Rol Curent</th>
                    <th className="px-4 py-3 font-semibold">Acțiuni Rol</th>
                    <th className="px-4 py-3 font-semibold">Gestiune Cont</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E3DED3]">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-[#F7F5F0]">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-[#1F2622]">{u.firstName} {u.lastName}</p>
                        <p className="text-xs text-[#6B746F]">{u.email}</p>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className="text-[#2F6B57] bg-[#EDF4F0]">{u.role}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <select 
                          className="text-xs border-[#E3DED3] rounded-md px-2 py-1 bg-white text-[#1F2622]"
                          value={u.role}
                          onChange={(e) => updateRole(u.id, e.target.value)}
                        >
                          <option value="USER">User Simplu</option>
                          <option value="PARENT">Părinte</option>
                          <option value="SPECIALIST">Specialist</option>
                          <option value="DEPARTMENT_ADMIN">Director</option>
                          <option value="SUPER_ADMIN">Super Admin</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        {u.role === "PARENT" && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-[10px] h-7 px-2"
                            onClick={() => setSelectedUser(u)}
                          >
                            Adaugă Copil
                          </Button>
                        )}
                        {u.role === "PARENT" && u.parentProfile?.family?.children && (
                          <p className="text-[10px] text-[#6B746F] mt-1">
                            {u.parentProfile.family.children.length} copii
                          </p>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          )}
        </div>

        <div className="lg:col-span-1">
          {selectedUser ? (
            <Card className="bg-[#FFFDF8] border-[#E3DED3] shadow-sm sticky top-24">
              <CardContent className="p-5 space-y-4">
                <div>
                  <h3 className="font-bold text-[#1F2622]">Adaugă un Copil</h3>
                  <p className="text-xs text-[#6B746F]">Pentru părintele {selectedUser.email}</p>
                </div>
                
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label className="text-xs text-[#6B746F]">Prenume Copil</Label>
                    <Input 
                      placeholder="Ex: David" 
                      value={childFirstName}
                      onChange={(e) => setChildFirstName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-[#6B746F]">Nume de Familie</Label>
                    <Input 
                      placeholder="Ex: Popescu" 
                      value={childLastName}
                      onChange={(e) => setChildLastName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-[#6B746F]">Data Nașterii (Opțional)</Label>
                    <Input 
                      type="date"
                      value={childDob}
                      onChange={(e) => setChildDob(e.target.value)}
                    />
                  </div>
                </div>

                <div className="pt-2 flex gap-2">
                  <Button className="flex-1 bg-[#1F2622] hover:bg-[#2A332E] text-white" onClick={addChild}>
                    Salvează Copilul
                  </Button>
                  <Button variant="outline" onClick={() => setSelectedUser(null)}>
                    Anulează
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-[#F7F5F0] border-dashed border-[#E3DED3]">
              <CardContent className="p-8 text-center text-sm text-[#6B746F]">
                Selectați "Adaugă Copil" din tabel pentru a crea un cont de elev asociat unui părinte.
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
