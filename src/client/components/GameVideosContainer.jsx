import React, {useEffect, useRef, useState} from 'react';

import {getRoomFromPath} from '../utils';
import {updateUserData} from '../userData';

import GameVideo from './GameVideo.jsx';
import GameSelfVideo from './GameSelfVideo.jsx';
import GameScreenVideo from './GameScreenVideo.jsx';

import {localPreferences} from '../LocalPreferences.js';
import {townClient} from "./webrtcsdk/townClient";
import {LocalStream} from './webrtcsdk/stream';

import {carouselLeft, carouselRight} from "../resources/images";

import './GameVideosContainer.css';

let DEV_ENDPOINT = `wss://dev-tove-api.tenuto.co.kr/ws`;
let PROD_ENDPOINT = `wss://dev-tove-api.tenuto.co.kr/ws`;

let MAX_VIDEOS_DEFAULT = 10000;

export default function GameVideosContainer(props) {
  const [isError, setIsError] = useState(false);
  const [ownVideoEnabled, setOwnVideoEnabled] = useState(true);
  const [ownAudioEnabled, setOwnAudioEnabled] = useState(true);
  const [streamMap, setStreamMap] = useState({});
  const [screenStreamMap, setScreenStreamMap] = useState({});
  const [ownStreamMap, setOwnStreamMap] = useState({});
  const [otherVideoEnabled, setOtherVideoEnabled] = useState({});
  const [otherAudioEnabled, setOtherAudioEnabled] = useState({});
  const [maxVideos, setMaxVideos] = useState(MAX_VIDEOS_DEFAULT);
  // const [isScreensharing, setIsScreensharing] = useState(false);

  const prevRangeVideos = useRef([]);
  const sfuClient = useRef(undefined);
  const peers = useRef({});
  // const imageRef = useRef(null);
  // const screenStreamRef = useRef(null);

  useEffect(() => {
    // IT IS VERY IMPORTANT THAT IF YOU CHANGE THIS YOU KNOW WHAT YOU'RE DOING
    // MAKE SURE TO THOROUHGLY TEST _ANY_ CHANGES
    // IT'S POSSIBLE TO MAKE VIDEO MUTING NOT WORK BUT LOOK LIKE IT WORKS BY DOING
    // THIS WRONG
    let inRangeIds = Object.keys(props.playerVideoMap["playerToDist"])
      .filter(playerId => {
        return props.playerVideoMap["playerToDist"][playerId] <= props.videoThreshold &&  playerId !== props.myPlayerId + "";
      });
    let gainedVideos = inRangeIds.filter(x => !(prevRangeVideos.current.includes(x)));
    let lostVideos = prevRangeVideos.current.filter(x => !(inRangeIds.includes(x)));
    gainedVideos.forEach(playerId => {
      if (sfuClient.current) {
        sfuClient.current.debounceSub("#"+playerId);
      } else {
        console.warn('sfuClient not exist in gainedVideos');
      }
    });
    lostVideos.forEach(playerId => {
      if (sfuClient.current) {
        sfuClient.current.debounceUnSub("#"+playerId);
      } else {
        console.warn('sfuClient not exist in lostVideos');
      }
    })
    prevRangeVideos.current = inRangeIds;
    let closestIds = Object.keys(props.playerVideoMap["playerToDist"])
      .filter(playerId => {
        return (playerId !== props.myPlayerId + "") && (playerId !== props.playerVideoMap["announcerPlayer"] + "")
      })
      .sort((a, b) => {
        return props.playerVideoMap["playerToDist"][a] < props.playerVideoMap["playerToDist"][b] ? -1 : 1;
      })
      .slice(0, maxVideos);
    let inStreamingDistance = (id) => {
      if (id === props.playerVideoMap["announcerPlayer"]) {
        return true;
      }
      if (props.myPlayerId === props.playerVideoMap["announcerPlayer"]) {
        return true;
      }
      if (!(closestIds.includes(id))) {
        return false;
      }
      if (id in props.playerVideoMap["playerToDist"]) {
        return props.playerVideoMap["playerToDist"][id] <= props.videoThreshold;
      } else {
        return false;
      }
    }
    Object.keys(streamMap).forEach((id) => {
      let persistentId = id in props.playerInfoMap ? props.playerInfoMap[id]["publicId"] : "NOTANID"
      let idBlocked = persistentId in props.blocked ? props.blocked[persistentId] : false;
      let idVideoEnabled = id in otherVideoEnabled ? otherVideoEnabled[id] : true;
      let idAudioEnabled = id in otherAudioEnabled ? otherAudioEnabled[id] : true;
      streamMap[id].getVideoTracks().forEach((track) => {
        track.enabled = !idBlocked && idVideoEnabled && inStreamingDistance(id);
      })
      streamMap[id].getAudioTracks().forEach((track) => {
        track.enabled = !idBlocked && idAudioEnabled && inStreamingDistance(id);
      })
    });
    Object.keys(ownStreamMap).forEach((id) => {
      let persistentId = id in props.playerInfoMap ? props.playerInfoMap[id]["publicId"] : "NOTANID"
      let idBlocked = persistentId in props.blocked ? props.blocked[persistentId] : false;
      if (id === props.myPlayerId) {
        // what new connections see
        ownStreamMap[id].getVideoTracks().forEach((track) => {
          track.enabled = ownVideoEnabled;
        })
        ownStreamMap[id].getAudioTracks().forEach((track) => {
          track.enabled = ownAudioEnabled;
        })
      } else {
        ownStreamMap[id].getVideoTracks().forEach((track) => {
          track.enabled = ownVideoEnabled && !idBlocked && inStreamingDistance(id);
        })
        ownStreamMap[id].getAudioTracks().forEach((track) => {
          track.enabled = ownAudioEnabled && !idBlocked && inStreamingDistance(id);
        })
      }
    });
  }, [
    maxVideos, props.playerVideoMap, props.playerInfoMap,
    props.myPlayerId, props.blocked, props.videoThreshold,
    streamMap, ownStreamMap,
    ownVideoEnabled, ownAudioEnabled,
    otherVideoEnabled, otherAudioEnabled
  ])
  useEffect(() => {
    console.log('streamMap Updated');
    console.log(streamMap);
  }, [streamMap])

  // 처음 시동할 때
  useEffect(() => {
    if(props.myPlayerId == undefined) alert('props.myPlayerId is undefined');
    let playerId = "#" + props.myPlayerId;
    let mediaSettings = {
      audio: {latency: 0.03, echoCancellation: true},
      video: {width: 150, facingMode: "user"}
    };

    navigator.mediaDevices.enumerateDevices()
      .then((devices) => {
        let connectDeviceId = "";
        devices = devices.filter(device => device.kind === "videoinput");
        let notIR = devices.filter(device => !(device.label.includes("IR")));
        if (notIR.length < devices.length) {
          let frontDevices = notIR.filter(device => device.label.includes("Front"));
          if (frontDevices.length > 0) {
            connectDeviceId = frontDevices[0].deviceId;
          } else {
            connectDeviceId = notIR[0].deviceId;
          }
        }

        if (connectDeviceId) {
          mediaSettings.video = Object.assign(mediaSettings.video, {deviceId: connectDeviceId});
        }
        return LocalStream.getUserMedia(mediaSettings);
      })
      .then(stream => {
        if(props.myPlayerId === undefined){
          alert("playerId is undefined. Not connect to SFU");
          return;
        }
        initialize(stream);
        console.log('getUserMedia Success');
      })
      .catch(err => {
        console.warn('media devices err', err.toString());
        setIsError(true);
      })

    function initialize(stream) {
      const url = window.location.origin.includes("localhost") ? DEV_ENDPOINT : PROD_ENDPOINT;
      const config = {
        iceServers: [
          {
            urls: "stun:stun.l.google.com:19302",
          },
        ],
      };
      const joinConfig = {
        no_publish: false,
        no_subscribe: false,
        selective_pub_sub: true, //TODO: 나중엔 pub/sub으로 빼내기.
      }
      const sessionName = getRoomFromPath();
      // url, config, joinConfig, sessionName, userId
      const mine = new townClient(url, config, joinConfig, sessionName, playerId);

      setOwnStreamMap((prevOwnStreamMap) => {
        let newOwnStreamMap = Object.assign({}, prevOwnStreamMap);
        newOwnStreamMap[props.myPlayerId] = stream;
        return newOwnStreamMap;
      });


      // ready가 되면 stream Publish
      mine.onReady = (ready) => {
        if (ready) mine.publish(stream);
      }
      mine.ontrack = (track, stream, peerId) => {
        const idIdx = peerId.substring(1);
        // alert('onTrack: '+peerId);
        console.log('onTrackCalled: ', peerId, ', trackId: ', track.id, ', streamId: ', stream.id);
        if (idIdx in peers.current) {
          peers.current[idIdx] = mergePeerWhenOntrack(peers.current[idIdx], track, stream);
        } else {
          peers.current[idIdx] = {tracks: [track], streams: [stream]}
        }
        setStreamMap((prevStreamMap) => {
          let newStreamMap = Object.assign({}, prevStreamMap);
          newStreamMap[idIdx] = stream;
          return newStreamMap;
        });
      }
      sfuClient.current = mine;
    }
  }, []);

  // function startScreenshare() {
  //   navigator.mediaDevices.getDisplayMedia({
  //     video: true
  //   }).then((stream) => {
  //     setIsScreensharing(true);
  //     screenStreamRef.current = stream;
  //     Object.keys(peers.current).forEach(id => {
  //       let peer = peers.current[id];
  //       peer.addStream(stream);
  //     })
  //   }).catch(() => {
  //     console.log("screenshare error")
  //   })
  // }

  // function stopScreenshare() {
  //   setIsScreensharing(false);
  //   let stream = screenStreamRef.current;
  //   screenStreamRef.current = null;
  //   if (!stream) return;
  //   stream.getVideoTracks()[0].stop();
  //   Object.keys(peers.current).forEach(id => {
  //     let peer = peers.current[id];
  //     peer.removeStream(stream);
  //   });
  // }

  function getGameVideo(playerId) {
    let persistentId = playerId in props.playerInfoMap ? props.playerInfoMap[playerId]["publicId"] : "NOTANIDSET"
    const setBlocked = (blocked) => {
      let blockedList = localPreferences.get("blocked") || {};
      console.log(persistentId, blockedList);
      if (!blocked && persistentId in blockedList) {
        console.log("unblock");
        delete blockedList[persistentId];
      } else if (blocked) {
        blockedList[persistentId] = true;
      }
      updateUserData({"blocked": blockedList});
    }

    let distance = props.playerVideoMap["playerToDist"][playerId];
    if (playerId === props.playerVideoMap["announcerPlayer"]) {
      distance = 0;
    }
    console.log('getGameVideo: ', playerId);
    return streamMap[playerId] ? (
      <React.Fragment key={playerId}>
        <GameVideo
          key={playerId}
          id={playerId}
          playerInfo={props.playerInfoMap[playerId]}
          stream={streamMap[playerId]}
          ownStream={ownStreamMap[playerId]}
          distance={distance}
          videoEnabled={playerId in otherVideoEnabled ? otherVideoEnabled[playerId] : true}
          audioEnabled={playerId in otherAudioEnabled ? otherAudioEnabled[playerId] : true}
          blocked={persistentId in props.blocked ? props.blocked[persistentId] : false}
          setVideoEnabled={(enabled) => setOtherVideoEnabled({...otherVideoEnabled, [playerId]: enabled})}
          setAudioEnabled={(enabled) => setOtherAudioEnabled({...otherAudioEnabled, [playerId]: enabled})}
          setBlocked={(blocked) => setBlocked(blocked)}
          myScreenBig={props.myScreenBig}
          setMyScreenBig={props.setMyScreenBig}
        />
        {
          playerId in screenStreamMap ?
            <GameScreenVideo
              key={"screen" + playerId}
              id={playerId}
              stream={screenStreamMap[playerId]}
              distance={distance}
            />
            :
            <></>
        }
      </React.Fragment>
    ) : (<div key={playerId}>Hello World</div>);
  }

  let errorComponent = (
    <div style={{color: "red", marginTop: "10px"}}>
      Could not get your camera. Online Town requires audio and video to work properly!
      If you don't want to be on audio/video right now, you can check out our
      <a style={{color: "orangered"}} target="_blank" href="/about.html">about</a>
      page to understand what this is.
    </div>
  );

  let otherVideoComponents = null;
  otherVideoComponents = Object.keys(props.playerVideoMap["playerToDist"])
    .filter(playerId => {
      return (playerId !== props.myPlayerId + "") && (playerId !== props.playerVideoMap["announcerPlayer"] + "")
    })
    .map(playerId => getGameVideo(playerId));

  let videoComponents = (
        <div style={{display: "flex"}}>
          {props.playerVideoMap["announcerPlayer"] && (props.playerVideoMap["announcerPlayer"] !== props.myPlayerId) ?
            getGameVideo(props.playerVideoMap["announcerPlayer"])
            : null}

            {otherVideoComponents}
        </div>
      )

      let message1 = (
      <div>
        <p>You can't see/hear some people around you because there's too many people around.</p>
        <p>If you think your computer can handle it, increase the max connections to see them.</p>
      </div>
      )

      let message2 = (
      <div>
        <p>Experiencing lag?</p>
        <p>Try lowering the max connections.</p>
      </div>
      )

      return (
      <>
        <div id="videos" className="videos-container mobileHide">

            {isError ? errorComponent :
              <div style={{display: "flex", alignItems: "center"}}>
                {otherVideoComponents.length > 0 && carouselLeft}
                  {videoComponents}
                {otherVideoComponents.length > 0 && carouselRight}
              </div>
            }

        </div>

        {/*<div className="videos-max-connections mobileHide">*/}
        {/*  { props.hasScreenshare ?*/}
        {/*    (isScreensharing ?*/}
        {/*      <p><button onClick={() => stopScreenshare()}>stop screenshare</button></p>*/}
        {/*    :*/}
        {/*      <p><button onClick={() => startScreenshare()}>screenshare</button></p>*/}
        {/*    )*/}
        {/*  :*/}
        {/*  <></>*/}
        {/*  }*/}
        {/*  <p style={{width: "100%"}}>{"Max connections: "}*/}
        {/*    <select value={maxVideos} onChange={(e) => setMaxVideos(e.target.value)}>*/}
        {/*      <option value={1}>1</option>*/}
        {/*      <option value={2}>2</option>*/}
        {/*      <option value={4}>4</option>*/}
        {/*      <option value={8}>8</option>*/}
        {/*      <option value={16}>16</option>*/}
        {/*      <option value={32}>32</option>*/}
        {/*      <option value={10000}>no limit</option>*/}
        {/*    </select>*/}
        {/*  </p>*/}
        {/*  {maxVideos < otherVideoComponents.length ?*/}
        {/*    message1*/}
        {/*    :*/}
        {/*    message2*/}
        {/*  }*/}
        {/*</div>*/}
      </>
      );
      }

      function mergePeerWhenOntrack(peer, track, stream) {
      // track 합치기
      if (!peer.tracks.includes(track)) {
      peer.tracks = [track, ...peer.tracks];
    }
      // stream 합치기
      if (!peer.streams.includes(stream)) {
      peer.streams = [stream, ...peer.streams];
    }
      return peer;
    }
