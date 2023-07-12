import { useMemo } from 'react'
import Head from 'next/head'

import { useAudioPlayer } from '@/components/AudioProvider'
import { Container } from '@/components/Container'
import { PlayButton } from '@/components/player/PlayButton'
import { PlayPauseIcon } from '@/components/PlayPauseIcon'
import gallery from "../metadata/gallery.json"

function ListenButton({episode, audio_filename}){

  let audioPlayerData = useMemo(
    () => ({
      title: episode.title + " - " + audio_filename.toUpperCase(),
      audio: {
        src: `/audio/${episode.id}/${audio_filename}.mp3`,
        type: episode.audio_type,
      },
      link: `/${episode.id}`,
    }),
    [episode]
  )
  let player = useAudioPlayer(audioPlayerData)

  return (
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
  )
}

export default function Episode({ episode }) {

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
          <div className="flex flex-col">
            <h2 className="mt-2 text-3xl font-bold text-slate-900">More Audios</h2>
            <p>Original Vocals:</p>
            <ListenButton episode={episode} audio_filename="original"/>
            <p>Instrumental:</p>
            <ListenButton episode={episode} audio_filename="instrumental"/>
            <p>Modified Vocals:</p>
            <ListenButton episode={episode} audio_filename="modified"/>
            <br/>

            <div >
              <img src={`/images/${episode.id}.png`} className="rounded-md shadow-sm sm:rounded-lg lg:rounded-xl" style={{ "height": "200px", width:"200px"}} />
            </div>

            <h2 className="mt-2 text-3xl font-bold text-slate-900">Image info</h2>
            <p>Source: {episode.content.source}</p>
            <p>Stable Diffusion version: {episode.content.stable_diffusion_version}</p>
            <p>Prompt: {episode.content.prompt}</p>
            <p>Image Strength: {episode.content.image_strength}</p>
            <p>Seed: {episode.content.seed}</p>
            <p>Sampler: {episode.content.sampler}</p>
            <p>Guidance Scale: {episode.content.guidance_scale}</p>
          </div>
        </Container>
      </article>
    </>
  )
}

export async function getStaticProps({ params }) {
  let items = {...gallery}.data
  let episode = items
    .map(({ id, title, description, audio_type, published, content }) => ({
      id: id.toString(),
      title: `${id}: ${title}`,
      description,
      published,
      content,
      audio_type
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
