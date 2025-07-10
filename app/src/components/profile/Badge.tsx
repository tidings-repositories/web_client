import { BadgeProps } from "../../Types";

function Badge({ ...badge }: BadgeProps) {
  return <img className="w-5 h-5 rounded-sm" src={badge.url} />;
}

export default Badge;
