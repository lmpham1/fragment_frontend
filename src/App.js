import './App.css';
import { useState } from 'react';

import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { Button } from 'react-bootstrap';

import { getUserFragments } from './api';
import { Auth, getUser } from './auth';

function App() {
  async function signOut() {
    console.log("signing out");
    await Auth.signOut();
    window.location.reload(false);
  }
  const [user, setUser] = useState({});
  const Greeting = (props) => {
    getUser().then((result) => {
      setUser(result);
      // Do an authenticated request to the fragments API server and log the result
      getUserFragments(result);
    });
    if (user)
      return (
        <div>
          <h2>Hello {user.username}!</h2>
          <Button onClick={props.signOut}>Logout</Button>
        </div>
      );
    else return <></>;
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Fragments UI</h1>
        <Greeting signOut={signOut}/>
      </header>
    </div>
  );
}

export default withAuthenticator(App, {
  signUpAttributes: ['email', 'name'],
});;
