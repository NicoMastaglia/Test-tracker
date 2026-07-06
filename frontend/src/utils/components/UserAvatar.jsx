import { getInitials } from "@/utils/helpers/tableHelpers";

const SIZE_CLASSES = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-sm",
};

// Tonalità neutra unica per tutti gli avatar dell'app: l'identificazione passa
// solo dalle iniziali, mai dal colore di sfondo (niente rotazione per id/indice,
// così lo stesso utente ha sempre lo stesso aspetto ovunque compaia).
const UserAvatar = ({ user, size = "sm", className = "", ...props }) => (
  <div
    className={`flex shrink-0 items-center justify-center rounded-full font-semibold shadow-sm bg-slate-200 text-slate-600 dark:bg-slate-600 dark:text-slate-100 ${SIZE_CLASSES[size]} ${className}`}
    {...props}
  >
    {getInitials(user)}
  </div>
);

export default UserAvatar;
