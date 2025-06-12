import { useMutation } from '@tanstack/react-query'
import axios from 'axios'

export function useImportCsv() {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append('file', file)
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/repositories/import/csv`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )
      return data
    },
  })
}
