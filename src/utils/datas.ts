/** Converte uma data ISO (AAAA-MM-DD, formato da API) para exibição (DD/MM/AAAA). */
export function isoParaDisplay(iso: string): string {
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
}

/** Converte uma data exibida (DD/MM/AAAA) para o formato ISO (AAAA-MM-DD) esperado pela API. */
export function displayParaISO(display: string): string {
  const [dia, mes, ano] = display.split("/");
  return `${ano}-${mes}-${dia}`;
}

/** Aplica a máscara DD/MM/AAAA a uma data sendo digitada num TextInput numérico. */
export function mascararDataDigitada(valor: string): string {
  const numeros = valor.replace(/\D/g, "").slice(0, 8);
  let resultado = numeros;
  if (numeros.length > 2) resultado = numeros.slice(0, 2) + "/" + numeros.slice(2);
  if (numeros.length > 4) resultado = numeros.slice(0, 2) + "/" + numeros.slice(2, 4) + "/" + numeros.slice(4);
  return resultado;
}
