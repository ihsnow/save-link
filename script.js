const download = (title, url) => {
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

  const saveHtml = (fileName, content, ext, element) => {
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(content)
    );
    element.setAttribute("download", fileName + "." + ext);
    element.click();
  };

  const element = document.createElement("a");
  saveHtml(title, getContent(url), "html", element);
};

const processLink = async (title, url, tabId, closeTab) => {
  if (!title || !url || !url.startsWith("http") || !tabId) {
    return;
  }
  try {
    await chrome.scripting.executeScript({
      target: { tabId },
      func: download,
      args: [title, url],
    });
    if (closeTab) {
      chrome.tabs.remove(tabId);
    }
  } catch (error) {
    console.log(error);
  }
};

chrome.action.onClicked.addListener((tab) =>
  processLink(tab.title, decodeURI(tab.url), tab.id, true)
);

chrome.contextMenus.onClicked.addListener(
  ({ selectionText, linkUrl }, { id }) =>
    processLink(selectionText, decodeURI(linkUrl), id)
);

chrome.contextMenus.removeAll().then(() => {
  chrome.contextMenus.create({
    id: "save-link",
    title: "Save this link",
    contexts: ["link"],
  });
});
