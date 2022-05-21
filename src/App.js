import logo from './logo.svg';
import './App.css';
import { Amplify } from 'aws-amplify';

import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import Login from './Login';

function App({signOut, user}) {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Fragments UI</h1>
        <Login />
      </header>
    </div>
  );
}

export default withAuthenticator(App, {
  signUpAttributes: ['email', 'name'],
});;
