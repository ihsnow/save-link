const Targets = {
  Universal: "universal",
  Mac: "mac",
};

const element = document.createElement("a");

let target;

const getUniversal = (url) =>
  `<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <title>Loading...</title>
        <meta http-equiv="refresh"
              charset="utf-8"
              content="0; url=${url}" />
    </head>
    <body>
    </body>
</html>`;

const getMac = (url) =>
  `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>URL</key>
	<string>${url.replace(/&/g, "&amp;")}</string>
</dict>
</plist>`;

const getHtmlContentAndExt = (url) =>
  target === Targets.Universal
    ? { content: getUniversal(url), ext: "html" }
    : { content: getMac(url), ext: "webloc" };

const saveHtml = (fileName, content, ext) => {
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(content)
  );
  element.setAttribute("download", fileName + "." + ext);
  element.click();
  element.removeAttribute("href");
  element.removeAttribute("download");
};

const processLink = (title, url, tabId, closeTab) => {
  if (!title || !url || !url.startsWith("http") || !tabId) {
    return;
  }
  try {
    const { content, ext } = getHtmlContentAndExt(url);
    saveHtml(title, content, ext);
    if (closeTab) {
      browser.tabs.remove(tabId);
    }
  } catch (error) {
    console.log(error);
  }
};

browser.action.onClicked.addListener((tab) =>
  processLink(tab.title, decodeURI(tab.url), tab.id, true)
);

browser.contextMenus.onClicked.addListener(({ linkText, linkUrl }, { id }) =>
  processLink(linkText, decodeURI(linkUrl), id)
);

browser.contextMenus.removeAll().then(() => {
  browser.contextMenus.create({
    id: "save-link",
    title: "Save this link",
    contexts: ["link"],
  });
});

browser.storage.local.onChanged.addListener((changes) => {
  target = changes.target.newValue;
});

browser.storage.local.get(null, (options) => {
  if (options.target) {
    target = options.target;
  } else {
    browser.storage.local.set({ target: Targets.Universal });
  }
});
