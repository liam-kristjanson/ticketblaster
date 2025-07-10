import { useContext } from "react";
import { Button, Card, Carousel, Col, Container, Image, Row, Stack } from "react-bootstrap";
import TicketCard from "~/components/customer/TicketCard";
import { AuthContext } from "~/context/authContext"

export default function CustomerIndex() {
    
    const user = useContext(AuthContext);
    
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
                            <Carousel.Item>
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
                            </Carousel.Item>
                        </Carousel>
            </Container>
        </>
    )
}