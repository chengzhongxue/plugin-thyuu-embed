type VideoType = 'bb' | 'bb_live' | 'dy' | 'qq' | 'qq_page' | 'yk' | 'iframe';

export function thyuuShortcodeVideo(url: string | null, size: string  | null): string {
  const patterns: { [key in VideoType]: RegExp } = {
    bb: /https?:\/\/www\.bilibili\.com\/video\/(BV\w+)/,
    bb_live: /https?:\/\/live\.bilibili\.com\/(\d+)/,
    dy: /https?:\/\/www\.douyin\.com\/video\/(\d+)/,
    qq: /https?:\/\/v\.qq\.com\/x\/cover\/[^\/]+\/(\w+)\.html/,
    qq_page: /https?:\/\/v\.qq\.com\/x\/page\/([a-zA-Z0-9]+)\.html/,
    yk: /https?:\/\/v\.youku\.com\/v_show\/id_(\w+)(?:==)?\.html/,
    iframe: /<iframe.*?\ssrc=["']([^"']+)["']/i
  };

  let id: string | undefined;
  let type: VideoType | undefined;
  let src: string = '';

  for (const [key, pattern] of Object.entries(patterns)) {
    const matches = url?.match(pattern);
    if (matches) {
      id = matches[1];
      type = key as VideoType;
      break;
    }
  }

  if (type === 'iframe') {
      src = id || '';
      if (!src) {
          return `<thyuu-embed class="thyuu-noone thyuu-icon-film">iframe 无有效 src</thyuu-embed>`
      }
  }else {
      if (!url) {
          return `<thyuu-embed class="thyuu-noone thyuu-icon-film">链接不存在</thyuu-embed>`
      }

      if (!id) {
          return `<thyuu-embed class="thyuu-noone thyuu-icon-film">链接无法识别<br>${url}</thyuu-embed>`
      }
      switch (type) {
          case 'bb': src = `https://www.bilibili.com/blackboard/html5mobileplayer.html?bvid=${id}&as_wide=1&danmaku=0&hasMuteButton=1`; break;
          case 'bb_live': src = `https://www.bilibili.com/blackboard/live/live-activity-player.html?cid=${id}&quality=0`; break;
          case 'dy': src = `https://open.douyin.com/player/video?vid=${id}`; break;
          case 'qq':
          case 'qq_page': src = `https://v.qq.com/txp/iframe/player.html?vid=${id}`; break;
          case 'yk': src = `https://player.youku.com/embed/${id}`; break;
          default: return '<div class="thyuu-no-video">不支持的视频平台</div>';
      }
  }

  return `<thyuu-embed class="thyuu-video as-${size != null ? size : '' }" data-type="${type}"><iframe src="${src}" loading="lazy" scrolling="no" allow="encrypted-media; fullscreen; picture-in-picture" allowfullscreen></iframe></thyuu-embed>`;
}
