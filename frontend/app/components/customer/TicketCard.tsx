import { Button, Card } from "react-bootstrap";
import type { Ticket } from "types";

interface TicketCardProps {
    ticket: Ticket
}

export default function TicketCard({ticket} : TicketCardProps) {
    return (
        <Card className="w-100">
            <Card.Img variant="top" src="/sample-concert.jpg" className="w-100"/>

            <Card.Body>
                <Card.Title>
                    {ticket.event?.title ?? "Unknown"}
                </Card.Title>

                <Card.Text>
                    <p>
                        Date: {new Date(ticket.event.startTime).toLocaleDateString() ?? "Unknown"}
                    </p>

                    <p>
                        Time: {new Date(ticket.event.startTime).toLocaleTimeString() ?? "Unknown"}
                    </p>
                    
                </Card.Text>

                <Button variant="primary" className="me-1">Show Ticket</Button>
                <Button variant="outline-dark">View event</Button>
            </Card.Body>

            
        </Card>
    )
}