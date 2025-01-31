'use client'

import { useStore } from '@nanostores/react'
import clsx from 'clsx'
import { atom } from 'nanostores'
import { useEffect, useRef } from 'react'
import { tracks } from '../tracks'
import { BackwardIcon } from './icons/backward-icon'
import { ForwardIcon } from './icons/forward-icon'
import { PauseIcon } from './icons/pause-icon'
import { PlayIcon } from './icons/play-icon'

const $isPlaying = atom(false)
const $trackNumber = atom(1)
const $controllerHidden = atom(false)

let controllerHiddenTimeout: number

function showController() {
  $controllerHidden.set(false)

  if (controllerHiddenTimeout) {
    window.clearTimeout(controllerHiddenTimeout)
  }

  setTimeout(() => {
    if (!$isPlaying.get()) {
      return
    }

    controllerHiddenTimeout = window.setTimeout(() => {
      $controllerHidden.set(true)
    }, 2000)
  }, 0)
}

export default function Player() {
  const videoRef = useRef<HTMLVideoElement>(null!)
  const progressBarRef = useRef<HTMLDivElement>(null!)

  const isPlaying = useStore($isPlaying)
  const trackNumber = useStore($trackNumber)
  const controllerHidden = useStore($controllerHidden)

  function playPreviousTrack() {
    const time = videoRef.current.currentTime

    if (time > 3) {
      videoRef.current.currentTime = 0
      return
    }

    setProgressBarPosition(0)

    const previousTrackNumber = trackNumber === 1 ? 9 : trackNumber - 1

    $trackNumber.set(previousTrackNumber)

    const videoElm = videoRef.current

    videoElm.src = `/media/track-${previousTrackNumber}.mp4`
    videoElm.currentTime = 0

    videoElm.play()
  }

  function playNextTrack() {
    setProgressBarPosition(0)

    const nextTrackNumber = trackNumber === 9 ? 1 : trackNumber + 1

    $trackNumber.set(nextTrackNumber)

    const videoElm = videoRef.current

    videoElm.src = `/media/track-${nextTrackNumber}.mp4`
    videoElm.currentTime = 0

    videoElm.play()
  }

  function setProgress(percent: number) {
    const videoElm = videoRef.current

    videoElm.currentTime = (percent / 100) * videoElm.duration
  }

  function setProgressBarPosition(percent: number) {
    progressBarRef.current.style.transform = `translateX(${-100 + percent}%)`
  }

  useEffect(() => {
    // Sync the playing state (e.g. HMR)
    $isPlaying.set(!videoRef.current.paused)

    return () => {
      $trackNumber.set(1)
    }
  }, [])

  return (
    <div>
      <div className="theater">
        <video
          ref={videoRef}
          className="video-player"
          role="img"
          playsInline
          src="/media/track-1.mp4"
          onLoadStart={() => {}}
          onLoadedMetadata={() => {}}
          onLoadedData={() => {}}
          onCanPlay={() => {
            if (navigator.userActivation.hasBeenActive) {
              videoRef.current.play()
              showController()
            }
          }}
          onPlay={() => {
            $isPlaying.set(true)
          }}
          onPause={() => {
            $isPlaying.set(false)
          }}
          onEnded={() => {
            playNextTrack()
          }}
          onTimeUpdate={(e) => {
            const percent =
              (e.currentTarget.currentTime / e.currentTarget.duration) * 100

            progressBarRef.current.style.transform = `translateX(${
              -100 + percent
            }%)`
          }}
        />

        <div className="curtain" />
      </div>

      <div
        className={clsx('controller', { hidden: controllerHidden })}
        onMouseMove={() => {
          showController()
        }}
      >
        <div className="playback">
          <button
            className="playback-button"
            onClick={() => {
              playPreviousTrack()
              showController()
            }}
          >
            <BackwardIcon />
          </button>
          <button
            className="playback-button"
            onClick={() => {
              if (videoRef.current.paused) {
                videoRef.current.play()
              } else {
                videoRef.current.pause()
              }

              showController()
            }}
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>
          <button
            className="playback-button"
            onClick={() => {
              playNextTrack()
              showController()
            }}
          >
            <ForwardIcon />
          </button>
        </div>

        <div className="bottom-bar">
          <div className="bb-row">
            <div className="track-info">
              <h2 className="track-number">
                Track.{trackNumber.toString().padStart(2, '0')}
              </h2>
              <h1 className="track-title">{tracks[trackNumber - 1].title}</h1>
            </div>
          </div>

          <div className="progress-bar-wrapper">
            <div ref={progressBarRef} className="progress-bar" />
          </div>
        </div>
      </div>
    </div>
  )
}
