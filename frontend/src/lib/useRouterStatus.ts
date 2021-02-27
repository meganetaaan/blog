// (c) adamduncan
// https://gist.github.com/adamduncan/2e5b9c2eafe74fd9fda902a6ea213ba3

import { useState, useEffect } from "react";
import Router from "next/router";

export default function useRouterStatus() {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<any>();

  useEffect(() => {
    const start = () => {
      setIsLoading(true);
    };
    const complete = () => {
      setIsLoading(false);
      setIsError(false);
      setError(null);
    };
    const error = (error: any) => {
      setIsLoading(false);
      setIsError(true);
      setError(error);
    };

    if (Router.events != null) {
      Router.events.on("routeChangeStart", start);
      Router.events.on("routeChangeComplete", complete);
      Router.events.on("routeChangeError", error);
    }

    return () => {
      if (Router.events != null) {
        Router.events.off("routeChangeStart", start);
        Router.events.off("routeChangeComplete", complete);
        Router.events.off("routeChangeError", error);
      }
    };
  }, []);

  return { isLoading, isError, error };
}
