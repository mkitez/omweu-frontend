import { useEffect } from "react";

export const useReadMessagesHandler = (callback: (() => void) | null) => {
  useEffect(() => {
    if (!callback) {
      return
    }
    callback();

    let readTimeout: ReturnType<typeof setTimeout> | undefined;
    const readHanlder = () => {
      if (readTimeout) {
        return;
      }
      readTimeout = setTimeout(() => {
        callback();
        readTimeout = undefined;
      }, 2000);
    };
    const eventNames = [
      'scroll',
      'click',
      'keypress',
      'mousemove',
      'touchstart',
    ];
    eventNames.forEach((eventName) =>
      document.addEventListener(eventName, readHanlder)
    );
    return () => {
      eventNames.forEach((eventName) => {
        document.removeEventListener(eventName, readHanlder);
      });
    };
  }, [callback]);
}
