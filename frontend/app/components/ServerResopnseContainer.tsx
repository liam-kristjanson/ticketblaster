import type { ServerMessage } from "types";

interface ServerResponseContainerProps {
    response: ServerMessage
}

export default function ServerResponseContainer({response} : ServerResponseContainerProps) {

    const [message, type] = response

    return (
        <p className={"fw-bold text-" + type}>
            {message}
        </p> 
    )
}