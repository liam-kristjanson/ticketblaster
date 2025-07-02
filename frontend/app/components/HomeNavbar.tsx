import { mdiTicket } from "@mdi/js";
import Icon from "@mdi/react";
import { Nav, Navbar } from "react-bootstrap";
import { NavLink } from "react-router";

export default function HomeNavbar() {
    return (
        <>
            <Navbar className="bg-body-tertiary px-4" expand="md">
                <Navbar.Brand href="/" className="text-primary">
                    <Icon path={mdiTicket} size={1.2} className="d-inline-block align-top"/>TicketBlaster
                </Navbar.Brand>

                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link as="div">
                            <NavLink to="/login">Log in</NavLink>
                        </Nav.Link>

                        <Nav.Link as="div">
                            <NavLink to="/signup">Sign up</NavLink>
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>

            <div className="w-100" style={{height: "1px", margin:"8px"}}>

            </div>
      </>
    )
}