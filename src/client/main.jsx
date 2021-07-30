import React, {useEffect, useState} from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import './reset.css';
import './fonts.css';
import './main.css';

import Homepage from './components/Homepage.jsx';
import CreateProfile from './components/CreateProfile.jsx';
import Tutorial from './components/Tutorial.jsx';
import Dashboard from "./components/Dashboard";
import CreateSpace from "./components/CreateSpace";
import MainScreen from "./components/MainScreen";
import {useDispatch, useSelector} from "react-redux";
import CentiToken from "./api/CentiToken";
import api from "./api/api";
import {setProfile} from "./redux/features/account/accountSlice";
import {user} from "./api/service/user";

let App = () => {
  const dispatch = useDispatch();
  const globalUserId = useSelector(({account: {userId}}) => userId);

  useEffect(() => {
    if (!globalUserId) {
      const userId = CentiToken.getUserId();

      if (userId) {
        user.getProfile(userId).then((res) => dispatch(setProfile(res)));
      }
    }

  }, []);

  return (
    <BrowserRouter>
      <Switch>
        <Route path='/' exact component={Homepage} />
        <Route path="/room/:room" component={MainScreen}/>
        <Route path="/createProfile" exact component={CreateProfile} />
        <Route path="/tutorial" exact component={Tutorial} />
        <Route path="/dashboard" exact component={Dashboard} />
        <Route path="/space" exact component={CreateSpace} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
