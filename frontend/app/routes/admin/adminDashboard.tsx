import { useContext } from "react";
import { Button, Card, Container } from "react-bootstrap";
import EventsTable from "~/components/admin/EventsTable";
import TicketsTable from "~/components/admin/TicketsTable";
import { AuthContext } from "~/context/authContext";

export default function AdminDashboard() {
    const {user} = useContext(AuthContext);

    return (
        <>
            <Container>
                <h1 className="text-primary">Welcome to the admin dashboard</h1>
                <hr/>

                <h3 className="text-primary">Events</h3>
                <EventsTable/>
                <hr/>

                <h3 className="text-primary">Tickets</h3>
                <TicketsTable/>

                <Button onClick={() => {navigator.clipboard.writeText(user?.authToken ?? "")}}>Copy AuthToken</Button>
            </Container>
        </>
    )
}