import { useContext, useState } from "react";
import { Button, Form, Modal, Spinner } from "react-bootstrap";
import { type ServerMessage, type Venue } from "types";
import { AuthContext } from "~/context/authContext";
import ServerResponseContainer from "../ServerResopnseContainer";

interface EditVenueModalProps {
    venue : Venue;
    show: boolean;
    onHide : () => void;
}

export default function EditVenueModal({venue, onHide, show} : EditVenueModalProps) {

    const {user} = useContext(AuthContext);
    const [serverMsg, setServerMsg] = useState<ServerMessage>(["", "info"]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    function handleSubmit(e : React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true)
        const formData = new FormData(e.currentTarget);

        fetch(import.meta.env.VITE_SERVER + "/host/venue/update?id=" + venue._id,
            {
                method: "POST",
                headers: {
                    "Authorization" : user?.authToken ?? ""
                },
                body: formData,
            }
        )
        .then(response => {
            response.json().then(responseJson => {
                if (response.ok) {
                    setServerMsg([responseJson.message ?? "Success", "success"])
                } else {
                    setServerMsg([responseJson.error ?? "An error occured while updating venue.", "danger"]);
                }
            })
        })
        .catch(err => {
            console.error(err);
            setServerMsg(["An unexpected error occured while updating venue.", "danger"]);
        })
        .finally(() => {
            setIsLoading(false);
        })
    }

    return <Modal show={show} onHide={() => {onHide()}}>
            <Modal.Header closeButton>
                Edit Venue {venue.name}
            </Modal.Header>

            <Modal.Body>
                <Form className="mb-3" id="update-venue-form" onSubmit={(e : React.FormEvent<HTMLFormElement>) => {handleSubmit(e)}}>
                    <Form.Group>
                        <Form.Label>
                            Name
                        </Form.Label>

                        {/* <Form.Control type="text" value={venueName} onChange={(e) => {setVenueName(e.target.value)}}/> */}
                        <Form.Control disabled={isLoading} defaultValue={venue.name} type="text" name="name"/>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>
                            Address
                        </Form.Label>

                        {/* <Form.Control type="text" value={venueAddress} onChange={(e) => {setVenueAddress(e.target.value)}}/> */}
                        <Form.Control disabled={isLoading} defaultValue={venue.address} type="text" name="address"/>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>
                            Capacity
                        </Form.Label>

                        {/* <Form.Control type="number" value={venueCapacity} onChange={(e) => {setVenueCapacity(parseInt(e.target.value))}}/> */}
                        <Form.Control disabled={isLoading} defaultValue={venue.capacity} type="number" name="capacity"/>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>
                            Image
                        </Form.Label>

                        <Form.Control disabled={isLoading} type="file" name="venue-photo" multiple={false} accept=".png, .jpg, .jpeg"/>
                    </Form.Group>
                </Form>

                {serverMsg && <ServerResponseContainer response={serverMsg}/>}
                
            </Modal.Body>

            <Modal.Footer>
                {isLoading ? <>
                    <Spinner/> Processing request...
                </> : <>
                    <Button variant="secondary" onClick={() => {onHide()}}>Close</Button>
                    <Button variant="primary" type="submit" form="update-venue-form">Save Changes</Button>    
                </>
                }
                
            </Modal.Footer>
        </Modal>
}