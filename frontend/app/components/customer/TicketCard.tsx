import { Button, Card } from "react-bootstrap";

export default function TicketCard() {
    return (
        <Card className="w-100">
            <Card.Img variant="top" src="/sample-concert.jpg" className="w-100"/>

            <Card.Body>
                <Card.Title>
                    Ticket 1
                </Card.Title>

                <Card.Text>
                    This is the description for event 1
                </Card.Text>

                <Button variant="primary" className="me-1">Show Ticket</Button>
                <Button variant="outline-dark">View event</Button>
            </Card.Body>

            
        </Card>
    )
}