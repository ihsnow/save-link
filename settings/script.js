document.addEventListener("DOMContentLoaded", function () {
  chrome.storage.local.get(null, (options) => {
    const { target } = options;
    if (target) {
      document.getElementById(target).checked = true;
    }
  });

  document.querySelectorAll('input[name="target"').forEach((radio) => {
    radio.onclick = (e) => chrome.storage.local.set({ target: e.target.id });
  });
});
