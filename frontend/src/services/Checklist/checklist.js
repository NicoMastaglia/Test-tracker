import axios from "axios";
import { baseUrl, authConfig } from "../config";


// POST NUOVA CHECKLIST 
export const createChecklist = async (token, checklistData) => {
	const res = await axios.post(
		`${baseUrl}/api/checklists`,
		 checklistData,
		authConfig(token),
	);
	return res.data;
};

// PUT MODIFICA CHECKLIST 
export const updateChecklist = async (token, checklistId, checklistData) => {
	const res = await axios.put(
		`${baseUrl}/api/checklists/${checklistId}`,
		checklistData,
		authConfig(token),
	);
	return res.data;
};


// DELETE CHECKLIST 
export const deleteChecklist = async (token, checklistId) => {
	const res = await axios.delete(
		`${baseUrl}/api/checklists/${checklistId}`,
		authConfig(token),
	);
	return res.data;
};

// GET CHECKLISTS BY PROJECT
export const getChecklistsByProject = async (token, projectId) => {
	const res = await axios.get(
		`${baseUrl}/api/checklists/${projectId}`,
		authConfig(token),
	);
	return res.data;
};


// POST NUOVO ITEM CHECKLIST (TASK)
export const addChecklistItem = async (token, templateId, itemData) => {
	const res = await axios.post(
		`${baseUrl}/api/checklists/${templateId}/item`,
		itemData,
		authConfig(token),
	);
	return res.data;
};

// PUT MODIFICA ITEM CHECKLIST (TASK)
export const updateChecklistItem = async (token, itemId, itemData) => {
	const res = await axios.put(
		`${baseUrl}/api/checklists/item/${itemId}`,
		itemData,
		authConfig(token),
	);
	return res.data;
};

// DELETE ITEM CHECKLIST (TASK)
export const deleteChecklistItem = async (token, itemId) => {
	const res = await axios.delete(
		`${baseUrl}/api/checklists/item/${itemId}`,
		authConfig(token),
	);
	return res.data;
};
