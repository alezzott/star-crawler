import Link from 'next/link'

export const FooterComponent = () => {
  return (
    <footer className="px-8 py-12 text-right text-sm text-[#252525] max-md:text-center md:px-4 md:py-8">
      <p className="font-medium">
        Feito por{' '}
        <Link
          href="https://github.com/alezzott"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-zinc-700 transition-colors hover:text-red-500"
        >
          Alezzo
        </Link>
      </p>
    </footer>
  )
}
