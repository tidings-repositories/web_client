type BadgeProps = {
  url: string;
};

function Badge({ url }: BadgeProps) {
  return <img className="w-5 h-5 rounded-sm" src={url} />;
}

export default Badge;
