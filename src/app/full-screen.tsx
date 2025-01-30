'use client'

import { atom } from 'nanostores'
import { useEffect } from 'react'

export const $fullScreen = atom(false)

export function FullScreen() {
  useEffect(() => {
    function onFullScreenChange() {
      $fullScreen.set(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', onFullScreenChange)

    return () => {
      document.removeEventListener('fullscreenchange', onFullScreenChange)
    }
  }, [])

  return null
}

export function toggleFullScreen() {
  if (document.fullscreenElement) {
    document.exitFullscreen()
  } else {
    document.documentElement.requestFullscreen()
  }
}
