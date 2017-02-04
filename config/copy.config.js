// https://www.npmjs.com/package/fs-extra


module.exports = {
  copyAssets: {
    src: ['{{SRC}}/assets/**/*'],
    dest: '{{WWW}}/assets'
  },
  copyIndexContent: {
    src: ['{{SRC}}/index.html', '{{SRC}}/manifest.json',
          '{{SRC}}/robots.txt',
          '{{SRC}}/service-worker.js',
          '{{SRC}}/offline-google-analytics-import.js',
          '{{SRC}}/sw-toolbox.js',
          '{{SRC}}/sw-precache.js',
          '{{SRC}}/push-notification.js'],
    dest: '{{WWW}}'
  },
  copyFonts: {
    src: ['{{ROOT}}/node_modules/ionicons/dist/fonts/**/*', '{{ROOT}}/node_modules/ionic-angular/fonts/**/*'],
    dest: '{{WWW}}/assets/fonts'
  },
  copyPolyfills: {
    src: ['{{ROOT}}/node_modules/ionic-angular/polyfills/polyfills.js'],
    dest: '{{BUILD}}'
  }
}
