import bootstrap from './bootstrap'
import config from 'config'

import express from 'express'
import bodyParser from 'body-parser'
import middleware from './middlewares'
import routes from './routes'
process.setMaxListeners(100)

const app = express()
bootstrap(app)
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true
  })
)

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, X-Access-Token'
  )
  res.header('Access-Control-Allow-Methods', 'POST, GET, DELETE, PUT, OPTIONS')
  if (req.method.toUpperCase() === 'OPTIONS') {
    return res.sendStatus(200)
  }
  next()
})
routes(app)
app.use(middleware.errorHandler)

app.listen(config.application.port, () =>
  console.log('Server is listening at port', config.application.port)
)
