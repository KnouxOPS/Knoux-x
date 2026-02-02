
// This mimics the IPC bridge exposed by preload.js
export const setupMockBridge = () => {
  if (typeof window !== 'undefined') {
    (window as any).knouxAPI = {
      window: {
        minimize: () => console.log('Mock: Minimize'),
        maximize: () => console.log('Mock: Maximize'),
        close: () => console.log('Mock: Close'),
        isMaximized: async () => false,
        onResize: (cb: any) => { return () => {} },
        setFullscreen: () => console.log('Mock: Fullscreen'),
      },
      player: {
        load: async (path: string) => console.log('Mock: Loading', path),
        play: async () => console.log('Mock: Play'),
        pause: async () => console.log('Mock: Pause'),
        setVolume: async (vol: number) => console.log('Mock: Volume', vol),
        seek: async (time: number) => console.log('Mock: Seek', time),
        onStateChange: () => {},
        onTimeUpdate: () => {},
      },
      file: {
        openFile: async () => {
            // alert("Mock: Open File Dialog");
            return "demo_video.mp4";
        },
        openDirectory: async () => {
            // alert("Mock: Open Directory Dialog");
            return "/demo/library";
        }
      },
      library: {
        scan: async () => console.log('Mock: Scanning'),
        getMedia: async () => [],
        getPlaylists: async () => [],
        toggleFavorite: async () => true,
        createPlaylist: async (name: string) => {
            console.log(`Mock: Creating playlist "${name}"`);
            return "mock-playlist-id";
        }
      },
      settings: {
        getAll: async () => ({}),
        set: async () => {},
        get: async (key: string, def: any) => def,
      },
      ai: {
        chat: async (msg: string) => `Mock AI Response to: ${msg}`,
      },
      system: {
        openExternal: (url: string) => window.open(url, '_blank'),
      }
    };
  }
};
