exports.dayInPortuguese = (day) => {
  let dayPTBR

  switch (day) {
    case 'monday': {
      dayPTBR = 'Segunda-feira'
      break
    }
    case 'tuesday': {
      dayPTBR = 'Terça-feira'
      break
    }
    case 'wednesday': {
      dayPTBR = 'Quarta-feira'
      break
    }
    case 'thursday': {
      dayPTBR = 'Quinta-feira'
      break
    }
    case 'friday': {
      dayPTBR = 'Sexta-feira'
      break
    }
    default: {
      dayPTBR = false
    }
  }

  return dayPTBR
}