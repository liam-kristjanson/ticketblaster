import { useContext, useEffect, useState } from "react"
import { Button, Spinner, Table } from "react-bootstrap";
import { Navigate } from "react-router";
import { type Venue } from "types";
import VenuesTable from "~/components/host/VenuesTable";
import ServerMessageContainer from "~/components/ServerMessageContainer";
import { AuthContext } from "~/context/authContext"

export default function HostIndex() {

    const { user } = useContext(AuthContext);
    if (!user) return <Navigate to="/login"/>

    

    return <>
        <h1>Welcome to the host index</h1>

        <h3>My Venues</h3>
        <VenuesTable/>

        <p>User id: { user?.id }</p>

        <Button onClick={() => {navigator.clipboard.writeText(user?.authToken ?? "")}}>Copy AuthToken</Button>
    </>
}