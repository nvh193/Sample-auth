import config from 'config'
import mongoose from 'mongoose'

config.mongo.debug && mongoose.set('debug', true)

export default (app) => {
  mongoose.connect(
    config.mongo.uri,
    config.mongo.options,
    () => {
      console.log('MongoDB has been connected successfully')
    }
  )
}
