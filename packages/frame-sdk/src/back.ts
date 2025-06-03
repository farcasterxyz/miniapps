import type { Back as BackCore, WireFrameHost } from '@farcaster/frame-core'
import type { Remote } from 'comlink'
import type { Emitter } from './types.ts'

export type Back = {
  enabled: boolean
  visible: boolean
  show: () => Promise<void>
  hide: () => Promise<void>
  enable: () => Promise<void>
  disable: () => Promise<void>
  enableWebNavigation: () => Promise<void>
  disableWebNavigation: () => Promise<void>
  update: (state: BackCore.BackState) => Promise<void>
}

export const createBack: (options: {
  emitter: Emitter
  frameHost: Remote<WireFrameHost>
}) => Back = ({ frameHost, emitter }) => {
  let teardownWebNavigation: undefined | (() => void) = undefined

  return {
    enabled: false,
    visible: false,
    async show() {
      return this.update({
        visible: true,
        enabled: this.enabled,
      })
    },
    async hide() {
      return this.update({
        visible: false,
        enabled: this.enabled,
      })
    },
    async enable() {
      return this.update({
        visible: this.visible,
        enabled: true,
      })
    },
    async disable() {
      return this.update({
        visible: this.visible,
        enabled: true,
      })
    },
    async enableWebNavigation() {
      teardownWebNavigation = setupWebBack({
        back: this,
        emitter,
      })
    },
    async disableWebNavigation() {
      teardownWebNavigation?.()
      teardownWebNavigation = undefined
    },
    async update(state) {
      await frameHost.updateBackState(state)
      this.visible = state.visible
      this.enabled = state.enabled
    },
  }
}

function setupWebBack({
  emitter,
  back,
}: {
  emitter: Emitter
  back: Back
}) {
  const navigation = getWebNavigation()
  if (navigation) {
    return setupNavigationApi({ emitter, back, navigation })
  }

  if (typeof window !== 'undefined') {
    return setupFallback({ emitter, back, window })
  }
}

function getWebNavigation(): Navigation | undefined {
  if (typeof window !== 'undefined' && window.navigation !== undefined) {
    return window.navigation
  }
}

function setupNavigationApi({
  emitter,
  back,
  navigation,
}: {
  emitter: Emitter
  back: Back
  navigation: Navigation
}) {
  function handleNavigateSuccess() {
    if (navigation.canGoBack) {
      back.update({
        visible: true,
        enabled: true,
      })
    } else {
      back.update({
        visible: back.enabled,
        enabled: false,
      })
    }
  }

  function handleBackNavigationTriggered() {
    if (back.enabled && navigation.canGoBack) {
      navigation.back()
    }
  }

  navigation.addEventListener('navigatesuccess', handleNavigateSuccess)
  emitter.addListener('backNavigationTriggered', handleBackNavigationTriggered)

  return () => {
    navigation.removeEventListener('navigatesuccess', handleNavigateSuccess)
    emitter.removeListener(
      'backNavigationTriggered',
      handleBackNavigationTriggered,
    )
  }
}

function setupFallback({
  emitter,
  back,
  window,
}: {
  emitter: Emitter
  back: Back
  window: Window
}) {
  back.update({
    visible: true,
    enabled: true,
  })

  function handleBackNavigationTriggered() {
    if (back.enabled) {
      window.history.back()
    }
  }

  emitter.addListener('backNavigationTriggered', handleBackNavigationTriggered)

  return () => {
    emitter.removeListener(
      'backNavigationTriggered',
      handleBackNavigationTriggered,
    )
  }
}
