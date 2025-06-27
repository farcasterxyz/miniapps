export type ViewTokenOptions = {
  token: string
}

export type ViewToken = (options: ViewTokenOptions) => Promise<void>
