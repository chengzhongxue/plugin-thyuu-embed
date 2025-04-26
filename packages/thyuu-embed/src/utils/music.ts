
type MusicType = 'nn' | 'nn_lists' | 'nn_album' | 'nn_on_app' | 'nn_lists_on_app' | 'nn_album_on_app' | 'qq';

export function isMobileDevice(): boolean {
  const userAgent: string = navigator.userAgent || navigator.vendor || '';
  const isMobileAgent: boolean = (
    /android/i.test(userAgent) ||
    /webos/i.test(userAgent) ||
    /iphone/i.test(userAgent) ||
    /ipad/i.test(userAgent) ||
    /ipod/i.test(userAgent) ||
    /blackberry/i.test(userAgent) ||
    /windows phone/i.test(userAgent)
  );

  // 如果是移动设备标识，直接返回 true
  if (isMobileAgent) return true;

  // 如果不是移动设备标识，但屏幕尺寸较小，也认为是移动端
  const screenWidth: number = window.innerWidth || document.documentElement.clientWidth;
  const screenHeight: number = window.innerHeight || document.documentElement.clientHeight;

  return screenWidth < 768 || screenHeight < 768;
}

export function thyuuShortcodeMusic(url: string  | null): string {
  const patterns: { [key in MusicType]: RegExp } = {
    nn: /https?:\/\/music\.163\.com\/#\/song\?id=(\d+)/,
    nn_lists: /https?:\/\/music\.163\.com\/#\/playlist\?id=(\d+)/,
    nn_album: /https?:\/\/music\.163\.com\/#\/album\?id=(\d+)/,
    nn_on_app: /https?:\/\/music\.163\.com\/song\?id=(\d+)/,
    nn_lists_on_app: /https?:\/\/music\.163\.com\/playlist\?id=(\d+)/,
    nn_album_on_app: /https?:\/\/music\.163\.com\/album\?id=(\d+)/,
    qq: /https?:\/\/y\.qq\.com\/n\/ryqq\/songDetail\/(\w+)/,
  };

  let id: string | undefined;
  let type: MusicType | undefined;

  for (const [key, pattern] of Object.entries(patterns)) {
    const matches = url?.match(pattern);
    if (matches) {
      id = matches[1];
      type = key as MusicType;
      break;
    }
  }

    if (!url) {
        return `<thyuu-embed class="thyuu-noone icon-film">链接不存在<br></thyuu-embed>`
    }

    if (!id) {
        return `<thyuu-embed class="thyuu-noone icon-music">链接无法识别<br>${url}</thyuu-embed>`
    }

  let src: string;
  let iframe: string;
  switch (type) {
    case 'nn':
    case 'nn_on_app':
      src = (isMobileDevice() ? 'https://music.163.com/m/outchain/player?type=2&id=' : 'https://music.163.com/outchain/player?type=2&id=') + id;
      iframe = `<div style="margin:-11px;"><iframe src="${src}&height=66" loading="lazy" allowtransparency="true"></iframe></div>`;
      break;
    case 'nn_lists':
    case 'nn_album':
    case 'nn_lists_on_app':
    case 'nn_album_on_app':
      src = (isMobileDevice() ? 'https://music.163.com/m/outchain/player?type=0&id=' : 'https://music.163.com/outchain/player?type=0&id=' ) + id;
      iframe = `<div style="margin:-11px;"><iframe marginwidth="0" marginheight="0" width=330 height=450 src="${src}&height=430" loading="lazy" allowtransparency="true"></iframe></div>`;
      break;
    case 'qq':
      src = `https://i.y.qq.com/n2/m/outchain/player/index.html?songid=${id}`;
      iframe = `<iframe src="${src}" loading="lazy" allowtransparency="true"></iframe>`;
      break;
    default:
      return '';
  }

  return `<thyuu-embed class="thyuu-music" data-type="${type}">
            ${iframe}
            <i class="loading">加载中</i>
        </thyuu-embed>`
}
