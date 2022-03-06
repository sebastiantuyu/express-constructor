const { terminal } = require("terminal-kit")

class Logger {
  process(exec, fixed, sucessMessage, failureMessage ) {
    try {
      exec()
      this.success(fixed + sucessMessage)
    } catch {
      this.error(fixed + failureMessage)
    }
  }

  success(message) {
    terminal.green(message)
    console.log()
  }

  warning(message) {
    terminal.yellow(message)
    console.log()
  }

  error(message) {
    terminal.red(message)
    console.log()
  }

  msg(message) {
    terminal(message)
    console.log()
  }

  msgNoSpaces(message) {
    terminal(message)
  }

  async yesOrNo(question) {
    this.warning(question)
    process.stdin.setRawMode(true)
    return new Promise(resolve => {
      return process.stdin.once('data', (data) => {
        process.stdin.setRawMode(false)
        const letter = data.toString('utf-8').toLowerCase()
        resolve(letter === 'y')
      })
    })
  }
}

module.exports = new Logger();