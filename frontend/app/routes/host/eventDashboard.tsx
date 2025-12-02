import { useContext, useEffect, useState } from "react";
import { Button, Container, Modal, Spinner, Table } from "react-bootstrap";
import { Navigate, useLocation, useNavigate } from "react-router"
import type { ServerMessage, Ticket, TicketEvent } from "types";
import ServerResponseContainer from "~/components/ServerResopnseContainer";
import { AuthContext } from "~/context/authContext";

export default function EventDashboard() {

    const event : TicketEvent = useLocation().state?.event;

    if (!event) return <>
        <h1>Error loading event details! Please try again</h1>
    </>

    const navigate = useNavigate();

    const { user } = useContext(AuthContext);
    if (!user) return <Navigate to="/login"/>

    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [ticketsLoading, setTicketsLoading] = useState<boolean>(false);
    const [ticketLoadMsg, setTicketLoadMsg] = useState<ServerMessage>(['', 'info']);

    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [isEventDeleting, setIsEventDeleting] = useState<boolean>(false);
    const [eventDeletionMsg, setEventDeletionMsg] = useState<ServerMessage>(['', 'info'])

    function handleDeleteEvent() {
        setIsEventDeleting(true);
        setEventDeletionMsg(['', 'info']);

        fetch(import.meta.env.VITE_SERVER + "/event?eventId=" + event._id, {
            method: "DELETE",
            headers: {
                Authorization: user?.authToken ?? ""
            }
        })
        .then(response => {
            response.json().then(responseJson => {
                if (response.ok) {
                    setEventDeletionMsg([responseJson.message ?? "Success", "success"]);
                    setTimeout(() => {
                        navigate('/host');
                    }, 3000)
                } else {
                    setEventDeletionMsg([responseJson.error ?? "An error occured while deleting event.", 'danger']);
                }
            })
        })
        .catch(err => {
            console.error(err);
            setEventDeletionMsg(["An unexpected error occured while deleting event", "danger"]);
        })
        .finally(() => {
            setIsEventDeleting(false);
        })
    }

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

            <hr/>

            <h3>Event Management</h3>

            <Button className="mb-5" onClick={() => {setShowDeleteModal(true)}} size={"lg"} variant="danger">Delete Event</Button>
        </Container>

        <Modal show={showDeleteModal} onHide={() => {setShowDeleteModal(false)}}>
            <Modal.Header closeButton>
                <Modal.Title>Delete {event.title}?</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <p>
                    Are you sure you want to delete this event? This action cannot be undone. All created tickets will also be deleted.
                </p>

                <h5>Event Details</h5>
                <hr/>

                <p>
                    Title: {event.title}
                </p>

                <p>
                    Venue: {event.venue.name}
                </p>

                <p>
                    Date: {new Date(event.startTime).toLocaleDateString()}
                </p>

                <p>
                    Time: {new Date(event.startTime).toLocaleTimeString()}
                </p>
            </Modal.Body>

            <Modal.Footer>
                {isEventDeleting ? (
                    <>
                        <Spinner/> Deleting event...
                    </>
                ) : (
                    <>
                        <Button variant="secondary">Cancel</Button>
                        <Button variant="danger" onClick={() => {handleDeleteEvent()}}>Delete {event.title}</Button>
                    </>
                )}

                <ServerResponseContainer response={eventDeletionMsg}/>
            </Modal.Footer>
        </Modal>
    </>
}