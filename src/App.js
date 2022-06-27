import './App.css';
import { useEffect, useState } from 'react';

import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { Button } from 'react-bootstrap';

import { getUserFragments } from './api';
import { Auth, getUser } from './auth';
import CreateFragment from './createFragment';

function App() {
  let isSignedIn = true;
  async function signOut() {
    console.log("signing out");
    await Auth.signOut();
    isSignedIn = false;
    window.location.reload(false);
  }
  const [user, setUser] = useState({});
  useEffect(() => {
    if (isSignedIn && !user.username){
    getUser().then((result) => {
      setUser(result);
      // Do an authenticated request to the fragments API server and log the result
      getUserFragments(result);
    });
  }
  })
  const Greeting = (props) => {
    if (user)
      return (
        <div className="greeting">
          <h2>Hello {user.username}!</h2>
          <Button variant="secondary" onClick={props.signOut}>Logout</Button>
        </div>
      );
    else return <></>;
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Fragments UI</h1>
        <Greeting signOut={signOut}/>
        <CreateFragment/>
      </header>
    </div>
  );
}

export default withAuthenticator(App, {
  signUpAttributes: ['email', 'name'],
});;
