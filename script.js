const element = document.createElement("a");

const getContent = (url) =>
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
    saveHtml(title, getContent(url), "html");
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
