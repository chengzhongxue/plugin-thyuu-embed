import {thyuuShortcodeMusic} from "./utils/music";


export function getMusic() {
    document.querySelectorAll("thyuu-music").forEach((element) => {
        const src = element.getAttribute("src");
        const music = thyuuShortcodeMusic(src);
        element.insertAdjacentHTML('afterend', music);
        element.remove();
    });

}