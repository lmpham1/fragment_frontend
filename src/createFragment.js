import { useState } from "react"
import { createFragmentData } from './api'
import { getUser } from "./auth";
import { nanoid } from 'nanoid'
import { Button } from "react-bootstrap";

export default function CreateFragment(){
    const [value, setValue] = useState("");
    const handleSubmit = async function() {
        console.log("handled submission " + value);
        const user = await getUser();
        console.log(user);
        createFragmentData(user, value);
    }
    const handleChange = function(e){
        setValue(e.target.value);
    }
    return(
        <div>
        <p>
          Fragment Text:
          <input type="text" value={value} onChange={handleChange} />
        </p>
        <Button className="btn btn-success" onClick={handleSubmit}>Submit</Button>
        </div>
    )
}