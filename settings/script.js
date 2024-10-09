document.addEventListener("DOMContentLoaded", function () {
  browser.storage.local.get(null, (options) => {
    const { target } = options;
    if (target) {
      document.getElementById(target).checked = true;
    }
  });

  document.forms[0].onsubmit = function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const formProps = Object.fromEntries(formData);
    browser.storage.local.set(formProps);
  };
});
