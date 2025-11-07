import { useState } from "react";
import { Button, Card, Modal } from "react-bootstrap";
import QRCode from "react-qr-code";
import { Link } from "react-router";
import type { Ticket } from "types";

interface TicketCardProps {
    ticket: Ticket
}

export default function TicketCard({ticket} : TicketCardProps) {

    const [showTicketModal, setShowTicketModal] = useState<boolean>(false);

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

                <Button variant="primary" className="me-1" onClick={() => {setShowTicketModal(true)}}>Show Ticket</Button>
                <Link to="event" state={{event: ticket.event}}><Button variant="outline-dark">View event</Button></Link>
            </Card.Body>

            <Modal show={showTicketModal} onHide={() => {setShowTicketModal(false)}}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Ticket for {ticket.event.title}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <QRCode value={ticket._id}/>

                    <br/>
                    {ticket.event.eventLocation}
                </Modal.Body>
            </Modal>
        </Card>
    )
}