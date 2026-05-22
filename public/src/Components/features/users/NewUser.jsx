import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";
import React from "react";





const NewUser = ({setModal,
    modal,addUser,newUserData,setNewUserData})=>{



    return(
          <Dialog open={modal} onOpenChange={setModal}>
                    <DialogContent className="sm:max-w-112.5">
                    <DialogHeader>

                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        <Plus className="h-6 w-6 text-emerald-600" />
                        Nuovo Utente
                    </DialogTitle>
                    <DialogDescription>
                        Inserisci i dettagli per creare un nuovo utente.
                    </DialogDescription>
                    </DialogHeader>
                    <form className="grid gap-4 py-4"
                    
                    onSubmit={(e)=>{
                        e.preventDefault()
                        addUser()
                    }}>
                    <div className="grid gap-6 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name" className="text-slate-700">Nome</Label>
                            <Input onChange={(e)=>setNewUserData({
                                ...newUserData,name:e.target.value
                            })} id="name" placeholder="Mario Rossi"
                            autoComplete="new-name" required />
                        </div>
                          <div className="grid gap-2">
                            <Label htmlFor="surname" className="text-slate-700">Cognome</Label>
                            <Input onChange={(e)=>setNewUserData({
                                ...newUserData,surname:e.target.value
                            })} id="surname" placeholder="Mario Rossi"
                            autoComplete="new-surname" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email" className="text-slate-700">Email</Label>
                            <Input onChange={(e)=>setNewUserData({
                                ...newUserData,email:e.target.value
                            })} id="email" placeholder="formato email valido"
                            autoComplete="new-email" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="role" className="text-slate-700">Ruolo</Label>
                            <Select onValueChange={(value)=>setNewUserData({
                                ...newUserData,role:value
                            })} required>
                                <SelectTrigger className="w-full">
                                    <div className="flex items-center gap-2">
                                        <ShieldCheck className="h-4 w-4 text-slate-400" />
                                        <SelectValue placeholder="Seleziona un ruolo" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="user">User</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="superadmin">Superadmin</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password" className="text-slate-700">Password</Label>
                            <Input  onChange={(e)=>setNewUserData({
                                ...newUserData,password:e.target.value
                            })} id="password" type="password" placeholder="Inserisci la password" 
                            autoComplete="new-password" required/>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                            Crea Utente
                        </Button>
                    </DialogFooter>
                    </form>



                    </DialogContent>
                </Dialog>
    )

}

export default NewUser