import { useContext } from "react";
import { Col, Container, Navbar, Row, Stack } from "react-bootstrap";
import { Navigate, Outlet, useLocation } from "react-router"
import { AuthContext } from "~/context/authContext";

export default function userLayout() {

    const {state} = useLocation();

    if (!state.user) return <Navigate to="/login"/>

    return (
        <>
            <AuthContext value={state.user}>
                <Navbar className="bg-body-tertiary">
                    <Navbar.Brand className="ms-3">
                        Ticketblaster Admin
                    </Navbar.Brand>

                    <Navbar.Collapse className="justify-content-end">
                        <Navbar.Text>
                            Signed in as: {state.user.username}
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
            </AuthContext>
        </>
    )
}