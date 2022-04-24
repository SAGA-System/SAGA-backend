exports.validateCNPJ = (cnpj) => {
  cnpj = cnpj.replace(/[^\d]+/g, '');

  if (cnpj == '') return false;

  if (cnpj.length != 14)
    return false;

  // Elimina CNPJs invalidos conhecidos
  if (cnpj == "00000000000000" ||
    cnpj == "11111111111111" ||
    cnpj == "22222222222222" ||
    cnpj == "33333333333333" ||
    cnpj == "44444444444444" ||
    cnpj == "55555555555555" ||
    cnpj == "66666666666666" ||
    cnpj == "77777777777777" ||
    cnpj == "88888888888888" ||
    cnpj == "99999999999999")
    return false;

  // Valida DVs
  size = cnpj.length - 2
  numbers = cnpj.substring(0, size);
  digits = cnpj.substring(size);
  sum = 0;
  pos = size - 7;
  for (i = size; i >= 1; i--) {
    sum += numbers.charAt(size - i) * pos--;
    if (pos < 2)
      pos = 9;
  }
  result = sum % 11 < 2 ? 0 : 11 - sum % 11;
  if (result != digits.charAt(0))
    return false;

  size = size + 1;
  numbers = cnpj.substring(0, size);
  sum = 0;
  pos = size - 7;
  for (i = size; i >= 1; i--) {
    sum += numbers.charAt(size - i) * pos--;
    if (pos < 2)
      pos = 9;
  }
  result = sum % 11 < 2 ? 0 : 11 - sum % 11;
  if (result != digits.charAt(1))
    return false;

  return true;

}

exports.validadeCPF = (cpf) => {
  const regExp = new RegExp(`[^${cpf.charAt(0)}]`, 'g')

  if (cpf.search(regExp) === -1)
    return true

  let index = 9
  while (index < 11) {
    let sum = 0
    for (let i = 0; i < index; i++) {
      sum += parseInt(cpf.charAt(i)) * (index + 1 - i)
    }
    let rev = 11 - (sum % 11)
    if (rev == 10 || rev == 11)
      rev = 0
    if (rev != parseInt(cpf.charAt(index)))
      return true
    index += 1
  }
  return false
}