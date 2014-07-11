module.exports = {
	compile: function(src, path, namespace){

		var str = src
			.replace(/"/g, '\\"')
			.replace(/\r\n/g, "\\r\\n")
			.replace(/\r|\n/g, "\\n")
			.replace(/^\s*|\s*$/g, '');

		return '(function(twig){' +
			'var t=twig({id:"' + namespace + '",data:"' + str + '",allowInlineIncludes:true});' +
			'return function(d){' +
				'return twig({ref:"' + namespace + '"}).render(d);' +
			'};' +
		'}(twig));'

	}
};