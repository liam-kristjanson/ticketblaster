import { useState } from "react";
import { Badge, Button, Card, Container, Modal, Row } from "react-bootstrap";
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
                    Ticket for {ticket.event?.title ?? "Unknown"}
                </Card.Title>

                <Card.Text>
                    <p>
                        Date: {new Date(ticket.event.startTime).toLocaleDateString() ?? "Unknown"}
                    </p>

                    <p>
                        Time: {new Date(ticket.event.startTime).toLocaleTimeString() ?? "Unknown"}
                    </p>

                    <p>
                        {ticket.isScanned ? (
                            <>
                                <Badge bg={"warning"}>Scanned in</Badge>
                            </>
                        ) : (
                            <>
                                <Badge bg={"success"}>Unused</Badge>
                            </>
                        )}
                    </p>
                    
                </Card.Text>

                <Button variant="primary" className="me-1" onClick={() => {setShowTicketModal(true)}}>Show Ticket</Button>
                <Link to="event" state={{event: ticket.event}}><Button variant="outline-dark">View event</Button></Link>
            </Card.Body>

            <Modal show={showTicketModal} onHide={() => {setShowTicketModal(false)}}>
                <Modal.Header closeButton>
                    <Modal.Title className="text-primary">
                        Ticket for {ticket.event.title}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Container>

                        <Row className="mb-3">
                            <QRCode value={ticket._id}/>
                        </Row>

                        <Row>
                            <p>
                                Ticket id: {ticket._id}
                            </p>

                            <p>
                                Event date: {new Date(ticket.event.startTime).toLocaleDateString()}
                            </p>

                            <p>
                                Price: {ticket.price}
                            </p>

                            {ticket.purchaseTime && <p>Purchased by {ticket.owner?.username ?? "Unknown"} on {new Date(ticket.purchaseTime).toLocaleString()}</p>}

                            {ticket.isScanned && <p className="text-danger">This ticket has already been scanned.</p>}
                        </Row>
                    </Container>
                </Modal.Body>
            </Modal>
        </Card>
    )
}