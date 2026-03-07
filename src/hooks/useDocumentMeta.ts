import { useEffect } from "react";

function updateMeta(selector: string, value: string) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);

  if (!element) {
    element = document.createElement("meta");

    if (selector.startsWith('meta[name="')) {
      element.setAttribute("name", selector.replace('meta[name="', "").replace('"]', ""));
    }

    if (selector.startsWith('meta[property="')) {
      element.setAttribute("property", selector.replace('meta[property="', "").replace('"]', ""));
    }

    document.head.appendChild(element);
  }

  element.setAttribute("content", value);
}

export function useDocumentMeta(title: string, description: string) {
  useEffect(() => {
    document.title = title;
    updateMeta('meta[name="description"]', description);
    updateMeta('meta[property="og:title"]', title);
    updateMeta('meta[property="og:description"]', description);
  }, [description, title]);
}
