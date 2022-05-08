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
      phone,
      street,
      number,
      district,
      complement,
      city
    } = req.body

    const findForCNPJ = await models.institution.findAll({ where: { cnpj: cnpj } })

    if (dataValidator.validateCNPJ(cnpj)) {
      if (findForCNPJ.length === 0) {
        const institution = await models.institution.create({
          name: name,
          cnpj: cnpj,
          phone: phone,
          courses: [],
          street: street,
          number: number,
          district: district,
          complement: complement,
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
      phone,
      street,
      number,
      district,
      complement,
      city
    } = req.body

    const findForId = await models.institution.findAll({ where: { id: id } })

    if (findForId.length !== 0) {
      await models.institution.update({
        name: name,
        cnpj: cnpj,
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

    const findForId = await models.institution.findAll({ where: { id: id } })

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

exports.addCourses = async (req, res) => {
  try {
    logger.info(`InstitutionController/addCourses - add courses to existing institution`)

    const id = req.params.id
    const { courses } = req.body

    const findInstitution = await models.institution.findOne({ where: { id: id } })

    if (!courses.name || !courses.lessonsPerDay || !courses.period || !courses.classTheme) {
      return res.status(400).send({
        error: {
          message: 'Faltam dados para o cadastro. Verifique as informações enviadas e tente novamente'
        }
      })
    }

    let lessons = {
      Monday: {},
      Tuesday: {},
      Wednesday: {},
      Thursday: {},
      Friday: {},
      Saturday: {},
    }

    for (let i = 0; i < courses.lessonsPerDay; i++) {
      lessons.Monday[i + 1] = ""
      lessons.Tuesday[i + 1] = ""
      lessons.Wednesday[i + 1] = ""
      lessons.Thursday[i + 1] = ""
      lessons.Friday[i + 1] = ""
      lessons.Saturday[i + 1] = ""
    }

    Object.assign(courses, {lessons: lessons});

    if (findInstitution) {
      let courseExistsInInstitution = false

      for (let i = 0; i < findInstitution.courses.length; i++) {
        if (
          (findInstitution.courses[i].name === courses.name) &&
          (findInstitution.courses[i].period === courses.period) &&
          (Object.values(findInstitution.courses[i].lessons.Monday).length === courses.lessonsPerDay)
        ) {
          courseExistsInInstitution = true
        }
      }

      if (!courseExistsInInstitution) {
        delete courses.lessonsPerDay
        findInstitution.courses.push(courses)

        await models.institution.update({
          courses: findInstitution.courses,
        }, { where: { id: id } })

        res.status(200).send(await models.institution.findOne({ where: { id: id } }))
      } else {
        res.status(409).send({
          error: {
            message: 'Já existe um curso nessa instituição com as informações fornecidas',
          }
        })
      }
    } else {
      res.status(404).send({
        error: {
          message: 'Nenhuma instituição foi encontrada. Não foi possível concluir o cadastro',
        }
      })
    }
  } catch (err) {
    logger.error(`Failed to add courses in institution - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}

exports.updateCourse = async (req, res) => {
  try {
    logger.info(`InstitutionController/updateCourse - update a course from an existing institution`)

    const id = req.params.id
    const indexCourse = req.params.indexCourse

    const { course } = req.body

    const findInstitution = await models.institution.findOne({ where: { id: id } })

    if (findInstitution) {
      if (findInstitution.courses.filter((_, index) => index === Number(indexCourse)).length !== 0) {
        const coursesUpdated = findInstitution.courses.map(({ classTheme, name, lessons, period }, index) => {
          return index === Number(indexCourse) ? {
            lessons,
            name: (course.name) && (name !== course.name) ? course.name : name,
            period: (course.period) && (period !== course.period) ? course.period : period,
            classTheme: (course.classTheme) && (JSON.stringify(classTheme) !== JSON.stringify(course.classTheme)) ? course.classTheme : classTheme
          } : {
            name,
            period,
            lessons,
            classTheme
          }
        })

        await models.institution.update({
          courses: coursesUpdated,
        }, { where: { id: id } })

        res.status(200).send(await models.institution.findOne({ where: { id: id } }))
      } else {
        res.status(404).send({
          error: {
            message: 'Não existe um curso nessa instituição com as credenciais informadas',
          }
        })
      }
    } else {
      res.status(404).send({
        error: {
          message: 'Nenhuma instituição foi encontrada. Não foi possível concluir a atualização',
        }
      })
    }
  } catch (err) {
    logger.error(`Failed to update courses in institution - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}

exports.deleteCourse = async (req, res) => {
  try {
    logger.info(`InstitutionController/deleteCourse - delete a course from an existing institution`)

    const id = req.params.id
    const indexCourse = req.params.indexCourse

    const findInstitution = await models.institution.findOne({ where: { id: id } })

    if (findInstitution) {
      let courseExists = {
        value: false,
        index: null
      }

      if(findInstitution.courses.filter((_, index) => index === Number(indexCourse)).length !== 0) {
        courseExists = {
          value: true,
          index: indexCourse
        }
      }

      if (courseExists.value) {
        const coursesUpdated = findInstitution.courses.filter((_, index) => index !== Number(indexCourse))

        await models.institution.update({
          courses: coursesUpdated,
        }, { where: { id: id } })

        res.status(200).send(await models.institution.findOne({ where: { id: id } }))
      } else {
        res.status(404).send({
          error: {
            message: 'Curso não encontrado ou já deletado',
          }
        })
      }
    } else {
      res.status(404).send({
        error: {
          message: 'Nenhuma instituição foi encontrada. Não foi possível concluir a remoção',
        }
      })
    }
  } catch (err) {
    logger.error(`Failed to delete course by id - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}