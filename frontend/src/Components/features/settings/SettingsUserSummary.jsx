import { Mail, CalendarDays } from "lucide-react";
import { Badge } from "@/Components/ui/badge";
import UserAvatar from "@/utils/components/UserAvatar";
import { getFullName, getRoleInfo, formatProjectDate } from "@/utils/helpers/tableHelpers";

const SettingsUserSummary = ({ user = {} }) => {
  const roleInfo = getRoleInfo(user.role);

  return (
    <div className="bg-card border border-border shadow-sm rounded-2xl">
      <div className="grid grid-cols-1 divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        <div className="flex items-center gap-4 p-6">
          <UserAvatar user={user} size="lg" />
          <div className="flex flex-col gap-1.5">
            <p className="text-sm font-bold text-foreground">{getFullName(user)}</p>
            <Badge className={`border-none px-3 py-1 text-xs  ${roleInfo.className}`}>
                <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-current" />
              {roleInfo.label}
            </Badge>
          </div>
        </div>

        

        <div className="flex items-center gap-4 p-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400">
            <Mail size={18} />
          </div>
          <div className="flex flex-col gap-1.5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Email</p>
            <p className="text-sm font-medium text-foreground">{user.email ?? "—"}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400">
            <CalendarDays size={18} />
          </div>
          <div className="flex flex-col gap-1.5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Membro dal</p>
            <p className="text-sm font-medium text-foreground">{formatProjectDate(user.created_at) }</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsUserSummary;
