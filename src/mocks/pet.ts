import { Pet } from '../types/pet';

export const mockPets: Pet[] = [
  {
    idPet: 1,
    idUsuario: 1,
    nome: 'Beluga',
    especie: 'Cachorro',
    raca: 'Golden Retriever',
    dtNascimento: '2022-03-15',
    peso: 28.5,
    sexo: 'MACHO',
    castrado: true,
    porte: 'GRANDE',
    dtCadastro: '2024-01-10',
  },
  {
    idPet: 2,
    idUsuario: 1,
    nome: 'Mia',
    especie: 'Gato',
    raca: 'Siamês',
    dtNascimento: '2023-07-20',
    peso: 4.2,
    sexo: 'FEMEA',
    castrado: true,
    porte: 'PEQUENO',
    dtCadastro: '2024-02-05',
  },
];
