import { useContext, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router";
import HomeNavbar from "~/components/HomeNavbar";
import ServerMessageContainer from "~/components/ServerMessageContainer";
import { AuthContext } from "~/context/authContext";

export default function Login() {

    const navigate = useNavigate();

    const [username, setUsername] = useState<string>("");
    const [usernameFeedback, setUsernameFeedback] = useState<string>("");

    const [password, setPasword] = useState<string>("");
    const [passwordFeedback, setPasswordFeedback] = useState<string>("");

    const [msg, setMsg] = useState<string>("");

    const {setUser, user} = useContext(AuthContext);

    function handleSubmit() {
        if (validateInput()) {
            postLogin();
        }
    }

    function postLogin() {
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
                if (response.ok) {

                    setUser(responseJson);

                    if (responseJson.role === "admin") {
                        navigate('/admin', {state: {user: responseJson}});
                    } else if (responseJson.role === "host") {
                        navigate('/host', {state: {user: responseJson}});
                    } else {
                        navigate('/customer', {state: {user: responseJson}});
                    }
                } else {
                    setMsg(responseJson.error ?? "An unexpected error occured");
                }
            })
        })
    }

    function validateInput() {
        let isValidInput = true;

        if (!username) {
            setUsernameFeedback("Please enter your username");
            isValidInput = false;
        }

        if (!password) {
            setPasswordFeedback("Please enter your password")
            isValidInput = false;
        }

        return isValidInput;
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
                                <Form onSubmit={(e) => {e.preventDefault(); handleSubmit()}}>
                                    <Form.Group>
                                        <Form.Label>Username</Form.Label>
                                        <Form.Control isInvalid={Boolean(usernameFeedback)} type="text" value={username} onChange={(e) => {setUsername(e.target.value); setUsernameFeedback("")}}/>
                                        <Form.Control.Feedback type="invalid">{usernameFeedback}</Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control isInvalid={Boolean(passwordFeedback)} type="password" value={password} onChange={(e) => {setPasword(e.target.value); setPasswordFeedback("")}}/>
                                        <Form.Control.Feedback type="invalid">{passwordFeedback}</Form.Control.Feedback>
                                    </Form.Group>

                                    <Button type="submit" variant="primary">Log in</Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <Row className="d-flex justify-content-center">
                    <Col className="text-center">
                        {msg && <ServerMessageContainer messageType="danger" serverMessage={msg}/>}
                    </Col>
                </Row>
            </Container>
        </>
    )

}