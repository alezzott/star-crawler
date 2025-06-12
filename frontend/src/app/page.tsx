'use client'
import { ImportItem } from '@/components/import/ImportItem'
import { RepositoriesItem } from '@/components/repositories/RepositoriesItem'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()
export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <main className="mx-auto flex w-full max-w-6xl flex-col">
        <Tabs defaultValue="buscar" className="w-full">
          <TabsList className="mb-6 flex justify-center">
            <TabsTrigger value="buscar">Buscar</TabsTrigger>
            <TabsTrigger value="importar">Importar</TabsTrigger>
          </TabsList>
          <TabsContent value="buscar">
            <RepositoriesItem />
          </TabsContent>
          <TabsContent value="importar">
            <ImportItem />
          </TabsContent>
        </Tabs>
      </main>
    </QueryClientProvider>
  )
}
