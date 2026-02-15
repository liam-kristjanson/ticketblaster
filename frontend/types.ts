export interface Ticket {
    _id: string;
    scanCode: string;
    isScanned: boolean;
    event: TicketEvent;
    status: TicketStatus;
    price?: string;
    owner?: User;
    purchaseTime?: Date;
}

export interface TicketEvent {
    _id: string;
    title: string;
    venue: Venue;
    startTime: Date;
}

export type MessageType = "success" | "danger" | "info";

export type TicketStatus = "available" | "hold" | "sold";

export interface User {
    id: string;
    username: string;
    password: string;
    role: string;
    authToken: string;
}

export interface Venue {
    name: string;
    address: string;
    capacity: number;
    owner?: User;
    _id: string;
}

export type ServerMessage = [message: string, type: MessageType]