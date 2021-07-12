import React, { useState } from 'react';

import classNames from 'classnames';

import axios from 'axios';

import './Feedback.css';
import {Config} from "../constants";

export default function ReportAbuse (props) {
  let [name, setName] = useState("");
  let [email, setEmail] = useState("");
  let [message, setMessage] = useState("");
  let [response, setResponse] = useState("");
  let [responseType, setResponseType] = useState("");

  let submitFeedback = (e) => {
    e.preventDefault();
    axios
    .post(Config.apiServerPrefix + '/api/sendReport', {
      time: JSON.stringify(new Date()),
      site: window.location.href,
      name: name,
      email: email,
      message: message,
    })
    .then(res => {
      setResponse('Got your message. Thanks!');
      setResponseType("success")
      setTimeout(() => {
        setResponseType("");
      }, 5000);
    })
    .catch(err => {
      setResponse('Couldn\'t send message');
      setResponseType("failure")
      setTimeout(() => {
        setResponseType("");
      }, 5000);
    });
    return false;
  }

  return (
    <div className="ot-feedback-form">
      <form action="" id="feedback" onSubmit={(e) => submitFeedback(e)}>
        { responseType ?
          <div className={classNames({
            "ot-feedback-response": true,
            "ot-feedback-success": responseType === "success",
            "ot-feedback-failure": responseType === "failure",
          })}>{response}</div>
          :
          <div></div>
        }
        <p>What is happening? We will try to respond as soon as possible.</p>
        <div className="ot-feedback-input">
          <div>Name:</div>
          <input type="text" placeholder="optional" value={name} onChange={(e)=>{ setName(e.target.value) }}></input>
         </div>
        <div className="ot-feedback-input">
          <div>Email:</div>
          <input type="text" placeholder="optional" value={email} onChange={(e)=>{ setEmail(e.target.value) }}></input>
        </div>
        <textarea id="feedback-message" onChange={(e) => { setMessage(e.target.value) }}></textarea>
        <div className="ot-feedback-buttons">
          <button type="submit" className="action">Send</button>
          <button className="action" onClick={() => { props.onCancel() }}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
