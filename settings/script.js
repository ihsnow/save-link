document.addEventListener("DOMContentLoaded", function () {
  chrome.storage.local.get(null, (options) => {
    const { target } = options;
    if (target) {
      document.getElementById(target).checked = true;
    }
  });

  document.forms[0].onsubmit = function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const formProps = Object.fromEntries(formData);
    chrome.storage.local.set(formProps);
  };
});
