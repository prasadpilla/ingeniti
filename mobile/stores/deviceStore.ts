import { create } from 'zustand';

interface DeviceState {
  deviceStates: Record<string, boolean>;
  setDeviceState: (deviceId: string, state: boolean) => void;
  getDeviceState: (deviceId: string, defaultState: boolean) => boolean;
}

export const useDeviceStore = create<DeviceState>((set, get) => ({
  deviceStates: {},
  setDeviceState: (deviceId: string, state: boolean) =>
    set((prev) => ({
      deviceStates: {
        ...prev.deviceStates,
        [deviceId]: state,
      },
    })),
  getDeviceState: (deviceId: string, defaultState: boolean) => get().deviceStates[deviceId] ?? defaultState,
}));
