import {
  characterMap as characterMapNYC,
  collisionMap as collisionMapNYC,
  imageDimensionsMap as imageDimensionsMapNYC,
  portalDirectionMap as portalDirectionMapNYC,
} from './maps/nyc';

import {
  characterMap as characterMapStandalone,
  collisionMap as collisionMapStandalone,
  imageDimensionsMap as imageDimensionsMapStandalone,
  portalDirectionMap as portalDirectionMapStandalone,
} from './maps/standalone';

import {
  characterMap as characterMapTenuto,
  collisionMap as collisionMapTenuto,
  imageDimensionsMap as imageDimensionsMapTenuto,
  portalDirectionMap as portalDirectionMapTenuto,
} from './maps/tenuto';

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

export const characterMap = Object.assign({},
  {0: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]},
  characterMapNYC,
  characterMapStandalone,
  characterMapTenuto,
);
