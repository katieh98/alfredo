import {
  AlignLeft,
  Calendar,
  Circle,
  Clock,
  Grid3X3,
  Hash,
  Tag,
  ToggleLeft,
  Type,
  type LucideIcon,
} from "lucide-react";

const REGISTRY: Record<string, LucideIcon> = {
  type: Type,
  text: AlignLeft,
  "align-left": AlignLeft,
  number: Hash,
  hash: Hash,
  calendar: Calendar,
  clock: Clock,
  date: Calendar,
  circle: Circle,
  status: Circle,
  tag: Tag,
  grid: Grid3X3,
  multiselect: Grid3X3,
  boolean: ToggleLeft,
};

interface FieldIconProps {
  name: string;
  size?: number;
}

/** Resolves a `FieldDef.icon` string to a lucide icon. Falls back to a
 *  neutral circle so an unknown icon name doesn't blow up the layout. */
export function FieldIcon({ name, size = 13 }: FieldIconProps) {
  const Icon = REGISTRY[name] ?? Circle;
  return <Icon size={size} strokeWidth={1.75} />;
}
