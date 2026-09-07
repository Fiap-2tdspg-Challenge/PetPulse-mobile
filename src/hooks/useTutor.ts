import { useMutation } from '@tanstack/react-query';
import { createTutor, updateTutor } from '../services/api/tutorApi';
import { createTutorPhone, updateTutorPhone } from '../services/api/tutorPhoneApi';
import { TutorPhoneRequest, TutorRequest } from '../types/types';

export function useCreateTutor() {
  return useMutation({
    mutationFn: (dados: TutorRequest) => createTutor(dados),
  });
}

export function useUpdateTutor() {
  return useMutation({
    mutationFn: ({ id, dados }: { id: number; dados: TutorRequest }) => updateTutor(id, dados),
  });
}

export function useCreateTutorPhone() {
  return useMutation({
    mutationFn: (dados: TutorPhoneRequest) => createTutorPhone(dados),
  });
}

export function useUpdateTutorPhone() {
  return useMutation({
    mutationFn: ({ id, dados }: { id: number; dados: TutorPhoneRequest }) => updateTutorPhone(id, dados),
  });
}
