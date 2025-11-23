import type { Route } from "./+types/home";
import { useState } from "react";
import { Container, Row } from "react-bootstrap";
import HomeNavbar from "~/components/HomeNavbar";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "TicketBlaster" },
    { name: "description", content: "Welcome to TicketBlaster" },
  ];
}

export default function Home() {
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
