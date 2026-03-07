import { useEffect, useState } from "react";

const COUNTER_NAMESPACE = "chenchen-feng-site";
const COUNTER_KEY = "visits";
const SESSION_KEY = "fcc-web:visit-recorded";

type CounterResponse = {
  count?: number;
};

function isLocalHost(hostname: string) {
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "0.0.0.0";
}

function readSessionFlag() {
  try {
    return window.sessionStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
}

function writeSessionFlag() {
  try {
    window.sessionStorage.setItem(SESSION_KEY, "1");
  } catch {
    // Ignore storage failures and keep the counter functional.
  }
}

export function useVisitCounter() {
  const [count, setCount] = useState<number | null>(null);
  const [hasError, setHasError] = useState(false);
  const [isLocalPreview, setIsLocalPreview] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const localPreview = isLocalHost(window.location.hostname);
    const shouldIncrement = !localPreview && readSessionFlag() !== "1";
    const endpointBase = `https://api.counterapi.dev/v1/${COUNTER_NAMESPACE}/${COUNTER_KEY}`;
    const endpoint = shouldIncrement ? `${endpointBase}/up` : endpointBase;
    const controller = new AbortController();

    setIsLocalPreview(localPreview);

    async function loadCounter() {
      try {
        const response = await fetch(endpoint, { signal: controller.signal });

        if (!response.ok) {
          throw new Error(`Counter request failed with status ${response.status}`);
        }

        const data = (await response.json()) as CounterResponse;

        if (typeof data.count !== "number") {
          throw new Error("Counter response did not include a count value");
        }

        setCount(data.count);

        if (shouldIncrement) {
          writeSessionFlag();
        }
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setHasError(true);
      }
    }

    void loadCounter();

    return () => {
      controller.abort();
    };
  }, []);

  return { count, hasError, isLocalPreview };
}
