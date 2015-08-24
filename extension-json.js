var fs = require('fs')
var path = require('path')

function readExtensionJson (done) {
	fs.readFile('./extension.json', function (err, contents) {
		if (err) return done(err)
		parse(contents, done)
	})
}

function writeExtensionJson (data, done) {
	try {
		var contents = JSON.stringify(data, null, '\t')
		fs.writeFile('./extension.json', contents, done)
	} catch (e) { done(e) }
}

function parse (contents, done) {
	try { done(null, JSON.parse(contents)) }
	catch (e) { done(e) }
}

exports.update = function updateExtensionJson (out, modules) {
	readExtensionJson(function(err, data) {
		Object.keys(modules).forEach(function (entry) {
			var md = modules[entry]
			data.ResourceModules[entry] = {
				targets: ['mobile', 'desktop'],
				group: 'other',
				messages: md.messages,
				dependencies: md.modules,
				scripts: [path.join(out, entry)]
			}
		})
		writeExtensionJson(data, function (err) {
			if (err) return console.error(err)
			console.log(
				'\nCorrectly wrote extension.json modules for:\n\n',
				Object.keys(modules).map(function(m) { return '\t' + m }).join('\n'),
				'\n\n'
			)
		})
	})
}
