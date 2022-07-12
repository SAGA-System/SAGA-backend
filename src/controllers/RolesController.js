const logger = require('../resources/logger')

const { convertToSlug } = require('../resources/normalizer')

const initModels = require('../models/init-models')
const db = require('../models/db')
const models = initModels(db)

exports.index = async (req, res) => {
  try {
    logger.info(`rolesController/index - list all roles`)

    const roles = await models.roles.findAll()

    if (roles.length === 0) {
      return res.status(404).send({
        error: {
          message: 'Nenhum perfil foi encontrado'
        }
      })
    }

    return res.status(200).send(roles)
  } catch (err) {
    logger.error(`Failed to list roles - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}

exports.store = async (req, res) => {
  try {
    logger.info(`rolesController/store - create role`)

    let { slug, name, description } = req.body

    if (!slug || !name || !description) {
      return res.status(400).send({
        error: {
          message: 'Faltam dados para o cadastro. Verifique as informações enviadas e tente novamente'
        }
      })
    }

    slug = convertToSlug(slug.trim())

    const roles = await models.roles.findAll({ where: { slug: slug } })

    if (roles.length === 0) {
      const permission = await models.roles.create({
        slug: slug,
        name: name,
        description: description
      })

      return res.status(200).send({
        message: "Perfil criado com sucesso!",
        permission
      })
    }
  } catch (err) {
    logger.error(`Failed to add roles - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}

exports.destroy = async (req, res) => {
  try {
    logger.info(`rolesController/delete - delete role`)

    const id = req.params.id

    const roles = await models.roles.findAll({ where: { id: id } })

    if (roles.length !== 0) {
      await models.roles.destroy({ where: { id: id } })

      const roles = await models.roles.findAll()

      return res.status(200).send({
        message: "Perfil deletado com sucesso!",
        roles
      })
    } else {
      return res.status(404).send({
        error: {
          message: 'Perfil não encontrado ou já deletado'
        }
      })
    }
  } catch (err) {
    logger.error(`Failed to delete roles - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}

exports.updatePermissionRole = async (req, res) => {
  try {
    logger.info(`rolesController/updatePermissionRole - add permission in role`)

    const idRole = req.params.idRole
    const idPermission = req.params.idPermission

    if (!idRole || !idPermission) {
      return res.status(400).send({
        error: {
          message: 'Faltam dados relacionar permissões com o Perfil. Verifique as informações enviadas e tente novamente'
        }
      })
    }

    if (!(await models.roles.findOne({ where: { id: idRole } }))) {
      return res.status(404).send({
        error: {
          message: 'O perfil informado não existe. Verifique as informações enviadas e tente novamente'
        }
      })
    }

    if (!(await models.permissions.findOne({ where: { id: idPermission } }))) {
      return res.status(404).send({
        error: {
          message: 'A permissão informada não existe. Verifique as informações enviadas e tente novamente'
        }
      })
    }

    const permissionsRole = await models.permissionsrole.findAll({ where: { idRole: idRole, idPermission: idPermission } })

    if (permissionsRole.length === 0) {
      const permission = await models.permissionsrole.create({
        idRole: Number(idRole),
        idPermission: Number(idPermission)
      })

      return res.status(200).send({
        message: "Relação Perfil/permissão criada com sucesso!",
        permission
      })
    } else {
      return res.status(400).send({
        error: {
          message: 'Já existe uma relação entre a permissão e o perfil informados'
        }
      })
    }
  } catch (err) {
    logger.error(`Failed to add permission in roles - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}

exports.deletePermissionRole = async (req, res) => {
  try {
    logger.info(`rolesController/delete - delete permission in role`)

    const idRole = req.params.idRole
    const idPermission = req.params.idPermission

    const permissionsRole = await models.permissionsrole.findOne({ where: { idRole: idRole, idPermission: idPermission } })

    if (permissionsRole) {
      await models.permissionsrole.destroy({ where: { id: permissionsRole.id } })

      return res.status(200).send({
        message: "Permissão removida do perfil com sucesso!",
      })
    } else {
      return res.status(404).send({
        error: {
          message: 'Relação Perfil/Permissão não encontrado ou já deletado'
        }
      })
    }
  } catch (err) {
    logger.error(`Failed to delete permission in role - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}