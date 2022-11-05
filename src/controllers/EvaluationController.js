const jwt = require('jsonwebtoken')

const logger = require('../resources/logger')

const initModels = require('../models/init-models')
const db = require('../models/db')
const models = initModels(db)

exports.index = async (req, res) => {
  try {
    logger.info(`evaluationController/index - list all evaluations`)

    const { bimester, idTeacher, classTheme } = req.query

    const tokenDecoded = jwt.decode(req.headers.authorization.slice(7))

    const findUser = await models.users.findOne({ where: { id: tokenDecoded.id } })

    let options = {
      include: {
        model: models.schoolcalls,
        as: 'idSchoolCall_schoolcall',
        include: {
          model: models.class_,
          as: 'idClass_class',
          where: {
            idInstitution: findUser.idInstitution
          }
        }
      }
    }

    if (bimester) {
      options = {
        include: {
          ...options.include,
          where: {
            ...options.include.where,
            bimester: bimester
          }
        }
      }
    }

    if (idTeacher) {
      options = {
        include: {
          ...options.include,
          where: {
            ...options.include.where,
            idTeacher: idTeacher
          }
        }
      }
    }

    if (classTheme) {
      options = {
        include: {
          ...options.include,
          where: {
            ...options.include.where,
            classTheme: classTheme
          }
        }
      }
    }

    const evaluations = await models.evaluations.findAll(options)

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

    let evaluation = await models.evaluations.findOne({
      include: {
        model: models.schoolcalls,
        as: 'idSchoolCall_schoolcall'
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
      idSchoolCall,
      description,
      method,
      instruments
    } = req.body

    if (!idSchoolCall || !description || !method || !instruments) {
      return res.status(400).send({
        error: {
          message: 'Faltam dados para o cadastro. Verifique as informações enviadas e tente novamente'
        }
      })
    }

    const findSchoolCall = await models.schoolcalls.findOne({ where: { id: idSchoolCall } })

    if (!findSchoolCall) {
      return res.status(400).send({
        error: {
          message: 'A aula informada não foi encontrada'
        }
      })
    }

    const students = await models.studentclasses.findAll({
      include: {
        model: models.students,
        as: 'idStudent_student',
        include: {
          model: models.users,
          as: 'idUser_user'
        }
      },
      where: { idClass: findSchoolCall.idClass }
    })

    const evaluatedStudents = students.map(({ idStudent_student }) => {
      return {
        idUser: idStudent_student.idUser,
        name: idStudent_student.idUser_user.name,
        grade: ''
      }
    })

    const evaluationExists = await models.evaluations.findAll({
      where: {
        idSchoolCall: idSchoolCall,
        method: method,
        instruments: instruments
      }
    })

    if (evaluationExists.length === 0) {
      const newEvaluation = await models.evaluations.create({
        idSchoolCall: idSchoolCall,
        description: findSchoolCall.description !== description ? description : findSchoolCall.description,
        method: method,
        instruments: instruments,
        grades: evaluatedStudents
      })

      res.status(201).send({
        message: 'Avaliação criada com sucesso',
        newEvaluation
      })
    } else {
      return res.status(409).send({
        error: {
          message: 'Já existe uma avaliação na plataforma com as credenciais informadas'
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

    const { description, method, instruments } = req.body

    const findEvaluation = await models.evaluations.findAll({ where: { id: id } })

    if (findEvaluation.length !== 0) {
      await models.evaluations.update({
        description: description,
        method: method,
        instruments: instruments,
      }, { where: { id: id } })

      res.status(200).send(await models.evaluations.findOne({ where: { id: id } }))
    } else {
      res.status(404).send({
        error: {
          message: 'Nenhuma avaliação foi encontrada. Não foi possível concluir a atualização',
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

exports.destroy = async (req, res) => {
  try {
    logger.info(`evaluationController/destroy - delete evaluation`)
    const id = req.params.id;

    const findEvaluation = await models.evaluations.findAll({ where: { id: id } })

    if (findEvaluation.length !== 0) {
      await models.evaluations.destroy({ where: { id: id } })

      res.status(200).send({
        message: 'Avaliação deletada com sucesso'
      })
    } else {
      return res.status(404).send({
        error: {
          message: 'Avaliação não encontrada ou já deletada'
        }
      })
    }
  } catch (err) {
    logger.error(`Failed to delete evaluation by id - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}

exports.assignGrades = async (req, res) => {
  try {
    logger.info(`evaluationController/assignGrades - assign student grades in the assessment`)
    const id = req.params.id;

    const { grades } = req.body

    const findEvaluation = await models.evaluations.findOne({ where: { id: id } })

    if (!findEvaluation) {
      return res.status(404).send({
        error: {
          message: 'Nenhuma avaliação foi encontrada. Não foi possível atribuir as notas',
        }
      })
    }

    const verifyGrades = grades.filter(item => !item.idUser || !item.grade)

    if (verifyGrades.length > 0) {
      return res.status(400).send({
        error: {
          message: 'Faltam informações. Não foi possível atribuir as notas',
        }
      })
    }

    for (let i = 0; i < grades.length; i++) {
      if (grades[i].idUser) {
        const user = await models.users.findOne({ where: { id: grades[i].idUser } })

        grades[i] = {
          idUser: grades[i].idUser,
          name: user.name,
          grade: grades[i].grade.toUpperCase()
        }
      }
    }

    if (grades.length === findEvaluation.grades.length) {
      await models.evaluations.update({
        grades: grades,
      }, { where: { id: id } })

      return res.status(200).send(await models.evaluations.findOne({ where: { id: id } }))
    } else {
      return res.status(400).send({
        error: {
          message: 'Existem alunos sem nota definida. Não foi possível atribuir as menções',
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