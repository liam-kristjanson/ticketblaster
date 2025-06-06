import { useEffect, useState } from "react";
import { Button, Card, Container, Spinner, Table } from "react-bootstrap";
import { Link } from "react-router";
import type { Ticket, TicketEvent } from "types";
import ServerMessageContainer from "~/components/ServerMessageContainer";

export default function AdminDashboard() {

    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [isTicketsLoading, setIsTicketsLoading] = useState<boolean>(false);
    const [ticketFetchErr, setTicketFetchErr] = useState<string>("");

    const [events, setEvents] = useState<TicketEvent[]>([]);
    const [isEventsLoading, setIsEventsLoading] = useState<boolean>(false);
    const [eventFetchErr, setEventFetchErr] = useState<string>("");

    //fetch tickets
    useEffect(() => {

        setIsTicketsLoading(true);

        fetch(import.meta.env.VITE_SERVER + "/ticket/all")
        .then(response => {
            setIsTicketsLoading(false);
            response.json().then(responseJson => {
                if (response.ok) {
                    setTickets(responseJson);
                } else {
                    console.error(responseJson);
                    setTicketFetchErr(responseJson.err ?? "An error occured while fetching tickets");
                }
            })
        })
        .catch(err => {
            setTicketFetchErr("An unexpected error occured while fetching tickets (see console)");
            console.error(err);
        })
    }, [])

    //fetch events
    useEffect(() => {
        setIsEventsLoading(true);

        fetch(import.meta.env.VITE_SERVER + "/event/all")
        .then(response => {
            setIsEventsLoading(false)

            response.json().then(responseJson => {
                if (response.ok) {
                    setEvents(responseJson)
                } else {
                    setEventFetchErr(responseJson.error ?? "An error occured while fetching events");
                }
            })
        }).catch(err => {
            setEventFetchErr("An unexpected error occured while fetching events (see console)");
            console.error(err);
        })
    }, [])

    return (
        <>
            <Container>
                <h1 className="text-primary">Welcome to the admin dashboard</h1>

                <h3 className="text-primary">Events</h3>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>
                                Event Title
                            </th>

                            <th>
                                ID
                            </th>

                            <th>
                                Location
                            </th>

                            <th>
                                Start Time
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {events.map(event => (
                            <tr key={event._id}>
                                <td>
                                    {event.title}
                                </td>

                                <td>
                                    {event._id}
                                </td>

                                <td>
                                    {event.eventLocation}
                                </td>

                                <td>
                                    {new Date(event.startTime).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

                <h3 className="text-primary">Tickets</h3>
                {ticketFetchErr && <ServerMessageContainer messageType="danger" serverMessage={ticketFetchErr}/>}
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>
                                Scan Code
                            </th>

                            <th>
                                Event Id
                            </th>

                            <th>
                                Is Scanned?
                            </th>

                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {isTicketsLoading && (
                            <tr>
                                <td colSpan={100}>
                                    <Spinner/> Tickets Loading...
                                </td>
                            </tr>
                        )}

                        {tickets?.map(ticket => (
                            <tr key={ticket._id}>
                                <td>
                                    {ticket.scanCode}
                                </td>

                                <td>
                                    {ticket.eventId}
                                </td>

                                <td>
                                    {ticket.isScanned ? "True" : "False"}
                                </td>

                                <td>
                                    <div className="d-flex flex-row">
                                        <Button className="mx-1">Un-Scan</Button>
                                        <Button>Delete</Button>
                                    </div>
                                    
                                </td>
                            </tr>
                        ))}
                        
                    </tbody>

                    <tfoot>
                        <tr>
                            <td>
                                <Link to="/admin/create-tickets">
                                    <Button> + Add Tickets</Button>
                                </Link>
                            </td>
                        </tr>
                    </tfoot>
                </Table>
            </Container>    
        </>
    )
}