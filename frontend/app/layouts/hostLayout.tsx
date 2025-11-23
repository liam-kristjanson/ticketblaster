import { useContext } from "react";
import { Button, Col, Container, Navbar, Row, Stack } from "react-bootstrap";
import { Link, NavLink, Outlet } from "react-router"
import { AuthContext } from "~/context/authContext";

export default function HostLayout() {

    const {user, setUser} = useContext(AuthContext)

    // if (!user) return <Navigate to="/login"/>

    return (
        <>
            <Navbar className="bg-body-secondary">
                <Navbar.Brand className="ms-3" href="/admin">
                    Ticketblaster Host Portal
                </Navbar.Brand>

                <Navbar.Collapse className="d-flex justify-content-end gap-2">
                    <Navbar.Text>
                        Signed in as: {user?.username} <Link to="/"><Button size="sm" variant="secondary" onClick={() => {setUser(null)}}>Sign out</Button></Link>
                    </Navbar.Text>
                </Navbar.Collapse>
            </Navbar>

        
            <Container fluid>
                <Row className="bg-body-tertiary">
                    <Col xs={2} className="vh-100 bg-body-tertiary">
                        <Stack gap={2} className="py-3">

                            <NavLink to="/host/create-event">
                                <Button variant="outline-primary" className="w-100 btn-lg text-start">+ Add Event</Button>
                            </NavLink>

                            <NavLink to="/host/scan-tickets">
                                <Button variant="outline-primary" className="w-100 btn-lg text-start">Scan Tickets</Button>
                            </NavLink>
                        </Stack>
                    </Col>

                    <Col className="bg-body">
                        <Outlet/>
                    </Col>
                </Row>
            </Container>
        </>
    )
}