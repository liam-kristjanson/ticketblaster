import type { MessageType } from "types";

interface ServerMessageContainerProps {
    serverMessage: string;
    messageType: MessageType;
}

export default function ServerMessageContainer({serverMessage, messageType} : ServerMessageContainerProps) {
    return (
        <>
            <p className={"fw-bold text-" + messageType}>
                {serverMessage}
            </p>
        </>
    )
}