let recaptchaPromise: Promise<void> | null = null;

export function loadRecaptcha(siteKey: string): Promise<void> {
  if (recaptchaPromise) return recaptchaPromise;

  recaptchaPromise = new Promise((resolve, reject) => {
    if (document.querySelector(`script[src*="recaptcha/api.js"]`)) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load reCAPTCHA script"));
    document.head.appendChild(script);
  });

  return recaptchaPromise;
}

export async function getRecaptchaToken(
  siteKey: string,
  action: string,
): Promise<string> {
  await loadRecaptcha(siteKey);

  return new Promise((resolve, reject) => {
    // @ts-ignore - grecaptcha is injected globally by Google's script
    window.grecaptcha.ready(() => {
      // @ts-ignore
      window.grecaptcha
        .execute(siteKey, { action })
        .then(resolve)
        .catch(reject);
    });
  });
}
