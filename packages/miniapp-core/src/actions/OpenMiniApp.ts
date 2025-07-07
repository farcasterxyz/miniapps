export type OpenMiniAppOptions = {
  url: string
}

export type OpenMiniApp = (options: OpenMiniAppOptions) => Promise<void>
