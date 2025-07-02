import { useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import HomeNavbar from "~/components/HomeNavbar";

export default function Login() {

    const [username, setUsername] = useState<string>("");
    const [password, setPasword] = useState<string>("");

    function handleSubmit() {
        const requestBody = {username, password}

        fetch(import.meta.env.VITE_SERVER + "/auth/login", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(requestBody)
        })
        .then(response => {
            response.json().then(responseJson => {
                alert(JSON.stringify(responseJson));
            })
        })
    }

    return (
        <>
            <HomeNavbar/>

            <Container>
                <Row>
                    <h1 className="text-primary text-center">Log in</h1>
                </Row>

                <Row className="d-flex justify-content-center">
                    <Col xl={5}>
                        <Card>
                            <Card.Body>
                                <Form className="mb-3">
                                    <Form.Group>
                                        <Form.Label>Username</Form.Label>
                                        <Form.Control type="text" value={username} onChange={(e) => {setUsername(e.target.value)}}/>
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control type="password" value={password} onChange={(e) => {setPasword(e.target.value)}}/>
                                    </Form.Group>
                                </Form>

                                <Button variant="primary" onClick={() => {handleSubmit()}}>Log in</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    )

}