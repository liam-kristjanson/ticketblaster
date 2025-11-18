import { useContext, useEffect, useState } from "react";
import { Button, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router";
import { type ServerMessage, type Venue } from "types";
import ServerResponseContainer from "~/components/ServerResopnseContainer";
import { AuthContext } from "~/context/authContext";

export default function CreateEvent() {

    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [venues, setVenues] = useState<Venue[]>([]);
    const [isVenuesLoading, setIsVenuesLoading] = useState<boolean>(false);
    const [venuesFetchMsg, setVenuesFetchMsg] = useState<ServerMessage>(['', 'info']);

    const [selectedVenueId, setSelectedVenueId] = useState<string>("");
    const [eventTitle, setEventTitle] = useState<string>("");
    const [eventStartTime, setEventStartTime] = useState<string>("");
    
    const [isEventProcessing, setIsEventProcessing] = useState<boolean>(false);
    const [eventCreationMsg, setEventCreationMsg] = useState<ServerMessage>(['', 'info']);



    //FETCH AVAILABLE VENUES
    useEffect(() => {
        setIsVenuesLoading(true);
        fetch(import.meta.env.VITE_SERVER + "/my-venues", {
            headers: {
                authorization: user?.authToken ?? ""
            }
        })
        .then(response => {
            response.json().then(responseJson => {
                if (response.ok) {
                    setVenues(responseJson);
                } else {
                    setVenuesFetchMsg([responseJson.error ?? "An error occured while fetching venues", 'danger']);
                }
            })
        })
        .catch(err => {
            console.error(err);
            setVenuesFetchMsg(['An unexpected error occured while fetching venues', 'danger']);
        })
        .finally(() => {
            setIsVenuesLoading(false);
        })
    }, [user]);

    //HANDLE CREATION OF EVENT
    function handleCreateEvent() {
        const eventBody = {
            title: eventTitle,
            venue: selectedVenueId,
            startTime: eventStartTime
        }

        setIsEventProcessing(true);

        fetch(import.meta.env.VITE_SERVER + "/event", {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "authorization": user?.authToken ?? ""
            },
            body: JSON.stringify(eventBody)
        })
        .then(response => {
            response.json().then(responseJson => {
                if (response.ok) {
                    alert(responseJson.message ?? "Success");
                    navigate('/host');
                } else {
                    setEventCreationMsg([responseJson.error ?? "An error occured while creating the event", "danger"]);
                }
            })
        })
        .catch(err => {
            console.error(err);
            setEventCreationMsg(['An unexpected error occured while creating the event.', 'danger'])
        })
        .finally(() => {
            setIsEventProcessing(false);
        })
    }

    return <>
        <Container className="pt-3">

            <Row>
                <Link to="/host">{"\u2190"} Back to dashboard</Link>
            </Row>

            <Row>
                <h1>Create Event</h1>
            </Row>

            <Row>
                <Col xl={4}>
                    <Form>

                        <Form.Group>
                            <Form.Label>Title</Form.Label>
                            <Form.Control disabled={isEventProcessing} value={eventTitle} onChange={(e) => {setEventTitle(e.target.value)}} type="text"/>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Venue</Form.Label>
                            <Form.Select disabled={isEventProcessing} value={selectedVenueId} onChange={(e) => {setSelectedVenueId(e.target.value)}}>
                                {isVenuesLoading ? (
                                    <option disabled>Loading venues...</option>
                                ) : (
                                    <>
                                    <option value="">-- Select a venue --</option>
                                    {venues.map(venue => (
                                        <option key={venue._id} value={venue._id}>{venue.name}, {venue.address}. Capacity: {venue.capacity}</option>
                                    ))}
                                    </>
                                )}
                            </Form.Select>

                            {venuesFetchMsg && <ServerResponseContainer response={venuesFetchMsg}/>}
                        </Form.Group>


                        <Form.Group className="mb-3">
                            <Form.Label>Start Time</Form.Label>
                            <Form.Control disabled={isEventProcessing} value={eventStartTime} onChange={(e) => {setEventStartTime(e.target.value)}}type="datetime-local"/>
                        </Form.Group>

                        {eventCreationMsg && <ServerResponseContainer response={eventCreationMsg}/>}

                        {isEventProcessing ? (
                            <>
                                <Spinner/> Processing Event...
                            </>
                        ) : (
                            <Button size="lg" onClick={() => {handleCreateEvent()}}>Create Event</Button>
                        )}
                        
                    </Form>
                </Col>
            </Row>

            <hr/>
        </Container>
    </>
}