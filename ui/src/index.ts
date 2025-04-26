import { definePlugin } from "@halo-dev/console-shared";
import {DetailsExtension, LivephotoExtension, MusicExtension, VideoExtension} from "@/editor";
import '@/styles/index.css';

export default definePlugin({
  components: {},
  routes: [],
  extensionPoints: {
    "default:editor:extension:create": () => {
      return [VideoExtension,MusicExtension,LivephotoExtension,DetailsExtension];
    },
  },
});
