const logger = require('../resources/logger')
const dataValidator = require('../resources/dataValidator')
const initModels = require('../models/init-models')
const db = require('../models/db')
const models = initModels(db)

exports.index = async (req, res) => {
  try {
    logger.info(`InstitutionController/index - list all institutions`)

    const institutions = await models.institution.findAll()

    if (institutions.length === 0) {
      return res.status(404).send({
        error: {
          message: 'Nenhuma instituição foi encontrada na plataforma'
        }
      })
    }

    res.status(200).send(institutions)

  } catch (err) {
    logger.error(`Failed to list institutions - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}

exports.show = async (req, res) => {
  try {
    logger.info(`InstitutionController/show - list institution by id`)

    const id = req.params.id

    const institution = await models.institution.findOne({ where: { id: id } })

    if (!institution) {
      return res.status(404).send({
        error: {
          message: 'Nenhuma instituição foi encontrada. Verifique as informações e tente novamente'
        }
      })
    }

    res.status(200).send(
      institution
    )

  } catch (err) {
    logger.error(`Failed to list institution by id - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}

exports.store = async (req, res) => {
  try {
    logger.info(`InstitutionController/store - create institution`)

    let {
      name,
      cnpj,
      courses,
      phone,
      street,
      number,
      district,
      complement,
      city
    } = req.body

    let findForCNPJ

    try {
      findForCNPJ = await models.institution.findAll({ where: { cnpj: cnpj } })
    } catch (err) {
      logger.error(`Failed to find institution by cnpj ${cnpj} - Error: ${err.message}`)

      return res.status(500).send({
        error: {
          message: 'Ocorreu um erro interno do servidor'
        }
      })
    }

    const isCreated = findForCNPJ.length !== 0 ? true : false;

    if (dataValidator.validateCNPJ(cnpj)) {
      if (!isCreated) {
        const institution = await models.institution.create(complement ?
          {
            name: name,
            cnpj: cnpj,
            courses: courses,
            phone: phone,
            street: street,
            number: number,
            district: district,
            complement: complement,
            city: city
          } : {
            name: name,
            cnpj: cnpj,
            courses: courses,
            phone: phone,
            street: street,
            number: number,
            district: district,
            city: city
          })

        res.status(201).send({
          message: 'Instituição criada com sucesso',
          institution
        })
      } else {
        res.status(409).send({
          error: {
            message: 'CNPJ da instituição já presente no banco',
          }
        })
      }
    } else {
      res.status(400).send({
        error: {
          message: 'CNPJ inválido',
        }
      })
    }

  } catch (err) {
    logger.error(`Failed to create institution - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}

exports.update = async (req, res) => {
  try {
    logger.info(`InstitutionController/update - update institution`)
    const id = req.params.id

    const {
      name,
      cnpj,
      courses,
      phone,
      street,
      number,
      district,
      complement,
      city
    } = req.body

    let findForId

    try {
      findForId = await models.institution.findAll({ where: { id: id } })
    } catch (err) {
      logger.error(`Failed to find institution by id ${id} - Error: ${err.message}`)

      return res.status(500).send({
        error: {
          message: 'Ocorreu um erro interno do servidor'
        }
      })
    }

    const institutionExists = findForId.length !== 0 ? true : false;

    if (institutionExists) {
      await models.institution.update({
        name: name,
        cnpj: cnpj,
        courses: courses,
        phone: phone,
        street: street,
        number: number,
        district: district,
        complement: complement,
        city: city
      }, { where: { id: id } })

      res.status(200).send(await models.institution.findOne({ where: { id: id } }))

    } else {
      logger.error(`Failed to update institution by id ${id} - Error: Institution not exist`)

      res.status(404).send({
        error: {
          message: 'Nenhuma instituição foi encontrada. Não foi possível concluir a atualização'
        }
      })
    }
  } catch (err) {
    logger.error(`Failed to update institution by id - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}

exports.destroy = async (req, res) => {
  try {
    logger.info(`InstitutionController/destroy - delete institution`)
    const id = req.params.id;
    let findForId

    try {
      findForId = await models.institution.findAll({ where: { id: id } })
    } catch (err) {
      logger.error(`Failed to find institution by id ${id} - Error: ${err.message}`)

      return res.status(500).send({
        error: {
          message: 'Ocorreu um erro interno do servidor'
        }
      })
    }

    const institutionExists = findForId.length !== 0 ? true : false;

    if (institutionExists) {
      await models.institution.destroy({ where: { id: id } })

      res.status(200).send({
        message: 'Instituição deletada com sucesso'
      })
    } else {
      return res.status(404).send({
        error: {
          message: 'Instituição não encontrada ou já deletada'
        }
      })
    }
  } catch (err) {
    logger.error(`Failed to delete institution by id - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}