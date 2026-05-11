// =============================================
// Paleta de cores do PetPulse
// Identidade visual: roxo, azul e verde/água
// =============================================

export const cores = {
  // Roxo - cor principal
  roxoPrimario: '#6B21A8',
  roxoMedio: '#9333EA',
  roxoClaro: '#C084FC',
  roxoFundo: '#F5F3FF',

  // Azul
  azulPrimario: '#1D4ED8',
  azulClaro: '#60A5FA',

  // Verde/Água - destaque
  verde: '#06B6D4',
  verdeClaro: '#A7F3D0',

  // Neutros
  branco: '#FFFFFF',
  cinzaClaro: '#F3F4F6',
  cinzaMedio: '#9CA3AF',
  cinzaEscuro: '#374151',
  preto: '#111827',

  // Feedback
  erro: '#EF4444',
  sucesso: '#10B981',
  aviso: '#F59E0B',
};

// Gradientes
export const gradientes = {
  principal: ['#6B21A8', '#9333EA', '#06B6D4'] as const,
  header: ['#6B21A8', '#9333EA'] as const,
  card: ['#9333EA', '#1D4ED8'] as const,
  fundo: ['#F5F3FF', '#EDE9FE'] as const,
};
