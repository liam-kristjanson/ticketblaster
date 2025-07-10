import { mdiTicket } from "@mdi/js";
import Icon from "@mdi/react";
import { Nav, Navbar } from "react-bootstrap";
import { Outlet, useLocation } from "react-router";
import { AuthContext } from "~/context/authContext";

export default function AdminLayout() {

    const { user } = useLocation().state;

    return (
        <>
            <Navbar fixed="top" className="bg-body-tertiary px-2" expand="md">
                <Navbar.Brand href="/customer" className="text-primary">
                    <Icon path={mdiTicket} size={1.2} className="d-inline-block align-top"/> TicketBlaster
                </Navbar.Brand>

                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/">Home</Nav.Link>
                        <Nav.Link href="">Something Else</Nav.Link>
                    </Nav>
                </Navbar.Collapse>

                <Navbar.Collapse className="justify-content-end">
                    <Navbar.Text>Logged in as: {user.username}</Navbar.Text>
                    <Nav>
                        <Nav.Link href="#">Log out</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>

            <div className="w-100" style={{height: "48px", margin:"8px"}}>

            </div>

            <AuthContext value={user}>
                <Outlet/>
            </AuthContext>
        </>
    )
}