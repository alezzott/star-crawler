import Image from 'next/image'
import bannerHome from '../../../public/banner-star.svg'

export function Header() {
  return (
    <header className="mx-auto mb-8 flex w-full max-w-6xl items-center justify-between gap-8 rounded-lg px-8 py-12 max-lg:flex-col md:gap-6 md:px-4 md:py-8 lg:flex-row">
      <section className="flex flex-1 flex-col items-start justify-center gap-4">
        <h1 className="mb-2 bg-gradient-to-r from-zinc-600 to-[#252525] bg-clip-text text-6xl font-extrabold text-transparent max-md:text-4xl">
          Starcrawler
        </h1>
        <p className="text-lg font-medium text-zinc-600 max-md:text-base">
          Explore e gerencie repositórios do GitHub com praticidade.
        </p>
      </section>
      <section className="flex flex-1 items-center justify-center">
        <Image
          src={bannerHome}
          alt="banner home section"
          draggable={false}
          priority={true}
          className="h-auto w-full"
        />
      </section>
    </header>
  )
}
