###
Modified from https://github.com/elliotf/mocha-mongoose
###
mongoose = require("mongoose")
config = require('../../config')

beforeEach (done) ->
  clearDB = ->
    for i of mongoose.connection.collections
      mongoose.connection.collections[i].remove ->
    done()

  unless mongoose.connection.db
    mongoose.connect config.ds.test, (err) ->
      throw err  if err
      clearDB()
  else
    clearDB()