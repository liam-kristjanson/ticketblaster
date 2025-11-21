import { useContext, useEffect, useState } from "react"
import { Button, Modal, Spinner, Table } from "react-bootstrap";
import { type ServerMessage, type TicketEvent } from "types"
import { AuthContext } from "~/context/authContext";
import ServerResponseContainer from "../ServerResopnseContainer";
import { Link } from "react-router";
import TicketCreationModal from "./TicketCreationModal";

export default function EventsTable() {

    const { user } = useContext(AuthContext);

    const [events, setEvents] = useState<TicketEvent[]>([]);
    const [serverMessage, setServerMessage] = useState<ServerMessage>(['', 'info']);
    const [isEventsLoading, setIsEventsLoading] = useState<boolean>(false);

    const [showTicketCreationModal, setShowTicketCreationModal] = useState<boolean>(false);
    const [eventForTicketCreation, setEventForTicketCreation] = useState<TicketEvent | undefined>(undefined);

    useEffect(() => {

        setIsEventsLoading(true);
        fetch(import.meta.env.VITE_SERVER + "/event/my-events", {
            headers: {
                authorization: user?.authToken ?? ""
            }
        })
        .then(response => {
            response.json().then(responseJson => {
                setIsEventsLoading(false);
                if (response.ok) {
                    setEvents(responseJson);
                } else {
                    setServerMessage([responseJson.error ?? "An error occured while fetching events", "danger"])
                }
            }) 
        })
        .catch(err => {
            setIsEventsLoading(false);
            console.error(err);
            setServerMessage(["An unexpected error occured while fetching events", "danger"])
        })
    }, [user])


    return <>
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>
                        Title
                    </th>

                    <th>
                        Venue
                    </th>

                    <th>
                        Start Time
                    </th>

                    <th>
                        Available Tickets
                    </th>

                    <th>
                        Actions
                    </th>
                </tr>
            </thead>

            <tbody>
                {isEventsLoading ? (
                    <tr>
                        <td colSpan={100}>
                            <Spinner/> Loading events...
                        </td>
                    </tr>
                ) : (
                    events.length > 0 ? (
                        events.map(myEvent => (
                            <tr>
                                <td>
                                    {myEvent.title}
                                </td>

                                <td>
                                    {typeof myEvent.venue != 'string' && myEvent.venue.name}
                                </td>

                                <td>
                                    {new Date(myEvent.startTime).toLocaleString()}
                                </td>

                                <td>
                                    Unknown
                                </td>

                                <td>
                                    <Link to="event" state={{event: myEvent}}><Button className="me-2"variant="secondary">Event Dashboard</Button></Link>
                                    <Button onClick={() => {setShowTicketCreationModal(true); setEventForTicketCreation(myEvent)}}>Release Tickets</Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={100}>
                                You don't have any events! Press "add event" to create one.
                            </td>
                        </tr>
                    )
                )}
            </tbody>

            <tfoot>
                <tr>
                    <td colSpan={100}>
                        <Link to="create-event"><Button variant="primary"> + Add Event </Button></Link>
                    </td>
                </tr>
            </tfoot>
        </Table>

        <ServerResponseContainer response={serverMessage}/>

        {eventForTicketCreation && <TicketCreationModal show={showTicketCreationModal} hideModal={() => {setShowTicketCreationModal(false)}} event={eventForTicketCreation}/>}
    </>
}