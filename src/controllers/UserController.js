const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const AwsS3 = require("../../config/aws")
const api = require('../../config/api')
const logger = require('../resources/logger')
const normalizer = require('../resources/normalizer')
const dataValidator = require('../resources/dataValidator')
const mailer = require('../../config/nodemailer')

const initModels = require('../models/init-models')
const db = require('../models/db')
const models = initModels(db)

exports.index = async (req, res) => {
  try {
    logger.info(`UserController/index - list all users in institution`)

    const tokenDecoded = jwt.decode(req.headers.authorization.slice(7))

    const findUser = await models.users.findOne({ where: { id: tokenDecoded.id } })

    const users = await models.users.findAll({
      where: { idInstitution: findUser.idInstitution }
    })

    if (users.length === 0) {
      return res.status(404).send({
        error: {
          message: 'Nenhum usuário foi encontrado na plataforma'
        }
      })
    }

    for (let i = 0; i < users.length; i++) {
      delete users[i].dataValues.password;
    }

    return res.status(200).send(users)
  } catch (err) {
    logger.error(`Failed to list users - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}

exports.show = async (req, res) => {
  try {
    logger.info(`UserController/show - list user by id`)

    const id = req.params.id

    const tokenDecoded = jwt.decode(req.headers.authorization.slice(7))

    const findUser = await models.users.findOne({ where: { id: tokenDecoded.id } })

    let user = await models.users.findOne({
      where: { id: id, idInstitution: findUser.idInstitution }
    })

    if (!user) {
      return res.status(404).send({
        error: {
          message: 'Nenhum usuário foi encontrado. Verifique as informações e tente novamente'
        }
      })
    }

    let roles = await models.roles.findOne({ where: { id: user.idRole } })
    const permissions = await models.permissions.findAll({
      include: {
        model: models.permissionsrole,
        as: 'permissionsroles',
        where: {
          idRole: user.idRole
        }
      }
    })

    roles = {
      ...roles["dataValues"], permissions: permissions.map(item => {
        delete item.dataValues.permissionsroles
        return item.dataValues
      })
    }
    user = { ...user["dataValues"], roles: roles }

    const avatarUrl = AwsS3.getSignedUrl("getObject", {
      Bucket: process.env.AWS_BUCKET_AVATAR,
      Key: user.avatarKey,
      Expires: 60 * 60 * 3
    })

    user = { ...user, avatarUrl: avatarUrl }

    delete user.password

    return res.status(200).send(user)
  } catch (err) {
    logger.error(`Failed to list user by id - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}

exports.store = async (req, res) => {
  try {
    logger.info(`UserController/store - create user`)

    let {
      idInstitution,
      name,
      password,
      cpf,
      rg,
      idRole,
      email,
      phone,
      street,
      number,
      district,
      complement,
      city,
      genre,
      birthDate,
      CEP,
      //for teachers
      speciality,
      //for students
      idClass,
      ra,
      schoolYear,
      situation,
    } = req.body

    const avatarFile = req.file

    // criação do usuário - roles
    // admin
    // principal
    // coordinator
    // teacher
    // parent
    // student

    if (!idInstitution || !name || !password || !cpf || !rg || !idRole || !email ||
      !phone || !street || !number || !district || !city || !genre || !birthDate || !CEP
    ) {
      return res.status(400).send({
        error: {
          message: 'Faltam dados para o cadastro. Verifique as informações enviadas e tente novamente'
        }
      })
    } else if (idRole && ([2, 3, 4].includes(Number(idRole)) && !speciality ||
      Number(idRole) === 6 && (!idClass || !ra || !schoolYear || !situation))
    ) {
      return res.status(400).send({
        error: {
          message: 'Faltam dados para o cadastro. Verifique as informações enviadas e tente novamente'
        }
      })
    }

    //normalize data
    rg = normalizer.removeMask(rg)
    cpf = normalizer.removeMask(cpf)
    phone = normalizer.removeMask(phone)
    CEP = normalizer.removeMask(CEP)

    if (ra) {
      ra = normalizer.removeMask(ra)
    }

    const token = req.headers.authorization

    const findForCPF = await models.users.findAll({ where: { cpf: cpf } })
    const findForEmail = await models.users.findAll({ where: { email: email } })

    if (idRole === 6 && !(await models.class_.findOne({ where: { id: idClass } }))) {
      return res.status(400).send({
        error: {
          message: 'A classe informada não existe'
        }
      })
    }

    if (findForCPF.length === 0 && findForEmail.length === 0) {
      if (dataValidator.validateCPF(cpf)) {
        bcrypt.hash(password, 10, async (errBcrypt, hash) => {
          if (errBcrypt) {
            return res.status(500).send({
              error: {
                message: errBcrypt
              }
            })
          }

          let AvatarKey = ''

          if (avatarFile) {
            AvatarKey = `Avatar-${new Date().getTime()}-${avatarFile?.originalname}`

            const awsParams = {
              Bucket: process.env.AWS_BUCKET_AVATAR,
              Key: AvatarKey,
              Body: avatarFile.buffer,
            }

            await new Promise((resolve, reject) => {
              AwsS3.upload(
                awsParams,
                function (error, data) {
                  if (error) return reject(error);
                  resolve(data);
                }
              );
            });
          }

          function getAvatarProps(type) {
            if (type === 'key') {
              if (AvatarKey) {
                return AvatarKey
              } else {
                if (Number(idRole) === 6) {
                  return process.env.DEFAULT_AVATAR_USER_KEY
                } else {
                  return process.env.DEFAULT_AVATAR_KEY
                }
              }
            } else if (type === 'url') {
              if (AvatarKey) {
                return AwsS3.getSignedUrl("getObject", {
                  Bucket: process.env.AWS_BUCKET_AVATAR,
                  Key: AvatarKey,
                  Expires: 60 * 60 * 3
                })
              } else {
                if (Number(idRole) === 6) {
                  return AwsS3.getSignedUrl("getObject", {
                    Bucket: process.env.AWS_BUCKET_AVATAR,
                    Key: process.env.DEFAULT_AVATAR_USER_KEY,
                    Expires: 60 * 60 * 3
                  })
                } else {
                  return AwsS3.getSignedUrl("getObject", {
                    Bucket: process.env.AWS_BUCKET_AVATAR,
                    Key: process.env.DEFAULT_AVATAR_KEY,
                    Expires: 60 * 60 * 3
                  })
                }
              }
            }
          }

          let user = await models.users.create({
            idInstitution: idInstitution,
            name: name,
            password: hash,
            cpf: cpf,
            rg: rg,
            idRole: idRole,
            email: email,
            phone: phone,
            street: street,
            number: number,
            district: district,
            complement: complement,
            city: city,
            avatarKey: getAvatarProps('key'),
            genre,
            birthDate,
            CEP
          })

          delete user.dataValues.password;

          user.dataValues = { ...user.dataValues, avatarUrl: getAvatarProps('url') }

          try {
            if ([2, 3, 4].includes(Number(idRole))) {
              await api.post('/teacher', {
                idUser: user.id,
                speciality: speciality,
              }, { headers: { authorization: token } });
            } else if (Number(idRole) === 6) {
              await api.post('/student', {
                idUser: user.id,
                idClass: idClass,
                ra: ra,
                schoolYear: schoolYear,
                situation: situation,
              }, { headers: { authorization: token } });
            }
          } catch (err) {
            await models.users.destroy({ where: { id: user.id } })

            logger.error(`Failed to create user - Error: ${err?.response?.data?.error?.message || err.message}`)

            return res.status(500).send({
              error: {
                message: err?.response?.data?.error?.message || 'Ocorreu um erro interno do servidor'
              }
            })
          }

          return res.status(201).send({
            message: "Usuário criado com sucesso",
            user
          })
        })
      } else {
        return res.status(409).send({
          error: {
            message: 'CPF inválido'
          }
        })
      }
    } else {
      return res.status(409).send({
        error: {
          message: 'Já existe um usuário na plataforma com essas credenciais'
        }
      })
    }

  } catch (err) {
    logger.error(`Failed to create user - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}

exports.update = async (req, res) => {
  try {
    logger.info(`UserController/update - update user by id`)

    const id = req.params.id

    let {
      name,
      email,
      cpf,
      rg,
      idRole,
      phone,
      street,
      number,
      district,
      complement,
      city,
      genre,
      birthDate,
      CEP
    } = req.body

    const avatarFile = req.file

    const findUser = await models.users.findOne({ where: { id: id } })

    //normalize data
    rg = rg ? normalizer.removeMask(rg) : findUser.rg
    cpf = cpf ? normalizer.removeMask(cpf) : findUser.cpf
    phone = phone ? normalizer.removeMask(phone) : findUser.phone

    if (idRole && !(await models.roles.findOne({ where: { id: idRole } }))) {
      return res.status(404).send({
        error: {
          message: 'O perfil informado não é válido'
        }
      })
    }

    if (idRole) {
      if (findUser.idRole === 6 && idRole !== 6) {
        return res.status(404).send({
          error: {
            message: 'Não é possível alterar o perfil de um usuário aluno'
          }
        })
      }
      if ([2, 3, 4].includes(findUser.idRole) && ![2, 3, 4].includes(idRole)) {
        return res.status(404).send({
          error: {
            message: 'Não é possível alterar o perfil de um usuário professor/coordenador/diretor para outro que não esses'
          }
        })
      }
    }

    let AvatarKey

    if (avatarFile) {
      AvatarKey = `Avatar-${new Date().getTime()}-${avatarFile?.originalname}`

      const awsParams = {
        Bucket: process.env.AWS_BUCKET_AVATAR,
        Key: AvatarKey,
        Body: avatarFile.buffer,
      }

      await new Promise((resolve, reject) => {
        AwsS3.upload(
          awsParams,
          function (error, data) {
            if (error) return reject(error);
            resolve(data);
          }
        );
      });

      if (findUser.avatarKey && (
        findUser.avatarKey !== process.env.DEFAULT_AVATAR_USER_KEY &&
        findUser.avatarKey !== process.env.DEFAULT_AVATAR_KEY)
      ) {
        const awsDeleteParams = {
          Bucket: process.env.AWS_BUCKET_AVATAR,
          Key: findUser.avatarKey,
        }

        await new Promise((resolve, reject) => {
          AwsS3.deleteObject(
            awsDeleteParams,
            function (error, data) {
              if (error) return reject(error);
              resolve(data);
            }
          );
        });
      }
    } else if (!findUser.avatarKey) {
      if (idRole ? Number(idRole) === 6 : Number(findUser.idRole) === 6) {
        AvatarKey = process.env.DEFAULT_AVATAR_USER_KEY
      } else {
        AvatarKey = process.env.DEFAULT_AVATAR_KEY
      }
    }

    if (findUser) {
      await models.users.update({
        name: name,
        email: email,
        cpf: cpf,
        rg: rg,
        idRole: idRole,
        phone: phone,
        street: street,
        number: number,
        district: district,
        complement: !!complement && complement !== 'null' ? complement : null,
        city: city,
        avatarKey: AvatarKey,
        genre: genre,
        birthDate: birthDate,
        CEP: CEP,
      }, { where: { id: id } })

      let updatedUser = await models.users.findOne({ where: { id: id } })

      let roles = await models.roles.findOne({ where: { id: updatedUser.idRole } })
      const permissions = await models.permissions.findAll({
        include: {
          model: models.permissionsrole,
          as: 'permissionsroles',
          where: {
            idRole: updatedUser.idRole
          }
        }
      })

      roles = {
        ...roles["dataValues"], permissions: permissions.map(item => {
          delete item.dataValues.permissionsroles
          return item.dataValues
        })
      }

      updatedUser = { ...updatedUser["dataValues"], roles: roles }

      if ([2, 3, 4].includes(updatedUser.idRole)) {
        const teacherData = await models.teachers.findOne({ where: { idUser: updatedUser.id } })
        updatedUser = { ...updatedUser, teacher: teacherData["dataValues"] }
      } else if (updatedUser.idRole === 6) {
        const studentData = await models.students.findOne({ where: { idUser: updatedUser.id } })
        updatedUser = { ...updatedUser, student: studentData["dataValues"] }
      }

      const avatarUrl = AwsS3.getSignedUrl("getObject", {
        Bucket: process.env.AWS_BUCKET_AVATAR,
        Key: updatedUser.avatarKey,
        Expires: 60 * 60 * 3
      })

      updatedUser = { ...updatedUser, avatarUrl: avatarUrl }

      delete updatedUser.password;

      return res.status(200).send(updatedUser)
    } else {
      return res.status(404).send({
        error: {
          message: 'Nenhum usuário foi encontrado. Não foi possível concluir a atualização',
        }
      })
    }
  } catch (err) {
    logger.error(`Failed to update user by id - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}

exports.destroy = async (req, res) => {
  try {
    logger.info(`UserController/destroy - delete user by id`)

    const id = req.params.id

    const findUser = await models.users.findOne({ where: { id: id } })

    if (!findUser) {
      return res.status(404).send({
        error: {
          message: 'Usuário não encontrado ou já deletado'
        }
      })
    }

    const awsDeleteParams = {
      Bucket: process.env.AWS_BUCKET_AVATAR,
      Key: findUser.avatarKey,
    }

    await new Promise((resolve, reject) => {
      AwsS3.deleteObject(
        awsDeleteParams,
        function (error, data) {
          if (error) return reject(error);
          resolve(data);
        }
      );
    });

    await models.users.destroy({ where: { id: id } })

    return res.status(200).send({
      message: 'Usuário deletado com sucesso'
    })
  } catch (err) {
    logger.error(`Failed to delete user by id - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}

exports.login = async (req, res) => {
  try {
    //sync database table columns with models
    // await models.bulletin.sync({alter: true})
    // await models.frequency.sync({alter: true})
    // await models.studentclasses.sync({alter: true})
    // await models.students.sync({alter: true})
    // await models.teacherClasses.sync({alter: true})
    // await models.teacherLessons.sync({alter: true})
    // await models.teachers.sync({alter: true})
    // await models.permissionsrole.sync({alter: true})
    // await models.permissions.sync({alter: true})
    // await models.roles.sync({alter: true})
    // await models.userpermissions.sync({alter: true})
    // await models.evaluations.sync({alter: true})
    // await models.schoolcalls.sync({alter: true})
    // await models.classLessons.sync({alter: true})
    // await models.class_.sync({alter: true})
    // await models.users.sync({alter: true})
    // await models.institution.sync({alter: true})

    logger.info(`UserController/login - login`)

    const {
      role,
      code,
      rm,
      password,
    } = req.body

    if (!role || !code || !rm || !password) {
      return res.status(400).send({
        error: {
          message: 'Faltam dados para entrar no sistema'
        }
      })
    }

    let findUser = await models.users.findOne({
      where: {
        id: rm,
        idRole: role,
        idInstitution: code
      }
    })

    if (!findUser) {
      return res.status(400).send({
        error: {
          message: 'Usuário não encontrado, verifique suas credenciais e tente novamente'
        }
      })
    }

    let roles = await models.roles.findOne({ where: { id: findUser.idRole } })
    const permissions = await models.permissions.findAll({
      include: {
        model: models.permissionsrole,
        as: 'permissionsroles',
        where: {
          idRole: findUser.idRole
        }
      }
    })

    roles = {
      ...roles["dataValues"], permissions: permissions.map(item => {
        delete item.dataValues.permissionsroles
        return item.dataValues
      })
    }

    findUser = { ...findUser["dataValues"], roles: roles }

    if ([2, 3, 4].includes(findUser.idRole)) {
      const teacherData = await models.teachers.findOne({ where: { idUser: findUser.id } })
      findUser = { ...findUser, teacher: teacherData["dataValues"] }
    } else if (findUser.idRole === 6) {
      const studentData = await models.students.findOne({ where: { idUser: findUser.id } })
      findUser = { ...findUser, student: studentData["dataValues"] }
    }

    bcrypt.compare(password, findUser.password, (err, results) => {
      if (err) {
        return res.status(401).send({
          error: {
            message: 'Falha na autenticação'
          }
        })
      }
      if (results) {
        const token = jwt.sign({
          id: findUser.id,
        }, process.env.JWT_KEY, {
          expiresIn: "3h"
        })

        const avatarUrl = AwsS3.getSignedUrl("getObject", {
          Bucket: process.env.AWS_BUCKET_AVATAR,
          Key: findUser.avatarKey,
          Expires: 60 * 60 * 3
        })

        const user = { ...findUser, avatarUrl: avatarUrl }

        delete user.password;

        return res.status(200).send({
          message: 'Autenticado com sucesso',
          token: token,
          user: user
        })
      }
      return res.status(401).send({
        error: {
          message: 'Não foi possível entrar no sistema'
        }
      })
    })
  } catch (err) {
    logger.error(`Failed to login user - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}

exports.forgotPassword = async (req, res) => {
  try {
    logger.info(`UserController/forgotPassword - send a mail to reset password`)
    const {
      role,
      code,
      rm,
      email
    } = req.body;

    const findUser = await models.users.findOne({
      where: {
        id: rm,
        idRole: role,
        idInstitution: code
      }
    })

    if (findUser) {
      const now = new Date();
      now.setHours(now.getHours() - 2)

      const token = jwt.sign({
        idUser: findUser.id,
      }, process.env.JWT_KEY, {
        expiresIn: "3h"
      })

      await models.users.update({
        resetPassword: token,
      }, { where: { id: findUser.id } })

      mailer.sendMail({
        to: email,
        from: 'tccsaga@gmail.com',
        subject: 'Solicitação de Alteração de Senha',
        template: 'forgotPassword',
        context: { username: findUser.name, url: `${req.headers.origin}/auth/redefinir-minha-senha?token=${token}` },
      }, (err) => {
        if (err) {
          logger.error(`Can't send email to reset password - Error: ${err.message}`)

          return res.status(400).send({
            error: {
              message: 'Não foi possível mandar o e-mail para reset de senha'
            }
          })
        }

        return res.send({ message: `Solicitação de nova senha enviada com sucesso` })
      })
    } else {
      return res.status(404).send({
        error: {
          message: 'Nenhum usuário foi encontrado. verifique as credenciais informadas e tente novamente',
        }
      })
    }
  } catch (err) {
    logger.error(`Failed to forgot user password - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}

exports.validateTokenResetPassword = async (req, res) => {
  try {
    logger.info(`UserController/validateTokenResetPassword - validate token reset password`)
    const { token } = req.params

    const { idUser, exp } = jwt.decode(token)

    const user = await models.users.findOne({ where: { id: idUser } })

    if (user) {
      const now = new Date()
      now.setHours(now.getHours() - 3)
      const expiresIn = new Date(exp)

      if ((expiresIn.getTime() * 1000) >= now.getTime()) {
        return res.status(200).send({
          message: 'Token válido!'
        })

      } else {
        return res.status(400).send({
          error: {
            message: 'Token expirado. Solicite novamente o reset de senha'
          }
        })
      }
    } else {
      return res.status(400).send({
        error: {
          message: 'Token inválido'
        }
      })
    }
  } catch (err) {
    logger.error(`Failed to validate token reset user password  - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}

exports.resetPassword = async (req, res) => {
  try {
    logger.info(`UserController/resetPassword - reset password`)
    const { token, password } = req.body

    const { exp, idUser } = jwt.decode(token)

    const user = await models.users.findOne({ where: { id: idUser } })

    if (user.resetPassword) {
      const now = new Date()
      now.setHours(now.getHours() - 3)
      const expiresIn = new Date(exp)

      if ((expiresIn.getTime() * 1000) >= now.getTime()) {
        bcrypt.hash(password, 10, async (errBcrypt, hash) => {
          if (errBcrypt) {
            return res.status(500).send({
              error: {
                message: errBcrypt
              }
            })
          }

          await models.users.update({
            password: hash
          }, { where: { id: idUser } })

          return res.status(200).send({
            message: 'Senha atualizada com sucesso!'
          })
        })
      } else {
        return res.status(400).send({
          error: {
            message: 'Token expirado. Solicite novamente o reset de senha'
          }
        })
      }
    } else {
      return res.status(400).send({
        error: {
          message: 'Token inválido'
        }
      })
    }
  } catch (err) {
    logger.error(`Failed to reset user password - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}