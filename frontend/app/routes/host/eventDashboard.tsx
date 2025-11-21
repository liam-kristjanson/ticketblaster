import { useContext, useEffect, useState } from "react";
import { Container, Spinner, Table } from "react-bootstrap";
import { Navigate, useLocation } from "react-router"
import type { ServerMessage, Ticket, TicketEvent } from "types";
import { AuthContext } from "~/context/authContext";

export default function EventDashboard() {

    const event : TicketEvent = useLocation().state?.event;

    if (!event) return <>
        <h1>Error loading event details! Please try again</h1>
    </>

    const { user } = useContext(AuthContext);
    if (!user) return <Navigate to="/login"/>

    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [ticketsLoading, setTicketsLoading] = useState<boolean>(false);
    const [ticketLoadMsg, setTicketLoadMsg] = useState<ServerMessage>(['', 'info']);

    useEffect(() => {
        setTicketsLoading(true);

        fetch(import.meta.env.VITE_SERVER + "/host/tickets?eventId=" + event._id, {
            method: "GET",
            headers: {
                authorization: user.authToken
            }
        })
        .then(response => {
            response.json().then(responseJson => {
                if (response.ok) {
                    setTickets(responseJson);
                    console.log("Fetched tickets: ", responseJson);
                } else {
                    setTicketLoadMsg([responseJson.error ?? "An error occured while loading tickets", "danger"]);
                }
            })
        })
        .catch(err => {
            console.error(err);
            setTicketLoadMsg(["An unexpected error occured while loading tickets.", "danger"]);
        })
        .finally(() => {
            setTicketsLoading(false);
        })
    }, [user])

    return <>
        <Container>
            <h1>Event Dashboard : {event.title}</h1>

            <h3>Tickets:</h3>
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
                            Is Scanned?
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {ticketsLoading ? (
                        <tr>
                            <td colSpan={100}>
                                <Spinner/> Loading tickets...
                            </td>
                        </tr>
                    ) : tickets.map(ticket => (
                        <tr key={ticket._id}>
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
                                {ticket.isScanned ? "Yes" : "No"}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    </>
}