const chalk = require("chalk")
const colors = require("./colors")

const printError = (err) => {
	console.log(
		"\n",
		chalk.bgRedBright.bold.black(" ERROR "),
		err,
		"\n"
	)
}


const printHelp = () => {
	const help = `
 ${colors.bgCyan.black.bold(" marklive ")} Previews markdown and watches for changes.

 Usage:
    ${colors.cyan.bold("marklive")} ${chalk.grey("<PATH> [OPTIONS]")}

 Options:
    ${colors.cyan.bold("--help")}          ${chalk.grey("Help for marklive.")}
    ${colors.cyan.bold("--port PORT")}     ${chalk.grey("Specifies the port to be used, else, port")} ${colors.cyan("7000")} ${chalk.grey("is used.")}
	`
	console.log(help)

	process.exit(0)
}

const printServing = (port) => {
	console.log(
		"\n ",
		colors.bgCyan.black.bold(" Serving at "),
		colors.cyan("http://localhost:") + colors.cyan.bold(`${port}`),
		"\n"
	)
}


module.exports = {
	printError,
	printHelp,
	printServing,
}
