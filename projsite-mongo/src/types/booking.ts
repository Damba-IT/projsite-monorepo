export interface GetBookingsParams {
    project_id: string;
    startDate: string;
    endDate: string;
    zones?: string[];
    subProjects?: string[];
    contractors?: string[];
    resources?: string[];
    requestStatus?: string;
    isConfirmed?: boolean;
}

export type BookingType = "shipment" | "waste" | "resource";

export function isValidBookingType(type: string): boolean {
  return ['shipment', 'waste', 'resource'].includes(type);
}