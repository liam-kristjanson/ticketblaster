import { useState } from "react";
import { Button, Card, Col, Container, Form, Modal, Row, Spinner } from "react-bootstrap";
import { Link } from "react-router";
import type { MessageType } from "types";
import ServerMessageContainer from "~/components/ServerMessageContainer";

export default function CreateEvent() {

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [title, setTitle] = useState<string>("");
    const [location, setLocation] = useState<string>("");
    const [time, setTime] = useState<string>("");

    const [dateError, setDateError] = useState<string>("");
    const [titleError, setTitleError] = useState<string>("");
    const [locationError, setLocationError] = useState<string>("");

    const [message, setMessage] = useState<string>("");
    const [msgType, setMsgType] = useState<MessageType>("success");

    function handleSubmit() {
        let isFormValid = true;

        if (!title) {
            setTitleError("Please Provide a Title")
            isFormValid = false;
        }

        if (!location) {
            setLocationError("Please provide a Location");
            isFormValid = false;
        }

        let eventDateTime = new Date(time)

        if (isNaN(eventDateTime.getTime())) {
            setDateError("Please enter a valid date");
            isFormValid = false;
        } else if (eventDateTime.getTime() < Date.now()) {
            setDateError("Event date must be in the future");
            isFormValid = false;
        }

        let eventObject = {
            title, 
            eventLocation: location, 
            startTime: eventDateTime
        }

        console.log(eventObject);

        if (isFormValid) {
            setIsLoading(true);
            setMessage("");

            fetch(import.meta.env.VITE_SERVER + "/event",
                {
                    method: "POST",
                    headers: {
                        "content-type": "application/json"
                    },
                    body: JSON.stringify(eventObject)
                }
            )
            .then(response => {
                response.json().then(responseJson => {
                    console.log(responseJson);
                    setIsLoading(false);
                    if (response.ok) {
                        setMsgType("success");
                        setMessage(responseJson.message ?? "Success")
                    } else {
                        setMsgType("danger");
                        setMessage(responseJson.error ?? "An unexpected error occured while creating your event");
                    }
                })
            })
            .catch(err => {
                console.error(err);
                setIsLoading(false);
                setMessage("An unexpected error occured while creating your event");
                setMsgType("danger");
            })
        }
    }

    function handleDateChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setTime(e.target.value);
        setDateError("");
    }

    return (
        <>
            <Link to="/admin" className="ms-2">{"\u2190"}Return to dashboard</Link>
            <Container>
                
                <Row>
                    <h1 className="text-primary">Create an Event</h1>
                </Row>

                <Row>
                    <Col>
                        <Card>
                            <Card.Header>
                                Event Details
                            </Card.Header>

                            <Card.Body>
                                <Form>
                                    <Form.Group>
                                        <Form.Label>Title</Form.Label>
                                        <Form.Control autoFocus type="text" value={title} disabled={isLoading} isInvalid={Boolean(titleError)} onChange={(e) => {setTitle(e.target.value); setTitleError("")}}/>
                                        <Form.Control.Feedback type="invalid">{titleError}</Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label>Location</Form.Label>
                                        <Form.Control type="text" value={location} disabled={isLoading} isInvalid={Boolean(locationError)} onChange={(e) => {setLocation(e.target.value); setLocationError("")}}/>
                                        <Form.Control.Feedback type="invalid">{locationError}</Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label>Time</Form.Label>
                                        <Form.Control type="datetime-local" disabled={isLoading} isInvalid={Boolean(dateError)} value={time} onChange={(e) => {handleDateChange(e)}}/>
                                        <Form.Control.Feedback type="invalid">{dateError}</Form.Control.Feedback>
                                    </Form.Group>
                                </Form>
                            </Card.Body>

                            <Card.Footer>
                                {isLoading ? (
                                    <>
                                        <Spinner/> Processing Event...
                                    </>
                                ) : (
                                    <Button onClick={() => {handleSubmit()}}>Create Event</Button>
                                )}
                                
                            </Card.Footer>
                        </Card>
                    </Col>
                </Row>

                <Row>
                    {message && <ServerMessageContainer messageType={msgType} serverMessage={message}/>}
                </Row>
            </Container>
        </>
    )
}