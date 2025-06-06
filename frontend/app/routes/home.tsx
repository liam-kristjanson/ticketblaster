import { Link } from "react-router";
import type { Route } from "./+types/home";
import { useState } from "react";
import { Spinner } from "react-bootstrap";

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
      <h1 className="text-primary">Welcome to TicketBlaster!</h1> 

      <div className="d-flex justify-content-center">

        <div className='w-50'>
          {/* <Scanner allowMultiple scanDelay={1000} onScan={(result) => {processScan(result[0].rawValue)}}/> */}
        </div>
      </div>

      {isProcessingScan && <Spinner/>}

      <p>
        Raw scan value: {scanCode}
      </p>

      {resMsg && 
        <p>
          Server response: {resMsg}
        </p>
      }

      <Link to="/admin">Admin</Link>

      
    </>
  )
}
