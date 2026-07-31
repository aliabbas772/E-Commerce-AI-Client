let googleScriptPromise: Promise<void> | null = null;
let initialized = false;

export function loadGoogleScript(): Promise<void> {
  if (googleScriptPromise) return googleScriptPromise;

  googleScriptPromise = new Promise((resolve, reject) => {
    if (
      document.querySelector(`script[src*="accounts.google.com/gsi/client"]`)
    ) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error("Failed to load Google Identity script"));
    document.head.appendChild(script);
  });

  return googleScriptPromise;
}

export async function initializeGoogleAuth(
  clientId: string,
  callback: (response: { credential: string }) => void,
): Promise<void> {
  await loadGoogleScript();

  // @ts-ignore - google is injected globally by Google's script
  window.google.accounts.id.initialize({
    client_id: clientId,
    callback,
  });

  initialized = true;
}

export function isGoogleAuthInitialized(): boolean {
  return initialized;
}
