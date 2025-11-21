import type { ServerMessage } from "types";

interface ServerResponseContainerProps {
    response: ServerMessage
}

export default function ServerResponseContainer({response} : ServerResponseContainerProps) {

    const [message, type] = response

    return (
        message &&
        <p className={"fw-bold text-" + type}>
            {message}
        </p> 
    )
}