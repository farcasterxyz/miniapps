export type Options = {
  text?: string
  embeds?: [] | [string] | [string, string]
  parent?: { type: 'cast'; hash: string }
  close?: boolean
}

export type Result = {
  cast: {
    hash: string
    text?: string
    embeds?: [] | [string] | [string, string]
    parent?: { type: 'cast'; hash: string }
    close?: boolean
  }
}
