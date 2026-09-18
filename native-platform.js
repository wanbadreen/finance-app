import { Capacitor } from "@capacitor/core";

// Browser/PWA behavior stays unchanged outside the native shell.
export const isNativeApp = Capacitor.isNativePlatform();
