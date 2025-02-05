'use client'

import { useStore } from '@nanostores/react'
import clsx from 'clsx'
import { atom, computed } from 'nanostores'
import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'
import PlayIcon from './PlayIcon'

const $trackNumber = atom(1)
const $videoLoaded = atom(false)
const $coverVideoLoaded = atom(false)
const $pageReady = computed(
  [$videoLoaded, $coverVideoLoaded],
  (videoLoaded, coverVideoLoaded) => videoLoaded && coverVideoLoaded
)
const $outro = atom(false)

export default function Home() {
  const router = useRouter()

  const videoLoaded = useStore($videoLoaded)
  const coverVideoLoaded = useStore($coverVideoLoaded)
  const trackNumber = useStore($trackNumber)
  const pageReady = useStore($pageReady)
  const outro = useStore($outro)

  const videoRef = useRef<HTMLVideoElement>(null!)
  const coverVideoRef = useRef<HTMLVideoElement>(null!)

  function playNextTrack() {
    const nextTrackNumber = trackNumber === 9 ? 1 : trackNumber + 1

    $trackNumber.set(nextTrackNumber)

    const mainVideoElm = videoRef.current

    mainVideoElm.src = `/media/track-${nextTrackNumber}.mp4`
    mainVideoElm.currentTime = 0

    mainVideoElm.play()
  }

  useEffect(() => {
    const mainVideoElm = videoRef.current
    const coverVideoElm = coverVideoRef.current

    mainVideoElm.load()
    coverVideoElm.load()

    return () => {
      $outro.set(false)
    }
  }, [])

  useEffect(() => {
    if (videoLoaded && coverVideoLoaded) {
      const mainVideoElm = videoRef.current
      const coverVideoElm = coverVideoRef.current

      mainVideoElm.currentTime = 2.5
      mainVideoElm.play()

      coverVideoElm.play()
    }
  }, [videoLoaded, coverVideoLoaded])

  return (
    <main
      className={clsx('main', {
        'page-ready': pageReady,
        outro: outro,
      })}
    >
      <div className="background-video-wrapper">
        <video
          ref={videoRef}
          className="main-video"
          loop
          muted
          role="img"
          playsInline
          onCanPlay={() => {
            $videoLoaded.set(true)
          }}
          onEnded={() => {
            playNextTrack()
          }}
        >
          <source src="/media/track-1.mp4" type="video/mp4" />
        </video>

        <div className="blurry-cover" />
      </div>

      <div className="intro-layer">
        <div className="cover-video-wrapper">
          <video
            ref={coverVideoRef}
            className="cover-video"
            loop
            muted
            role="img"
            playsInline
            onCanPlay={() => {
              $coverVideoLoaded.set(true)
            }}
          >
            <source src="/cover.mp4" type="video/mp4" />
          </video>
        </div>

        <h1 className="robot-fantasia-title">로봇판타지아</h1>
        <p className="album-description">
          <span className="no-break">사람과 사람, 행성과 행성,</span>{' '}
          <span className="no-break">은하와 은하 사이를 잇는</span>
          <br />
          <span className="no-break">다양한 로봇을 상상하며 만든</span>{' '}
          <span className="no-break">환상곡 시리즈.</span>
        </p>
        <div className="listen-now-wrapper">
          <button
            className="listen-now"
            onClick={() => {
              $outro.set(true)

              document.querySelector('.cross-fade')?.classList.add('active')

              setTimeout(() => {
                router.push('/player')
                document
                  .querySelector('.cross-fade')
                  ?.classList.remove('active')
              }, 800)
            }}
          >
            지금 바로 듣기 <PlayIcon />
          </button>
        </div>
      </div>
    </main>
  )
}
