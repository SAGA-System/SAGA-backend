const logger = require('../resources/logger')
const initModels = require('../models/init-models')
const db = require('../models/db')
const models = initModels(db)

exports.index = async (req, res) => {
  try {
    logger.info(`studentsController/index - list all students`)
    //await models.students.sync({alter: true})

    const students = await models.students.findAll()

    if (students.length === 0) {
      return res.status(404).send({
        error: {
          message: 'Nenhum estudante foi encontrado na plataforma'
        }
      })
    }

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

    const {
      idUser,
      idClass,
      ra,
      schoolYear,
      situation,
      gang,
    } = req.body

    if (!idUser || !idClass || !ra || !schoolYear || !situation || !gang) {
      return res.status(400).send({
        error: {
          message: 'Faltam dados para o cadastro. Verifique as informações enviadas e tente novamente'
        }
      })
    }

    const newStudent = await models.students.create({
      idUser: idUser,
      idClass: idClass,
      ra: ra,
      schoolYear: schoolYear,
      situation: situation,
      gang: gang,
      frequency: []
    })

    res.status(201).send({
      message: 'Estudante criado com sucesso',
      newStudent
    })

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

    const { schoolYear, situation } = req.body

    const findStudent = await models.students.findAll({ where: { id: id } })

    if (findStudent.length !== 0) {
      await models.students.update({
        schoolYear: schoolYear,
        situation: situation,
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
    logger.info(`studentsController/frequency - making the school call`)

    const id = req.params.id
    const { frequency } = req.body

    const findStudent = await models.students.findOne({ where: { id: id } })

    if (!frequency.classTheme || !frequency.classGiven || !frequency.absence) {
      return res.status(400).send({
        error: {
          message: 'Faltam dados para realizar a chamada. Verifique as informações enviadas e tente novamente'
        }
      })
    }

    if (findStudent) {
      const classThemeFrequency = findStudent.frequency.filter(item =>
        (item.classTheme === frequency.classTheme)
      )

      if (classThemeFrequency) {
        classThemeFrequency.classGiven += frequency.classGiven
        classThemeFrequency.absence += frequency.absence

        const updatedFrequency = findStudent.frequency.map(item => {
          item.classTheme === classThemeFrequency.classTheme ? classThemeFrequency : item
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

exports.updateLessons = async (req, res) => {
  try {
    logger.info(`studentsController/updateLessons - update a lesson from an existing teacher`)

    const id = req.params.id
    const { horaryParams, dayParams } = req.params

    const { lesson } = req.body

    const findStudent = await models.students.findOne({ where: { id: id } })

    if (findStudent) {
      if (findStudent.lessons.filter(({ horary, day }) => horary === horaryParams && day === dayParams).length !== 0) {
        const lessonsUpdated = findStudent.lessons.map(({ classTheme, classroom, horary, day }) => {
          return horary === horaryParams && day === dayParams ? {
            classTheme: (lesson.classTheme) && (classTheme !== lesson.classTheme) ? lesson.classTheme : classTheme,
            classroom: (lesson.classroom) && (classroom !== lesson.classroom) ? lesson.classroom : classroom,
            horary: (lesson.horary) && (horary !== lesson.horary) ? lesson.horary : horary,
            day: (lesson.day) && (day !== lesson.day) ? lesson.day : day
          } : {
            classTheme,
            classroom,
            horary,
            day
          }
        })

        await models.students.update({
          lessons: lessonsUpdated,
        }, { where: { id: id } })

        res.status(200).send(await models.students.findOne({ where: { id: id } }))
      } else {
        res.status(404).send({
          error: {
            message: 'Não existe uma aula com esse professor com as credenciais informadas',
          }
        })
      }
    } else {
      res.status(404).send({
        error: {
          message: 'Nenhum professor foi encontrado. Não foi possível concluir a atualização',
        }
      })
    }
  } catch (err) {
    logger.error(`Failed to update lessons in students - Error: ${err.message}`)
    console.log(err)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}

exports.deleteLessons = async (req, res) => {
  try {
    logger.info(`studentsController/deleteLessons - delete a lesson from an existing teacher`)

    const id = req.params.id
    const { horaryParams, dayParams } = req.params

    const findStudent = await models.students.findOne({ where: { id: id } })

    if (findStudent) {
      let lessonExists = {
        value: false,
        horary: null,
        day: null
      }

      if (findStudent.lessons.filter(({ horary, day }) => horary === horaryParams && day === dayParams).length !== 0) {
        lessonExists = {
          value: true,
          horary: horaryParams,
          day: dayParams
        }
      }

      if (lessonExists.value) {
        const lessonsUpdated = findStudent.lessons.filter(({ horary, day }) => horary !== horaryParams && day !== dayParams)

        await models.students.update({
          lessons: lessonsUpdated,
        }, { where: { id: id } })

        res.status(200).send(await models.students.findOne({ where: { id: id } }))
      } else {
        res.status(404).send({
          error: {
            message: 'Aula não encontrada ou já deletada',
          }
        })
      }
    } else {
      res.status(404).send({
        error: {
          message: 'Nenhum professor foi encontrado. Não foi possível concluir a remoção',
        }
      })
    }
  } catch (err) {
    logger.error(`Failed to delete lessons by id - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}