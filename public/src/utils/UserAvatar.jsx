import { getInitials, getRoundColorClass } from "@/utils/tableHelpers";

const SIZE_CLASSES = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-sm",
};

const UserAvatar = ({ user, colorIndex = 0, size = "sm", className = "", ...props }) => (
  <div
    className={`flex shrink-0 items-center justify-center rounded-full font-semibold shadow-sm ${SIZE_CLASSES[size]} ${getRoundColorClass(colorIndex)} ${className}`}
    {...props}
  >
    {getInitials(user)}
  </div>
);

export default UserAvatar;
