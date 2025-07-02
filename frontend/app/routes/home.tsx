import { Link } from "react-router";
import type { Route } from "./+types/home";
import { useState } from "react";
import { Container, Nav, Navbar, Row, Spinner } from "react-bootstrap";
import Icon from "@mdi/react";
import { mdiTicket } from "@mdi/js";
import HomeNavbar from "~/components/HomeNavbar";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "TicketBlaster" },
    { name: "description", content: "Welcome to TicketBlaster" },
  ];
}

export default function Home() {
  
  const [scanCode, setScanCode] = useState<string>("");
  const [isProcessingScan, setIsProcessingScan] = useState<boolean>(false);
  const [isTicketValid, setIsTicketValid] = useState<boolean>(false);
  const [resMsg, setResMsg] = useState<string>("");

  function processScan(scanCode : string) {
    setScanCode(scanCode);
    setIsProcessingScan(true);

    fetch(import.meta.env.VITE_SERVER + "/ticket/scan?scanCode=" + scanCode, {
      method: "POST"
    })
    .then(response => {
      console.log(response);
      return response.json()
    })
    .then(responseJson => {
      setIsProcessingScan(false);
      console.log(responseJson);
      setResMsg(responseJson.error ?? responseJson.message ?? "No Response Message...");
    })
  }

  return (
    <>
      <HomeNavbar/>

      <Container>
        <Row>
          <h1 className="text-primary">Welcome to TicketBlaster!</h1>
        </Row>
      </Container>

      
    </>
  )
}
