const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');

module.exports = {
  packagerConfig: {
    asar: true,
    icon: 'assets/icons/app-icon',
    name: 'KNOUX Player X',
    executableName: 'knoux-player-x',
    appBundleId: 'dev.knoux.player-x',
    appCategoryType: 'public.app-category.entertainment',
    osxSign: {},
    osxNotarize: {
      tool: 'notarytool',
      appleId: process.env.APPLE_ID,
      appleIdPassword: process.env.APPLE_PASSWORD,
      teamId: process.env.APPLE_TEAM_ID,
    },
    win32metadata: {
      CompanyName: 'KNOUX',
      FileDescription: 'KNOUX Player X - Next-Gen Media Player',
      OriginalFilename: 'knoux-player-x.exe',
      ProductName: 'KNOUX Player X',
      InternalName: 'knoux-player-x',
    },
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'KNOUX_Player_X',
        authors: 'SADEK ELGAZAR (KNOUX)',
        description: 'Next-Gen Media Player with AI Integration',
        iconUrl: 'https://knoux.dev/icons/app-icon.ico',
        setupIcon: 'assets/icons/app-icon.ico',
        loadingGif: 'assets/animations/installer.gif',
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin', 'linux'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
        options: {
          maintainer: 'SADEK ELGAZAR (KNOUX)',
          homepage: 'https://knoux.dev',
          icon: 'assets/icons/app-icon.png',
          categories: ['AudioVideo', 'Player'],
          description: 'Next-Gen Media Player with AI Integration',
          productName: 'KNOUX Player X',
          genericName: 'Media Player',
          section: 'sound',
          priority: 'optional',
        },
      },
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {
        options: {
          homepage: 'https://knoux.dev',
          icon: 'assets/icons/app-icon.png',
          categories: ['AudioVideo', 'Player'],
          description: 'Next-Gen Media Player with AI Integration',
          productName: 'KNOUX Player X',
          genericName: 'Media Player',
        },
      },
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
    {
      name: '@electron-forge/plugin-webpack',
      config: {
        mainConfig: './webpack.main.config.js',
        renderer: {
          config: './webpack.renderer.config.js',
          entryPoints: [
            {
              html: './electron/renderer/index.html',
              js: './electron/renderer/index.tsx',
              name: 'main_window',
              preload: {
                js: './electron/preload/preload.ts',
              },
            },
          ],
        },
      },
    },
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'knoux',
          name: 'knoux-player-x',
        },
        prerelease: false,
        draft: true,
      },
    },
  ],
};
