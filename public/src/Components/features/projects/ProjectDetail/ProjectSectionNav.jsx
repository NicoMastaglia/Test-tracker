import { Badge } from "@/Components/ui/badge";

const sectionLabels = {
    overview: "Panoramica",
    checklist: "Checklist",
    team: "Team",
    activities: "Attività",
};


const ProjectSectionNav = ({ activeSection, onSectionChange, counts = {},
isAdmin }) => {

    const visibleSections = isAdmin
    ? sectionLabels
    : {
        overview: "Panoramica",
        checklist: "Checklist",
      };

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
            <div className="flex flex-wrap gap-2">
                {Object.entries(visibleSections).map(([key, label]) => {
                    const isActive = activeSection === key;

                    return (
                        <button
                            key={key}
                            type="button"
                            onClick={() => onSectionChange(key)}
                            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition ${isActive ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}
                        >
                            {label}
                            {typeof counts[key] === "number" ? (
                                <Badge variant="outline" className={`border-0 ${isActive ? "bg-white/15 text-white" : "bg-slate-100 text-slate-500"}`}>
                                    {counts[key]}
                                </Badge>
                            ) : null}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default ProjectSectionNav;