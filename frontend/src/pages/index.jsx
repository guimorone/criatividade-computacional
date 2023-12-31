import { useMemo } from 'react'
import Head from 'next/head'
import Link from 'next/link'

import { useAudioPlayer } from '@/components/AudioProvider'
import { Container } from '@/components/Container'
import { PlayPauseIcon } from '@/components/PlayPauseIcon'

import gallery from "../metadata/gallery.json"


function EpisodeEntry({ episode }) {
  let audioPlayerData = useMemo(
    () => ({
      title: episode.title,
      audio: {
        src: `/audio/${episode.id}/final.mp3`,
        type: episode.audio_type,
      },
      link: `/${episode.id}`,
    }),
    [episode]
  )
  let player = useAudioPlayer(audioPlayerData)

  return (
    <article
      aria-labelledby={`episode-${episode.id}-title`}
      className="py-10 sm:py-12"
    >
      <Container >
        <div style={{display:"flex", justifyContent:"space-between"} }>
          <div className="flex flex-col items-start">
            <h2
              id={`episode-${episode.id}-title`}
              className="mt-2 text-lg font-bold text-slate-900"
            >
              <Link href={`/${episode.id}`}>{episode.title}</Link>
            </h2>
            <p className="order-first font-mono text-sm leading-7 text-slate-500">{episode.published}</p>
            
            <p className="mt-1 text-base leading-7 text-slate-700">
              {episode.description}
            </p>
            <div className="mt-4 flex items-center gap-4">
              <button
                type="button"
                onClick={() => player.toggle()}
                className="flex items-center text-sm font-bold leading-6 text-pink-500 hover:text-pink-700 active:text-pink-900"
                aria-label={`${player.playing ? 'Pause' : 'Play'} episode ${
                  episode.title
                }`}
              >
                <PlayPauseIcon
                  playing={player.playing}
                  className="h-2.5 w-2.5 fill-current"
                />
                <span className="ml-3" aria-hidden="true">
                  Listen
                </span>
              </button>
              <span
                aria-hidden="true"
                className="text-sm font-bold text-slate-400"
              >
                /
              </span>
              <Link
                href={`/${episode.id}`}
                className="flex items-center text-sm font-bold leading-6 text-pink-500 hover:text-pink-700 active:text-pink-900"
                aria-label={`Show notes for episode ${episode.title}`}
              >
                Show notes
              </Link>
            </div>
          </div>
          <div >
              <img src={`/images/${episode.id}.png`} className="rounded-md shadow-sm sm:rounded-lg lg:rounded-xl" style={{ "height": "136px", width:"136px"}} />
          </div>
        </div>
      </Container>
    </article>
  )
}

export default function Home({ episodes }) {
  return (
    <>
      <Head>
        <title>
          Vocais da Loirinha
        </title>
        <meta
          name="description"
          content="Vocais da loirinha."
        />
      </Head>
      <div className="pb-12 pt-16 sm:pb-4 lg:pt-12">
        <Container>
          <h1 className="text-2xl font-bold leading-7 text-slate-900">
            Galeria
          </h1>
        </Container>
        <div className="divide-y divide-slate-100 sm:mt-4 lg:mt-8 lg:border-t lg:border-slate-100">
          {episodes.map((episode) => (
            <EpisodeEntry key={episode.id} episode={episode} />
          ))}
        </div>
      </div>
    </>
  )
}

export async function getStaticProps() {
  let items = {...gallery}.data
  return {
    props: {
      episodes: items.map(
        ({ id, title, description, audio_type, published }) => ({
          id,
          title: `${id}: ${title}`,
          published,
          description,
          audio_type
        })
      ),
    },
    revalidate: 10,
  }
}
