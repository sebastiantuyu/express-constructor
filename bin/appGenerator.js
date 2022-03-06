const { execSync } = require("child_process");
const fs = require("fs");
const logger = require("./logger");
const serverApp = require("./templates/serverApp");

class Builder {
  routes = [];
  rootPath = "";

  constructor() {
    this.rootPath = "src"
  }

  getRoutesArray() {
    return Object.keys(this.routes);
  }

  async generateRootFolder() {
    const rootExists = fs.existsSync(this.rootPath)
    if(rootExists) {
      await logger.yesOrNo("Root folder finded, would you like to re-write it? (y/n)")
      .then((data) => {

        if(data) {
          logger.success("Proceed to re-write the files... ")
        } else {
          logger.error("OK, won't proceed building. Exiting app. ")
          process.exit()
        }
      })
    } else {
      logger.success(">> Creating src folder")
      fs.mkdirSync(this.rootPath)
    }
  }

  async generateApp() {
    await this.generateRootFolder()
    logger.process(
      () => this.buildServerFile(),
      "[1/1] ",
      "Generating server file... ",
      "Error. Please review what could be wrong. "
    )

    this.getRoutesArray().forEach((routeName, index) => {
      logger.msgNoSpaces(`[${index + 1}/${this.getRoutesArray().length}] `)
      this.buildApp(routeName)

      const indexContent = this.buildIndex(routeName, this.routes[routeName].root)
      const routesContent = this.buildRoutes(this.routes[routeName])

      this.generateFile(routeName, indexContent, "index")
      this.generateFile(routeName, routesContent, "routes")
    })

    this.generateExtras()
    process.exit()
  }

  buildApp(appName) {
    const appRoute = `${this.rootPath}/${appName}`
    if(fs.existsSync(appRoute)) {
      logger.warning("Updating app... ")
      return false
    }
    logger.success("Creating app... ")
    fs.mkdirSync(`${this.rootPath}/${appName}`);
    return true
  }

  generateFile(appName, content, fileName) {
    fs.writeFileSync(`${this.rootPath}/${appName}/${fileName}.js`, content)
  }

  generateExtras() {
    const extraSteps = [
      {
        command: "git init",
        path: ".git",
        success: "Git repository initialized",
        failure: "Git repository already exist, omitting."
      },
      {
        command: fs.writeFileSync,
        path: ".gitignore",
        success: "Gitignore file added. ",
        failure: "Gitignore already exist, omitting."
      },
      {
        command: "npm init -y",
        path: "package.json",
        success: "Package.json not detected, initializing npm project",
        failure: "Package.json founded, ommitting."

      },
      {
        command: "npm install express",
        path: "node_modules/express",
        success: "Express dependency installed",
        failure: "Express module already exist, omtting."
      },
      {
        command: "npm install express",
        path: "node_modules/cors",
        success: "Cors dependency installed",
        failure: "Cors module already exist, omtting."
      }
    ]


    extraSteps.forEach((step) => {
      if(fs.existsSync(`${this.rootPath}/${step.path}`)) {
        logger.warning(step.failure)
      } else {
        if(typeof(step.command) === 'function') {
          fs.writeFileSync(".gitignore", "node_modules")
        } else {
          execSync(step.command)
        }
        logger.success(step.success)
      }
    })
  }

  buildRoutes(app) {
    let fileContent = ""
    app.routes.forEach((routePath) => {
      const method = Object.keys(routePath)[0]
      const path = routePath[method]
      const isAsync = routePath.async

      fileContent += `app.${method}("${path}", ${isAsync ? "async" : ""} (request, response) => {
  // Your code goes here
})
`
    })

    return fileContent;
  }

  buildIndex(appName, appRoot){
    return `const routes = require("./routes");

function ${appName}Router(app) {
  app.use('${appRoot}', routes);
}

module.exports = ${appName}Router;
`
  }

  buildServerFile() {
    const content = serverApp(this.getRoutesArray())
    fs.writeFileSync(`${this.rootPath}/index.js`, content)
  }

  createFileIfNotExist(filePath, content, fixed, msgExists, msgCreated) {
    if(fixed) {
      logger.msgNoSpaces(fixed)
    }

    if(fs.existsSync(filePath)) {
      logger.warning(msgExists)
    } else {
      fs.writeFileSync(filePath, content ? content : "")
      logger.success(msgCreated)
    }
  }
}

const AppBuilder = new Builder();
module.exports = AppBuilder;