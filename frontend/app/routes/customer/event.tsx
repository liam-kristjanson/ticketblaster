import { useEffect, useState } from "react";
import { Button, Container, Table } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router";
import { type Ticket, type TicketEvent } from "types";
import ServerMessageContainer from "~/components/ServerMessageContainer";

export default function Event() {
    const { state } = useLocation();
    const event = state.event as TicketEvent;

    const navigate = useNavigate();

    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [msg, setMsg] = useState<string>("");

    useEffect(() => {
        const params = new URLSearchParams({eventId: event._id});

        fetch(import.meta.env.VITE_SERVER + "/customer/tickets?" + params.toString())
        .then(response => {
            response.json().then(json => {
                console.log("Event tickets:")
                console.log(json);
                if (response.ok) {
                    setTickets(json);
                } else {
                    setMsg(json.error ?? "An error occured while fetching tickets.");
                }
            })
        })
        .catch(err => {
            console.error(err);
            setMsg("An unexpected error occured while fetching tickets (see console)");
        })
    }, [])

    return (
        <>
            <Container>
                <h1 className="text-primary">Event details: {event.title}</h1>

                <h3 className="text-primary">Available Tickets</h3>

                {msg && <ServerMessageContainer messageType="danger" serverMessage={msg}/>}
            
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>
                                ID
                            </th>

                            <th>
                                Status
                            </th>

                            <th>
                                Scan Code
                            </th>

                            <th>
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {tickets.map(ticket => (
                            <tr>
                                <td>
                                    {ticket._id}
                                </td>

                                <td>
                                    {ticket.status}
                                </td>

                                <td>
                                    {ticket.scanCode}
                                </td>

                                <td>
                                    <Button onClick={() => {navigate('../checkout', {state: {ticket}})}}>Purchase</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>
        </>
    )
}