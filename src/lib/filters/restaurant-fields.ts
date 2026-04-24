import type { Restaurant } from "@/app/dashboard/_data";
import type { FieldDef } from "./types";

/**
 * Filter schema for the reservations table. Every field here maps 1:1 to
 * a visible table column (Booking ID · Owner · Party · When · Source ·
 * Status) so the Filter and Sort menus always offer exactly what's on
 * screen. Restaurant-metadata fields (cuisine, rating, neighborhood)
 * intentionally aren't here — they describe the booking's match context
 * and live on the DetailPanel, not the list view.
 */
const STATIC_FIELDS: ReadonlyArray<FieldDef> = [
  {
    id: "bookingId",
    label: "Booking ID",
    type: "text",
    icon: "hash",
    visible: true,
  },
  {
    id: "hostName",
    label: "Owner",
    type: "text",
    icon: "type",
    visible: true,
  },
  {
    id: "partySize",
    label: "Party",
    type: "number",
    icon: "hash",
    visible: true,
  },
  {
    id: "whenLabel",
    label: "When",
    type: "text",
    icon: "clock",
    visible: true,
  },
  {
    id: "source",
    label: "Source",
    type: "select",
    icon: "tag",
    visible: true,
    options: ["Alfredo", "OpenTable", "Direct", "Resy", "Phone"],
  },
  {
    id: "confirmationState",
    label: "Status",
    type: "select",
    icon: "status",
    visible: true,
    options: ["confirmed", "seated", "pending", "cancelled"],
  },
];

/** Select-field options are constants today (enums on Restaurant). Keeping
 *  the builder signature so callers don't have to change when/if we move
 *  a field back to dynamic options. */
export function buildRestaurantFields(
  _restaurants: ReadonlyArray<Restaurant>,
): FieldDef[] {
  return STATIC_FIELDS.map((f) => ({ ...f }));
}

/** Project a Restaurant (really a booking row) into a plain record the
 *  filter engine reads by field id. Keys here MUST match `FieldDef.id`. */
export function restaurantToFilterRow(r: Restaurant): Record<string, unknown> {
  return {
    bookingId: r.bookingId,
    hostName: r.hostName,
    partySize: r.partySize,
    whenLabel: r.whenLabel,
    source: r.source,
    confirmationState: r.confirmationState,
  };
}
