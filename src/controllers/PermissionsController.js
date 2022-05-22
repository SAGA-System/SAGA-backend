const logger = require('../resources/logger')

const initModels = require('../models/init-models')
const db = require('../models/db')
const models = initModels(db)

exports.index = async (req, res) => {
  try {
    logger.info(`permissionsController/index - list all permissions`)

    const permissions = await models.permissions.findAll()

    if (permissions.length === 0) {
      return res.status(404).send({
        error: {
          message: 'Nenhuma permissão foi encontrada'
        }
      })
    }

    return res.status(200).send(permissions)
  } catch (err) {
    logger.error(`Failed to list permissions - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}

exports.store = async (req, res) => {
  try {
    logger.info(`permissionsController/store - create permission`)

    let { type, description } = req.body

    if (!type || !description) {
      return res.status(400).send({
        error: {
          message: 'Faltam dados para o cadastro. Verifique as informações enviadas e tente novamente'
        }
      })
    }

    type = type.toUpperCase().trim().replace(/ {1,}/g, '_')

    const permissions = await models.permissions.findAll({ where: { type: type } })

    if (permissions.length === 0) {
      const permission = await models.permissions.create({
        type: type,
        description: description
      })

      return res.status(200).send({
        message: "Permissão criada com sucesso!",
        permission
      })
    }
  } catch (err) {
    logger.error(`Failed to add permission - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}