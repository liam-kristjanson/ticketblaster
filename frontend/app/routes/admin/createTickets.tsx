import { useState } from "react";
import { Button, Container, Form, Row, Spinner } from "react-bootstrap";
import type { MessageType } from "types";
import ServerMessageContainer from "~/components/ServerMessageContainer";

export default function CreateTickets() {

    const [scanCode, setScanCode] = useState<string>("");
    const [eventId, setEventId] = useState<string>("");

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [resMsg, setResMsg] = useState<string>("");
    const [msgType, setMsgType] = useState<MessageType>("success");

    function createTicket() {
        setIsLoading(true);

        const requestBody = {
            scanCode: scanCode,
            eventId: eventId
        }

        console.log(requestBody);

        fetch(import.meta.env.VITE_SERVER + "/ticket", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(requestBody),
        })
        .then(response => {
            setIsLoading(false);
            response.json().then(responseJson => {
                if (response.ok) {
                    setMsgType("success");
                    setResMsg(responseJson.message ?? "Success");
                } else {
                    setMsgType("danger");
                    setResMsg(responseJson.error ?? "An unexpected error occured");
                }
            })
        })
        .catch(err => {
            setIsLoading(false);
            setMsgType("danger");
            setResMsg("An unexpected error occured (see console)");
            console.error(err);
        })

    }

    return (
        <>
            <Container>
                <Row>
                    <h1 className="text-primary">Create Tickets</h1>

                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Scan Code</Form.Label>
                            <Form.Control value={scanCode} onChange={(e) => {setScanCode(e.target.value)}}/>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Event Id</Form.Label>
                            <Form.Control value={eventId} onChange={(e) => {setEventId(e.target.value)}}/>
                        </Form.Group>

                        {isLoading ? (
                            <Spinner/>
                        ) : (
                            <Button onClick={() => {createTicket()}}>Submit</Button>
                        )}
                        
                    </Form>

                    <ServerMessageContainer messageType={msgType} serverMessage={resMsg}/>
                </Row>
            </Container>
        </>
    )
}