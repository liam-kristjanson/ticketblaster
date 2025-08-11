import { useContext, useEffect, useState } from "react";
import { Button, Card, Carousel, Col, Container, Image, Row, Stack } from "react-bootstrap";
import { Link, NavLink, useNavigate } from "react-router";
import { type TicketEvent } from "types";
import TicketCard from "~/components/customer/TicketCard";
import { AuthContext } from "~/context/authContext"

export default function CustomerIndex() {
    
    const user = useContext(AuthContext);
    const navigate = useNavigate();

    const [events, setEvents] = useState<TicketEvent[]>([]);
    const [eventsLoading, setEventsLoading] = useState<boolean>(false);
    const [eventFetchErr, setEventFetchErr] = useState<string>("");

    useEffect(() => {
        setEventsLoading(true);

        fetch(import.meta.env.VITE_SERVER + "/event/all")
        .then(response => {
            response.json().then(json => {
                setEventsLoading(false);

                if (response.ok) {
                    setEvents(json);
                    console.log(json);
                } else {
                    setEventFetchErr(json.error ?? "An unexpected error occured while fetching events");
                }
            })
        })
        .catch(err => {
            setEventsLoading(false);
            setEventFetchErr("An unexpected error occured while fetching events (see console)");
            console.error(err);
        })
    }, [])
    
    return (
        <>
            <Container>
                <Row>
                    <Col>
                        <h1 className="text-primary">My Tickets</h1>
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col xl={3}>
                        <TicketCard/>
                    </Col>

                    <Col xl={3}>
                        <TicketCard/>
                    </Col>

                    <Col xl={3}>
                        <TicketCard/>
                    </Col>

                    <Col xl={3}>
                        <TicketCard/>
                    </Col>

                </Row>

                <Row>
                    <h1 className="text-primary">Upcoming Events</h1>
                </Row>

                <Carousel>
                    {/* <Carousel.Item>
                        <Image src="/sample-concert-2to1.jpg" fluid/>
                        <Carousel.Caption>
                            <h3>Event 1</h3>
                        </Carousel.Caption>
                    </Carousel.Item>

                    <Carousel.Item>
                        <Image src="/sample-concert-2to1.jpg" fluid/>
                        <Carousel.Caption>
                            <h3>Event 2</h3>
                        </Carousel.Caption>
                    </Carousel.Item> */}

                    {events.map(event => (
                        <Carousel.Item key={event._id}>
                            <Image src="/sample-concert-2to1.jpg" fluid/>
                            <Carousel.Caption>
                                <a className="hover-pointer" onClick={() => {navigate("event", {state:{event}})}}><h1 className="text-decoration-underline text-light">{event.title}</h1></a>
                                <p>This is the description for the event</p> 
                            </Carousel.Caption>
                        </Carousel.Item>
                    ))}
                </Carousel>
            </Container>
        </>
    )
}