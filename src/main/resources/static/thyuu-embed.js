function thyuuShortcodeVideo(url,size) {
    const patterns = {
        bb: /https?:\/\/www\.bilibili\.com\/video\/(BV\w+)/,
        bb_live: /https?:\/\/live\.bilibili\.com\/(\d+)/,
        dy: /https?:\/\/www\.douyin\.com\/video\/(\d+)/,
        xg: /https?:\/\/www\.ixigua\.com\/(\d+)/,
        qq: /https?:\/\/v\.qq\.com\/x\/cover\/[^\/]+\/(\w+)\.html/,
        qq_page: /https?:\/\/v\.qq\.com\/x\/page\/([a-zA-Z0-9]+)\.html/,
        yk: /https?:\/\/v\.youku\.com\/v_show\/id_(\w+)(?:==)?\.html/,
    };

    let id;
    let type;

    for (const [key, pattern] of Object.entries(patterns)) {
        const matches = url.match(pattern);
        if (matches) {
            id = matches[1];
            type = key;
            break;
        }
    }

    if (!url) return '';
    if (!id) return '<thyuu-embed class="thyuu-noone icon-film">链接无法识别<br>' + url + '</thyuu-embed>';

    let src = '';

    switch (type) {
        case 'bb':
            src = 'https://www.bilibili.com/blackboard/html5mobileplayer.html?bvid=' + id + '&as_wide=1&danmaku=0&hasMuteButton=1';
            break;
        case 'bb_live':
            src = 'https://www.bilibili.com/blackboard/live/live-activity-player.html?cid=' + id + '&quality=0';
            break;
        case 'dy':
            src = 'https://open.douyin.com/player/video?vid=' + id;
            break;
        case 'qq':
        case 'qq_page':
            src = 'https://v.qq.com/txp/iframe/player.html?vid=' + id;
            break;
        case 'yk':
            src = 'https://player.youku.com/embed/' + id;
            break;
        case 'xg':
            src = 'https://www.ixigua.com/iframe/' + id;
            break;
        default:
            return '';
    }
    size = size == null ? '' : size

    return `<thyuu-embed class="thyuu-video as-${size}" data-type="${type}"><iframe src="${src}" loading="lazy" scrolling="no" referrerpolicy="unsafe-url" allow="autoplay; encrypted-media" allowtransparency="true" allowfullscreen="true"></iframe></thyuu-embed>`;
}
function thyuuShortcodeMusic(url) {
    const patterns = {
        nn: /https?:\/\/music\.163\.com\/#\/song\?id=(\d+)/,
        nn_lists: /https?:\/\/music\.163\.com\/#\/playlist\?id=(\d+)/,
        nn_album: /https?:\/\/music\.163\.com\/#\/album\?id=(\d+)/,
        nn_on_app: /https?:\/\/music\.163\.com\/song\?id=(\d+)/,
        nn_lists_on_app: /https?:\/\/music\.163\.com\/playlist\?id=(\d+)/,
        nn_album_on_app: /https?:\/\/music\.163\.com\/album\?id=(\d+)/,
        qq: /https?:\/\/y\.qq\.com\/n\/ryqq\/songDetail\/(\w+)/,
    };

    let id;
    let type;

    for (const [key, pattern] of Object.entries(patterns)) {
        const matches = url.match(pattern);
        if (matches) {
            id = matches[1];
            type = key;
            break;
        }
    }

    if (!url) return '';
    if (!id) return '<thyuu-embed class="thyuu-noone icon-music">链接无法识别<br>' + url + '</thyuu-embed>';

    let iframe = '';
    let src;

    switch (type) {
        case 'nn':
        case 'nn_on_app':
            src = 'https://music.163.com/outchain/player?type=2&id=' + id;
            iframe = '<div style="margin:-11px;"><iframe src="' + src + '&height=66" loading="lazy" allowtransparency="true"></iframe></div>';
            break;
        case 'nn_lists':
        case 'nn_album':
        case 'nn_lists_on_app':
        case 'nn_album_on_app':
            src = 'https://music.163.com/outchain/player?type=0&id=' + id;
            iframe = '<div style="margin:-11px;"><iframe marginwidth="0" marginheight="0" width=330 height=450 src="' + src + '&height=430" loading="lazy" allowtransparency="true"></iframe></div>';
            break;
        case 'qq':
            src = 'https://i.y.qq.com/n2/m/outchain/player/index.html?songid=' + id;
            iframe = '<iframe src="' + src + '" loading="lazy" allowtransparency="true"></iframe>';
            break;
        default:
            return '';
    }

    return '<thyuu-embed class="thyuu-music" data-type="' + type + '">' + iframe + '</thyuu-embed>';
}

function getVideo() {
    document.querySelectorAll("thyuu-video").forEach((element) => {
        const src = element.getAttribute("src");
        const size = element.getAttribute("size");
        const html = thyuuShortcodeVideo(src,size);
        element.insertAdjacentHTML('afterend', html);

        element.remove();
    });
}

function getMusic() {
    document.querySelectorAll("thyuu-music").forEach((element) => {
        const src = element.getAttribute("src");
        const html = thyuuShortcodeMusic(src);
        element.insertAdjacentHTML('afterend', html);

        element.remove();
    });
}

document.addEventListener("DOMContentLoaded", () => {
    getVideo();
    getMusic();
}, {
    once: true
});

document.addEventListener("pjax:success", () => {
    getVideo();
    getMusic();
});
