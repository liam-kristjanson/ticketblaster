import { useContext, useState } from "react";
import { Button, Container, Form, Row, Spinner } from "react-bootstrap";
import { useLocation } from "react-router";
import { type MessageType, type Ticket } from "types";
import ServerMessageContainer from "~/components/ServerMessageContainer";
import { AuthContext } from "~/context/authContext";

export default function Checkout() {

    const { state } = useLocation();
    const { user } = useContext(AuthContext);
    const ticket = state.ticket as Ticket;

    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [phone, setPhone] = useState<string>("");

    const [cardName, setCardName] = useState<string>("");
    const [cardNumber, setCardNumber] = useState<string>("");
    const [expiry, setExpiry] = useState<string>("");

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [msg, setMsg] = useState<string>("");
    const [msgType, setMsgType] = useState<MessageType>("info");

    function handleSubmit() {

        setIsLoading(true);
        setMsg("");

        const requestBody = {
            firstName,
            lastName,
            email,
            phone,
            cardName,
            cardNumber,
            expiry,
            ticketId: ticket._id
        }

        fetch(import.meta.env.VITE_SERVER + "/customer/purchase-ticket",
            {
                method: "POST",
                headers: {
                    authorization: user?.authToken ?? "",
                    "content-type": "application/json"
                },
                body: JSON.stringify(requestBody)
            }
        )
        .then(response => {
            response.json().then(responseJson => {
                setIsLoading(false);
                console.log("Purchase request response");
                console.log(responseJson);

                if (response.ok) {
                    setMsg(responseJson.message ?? "Success");
                    setMsgType("success");
                } else {
                    setMsg(responseJson.error ?? "An unexpected error occured while processing request");
                    setMsgType("danger");
                }
            })
        })
        .catch(err => {
            setIsLoading(false);
            setMsgType("danger");
            setMsg("An unexpected error occured while processing request (see console)");
            console.error(err);
        })
    }

    return <>
        <Container>
            <h1 className="text-primary">Checkout</h1>
            <hr/>

            <h3>
                Event Details
            </h3>

            <p>
                Event: {ticket.event?.title}
            </p>

            <p>
                Location: {ticket.event?.eventLocation}
            </p>

            <p>
                Event Date: {new Date(ticket.event?.startTime ?? "").toLocaleDateString()}
            </p>

            <p>
                Start Time: {new Date(ticket.event?.startTime?? "").toLocaleTimeString()}
            </p>
            <hr/>

            <h3>
                Ticket Details
            </h3>

            <p>
                ID: {ticket._id}
            </p>

            <p>
                Price: {ticket.price ?? "Free"}
            </p>
            <hr/>

            <Form className="container-fluid p-0">
                <h3>Customer Details</h3>

                <Row>
                    <Form.Group className="col-6">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control type="text" value={firstName} onChange={(e) => {setFirstName(e.target.value)}}/>
                    </Form.Group>

                    <Form.Group className="col-6">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control type="text" value={lastName} onChange={(e) => {setLastName(e.target.value)}}/>
                    </Form.Group>
                </Row>

                <Row>
                    <Form.Group className="col-6">
                        <Form.Label>E-Mail</Form.Label>
                        <Form.Control type="email" value={email} onChange={(e) => {setEmail(e.target.value)}}/>
                    </Form.Group>

                    <Form.Group className="col-6">
                        <Form.Label>Phone</Form.Label>
                        <Form.Control type="phone" value={phone} onChange={(e) => {setPhone(e.target.value)}}/>
                    </Form.Group>
                </Row>      

                <hr/>

                <h3>Payment</h3>

                <Row>
                    <Form.Group className="col-6">
                        <Form.Label>Name on Card</Form.Label>
                        <Form.Control type="text" value={cardName} onChange={(e) => {setCardName(e.target.value)}}/>
                    </Form.Group>
                </Row>

                <Row>
                    <Form.Group className="col-6">
                        <Form.Label>Card Number</Form.Label>
                        <Form.Control type="text" value={cardNumber} onChange={(e) => {setCardNumber(e.target.value)}}/>
                    </Form.Group>
                </Row>

                <Row className="mb-3">
                    <Form.Group className="col-3">
                        <Form.Label>Expiry</Form.Label>
                        <Form.Control type="month" value={expiry} onChange={(e) => {setExpiry(e.target.value)}}/>
                    </Form.Group>

                    <Form.Group className="col-3">
                        <Form.Label>CVV</Form.Label>
                        <Form.Control type="text"/>
                    </Form.Group>
                </Row>

                {isLoading ? 
                    <>
                        <Spinner/> Processing request...
                    </> : <>
                        <Button size="lg" onClick={() => {handleSubmit()}}>Purchase Ticket(s)</Button>
                    </>
                }

                {msg && <ServerMessageContainer serverMessage={msg} messageType={msgType}/>}
            </Form>

            <hr/>
        </Container>
    </>
}