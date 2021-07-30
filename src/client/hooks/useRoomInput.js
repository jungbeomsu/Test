import React, {useCallback, useState} from 'react';


const useRoomInput = () => {

  const [room, setRoom] = useState({
    name: '',
    tmpName: '',
    nameChange: false
  })

  const update = (props) => setRoom(prevState => ({...prevState, ...props }))

  const onRoomName = useCallback((e) => {
    update({'tmpName': e.target.value})
  }, [room.tmpName])

  const onRoomNameSave = useCallback(() => {
    setRoom(prevState => ({
      ...prevState,
      ...(room.nicknameChange ? {name: prevState.tmpName} : {}),
      nameChange: !room.nameChange
    }))
  }, [room.nameChange])


  return [room, onRoomName, onRoomNameSave]
};

export default useRoomInput