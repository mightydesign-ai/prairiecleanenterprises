import { ICONS } from "@/lib/icons/registry";
import { BADGE_SIZES, CIRCLES, ICON_COLOURS, type BadgeSizeKey, type CircleKey, type IconColourKey } from "@/lib/icons/palette";

/** One Phosphor icon (MIT licence) as inline SVG. It takes its colour from the text colour around it. */
export function Icon({ name, solid = true, className = "" }: { name?: string | null; solid?: boolean; className?: string }) {
  const def = name ? ICONS[name] : undefined;
  if (!def) return null;
  return (
    <svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true" focusable="false" className={className}>
      {(solid ? def.s : def.o).map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}

export type IconBadgeData = {
  icon?: string | null;
  style?: string | null;
  circle?: string | null;
  iconColour?: string | null;
  size?: string | null;
  label?: string | null;
};

/** An icon inside an optional coloured circle. Decorative unless a label is set. */
export function IconBadge({ badge, className = "" }: { badge?: IconBadgeData | null; className?: string }) {
  if (!badge?.icon || !ICONS[badge.icon]) return null;
  const circle = CIRCLES[(badge.circle as CircleKey) in CIRCLES ? (badge.circle as CircleKey) : "teal"];
  const colour = ICON_COLOURS[(badge.iconColour as IconColourKey) in ICON_COLOURS ? (badge.iconColour as IconColourKey) : "auto"];
  const size = BADGE_SIZES[(badge.size as BadgeSizeKey) in BADGE_SIZES ? (badge.size as BadgeSizeKey) : "md"];
  const hasCircle = badge.circle !== "none";
  const label = badge.label?.trim();
  return (
    <span
      role={label ? "img" : undefined}
      aria-label={label || undefined}
      aria-hidden={label ? undefined : true}
      className={`inline-flex shrink-0 items-center justify-center rounded-full ${hasCircle ? `${size.circle} ${circle.circle}` : size.bare} ${colour.cls || circle.icon} ${className}`}
    >
      <Icon name={badge.icon} solid={badge.style !== "outline"} className={hasCircle ? size.icon : "size-full"} />
    </span>
  );
}
