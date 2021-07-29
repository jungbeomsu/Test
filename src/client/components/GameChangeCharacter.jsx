import React from 'react';
import classNames from 'classnames';

import { characterIds } from '../constants';
import { characterMap } from '../../common/maps';

import './GameChangeCharacter.css';

export default function GameChangeCharacter ({characterId, dispatch, currentMap}) {
  if (characterId && currentMap && characterMap[currentMap]) {

    let ids = characterMap[currentMap];

    return (
      <div id="change-character">
        {
          ids.map(id => {
            return (
              <div key={id}>
                <img
                  src={require(`../${characterIds[id]}`).default}
                  onClick={() => dispatch({type: 'CHANGE_PROFILE', payload: {characterId: id}})}
                  className={classNames({"not-selected": id !== characterId})}
                />
              </div>
            );
          })
        }
      </div>
    )
  } else {
    return <></>;
  }
}
