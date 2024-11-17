// content.js
function isJsonResponse() {
  const contentType = document.contentType || '';
  return contentType.includes('application/json');
}

function createBaseTag(extensionOrigin) {
  const baseTag = document.createElement('base');
  baseTag.href = extensionOrigin;
  return baseTag;
}

function replaceAndReloadScripts(rawJson) {
  // Store script info before replacing
  const originalScript = document.querySelector('script[type="module"]');
  const scriptSrc = originalScript.src;
  const scriptType = originalScript.type;
  const scriptCrossOrigin = originalScript.crossOrigin;

  // Recreate script
  const script = document.createElement('script');
  script.src = scriptSrc;
  script.type = scriptType;
  script.crossOrigin = scriptCrossOrigin;
  document.head.appendChild(script);
}

async function injectSPA() {
  if (!isJsonResponse()) return;

  try {
    // Store the original JSON
    const rawJson = document.body.textContent;
    // const jsonData = JSON.parse(rawJson);

    const extensionOrigin = chrome.runtime.getURL('');

    const indexPageFile = extensionOrigin + "index.html";
    const response = await fetch(indexPageFile);

    // Check if the fetch was successful
    if (!response.ok) {
      throw new Error(`Failed to load resource: ${response.status} ${response.statusText}`);
    }

    // replace the page with extension index.html
    const htmlContent = await response.text();
    // add a new base tag with the extension origin
    const newBaseHtmlContent = htmlContent.replace("<head>", "<head>\n" + createBaseTag(extensionOrigin).outerHTML);
    // override the document HTML
    document.documentElement.innerHTML = newBaseHtmlContent;

    // trigger js re-execute
    replaceAndReloadScripts(rawJson);

  } catch (error) {
    console.error('Error injecting SPA:', error);
  }
}

// Run when the page loads
injectSPA();
