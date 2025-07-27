import { useContext } from "react";
import { Button, Nav, Navbar } from "react-bootstrap";
import { Link, Navigate, Outlet, useLocation } from "react-router";
import { AuthContext } from "~/context/authContext";

export default function AdminLayout() {

    const { user, setUser } = useContext(AuthContext);

    if (!user) return <Navigate to="/login"/>

    return (
        <>
            <Navbar fixed="top" className="bg-body-tertiary px-2" expand="md">
                <Navbar.Brand href="/customer" className="text-primary">
                    TicketBlaster
                </Navbar.Brand>

                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/">Home</Nav.Link>
                        <Nav.Link href="">Something Else</Nav.Link>
                    </Nav>
                </Navbar.Collapse>

                <Navbar.Collapse className="justify-content-end">
                    <Navbar.Text>Logged in as: {user.username} <Link to="/"><Button size="sm" variant="secondary" onClick={() => setUser(null)}>Log out</Button></Link></Navbar.Text>
                </Navbar.Collapse>
            </Navbar>

            <div className="w-100" style={{height: "48px", margin:"8px"}}>

            </div>

            <Outlet/>
        </>
    )
}