import { Badge } from "@/Components/ui/badge";
import { CalendarDays } from "lucide-react";
import { getFullName, getRoleInfo } from "@/utils/helpers/tableHelpers";
import UserAvatar from "@/utils/components/UserAvatar";

// Ricorda di chiedere se ha senso tenerlo e se cambiare logica
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Buongiorno";
  if (hour < 18) return "Buon pomeriggio";
  return "Buonasera";
};

// Data odierna in italiano, con iniziale maiuscola (es. "Venerdì 12 giugno 2026")
// 
const getTodayLabel = () => {
  const label = new Date().toLocaleDateString("it-IT", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return label.charAt(0).toUpperCase() + label.slice(1);
};

// Card di benvenuto condivisa dalle dashboard (Admin, SuperAdmin, User)
const WelcomeCard = ({ user, subtitle }) => {
  const roleInfo = getRoleInfo(user?.role);
  const fullName = getFullName(user) || user?.name || "utente";

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* decorazioni di sfondo */}
      <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-emerald-100/70 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-24 right-32 h-44 w-44 rounded-full bg-teal-100/60 blur-2xl" />

      <div className="relative flex flex-wrap items-center justify-between gap-4 px-6 py-6">
        <div className="flex items-center gap-4">
          <UserAvatar user={user} size="lg" className="h-14 w-14 text-base" />

          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-2xl font-bold text-slate-900">
                {getGreeting()}, {fullName} 
              </h2>
              <Badge className={`border-none px-3 py-1 text-xs  ${roleInfo.className}`}>
                <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-current" />
                {roleInfo.label}
              </Badge>
            </div>

            <p className="mt-1.5 text-sm text-slate-500">{subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm text-slate-600 shadow-sm backdrop-blur">
          <CalendarDays className="h-4 w-4 text-emerald-500" />
          {getTodayLabel()}
        </div>
      </div>
    </div>
  );
};

export default WelcomeCard;
