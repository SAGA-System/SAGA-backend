const axios = require('axios');
const mysql = require('../mysql').pool;
const logger = require('../resources/logger')

exports.index = (req, res) => {
  mysql.getConnection((err, connection) => {
    if (err) { return res.status(500).send({ error: err }) }
    logger.info(`InstitutionController/index - list all institutions`)

    connection.query(
      "SELECT * FROM institution",
      (err, result, fields) => {
        if (err) {
          logger.error(`Failed to list institutions - Error: ${err.message}`)

          return res.status(500).send({
            error: {
              message: 'Ocorreu um erro interno do servidor'
            }
          })
        }

        if (result.length === 0) {
          return res.status(404).send({
            error: {
              message: 'Nenhuma instituição foi encontrada na plataforma'
            }
          })
        }

        res.status(200).send(result)
        connection.release()
      }
    )
  })
}

exports.show = (req, res) => {
  mysql.getConnection((err, connection) => {
    if (err) { return res.status(500).send({ error: err }) }
    logger.info(`InstitutionController/show - list institution by id`)

    const id = req.params.id
    
    connection.query(
      `SELECT * FROM institution WHERE id = ?`,
      [id],
      (err, result, fields) => {
        if (err) {
          logger.error(`Failed to list institution by id ${id} - Error: ${err.message}`)

          return res.status(500).send({
            error: {
              message: 'Ocorreu um erro interno do servidor'
            }
          })
        }

        if (result.length === 0) {
          return res.status(404).send({
            institutionExists: false,
            error: {
              message: 'Nenhuma instituição foi encontrada. Verifique as informações e tente novamente'
            }
          })
        }
        
        res.status(200).send({
          institutionExists: true,
          result
        })
        connection.release()
      }
      )
  })
}

exports.store = (req, res) => {
  mysql.getConnection((err, connection) => {
    if (err) { return res.status(500).send({ error: err }) }
    logger.info(`InstitutionController/store - create institution`)
    let {
      name,
      cnpj,
      courses,
      phone,
      street,
      number,
      district,
      complement,
      city
    } = req.body

    const response = req.body

    let isCreated

    function validateCNPJ(cnpj) {
      cnpj = cnpj.replace(/[^\d]+/g, '');

      if (cnpj == '') return false;

      if (cnpj.length != 14)
        return false;

      // Elimina CNPJs invalidos conhecidos
      if (cnpj == "00000000000000" ||
        cnpj == "11111111111111" ||
        cnpj == "22222222222222" ||
        cnpj == "33333333333333" ||
        cnpj == "44444444444444" ||
        cnpj == "55555555555555" ||
        cnpj == "66666666666666" ||
        cnpj == "77777777777777" ||
        cnpj == "88888888888888" ||
        cnpj == "99999999999999")
        return false;

      // Valida DVs
      size = cnpj.length - 2
      numbers = cnpj.substring(0, size);
      digits = cnpj.substring(size);
      sum = 0;
      pos = size - 7;
      for (i = size; i >= 1; i--) {
        sum += numbers.charAt(size - i) * pos--;
        if (pos < 2)
          pos = 9;
      }
      result = sum % 11 < 2 ? 0 : 11 - sum % 11;
      if (result != digits.charAt(0))
        return false;

      size = size + 1;
      numbers = cnpj.substring(0, size);
      sum = 0;
      pos = size - 7;
      for (i = size; i >= 1; i--) {
        sum += numbers.charAt(size - i) * pos--;
        if (pos < 2)
          pos = 9;
      }
      result = sum % 11 < 2 ? 0 : 11 - sum % 11;
      if (result != digits.charAt(1))
        return false;

      return true;
    }

    connection.query(
      `SELECT * FROM institution WHERE cnpj = ?`,
      [cnpj],
      (err, result, fields) => {
        if (err) {
          logger.error(`Failed to find institution by cnpj ${cnpj} - Error: ${err.message}`)

          return res.status(500).send({
            error: {
              message: 'Ocorreu um erro interno do servidor'
            }
          })
        }
        result.length !== 0 ? isCreated = true : isCreated = false;
        connection.release()
      }
    )

    if (!isCreated) {
      if (validateCNPJ(cnpj)) {
        connection.query(
          `INSERT INTO institution (name, cnpj, courses, phone, street, number, district, ${!complement ? '' : 'complement,'} city) VALUES (?,?,?,?,?,?,?,${!complement ? '' : '?,'}?)`,
          complement ?
            [name, cnpj, JSON.stringify(courses), phone, street, number, district, complement, city] :
            [name, cnpj, JSON.stringify(courses), phone, street, number, district, city],
          (err, result, fields) => {
            if (err) {
              logger.error(`Failed to create institution - Error: ${err.message}`)

              return res.status(500).send({
                error: {
                  message: 'Ocorreu um erro interno do servidor'
                }
              })
            }

            res.status(201).send({
              message: 'Instituição criada com sucesso',
              response
            })
            connection.release()
          }
        )
      } else {
        res.status(400).send({
          error: {
            message: 'CNPJ inválido',
          }
        })
      }
    } else {
      res.status(409).send({
        message: 'Nome da instituição já presente no banco',
      })
    }
  })
}

