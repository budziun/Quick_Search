//list of default shortcuts "shortcut": { "default": "url", "search type ": "search url with query" }
const defaultShortcuts = {
  "yt": { "default": "https://www.youtube.com", "search": "https://www.youtube.com/results?search_query={query}" },
  "fb": { "default": "https://www.facebook.com", "search": "https://www.facebook.com/search/top/?q={query}" },
  "hltv": { "default": "https://www.hltv.org", "search": "https://www.hltv.org/search?query={query}" },
  "gh": { "default": "https://github.com", "search": "https://github.com/search?q={query}" },
  "wiki": { "default": "https://en.wikipedia.org", "search": "https://en.wikipedia.org/w/index.php?search={query}" },
  "ig": { "default": "https://www.instagram.com" },
  "amz": { "default": "https://www.amazon.com", "search": "https://www.amazon.com/s?k={query}" },
  "lqd": { "default": "https://liquipedia.net/counterstrike", "search": "https://liquipedia.net/counterstrike/{query}" }
};

// get default shortcuts
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ shortcuts: defaultShortcuts, disabledShortcuts: {}, extensionEnabled: true }, () => {
    console.log("STATUS OK, SHORTCUTS TRUE");
  });
});

// get options page after install (not after update)
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    chrome.runtime.openOptionsPage();
    console.log("Settings page opened after installation.");
  }
});

// omnibox search
chrome.omnibox.onInputEntered.addListener(async (input) => {
  const data = await chrome.storage.sync.get(['shortcuts', 'disabledShortcuts', 'extensionEnabled']);

  if (data.extensionEnabled === false) {
    // toogle off -> search in google
    const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(input)}`;
    chrome.tabs.create({ url: googleSearchUrl });
    return;
  }

  const [prefix, ...queryParts] = input.split(" ");
  const query = queryParts.join(" ");

  const isSearchMode = prefix.startsWith("!");
  const shortcut = isSearchMode ? prefix.slice(1) : prefix;

  const shortcuts = data.shortcuts || {};
  const disabledShortcuts = data.disabledShortcuts || {};

  // check if shortcut exists and is not disabled
  if (shortcuts[shortcut] && !disabledShortcuts[shortcut]) {
    let url;

    if (isSearchMode && query) {
      url = shortcuts[shortcut].search.replace("{query}", encodeURIComponent(query));
    } else {
      url = shortcuts[shortcut].default;
    }

    chrome.tabs.create({ url });
  } else {
    // search in google if shortcut does not exist or is disabled
    const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(input)}`;
    chrome.tabs.create({ url: googleSearchUrl });
  }
});