const serverApp = (appNames) => {
  const getPortOptional = () => {
    let port = "3000"
    process.argv.forEach((argument) => {
      if(argument.includes('--port')) {
        port = argument.split("=")[1]
      }
    })

    return port
  }

  const buildServerRequires = () => {
    let reqs = ""
    appNames.forEach((name) => reqs += `require("./${name}/index")(app)\n`)
    return reqs
  }

  return `const express = require('express')
const cors = require('cors')
const app = express()
const port = ${getPortOptional()}

app.use(cors())

// Apps are modular, comment a require line
// if want to deactivate it
${buildServerRequires()}
app.listen(port, () => {
  console.log('App running on port: ', port);
  console.log('localhost:', port)
})
`
}
module.exports = serverApp;