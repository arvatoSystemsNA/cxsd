"use strict";
// This file is part of cxsd, copyright (c) 2015-2016 BusFaster Ltd.
// Released under the MIT license, see LICENSE.
Object.defineProperty(exports, "__esModule", { value: true });
var cmd = require("commander");
var cget_1 = require("cget");
var Context_1 = require("./xsd/Context");
var Loader_1 = require("./xsd/Loader");
var Exporter_1 = require("./xsd/Exporter");
var schema = require("./schema");
var AddImports_1 = require("./schema/transform/AddImports");
var Sanitize_1 = require("./schema/transform/Sanitize");
(cmd.version(require('../package.json').version)
    .arguments('<url>')
    .description('XSD download and conversion tool')
    .option('-t, --out-ts <path>', 'Output TypeScript definitions under <path>')
    .option('-j, --out-js <path>', 'Output JavaScript modules under <path>')
    .action(handleConvert)
    .parse(process.argv));
if (process.argv.length < 3)
    cmd.help();
function handleConvert(urlRemote, opts) {
    var schemaContext = new schema.Context();
    var xsdContext = new Context_1.Context(schemaContext);
    var fetchOptions = { allowRemote: true, allowLocal: true };
    var jsCache = new cget_1.Cache(opts['outJs'] || 'xmlns', { indexName: '_index.js' });
    var tsCache = new cget_1.Cache(opts['outTs'] || 'xmlns', { indexName: '_index.d.ts' });
    var loader = new Loader_1.Loader(xsdContext, fetchOptions);
    loader.import(urlRemote).then(function (namespace) {
        try {
            Exporter_1.exportNamespace(xsdContext.primitiveSpace, schemaContext);
            Exporter_1.exportNamespace(xsdContext.xmlSpace, schemaContext);
            var spec = Exporter_1.exportNamespace(namespace, schemaContext);
            var addImports = new AddImports_1.AddImports(spec);
            var sanitize = new Sanitize_1.Sanitize(spec);
            var importsAdded = addImports.exec();
            // Find ID numbers of all types imported from other namespaces.
            importsAdded.then(function () {
                // Rename types to valid JavaScript class names,
                // adding a prefix or suffix to duplicates.
                return sanitize.exec();
            }).then(function () {
                return sanitize.finish();
            }).then(function () {
                return addImports.finish(importsAdded.value());
            }).then(function () {
                return new schema.exporter.JS(spec, jsCache).exec();
            }).then(function () {
                return new schema.exporter.TS(spec, tsCache).exec();
            });
        }
        catch (err) {
            console.error(err);
            console.log('Stack:');
            console.error(err.stack);
        }
    });
}
//# sourceMappingURL=cli.js.map