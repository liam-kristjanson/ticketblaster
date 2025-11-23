import { Button, Nav, Navbar, Offcanvas } from "react-bootstrap";
import { Link, NavLink } from "react-router";

export default function HomeNavbar() {
    return (
        <>
            <Navbar className="bg-body-tertiary px-3" expand="md">
                <Navbar.Brand href="/" className="text-primary">
                    TicketBlaster
                </Navbar.Brand>

                {/* <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link as="div">
                            <NavLink to="/login">Log in</NavLink>
                        </Nav.Link>

                        <Nav.Link as="div">
                            <NavLink to="/signup">Sign up</NavLink>
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse> */}

                <Navbar.Toggle/>

                <Navbar.Offcanvas placement="end">
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title>
                            Menu
                        </Offcanvas.Title>
                    </Offcanvas.Header>

                    <Offcanvas.Body className="justify-content-end">
                        <Nav>
                            <Link to="/login" className="w-100">
                                <Button className="w-100">Log in</Button>
                            </Link>
                        </Nav>
                    </Offcanvas.Body>
                </Navbar.Offcanvas>
            </Navbar>

            <div className="w-100" style={{height: "1px", margin:"8px"}}>

            </div>
      </>
    )
}