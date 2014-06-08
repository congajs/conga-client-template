var fs = require('fs');

function TemplateHelper(container) {
	this.container = container;
}

TemplateHelper.prototype = {

	/**
	 * The service container
	 * @type {Container}
	 */
	container: null ,

	/**
	 * Mapped methods
	 * @type {Object}
	 */
	methods: {
	  'client_templates': 'clientTemplates'
	},

	/**
	 * Return the inline script tags for a template group
	 * 
	 * @param  {String} name
	 * @return {String}
	 */
	clientTemplates: function(name){

		// check if template group was already compiled
		if (typeof templates[name] !== 'undefined'){
			return templates[name];
		}

		var group = this.container.get('client.template.registry').getInlineGroup(name);

		if (typeof group === 'undefined'){
			return '';
		}

		templates[name] = createHtml(group, this.container.get('config').get('client_templates').inline);
		return templates[name];
	}
};

/**
 * Hash of compiled templates
 * @type {Object}
 */
var templates = {};

/**
 * Create the full HTML of inline templates for a group
 * 
 * @param  {String} group
 * @param  {Object} config
 * @return {String}
 */
function createHtml(group, config) {
	var html = '';
	for (var i in group){
		html += createTemplateHtml(i, group[i], config);
	}
	return html;
}

/**
 * Create the script tag for a template
 * 
 * @param  {String} name
 * @param  {String} path
 * @param  {Object} config
 * @return {String}
 */
function createTemplateHtml(name, path, config) {
	var prefix = config.identifier.prefix === null ? '' : config.identifier.prefix;
	var html = "<script type=\"" + config.identifier.type + "\" " + config.identifier.attribute 
				+ "=\"" + prefix + name + "\">";
	html += fs.readFileSync(path).toString();
	html += "</script>";
	return html;
}

module.exports = TemplateHelper;