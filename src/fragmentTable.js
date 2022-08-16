import { useEffect, useState, useLayoutEffect, useRef } from "react"
import { getUserFragments, getFragmentData, updateFragmentData, deleteFragment } from "./api";
import { getUser } from "./auth";
import { Table, Button, Collapse, Modal, Form, FormGroup, FormControl, FormLabel } from 'react-bootstrap';

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
        const [data, setData] = useState();
        const [openModal, setOpenModal] = useState(false);
        const [openDeleteModal, setOpenDeleteModal] = useState(false);
        const getData = async (fragmentId) => {
            const user = await getUser();
            const result = await getFragmentData(user, fragmentId)
            setData(result);
        }
        useEffect(()=> {
            if (!data) {
                getData(fragment.id);
                //console.log(data);
            }
        }, [fragment, data]);
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
                        <div>
                        <ul className="fragment-details">
                            <li>id: {fragment.id}</li>
                            <li>type: {fragment.type}</li>
                            <li>created: {fragment.created}</li>
                            <li>updated: {fragment.updated}</li>
                            <li>size: {fragment.size}</li>
                        </ul>
                        <h5>Data: </h5>
                        <div className="data-container">
                            <FragmentData data={data} type={fragment.type}/>
                        </div>
                        <div className="button-container">
                            <Button className="update-button" variant="info" onClick={() => setOpenModal(true)}>Update</Button>
                            <Button className="delete-button" variant="danger" onClick={() => setOpenDeleteModal(true)}>Delete</Button>
                        </div>
                        <UpdateModal metadata={fragment} data={data} openModal={openModal} setOpenModal={setOpenModal}></UpdateModal>
                        <DeleteModal id={fragment.id} openModal={openDeleteModal} setOpenModal={setOpenDeleteModal}></DeleteModal>
                        </div>
                    </Collapse>
                </td>
            </tr>
        )
    }

    function FragmentData(props){
        const data = props.data;
        const type = props.type;
        //console.log(data);
        if (data){
            if (type.includes("text/plain")){
                return(
                    <p>{data}</p>
                )
            }
            if (type.includes("application/json")){
                const prettyJSON = JSON.stringify(data, null, 2);
                return(
                    <pre>{prettyJSON}</pre>
                )
            }
            if (type.startsWith("image/")){
                return(
                    <img src={URL.createObjectURL(data)} width={250} alt="fragment"/>
                )
            }
        }
    }

    function UpdateModal(props){
        const data = props.data;
        const metadata = props.metadata;
        const setOpenModal = props.setOpenModal;
        const [newData, setNewData] = useState(null);
        const firstRender = useRef(true);
        const [isValid, setIsValid] = useState(false);
        const [hasChanged, setHasChanged] = useState(false);
        useEffect(() => {
            if(data){
                setNewData(data)
            }
        }, [data])
        useEffect(() => {
            if (hasChanged){
                if (metadata.type.startsWith('text/')){
                    setIsValid(newData && newData !== '' ? true : false)
                } else if (metadata.type.startsWith('application/json')){
                    if (newData.model === '' || newData.make === '' || newData.year === ''){
                        setIsValid(false);
                    } else {
                        setIsValid(true);
                    }
                } else if (metadata.type.startsWith('image/')){
                    setIsValid(newData ? true : false)
                }
            }
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [newData])
        useLayoutEffect(() => {
            async function submitData() {
              const user = await getUser();
              await updateFragmentData(user, newData, metadata.type, metadata.id);
            }
            if (firstRender.current) {
              firstRender.current = false;
              return;
            }
            if (isValid) {
                setHasChanged(false);
                submitData();
                setOpenModal(false);
                window.location.reload(false);
            };
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [newData, isValid, setOpenModal]);
        const handleImageChange = (newImage) => {
            setNewData(newImage);
        }
        const handleClose = () => {
            props.setOpenModal(false);
        }
        const handleSubmit = async (e) => {
            e.preventDefault();
            if (metadata.type.startsWith('text/')){
                setNewData(e.target.text.value);
            } else if (metadata.type.startsWith('application/json')){
                setNewData({
                    model: e.target.model.value,
                    make: e.target.make.value,
                    year: e.target.year.value,
                  });
            }
            setHasChanged(true);
        }
        const UpdateForm = (props) => {
            if (props.metadata.type.startsWith('text/')){
                return(
                    <>
                        <FormGroup className="mb-3">
                            <FormLabel>Fragment Text:</FormLabel>
                            <FormControl type="text" id="text" name="text" defaultValue={newData}/>
                        </FormGroup>
                    </>
                )
            } else if (props.metadata.type.startsWith('application/json')){
                return (
                    <>
                        <FormGroup className="mb-3">
                            <FormLabel>Model:</FormLabel>
                            <FormControl type="text" id="model" name="model" defaultValue={props.data.model}/>
                        </FormGroup>
                        <FormGroup className="mb-3">
                            <FormLabel>Make:</FormLabel>
                            <FormControl type="text" id="make" name="make" defaultValue={props.data.make}/>
                        </FormGroup>
                        <FormGroup className="mb-3">
                            <FormLabel>Year:</FormLabel>
                            <FormControl type="text" id="year" name="year" defaultValue={props.data.year}/>
                        </FormGroup>
                    </>
                );
            } else if (props.metadata.type.startsWith('image/')){
                const handleChange = function (e) {
                    props.handleImageChange(e.target.files[0]);
                };
                const handleRemove = function (e) {
                    document.getElementById('imageinput').value= null;
                    props.handleImageChange(null);
                }
                return (
                  <>
                    <FormGroup className="mb-3">
                      <FormLabel>Fragment Image:</FormLabel>
                      <FormControl
                        type="file"
                        id="imageinput"
                        onChange={handleChange}
                        accept="image/png, .png, image/jpeg, .jpg, image/webp, .webp, image/gif, .gif"
                      />
                    </FormGroup>
                    {newData && (
                      <div>
                        <img
                          alt="uploaded file"
                          width={"250px"}
                          src={URL.createObjectURL(newData)}
                        />
                        <br />
                        <Button
                          variant="danger"
                          onClick={handleRemove}
                        >
                          Remove
                        </Button>
                      </div>
                    )}
                  </>
                );
            }
        }
        return (
        <Modal show={props.openModal} onHide={handleClose}>
            <>
                <Modal.Header closeButton>
                <Modal.Title>Update Fragment {metadata.id}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <UpdateForm data={data} metadata={metadata} handleImageChange={handleImageChange}></UpdateForm>    
                    {!isValid && hasChanged && (
                        <p style={{fontSize: 20}}>Error! All fields must not be empty</p>
                    )}
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
                </Modal.Body>
            </>
        </Modal>
        );
    }

    function DeleteModal(props){
        const fragmentId = props.id;
        const [result, setResult] = useState("");
        const handleDelete = async function () {
            //console.log("handled submission " + value);
            const user = await getUser()
            const deletedFragment = await deleteFragment(user, fragmentId);
            setResult(deletedFragment);
        };
        const handleCancel = () => {
            props.setOpenModal(false);
        }
        const handleClose = () => {
            props.setOpenModal(false);
            window.location.reload(false);
        }
        return (
          <Modal show={props.openModal} onHide={handleCancel}>
            <>
              <Modal.Header closeButton>
                <Modal.Title>Delete Confirmation</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {result === "" && (
                    <p>Are you sure you want to delete this fragment?</p>
                )}
                {result.match(/^[A-Za-z0-9_-]+$/) && (
                    <p>Fragment deleted successfully!</p>
                )}
                {!result.match(/^[A-Za-z0-9_-]+$/) && result !== "" && (
                    <p>Failed to delete fragment! Please contact server admin</p>
                )}
              </Modal.Body>
              <Modal.Footer>
                {result === "" && (
                  <>
                    <Button variant="danger" onClick={handleDelete}>
                      Confirm
                    </Button>
                    <Button variant="secondary" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </>
                )}
                {result !== "" && (
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                )}
              </Modal.Footer>
            </>
          </Modal>
        );
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