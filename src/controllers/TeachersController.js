const jwt = require('jsonwebtoken')

const logger = require('../resources/logger')
const { convertToSlug } = require('../resources/normalizer')
const { dayInPortuguese } = require('../resources/dayInPortuguese')

const initModels = require('../models/init-models')
const db = require('../models/db')
const models = initModels(db)

const { Op } = require('sequelize')

exports.index = async (req, res) => {
  try {
    logger.info(`TeachersController/index - list all teachers`)

    const tokenDecoded = jwt.decode(req.headers.authorization.slice(7))

    const findUser = await models.users.findOne({ where: { id: tokenDecoded.id } })

    const teachers = await models.teachers.findAll({
      include: {
        model: models.users,
        as: 'idUser_user',
        where: {
          idInstitution: findUser.idInstitution
        }
      }
    })

    if (!teachers) {
      return res.status(404).send({
        error: {
          message: 'Nenhum professor foi encontrado na plataforma'
        }
      })
    }

    for (let teacher of teachers) {
      delete teacher.dataValues.idUser_user
    }

    return res.status(200).send(teachers)
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

    const teachers = await models.teachers.findOne({
      include: {
        model: models.teacherClasses,
        as: 'teacherClasses',
        where: { idTeacher: id }
      },
      include: {
        model: models.teacherLessons,
        as: 'teacherLessons',
        where: { idTeacher: id }
      },
      where: { id: id }
    })

    if (!teachers) {
      return res.status(404).send({
        error: {
          message: 'Nenhum professor foi encontrado. Verifique as informações e tente novamente'
        }
      })
    }

    return res.status(200).send(teachers)
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
    })

    await models.teacherLessons.create({
      idTeacher: newTeacher.id,
    })

    return res.status(201).send({
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

    const findTeacher = await models.teachers.findOne({ where: { id: id } })

    if (!findTeacher) {
      return res.status(404).send({
        error: {
          message: 'Nenhuma Professor foi encontrado. Não foi possível concluir a atualização',
        }
      })
    }

    await models.teachers.update({
      speciality: speciality,
    }, {
      where: {
        id: id
      }
    })

    return res.status(200).send(await models.teachers.findOne({ where: { id: id } }))
  } catch (err) {
    logger.error(`Failed to update teacher by id - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}

// exports.addLessons = async (req, res) => {
//   try {
//     logger.info(`TeachersController/addLessons - add lessons to existing teacher`)

//     const id = req.params.id

//     let { lessons } = req.body

//     const token = req.headers.authorization.slice(7)
//     const tokenDecoded = jwt.decode(token)

//     const findUser = await models.users.findOne({ where: { id: tokenDecoded.id } })

//     const findTeacher = await models.teachers.findOne({ where: { id: id } })

//     if (!lessons.classTheme || !lessons.day || !lessons.lesson || !lessons.period || !lessons.classBlock || !lessons.classNumber) {
//       return res.status(400).send({
//         error: {
//           message: 'Faltam dados para o cadastro. Verifique as informações enviadas e tente novamente'
//         }
//       })
//     }

//     //capital first letter 
//     lessons.day = lessons.day[0].toUpperCase() + lessons.day.substring(1);
//     lessons.gang = lessons.gang ? lessons.gang.toUpperCase() : ''
//     lessons.classBlock = lessons.classBlock.toUpperCase()
//     lessons.period = lessons.period.toLowerCase()

//     if (findTeacher) {
//       if (!['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].includes(lessons.day)) {
//         return res.status(400).send({
//           error: {
//             message: 'O dia informado não é válido para o cadastro de aulas',
//           }
//         })
//       }

//       const classExists = await models.class_.findOne({
//         where: {
//           idInstitution: findUser.idInstitution,
//           period: lessons.period,
//           block: lessons.classBlock,
//           classNumber: lessons.classNumber
//         }
//       })

//       if (!classExists) {
//         return res.status(400).send({
//           error: {
//             message: 'A classe informada não existe',
//           }
//         })
//       }

//       const classThemes = classExists.classTheme.map(({ name }) => { return convertToSlug(name) })

//       if (!classThemes.includes(convertToSlug(lessons.classTheme))) {
//         return res.status(400).send({
//           error: {
//             message: 'A matéria informada não está prevista no curso atribuído a classe informada',
//           }
//         })
//       }

//       if (findTeacher.lessons[lessons.day].filter(item => item.period === lessons.period && item.lesson === lessons.lesson).length === 0) {
//         findTeacher.lessons[lessons.day].push({
//           classTheme: lessons.classTheme,
//           gang: lessons.gang || '',
//           lesson: lessons.lesson,
//           period: lessons.period,
//           classBlock: lessons.classBlock,
//           classNumber: lessons.classNumber,
//         })

//         if (findTeacher.lessons[lessons.day].length > 1) {
//           findTeacher.lessons[lessons.day].sort((a, b) => {
//             let x = a.lesson
//             let y = b.lesson

//             return x === y ? 0 : x > y ? 1 : -1
//           })
//         }

//         await models.teachers.update({
//           lessons: findTeacher.lessons,
//         }, { where: { id: id } })

//         return res.status(200).send(await models.teachers.findOne({ where: { id: id } }))
//       } else {
//         return res.status(409).send({
//           error: {
//             message: 'Esse professor já possui uma aula no horário e dia informados',
//           }
//         })
//       }
//     } else {
//       return res.status(404).send({
//         error: {
//           message: 'Nenhum professor foi encontrado. Não foi possível concluir o cadastro',
//         }
//       })
//     }
//   } catch (err) {
//     logger.error(`Failed to add lessons in teachers - Error: ${err.message}`)

//     return res.status(500).send({
//       error: {
//         message: 'Ocorreu um erro interno do servidor'
//       }
//     })
//   }
// }

exports.updateLessons = async (req, res) => {
  try {
    logger.info(`TeachersController/updateLessons - update lessons from an existing teacher`)

    const id = req.params.id
    let { monday, tuesday, wednesday, thursday, friday } = req.body

    const days = [monday, tuesday, wednesday, thursday, friday].filter(item => !!item)

    if (!days.length || days.some(day =>
      day.some(props =>
        !props.lesson || !props.period || !props.classTheme || !props.classBlock || !props.classNumber
      )
    )) {
      return res.status(400).send({
        error: {
          message: 'Faltam dados para atualizar as aulas'
        }
      })
    }

    let lessonDays = { monday, tuesday, wednesday, thursday, friday }

    const tokenDecoded = jwt.decode(req.headers.authorization.slice(7))
    const findUser = await models.users.findOne({ where: { id: tokenDecoded.id } })

    const findTeacher = await models.teachers.findOne({ where: { id: id } })
    const findTeacherLessons = await models.teacherLessons.findOne({ where: { idTeacher: id } })

    if (!findTeacher || !findTeacherLessons) {
      return res.status(404).send({
        error: {
          message: 'Nenhum professor foi encontrado. Não foi possível concluir a atualização',
        }
      })
    }

    const weekDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']

    // validations and formatting
    for (let day of weekDays) {
      if (lessonDays[day]) {
        for (let i = 0; i < lessonDays[day].length; i++) {
          // validate if class exists
          const classExists = await models.class_.findOne({
            where: {
              idInstitution: findUser.idInstitution,
              period: lessonDays[day][i].period,
              block: lessonDays[day][i].classBlock,
              classNumber: lessonDays[day][i].classNumber
            }
          })

          if (!classExists) {
            const dayPTBR = dayInPortuguese(day) || day

            return res.status(400).send({
              error: {
                message: `A classe informada na ${dayPTBR}, na ${lessonDays[day][i].lesson}º aula, para a matéria de ${lessonDays[day][i].classTheme}, não existe`,
              }
            })
          }

          // validate if classTheme exists in current class and course
          const classThemes = classExists.classTheme.map(({ name }) => { return convertToSlug(name) })

          if (!classThemes.includes(convertToSlug(lessonDays[day][i].classTheme))) {
            const dayPTBR = dayInPortuguese(day) || day

            return res.status(400).send({
              error: {
                message: `A matéria informada na ${dayPTBR
                  }, na ${lessonDays[day][i].lesson
                  }º aula, para a classe no bloco ${lessonDays[day][i].classBlock
                  }, sala ${lessonDays[day][i].classNumber
                  }, não está prevista no curso`,
              }
            })
          }

          // order by lesson
          lessonDays[day].sort((a, b) => {
            let x = a.lesson
            let y = b.lesson

            return x === y ? 0 : x > y ? 1 : -1
          })

          // formatting data
          lessonDays[day][i] = {
            ...lessonDays[day][i],
            period: lessonDays[day][i].period,
            gang: lessonDays[day][i].gang && lessonDays[day][i].gang.toUpperCase(),
            classBlock: lessonDays[day][i].classBlock.toUpperCase()
          }
        }
      }
    }

    await models.teacherLessons.update({
      monday: lessonDays['monday'],
      tuesday: lessonDays['tuesday'],
      wednesday: lessonDays['wednesday'],
      thursday: lessonDays['thursday'],
      friday: lessonDays['friday']
    }, { where: { idTeacher: id } })

    return res.status(200).send({ message: 'Aulas atualizadas com sucesso' })

  } catch (err) {
    logger.error(`Failed to update lessons in teachers - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}

// exports.deleteLessons = async (req, res) => {
//   try {
//     logger.info(`TeachersController/deleteLessons - delete a lesson from an existing teacher`)

//     const id = req.params.id
//     let { day, period: periodParams, lesson: lessonParams } = req.query

//     day = day[0].toUpperCase() + day.substring(1);
//     periodParams = periodParams.toLowerCase()

//     const findTeacher = await models.teachers.findOne({ where: { id: id } })

//     if (findTeacher) {
//       if (!['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].includes(day)) {
//         return res.status(400).send({
//           error: {
//             message: 'O dia informado não é válido para localizar a aula',
//           }
//         })
//       }

//       if (findTeacher.lessons[day].filter((item) => item.period === periodParams && item.lesson === Number(lessonParams)).length !== 0) {
//         let lessonsUpdated = findTeacher.lessons

//         const lessonInDayUpdated = findTeacher.lessons[day].filter((item) =>
//           (item.period === periodParams && item.lesson !== Number(lessonParams)) ||
//           (item.period !== periodParams && item.lesson !== Number(lessonParams))
//         )

//         lessonsUpdated[day] = lessonInDayUpdated

//         await models.teachers.update({
//           lessons: lessonsUpdated,
//         }, { where: { id: id } })

//         return res.status(200).send(await models.teachers.findOne({ where: { id: id } }))
//       } else {
//         return res.status(404).send({
//           error: {
//             message: 'Aula não encontrada ou já deletada',
//           }
//         })
//       }
//     } else {
//       return res.status(404).send({
//         error: {
//           message: 'Nenhum professor foi encontrado. Não foi possível concluir a remoção',
//         }
//       })
//     }
//   } catch (err) {
//     logger.error(`Failed to delete lessons by id - Error: ${err.message}`)

//     return res.status(500).send({
//       error: {
//         message: 'Ocorreu um erro interno do servidor'
//       }
//     })
//   }
// }

exports.teacherClasses = async (req, res) => {
  try {
    logger.info(`TeachersController/teacherClasses - list all teachers classes`)

    const id = req.params.id
    const { course, classTheme } = req.query

    let options = {
      attributes: ['gang', 'classTheme'],
      include: [{
        model: models.teachers,
        as: 'idTeacher_teacher',
        attributes: [],
        where: {
          id: id
        },
      }, {
        model: models.class_,
        as: 'idClass_class',
        attributes: ['id', 'course', 'schoolYear', 'block', 'classNumber'],
      }]
    }

    if (classTheme) {
      options = {
        ...options,
        where: {
          classTheme: {
            [Op.like]: '%' + classTheme + '%'
          }
        },
      }
    }

    if (course) {
      options = {
        ...options,
        include: [
          options.include[0],
          {
            ...options.include[1],
            where: {
              course: {
                [Op.like]: '%' + course + '%'
              }
            }
          }
        ]
      }
    }

    const teachersClasses = await models.teacherClasses.findAll(options)

    if (!classTheme && !course && !teachersClasses.length) {
      return res.status(404).send({
        error: {
          message: 'Nenhuma classe foi relacionada a esse professor'
        }
      })
    }

    const response = teachersClasses.map(item => {
      return {
        idClass: item.idClass_class.id,
        gang: item.gang,
        classTheme: item.classTheme,
        course: item.idClass_class.course,
        schoolYear: item.idClass_class.schoolYear,
        block: item.idClass_class.block,
        classNumber: item.idClass_class.classNumber,
      }
    })

    return res.status(200).send(response)
  } catch (err) {
    logger.error(`Failed to list teachers classes - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}

exports.listTeacherLessons = async (req, res) => {
  try {
    logger.info(`TeachersController/listTeacherLessons - list teachers lessons`)

    const id = req.params.id

    const { day } = req.query

    let options = {
      where: {
        idTeacher: id
      }
    }

    if (day) {
      options = {
        ...options,
        attributes: ['id', 'idTeacher', day.toLowerCase(), 'createdAt', 'updatedAt']
      }
    }

    const teacherLessons = await models.teacherLessons.findOne(options)

    if (!teacherLessons) {
      return res.status(404).send({
        error: {
          message: 'Nenhuma lista de aulas foi relacionada a esse professor'
        }
      })
    }

    return res.status(200).send(teacherLessons)
  } catch (err) {
    logger.error(`Failed to list lessons - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}