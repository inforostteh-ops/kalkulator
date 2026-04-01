module.exports = {
  appId: 'com.kalkulator.app',
  productName: 'Kalkulator',
  directories: {
    output: 'dist',
    buildResources: 'assets',
  },
  files: [
    'dist/**/*',
    'node_modules/**/*',
    'package.json',
    'electron.js',
    'index.html',
  ],
  win: {
    target: [
      {
        target: 'nsis',
        arch: ['x64'],
      },
      {
        target: 'portable',
        arch: ['x64'],
      },
    ],
  },
  nsis: {
    oneClick: false,
    allowToChangeInstallationDirectory: true,
  },
  mac: {
    target: ['dmg', 'zip'],
    category: 'public.app-category.utilities',
  },
  linux: {
    target: ['AppImage', 'deb'],
    category: 'Utility',
  },
}