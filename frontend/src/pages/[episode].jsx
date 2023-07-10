import { useMemo } from 'react'
import Head from 'next/head'

import { useAudioPlayer } from '@/components/AudioProvider'
import { Container } from '@/components/Container'
import { PlayButton } from '@/components/player/PlayButton'
import gallery from "../metadata/gallery.json"

export default function Episode({ episode }) {

  let audioPlayerData = useMemo(
    () => ({
      title: episode.title,
      audio: {
        src: episode.audio.src,
        type: episode.audio.type,
      },
      link: `/${episode.id}`,
    }),
    [episode]
  )
  let player = useAudioPlayer(audioPlayerData)

  return (
    <>
      <Head>
        <title>{`${episode.title} - Vocal da loirinha`}</title>
        <meta name="description" content={episode.description} />
      </Head>
      <article className="py-16 lg:py-36">
        <Container>
          <header className="flex flex-col">
            <div className="flex items-center gap-6">
              <PlayButton player={player} size="large" />
              <div className="flex flex-col">
                <h1 className="mt-2 text-4xl font-bold text-slate-900">
                  {episode.title}
                </h1>
                <p className="order-first font-mono text-sm leading-7 text-slate-500">{episode.published}</p>
              </div>
            </div>
            <p className="ml-24 mt-3 text-lg font-medium leading-8 text-slate-700">
              {episode.description}
            </p>
          </header>
          <hr className="my-12 border-gray-200" />
        </Container>
      </article>
    </>
  )
}

export async function getStaticProps({ params }) {
  let items = {...gallery}.data
  let episode = items
    .map(({ id, title, description, modified_audio_url, audio_type, published, content }) => ({
      id: id.toString(),
      title: `${id}: ${title}`,
      description,
      published,
      content,
      audio: {
        src: modified_audio_url,
        type: audio_type,
      },
    }))
    .find(({ id }) => id === params.episode)

  if (!episode) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      episode,
    },
    revalidate: 10,
  }
}

export async function getStaticPaths() {
  let items = {...gallery}.data

  return {
    paths: items.map(({ id }) => ({
      params: {
        episode: id.toString(),
      },
    })),
    fallback: 'blocking',
  }
}
