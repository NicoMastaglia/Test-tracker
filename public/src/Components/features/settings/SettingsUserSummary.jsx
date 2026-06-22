import { Mail, CalendarDays } from "lucide-react";
import { Badge } from "@/Components/ui/badge";
import UserAvatar from "@/utils/components/UserAvatar";
import { getFullName, getRoleInfo, formatProjectDate } from "@/utils/helpers/tableHelpers";

const SettingsUserSummary = ({ user = {} }) => {
  const roleInfo = getRoleInfo(user.role);

  return (
    <div className="bg-white border border-slate-200 shadow-sm rounded-2xl">
      <div className="grid grid-cols-1 divide-y divide-slate-200 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        <div className="flex items-center gap-4 p-6">
          <UserAvatar user={user} colorIndex={user.id} size="lg" />
          <div className="flex flex-col gap-1.5">
            <p className="text-sm font-bold text-slate-900">{getFullName(user)}</p>
            <Badge className={`w-fit border-none px-2 py-0.5 text-[11px] ${roleInfo.className}`}>
              {roleInfo.label}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-4 p-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
            <Mail size={18} />
          </div>
          <div className="flex flex-col gap-1.5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Email</p>
            <p className="text-sm font-medium text-slate-900">{user.email ?? "—"}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
            <CalendarDays size={18} />
          </div>
          <div className="flex flex-col gap-1.5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Membro dal</p>
            <p className="text-sm font-medium text-slate-900">{formatProjectDate(user.created_at) }</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsUserSummary;
