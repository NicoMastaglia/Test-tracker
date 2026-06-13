
// componente riutilizzabile per visualizzare modali con form dinamici

import React from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Lock} from "lucide-react";

const renderField = (field, value, updateField) => {
    // Estraiamo l'icona se presente nell'oggetto del campo
    const Icon = field.icon;

    switch (field.type) {
        case "textarea":
            return (
                <Textarea
                    id={field.name}
                    placeholder={field.placeholder}
                    rows={field.rows ?? 4}
                    value={value ?? ""}
                    onChange={(event) => updateField(field.name, event.target.value)}
                    className="min-h-24 rounded-md border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
            );

        case "select":
        
		// Se il campo è di tipo select e il valore è 'superadmin', 
		//  div non interattivo con un'icona di lucchetto
		// es un superadmin non può cambiare ruolo
		if (field.name ==='role' && value === 'superadmin') {
			return(
				<div className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 h-10 text-sm text-slate-500 cursor-not-allowed flex items-center justify-between select-none">
                <div className="flex items-center gap-2">
                    {Icon && <Icon className="h-4 w-4 text-slate-400" />}
                    <span className="font-medium text-slate-500">Super Admin</span>
                </div>

                <Lock className="h-3.5 w-3.5 text-slate-400" />
            </div>
			)





		}
            return (
                <Select value={value ?? ""} onValueChange={(nextValue) => updateField(field.name, nextValue)}>
                    <SelectTrigger className={`w-full ${field.triggerClassName ?? ""}`}>
                        <div className="flex items-center gap-2">
                            {Icon && <Icon className="h-4 w-4 text-slate-400" />}
                            <SelectValue placeholder={field.placeholder ?? `Seleziona ${field.label?.toLowerCase()}`} />
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        {field.options?.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            );

        default: { // text, email, password,
            const inputElement = (
                <Input
                    id={field.name}
                    type={field.type ?? "text"}
                    placeholder={field.placeholder}
                    value={value ?? ""}
                    onChange={(event) => updateField(field.name, event.target.value)}
                    autoComplete={field.autoComplete}
                    required={field.required}
                    className={field.inputClassName ?? "h-10 rounded-md border border-slate-200 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"}
                />
            );


            if (Icon) {
                return (
                    <div className="relative">
                        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        {inputElement}
                    </div>
                );
            }

            return inputElement;
        }
    }
};

const ModalForm = ({
	modalOpen,
	setModalOpen,
	title,
	infos,
	fields = [],
	formData = {},
	
    hasDescripion = false,
	description = null,
	setFormData ,
	onSubmit,
	onClose,
	submitLabel = "Salva",
	cancelLabel = "Annulla",
	dialogClassName = "sm:max-w-106.25",
	submitClassName =  "",
	submitVariant = "default", // <--- 1. DI DEFAULT È IL BOTTONE STANDARD
    titleIcon: TitleIcon = null, // <--- 2. PROP PER L'ICONA DEL TITOLO (Rinominata con la maiuscola)
	customFooter = null,
	iconColor = "text-slate-500" // <--- 3. PROP PER IL COLORE DELL'ICONA
}) => {

    
	const updateField = (name, value) => {
		setFormData({
			...formData,
			[name]: value,
		});
	};
	

	const handleSubmit = (event) => {
		event.preventDefault();
		onSubmit?.();
	};

	const handleOpenChange = (open) => {
		setModalOpen(open);

		if (!open) {
			onClose?.();
		}
	};

	return (
		<Dialog open={modalOpen} onOpenChange={handleOpenChange}>
			<DialogContent className={dialogClassName}>
				<DialogHeader>

					<DialogTitle className="text-xl font-bold text-slate-900 flex flex-row items-center  gap-2">
						{TitleIcon && <TitleIcon className={`h-5 w-5 ${iconColor} `}/>}
						{title}
						</DialogTitle>
					<DialogDescription>{infos}</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} autoComplete="off" 
				className={`grid ${fields.length > 0 ? 'gap-6 py-4' : 'gap-3'}`}>
					<div className="grid gap-4">
						{fields.map((field) => (
							<div key={field.name} className="grid gap-2">
								<Label htmlFor={field.name} className="text-slate-900">
									{field.label}
								</Label>

								{renderField(field, formData[field.name], updateField)}
								{field.helperText ? <p className="text-xs text-slate-500">{field.helperText}</p> : null}
							</div>
						))}
					</div>

				 {hasDescripion && (

					description 
				
				)}

					{customFooter ? (customFooter) : (

					<DialogFooter className="flex gap-2 sm:gap-0">
						<Button type="button" variant="ghost" onClick={() => setModalOpen(false)} className="hover:bg-slate-100">
							{cancelLabel}
						</Button>
						<Button type="submit" variant={submitVariant} className={submitClassName}>
							{submitLabel}
						</Button>
					</DialogFooter>
					)}
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default ModalForm;