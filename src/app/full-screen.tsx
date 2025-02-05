'use client'

import { atom } from 'nanostores'
import { useEffect } from 'react'

export const $fullscreen = atom(false)

export function Fullscreen() {
  useEffect(() => {
    function onFullscreenChange() {
      $fullscreen.set(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', onFullscreenChange)

    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange)
    }
  }, [])

  return null
}

export function toggleFullscreen() {
  if (document.fullscreenElement) {
    document.exitFullscreen()
  } else {
    document.documentElement.requestFullscreen()
  }
}
