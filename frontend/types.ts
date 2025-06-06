export interface Ticket {
    _id: string;
    scanCode: string;
    isScanned: boolean;
    eventId: string;
}

export interface TicketEvent {
    _id: string;
    title: string;
    eventLocation: string;
    startTime: Date;
}

export type MessageType = "success" | "danger";