import { useMutation, useQuery } from '@tanstack/react-query';
import { createTutor, updateTutor, deleteTutor, getTutorById, loginTutor } from '../services/api/tutorApi';
import { createTutorPhone, updateTutorPhone } from '../services/api/tutorPhoneApi';
import { findOrCreateState } from '../services/api/stateApi';
import { findOrCreateCity } from '../services/api/cityApi';
import { createTutorAddress, updateTutorAddress } from '../services/api/tutorAddressApi';
import {
  StateRequest,
  CityRequest,
  TutorAddressRequest,
  TutorLoginRequest,
  TutorPhoneRequest,
  TutorRequest,
} from '../types/types';

// Usado pelo painel do veterinário, que precisa exibir os dados do tutor responsável por um pet.
export function useTutorById(id?: number) {
  return useQuery({
    queryKey: ['tutor', id],
    queryFn: () => getTutorById(id!),
    enabled: !!id,
  });
}

export function useLoginTutor() {
  return useMutation({
    mutationFn: (dados: TutorLoginRequest) => loginTutor(dados),
  });
}

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

export function useDeleteTutor() {
  return useMutation({
    mutationFn: (id: number) => deleteTutor(id),
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

export function useFindOrCreateState() {
  return useMutation({
    mutationFn: (dados: StateRequest) => findOrCreateState(dados),
  });
}

export function useFindOrCreateCity() {
  return useMutation({
    mutationFn: (dados: CityRequest) => findOrCreateCity(dados),
  });
}

export function useCreateTutorAddress() {
  return useMutation({
    mutationFn: (dados: TutorAddressRequest) => createTutorAddress(dados),
  });
}

export function useUpdateTutorAddress() {
  return useMutation({
    mutationFn: ({ id, dados }: { id: number; dados: TutorAddressRequest }) => updateTutorAddress(id, dados),
  });
}
