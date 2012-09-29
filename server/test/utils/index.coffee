###
Modified from https://github.com/elliotf/mocha-mongoose
###
mongoose = require("mongoose")
config = require('../../config')

process.env.NODE_ENV = 'test'

beforeEach (done) ->

  clearDB = ->
    for i of mongoose.connection.collections
      mongoose.connection.collections[i].remove ->
    done()

  if mongoose.connection.readyState is 0
#  unless mongoose.connection.db
    mongoose.connect config.ds.test, (err) ->
      throw err  if err
      clearDB()
  else
    clearDB()


afterEach (done) ->
  mongoose.disconnect()
  done()
