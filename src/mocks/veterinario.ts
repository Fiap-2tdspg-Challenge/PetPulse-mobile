import { Veterinario } from '../types/veterinario';

// Mesmas credenciais semeadas em PetPulseDB/03_CARGA.sql (PRC_CARGA_PROFISSIONAL),
// para que, quando a API ganhar autenticação real (JWT + roles), esses mesmos
// logins de teste continuem fazendo sentido.
export const mockVeterinarios: Veterinario[] = [
  {
    idVeterinario: 1,
    nome: 'Dr. Carlos Andrade',
    email: 'carlos.andrade@vetcare.com',
    senha: 'vet123',
    crmv: 'CRMV-SP-12345',
    clinica: 'Clínica VetCare',
  },
  {
    idVeterinario: 2,
    nome: 'Dra. Fernanda Lima',
    email: 'fernanda.lima@vetcare.com',
    senha: 'vet456',
    crmv: 'CRMV-SP-23456',
    clinica: 'Clínica VetCare',
  },
];
