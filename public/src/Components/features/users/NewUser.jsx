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
                    <DialogContent className="sm:max-w-[450px]">
                    <DialogHeader>

                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        <Plus className="h-6 w-6 text-emerald-600" />
                        Nuovo Utente
                    </DialogTitle>
                    <DialogDescription>
                        Inserisci i dettagli per creare un nuovo utente.
                    </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-6 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name" className="text-slate-700">Nome Completo</Label>
                            <Input onChange={(e)=>setNewUserData({
                                ...newUserData,name:e.target.value
                            })} id="name" placeholder="Mario Rossi" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email" className="text-slate-700">Email</Label>
                            <Input onChange={(e)=>setNewUserData({
                                ...newUserData,email:e.target.value
                            })} id="email" placeholder="formato email valido" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="role" className="text-slate-700">Ruolo</Label>
                            <Select onChange={(value)=>setNewUserData({
                                ...newUserData,role:value
                            })}>
                                <SelectTrigger className="w-full">
                                    <div className="flex items-center gap-2">
                                        <ShieldCheck className="h-4 w-4 text-slate-400" />
                                        <SelectValue placeholder="Seleziona un ruolo" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="superadmin">Superadmin</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="tester">Tester</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password" className="text-slate-700">Password</Label>
                            <Input  onChange={(e)=>setNewUserData({
                                ...newUserData,password:e.target.value
                            })} id="password" type="password" placeholder="Inserisci la password" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={addUser} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                            Crea Utente
                        </Button>
                    </DialogFooter>



                    </DialogContent>
                </Dialog>
    )

}

export default NewUser