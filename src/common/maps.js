import {
  imageMap as imageMapNYC,
  imageDimensionsMap as imageDimensionsMapNYC,
  collisionMap as collisionMapNYC,
  portalDirectionMap as portalDirectionMapNYC,
  audioMap as audioMapNYC,
  animMap as animMapNYC,
  characterMap as characterMapNYC,
} from './maps/nyc';

import {
  imageMap as imageMapStandalone,
  imageDimensionsMap as imageDimensionsMapStandalone,
  collisionMap as collisionMapStandalone,
  portalDirectionMap as portalDirectionMapStandalone,
  audioMap as audioMapStandalone,
  animMap as animMapStandalone,
  characterMap as characterMapStandalone,
} from './maps/standalone';

import {
  imageMap as imageMapTenuto,
  imageDimensionsMap as imageDimensionsMapTenuto,
  collisionMap as collisionMapTenuto,
  portalDirectionMap as portalDirectionMapTenuto,
  audioMap as audioMapTenuto,
  animMap as animMapTenuto,
  characterMap as characterMapTenuto,
} from './maps/tenuto';

export const imageMap = Object.assign({},
  imageMapNYC,
  imageMapStandalone,
  imageMapTenuto,
);
export const imageDimensionsMap = Object.assign({},
  imageDimensionsMapNYC,
  imageDimensionsMapStandalone,
  imageDimensionsMapTenuto,
);
export const collisionMap = Object.assign({},
  collisionMapNYC,
  collisionMapStandalone,
  collisionMapTenuto,
);
export const portalDirectionMap = Object.assign({},
  portalDirectionMapNYC,
  portalDirectionMapStandalone,
  portalDirectionMapTenuto,
);
export const audioMap = Object.assign({},
  audioMapNYC,
  audioMapStandalone,
  audioMapTenuto,
);
export const animMap = Object.assign({},
  animMapNYC,
  animMapStandalone,
  animMapTenuto,
);

let characterMapMerge = Object.assign({},
  characterMapNYC,
  characterMapStandalone,
  characterMapTenuto,
);
Object.keys(imageMap).forEach(mapId => {
  if (!(mapId in characterMapMerge)) {
    characterMapMerge[mapId] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
  }
});
export const characterMap = characterMapMerge;
