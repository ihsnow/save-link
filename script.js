const handleClick = (tab) => {
  const title = tab.title;
  const url = decodeURI(tab.url);

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
  element.setAttribute("download", tab.title + ".link.html");
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);

  browser.tabs.remove(tab.id);
};

browser.browserAction.onClicked.addListener(handleClick);