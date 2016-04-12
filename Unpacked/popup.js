// Ian Burgan
// Cathacks 4/9/16
// SearchIT

function click(e) {
  dest = e.target.id
  console.log(dest)
  getCurrentTabUrl(getQuery)
  
  //window.close();
}

function getQuery(url) {
  var isGoogle = url.search("google.com");
  var isStack = url.search("stackoverflow.com");
  var isWiki = url.search("wikipedia.org");
  var isYoutube = url.search("youtube.com");
  var isGitHub = url.search("github.com");
  var isWolfram = url.search("wolframalpha.com");
  var isReddit = url.search("reddit.com");
  var isTwitter = url.search("twitter.com");
  
  if (isGoogle != -1) {                          // GOOGLE
    var start = url.search("q=");
    if (start != -1) {
      var query = url.substring(start + 2);
      query = query.replace(/%20/g, "+");
    }
    
  } else if (isStack != -1) {                    // STACKOVERFLOW
    var start = url.search("q=");
    if (start != -1) {
      var query = url.substring(start + 2);
    }
    
  } else if (isWiki != -1) {                     // WIKIPEDIA
    var start = url.search("search=");
    
    if (start == -1) { // if it's not a search
      start = url.search("wiki/");
      if (start != -1) {
        var query = url.substring(start + 5);
        query = query.replace(/_/g, "+");
      }
    } else {
      var rest = url.substring(start + 7);
      var end = rest.search("&");
      var query = rest.substring(0,end);
    }
    
  } else if (isYoutube != -1) {                  // YOUTUBE
    var start = url.search("search_query=");
    if (start != -1) {
      var query = url.substring(start + 13);
    }
  } else if (isGitHub != -1) {                   // GITHUB
    var start = url.search("q=");
    if (start != -1) {
      var query = url.substring(start + 2);
    }
  } else if (isWolfram != -1) {                  // WOLFRAM ALPHA
    var start = url.search("i=");
    if (start != -1) {
      var rest = url.substring(start + 2);
      var end = rest.search("&")
      if (end != -1) {
        var query = rest.substring(0, end);
      } else {
        var query = rest;
      }
    }
  } else if (isReddit != -1) {                   // REDDIT
    var start = url.search("q=");
    if (start != -1) {
      var query = url.substring(start + 2);
    }
  } else if (isTwitter != -1) {                  // TWITTER
    var start = url.search("q=");
    if (start != -1) {
      var rest = url.substring(start + 2);
      var end = rest.search("&");
      if (end != -1) {
        var query = rest.substring(0, end);
      } else {
        var query = rest;
      }
      query = query.replace(/%20/g, "+");
    }
  }
  
  
  direct(query);
}

function getCurrentTabUrl(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    // chrome.tabs.query invokes the callback with a list of tabs that match the
    // query. When the popup is opened, there is certainly a window and at least
    // one tab, so we can safely assume that |tabs| is a non-empty array.
    // A window can only have one active tab at a time, so the array consists of
    // exactly one tab.
    var tab = tabs[0];

    // A tab is a plain object that provides information about the tab.
    // See https://developer.chrome.com/extensions/tabs#type-Tab
    var url = tab.url;

    // tab.url is only available if the "activeTab" permission is declared.
    // If you want to see the URL of other tabs (e.g. after removing active:true
    // from |queryInfo|), then the "tabs" permission is required to see their
    // "url" properties.
    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url);
  });
}

function direct(query) {
  switch (dest) {
    case "stack":
      var target = "http://stackoverflow.com/search?q=".concat(query);
      break;
    case "youtube":
      var target = "http://www.youtube.com/results?search_query=".concat(query);
      break;
    case "wiki":
      var target = "http://en.wikipedia.org/wiki/Special:Search?search=".concat(query);
      break;
    case "google":
      var target = "http://www.google.com/search?q=".concat(query);
      break;
    case "github":
      var target = "http://github.com/search?q=".concat(query);
      break;
    case "wolfram":
      var target = "http://www.wolframalpha.com/input/?i=".concat(query);
      break;
    case "reddit":
      var target = "http://www.reddit.com/search?q=".concat(query);
      break;
    case "twitter":
      var target = "https://twitter.com/search?q=".concat(query);
    default:
      console.log("Who put that button there?");
  }
  
  if (query == null) {
    chrome.tabs.executeScript(null,{file: "alert.js"});
  } else {
    if (inCurrent) {
      chrome.tabs.update(null, {url: target});
    } else {
      chrome.tabs.create({url: target});
    }
  } 
}

function toggle() {
  if (wait) {
    wait = false;
  } else {
    if (inCurrent) {
      inCurrent = false;
    } else {
      inCurrent = true;
    }
    wait = true;
  }
  console.log(inCurrent)
}

document.addEventListener("DOMContentLoaded", function () {
  var buttons = document.querySelectorAll("button");
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", click);
    console.log(buttons[i])
  }
  inCurrent = true;
  wait = true;
  var divs = document.querySelectorAll("div");
  divs[1].addEventListener("click", toggle);
});