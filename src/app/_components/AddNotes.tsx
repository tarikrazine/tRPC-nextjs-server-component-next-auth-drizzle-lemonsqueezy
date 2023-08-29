"use client"

import { trpc } from "../_trpc/client"

interface AddNotesProps {}

function AddNotes(props: AddNotesProps) {

    const { data } = trpc.hello.useQuery()

    return (
        <div>{ data?.greeting }</div>
    )
}

export default AddNotes