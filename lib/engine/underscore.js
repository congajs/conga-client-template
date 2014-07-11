var _ = require('underscore');

module.exports = {
	compile: function(src, path, namespace){

		try {
			var func = _.template(src).source;
			return func;

		} catch (e){
			console.error('Unable to compile template: ' + src, e, e.stack);
			process.exit();
		}

	}
}