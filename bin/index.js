#!/usr/bin/env node

const fs = require("fs")
const AppBuilder = require("./appGenerator")
const logger = require("./logger")

let rawRoutes = ""
logger.process(() => fs.readFileSync("routes.json").toString('utf-8'),
  "[1/1] ",
  "Route files finded... ",
  "File 'routes.json' not founded, make sure exists or has the proper name"
)
try {
  rawRoutes = fs.readFileSync("routes.json").toString('utf-8')
} catch {
  console.error("File routes.json not finded, please add a routes file.")
  process.exit()
}

const routes = JSON.parse(rawRoutes)

AppBuilder.routes = routes
AppBuilder.generateApp()