import { useEffect, useState } from "react"
import { getUserFragments } from "./api";
import { getUser } from "./auth";
import { Table, Button, Collapse } from 'react-bootstrap';

export default function FragmentTable(){
    const [fragments, setFragments] = useState(undefined);
    useEffect(() => {
        if (!fragments){
            getFragments();
            console.log(fragments);
        }
    }, [fragments])

    
    const getFragments = async () => {
        const user = await getUser();
        const result = await getUserFragments(user, true);
        setFragments(result);
    }

    const FragmentListRow = (props) => {
        return props.fragmentList.map((fragment, i) => {
            return <FragmentListItem fragment={fragment} index={i} key={i}></FragmentListItem>
        })
    }

    const FragmentListItem = (props) => {
        const fragment = props.fragment
        const [open, setOpen] = useState(false);
            return (
            <tr key={props.index}>
                <td>
                    <Button onClick={() => setOpen(!open)}
                        variant="light"
                        className="fragment-id"
                        aria-controls="fragment-id"
                        aria-expanded={open}>
                        {fragment.id}
                    </Button>
                    <Collapse in={open}>
                        <ul className="fragment-details">
                            <li>id: {fragment.id}</li>
                            <li>type: {fragment.type}</li>
                            <li>created: {fragment.created}</li>
                            <li>updated: {fragment.updated}</li>
                            <li>size: {fragment.size}</li>
                        </ul>
                    </Collapse>
                </td>
            </tr>)
    }

    return(
        <>
        {fragments && fragments.length > 0 &&
        <Table className="fragments-table">
            <thead>
                <tr>
                    <th>Found {fragments.length} fragment{fragments.length > 1 ? 's' : ''}</th>
                </tr>
            </thead>
            <tbody>
            <FragmentListRow fragmentList={fragments}></FragmentListRow>
            </tbody>
        </Table>
        }
        </>
    )
}