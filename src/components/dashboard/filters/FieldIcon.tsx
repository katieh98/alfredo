import {
  FaAlignLeft,
  FaHashtag,
  FaCalendar,
  FaClock,
  FaCircle,
  FaTag,
  FaTableCellsLarge,
  FaToggleOff,
  FaFont,
} from "react-icons/fa6";
import type { IconType } from "react-icons";

const REGISTRY: Record<string, IconType> = {
  type: FaFont,
  text: FaAlignLeft,
  "align-left": FaAlignLeft,
  number: FaHashtag,
  hash: FaHashtag,
  calendar: FaCalendar,
  clock: FaClock,
  date: FaCalendar,
  circle: FaCircle,
  status: FaCircle,
  tag: FaTag,
  grid: FaTableCellsLarge,
  multiselect: FaTableCellsLarge,
  boolean: FaToggleOff,
};

interface FieldIconProps {
  name: string;
  size?: number;
}

export function FieldIcon({ name, size = 12 }: FieldIconProps) {
  const Icon = REGISTRY[name] ?? FaCircle;
  return <Icon size={size} />;
}
