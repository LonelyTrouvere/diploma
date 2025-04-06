import { Metadata } from "next"
import MeetingPage from "./MeetingPage"

interface PageProps {
    params: {
        id: string
    }
}

export function generateMetadata(props: PageProps): Metadata{
    return {
        title: `Meeting ${props.params.id}`
    }
}

export default function Page(props: PageProps){
    return <MeetingPage id={props.params.id}/>
}