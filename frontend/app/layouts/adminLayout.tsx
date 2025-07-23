import { useContext } from "react";
import { Button, Col, Container, Navbar, Row, Stack } from "react-bootstrap";
import { Link, Navigate, Outlet, useLocation } from "react-router"
import { AuthContext } from "~/context/authContext";

export default function userLayout() {

    const {user, setUser} = useContext(AuthContext)

    if (!user) return <Navigate to="/login"/>

    return (
        <>
            <Navbar className="bg-body-tertiary">
                <Navbar.Brand className="ms-3">
                    Ticketblaster Admin
                </Navbar.Brand>

                <Navbar.Collapse className="d-flex justify-content-end gap-2">
                    <Navbar.Text>
                        Signed in as: {user.username} <Link to="/"><Button size="sm" variant="secondary" onClick={() => {setUser(null)}}>Sign out</Button></Link>
                    </Navbar.Text>
                </Navbar.Collapse>
            </Navbar>

        
            <Container fluid className="border border-primary vh-100">
                <Row className="vh-100">
                    <Col xs={2} className="border border-danger h-100">
                        <Stack gap={2}>
                            <div className="p-3">
                                Tickets
                            </div>

                            <div className="p-3">
                                Item 2
                            </div>

                            <div className="p-3">
                                Item 3
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