#! /usr/bin/env node

const chalk = require("chalk")
const chokidar = require("chokidar")
const express = require("express")
const fs = require("fs")
const http = require("http")
const markdownit = require("markdown-it")
const minimist = require("minimist")

let args = minimist(process.argv.slice(2))

const PORT = 7000

if (args["_"].length > 1) {
	console.log(chalk.red("More than one file given"))
	process.exit(1)
}

const filepath = __dirname + "/" + args["_"][0]

const watcher = chokidar.watch(filepath)

watcher.on("change", async () => {
	console.log("change")
})

// let file = fs.readFileSync(filepath).toString()
// console.log(markdownit().render(file))
