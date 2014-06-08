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
 * The ClientTemplateRegistry holds on to all the
 * JST or inline template groups that were registered
 * in the application
 * 
 * @author  Marc Roulias <marc@lampjunkie.com>
 */
function ClientTemplateRegistry(container, namespaceResolver, wrench) {
	this.container = container;
	this.namespaceResolver = namespaceResolver;
	this.wrench = wrench;
	this.inlineGroups = {};
	this.jstGroups = {};
}

ClientTemplateRegistry.prototype = {

	/**
	 * The Service Container
	 * @type {Container}
	 */
	container: null ,

	/**
	 * Get the client_templates configuration settings
	 * @returns {Object}
	 */
	getConfig: function() {
		return this.container.get('config').get('client_templates') || {};
	} ,

	/**
	 * Add an inline group
	 * 
	 * @param  {String}  name
	 * @param  {Array}   paths
	 * @param  {Boolean} isNamespaced
	 * @return {void}
	 */
	addInlineGroup: function(name, paths, isNamespaced){
		this.inlineGroups[name] = this.translatePaths(paths, isNamespaced);
	},

	/**
	 * Add a JST group
	 * 
	 * @param  {String}  name
	 * @param  {Array}   paths
	 * @param  {Boolean} isNamespaced
	 * @param  {String}  route
	 * @return {void}
	 */
	addJstGroup: function(name, paths, isNamespaced, route){
		this.jstGroups[name] = {
			paths: this.translatePaths(paths, isNamespaced),
			route: route
		};
	},

	/**
	 * Get an inline group by name
	 * 
	 * @param  {String} name
	 * @return {Object}
	 */
	getInlineGroup: function(name){
		return this.inlineGroups[name];
	},

	/**
	 * Get a JST group by name
	 * 
	 * @param  {String} name
	 * @return {Object}
	 */
	getJstGroup: function(name){
		return this.jstGroups[name];
	},

	/**
	 * Get all of the JST groups
	 * 
	 * @return {Object}
	 */
	getJstGroups: function(){
		return this.jstGroups;
	},

	/**
	 * Translate the configured paths into actual paths
	 *
	 * The returned object will be keyed on the relative path.
	 *
	 * If "isNamespaced" is set to true, the original conga
	 * namespace will be prepended to the key name
	 * 
	 * @param  {Array}   paths
	 * @param  {Boolean} isNamespaced
	 * @return {Object}
	 */
	translatePaths: function(paths, isNamespaced){

		var translatedPaths = {};
		var fileExtension = '.' + (this.getConfig().jst.fileExtension || 'html').replace(/^\./, '');

		paths.forEach(function(p){

			// check for wildcard directories
			if (p[p.length - 1] === '*'){

				var dir = this.namespaceResolver.resolveWithSubpath(p.replace('/*', ''), 'lib/resources/views');
				var files = this.wrench.readdirSyncRecursive(dir);

				files.forEach(function(file){

					if (fs.lstatSync(path.join(dir, file)).isFile()){

						var name = path.basename(file, fileExtension);

						if (isNamespaced){
							name = p.replace('/*', '') + '/' + name;
						}

						translatedPaths[name] = path.join(dir, file);						
					}
				});

			// absolute file paths
			} else {

				var name = path.basename(p, fileExtension);

				/*if (isNamespaced){
					name = p.replace(path.extname(p), '');
				} else {
					name = path.basename(p, path.extname(p));
				}*/
	
				translatedPaths[name] = this.namespaceResolver.resolveWithSubpath(p, 'lib/resources/views');
			}

		}, this);

		return translatedPaths;
	}
};

ClientTemplateRegistry.prototype.constructor = ClientTemplateRegistry;

module.exports = ClientTemplateRegistry;