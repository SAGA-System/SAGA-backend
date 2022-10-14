const logger = require('../resources/logger')

const initModels = require('../models/init-models')
const db = require('../models/db')
const models = initModels(db)

exports.index = async (req, res) => {
  try {
    logger.info(`frequencyController/index - list all frequencies`)

    let frequencies = await models.frequency.findAll()

    if (frequencies.length === 0) {
      return res.status(404).send({
        error: {
          message: 'Nenhuma frequência foi encontrada'
        }
      })
    }

    frequencies = frequencies.map(item => {
      return {
        ...item['dataValues'],
        // TODO: criar coluna que pega as faltas permitidas automaticamente do curso na instituição
        allowedAbsences: item.totalClasses / 100 * 25,
        totalFrequency: 100 - (100 / item.totalClasses * item.absence),
        actualFrequency: 100 - (100 / item.classGiven * item.absence),
      }
    })

    return res.status(200).send(frequencies)
  } catch (err) {
    logger.error(`Failed to list frequencies - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}

exports.show = async (req, res) => {
  try {
    logger.info(`frequencyController/show - list a student's attendance `)

    const idStudentClasses = req.params.idStudentClasses

    let frequencies = await models.frequency.findAll({ where: { idStudentClasses: idStudentClasses } })

    if (frequencies.length === 0) {
      return res.status(404).send({
        error: {
          message: 'Nenhum registro de frequência foi encontrado para esse aluno'
        }
      })
    }

    frequencies = frequencies.map(item => {
      return {
        ...item['dataValues'],
        // TODO: criar coluna que pega as faltas permitidas automaticamente do curso na instituição
        allowedAbsences: item.totalClasses / 100 * 25,
        totalFrequency: 100 - (100 / item.totalClasses * item.absence),
        actualFrequency: 100 - (100 / item.classGiven * item.absence),
      }
    })

    return res.status(200).send(frequencies)
  } catch (err) {
    logger.error(`Failed to list a student's attendance - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}