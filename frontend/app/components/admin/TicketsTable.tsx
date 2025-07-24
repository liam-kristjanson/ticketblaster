import { useEffect, useState } from "react";
import { Table, Spinner, Button } from "react-bootstrap";
import { Link } from "react-router";
import type { Ticket } from "types";
import ServerMessageContainer from "../ServerMessageContainer";

export default function TicketsTable() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [isTicketsLoading, setIsTicketsLoading] = useState<boolean>(false);
    const [ticketFetchErr, setTicketFetchErr] = useState<string>("");

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

    return (
        <>
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
                        <td colSpan={100}>
                            <Link to="/admin/create-tickets">
                                <Button> + Add Tickets</Button>
                            </Link>
                        </td>
                    </tr>
                </tfoot>
            </Table>
        </>
    )
}