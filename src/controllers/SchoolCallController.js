const jwt = require('jsonwebtoken')

const logger = require('../resources/logger')

const initModels = require('../models/init-models')
const db = require('../models/db')
const models = initModels(db)

const { Op } = require("sequelize");

exports.index = async (req, res) => {
  try {
    logger.info(`schoolCallController/index - list all school calls`)

    const filters = req.query

    const tokenDecoded = jwt.decode(req.headers.authorization.slice(7))

    const findUser = await models.users.findOne({ where: { id: tokenDecoded.id } })

    let schoolCalls

    if (filters) {
      const parsedFilters = {};
      for (const key in filters) {
        if (['classTheme', 'idTeacher'].includes(key)) {
          parsedFilters[key] = {
            [Op.substring]: filters[key]
          };
        } else {
          parsedFilters[key] = filters[key]
        }
      }

      schoolCalls = await models.schoolcalls.findAll({
        include: {
          model: models.class_,
          as: 'idClass_class',
          where: {
            idInstitution: findUser.idInstitution
          }
        }, where: parsedFilters
      })
    } else {
      schoolCalls = await models.schoolcalls.findAll({
        include: {
          model: models.class_,
          as: 'idClass_class',
          where: {
            idInstitution: findUser.idInstitution
          }
        }
      })
    }

    if (schoolCalls.length === 0) {
      return res.status(404).send({
        error: {
          message: 'Nenhuma aula foi encontrada na plataforma'
        }
      })
    }

    for (let data of schoolCalls) {
      delete data.dataValues.idClass_class
    }

    res.status(200).send(schoolCalls)
  } catch (err) {
    logger.error(`Failed to list school calls - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}

exports.show = async (req, res) => {
  try {
    logger.info(`schoolCallController/show - list evaluation by id`)

    const id = req.params.id

    let schoolCalls = await models.schoolcalls.findOne({
      where: { id: id }
    })

    if (!schoolCalls) {
      return res.status(404).send({
        error: {
          message: 'Nenhuma aula foi encontrada. Verifique as informações e tente novamente'
        }
      })
    }

    res.status(200).send(schoolCalls)
  } catch (err) {
    logger.error(`Failed to list school calls by id - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}

exports.update = async (req, res) => {
  try {
    logger.info(`schoolCallController/update - update school call by id`)

    const id = req.params.id

    const { description } = req.body

    const findSchoolCall = await models.schoolcalls.findOne({ where: { id: id } })

    if (findSchoolCall) {
      await models.schoolcalls.update({
        description: description,
      }, { where: { id: id } })

      res.status(200).send(await models.schoolcalls.findOne({ where: { id: id } }))
    } else {
      res.status(404).send({
        error: {
          message: 'Nenhuma aula foi encontrada. Não foi possível concluir a atualização',
        }
      })
    }
  } catch (err) {
    logger.error(`Failed to update school call by id - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}