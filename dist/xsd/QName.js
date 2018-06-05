"use strict";
// This file is part of cxsd, copyright (c) 2015-2016 BusFaster Ltd.
// Released under the MIT license, see LICENSE.
Object.defineProperty(exports, "__esModule", { value: true });
/** Qualified name, including reference to a namespace. */
var QName = (function () {
    function QName(name, source) {
        if (name)
            this.parse(name, source);
    }
    /** Parse a name with a possible namespace prefix. */
    QName.prototype.parse = function (name, source, namespace) {
        var splitter = name.indexOf(':');
        name = name.toLowerCase();
        if (splitter >= 0) {
            namespace = source.lookupNamespace(name.substr(0, splitter));
            name = name.substr(splitter + 1);
        }
        else if (!namespace) {
            namespace = source.targetNamespace;
        }
        this.namespace = namespace;
        this.name = name;
        this.nameFull = namespace ? (namespace.id + ':' + name) : name;
        return (this);
    };
    /** Parse a class name internally used by the XSD parser. */
    QName.prototype.parseClass = function (name, namespace) {
        // TODO: remove following line.
        name = name.toLowerCase();
        this.namespace = namespace;
        this.name = name;
        this.nameFull = namespace.id + ':' + name;
        return (this);
    };
    QName.prototype.parsePrimitive = function (name, namespace) {
        // TODO: remove following line.
        name = name.toLowerCase();
        this.namespace = namespace;
        this.name = name;
        this.nameFull = '*:' + name;
        return (this);
    };
    /** Format name for printing (for debugging), together with namespace name. */
    QName.prototype.format = function () {
        if (this.namespace)
            return (this.namespace.name + ':' + this.name);
        else
            return (this.name);
    };
    return QName;
}());
exports.QName = QName;
//# sourceMappingURL=QName.js.map