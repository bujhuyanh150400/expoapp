import {useLocalSearchParams} from "expo-router";

export default function ReplyScreen () {
    const {ticket_id} = useLocalSearchParams<{ ticket_id?: string }>();

    console.log(ticket_id)

    return (
        <>


        </>
    )
}