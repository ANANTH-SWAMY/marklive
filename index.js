#! /usr/bin/env node

const chalk = require("chalk")
const markdownit = require("markdown-it")
const minimist = require("minimist")

const PORT = 7000

let args = minimist(process.argv.slice(2))

if (args["_"].length > 1) {
	console.log(chalk.red("More than one file given"))
	process.exit(1)
}

if (!args["_"][0].endsWith(".md")) {
	console.log(chalk.red("Not a Markdown file"))
	process.exit(1)
}
