import { useContext, useEffect, useState } from "react";
import { Button, Form, Modal, Spinner, Table } from "react-bootstrap";
import { AuthContext } from "~/context/authContext";
import {type ServerMessage, type Venue } from "types";
import ServerResponseContainer from "../ServerResopnseContainer";

export default function VenuesTable() {

    const {user} = useContext(AuthContext);

    const [venues, setVenues] = useState<Venue[]>([]);
    const [venuesLoading, setVenuesLoading] = useState<boolean>(false);
    const [venuesResponse, setVenuesResponse] = useState<ServerMessage>(['', 'info']);
    const [showCreationModal, setShowCreationModal] = useState<boolean>(false);
    const [tableRefreshCounter, setTableRefreshCounter] = useState<number>(0);

    const [newVenueName, setNewVenueName] = useState<string>("");
    const [newVenueAddress, setNewVenueAddress] = useState<string>("");
    const [newVenueCapacity, setNewVenueCapacity] = useState<number>(0);
    const [newVenueLoading, setNewVenueLoading] = useState<boolean>(false);
    const [newVenueResponse, setNewVenueResponse] = useState<ServerMessage>(['', 'info']);


    function handleDeleteVenue(venueId : string) {
        setVenuesLoading(true);

        fetch(import.meta.env.VITE_SERVER + "/venue?id=" + venueId, {
            method: "DELETE",
            headers: {
                authorization: user?.authToken ?? ""
            }
        })
        .then(response => {
            response.json().then(responseJson => {
                if (response.ok) {
                    setVenuesResponse([responseJson.message ?? "Success", 'success']);
                } else {
                    setVenuesResponse([responseJson.error ?? "An unexpected error occured while deleting venue", 'danger']);
                }
                setVenuesLoading(false);
                setTableRefreshCounter(tableRefreshCounter + 1);
            })
        })
    }

    function handleCreateVenue() {
        setNewVenueLoading(true);

        const newVenueBody = {
            name: newVenueName,
            address: newVenueAddress,
            capacity: newVenueCapacity,
            owner: user?.id ?? ""
        }

        fetch(import.meta.env.VITE_SERVER + "/venue", {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "authorization": user?.authToken ?? ""
            },
            body: JSON.stringify(newVenueBody) 
        })
        .then(response => {
            response.json().then(responseJson => {
                setNewVenueLoading(false);
                if (response.ok) {
                    setNewVenueResponse([responseJson.message, 'success']);
                } else {
                    setNewVenueResponse([responseJson.error ?? 'An unexpected error occured while creating venue', 'danger']);
                }
                setTableRefreshCounter(tableRefreshCounter + 1);
            })
        })
        .catch(err => {
            console.error(err);
            setNewVenueLoading(false);
            setNewVenueResponse(['An unexpected error occured while creating venue', 'danger']);
            setTableRefreshCounter(tableRefreshCounter + 1);
        })
    }

    useEffect(() => {
        setVenuesLoading(true);
        setVenuesResponse(['', 'info']);
        fetch(import.meta.env.VITE_SERVER + "/my-venues", {
            method: "GET",
            headers: {
                Authorization: user?.authToken ?? ""
            }
        })
        .then(response => {
            response.json().then(responseJson => {
                setVenuesLoading(false);
                if (response.ok) {
                    setVenues(responseJson);
                } else {
                    setVenuesResponse([responseJson.error ?? "An error occured while fetching venues", 'danger']);
                }
            })
        })
        .catch(err => {
            console.error(err);
            setVenuesLoading(false);
            setVenuesResponse(["An unexpected error occurd while fetching venues", 'danger']);
            
        })
    }, [user, tableRefreshCounter])

    return <>
    <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Address</th>
                    <th>Capacity</th>
                    <th>ID</th>
                    <th>Actions</th>
                </tr>
            </thead>

            <tbody>
                {venuesLoading ? (
                    <tr>
                        <td colSpan={100}><Spinner/> Venues Loading...</td>
                    </tr>
                ) : (
                    venues.map(venue => (
                        <tr>
                            <td>{venue.name}</td>
                            <td>{venue.address}</td>
                            <td>{venue.capacity}</td>
                            <td>{venue._id}</td>
                            <td><Button variant="secondary" className="me-1">Show details</Button><Button onClick={() => {handleDeleteVenue(venue._id)}}variant="danger">Delete</Button></td>
                        </tr>
                    ))
                )}
            </tbody>

            <tfoot>
                <tr>
                    <td colSpan={100}><Button variant="primary" onClick={() => {setShowCreationModal(true)}}> + Add venue</Button></td>
                </tr>
            </tfoot>
        </Table>
        <ServerResponseContainer response={venuesResponse}/>

        <Modal show={showCreationModal} onHide={() => {setShowCreationModal(false)}}>
            <Modal.Header closeButton>
                <Modal.Title>Create new Venue</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>Venue name</Form.Label>
                        <Form.Control disabled={newVenueLoading} type="text" value={newVenueName} onChange={(e) => {setNewVenueName(e.target.value)}}/>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Address</Form.Label>
                        <Form.Control disabled={newVenueLoading} type="text" value={newVenueAddress} onChange={(e) => {setNewVenueAddress(e.target.value)}}/>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Capacity</Form.Label>
                        <Form.Control disabled={newVenueLoading} type="number" min={0} max={1000000} value={newVenueCapacity} onChange={(e) => {setNewVenueCapacity(parseInt(e.target.value))}}/>
                    </Form.Group>
                </Form>
            </Modal.Body>

            <Modal.Footer>
                {newVenueLoading ? (
                    <>
                        <Spinner/> Processing request...
                    </>
                ) : (
                    <>
                        {newVenueResponse && <ServerResponseContainer response={newVenueResponse}/>}
                        <Button variant="primary" onClick={() => {handleCreateVenue()}}>Create Venue</Button>
                        <Button variant="secondary" onClick={() => {setShowCreationModal(false)}}>Close</Button>
                    </>
                )}
                
            </Modal.Footer>
        </Modal>
    </>
}