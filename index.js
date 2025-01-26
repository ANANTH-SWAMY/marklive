#! /usr/bin/env node

const chalk = require("chalk")
const colors = require("./utils/colors")
const chokidar = require("chokidar")
const fs = require("fs")
const minimist = require("minimist")
const prints = require("./utils/prints")
const server = require("./utils/server")

let args = minimist(process.argv.slice(2))

if (args["help"]) {
	prints.printHelp()
}

if (args["port"] === true) {
	prints.printError("Missing port number")

	process.exit(1)
}

const PORT = args["port"] || 7000

if (args["_"].length > 1) {
	prints.printError("More than one file specified")

	process.exit(1)
}

if (args["_"].length === 0) {
	prints.printHelp()
}

const filepath = args["_"][0]

if (!fs.statSync(filepath).isFile()) {
	prints.printError("Not a file")
	process.exit(1)
}

const watcher = chokidar.watch(filepath, {
	awaitWriteFinish: false,
	interval: 50,
})

watcher.on("change", async () => {
	server.update(filepath)
})

let newserver = server.fileServer(filepath)
newserver.listen(PORT)
