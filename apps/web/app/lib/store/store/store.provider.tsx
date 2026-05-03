"use client";
import { useRef, useState, useEffect } from "react";
import { Provider } from "react-redux";
import { makeStore, AppStore } from "./store";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [store, setStore] = useState<AppStore | null>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      setStore(makeStore());
    }
  }, []);

  if (!store) {
    return null;
  }

  return <Provider store={store}>{children}</Provider>;
}
