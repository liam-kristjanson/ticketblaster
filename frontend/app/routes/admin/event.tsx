import { useContext, useState } from "react";
import { Button, Container, Form, Modal, Spinner } from "react-bootstrap";
import { useLocation } from "react-router";
import { type MessageType, type Ticket, type TicketEvent } from "types";
import ServerMessageContainer from "~/components/ServerMessageContainer";
import { AuthContext } from "~/context/authContext";

export default function Event() {

    const { state } = useLocation();
    const { user } = useContext(AuthContext);
    const event = state as TicketEvent;
    
    const [showModal, setShowModal] = useState<boolean>(false);
    const [numTickets, setNumTickets] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    
    const [msg, setMsg] = useState<string>("");
    const [msgType, setMsgType] = useState<MessageType>("info");

    function handleSubmit() {

        setIsLoading(true);
        setMsg("");

        const params = new URLSearchParams({eventId: event._id, count: numTickets.toString()})

        fetch(import.meta.env.VITE_SERVER + "/admin/tickets?" + params.toString(), {
            method: "POST",
            headers: {
                Authorization: user?.authToken ?? ""
            }
        })
        .then(response => {
            response.json().then(responseJson => {
                setIsLoading(false);

                if (response.ok) {
                    setMsg(responseJson.message ?? "Success");
                    setMsgType("success");
                } else {
                    setMsg(responseJson.error ?? "An unexpected error occured while creating tickets");
                    setMsgType("danger")
                }
            })
        })
        .catch(err => {
            setIsLoading(false);
            setMsgType("danger");
            console.error(err);
            setMsg("An unexpected error occured while creating tickets (see console)");
        })
    }

    return (
        <>
            <Container>
                <h1 className="text-primary">Event details</h1>

                <p>Title: {event.title}</p>
                <p>Start Time: {new Date(event.startTime).toLocaleString()}</p>
                <p>Location: {event.venue.name}</p>
                
                <Button onClick={() => {setShowModal(true)}}>Create Tickets</Button>

                <Modal show={showModal} >
                    <Modal.Header closeButton onHide={() => {setShowModal(false)}}>
                        Add Tickets for {event.title}
                    </Modal.Header>

                    <Modal.Body>
                        {isLoading ? (
                            <>
                                <Spinner/> Processing...
                            </>
                        ) : (
                            <>
                                <Form onSubmit={(e) => {e.preventDefault(); handleSubmit()}}>
                                    <Form.Group>
                                        <Form.Label>Number of Tickets</Form.Label>
                                        <Form.Control type="number" max={100} value={numTickets} onChange={e => {setNumTickets(parseInt(e.target.value))}}/>
                                    </Form.Group>
                                </Form>

                                {msg && <ServerMessageContainer messageType={msgType} serverMessage={msg}/>}
                            </>
                        )}
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => {setShowModal(false)}}>Close</Button>
                        <Button variant="primary" onClick={() => handleSubmit()}>Create Tickets</Button>
                    </Modal.Footer>
                </Modal>
            </Container>

            
        </>
    )
}