conga-client-template
=====================

Overview
--------

This is a bundle for the [Conga.js](https://github.com/congajs/conga) framework which 
compiles templates in a project for client-side browser usage.

The bundle allows you to configure templates to be exported into a JST javascript file
which you can include or to output templates within script tags in your HTML template.

Configuration
-------------

    # config.yml
    client_templates:

        # JST templates (compiled into javascript files)
        jst:

            # namespace of exported object
            namespace: window.JST

            # engine configuration
            engine: 
                type: underscore

                # engine specific options
                options:

            # identifier options
            identifier:

                # should original namespace be included in identifier
                namespaced: true

            # the named bundles
            bundles:

                app:
                    route: /js/jst.app.js
                    paths:
                        - demo-bundle:client/*

        # inline html templates
        inline:

            # identifier options for rendered <script> tags
            identifier:

                # should original namespace be included in identifier
                namespaced: true

                # attribute name, i.e. data-template="my/template"
                attribute: data-template

                # a prefix to add to template names within the identifer attribute value
                prefix:

                # the value for the script type attribute
                type: text/template

            # the named bundles
            bundles:

                chat:
                    paths:
                        - demo-bundle:chat/*


Usage
-----

### JST example (jade):

Include compiled JST file:

    // layout.jade
    script(src='/js/jst.app.js')

Render a template

    var rendered = JST['demo-bundle:/client/my-template']({ foo : bar });

### Inline example (jade):

Add template helper:

This outputs all of the templates for a configured bundle name:

    // layout.jade
    != client_templates('app')

Example output:

    <script type="text/template" data-template="demo-bundle:chat/my-template">
    
        // template content

    </script>

Get a template:

    var template = $('[data-template="demo-bundle:chat/my-template"]').html();
