UpdateResourceLoaderConfigPlugin
================================

Webpack plugin for automatically adding ResourceLoader frontend modules to
a `extension.json`. It'll extract i18n labels and required mobileFrontend
modules with `mw.mobileFrontend.require`.

```
npm install --save-dev update-resourceloader-config-plugin
```

Then on your `webpack.config.js` add it to the plugins:

```js
var conf = {
	entry: {
		'resources/ext.gather.special.collection/init': './resources/ext.gather.special.collection/init.js'
	},
	output: {
		path: path.join(__dirname, 'build'),
		filename: '[name].js'
	},
	module: {
		loaders: [
			// ...
		]
	},
	plugins: [
		new UpdateResourceLoaderConfig({
			i18n: 'mw.msg'
		})
	]
};
```

In this case it will create an entry
`resources/ext.gather.special.collection/init` in `extension.json` containing
the entry script, the i18n labels and the dependent modules required found.
Like this:

```json
{
  "//": "..."
	"ResourceModules": {
		"resources/ext.gather.special.collection/init.js": {
			"targets": [
				"mobile",
				"desktop"
			],
			"group": "other",
			"dependencies": [
				"ext.gather.api/CollectionsApi",
				"Button",
				"Icon",
				"ext.gather.collection.confirm/ConfirmationOverlay",
				"ext.gather.logging/SchemaGatherFlags",
				"toast"
			],
			"scripts": [
				"build/resources/ext.gather.special.collection/init.js"
			]
		}
  }
}
```

