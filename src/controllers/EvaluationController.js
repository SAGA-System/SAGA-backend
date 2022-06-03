const jwt = require('jsonwebtoken')

const logger = require('../resources/logger')
const normalizer = require('../resources/normalizer')

const initModels = require('../models/init-models')
const db = require('../models/db')
const models = initModels(db)

exports.index = async (req, res) => {
  try {
    logger.info(`evaluationController/index - list all evaluations`)

    const token = req.headers.authorization.slice(7)
    const tokenDecoded = jwt.decode(token)

    const findUser = await models.users.findOne({ where: { id: tokenDecoded.id } })
    const findClasses = await models.class_.findOne({ where: { idInstitution: findUser.idInstitution } })

    let evaluations = []
    findClasses.map(({ id }) => {
      let evaluationPerClass = await models.evaluation.findAll({ where: { idClass: id } })
      evaluationPerClass.map(item => {
        evaluations.push(item)
      })
    })

    if (evaluations.length === 0) {
      return res.status(404).send({
        error: {
          message: 'Nenhuma avaliação foi encontrada na plataforma'
        }
      })
    }

    res.status(200).send(evaluations)
  } catch (err) {
    logger.error(`Failed to list evaluations - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}

exports.show = async (req, res) => {
  try {
    logger.info(`evaluationController/show - list evaluation by id`)

    const id = req.params.id

    const evaluation = await models.evaluation.findOne({
      include: {
        model: models.schoolcalls,
        as: 'idSchoolCalls_schoolcalls'
      }, where: { id: id }
    })

    if (!evaluation) {
      return res.status(404).send({
        error: {
          message: 'Nenhuma avaliação foi encontrada. Verifique as informações e tente novamente'
        }
      })
    }

    res.status(200).send(evaluation)
  } catch (err) {
    logger.error(`Failed to list evaluation by id - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}

exports.store = async (req, res) => {
  try {
    logger.info(`evaluationController/store - create evaluation`)

    let {
      idUser,
      idClass,
      ra,
      schoolYear,
      situation,
    } = req.body

    ra = normalizer.removeMask(ra)

    if (!idUser || !idClass || !ra || !schoolYear || !situation) {
      return res.status(400).send({
        error: {
          message: 'Faltam dados para o cadastro. Verifique as informações enviadas e tente novamente'
        }
      })
    }

    const findClass = await models.class_.findOne({ where: { id: idClass } })

    const modifyCourses = findClass.classTheme.map(({ name, totalClasses }) => {
      return {
        name,
        totalClasses,
        classesGiven: 0,
        absence: 0
      }
    })

    Object.assign(findClass, { classTheme: modifyCourses });

    const evaluationExists = await models.evaluation.findAll({ where: { ra: ra } })

    if (evaluationExists.length === 0) {
      const newStudent = await models.evaluation.create({
        idUser: idUser,
        ra: ra,
        schoolYear: schoolYear,
        situation: situation,
      })

      await models.studentclasses.create({
        idStudent: newStudent.id,
        idClass: idClass,
        gang: '',
        frequency: findClass.classTheme
      })

      res.status(201).send({
        message: 'Avaliação criada com sucesso',
        newStudent
      })
    } else {
      return res.status(409).send({
        error: {
          message: 'Já existe um usuário na plataforma com o ra informado'
        }
      })
    }

  } catch (err) {
    logger.error(`Failed to create evaluation - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}

exports.update = async (req, res) => {
  try {
    logger.info(`evaluationController/update - update evaluation by id`)

    const id = req.params.id

    const { schoolYear, situation } = req.body

    const findEvaluation = await models.evaluation.findAll({ where: { id: id } })

    if (findEvaluation.length !== 0) {
      await models.evaluation.update({
        schoolYear: schoolYear,
        situation: situation,
      }, { where: { id: id } })

      res.status(200).send(await models.evaluation.findOne({ where: { id: id } }))
    } else {
      res.status(404).send({
        error: {
          message: 'Nenhuma avaliação foi encontrado. Não foi possível concluir a atualização',
        }
      })
    }
  } catch (err) {
    logger.error(`Failed to update evaluation by id - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}