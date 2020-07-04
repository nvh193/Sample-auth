import express from 'express'
import path from 'path'
import middlewares from '../middlewares'
import { compose } from 'compose-middleware'
import { login, checkAuth, register } from '../controllers/auth'

export default function(app) {
  const router = express.Router()

  router.route('/auth').post(login)
  router.route('/regiser').post(register)

  router.route('/check-auth').get(compose([middlewares.permission]), checkAuth)

  app.use('/', router)
}
