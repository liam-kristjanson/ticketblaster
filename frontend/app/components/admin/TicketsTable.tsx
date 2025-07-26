import { useContext, useEffect, useState } from "react";
import { Table, Spinner, Button } from "react-bootstrap";
import { Link, Navigate } from "react-router";
import { type MessageType, type Ticket } from "types";
import ServerMessageContainer from "../ServerMessageContainer";
import { AuthContext } from "~/context/authContext";

export default function TicketsTable() {

    const { user } = useContext(AuthContext);

    if (!user) return <Navigate to="/login" state={{msg: "Your session has expired. Please log in again"}}/>

    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [isTicketsLoading, setIsTicketsLoading] = useState<boolean>(false);
    const [refreshes, setRefreshes] = useState<number>(0);

    const [msg, setMsg] = useState<string>("");
    const [msgType, setMsgType] = useState<MessageType>("info");

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
                    setMsg(responseJson.err ?? "An error occured while fetching tickets");
                    setMsgType("danger");
                }
            })
        })
        .catch(err => {
            setMsg("An unexpected error occured while fetching tickets (see console)");
            setMsgType("danger");
            console.error(err);
        })
    }, [refreshes])

    const deleteTicket = (ticket: Ticket) => {
        setIsTicketsLoading(true);

        const query = new URLSearchParams({ticketId: ticket._id});

        fetch(import.meta.env.VITE_SERVER + "/ticket?" + query.toString(), {
            method: "DELETE",
            headers: {
                authorization: user.authToken
            }
        })
        .then(response => {
            setIsTicketsLoading(false);
            response.json().then(resopnseJson => {
                if (response.ok) {
                    setMsg(resopnseJson.message ?? "Success");
                    setMsgType("success");
                    setRefreshes(refreshes + 1);
                } else {
                    setMsg(resopnseJson.error ?? "An unexpected error occured while deleting ticket (see console)");
                    setMsgType("danger");
                    console.error(resopnseJson);
                }
            })
        })
        .catch(err => {
            console.error(err);
            setMsgType("danger");
            setMsg("An unexpected error occured while deleting ticket (see console)");
        })
    }

    return (
        <>
            {msg && <ServerMessageContainer messageType={msgType} serverMessage={msg}/>}
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
                                    <Button variant="secondary" className="mx-1">Un-Scan</Button>
                                    <Button variant="danger" onClick={() => {deleteTicket(ticket)}}>Delete</Button>
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