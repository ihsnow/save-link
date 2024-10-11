document.addEventListener("DOMContentLoaded", function () {
  browser.storage.local.get(null, (options) => {
    const { target } = options;
    if (target) {
      document.getElementById(target).checked = true;
    }
  });

  document.querySelectorAll('input[name="target"').forEach((radio) => {
    radio.onclick = (e) => browser.storage.local.set({ target: e.target.id });
  });
});
