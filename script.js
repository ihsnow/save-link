const element = document.createElement("a");

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

const saveHtml = (fileName, htmlContent) => {
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(htmlContent)
  );
  element.setAttribute("download", fileName + ".html");
  element.click();
  element.removeAttribute("href");
  element.removeAttribute("download");
};

const processLink = (title, url, tabId, closeTab) => {
  if (!title || !url || !url.startsWith("http") || !tabId) {
    return;
  }
  try {
    const htmlContent = getHtmlContent(title, url);
    saveHtml(title, htmlContent);
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

browser.contextMenus.create({
  id: "save-link",
  title: "Save this link",
  contexts: ["link"],
});
