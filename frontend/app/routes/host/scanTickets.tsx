import { Scanner } from "@yudiel/react-qr-scanner";
import { useContext, useState } from "react";
import { Container, Spinner } from "react-bootstrap";
import type { ServerMessage } from "types";
import ServerResponseContainer from "~/components/ServerResopnseContainer";
import { AuthContext } from "~/context/authContext";

export default function ScanTickets() {

    const { user } = useContext(AuthContext);

    const [scannedValue, setScannedValue] = useState<string>("");
    const [isScanLoading, setIsScanLoading] = useState<boolean>(false);
    const [scanResponse, setScanResponse] = useState<ServerMessage>(['', 'info']);

    function handleScanTicket(scanValue: string) {
        setScannedValue(scanValue);
        setIsScanLoading(true);

        fetch(import.meta.env.VITE_SERVER + "/host/ticket/scan?scanCode=" + scanValue, {
            method: "POST",
            headers: {
                authorization: user?.authToken ?? ""
            }
        })
        .then(response => {
            response.json().then(responseJson => {
                if (response.ok) {
                    setScanResponse([responseJson.message ?? "Ticket scanned successfuly", "success"]);
                } else {
                    setScanResponse([responseJson.error ?? "An error occured while scanning ticket", "danger"])
                }
            })
        })
        .catch(err => {
            console.error(err);
            setScanResponse(["An unexpected error occured while scanning ticket", "danger"]);
        })
        .finally(() => {
            setIsScanLoading(false);
        })
    }

    return <>
        <Container>
            <h1>Scan Tickets</h1>

            <Scanner paused={isScanLoading} onScan={(scanData) => {handleScanTicket(scanData[0].rawValue)}}/>

            {isScanLoading && <>
                <Spinner/> Processing ticket...
            </>}

            <ServerResponseContainer response={scanResponse}/>

            <p>Scanned Value: {scannedValue}</p>
        </Container>
    </>
}