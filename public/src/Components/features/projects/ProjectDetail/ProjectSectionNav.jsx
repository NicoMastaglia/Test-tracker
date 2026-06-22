import { Badge } from "@/Components/ui/badge";

const sectionLabels = {
  overview: "Panoramica",
  checklist: "Checklist",
  team: "Team",
  // "Attività" (audit) nascosto finché il BE non espone il log
};


// MENUI DI NAVIGAZIONE PER LE SEZIONI DEL PROGETTO (OVERVIEW, CHECKLIST, TEAM, ACTIVITIES)
const ProjectSectionNav = ({
  activeSection,
  onSectionChange,
  counts = {},
  isAdmin,
}) => {
  // Il tester vede solo la Panoramica: le checklist/task le consulta dentro le sue sessioni
  // ("I miei lavori"), non qui.
  const visibleSections = isAdmin
    ? sectionLabels
    : {
        overview: "Panoramica",
      };

  return (
    <div className="border-t border-slate-100 px-6">
      <div className="flex flex-wrap gap-6">
        {Object.entries(visibleSections).map(([key, label]) => {
          const isActive = activeSection === key;

          return (
            <button
              key={key}
              type="button"
              onClick={() => onSectionChange(key)}
              className={`inline-flex items-center gap-1.5 pb-4 pt-2 text-[14px] font-medium transition cursor-pointer border-b-2 ${
                isActive
                  ? "text-emerald-600 border-emerald-600 font-semibold"
                  : "text-slate-400 border-transparent hover:text-slate-600"
              }`}
            >
              {label}
              
              {/* Badge contatore numerico */}
              {typeof counts[key] === "number" ? (
                <span
                  className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-bold ${
                    isActive 
                      ? "bg-emerald-50 text-emerald-700" 
                      : "bg-slate-100 text-slate-500"    
                  }`}
                >
                  {counts[key]}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
};
export default ProjectSectionNav;