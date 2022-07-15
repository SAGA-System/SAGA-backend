const jwt = require('jsonwebtoken')

const logger = require('../resources/logger')
const { convertToSlug } = require('../resources/normalizer')

const initModels = require('../models/init-models')
const db = require('../models/db')
const models = initModels(db)

exports.index = async (req, res) => {
  try {
    logger.info(`bulletinController/index - list all evaluations`)

    const token = req.headers.authorization.slice(7)
    const tokenDecoded = jwt.decode(token)

    const findUser = await models.users.findOne({ where: { id: tokenDecoded.id } })

    const bulletins = await models.bulletin.findAll({ where: { idInstitution: findUser.idInstitution } })

    if (bulletins.length === 0) {
      return res.status(404).send({
        error: {
          message: 'Nenhum boletim foi encontrado na plataforma'
        }
      })
    }

    res.status(200).send(bulletins)
  } catch (err) {
    logger.error(`Failed to list bulletins - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}

exports.show = async (req, res) => {
  try {
    logger.info(`bulletinController/show - list evaluation by id`)

    const idStudent = req.params.idStudent

    let bulletin = await models.bulletin.findAll({
      include: {
        model: models.studentclasses,
        as: "idStudentClasses_studentclass",
        where: { idStudent: idStudent }
      }
    })

    for (let b of bulletin) {
      delete b.dataValues.idStudentClasses_studentclass
    }

    if (bulletin.length === 0) {
      return res.status(404).send({
        error: {
          message: 'Nenhum boletim foi encontrado. Verifique as informações e tente novamente'
        }
      })
    }

    res.status(200).send(bulletin)
  } catch (err) {
    logger.error(`Failed to list bulletin by id - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}

exports.store = async (req, res) => {
  try {
    logger.info(`bulletinController/store - create bulletin`)

    let {
      idClass,
      idStudent,
      classTheme
    } = req.body

    if (!idClass || !idStudent || !classTheme) {
      return res.status(400).send({
        error: {
          message: 'Faltam dados para o cadastro. Verifique as informações enviadas e tente novamente'
        }
      })
    }

    const findClass = await models.class_.findOne({ where: { id: idClass } })
    const findStudent = await models.students.findOne({ where: { id: idStudent } })

    if (!findClass) {
      return res.status(404).send({
        error: {
          message: 'A classe informada não existe'
        }
      })
    }

    if (!findStudent) {
      return res.status(404).send({
        error: {
          message: 'O estudante informado não existe'
        }
      })
    }

    const findStudentClasses = await models.studentclasses.findOne({ where: { idStudent: idStudent, idClass: idClass } })

    if (!findStudentClasses) {
      return res.status(404).send({
        error: {
          message: 'O estudante informado não está atribuído a classe informada'
        }
      })
    }

    let classThemeTeachers = []

    for (let { name } of findClass.classTheme) {
      const teacherExists = findClass.teachers.filter(({ classTheme }) => convertToSlug(name) === convertToSlug(classTheme))
      if (teacherExists.length !== 0) {
        if (teacherExists.length > 1) {
          for (let teacher of teacherExists) {
            classThemeTeachers.push({
              classTheme: name,
              teacherId: teacher.id,
              gang: teacher.gang
            })
          }
        } else {
          classThemeTeachers.push({
            classTheme: name,
            teacherId: teacherExists[0].id,
            gang: ''
          })
        }
      }
    }

    let classThemeTeachersNoGang = []
    let errors = []

    for (let teacher of classThemeTeachers) {
      if (!classThemeTeachersNoGang.some(({ classTheme }) => convertToSlug(classTheme) === convertToSlug(teacher.classTheme))) {
        if (!teacher.gang) {
          classThemeTeachersNoGang.push(teacher)
        } else if (classThemeTeachers.filter(({ classTheme }) => classTheme === teacher.classTheme).length !== 2) {
          errors.push('Matéria dividida em turmas mas faltando professores para uma das turmas ou ambas')
        } else {
          classThemeTeachersNoGang.push(teacher)
        }
      }
    }

    if (errors.length !== 0 || (findClass.classTheme.length !== classThemeTeachersNoGang.length)) {
      return res.status(400).send({
        error: {
          message: 'Não é possível gerar o boletim de uma matéria que não possui um professor atribuído a ela',
        }
      })
    }

    if (await models.bulletin.findOne({ where: { idStudentClasses: findStudentClasses.id, classTheme: classTheme } })) {
      return res.status(400).send({
        error: {
          message: 'Já existe um boletim com as informações fornecidas',
        }
      })
    }

    for (let { classTheme: lesson, teacherId, gang } of classThemeTeachers) {
      if ((!gang && convertToSlug(lesson) === convertToSlug(classTheme)) ||
        (
          gang.toUpperCase() === findStudentClasses.gang.toUpperCase() &&
          convertToSlug(lesson) === convertToSlug(classTheme)
        )
      ) {
        const totalClasses = findStudentClasses.frequency.filter(({ name }) =>
          convertToSlug(name) === convertToSlug(classTheme)
        )[0].totalClasses || 0

        const classesGiven = findStudentClasses.frequency.filter(({ name }) =>
          convertToSlug(name) === convertToSlug(classTheme)
        )[0].classesGiven || 0

        const absence = findStudentClasses.frequency.filter(({ name }) =>
          convertToSlug(name) === convertToSlug(classTheme)
        )[0].absence || 0

        const frequency = findStudentClasses.frequency.filter(({ name }) =>
          convertToSlug(name) === convertToSlug(classTheme)
        )[0].frequency || 0

        const newBulletin = await models.bulletin.create({
          idInstitution: findClass.idInstitution,
          idTeacher: teacherId,
          idStudentClasses: findStudentClasses.id,
          classTheme: lesson,
          totalClasses,
          classesGiven,
          absence,
          frequency,
        })

        return res.status(201).send({
          message: 'Avaliação criada com sucesso',
          newBulletin
        })
      }
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
    logger.info(`bulletinController/update - update bulletin by id`)

    const id = req.params.id

    let { grade1Bim, grade2Bim, grade3Bim, grade4Bim, gradeFinal, classGiven, absence } = req.body

    const findBulletin = await models.bulletin.findOne({ where: { id: id } })

    grade1Bim = grade1Bim ? grade1Bim.toUpperCase() : findBulletin.grade1Bim
    grade2Bim = grade2Bim ? grade2Bim.toUpperCase() : findBulletin.grade2Bim
    grade3Bim = grade3Bim ? grade3Bim.toUpperCase() : findBulletin.grade3Bim
    grade4Bim = grade4Bim ? grade4Bim.toUpperCase() : findBulletin.grade4Bim
    gradeFinal = gradeFinal ? gradeFinal.toUpperCase() : findBulletin.gradeFinal

    if (classGiven) {
      if (classGiven > findBulletin.totalClasses) {
        return res.status(400).send({
          error: {
            message: 'O número de aulas dadas não pode ser maior que o número de aulas totais',
          }
        })
      }

      if (!absence) {
        if (classGiven < findBulletin.absence) {
          return res.status(400).send({
            error: {
              message: 'O número de aulas dadas não pode ser menor que o número de faltas atual',
            }
          })
        }
      } else if (absence > classGiven) {
        return res.status(400).send({
          error: {
            message: 'O número de faltas não pode ser maior que o número de aulas dadas',
          }
        })
      }
    } else if (absence) {
      if (absence > findBulletin.classGiven) {
       return res.status(400).send({
          error: {
            message: 'O número de faltas não pode ser maior que o número de aulas dadas atual',
          }
        })
      }
    }

    if (!findBulletin) {
      return res.status(404).send({
        error: {
          message: 'Nenhum boletim foi encontrado. Não foi possível concluir a atualização',
        }
      })
    }

    await models.bulletin.update({
      grade1Bim,
      grade2Bim,
      grade3Bim,
      grade4Bim,
      gradeFinal,
      classGiven,
      absence
    }, { where: { id: id } })

    return res.status(200).send(await models.bulletin.findOne({ where: { id: id } }))
  } catch (err) {
    logger.error(`Failed to update bulletin by id - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}

exports.destroy = async (req, res) => {
  try {
    logger.info(`bulletinController/destroy - delete bulletin`)

    const id = req.params.id;

    const findBulletin = await models.bulletin.findOne({ where: { id: id } })

    if (findBulletin) {
      await models.evaluations.destroy({ where: { id: id } })

      res.status(200).send({
        message: 'Boletim deletado com sucesso'
      })
    } else {
      return res.status(404).send({
        error: {
          message: 'Avaliação não encontrada ou já deletada'
        }
      })
    }
  } catch (err) {
    logger.error(`Failed to delete bulletin by id - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}

exports.assignGrades = async (req, res) => {
  try {
    logger.info(`bulletinController/assignGrades - assign student grades in the assessment`)
    const id = req.params.id;

    const { grades } = req.body

    const findEvaluation = await models.evaluations.findOne({ where: { id: id } })

    if (findEvaluation) {
      const verifyGrades = grades.filter(item => !item.idUser || !item.name)
      if ((grades.length === findEvaluation.grades.length) && (verifyGrades.length === 0)) {
        await models.evaluations.update({
          grades: grades,
        }, { where: { id: id } })

        res.status(200).send(await models.evaluations.findOne({ where: { id: id } }))
      } else {
        res.status(400).send({
          error: {
            message: 'Faltam informações. Não foi possível atribuir as notas',
          }
        })
      }
    } else {
      res.status(404).send({
        error: {
          message: 'Nenhuma avaliação foi encontrada. Não foi possível atribuir as notas',
        }
      })
    }
  } catch (err) {
    logger.error(`Failed to assign student grades - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}