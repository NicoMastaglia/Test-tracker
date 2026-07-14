import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getFullName, formatProjectDateTime } from "@/utils/helpers/tableHelpers";


// STESSA LOGICA DI exportSessionReport.js, MA PER IL DOWNLOAD DEL REPORT DI PIÙ SESSIONI (EXCEL O PDF)

const buildRows = (sessions) =>
  sessions.map((s) => ({
    "#": s.id,
    Progetto: s.project_name ?? "",
    Tester: getFullName({ nome: s.tester_nome, cognome: s.tester_cognome }),
    Inizio: s.started_at ? formatProjectDateTime(s.started_at) : "",
    Fine: s.completed_at ? formatProjectDateTime(s.completed_at) : "",
    Stato: s.status ?? "",
  }));

export const exportSessionsToExcel = (sessions) => {
  const rows = buildRows(sessions);
  const worksheet = XLSX.utils.json_to_sheet(rows);
  worksheet["!cols"] = [{ wch: 6 }, { wch: 28 }, { wch: 22 }, { wch: 18 }, { wch: 18 }, { wch: 14 }];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sessioni");

  XLSX.writeFile(workbook, "report_sessioni.xlsx");
};

export const exportSessionsToPdf = (sessions) => {
  const doc = new jsPDF({ orientation: "landscape" });

  doc.setFontSize(14);
  doc.text("Report sessioni di test", 14, 16);

  const rows = buildRows(sessions);
  autoTable(doc, {
    startY: 22,
    head: [["#", "Progetto", "Tester", "Inizio", "Fine", "Stato"]],
    body: rows.map((r) => [r["#"], r.Progetto, r.Tester, r.Inizio, r.Fine, r.Stato]),
    styles: { fontSize: 9 },
  });

  doc.save("report_sessioni.pdf");
};
