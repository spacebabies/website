/**
 * This file is meant for modern JS that can be imported.
 */
import Fuse from "fuse.js";

var fuse; // holds our search engine
var searchVisible = false;
var firstRun = true; // allow us to delay loading json data unless search activated
var list = document.getElementById("searchResults"); // targets the <ul>
var first = list.firstChild; // first child of search list
var last = list.lastChild; // last child of search list
var maininput = document.getElementById("searchInput"); // input box for search
var resultsAvailable = false; // Did we get any search results?

// ==========================================
// The main keyboard event listener running the show
//
window.addEventListener(
  "keydown",
  function (event) {
    // CMD-/ to show / hide Search
    if (event.key == "/") {
      // Load json search index if first time invoking search
      // Means we don't load json unless searches are going to happen; keep user payload small unless needed
      if (firstRun) {
        loadSearch(); // loads our json data and builds fuse.js search index
        firstRun = false; // let's never do this again
      }

      // Toggle visibility of search box
      if (!searchVisible) {
        document.getElementById("fastSearch").style.visibility = "visible"; // show search box
        document.getElementById("searchInput").focus(); // put focus in input box so you can just start typing
        searchVisible = true; // search visible
      } else {
        document.getElementById("fastSearch").style.visibility = "hidden"; // hide search box
        document.activeElement.blur(); // remove focus from search box
        searchVisible = false; // search not visible
      }
    }

    // Allow ESC (27) to close search box
    if (event.key == "Escape") {
      if (searchVisible) {
        document.getElementById("fastSearch").style.visibility = "hidden";
        document.activeElement.blur();
        searchVisible = false;
      }
    }

    // DOWN (40) arrow
    if (event.key == "ArrowDown") {
      if (searchVisible && resultsAvailable) {
        console.log("down");
        event.preventDefault(); // stop window from scrolling
        if (document.activeElement == maininput) {
          first.focus();
        } // if the currently focused element is the main input --> focus the first <li>
        else if (document.activeElement == last) {
          last.focus();
        } // if we're at the bottom, stay there
        else {
          document.activeElement.parentElement.nextSibling.firstElementChild.focus();
        } // otherwise select the next search result
      }
    }

    // UP (38) arrow
    if (event.key == "ArrowUp") {
      if (searchVisible && resultsAvailable) {
        event.preventDefault(); // stop window from scrolling
        if (document.activeElement == maininput) {
          maininput.focus();
        } // If we're in the input box, do nothing
        else if (document.activeElement == first) {
          maininput.focus();
        } // If we're at the first item, go to input box
        else {
          document.activeElement.parentElement.previousSibling.firstElementChild.focus();
        } // Otherwise, select the search result above the current active one
      }
    }
  },
  true
);

// ==========================================
// execute search as each character is typed
//
document.getElementById("searchInput").onkeyup = function (e) {
  executeSearch(this.value);
};

// ==========================================
// fetch some json without jquery
//
function fetchJSONFile(path, callback) {
  fetch(path)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      callback(data);
    })
    .catch(function (err) {});
}

// ==========================================
// load our search index, only executed once
// on first call of search box (CMD-/)
//
function loadSearch() {
  fetchJSONFile("/index.json", function (data) {
    var options = {
      // fuse.js options; check fuse.js website for details
      shouldSort: true,
      location: 0,
      distance: 100,
      threshold: 0.4,
      minMatchCharLength: 2,
      keys: ["title", "permalink", "contents", "tags"],
    };
    fuse = new Fuse(data, options); // build the index from the json file
  });
}

// ==========================================
// using the index we loaded on CMD-/, run
// a search query (for "term") every time a letter is typed
// in the search box
//
function executeSearch(term) {
  let results = fuse.search(term); // the actual query being run using fuse.js
  let searchitems = ""; // our results bucket

  if (results.length === 0) {
    // no results based on what was typed into the input box
    resultsAvailable = false;
    searchitems = "";
  } else {
    results.forEach(function (value) {
      console.log(value);
      searchitems =
        searchitems +
        '<li><a href="' +
        value.item.permalink +
        '" tabindex="0">' +
        '<span class="title">' +
        value.item.title +
        '</span><br /> <span class="sc">' +
        "</span> — " +
        value.item.publishDate +
        " — <em>" +
        value.item.summary +
        "</em></a></li>";

      resultsAvailable = true;
    });
  }

  document.getElementById("searchResults").innerHTML = searchitems;
  if (results.length > 0) {
    first = list.firstChild.firstElementChild; // first result container — used for checking against keyboard up/down location
    last = list.lastChild.firstElementChild; // last result container — used for checking against keyboard up/down location
  }
}
