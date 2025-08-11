import { useLocation } from "react-router";
import type { TicketEvent } from "types";

export default function Event() {
    const { state } = useLocation();
    const event = state.event as TicketEvent;

    return (
        <>
            <h1 className="text-primary">Event details: {event.title}</h1>

            
        </>
    )
}