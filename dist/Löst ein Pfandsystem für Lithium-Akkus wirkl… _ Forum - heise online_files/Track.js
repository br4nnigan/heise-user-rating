function loadScript(RTBLAB_KEY) {
  var script = document.createElement('img');
  script.type = 'text/html';
  var url = escape(document.URL);
  url = url.replace(/\//g,"_");
  script.src = 'https://brain.rvty.net/RTB/Track?k='+RTBLAB_KEY+'&s='+url;
  document.body.appendChild(script);
}

window.onload = loadScript(RTBLAB_KEY);