import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface NotificationPreferences {
  statusPedido: boolean;
  promocoes: boolean;
  novidades: boolean;
}

export const defaultNotifications: NotificationPreferences = {
  statusPedido: true,
  promocoes: false,
  novidades: false,
};

interface PreferencesState {
  notifications: NotificationPreferences;
  setNotification: (
    key: keyof NotificationPreferences,
    value: boolean,
  ) => void;
  resetNotifications: () => void;
}

const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      notifications: defaultNotifications,
      setNotification: (key, value) =>
        set((state) => ({
          notifications: { ...state.notifications, [key]: value },
        })),
      resetNotifications: () => set({ notifications: defaultNotifications }),
    }),
    { name: "preferences-storage" },
  ),
);

export default usePreferencesStore;
