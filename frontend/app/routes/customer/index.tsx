import { useContext, useEffect, useState } from "react";
import { Button, Card, Carousel, Col, Container, Image, Row, Spinner, Stack } from "react-bootstrap";
import { Link, NavLink, useNavigate } from "react-router";
import { type Ticket, type TicketEvent } from "types";
import TicketCard from "~/components/customer/TicketCard";
import { AuthContext } from "~/context/authContext"

export default function CustomerIndex() {
    
    const {user} = useContext(AuthContext);
    const navigate = useNavigate();

    const [events, setEvents] = useState<TicketEvent[]>([]);
    const [eventsLoading, setEventsLoading] = useState<boolean>(false);
    const [eventFetchErr, setEventFetchErr] = useState<string>("");

    const [ticketsLoading, setTicketsLoading] = useState<boolean>(false);
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [ticketsFetchErr, setTicketsFetchErr] = useState<string>("");

    useEffect(() => {
        setEventsLoading(true);

        fetch(import.meta.env.VITE_SERVER + "/event/all", {
            headers: {
                authorization: user?.authToken ?? ""
            }
        })
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
    }, []);

    useEffect(() => {
        setTicketsLoading(true);

        fetch(import.meta.env.VITE_SERVER + "/customer/my-tickets", {
            method: "GET",
            headers: {
                authorization: user?.authToken ?? ""
            }
        })
        .then(response => {
            response.json().then(responseJson => {
                setTicketsLoading(false);
                if (response.ok) {
                    console.log("MY tickets: ")
                    console.log(responseJson)
                    setTickets(responseJson);
                } else {
                    console.error(responseJson)
                    setTicketsFetchErr(responseJson.error ?? "An error occured while fetching tickets")
                }
            })
        })
        .catch(err => {
            setTicketsLoading(false);
            console.error(err);
            setTicketsFetchErr("An error occured while fetching tickets");
        });
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
                    {ticketsLoading ? (
                        <>
                            <Spinner/> Tickets loading...
                        </>
                    ) : (
                        <>
                            {tickets.length > 0 ? (
                                <>
                                    {tickets.map(ticket => (
                                        <Col xl={3}>
                                            <TicketCard ticket={ticket}/>
                                        </Col>
                                    ))}
                                </>
                            ) : (
                                <>
                                    You don't have any tickets!
                                </>
                            )}
                        </>
                    )}


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