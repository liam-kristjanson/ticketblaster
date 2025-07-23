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

export interface User {
    _id: string;
    username: string;
    password: string;
    role: string;
    authToken: string;
}