import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function useGithubRepos(username: string) {
  return useQuery({
    queryKey: ['github-repos', username],
    queryFn: async () => {
      if (!username) return [];
      const { data } = await axios.get(`${API_URL}/repositories/github/${username}`);
      return data;
    },
    enabled: !!username,
    staleTime: 1000 * 60, 
  });
}