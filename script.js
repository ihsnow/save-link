const downloadPage = (title, url) => {
  const html = `
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
  const element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(html)
  );
  element.setAttribute("download", title + ".html");
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  // we don't have to remove the element because the page itself is going to be closed
};

chrome.action.onClicked.addListener((tab) => {
  if (tab.url.startsWith("http")) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: downloadPage,
      args: [tab.title, decodeURI(tab.url)],
    });
    chrome.tabs.remove(tab.id);
  }
});
