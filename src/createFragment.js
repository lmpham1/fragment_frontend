import React, { useEffect, useState, useRef, useLayoutEffect } from "react"
import { createFragmentData } from './api'
import { getUser } from "./auth";
import { Button, FormGroup, FormLabel, Form, FormControl } from "react-bootstrap";

export default function CreateFragment(){
    const [formType, setFormType] = useState("text");
    const handleFormTypeChange = (e) => {
        setFormType(e.target.value);
    }
    useEffect(() => {
        //console.log(formType)
    }, [formType]);
    return(
        <div className="fragment-form">
            <h5>Choose fragment type: </h5>
            <ul className="fragment-type-list">
                <li>
                    <Button className={formType === "text" ? "active" : ""} value="text" onClick={handleFormTypeChange}>Text</Button>
                </li>
                <li>
                    <Button className={formType === "JSON" ? "active" : ""} value="JSON" onClick={handleFormTypeChange}>JSON</Button>
                </li>
            </ul>
            {formType === "text" && <CreateTextFragment></CreateTextFragment>}
            {formType === "JSON" && <CreateJSONFragment></CreateJSONFragment>}
        </div>
    )
}

function CreateJSONFragment(){
    const [data, setData] = useState({});
    const firstRender = useRef(true);
    useLayoutEffect(() => {
        async function submitData() {
            const user = await getUser();
            createFragmentData(user, data, "application/json");
        }
        if (firstRender.current){
            firstRender.current = false;
            return;
        }
        if (data && Object.entries(data).length > 0)
            submitData();
    }, [data]);
    const handleSubmit = async function(e) {
        e.preventDefault();
        setData({
            model: e.target.model.value,
            make: e.target.make.value,
            year: e.target.year.value,
        })
        //console.log("handled submission " + value);
        //const user = await getUser();
        //console.log(user);
        //createFragmentData(user, data);
    }
    return(
        <div>
        <Form onSubmit={handleSubmit}>
            <h3>Enter Car Details: </h3>
            <FormGroup className="mb-3">
                <FormLabel>Model:</FormLabel>
                <FormControl type="text" id="model" name="model"/>
            </FormGroup>
            <FormGroup className="mb-3">
                <FormLabel>Make:</FormLabel>
                <FormControl type="text" id="make" name="make"/>
            </FormGroup>
            <FormGroup className="mb-3">
                <FormLabel>Year:</FormLabel>
                <FormControl type="text" id="year" name="year"/>
            </FormGroup>
        <Button variant="primary" type="submit">Submit</Button>
        </Form>
        </div>
    )
}

function CreateTextFragment(){
    const [value, setValue] = useState("");
    const handleSubmit = async function() {
        //console.log("handled submission " + value);
        const user = await getUser();
        //console.log(user);
        createFragmentData(user, value, "text/plain");
    }
    const handleChange = function(e){
        setValue(e.target.value);
    }
    return(
        <div>
            <FormGroup className="mb-3">
                <FormLabel>
                Fragment Text:
                </FormLabel>
                <FormControl type="text" value={value} onChange={handleChange} />
            </FormGroup>
            <Button variant="primary" onClick={handleSubmit}>Submit</Button>
        </div>
    )
}