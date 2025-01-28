const markdownit = require("markdown-it")
const markdownitCheckbox = require("markdown-it-task-checkbox")

md = markdownit({html: true,}).use(markdownitCheckbox)

module.exports = {
	md,
}
