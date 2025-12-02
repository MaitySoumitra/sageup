// src/hooks/useUser.ts
import { useQuery } from '@tanstack/react-query';
import { fetcher } from '../../api/api';

export interface User {
  id: string;
  name: string;
  role: 'admin' | 'tutor' | 'institute' | 'student';
}

export const useUser = () => {
  return useQuery<{ message: string; user: User }>({
    queryKey: ['user'],
    queryFn: () => fetcher<{ message: string; user: User }>('profile'),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};
