import './App.css';
import { useEffect, useState } from 'react';

import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { Button } from 'react-bootstrap';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";

import { getUserFragments } from './api';
import { Auth, getUser } from './auth';
import CreateFragment from './createFragment';
import FragmentTable from './fragmentTable';

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
          </ul>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Routes>
          <Route exact path="/" element={<Home/>}/>
        </Routes>
      </div>
    </Router>
  );
}

function Home() {
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
        <FragmentTable></FragmentTable>
      </header>
    </div>
  );
}

export default withAuthenticator(App, {
  signUpAttributes: ['email', 'name'],
});;
