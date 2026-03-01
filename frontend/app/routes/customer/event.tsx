import { useContext, useEffect, useState } from "react";
import { Button, Container, Spinner, Table } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router";
import { type ServerMessage, type Ticket, type TicketEvent } from "types";
import ServerResponseContainer from "~/components/ServerResopnseContainer";
import { AuthContext } from "~/context/authContext";

export default function Event() {
    const { state } = useLocation();
    const event = state.event as TicketEvent;
    const { user } = useContext(AuthContext);

    const navigate = useNavigate();

    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [msg, setMsg] = useState<ServerMessage>(['', 'info']);

    useEffect(() => {
        const params = new URLSearchParams({eventId: event._id});

        fetch(import.meta.env.VITE_SERVER + "/customer/tickets?" + params.toString(), {
            headers: {
                authorization: user?.authToken ?? ""
            }
        })
        .then(response => {
            response.json().then(json => {
                console.log("Event tickets:")
                console.log(json);
                if (response.ok) {
                    setTickets(json);
                } else {
                    setMsg([json.error ?? "An error occured while fetching tickets.", "danger"]);
                }
            })
        })
        .catch(err => {
            console.error(err);
            setMsg(["An unexpected error occured while fetching tickets (see console)", "danger"]);
        })
    }, [])

    function handlePurchaseTicket(ticket: Ticket) {

        setIsLoading(true);

        fetch(import.meta.env.VITE_SERVER + "/customer/hold-ticket?id=" + ticket._id, {
            headers: {
                authorization: user?.authToken ?? ""
            }
        })
        .then(response => {
            response.json().then(json => {
                if (response.ok) {
                    navigate('../checkout', {state: {ticket}})
                } else {
                    setMsg([json.error ?? "An error occured while reserving ticket. Please try again later.", "danger"]);
                }
            }) 
        })
        .catch(err => {
            setMsg(["An unexpected error occured while reserving ticket. Please try again later", "danger"])
            console.error(err)
        })
        .finally(() => {
            setIsLoading(false);
        })
        
    }

    return (
        <>
            <Container>
                <h1 className="text-primary">Event details: {event.title}</h1>

                <p>
                    Venue: {event.venue.name}, {event.venue.address}
                </p>

                <p>
                    Time: {new Date(event.startTime).toLocaleString()}
                </p>

                <h3 className="text-primary">Available Tickets{tickets.length > 0 && " (" + tickets.length + ")"}</h3>

                {msg && <ServerResponseContainer response={msg}/>}
            
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

                        {isLoading ? 
                            <>
                                <tr>
                                    <td colSpan={100}>
                                        <Spinner/> Processing request...
                                    </td>
                                </tr>
                            </> : <>
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
                                            <Button onClick={() => {handlePurchaseTicket(ticket)}}>Purchase Ticket</Button>
                                        </td>
                                    </tr>
                                ))}
                            </>
                        }

                        
                    </tbody>
                </Table>
            </Container>
        </>
    )
}