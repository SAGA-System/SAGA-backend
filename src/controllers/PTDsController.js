const logger = require('../resources/logger')
const awsS3 = require('../../config/aws')

const initModels = require('../models/init-models')
const db = require('../models/db')
const models = initModels(db)

const path = require('path')
const fs = require('fs')
const FormData = require('form-data')
const axios = require('axios')

exports.index = async (req, res) => {
  try {
    logger.info(`PTDsController/index - list all ptds`)

    const { idTeacher, idClass, classTheme } = req.query

    let options = {}

    if (idTeacher) {
      options = {
        ...options,
        where: {
          ...options.where,
          idTeacher: idTeacher
        }
      }
    }

    if (idClass) {
      options = {
        ...options,
        where: {
          ...options.where,
          idClass: idClass
        }
      }
    }

    if (classTheme) {
      options = {
        ...options,
        where: {
          ...options.where,
          classTheme: classTheme
        }
      }
    }

    const findPTDs = await models.ptds.findAll(options)

    const response = findPTDs.map((item) => {
      const fileUrl = awsS3.getSignedUrl("getObject", {
        Bucket: process.env.AWS_BUCKET_PTD,
        Key: item.fileKey,
        Expires: 60 * 60 * 3
      })

      return { ...item['dataValues'], fileUrl: fileUrl }
    })

    return res.status(200).send(response)
  } catch (err) {
    logger.error(`Failed to list PTDs - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}

exports.show = async (req, res) => {
  try {
    logger.info(`PTDsController/show - list ptd by id`)

    const id = req.params.id

    const { idTeacher } = req.query

    let options = {
      where: { id: id },
    }

    if (idTeacher) {
      options = {
        ...options,
        where: {
          ...options.where,
          idTeacher: idTeacher
        }
      }
    }

    const findPTD = await models.ptds.findOne(options)

    if (!findPTD) {
      return res.status(404).send({
        error: {
          message: 'Nenhum PTD foi encontrado na plataforma'
        }
      })
    }

    const fileUrl = awsS3.getSignedUrl("getObject", {
      Bucket: process.env.AWS_BUCKET_PTD,
      Key: findPTD.fileKey,
      Expires: 60 * 60 * 3
    })

    const response = { ...findPTD['dataValues'], fileUrl: fileUrl }

    return res.status(200).send(response)
  } catch (err) {
    logger.error(`Failed to list ptd by id - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}

exports.store = async (req, res) => {
  try {
    logger.info(`PTDsController/store - create ptd`)

    const {
      idClass,
      idTeacher,
      classTheme,
      schoolYear,
      semester,
    } = req.body

    const file = req.file

    if (!idClass || !idTeacher || !classTheme || !schoolYear || !semester || !file) {
      return res.status(400).send({
        error: {
          message: 'Faltam dados para o cadastro. Verifique as informações enviadas e tente novamente'
        }
      })
    }

    const findPTD = await models.ptds.findOne({
      where: {
        idClass: idClass,
        idTeacher, idTeacher,
        classTheme: classTheme,
        schoolYear: schoolYear,
        semester: semester,
      }
    })

    if (findPTD) {
      return res.status(400).send({
        error: {
          message: 'Já existe um PTD cadastrado com as informações fornecidas'
        }
      })
    }

    let fileKey = ''

    // for don't return 2 times
    let error = false

    if (file) {
      let finalFile = file

      if (path.extname(file.originalname) === '.docx') {
        console.log('convertendo...')

        const formData = new FormData()
        formData.append('instructions', JSON.stringify({
          parts: [{ file: "document" }]
        }))

        formData.append('document', file.buffer)

        await axios.post('https://api.pspdfkit.com/build', formData, {
          headers: formData.getHeaders({
            'Authorization': `Bearer ${process.env.PSPDFKIT_KEY}`
          }),
          responseType: "stream"
        }).then(response => {
          response.data.pipe(fs.createWriteStream(path.resolve(__dirname, "../", "resources", "ptdConverted", "result.pdf")))

          finalFile.buffer = fs.readFileSync(path.resolve(__dirname, "../", "resources", "ptdConverted", "result.pdf"))

          fs.rmSync(path.resolve(__dirname, "../", "resources", "ptdConverted", "result.pdf"))
        }).catch(async err => {
          error = true

          const errorString = await streamToString(err.response?.data)
          console.log(errorString)

          return res.status(400).send({
            error: {
              message: 'Ocorreu um erro ao converter o arquivo .docx para .pdf'
            }
          })
        })

        function streamToString(stream) {
          const chunks = []
          return new Promise((resolve, reject) => {
            stream?.on("data", (chunk) => chunks.push(Buffer.from(chunk)))
            stream?.on("error", (err) => reject(err))
            stream?.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")))
          })
        }
      }

      if (!error) {
        fileKey = `PTD-${classTheme}-${new Date().getTime()}.pdf`

        const awsParams = {
          Bucket: process.env.AWS_BUCKET_PTD,
          Key: fileKey,
          Body: finalFile.buffer,
        }

        await new Promise((resolve, reject) => {
          awsS3.upload(
            awsParams,
            function (error, data) {
              if (error) return reject(error);
              resolve(data);
            }
          );
        });
      }
    }

    if (!error) {
      const newPTD = await models.ptds.create({
        idClass: Number(idClass),
        idTeacher: Number(idTeacher),
        classTheme: classTheme,
        schoolYear: Number(schoolYear),
        semester: Number(semester),
        fileKey: fileKey,
      })

      return res.status(201).send({
        message: 'PTD criado com sucesso',
        newPTD
      })
    }
  } catch (err) {
    logger.error(`Failed to create PTD - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}

exports.update = async (req, res) => {
  try {
    logger.info(`PTDsController/update - update ptd by id`)

    const id = req.params.id

    const {
      semester,
    } = req.body

    const file = req.file

    const findPTD = await models.ptds.findOne({ where: { id: id } })

    if (!findPTD) {
      return res.status(404).send({
        error: {
          message: 'Nenhum PTD foi encontrado. Não foi possível concluir a atualização',
        }
      })
    }

    let fileKey = ''

    // for don't return 2 times
    let error = false

    if (file) {
      let finalFile = file

      if (path.extname(file.originalname) === '.docx') {
        console.log('convertendo...')

        const formData = new FormData()
        formData.append('instructions', JSON.stringify({
          parts: [{ file: "document" }]
        }))

        formData.append('document', file.buffer)

        await axios.post('https://api.pspdfkit.com/build', formData, {
          headers: formData.getHeaders({
            'Authorization': `Bearer ${process.env.PSPDFKIT_KEY}`
          }),
          responseType: "stream"
        }).then(response => {
          response.data.pipe(fs.createWriteStream(path.resolve(__dirname, "../", "resources", "ptdConverted", "result.pdf")))

          finalFile.buffer = fs.readFileSync(path.resolve(__dirname, "../", "resources", "ptdConverted", "result.pdf"))

          fs.rmSync(path.resolve(__dirname, "../", "resources", "ptdConverted", "result.pdf"))
        }).catch(async err => {
          error = true

          const errorString = await streamToString(err.response?.data)
          console.log(errorString)

          return res.status(400).send({
            error: {
              message: 'Ocorreu um erro ao converter o arquivo .docx para .pdf'
            }
          })
        })

        function streamToString(stream) {
          const chunks = []
          return new Promise((resolve, reject) => {
            stream?.on("data", (chunk) => chunks.push(Buffer.from(chunk)))
            stream?.on("error", (err) => reject(err))
            stream?.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")))
          })
        }
      }

      if (!error) {
        fileKey = `PTD-${findPTD.classTheme}-${new Date().getTime()}.pdf`

        const awsDeleteParams = {
          Bucket: process.env.AWS_BUCKET_PTD,
          Key: findPTD.fileKey,
        }

        const awsParams = {
          Bucket: process.env.AWS_BUCKET_PTD,
          Key: fileKey,
          Body: file.buffer,
        }

        await new Promise((resolve, reject) => {
          awsS3.deleteObject(
            awsDeleteParams,
            function (error, data) {
              if (error) return reject(error);
              resolve(data);
            }
          );
        });

        await new Promise((resolve, reject) => {
          awsS3.upload(
            awsParams,
            function (error, data) {
              if (error) return reject(error);
              resolve(data);
            }
          );
        });
      }
    }

    if (!error) {
      await models.ptds.update({
        semester: semester,
        fileKey: fileKey,
      }, {
        where: {
          id: id
        }
      })

      return res.status(200).send(await models.ptds.findOne({ where: { id: id } }))
    }
  } catch (err) {
    logger.error(`Failed to update ptd by id - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}

exports.destroy = async (req, res) => {
  try {
    logger.info(`PTDsController/destroy - delete ptd by id`)

    const id = req.params.id

    const findPTD = await models.ptds.findOne({ where: { id: id } })

    if (!findPTD) {
      return res.status(404).send({
        error: {
          message: 'PTD não encontrado ou já deletado'
        }
      })
    }

    const awsDeleteParams = {
      Bucket: process.env.AWS_BUCKET_PTD,
      Key: findPTD.fileKey,
    }

    await new Promise((resolve, reject) => {
      awsS3.deleteObject(
        awsDeleteParams,
        function (error, data) {
          if (error) return reject(error);
          resolve(data);
        }
      );
    });

    await models.ptds.destroy({ where: { id: id } })

    return res.status(200).send({
      message: 'PTD deletado com sucesso'
    })
  } catch (err) {
    logger.error(`Failed to delete PTD by id - Error: ${err.message}`)

    return res.status(500).send({
      error: {
        message: 'Ocorreu um erro interno do servidor'
      }
    })
  }
}