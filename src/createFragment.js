import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import { createFragmentData } from "./api";
import { getUser } from "./auth";
import {
  Button,
  FormGroup,
  FormLabel,
  Form,
  FormControl,
  Modal,
} from "react-bootstrap";

export default function CreateFragment() {
  const [formType, setFormType] = useState("text");
  const handleFormTypeChange = (e) => {
    setFormType(e.target.value);
  };
  useEffect(() => {
    //console.log(formType)
  }, [formType]);
  return (
    <div className="fragment-form">
      <h5>Choose fragment type: </h5>
      <ul className="fragment-type-list">
        <li>
          <Button
            className={formType === "text" ? "active" : ""}
            value="text"
            onClick={handleFormTypeChange}
          >
            Text
          </Button>
        </li>
        <li>
          <Button
            className={formType === "JSON" ? "active" : ""}
            value="JSON"
            onClick={handleFormTypeChange}
          >
            JSON
          </Button>
        </li>
        <li>
          <Button
            className={formType === "image" ? "active" : ""}
            value="image"
            onClick={handleFormTypeChange}
          >
            Image
          </Button>
        </li>
      </ul>
      {formType === "text" && <CreateTextFragment></CreateTextFragment>}
      {formType === "JSON" && <CreateJSONFragment></CreateJSONFragment>}
      {formType === "image" && <CreateImageFragment></CreateImageFragment>}
    </div>
  );
}

function CreateJSONFragment() {
  const [data, setData] = useState({});
  const firstRender = useRef(true);
  const [openModal, setOpenModal] = useState("");
  useLayoutEffect(() => {
    async function submitData() {
      const user = await getUser();
      const result = await createFragmentData(user, data, "application/json");
      setOpenModal(result ? "success" : "failed");
    }
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (data && Object.entries(data).length > 0) submitData();
  }, [data]);
  const handleSubmit = async function (e) {
    e.preventDefault();
    setData({
      model: e.target.model.value,
      make: e.target.make.value,
      year: e.target.year.value,
    });
    //console.log("handled submission " + value);
    //const user = await getUser();
    //console.log(user);
    //createFragmentData(user, data);
  };
  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <h3>Enter Car Details: </h3>
        <FormGroup className="mb-3">
          <FormLabel>Model:</FormLabel>
          <FormControl type="text" id="model" name="model" />
        </FormGroup>
        <FormGroup className="mb-3">
          <FormLabel>Make:</FormLabel>
          <FormControl type="text" id="make" name="make" />
        </FormGroup>
        <FormGroup className="mb-3">
          <FormLabel>Year:</FormLabel>
          <FormControl type="text" id="year" name="year" />
        </FormGroup>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
      <DoneModal openModal={openModal} setOpenModal={setOpenModal} />
    </div>
  );
}

function CreateTextFragment() {
  const [value, setValue] = useState("");
  const [openModal, setOpenModal] = useState("");
  const handleSubmit = async function () {
    //console.log("handled submission " + value);
    const user = await getUser();
    //console.log(user);
    const result = await createFragmentData(user, value, "text/plain");
    setOpenModal(result ? "success" : "failed");
  };
  const handleChange = function (e) {
    setValue(e.target.value);
  };
  return (
    <div>
      <FormGroup className="mb-3">
        <FormLabel>Fragment Text:</FormLabel>
        <FormControl type="text" value={value} onChange={handleChange} />
      </FormGroup>
      <Button variant="primary" onClick={handleSubmit}>
        Submit
      </Button>
      <DoneModal openModal={openModal} setOpenModal={setOpenModal} />
    </div>
  );
}

function CreateImageFragment() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [openModal, setOpenModal] = useState("");
  const handleSubmit = async function () {
    //console.log("handled submission " + value);
    const user = await getUser()
    const result = await createFragmentData(user, selectedImage, selectedImage.type);
    setOpenModal(result ? "success" : "failed");
  };
  const handleChange = function (e) {
    const imageFile = e.target.files[0];
    setSelectedImage(imageFile);
  };
  return (
    <div>
      <FormGroup className="mb-3">
        <FormLabel>Fragment Text:</FormLabel>
        <FormControl type="file" onChange={handleChange} accept="image/png, .png, image/jpeg, .jpg, image/webp, .webp, image/gif, .gif"/>
      </FormGroup>
      {selectedImage && (
        <div>
        <img alt="uploaded file" width={"250px"} src={URL.createObjectURL(selectedImage)} />
        <br />
        <Button variant="danger" onClick={()=>setSelectedImage(null)}>Remove</Button>
        </div>
      )}
      <Button variant="primary" onClick={handleSubmit}>
        Submit
      </Button>
      <DoneModal openModal={openModal} setOpenModal={setOpenModal} />
    </div>
  );
}

function DoneModal(props) {
  const handleClose = () => {
    props.setOpenModal("");
    window.location.reload(false);
}
  return (
    <Modal show={props.openModal !== ""} onHide={handleClose}>
      {props.openModal === "success" && (
        <>
          <Modal.Header closeButton>
            <Modal.Title>Success!</Modal.Title>
          </Modal.Header>
          <Modal.Body>Your fragment is successfully created!</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </>
      )}
      {props.openModal === "failed" && (
        <>
          <Modal.Header closeButton>
            <Modal.Title>Error!</Modal.Title>
          </Modal.Header>
          <Modal.Body>There was an error! Check console logs for details.</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </>
      )}
    </Modal>
  );
}
