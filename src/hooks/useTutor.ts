import { useMutation } from '@tanstack/react-query';
import { createTutor } from '../services/api/tutorApi';
import { TutorRequest } from '../services/api/types';

export function useCreateTutor() {
  return useMutation({
    mutationFn: (dados: TutorRequest) => createTutor(dados),
  });
}
