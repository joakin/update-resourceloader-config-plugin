var path = require('path')

var updateResourceLoaderModules = require('./extension-json.js').update
var ExtractI18nKeys = require('./ExtractI18nKeys')
var ExtractMFRequiredModules = require('./ExtractMFRequiredModules')

module.exports = UpdateResourceLoaderConfig

function UpdateResourceLoaderConfig (opts) {
	opts = opts || {}

	this.currentRLInfo = newModuleInfo()

	this.extractI18nKeys = new ExtractI18nKeys({
		functionName: opts.i18n,
		onKeys: this.updateEntrypointsRLInfo.bind(this, 'i18n')
	})
	this.extractMFModules = new ExtractMFRequiredModules({
		onModules: this.updateEntrypointsRLInfo.bind(this, 'modules')
	})
}

UpdateResourceLoaderConfig.prototype.updateEntrypointsRLInfo = function (key, data) {
	this.currentRLInfo[key] = data
}

UpdateResourceLoaderConfig.prototype.apply = function(compiler) {
	var self = this
	this.extractI18nKeys.apply(compiler)
	this.extractMFModules.apply(compiler)

	compiler.plugin("done", function() {
		var modules = parsePluginsToRL(this.currentRLInfo)
		this.currentRLInfo = newModuleInfo()
		updateResourceLoaderModules(path.relative('./', compiler.outputPath), modules)
	}.bind(this))
}

function newModuleInfo () { return { i18n: null, modules: null } }

function parsePluginsToRL (info) {
	var allKeys = Object.keys(info.i18n).concat(Object.keys(info.modules))
	return allKeys.reduce(function (acc, k) {
		acc[k] = {
			i18n: info.i18n[k],
			modules: info.modules[k]
		}
		return acc
	}, {})
}
