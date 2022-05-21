import Button from "react-bootstrap/Button";
import {Auth, getUser} from './auth';
import { useEffect, useState } from "react";

export default function Login(){
    async function signOut() {
      await Auth.signOut();
      window.location.reload(false);
    }
    const [user, setUser] = useState({});
    getUser().then(user => {
        console.log(user);
        setUser(user);
    })
    if (user)
      return (
        <div>
          <h2>Hello {user.username}!</h2>
          <Button onClick={signOut}>Logout</Button>
        </div>
      );
    else return (<></>);
}