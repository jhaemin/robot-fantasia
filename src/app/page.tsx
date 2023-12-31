'use client'

import { useStore } from '@nanostores/react'
import clsx from 'clsx'
import { atom } from 'nanostores'
import { useEffect, useRef } from 'react'
import PlayIcon from './PlayIcon'

const $trackNumber = atom(1)
const $mainVideoLoaded = atom(false)
const $coverVideoLoaded = atom(false)
const $introEnded = atom(false)
const $showTrackHeader = atom(false)
const $hideCursor = atom(false)

export interface Track {
  title: string
}

const tracks: Track[] = [
  { title: '출발은 떨렸지만' },
  { title: '배달은 자신 있어' },
  { title: '복귀해도 될까요' },
  { title: '충전할 땐 클래식을' },
  { title: '선물하러 가는 길' },
  { title: '미래도시라솔파' },
  { title: '큰집 18층으로 떠나는 여행' },
  { title: '이 초대장은 2010년 최초로 시작되어...' },
  { title: '거의 다 왔어요' },
]

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export default function Home() {
  const showTrackHeader = useStore($showTrackHeader)
  const mainVideoLoaded = useStore($mainVideoLoaded)
  const coverVideoLoaded = useStore($coverVideoLoaded)
  const trackNumber = useStore($trackNumber)
  const introEnded = useStore($introEnded)

  const mainVideoRef = useRef<HTMLVideoElement>(null!)
  const coverVideoRef = useRef<HTMLVideoElement>(null!)

  useEffect(() => {
    const mainVideoElm = mainVideoRef.current
    const coverVideoElm = coverVideoRef.current

    mainVideoElm.load()
    coverVideoElm.load()
  }, [])

  useEffect(() => {
    if (mainVideoLoaded && coverVideoLoaded) {
      const mainVideoElm = mainVideoRef.current
      const coverVideoElm = coverVideoRef.current

      mainVideoElm.currentTime = 2.5
      mainVideoElm.play()

      coverVideoElm.play()
    }
  }, [mainVideoLoaded, coverVideoLoaded])

  useEffect(() => {
    if (introEnded) {
      const mainVideoElm = mainVideoRef.current

      $trackNumber.set(1)

      mainVideoElm.currentTime = 0
      mainVideoElm.muted = false
      mainVideoElm.play()
    }
  }, [introEnded])

  function playPreviousTrack() {
    const previousTrackNumber = trackNumber === 1 ? 9 : trackNumber - 1

    $trackNumber.set(previousTrackNumber)

    const mainVideoElm = mainVideoRef.current

    mainVideoElm.src = `/track-${previousTrackNumber}.mp4`
    mainVideoElm.currentTime = 0

    mainVideoElm.play()

    $showTrackHeader.set(true)

    setTimeout(() => {
      $showTrackHeader.set(false)
    }, 5000)
  }

  function playNextTrack() {
    const nextTrackNumber = trackNumber === 9 ? 1 : trackNumber + 1

    $trackNumber.set(nextTrackNumber)

    const mainVideoElm = mainVideoRef.current

    mainVideoElm.src = `/track-${nextTrackNumber}.mp4`
    mainVideoElm.currentTime = 0

    mainVideoElm.play()

    $showTrackHeader.set(true)

    setTimeout(() => {
      $showTrackHeader.set(false)
    }, 5000)
  }

  return (
    <main
      className={clsx('main', {
        'cover-video-loaded': coverVideoLoaded,
        'intro-ended': introEnded,
        'hide-cursor': $hideCursor.get(),
        'show-track-header': showTrackHeader,
      })}
      onClick={(e) => {
        if (!introEnded) return

        if (e.target instanceof HTMLButtonElement) return

        $showTrackHeader.set(!showTrackHeader)
      }}
    >
      <div className="background-video-wrapper">
        <video
          ref={mainVideoRef}
          className="main-video"
          loop={!introEnded}
          muted
          role="img"
          playsInline
          src="/track-1.mp4"
          onLoadedData={() => {
            if (introEnded) return
            $mainVideoLoaded.set(true)
          }}
          onEnded={() => {
            if (!introEnded) return
            playNextTrack()
          }}
        />

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
            src="/cover.mp4"
            onLoadedData={() => {
              if (introEnded) return
              $coverVideoLoaded.set(true)
            }}
          />
        </div>

        <h1 className="robot-fantasia-title">로봇 판타지아</h1>
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
              $introEnded.set(true)

              setTimeout(() => {
                $showTrackHeader.set(true)

                setTimeout(() => {
                  $showTrackHeader.set(false)
                }, 5000)
              }, 1000)
            }}
          >
            지금 바로 듣기 <PlayIcon />
          </button>
        </div>
      </div>

      <div className="track-header">
        <div className="track-header__blur" />
        <div className="track-title">
          Track {trackNumber}. {tracks[trackNumber - 1].title}
        </div>
        <div className="controls">
          <button className="change-track-button" onClick={playPreviousTrack}>
            <svg
              width="11"
              height="14"
              viewBox="0 0 11 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ width: 'auto', height: 16 }}
            >
              <g clipPath="url(#clip0_738_635)">
                <path
                  d="M0 6.78125C0 6.97656 0.0703125 7.14844 0.21875 7.29688L6.41406 13.3516C6.54688 13.4922 6.71875 13.5625 6.92188 13.5625C7.32812 13.5625 7.64062 13.2578 7.64062 12.8516C7.64062 12.6484 7.55469 12.4766 7.42969 12.3438L1.74219 6.78125L7.42969 1.21875C7.55469 1.08594 7.64062 0.90625 7.64062 0.710938C7.64062 0.304688 7.32812 0 6.92188 0C6.71875 0 6.54688 0.0703125 6.41406 0.203125L0.21875 6.26562C0.0703125 6.40625 0 6.58594 0 6.78125Z"
                  fill="black"
                  fillOpacity="0.85"
                />
              </g>
              <defs>
                <clipPath id="clip0_738_635">
                  <rect width="10.0312" height="13.5703" fill="white" />
                </clipPath>
              </defs>
            </svg>
            이전 트랙
          </button>
          <button className="change-track-button" onClick={playNextTrack}>
            다음 트랙
            <svg
              width="10"
              height="14"
              viewBox="0 0 10 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ width: 'auto', height: 16 }}
            >
              <g clipPath="url(#clip0_738_627)">
                <path
                  d="M9.23438 6.78125C9.23438 6.58594 9.15625 6.40625 9.00781 6.26562L2.82031 0.203125C2.67969 0.0703125 2.50781 0 2.30469 0C1.90625 0 1.59375 0.304688 1.59375 0.710938C1.59375 0.90625 1.67188 1.08594 1.79688 1.21875L7.48438 6.78125L1.79688 12.3438C1.67188 12.4766 1.59375 12.6484 1.59375 12.8516C1.59375 13.2578 1.90625 13.5625 2.30469 13.5625C2.50781 13.5625 2.67969 13.4922 2.82031 13.3516L9.00781 7.29688C9.15625 7.14844 9.23438 6.97656 9.23438 6.78125Z"
                  fill="black"
                  fillOpacity="0.85"
                />
              </g>
              <defs>
                <clipPath id="clip0_738_627">
                  <rect width="9.23438" height="13.5703" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </button>
        </div>
      </div>
    </main>
  )
}
