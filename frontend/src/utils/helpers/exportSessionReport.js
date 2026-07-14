import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// FILE PER IL DOWNLOAD DEL REPORT DI UNA SESSIONE DI TEST (EXCEL O PDF)


// helper per costruire le righe della tabella del report
const buildRows = (tasks) =>
  tasks.map((task) => ({
    Task: task.description ?? "",
    Stato: task.task_status ?? "",
    Esito: task.outcome ?? "Non ancora testata",
    Nota: task.note ?? "",
  }));

// helper per nome file del report, basato sul nome del progetto e id della sessione
const buildFileName = (session, extension) => {
  const project = (session?.project_name ?? "sessione").replace(/[^a-z0-9]+/gi, "_");
  return `report_${project}_sessione_${session?.id ?? ""}.${extension}`;
};


// helper per esportare in Excel
export const exportSessionToExcel = (session, tasks) => {
  const rows = buildRows(tasks);
  const worksheet = XLSX.utils.json_to_sheet(rows);
  worksheet["!cols"] = [{ wch: 45 }, { wch: 14 }, { wch: 16 }, { wch: 40 }];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Report sessione");

  XLSX.writeFile(workbook, buildFileName(session, "xlsx"));
};

// helper per esportare in PDF
export const exportSessionToPdf = (session, tasks) => {
  const doc = new jsPDF();

  doc.setFontSize(14);
  doc.text(`Report sessione #${session?.id ?? ""} — ${session?.project_name ?? ""}`, 14, 16);

  doc.setFontSize(10);
  doc.text(`Stato: ${session?.status ?? "N/D"}`, 14, 24);

  autoTable(doc, {
    startY: 30,
    head: [["Task", "Stato", "Esito", "Nota"]],
    body: buildRows(tasks).map((row) => [row.Task, row.Stato, row.Esito, row.Nota]),
    styles: { fontSize: 9, cellWidth: "wrap" },
    columnStyles: { 0: { cellWidth: 60 }, 3: { cellWidth: 55 } },
  });

  doc.save(buildFileName(session, "pdf"));
};
