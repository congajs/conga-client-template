/*
 * This file is part of the conga-client-template module.
 *
 * (c) Marc Roulias <marc@lampjunkie.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

// built-in modules
var fs = require('fs');
var path = require('path');

/**
 * The ClientTemplate handles the registration and compilation
 * of client-side templates in an application
 *
 * @author  Marc Roulias <marc@lampjunkie.com>
 */
function ClientTemplate() { }

ClientTemplate.prototype = {
	
	/**
	 * Register client templates from config on the ClientTemplateRegistry
	 * 
	 * @param {Object} event
	 * @param {Function} next
	 */
	onServerBoot: function(event, next){

		var i,
			container = event.container ,
			registry = container.get('client.template.registry') ,
			config = container.get('config').get('client_templates');

		// jst
		for (i in config.jst.bundles){
			registry.addJstGroup(i, config.jst.bundles[i].paths, config.jst.identifier.namespaced, config.jst.bundles[i].route);
		}

		// inline
		for (i in config.inline.bundles){
			registry.addInlineGroup(i, config.jst.bundles[i].paths, config.inline.identifier.namespaced);
		}

		next();
	},

	/**
	 * Compile the registered JST templates into javascript files in the
	 * public directory
	 * 
	 * @param  {Container}   container
	 * @param  {Object}   app
	 * @param  {Function} next
	 * @return {void}
	 */
	onAddMiddleware: function(container, app, next){

		var wrench = container.get('wrench');
		var config = container.get('config').get('client_templates').jst;
		var groups = container.get('client.template.registry').getJstGroups();

		var publicPath = container.getParameter('kernel.app_public_path');

		for (var i in groups){
			var js = this.buildJstObject(config.namespace, config.engine.type, groups[i].paths);

			var groupDir = path.join(publicPath, path.dirname(groups[i].route));

			if (!fs.existsSync(groupDir)){
				wrench.mkdirSyncRecursive(groupDir);
			}

			fs.writeFileSync(path.join(publicPath, groups[i].route), js);
		}

		next();
	},

	/**
	 * Build the JST object string
	 * 
	 * @param  {String} namespace
	 * @param  {String} engineName
	 * @param  {Object} paths
	 * @return {String}
	 */
	buildJstObject: function(namespace, engineName, paths){

		try {
			var engine = require('./engine/' + engineName);
		} catch (e){
			console.log("Invalid client template engine: " + engineName);
			process.exit();
		}

		var js = '';

		js += namespace + ' = {};';

		for(var name in paths){
			js += namespace + '[\'' + name + '\'] = ' + engine.compile(fs.readFileSync(paths[name]).toString(), paths[name], name) + ';';
		}

		return js;
	}
};

ClientTemplate.prototype.constructor = ClientTemplate;

module.exports = ClientTemplate;