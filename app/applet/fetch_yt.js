const fs = require('fs');
fetch('https://html.duckduckgo.com/html/?q=site:youtube.com+"tax+explainer"')
  .then(res => res.text())
  .then(text => {
    fs.writeFileSync('yt.html', text);
  });
