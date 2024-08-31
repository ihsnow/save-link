const download = (title, url) => {
  const getHtmlContent = (title, url) => `
    <!DOCTYPE html>
    <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
            <title>${title}</title>
            <meta http-equiv="refresh"
                  charset="utf-8"
                  content="0; url=${url}" />
        </head>
        <body>
            <p>
                Loading <a href="${url}">${title}</a>...
            </p>
        </body>
    </html>
    `;

  const saveHtml = (fileName, htmlContent, element) => {
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(htmlContent)
    );
    element.setAttribute("download", fileName + ".html");
    element.click();
  };

  const element = document.createElement("a");
  const htmlContent = getHtmlContent(title, url);
  saveHtml(title, htmlContent, element);
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

chrome.contextMenus.create({
  id: "save-link",
  title: "Save this link",
  contexts: ["link"],
});
