/**
 * Helper function to get the MiniApp config from a manifest,
 * supporting both 'miniapp' and 'frame' properties during the transition period
 */
export function getMiniAppConfig(manifest) {
    return manifest.miniapp || manifest.frame;
}
