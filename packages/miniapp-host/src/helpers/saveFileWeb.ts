import { SaveFile } from '@farcaster/miniapp-core'

/**
 * Saves a file in a web host using the
 * [File System Access API](https://developer.mozilla.org/en-US/docs/Web/API/Window/showSaveFilePicker)
 * when available, otherwise triggers a download via a temporary object URL.
 */
export const saveFileInBrowser: SaveFile.SaveFile = async (options) => {
  const mimeType = options.mimeType ?? 'application/octet-stream'
  const blob = new Blob([options.data], { type: mimeType })

  if (
    typeof window !== 'undefined' &&
    'showSaveFilePicker' in window &&
    typeof window.showSaveFilePicker === 'function'
  ) {
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: options.filename,
      })
      const writable = await handle.createWritable()
      await writable.write(blob)
      await writable.close()
      return
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') {
        throw new SaveFile.RejectedByUser()
      }
      if (e instanceof Error && e.name === 'AbortError') {
        throw new SaveFile.RejectedByUser()
      }
      const message = e instanceof Error ? e.message : 'Failed to save file'
      throw new SaveFile.SaveFailed(message)
    }
  }

  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = options.filename
  anchor.rel = 'noopener'
  anchor.style.display = 'none'
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}
