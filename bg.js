var _gaq = _gaq || [];
_gaq.push(['_setAccount', secrets.ga_account_number]); // replace secret w/ your own account number.
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

chrome.extension.onMessage.addListener(
  function(message, sender, sendResponse) {
    _gaq.push(['_trackEvent', 'diffhub', message.track_action]);
  }
);