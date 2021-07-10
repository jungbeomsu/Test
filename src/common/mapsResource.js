import {
  imageMap as imageMapNYC,
  audioMap as audioMapNYC,
  animMap as animMapNYC,
} from './maps/nyc';

import {
  imageMap as imageMapStandalone,
  audioMap as audioMapStandalone,
  animMap as animMapStandalone,
} from './maps/standalone';

import {
  imageMap as imageMapTenuto,
  audioMap as audioMapTenuto,
  animMap as animMapTenuto,
} from './maps/tenuto';


export const imageMap = Object.assign({},
  imageMapNYC,
  imageMapStandalone,
  imageMapTenuto,
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
