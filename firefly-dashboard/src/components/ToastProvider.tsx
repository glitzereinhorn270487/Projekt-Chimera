"use client";
import * as React from "react";
import { Toaster } from "sonner";

// kleiner Typ-Adapter, falls dein React-Typsetup meckert
const AnyToaster = Toaster as unknown as React.FC<any>;

export function ToastProvider() {
  return <AnyToaster richColors position="top-right" />;
}
