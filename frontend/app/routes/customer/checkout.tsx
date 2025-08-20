import { Button, Container, Form, Row } from "react-bootstrap";
import { useLocation } from "react-router";
import type { Ticket } from "types";

export default function Checkout() {

    const { state } = useLocation();
    const ticket = state.ticket as Ticket;

    return <>
        <Container>
            <h1 className="text-primary">Checkout</h1>
            <hr/>

            <h3>
                Event Details
            </h3>

            <p>
                Event: {ticket.event?.title}
            </p>

            <p>
                Location: {ticket.event?.eventLocation}
            </p>

            <p>
                Event Date: {new Date(ticket.event?.startTime ?? "").toLocaleDateString()}
            </p>

            <p>
                Start Time: {new Date(ticket.event?.startTime?? "").toLocaleTimeString()}
            </p>
            <hr/>

            <h3>
                Ticket Details
            </h3>

            <p>
                ID: {ticket._id}
            </p>

            <p>
                Price: {ticket.price ?? "Free"}
            </p>
            <hr/>

            <Form className="container-fluid p-0">
                <h3>Customer Details</h3>

                <Row>
                    <Form.Group className="col-6">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control type="text"/>
                    </Form.Group>

                    <Form.Group className="col-6">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control type="text"/>
                    </Form.Group>
                </Row>

                <Row>
                    <Form.Group className="">
                        <Form.Label>E-Mail</Form.Label>
                        <Form.Control type="email"/>
                    </Form.Group>
                </Row>

                <Row>
                    <Form.Group>
                        <Form.Label>Phone</Form.Label>
                        <Form.Control type="phone"/>
                    </Form.Group>
                </Row>

                <hr/>

                <h3>Payment</h3>

                <Row>
                    <Form.Group className="col-6">
                        <Form.Label>Name on Card</Form.Label>
                        <Form.Control type="text"/>
                    </Form.Group>
                </Row>

                <Row>
                    <Form.Group className="col-6">
                        <Form.Label>Card Number</Form.Label>
                        <Form.Control type="text"/>
                    </Form.Group>
                </Row>

                <Row className="mb-3">
                    <Form.Group className="col-3">
                        <Form.Label>Expiry</Form.Label>
                        <Form.Control type="month"/>
                    </Form.Group>

                    <Form.Group className="col-3">
                        <Form.Label>CVV</Form.Label>
                        <Form.Control type="text"/>
                    </Form.Group>
                </Row>

                <Button size="lg">Purchase Ticket(s)</Button>
            </Form>

            <hr/>
        </Container>
    </>
}