"use strict";
// This file is part of cxsd, copyright (c) 2015-2016 BusFaster Ltd.
// Released under the MIT license, see LICENSE.
Object.defineProperty(exports, "__esModule", { value: true });
var url = require("url");
/** Details of a single XSD source file. */
var Source = (function () {
    function Source(urlRemote, context, targetNamespace) {
        /** Table of namespace shorthand references (xmlns:...) used in this file. */
        this.namespaceRefTbl = {};
        var id = Source.list.length;
        this.context = context;
        this.id = id;
        this.url = urlRemote;
        this.urlOriginal = urlRemote;
        if (targetNamespace) {
            this.targetNamespace = targetNamespace;
            this.targetNamespace.addSource(this);
        }
        Source.list[id] = this;
    }
    /** Called by the parser, converts XSD attributes describing the schema into references to internal objects. */
    Source.prototype.parse = function (attrTbl) {
        // Unqualified tags are assumed to be in the default namespace.
        // For the schema file itself, it should be http://www.w3.org/2001/XMLSchema
        if (attrTbl['xmlns']) {
            this.defaultNamespace = this.context.registerNamespace(attrTbl['xmlns']);
        }
        // Everything defined in the current file belongs to the target namespace by default.
        if (attrTbl['targetnamespace']) {
            if (!this.targetNamespace) {
                this.targetNamespace = this.context.registerNamespace(attrTbl['targetnamespace'], this.urlOriginal);
                this.targetNamespace.addSource(this);
            }
        }
        // Read the current file's preferred shorthand codes for other XML namespaces.
        for (var _i = 0, _a = Object.keys(attrTbl); _i < _a.length; _i++) {
            var attr = _a[_i];
            if (attr.match(/^xmlns:/i)) {
                var short = attr.substr(attr.indexOf(':') + 1);
                this.namespaceRefTbl[short] = this.context.registerNamespace(attrTbl[attr]).init(null, short);
            }
        }
        // xml prefix may be used without defining xmlns:xml.
        this.namespaceRefTbl['xml'] = this.context.registerNamespace('http://www.w3.org/XML/1998/namespace');
    };
    /** Find a namespace according to its full name or the short name as used in this source file. */
    Source.prototype.lookupNamespace = function (ref) {
        return (this.namespaceRefTbl[ref] || this.context.getNamespace(ref));
    };
    /** Resolve a possible relative URL in the context of this source file. */
    Source.prototype.urlResolve = function (urlRemote) {
        return (url.resolve(this.targetNamespace.schemaUrl, urlRemote));
    };
    /** Update current remote address, in case the previous address got redirected. */
    Source.prototype.updateUrl = function (urlOld, urlNew) {
        this.url = urlNew;
        if (this.targetNamespace)
            this.targetNamespace.updateUrl(urlOld, urlNew);
    };
    Source.prototype.getNamespaceRefs = function () {
        return (this.namespaceRefTbl);
    };
    /** Internal list of source files indexed by a surrogate key. */
    Source.list = [];
    return Source;
}());
exports.Source = Source;
//# sourceMappingURL=Source.js.map