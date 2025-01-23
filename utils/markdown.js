const markdownit = require("markdown-it")
const markdownitCheckbox = require("markdown-it-task-checkbox")

md = markdownit().use(markdownitCheckbox)

module.exports = {
	md,
}
