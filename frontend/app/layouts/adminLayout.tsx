import { mdiTicket } from "@mdi/js";
import Icon from "@mdi/react";
import { Nav, Navbar } from "react-bootstrap";
import { Outlet } from "react-router";

export default function AdminLayout() {
    return (
        <>
            <Navbar fixed="top" className="bg-body-tertiary" expand="md">
                <Navbar.Brand href="/admin" className="text-primary">
                    <Icon path={mdiTicket} size={1.2} className="d-inline-block align-top"/> TicketBlaster Admin
                </Navbar.Brand>

                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/">Home</Nav.Link>
                        <Nav.Link href="">Something Else</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>

            <div className="w-100" style={{height: "48px", margin:"8px"}}>

            </div>

            <Outlet/>
        </>
    )
}