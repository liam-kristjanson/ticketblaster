import { useContext, useState } from "react";
import { Button, Form, Modal, Spinner } from "react-bootstrap";
import type { ServerMessage, TicketEvent } from "types";
import { AuthContext } from "~/context/authContext";
import ServerResponseContainer from "../ServerResopnseContainer";

interface TicketCreationModalProps {
    show: boolean;
    event: TicketEvent;
    hideModal: () => void;
}

export default function TicketCreationModal({show, event, hideModal}:  TicketCreationModalProps) {

    const { user } = useContext(AuthContext);

    const [numTickets, setNumTickets] = useState<number>(1);
    const [inputFeedback, setInputFeedback] = useState<string>("");
    const [ticketsProcessing, setTicketsProcessing] = useState<boolean>(false);
    const [serverMsg, setServerMsg] = useState<ServerMessage>(['', 'info']);

    function validateNumTickets(numTickets : number) {

        setInputFeedback("");

        if (numTickets < 1) {
            setInputFeedback("Number of tickets must be at least 1.");
        } else if (numTickets > event.venue.capacity) {
            setInputFeedback("Number of tickets exceeds venue capacity!");
        }
    }


    function handleCreateTickets() {
        setTicketsProcessing(true);
        setServerMsg(['', 'info']);

        const QUERY_PARAMS = new URLSearchParams({
            eventId: event._id,
            count: numTickets.toString()
        });

        fetch(import.meta.env.VITE_SERVER + "/tickets?" + QUERY_PARAMS.toString(), {
            method: "POST",
            headers: {
                authorization: user?.authToken ?? ""
            }
        })
        .then(response => {
            response.json().then(responseJson => {
                if (response.ok) {
                    alert(responseJson.message ?? "Success");
                } else {
                    setServerMsg([responseJson.error ?? "An error occured while creating tickets", "danger"]);
                }
            })
        })
        .catch(err => {
            console.error(err);
            setServerMsg(['An unexpected error occured while creating tickets', 'danger']);
        })
        .finally(() => {
            setTicketsProcessing(false);
        })
    }

    return <>
        <Modal show={show} onHide={() => {hideModal()}}>
            <Modal.Header closeButton>
                <Modal.Title>Release Tickets for {event.title}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <p>
                    Venue: {event.venue.name}, {event.venue.address}
                </p>

                <p>
                    Capacity: {event.venue.capacity}
                </p>

                <Form>
                    <Form.Group>
                        <Form.Label>Number of tickets to release:</Form.Label>
                        <Form.Control disabled={ticketsProcessing} isInvalid={Boolean(inputFeedback)} type="number" value={numTickets} onChange={(e) => {setNumTickets(parseInt(e.target.value)); validateNumTickets(parseInt(e.target.value))}}/>
                        <Form.Control.Feedback type="invalid">{inputFeedback}</Form.Control.Feedback>
                    </Form.Group>
                </Form>

                <ServerResponseContainer response={serverMsg}/>
            </Modal.Body>

            <Modal.Footer>
                {ticketsProcessing ? (
                    <>
                        <Spinner/> Creating Tickets...
                    </>
                ) : (
                    <>
                        <Button variant="secondary" onClick={() => {hideModal()}}>Close</Button>
                        <Button onClick={() => {handleCreateTickets()}}>Release Tickets</Button>
                    </>  
                )}
            </Modal.Footer>
        </Modal>
    </>
}