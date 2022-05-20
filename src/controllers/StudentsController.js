const logger = require('../resources/logger')
const initModels = require('../models/init-models')
const db = require('../models/db')
const normalizer = require('../resources/normalizer')
const models = initModels(db)
const jwt = require('jsonwebtoken')

exports.index = async (req, res) => {
  try {
    logger.info(`studentsController/index - list all students`)

    const token = req.headers.authorization.slice(7)
    const tokenDecoded = jwt.decode(token)

    const findUser = await models.users.findOne({ where: { id: tokenDecoded.id } })

    let students = await models.students.findOne({
      include: {
        model: models.users,
        as: 'idUser_user',
        where: {
          idInstitution: findUser.idInstitution
        }
      }
    })

    if (!students) {
      return res.status(404).send({
        error: {
          message: 'Nenhum estudante foi encontrado na plataforma'
        }
      })
    }

    delete students.dataValues.idUser_user

    res.status(200).send(students)
  } catch (err) {
    logger.error(`Failed to list students - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}

exports.show = async (req, res) => {
  try {
    logger.info(`studentsController/show - list student by id`)

    const id = req.params.id

    const students = await models.students.findOne({ where: { id: id } })

    if (!students) {
      return res.status(404).send({
        error: {
          message: 'Nenhum estudante foi encontrado. Verifique as informações e tente novamente'
        }
      })
    }

    res.status(200).send(students)
  } catch (err) {
    logger.error(`Failed to list student by id - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}

exports.store = async (req, res) => {
  try {
    logger.info(`studentsController/store - create student`)

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

    let modifyCourses
    modifyCourses = findClass.classTheme.map(({ name, totalClasses }) => {
      return {
        name,
        totalClasses,
        classesGiven: 0,
        absence: 0
      }
    })

    Object.assign(findClass, { classTheme: modifyCourses });

    const studentExists = await models.students.findAll({ where: { ra: ra } })

    if (studentExists.length === 0) {
      const newStudent = await models.students.create({
        idUser: idUser,
        ra: ra,
        schoolYear: schoolYear,
        situation: situation,
        gang: '',
        frequency: findClass.classTheme
      })

      console.log(newStudent.id)
      console.log(idClass)

      await models.studentclasses.create({
        idStudent: newStudent.id,
        idClass: idClass,
        gang: ''
      })

      res.status(201).send({
        message: 'Estudante criado com sucesso',
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
    logger.error(`Failed to create student - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}

exports.update = async (req, res) => {
  try {
    logger.info(`studentsController/update - update student by id`)

    const id = req.params.id

    const { schoolYear, situation, gang } = req.body

    const findStudent = await models.students.findAll({ where: { id: id } })

    if (findStudent.length !== 0) {
      await models.students.update({
        schoolYear: schoolYear,
        situation: situation,
        gang: gang
      }, { where: { id: id } })

      res.status(200).send(await models.students.findOne({ where: { id: id } }))
    } else {
      res.status(404).send({
        error: {
          message: 'Nenhuma estudante foi encontrado. Não foi possível concluir a atualização',
        }
      })
    }
  } catch (err) {
    logger.error(`Failed to update student by id - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}

exports.destroy = async (req, res) => {
  try {
    logger.info(`studentsController/destroy - delete student by id`)

    const id = req.params.id

    await models.students.destroy({ where: { id: id } })

    res.status(200).send({
      message: 'Estudante deletado com sucesso'
    })
  } catch (err) {
    logger.error(`Failed to delete student by id - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}

exports.updateFrequency = async (req, res) => {
  try {
    logger.info(`studentsController/updateFrequency - making the school call`)

    const id = req.params.id
    let { frequency } = req.body

    const findStudent = await models.students.findOne({ where: { id: id } })

    if (frequency.absence === undefined) {
      frequency = { ...frequency, absence: 0 }
    }

    if (!frequency.classTheme || !frequency.classesGiven) {
      return res.status(400).send({
        error: {
          message: 'Faltam dados para realizar a chamada. Verifique as informações enviadas e tente novamente'
        }
      })
    }

    if (findStudent) {
      const classThemeFrequency = findStudent.frequency.filter(item =>
        (item.name === frequency.classTheme)
      )

      if (classThemeFrequency.length !== 0) {
        classThemeFrequency[0].classesGiven += frequency.classesGiven
        classThemeFrequency[0].absence += frequency.absence

        const updatedFrequency = findStudent.frequency.map(item => {
          return item.name === classThemeFrequency.name ? classThemeFrequency : item
        })

        await models.students.update({
          frequency: updatedFrequency,
        }, { where: { id: id } })

        res.status(200).send(await models.students.findOne({ where: { id: id } }))
      } else {
        res.status(409).send({
          error: {
            message: 'Essa matéria não existe para esse aluno',
          }
        })
      }
    } else {
      res.status(404).send({
        error: {
          message: 'Nenhum aluno foi encontrado. Não foi possível concluir a chamada',
        }
      })
    }
  } catch (err) {
    logger.error(`Failed to update frequency in students - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}