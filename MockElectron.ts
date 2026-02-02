// This mimics the IPC bridge exposed by preload.js for the web environment
export const setupMockBridge = () => {
  if (typeof window !== 'undefined') {
    // Mock storage for settings
    const settingsStore: Record<string, any> = {
      theme: 'dark',
      accentColor: '#00f0ff',
      openRouterApiKey: '', // User needs to set this
      aiModel: 'meta-llama/llama-3.2-11b-vision-instruct:free'
    };

    (window as any).knouxAPI = {
      window: {
        minimize: async () => console.log('Mock: Minimize'),
        maximize: async () => console.log('Mock: Maximize'),
        close: async () => console.log('Mock: Close'),
        isMaximized: async () => false,
        onResize: (cb: any) => { 
            window.addEventListener('resize', () => cb({ width: window.innerWidth, height: window.innerHeight }));
            return () => {}; 
        },
        setFullscreen: async () => {
            if (!document.fullscreenElement) document.documentElement.requestFullscreen();
            else document.exitFullscreen();
        },
      },
      player: {
        load: async (path: string) => console.log('Mock: Loading', path),
        play: async () => console.log('Mock: Play'),
        pause: async () => console.log('Mock: Pause'),
        stop: async () => console.log('Mock: Stop'),
        seek: async (time: number) => console.log('Mock: Seek', time),
        setVolume: async (vol: number) => console.log('Mock: Volume', vol),
        setMuted: async (muted: boolean) => console.log('Mock: Mute', muted),
        setPlaybackRate: async (rate: number) => console.log('Mock: Rate', rate),
        onStateChange: (cb: any) => {},
        onTimeUpdate: (cb: any) => {},
      },
      file: {
        openFile: async () => {
            // In a real web app we can't get paths easily, returning a dummy video
            return "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
        },
        openDirectory: async () => "/mock/directory",
        readFile: async (path: string) => "Mock file content",
        writeFile: async (path: string, data: any) => console.log('Mock: Write file', path),
        getStats: async (path: string) => ({ size: 1024 * 1024 * 50, created: new Date(), modified: new Date(), isDirectory: false }),
        scanDirectory: async (path: string) => [],
      },
      library: {
        scan: async () => console.log('Mock: Scanning'),
        getMedia: async () => [
            { id: '1', title: 'Big Buck Bunny', artist: 'Blender', type: 'video', path: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', duration: 596, addedAt: new Date() },
            { id: '2', title: 'Elephants Dream', artist: 'Blender', type: 'video', path: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', duration: 653, addedAt: new Date() },
            { id: '3', title: 'Synthwave Mix', artist: 'Unknown', type: 'audio', path: '/music/synth.mp3', duration: 240, addedAt: new Date() }
        ],
        getPlaylists: async () => [
            { id: 'p1', name: 'Favorites', itemCount: 12 },
            { id: 'p2', name: 'Chill Vibes', itemCount: 45 }
        ],
        toggleFavorite: async () => true,
        createPlaylist: async (name: string) => {
            console.log(`Mock: Created playlist ${name}`);
            return "new-playlist-id";
        }
      },
      settings: {
        getAll: async () => settingsStore,
        set: async (key: string, value: any) => {
            settingsStore[key] = value;
            console.log('Setting saved:', key, value);
        },
        get: async (key: string, def: any) => settingsStore[key] ?? def,
      },
      ai: {
        chat: async (msg: string) => `[Mock AI] I received: ${msg}`,
      },
      system: {
        openExternal: (url: string) => window.open(url, '_blank'),
      }
    };
  }
};