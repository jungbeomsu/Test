import React from 'react';
import ReactDOM from 'react-dom';
import App from './client/main';
import {configureStore} from "@reduxjs/toolkit";
import {Provider} from 'react-redux';
import rootReducer from './client/redux/reducers';
import api from "./client/api/api";

const store = configureStore({
  reducer: rootReducer,
});

api.setDispatch(store.dispatch);

ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
  document.getElementById('root')
);
