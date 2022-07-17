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

    let { grade1Bim, grade2Bim, grade3Bim, grade4Bim, gradeFinal, classesGiven, absence } = req.body

    const findBulletin = await models.bulletin.findOne({ where: { id: id } })

    grade1Bim = grade1Bim ? grade1Bim.toUpperCase() : findBulletin.grade1Bim
    grade2Bim = grade2Bim ? grade2Bim.toUpperCase() : findBulletin.grade2Bim
    grade3Bim = grade3Bim ? grade3Bim.toUpperCase() : findBulletin.grade3Bim
    grade4Bim = grade4Bim ? grade4Bim.toUpperCase() : findBulletin.grade4Bim
    gradeFinal = gradeFinal ? gradeFinal.toUpperCase() : findBulletin.gradeFinal

    if (classesGiven) {
      if (classesGiven > findBulletin.totalClasses) {
        return res.status(400).send({
          error: {
            message: 'O número de aulas dadas não pode ser maior que o número de aulas totais',
          }
        })
      }

      if (!absence) {
        if (classesGiven < findBulletin.absence) {
          return res.status(400).send({
            error: {
              message: 'O número de aulas dadas não pode ser menor que o número de faltas atual',
            }
          })
        }
      } else if (absence > classesGiven) {
        return res.status(400).send({
          error: {
            message: 'O número de faltas não pode ser maior que o número de aulas dadas',
          }
        })
      }
    } else if (absence) {
      if (absence > findBulletin.classesGiven) {
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
      classesGiven,
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
      await models.bulletin.destroy({ where: { id: id } })

      res.status(200).send({
        message: 'Boletim deletado com sucesso'
      })
    } else {
      return res.status(404).send({
        error: {
          message: 'Boletim não encontrado ou já deletado'
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
    logger.info(`bulletinController/assignGrades - assign bimester grades`)

    const { bimester, classTheme, grades } = req.body

    if (!bimester || !classTheme || !grades) {
      return res.status(400).send({
        error: {
          message: 'Faltam dados para o cadastro. Verifique as informações enviadas e tente novamente'
        }
      })
    }

    if (![1, 2, 3, 4, 'final'].includes(bimester) || grades.length === 0) {
      return res.status(400).send({
        error: {
          message: 'O bimestre informado não é válido'
        }
      })
    }

    for (let grade of grades) {
      if (!grade.idStudentClasses || !grade.grade) {
        return res.status(400).send({
          error: {
            message: 'Faltam dados para o cadastro. Verifique as informações enviadas e tente novamente'
          }
        })
      }

      const findStudentClasses = await models.studentclasses.findOne({ where: { id: grade.idStudentClasses } })

      if (!findStudentClasses) {
        return res.status(404).send({
          error: {
            message: 'Existem alunos informados que não estão relacionados a essa classe'
          }
        })
      }

      const findBulletin = await models.bulletin.findOne({ where: { idStudentClasses: grade.idStudentClasses, classTheme: classTheme } })

      if (!findBulletin) {
        return res.status(404).send({
          error: {
            message: 'Existem alunos informados que ainda não possui um boletim gerado para essa matéria'
          }
        })
      }
    }

    for (let grade of grades) {
      const data = bimester === 1 ? {
        grade1Bim: grade.grade.toUpperCase()
      } : bimester === 2 ? {
        grade2Bim: grade.grade.toUpperCase()
      } : bimester === 3 ? {
        grade3Bim: grade.grade.toUpperCase()
      } : bimester === 4 ? {
        grade4Bim: grade.grade.toUpperCase()
      } : bimester === 'final' ? {
        gradeFinal: grade.grade.toUpperCase()
      } : undefined

      await models.bulletin.update(data, {
        where: {
          idStudentClasses: grade.idStudentClasses,
          classTheme: classTheme
        }
      })
    }

    return res.status(200).send({ message: 'Notas atribuídas com sucesso' })
  } catch (err) {
    logger.error(`Failed to assign bimester grades - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}

exports.bimesterAssessments = async (req, res) => {

}