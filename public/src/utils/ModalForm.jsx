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

const renderField = (field, value, updateField) => {
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
			return (
				<Select value={value ?? ""} onValueChange={(nextValue) => updateField(field.name, nextValue)}>
					<SelectTrigger className="w-full">
						<SelectValue placeholder={field.placeholder ?? `Seleziona ${field.label.toLowerCase()}`} />
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
		default:
			return (
				<Input
					id={field.name}
					type={field.type ?? "text"}
					placeholder={field.placeholder}
					value={value ?? ""}
					onChange={(event) => updateField(field.name, event.target.value)}
					autoComplete={field.autoComplete}
					required={field.required}
					className="h-10 rounded-md border border-slate-200 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
				/>
			);
	}
};

const ModalForm = ({
	modalOpen,
	setModalOpen,
	title,
	infos,
	fields = [],
	formData = {},
	setFormData,
	onSubmit,
	onClose,
	submitLabel = "Salva",
	cancelLabel = "Annulla",
	dialogClassName = "sm:max-w-106.25",
	submitClassName = "bg-emerald-600 text-white hover:bg-emerald-700",
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
					<DialogTitle className="text-xl font-bold text-slate-900">{title}</DialogTitle>
					<DialogDescription>{infos}</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} autoComplete="off" className="grid gap-6 py-4">
					<div className="grid gap-4">
						{fields.map((field) => (
							<div key={field.name} className="grid gap-2">
								<Label htmlFor={field.name} className="text-slate-700">
									{field.label}
								</Label>
								{renderField(field, formData[field.name], updateField)}
								{field.helperText ? <p className="text-xs text-slate-500">{field.helperText}</p> : null}
							</div>
						))}
					</div>

					<DialogFooter className="flex gap-2 sm:gap-0">
						<Button type="button" variant="ghost" onClick={() => setModalOpen(false)} className="hover:bg-slate-100">
							{cancelLabel}
						</Button>
						<Button type="submit" className={submitClassName}>
							{submitLabel}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default ModalForm;