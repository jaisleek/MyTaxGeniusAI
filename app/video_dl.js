const fs = require('fs');
const https = require('https');

const url = 'https://assets.mixkit.co/videos/preview/mixkit-checking-a-financial-report-on-a-tablet-4277-large.mp4';
const file = fs.createWriteStream('./public/tax-explainer.mp4');

https.get(url, function(response) {
  response.pipe(file);
  file.on('finish', function() {
    file.close();
    console.log('Video downloaded!');
  });
}).on('error', function(err) {
  fs.unlink('./public/tax-explainer.mp4');
  console.log('Error downloading video', err);
});
