import {getLivephoto} from "./thyuu-embed-livephoto";

export * from './thyuu-embed-video';
export * from './thyuu-embed-music';
export * from './utils/video';
export * from './utils/music';

import {getVideo} from "./thyuu-embed-video";
import {getMusic} from "./thyuu-embed-music";


document.addEventListener("DOMContentLoaded", () => {
    getVideo();
    getMusic();
    getLivephoto();
}, {
    once: true
});

document.addEventListener("pjax:success", () => {
    getVideo();
    getMusic();
    getLivephoto();
});
