import axios from "axios";
import { baseUrl, authConfig } from "../../config";

export const createCheckList = async (token, checklistData) => {
	const res = await axios.post(
		`${baseUrl}/api/checklists`,
		checklistData,
		authConfig(token),
	);
	return res.data;
};

export const updateCheckList = async (token, checklistId, checklistData) => {
	const res = await axios.put(
		`${baseUrl}/api/checklists/${checklistId}`,
		checklistData,
		authConfig(token),
	);
	return res.data;
};

export const deleteCheckList = async (token, checklistId) => {
	const res = await axios.delete(
		`${baseUrl}/api/checklists/${checklistId}`,
		authConfig(token),
	);
	return res.data;
};

export const getCheckListsByProject = async (token, projectId) => {
	const res = await axios.get(
		`${baseUrl}/api/checklists/${projectId}`,
		authConfig(token),
	);
	return res.data;
};
