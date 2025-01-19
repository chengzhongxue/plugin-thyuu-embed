export interface Videoatts {
  type: string;
  src: string;
}

type VideoType = 'bb' | 'bb_live' | 'dy' | 'xg' | 'qq' | 'qq_page' | 'yk';

export function thyuuShortcodeVideo(url: string): Videoatts | undefined {
  const patterns: { [key in VideoType]: RegExp } = {
    bb: /https?:\/\/www\.bilibili\.com\/video\/(BV\w+)/,
    bb_live: /https?:\/\/live\.bilibili\.com\/(\d+)/,
    dy: /https?:\/\/www\.douyin\.com\/video\/(\d+)/,
    xg: /https?:\/\/www\.ixigua\.com\/(\d+)/,
    qq: /https?:\/\/v\.qq\.com\/x\/cover\/[^\/]+\/(\w+)\.html/,
    qq_page: /https?:\/\/v\.qq\.com\/x\/page\/([a-zA-Z0-9]+)\.html/,
    yk: /https?:\/\/v\.youku\.com\/v_show\/id_(\w+)(?:==)?\.html/,
  };

  let id: string | undefined;
  let type: VideoType | undefined;

  for (const [key, pattern] of Object.entries(patterns)) {
    const matches = url.match(pattern);
    if (matches) {
      id = matches[1];
      type = key as VideoType;
      break;
    }
  }

  if (!url || !id) return undefined;

  let src: string = '';

  switch (type) {
    case 'bb': src = `https://www.bilibili.com/blackboard/html5mobileplayer.html?bvid=${id}&as_wide=1&danmaku=0&hasMuteButton=1`; break;
    case 'bb_live': src = `https://www.bilibili.com/blackboard/live/live-activity-player.html?cid=${id}&quality=0`; break;
    case 'dy': src = `https://open.douyin.com/player/video?vid=${id}`; break;
    case 'qq':
    case 'qq_page': src = `https://v.qq.com/txp/iframe/player.html?vid=${id}`; break;
    case 'yk': src = `https://player.youku.com/embed/${id}`; break;
    case 'xg': src = `https://www.ixigua.com/iframe/${id}`; break;
    default: return undefined;
  }

  return {
    type: type,
    src: src
  };
}
