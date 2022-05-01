const logger = require('../resources/logger')
const initModels = require('../models/init-models')
const db = require('../models/db') 
const models = initModels(db)

exports.index = async (req, res) => {
  try {
    logger.info(`TeachersController/index - list all teachers`)
    //await models.teachers.sync({alter: true})

    const teachers = await models.teachers.findAll()

    if (teachers.length === 0) {
      return res.status(404).send({
        error: {
          message: 'Nenhum professor foi encontrado na plataforma'
        }
      })
    }

    res.status(200).send(teachers)
  } catch (err) {
    logger.error(`Failed to list teachers - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}

exports.show = async (req, res) => {
  try {
    logger.info(`TeachersController/show - list teacher by id`)

    const id = req.params.id

    const teachers = await models.teachers.findOne({ where: { id: id } })

    if (!teachers) {
      return res.status(404).send({
        error: {
          message: 'Nenhum professor foi encontrado. Verifique as informações e tente novamente'
        }
      })
    }

    res.status(200).send(teachers)
  } catch (err) {
    logger.error(`Failed to list teacher by id - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}

exports.store = async (req, res) => {
  try {
    logger.info(`TeachersController/store - create teacher`)

    const {
      idUser,
      speciality
    } = req.body

    if (!idUser || !speciality) {
      return res.status(400).send({
        error: {
          message: 'Faltam dados para o cadastro. Verifique as informações enviadas e tente novamente'
        }
      })
    }

    const newTeacher = await models.teachers.create({
      idUser: idUser,
      speciality: speciality,
      lessons: []
    })

    res.status(201).send({
      message: 'Professor criado com sucesso',
      newTeacher
    })

  } catch (err) {
    logger.error(`Failed to create teacher - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}

exports.update = async (req, res) => {
  try {
    logger.info(`TeachersController/update - update teacher by id`)

    const id = req.params.id

    const { speciality } = req.body

    const findTeacher = await models.teachers.findAll({ where: { id: id } })

    if (findTeacher.length !== 0) {
      await models.teachers.update({
        speciality: speciality,
      }, {
        where: {
          id: id
        }
      })

      res.status(200).send(await models.teachers.findOne({ where: { id: id } }))
    } else {
      res.status(404).send({
        error: {
          message: 'Nenhuma Professor foi encontrado. Não foi possível concluir a atualização',
        }
      })
    }
  } catch (err) {
    logger.error(`Failed to update teacher by id - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}

exports.destroy = async (req, res) => {
  try {
    logger.info(`TeachersController/destroy - delete teacher by id`)

    const id = req.params.id

    await models.teachers.destroy({ where: { id: id } })

    res.status(200).send({
      message: 'Professor deletado com sucesso'
    })
  } catch (err) {
    logger.error(`Failed to delete teacher by id - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}

exports.addLessons = async (req, res) => {
  try {
    logger.info(`TeachersController/addLessons - add lessons to existing teacher`)

    const id = req.params.id
    const { lessons } = req.body

    const findTeacher = await models.teachers.findOne({ where: { id: id } })

    if (!lessons.classTheme || !lessons.horary || !lessons.classroom || !lessons.day || !lessons.gang) {
      return res.status(400).send({
        error: {
          message: 'Faltam dados para o cadastro. Verifique as informações enviadas e tente novamente'
        }
      })
    }

    if (findTeacher) {
      const lessonExists = findTeacher.lessons.filter(item => 
        (item.horary === lessons.horary) && (item.day === lessons.day)
      ).length === 0 ? false : true

      if (!lessonExists) {
        findTeacher.lessons.push(lessons)

        await models.teachers.update({
          lessons: findTeacher.lessons,
        }, { where: { id: id } })

        res.status(200).send(await models.teachers.findOne({ where: { id: id } }))
      } else {
        res.status(409).send({
          error: {
            message: 'Esse professor já possui uma aula no horário e dia informados',
          }
        })
      }
    } else {
      res.status(404).send({
        error: {
          message: 'Nenhum professor foi encontrado. Não foi possível concluir o cadastro',
        }
      })
    }
  } catch (err) {
    logger.error(`Failed to add lessons in teachers - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}

exports.updateLessons = async (req, res) => {
  try {
    logger.info(`TeachersController/updateLessons - update a lesson from an existing teacher`)

    const id = req.params.id
    const {horaryParams, dayParams} = req.params

    const { lesson } = req.body

    const findTeacher = await models.teachers.findOne({ where: { id: id } })

    if (findTeacher) {
      if (findTeacher.lessons.filter(({horary, day}) => horary === horaryParams && day === dayParams).length !== 0) {
        const lessonsUpdated = findTeacher.lessons.map(({ classTheme, classroom, horary, day }) => {
          return horary === horaryParams && day === dayParams ? {
            classTheme: (lesson.classTheme) && (classTheme !== lesson.classTheme) ? lesson.classTheme : classTheme,
            classroom: (lesson.classroom) && (classroom !== lesson.classroom) ? lesson.classroom : classroom,
            horary: (lesson.horary) && (horary !== lesson.horary) ? lesson.horary : horary,
            day: (lesson.day) && (day !== lesson.day) ? lesson.day : day,
            gang: (lesson.gang) && (gang !== lesson.gang) ? lesson.gang : gang,
          } : {
            classTheme, 
            classroom, 
            horary, 
            day,
            gang
          }
        })

        await models.teachers.update({
          lessons: lessonsUpdated,
        }, { where: { id: id } })

        res.status(200).send(await  models.teachers.findOne({ where: { id: id } }))
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
    logger.error(`Failed to update lessons in teachers - Error: ${err.message}`)
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
    logger.info(`TeachersController/deleteLessons - delete a lesson from an existing teacher`)

    const id = req.params.id
    const {horaryParams, dayParams} = req.params

    const findTeacher = await models.teachers.findOne({ where: { id: id } })

    if (findTeacher) {
      let lessonExists = {
        value: false,
        horary: null,
        day: null
      }

      if (findTeacher.lessons.filter(({horary, day}) => horary === horaryParams && day === dayParams).length !== 0) {
        lessonExists = {
          value: true,
          horary: horaryParams,
          day: dayParams
        }
      }

      if (lessonExists.value) {
        const lessonsUpdated = findTeacher.lessons.filter(({horary, day}) => horary !== horaryParams && day !== dayParams)

        await models.teachers.update({
          lessons: lessonsUpdated,
        }, { where: { id: id } })

        res.status(200).send(await models.teachers.findOne({ where: { id: id } }))
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