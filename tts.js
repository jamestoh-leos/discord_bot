const googleTTS = require('google-tts-api'); // CommonJS

// get base64 text
googleTTS
  .getAudioBase64('Hello World', {
    lang: 'en',
    slow: false,
    host: 'https://translate.google.com',
    timeout: 10000,
  })
  .then(console.log) // base64 text
  .catch(console.error);