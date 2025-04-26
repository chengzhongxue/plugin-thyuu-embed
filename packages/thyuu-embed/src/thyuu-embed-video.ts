import {thyuuShortcodeVideo} from "./utils/video";


export function getVideo() {
    document.querySelectorAll("thyuu-video").forEach((element) => {
        const src = element.getAttribute("src");
        const size = element.getAttribute("size");
        const video = thyuuShortcodeVideo(src,size);
        element.insertAdjacentHTML('afterend', video);
        element.remove();
    });
}

