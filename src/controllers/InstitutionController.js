const logger = require('../resources/logger')
const dataValidator = require('../resources/dataValidator')
const { convertToSlug } = require('../resources/normalizer')

const api = require('../../config/api')

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
          bimDates: [],
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

    if (courses.classTheme.map((item) =>
      item.map(({ name, totalClasses }) => name && totalClasses ? true : false).includes(false)
    ).includes(true)) {
      return res.status(400).send({
        error: {
          message: 'Faltam campos no cadastro das matérias do curso. Verifique as informações enviadas e tente novamente'
        }
      })
    }

    if (findInstitution) {
      let courseNameExists = false;
      let courseDataExists = false

      for (let c of findInstitution.courses) {
        if (convertToSlug(c.name) === convertToSlug(courses.name)) {
          courseNameExists = true
        }

        if (
          (convertToSlug(c.name) === convertToSlug(courses.name)) &&
          (convertToSlug(c.period) === convertToSlug(courses.period)) &&
          (c.lessonsPerDay === courses.lessonsPerDay)
        ) {
          courseDataExists = true
        }
      }

      if (!courseDataExists) {
        if (!courseNameExists) {
          findInstitution.courses.push(courses)

          await models.institution.update({
            courses: findInstitution.courses,
          }, { where: { id: id } })

          res.status(200).send(await models.institution.findOne({ where: { id: id } }))
        } else {
          res.status(409).send({
            error: {
              message: 'Já existe um curso nessa instituição com o nome fornecido',
            }
          })
        }
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
  let coursesBeforeUpdate
  const id = req.params.id

  try {
    logger.info(`InstitutionController/updateCourse - update a course from an existing institution`)

    const indexCourse = req.params.indexCourse

    const token = req.headers.authorization

    const { course } = req.body

    const findInstitution = await models.institution.findOne({ where: { id: id } })

    coursesBeforeUpdate = findInstitution.courses

    if (course.classTheme && course.classTheme.map((item) =>
      item.map(({ name, totalClasses }) => name && totalClasses ? true : false).includes(false)
    ).includes(true)) {
      return res.status(400).send({
        error: {
          message: 'Faltam campos na edição das matérias do curso. Verifique as informações enviadas e tente novamente'
        }
      })
    }

    if (findInstitution) {
      if (findInstitution.courses.filter((_, index) => index === Number(indexCourse)).length !== 0) {
        const coursesUpdated = findInstitution.courses.map(({ classTheme, name, lessonsPerDay, period }, index) => {
          return index === Number(indexCourse) ? {
            name: (course.name) && (name !== course.name) ? course.name : name,
            period: (course.period) && (period !== course.period) ? course.period : period,
            lessonsPerDay: (course.lessonsPerDay) && (lessonsPerDay !== course.lessonsPerDay) ? course.lessonsPerDay : lessonsPerDay,
            classTheme: (course.classTheme) && (JSON.stringify(classTheme) !== JSON.stringify(course.classTheme)) ? course.classTheme : classTheme
          } : {
            name,
            period,
            lessonsPerDay,
            classTheme
          }
        })

        await models.institution.update({
          courses: coursesUpdated,
        }, { where: { id: id } })

        const updatedInstitution = await models.institution.findOne({ where: { id: id } })
        const Classes = await models.class_.findAll({ where: { idInstitution: id } })

        const ids = Classes.filter((item) => convertToSlug(item.dataValues.course) === convertToSlug(findInstitution.courses[indexCourse].name))

        let errors = []

        for (let classData of ids) {
          await api.put(`/class/${classData.id}`, {
            course: updatedInstitution.courses[indexCourse].name,
            period: updatedInstitution.courses[indexCourse].period
          }, { headers: { authorization: token } }).catch(err => {
            logger.error(`Failed to update course of class - Error: ${err?.response?.data?.error?.message || err.message}`)

            errors.push(err?.response?.data?.error?.message || err.message)
          });
        }

        if (errors.length > 0) {
          await models.institution.update({
            courses: findInstitution.courses
          }, { where: { id: id } })

          return res.status(500).send({
            error: {
              message: 'Ocorreu um erro interno do servidor'
            }
          })
        }

        res.status(200).send(updatedInstitution)
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
    await models.institution.update({
      courses: coursesBeforeUpdate
    }, { where: { id: id } })

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

    const token = req.headers.authorization

    const findInstitution = await models.institution.findOne({ where: { id: id } })

    if (findInstitution) {
      let courseExists = {
        value: false,
        index: null
      }

      if (findInstitution.courses.filter((_, index) => index === Number(indexCourse)).length !== 0) {
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

        const Classes = await models.class_.findAll({ where: { idInstitution: id } })

        const ids = Classes.filter((item) => convertToSlug(item.dataValues.course) === convertToSlug(findInstitution.courses[indexCourse].name))

        let errors = []

        for (let classData of ids) {
          await api.delete(`/class/${classData.id}`, { headers: { authorization: token } }).catch(err => {
            logger.error(`Failed to update course of class - Error: ${err?.response?.data?.error?.message || err.message}`)

            errors.push(err?.response?.data?.error?.message || err.message)
          });
        }

        if (errors.length > 0) {
          await models.institution.update({
            courses: findInstitution.courses
          }, { where: { id: id } })

          return res.status(500).send({
            error: {
              message: 'Ocorreu um erro interno do servidor'
            }
          })
        }

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

exports.addBimesters = async (req, res) => {
  try {
    logger.info(`InstitutionController/addBimesters - add bimesters to existing institution`)

    const id = req.params.id
    const { bimesters } = req.body

    const findInstitution = await models.institution.findOne({ where: { id: id } })

    if (
      !bimesters.year ||
      !bimesters.firstBim.startDate ||
      !bimesters.firstBim.endDate ||
      !bimesters.secondBim.startDate ||
      !bimesters.secondBim.endDate ||
      !bimesters.thirdBim.startDate ||
      !bimesters.thirdBim.endDate ||
      !bimesters.fourthBim.startDate ||
      !bimesters.fourthBim.endDate
    ) {
      return res.status(400).send({
        error: {
          message: 'Faltam dados para o cadastro. Verifique as informações enviadas e tente novamente'
        }
      })
    }

    if (new Date(bimesters.firstBim.startDate) >= new Date(bimesters.firstBim.endDate) ||
      new Date(bimesters.firstBim.endDate) > new Date(bimesters.secondBim.startDate) ||
      new Date(bimesters.secondBim.startDate) >= new Date(bimesters.secondBim.endDate) ||
      new Date(bimesters.secondBim.endDate) > new Date(bimesters.thirdBim.startDate) ||
      new Date(bimesters.thirdBim.startDate) >= new Date(bimesters.thirdBim.endDate) ||
      new Date(bimesters.thirdBim.endDate) > new Date(bimesters.fourthBim.startDate) ||
      new Date(bimesters.fourthBim.startDate) >= new Date(bimesters.fourthBim.endDate)
    ) {
      return res.status(400).send({
        error: {
          message: 'As datas de inicio de bimestre devem ser menores que as de fim de bimestre'
        }
      })
    }

    if (findInstitution) {
      if (findInstitution.bimDates.filter(({ year }) => year === bimesters.year && year).length === 0) {
        findInstitution.bimDates.push(bimesters)

        await models.institution.update({
          bimDates: findInstitution.bimDates,
        }, { where: { id: id } })

        res.status(200).send(await models.institution.findOne({ where: { id: id } }))
      } else {
        res.status(409).send({
          error: {
            message: 'Já existem bimestres cadastrados no ano informado',
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
    logger.error(`Failed to add bimesters in institution - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}

exports.updateBimesters = async (req, res) => {
  try {
    logger.info(`InstitutionController/updateBimesters - update a bimester from an existing institution`)

    const id = req.params.id
    const yearToEdit = req.params.year

    const { bimester } = req.body

    const findInstitution = await models.institution.findOne({ where: { id: id } })

    if (findInstitution) {
      if (findInstitution.bimDates.filter(({ year }) => Number(year) === Number(yearToEdit)).length !== 0) {
        const bimestersUpdated = findInstitution.bimDates.map(({ firstBim, secondBim, thirdBim, fourthBim, year }) => {
          console.log(fourthBim.startDate !== bimester.fourthBim.startDate)

          return Number(year) === Number(yearToEdit) ? {
            year,
            firstBim: {
              startDate: (bimester.firstBim && (firstBim.startDate !== bimester.firstBim.startDate)) ? bimester.firstBim.startDate : firstBim.startDate,
              endDate: (bimester.firstBim && (firstBim.endDate !== bimester.firstBim.endDate)) ? bimester.firstBim.endDate : firstBim.endDate,
            },
            secondBim: {
              startDate: (bimester.secondBim && (secondBim.startDate !== bimester.secondBim.startDate)) ? bimester.secondBim.startDate : secondBim.startDate,
              endDate: (bimester.secondBim && (secondBim.endDate !== bimester.secondBim.endDate)) ? bimester.secondBim.endDate : secondBim.endDate,
            },
            thirdBim: {
              startDate: (bimester.thirdBim && (thirdBim.startDate !== bimester.thirdBim.startDate)) ? bimester.thirdBim.startDate : thirdBim.startDate,
              endDate: (bimester.thirdBim && (thirdBim.endDate !== bimester.thirdBim.endDate)) ? bimester.thirdBim.endDate : thirdBim.endDate,
            },
            fourthBim: {
              startDate: (bimester.fourthBim && (fourthBim.startDate !== bimester.fourthBim.startDate)) ? bimester.fourthBim.startDate : fourthBim.startDate,
              endDate: (bimester.fourthBim && (fourthBim.endDate !== bimester.fourthBim.endDate)) ? bimester.fourthBim.endDate : fourthBim.endDate,
            },
          } : {
            year,
            firstBim,
            secondBim,
            thirdBim,
            fourthBim
          }
        })

        await models.institution.update({
          bimDates: bimestersUpdated,
        }, { where: { id: id } })

        res.status(200).send(await models.institution.findOne({ where: { id: id } }))
      } else {
        res.status(404).send({
          error: {
            message: 'Não existem bimestres nessa instituição para o ano informado',
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
    logger.error(`Failed to update bimesters in institution - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}