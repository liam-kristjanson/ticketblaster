import { useContext, useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import { Link } from "react-router";
import { type MessageType, type TicketEvent } from "types";
import ServerMessageContainer from "../ServerMessageContainer";
import { AuthContext } from "~/context/authContext";


export default function EventsTable() {

    const {user} = useContext(AuthContext);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [events, setEvents] = useState<TicketEvent[]>([]);
    const [serverMsg, setServerMsg] = useState<string>("");
    const [msgType, setMsgType] = useState<MessageType>("info");


    useEffect(() => {
        setIsLoading(true);
        setServerMsg("");


        fetch(import.meta.env.VITE_SERVER + "/event/all")
        .then(response => {
            setIsLoading(false)

            response.json().then(responseJson => {
                if (response.ok) {
                    setEvents(responseJson)
                } else {
                    setServerMsg(responseJson.error ?? "An error occured while fetching events");
                    setMsgType("danger");
                }
            })
        }).catch(err => {
            setServerMsg("An unexpected error occured while fetching events (see console)");
            setMsgType("danger")
            console.error(err);
        })
    }, [events]);

    function deleteEvent(event : TicketEvent) {

        if (confirm("Are you sure you want to delete " + event.title + "?")) {

            setIsLoading(true);
            setServerMsg("")

            const queryParams = new URLSearchParams({eventId: event._id})

            fetch(import.meta.env.VITE_SERVER + "/event?" + queryParams, {
                method: "DELETE",
                headers: {
                    authorization: user?.authToken ?? ""
                }
            })
            .then(response => {
                response.json().then(responseJson => {
                    setIsLoading(false);
                    if (response.ok) {
                        setServerMsg(responseJson.message ?? "Success")
                        setMsgType("success");
                        setEvents([]);
                    } else {
                        setServerMsg(responseJson.error ?? "An unexpected error occured while deleting event (see console)");
                        console.error(responseJson);
                    }
                })
            })
            .catch(err => {
                setIsLoading(false);
                setServerMsg("An unexpected error occured while deleting event (see console)");
                setMsgType("danger");
                console.error(err);
            })
        }
    }

    return (
        <>
            {serverMsg && <ServerMessageContainer messageType={msgType} serverMessage={serverMsg}/>}
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>
                            Event Title
                        </th>

                        <th>
                            ID
                        </th>

                        <th>
                            Location
                        </th>

                        <th>
                            Start Time
                        </th>

                        <th>
                            Actions
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {events.map(event => (
                        <tr key={event._id}>
                            <td>
                                {event.title}
                            </td>

                            <td>
                                {event._id}
                            </td>

                            <td>
                                {event.eventLocation}
                            </td>

                            <td>
                                {new Date(event.startTime).toLocaleString()}
                            </td>

                            <td>
                                <Button variant="danger" onClick={() => {deleteEvent(event)}}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>

                <tfoot>
                    <tr>
                        <td colSpan={100}>
                            <Link to="./create-event">
                                <Button>+ Create Event</Button>
                            </Link>
                        </td>
                    </tr>
                </tfoot>
            </Table>
        </>
    )
}