exports.update = (req, res) => {
  mysql.getConnection(async (err, connection) => {
    if (err) { return res.status(500).send({ error: err }) }
    logger.info(`InstitutionController/update - update institution by id`)
    
    const id = req.params.id

    const {
      name,
      cnpj,
      courses,
      phone,
      street,
      number,
      district,
      complement,
      city
    } = req.body

    const response = req.body

    let institutionExists;

    await axios({
      method: 'GET',
      url: `${process.env.URL_SELECT_INSTITUTION}/${id}`
    }).then(response => {
      institutionExists = response.data.institutionExists
    }).catch(err => { logger.error(err.message) });

    if (institutionExists) {
      connection.query(
        `UPDATE institution SET name = ?, cnpj = ?, courses = ?, phone = ?, street = ?, number = ?, district = ?, ${complement ? 'complement = ?,' : ''} city = ? WHERE id = ${id}`,
        complement ?
          [name, cnpj, JSON.stringify(courses), phone, street, number, district, complement, city] :
          [name, cnpj, JSON.stringify(courses), phone, street, number, district, city],
        (err, result, fields) => {
          if (err) {
            logger.error(`Failed to update institution by id ${id} - Error: ${err.message}`)

            return res.status(500).send({
              error: {
                message: 'Ocorreu um erro interno do servidor'
              }
            })
          }

          res.status(200).send(response)
          connection.release()
        }
      )
    } else {
      logger.error(`Failed to update institution by id ${id} - Error: Institution not exist`)

      res.status(404).send({
        error: {
          message: 'Nenhuma instituição foi encontrada. Não foi possível concluir a atualização'
        }
      })
    }
  })
}

exports.destroy = (req, res) => {
  mysql.getConnection(async (err, connection) => {
    if (err) { return res.status(500).send({ error: err }) }
    logger.info(`InstitutionController/delete - delete institution by id`)

    const id = req.params.id;
    let institutionExists;

    await axios({
      method: 'GET',
      url: `${process.env.URL_SELECT_INSTITUTION}/${id}`
    }).then(response => {
      institutionExists = response.data.institutionExists
    }).catch(err => { logger.error(err.message) });

    if (institutionExists) {
      connection.query(
        `DELETE FROM institution WHERE id = ${id}`,
        (err, result, fields) => {
          if (err) {
            logger.error(`Failed to delete institution by id ${id} - Error: ${err.message}`)

            return res.status(500).send({
              error: {
                message: 'Ocorreu um erro interno do servidor'
              }
            })
          }

          res.status(200).send({
            message: 'Instituição deletada com sucesso'
          })
          connection.release()
        }
      )
    } else {
      return res.status(404).send({
        error: {
          message: 'Instituição não encontrada ou já deletada'
        }
      })
    }
  })
}