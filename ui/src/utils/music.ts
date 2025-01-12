export interface Musicatts {
  type: string;
  src: string;
  iframe: string;
}

type MusicType = 'nn' | 'nn_lists' | 'nn_album' | 'nn_on_app' | 'nn_lists_on_app' | 'nn_album_on_app' | 'qq';

export function thyuuShortcodeMusic(url: string): Musicatts | null {
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
    const matches = url.match(pattern);
    if (matches) {
      id = matches[1];
      type = key as MusicType;
      break;
    }
  }

  if (!url || !id) return null;

  let src: string;
  let iframe: string;
  switch (type) {
    case 'nn':
    case 'nn_on_app':
      src = `https://music.163.com/outchain/player?type=2&id=${id}`;
      iframe = `<div style="margin:-11px;"><iframe src="${src}&height=66" loading="lazy" allowtransparency="true"></iframe></div>`;
      break;
    case 'nn_lists':
    case 'nn_album':
    case 'nn_lists_on_app':
    case 'nn_album_on_app':
      src = `https://music.163.com/outchain/player?type=0&id=${id}`;
      iframe = `<div style="margin:-11px;"><iframe marginwidth="0" marginheight="0" width=330 height=450 src="${src}&height=430" loading="lazy" allowtransparency="true"></iframe></div>`;
      break;
    case 'qq':
      src = `https://i.y.qq.com/n2/m/outchain/player/index.html?songid=${id}`;
      iframe = `<iframe src="${src}" loading="lazy" allowtransparency="true"></iframe>`;
      break;
    default:
      return null;
  }

  return {
    type: type,
    src: src,
    iframe: `<thyuu-embed class="thyuu-music" data-type="${type}">${iframe}</thyuu-embed>`,
  };
}
