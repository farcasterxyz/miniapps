export type ViewProfileOptions = {
  fid: number
}

export type ViewProfile = (options: ViewProfileOptions) => Promise<void>
