import React, {useEffect} from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import axios from 'axios';

import './reset.css';
import './fonts.css';
import './main.css';

import {Config, auth} from './constants';
import { dataOnSignIn } from './userData';
import { localPreferences } from './LocalPreferences';
import { amplitudeInstance } from './amplitude';
import { makeId, getSubDomain } from './utils';
import { readCookie, createCookie } from './cookies';
import CreatePrivate from './components/CreatePrivate.jsx';
import Homepage from './components/Homepage.jsx';
import Help from './components/Help.jsx';
import EmailAuth from './components/EmailAuth.jsx';
import CreateProfile from './components/CreateProfile.jsx';
import Tutorial from './components/Tutorial.jsx';
import Dashboard from "./components/Dashboard";
import CreateSpace from "./components/CreateSpace";
import MainScreen from "./components/MainScreen";

// Add user cookie
let userStorage = localPreferences.get('user');
if (!userStorage) {
  let newId = makeId(20);
  let data = {id: newId, overAge: false, analytics: false, seenTutorial: false};
  localPreferences.set('user', data);
  axios.post(Config.apiServerPrefix + '/api/addId', {
    id: newId,
  });

  amplitudeInstance.setUserId(newId);
}

// Add subdomain cookie
if (getSubDomain()) {
  let toWrite = readCookie('publicRooms');
  if (toWrite && !toWrite.includes(getSubDomain())) {
    toWrite = toWrite + ',' + getSubDomain();
    createCookie('publicRooms', toWrite, 3000);
  } else if (!toWrite) {
    createCookie('publicRooms', getSubDomain(), 3000);
  }
}

let App = () => {
  useEffect(() => {
    return auth.onAuthStateChanged(user => {
      if (user) {
        dataOnSignIn();
      }
    });
  }, []);

  return (
    <BrowserRouter>
      <Switch>
        <Route path='/' exact component={Homepage} />
        <Route path="/help" exact component={Help} />
        <Route path="/private" exact component={CreatePrivate} />
        <Route path="/auth" component={EmailAuth} />
        {/*<Route path="/room/:room" component={MainScreen}/>*/}
        <Route path="/:room/:name" component={MainScreen}/>
        <Route path="/createProfile" exact component={CreateProfile} />
        <Route path="/tutorial" exact component={Tutorial} />
        <Route path="/dashboard" exact component={Dashboard} />
        <Route path="/space" exact component={CreateSpace} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
