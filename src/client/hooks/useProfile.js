import {useCallback, useState} from "react";
import {useSelector} from "react-redux";

function useProfile() {
  const account = useSelector(({account}) => account)
  const [profile, setProfile] = useState({
    nickname: account.nickname || "내 이름은 지호에요",
    tmpNickname: account.nickname || "내 이름은 지호에요",
    characterId: account.characterId || 211,
    nicknameChange: false
  })

  const update = (props) => setProfile(prevState => ({...prevState, ...props }))

  const onChange = useCallback((e) => {
    update({'tmpNickname': e.target.value})
  }, [profile.nickname])

  const onNicknameChange = useCallback(() => {
    setProfile(prevState => ({
      ...prevState,
      nickname: prevState.tmpNickname,
      nicknameChange: !profile.nicknameChange
    }))
  }, [profile.nicknameChange])

  const onClick = useCallback((e) => {
    update({'characterId': + e.target.dataset.id})
  }, [setProfile])

  return [profile, setProfile, onChange, onClick, onNicknameChange]
}

export default useProfile;