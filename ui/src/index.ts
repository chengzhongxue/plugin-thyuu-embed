import { definePlugin } from "@halo-dev/ui-shared";
import '@/styles/index.css';
import 'uno.css';

export default definePlugin({
  components: {},
  routes: [],
  extensionPoints: {
    'default:editor:extension:create': async () => {
      const { VideoExtension, MusicExtension, LivephotoExtension } = await import('@/editor');
      return [VideoExtension, MusicExtension, LivephotoExtension];
    },
  },
});
