import { useContext } from "react";
import { Button, Col, Container, Navbar, Row, Stack } from "react-bootstrap";
import { Link, Navigate, NavLink, Outlet, useLocation } from "react-router"
import { AuthContext } from "~/context/authContext";

export default function userLayout() {

    const {user, setUser} = useContext(AuthContext)

    // if (!user) return <Navigate to="/login"/>

    return (
        <>
            <Navbar className="bg-body-secondary">
                <Navbar.Brand className="ms-3" href="/admin">
                    Ticketblaster Admin
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

                            <NavLink to="/admin/create-event">
                                <Button variant="outline-primary" className="w-100 btn-lg text-start">Events</Button>
                            </NavLink>

                            <NavLink to="/admin/create-tickets">
                                <Button variant="outline-primary" className="w-100 btn-lg text-start">Tickets</Button>
                            </NavLink>

                            <NavLink to="/admin/users">
                                <Button variant="outline-primary" className="w-100 btn-lg text-start">Users</Button>
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