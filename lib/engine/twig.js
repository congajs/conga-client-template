module.exports = {
	compile: function(src){

		var str = src
			.replace(/"/g, '\\"')
			.replace(/\r\n/g, "\\r\\n")
			.replace(/\r|\n/g, "\\n")
			.replace(/^\s*|\s*$/g, '');

		return 'function(obj){' +
			'return twig({data:"' + str + '"}).render(obj);' +
		'}';

	}
};