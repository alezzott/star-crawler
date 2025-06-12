'use client'

import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useGithubRepos } from '@/shared/hooks/useGithubRepos'
import { Link, X } from 'lucide-react'
import { useExportCsv } from '@/shared/hooks/useExportCsv'
import { AnimatePresence } from 'motion/react'
import { motion } from 'motion/react'
import { LoaderSpinning } from '../ui/loader-spinning'

export function RepositoriesItem() {
  const [username, setUsername] = useState('')
  const [search, setSearch] = useState('')
  const { data: repos = [], isLoading, error } = useGithubRepos(search)
  const exportCsv = useExportCsv()

  const handleSearch = () => {
    setSearch(username.trim())
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col">
      <div className="flex flex-col items-center">
        <div className="flex w-full flex-col items-center gap-4">
          <div className="flex w-full gap-2">
            <Input
              placeholder="Digite o usuário do GitHub"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              type="text"
              className="flex-1 border"
            />
            {username && (
              <Button
                type="button"
                onClick={() => setUsername('')}
                aria-label="Limpar"
                size="icon"
              >
                <X size={18} />
              </Button>
            )}
            <Button onClick={handleSearch} disabled={!username || isLoading}>
              {isLoading ? 'Buscando...' : 'Buscar'}
            </Button>
            <Button
              variant="outline"
              onClick={() => exportCsv(username)}
              disabled={!repos.length || !username}
            >
              Exportar CSV
            </Button>
          </div>
        </div>
        {isLoading && (
          <div className="mt-6 flex justify-center">
            <LoaderSpinning size={40} />
          </div>
        )}
        {error && (
          <div className="mt-6 text-center text-red-500">
            Erro ao buscar repositórios.
          </div>
        )}
        {!isLoading && !error && search && repos.length === 0 && (
          <div className="mt-6 text-center text-gray-500">
            Nenhum repositório encontrado.
          </div>
        )}
      </div>
      <section className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-4 py-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <AnimatePresence>
          {!isLoading &&
            !error &&
            repos.map((repo: any, idx: number) => (
              <motion.div
                key={repo.name}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 40 }}
                transition={{
                  duration: 0.4,
                  delay: idx * 0.07,
                  type: 'spring',
                  stiffness: 60,
                }}
                style={{ height: '100%' }}
              >
                <Card className="flex h-full flex-col border border-gray-200 shadow-md">
                  <CardHeader>
                    <CardTitle className="text-center text-lg font-semibold">
                      {repo.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col justify-between">
                    <div className="mb-4 flex flex-col items-center gap-1">
                      <div className="text-sm text-gray-700">
                        <span className="font-semibold">Owner:</span>{' '}
                        {repo.owner}
                      </div>
                      <div className="text-sm text-gray-700">
                        <span className="font-semibold">Stars:</span>{' '}
                        {repo.stars}
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <a
                        href={repo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={
                          buttonVariants({ variant: 'default' }) +
                          ' flex items-center gap-2'
                        }
                      >
                        <Link className="inline" size={14} />
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
        </AnimatePresence>
      </section>
    </main>
  )
}
