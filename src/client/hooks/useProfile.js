import {useCallback, useState} from "react";
import {useSelector} from "react-redux";

function useProfile() {
  const common = useSelector(({common}) => common)
  const [profile, setProfile] = useState({
    nickname: common.nickname || "내 이름은 지호에요",
    tmpNickname: common.nickname || "내 이름은 지호에요",
    characterId: common.characterId || 211,
    nicknameChange: false
  })

  const update = (props) => setProfile(prevState => ({...prevState, ...props }))

  const onChange = useCallback((e) => {
    update({'tmpNickname': e.target.value})
  }, [profile.nickname])

  const onNicknameChange = useCallback(() => {

    setProfile(prevState => ({
      ...prevState,
      ...(profile.nicknameChange ? {nickname: prevState.tmpNickname} : {}),
      nicknameChange: !profile.nicknameChange
    }))
  }, [profile.nicknameChange])

  const onClick = useCallback((e) => {
    update({'characterId': + e.target.dataset.id})
  }, [setProfile])

  return [profile, setProfile, onChange, onClick, onNicknameChange]
}

export default useProfile;