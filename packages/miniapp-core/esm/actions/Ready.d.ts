export type ReadyOptions = {
    /**
     * Disable native gestures. Use this option if your frame uses gestures
     * that conflict with native gestures.
     *
     * @defaultValue false
     */
    disableNativeGestures: boolean;
};
export declare const DEFAULT_READY_OPTIONS: {
    disableNativeGestures: false;
};
export type Ready = (options?: Partial<ReadyOptions>) => void;
