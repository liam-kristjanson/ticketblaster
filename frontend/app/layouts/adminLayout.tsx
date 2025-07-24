import { useContext } from "react";
import { Button, Col, Container, Navbar, Row, Stack } from "react-bootstrap";
import { Link, Navigate, Outlet, useLocation } from "react-router"
import { AuthContext } from "~/context/authContext";

export default function userLayout() {

    const {user, setUser} = useContext(AuthContext)

    if (!user) return <Navigate to="/login"/>

    return (
        <>
            <Navbar className="bg-body-secondary">
                <Navbar.Brand className="ms-3">
                    Ticketblaster Admin
                </Navbar.Brand>

                <Navbar.Collapse className="d-flex justify-content-end gap-2">
                    <Navbar.Text>
                        Signed in as: {user.username} <Link to="/"><Button size="sm" variant="secondary" onClick={() => {setUser(null)}}>Sign out</Button></Link>
                    </Navbar.Text>
                </Navbar.Collapse>
            </Navbar>

        
            <Container fluid className="">
                <Row className="h-100">
                    <Col xs={2} className="vh-100 bg-body-tertiary">
                        <Stack gap={2}>
                            <div className="p-3">
                                Events
                            </div>

                            <div className="p-3">
                                Tickets
                            </div>

                            <div className="p-3">
                                Users
                            </div>
                        </Stack>
                    </Col>

                    <Col>
                        <Outlet/>
                    </Col>
                </Row>
            </Container>
        </>
    )
}