"use strict";
// This file is part of cxsd, copyright (c) 2015-2016 BusFaster Ltd.
// Released under the MIT license, see LICENSE.
Object.defineProperty(exports, "__esModule", { value: true });
var expat = require("node-expat");
//import * as sax from 'sax';
var Promise = require("bluebird");
var Rule_1 = require("./Rule");
var types = require("./types");
var State_1 = require("./State");
var QName_1 = require("./QName");
/** Parse syntax rules encoded into handler classes. */
function parseRule(ctor, context) {
    if (ctor.rule)
        return ctor.rule;
    var rule = new Rule_1.Rule(ctor);
    ctor.rule = rule;
    for (var _i = 0, _a = ctor.mayContain(); _i < _a.length; _i++) {
        var baseFollower = _a[_i];
        var follower = baseFollower;
        var followerName = new QName_1.QName().parseClass(follower.name, context.xsdSpace);
        rule.followerTbl[followerName.nameFull] = parseRule(follower, context);
        rule.followerTbl[followerName.name] = parseRule(follower, context);
    }
    var obj = new ctor();
    for (var _b = 0, _c = Object.keys(obj); _b < _c.length; _b++) {
        var key = _c[_b];
        rule.attributeList.push(key);
    }
    return (rule);
}
var Parser = (function () {
    function Parser(context) {
        /** Temporarily holds a qualified name, re-used to avoid allocating objects. */
        this.qName = new QName_1.QName();
        /** List of parser states still needing further processing
          * after previous stage is done. */
        this.pendingList = [];
        this.context = context;
        this.rootRule = parseRule(types.Root, context);
    }
    Parser.prototype.startElement = function (state, name, attrTbl) {
        var qName = this.qName;
        qName.parse(name, state.source, state.source.defaultNamespace);
        var rule = state.rule;
        if (rule) {
            rule = (rule.followerTbl[qName.nameFull] ||
                rule.followerTbl[qName.name] ||
                rule.followerTbl['*']);
            // if(!rule) console.log('Unhandled child ' + state.rule.qName.nameFull + ' -> ' + qName.nameFull);
        }
        state = new State_1.State(state, rule);
        if (!rule || !rule.proto)
            return (state);
        var xsdElem = new rule.proto(state);
        state.xsdElement = xsdElem;
        // Make all attributes lowercase.
        for (var _i = 0, _a = Object.keys(attrTbl); _i < _a.length; _i++) {
            var key = _a[_i];
            var keyLower = key.toLowerCase();
            if (key != keyLower && !attrTbl.hasOwnProperty(keyLower)) {
                attrTbl[keyLower] = attrTbl[key];
            }
        }
        // Copy known attributes to XSD element.
        for (var _b = 0, _c = rule.attributeList; _b < _c.length; _b++) {
            var key = _c[_b];
            if (attrTbl.hasOwnProperty(key)) {
                xsdElem[key] = attrTbl[key];
            }
        }
        if (xsdElem.init) {
            state.attributeTbl = attrTbl;
            xsdElem.init(state);
        }
        return (state);
    };
    Parser.prototype.init = function (cached, source, loader) {
        var _this = this;
        var state = new State_1.State(null, this.rootRule, source);
        var importList = [];
        var xml = new expat.Parser(null);
        // var xml = sax.createStream(true, { position: true });
        state.stateStatic = {
            context: this.context,
            addImport: function (namespaceTarget, urlRemote) {
                importList.push({ namespace: namespaceTarget, url: urlRemote });
            },
            getLineNumber: function () {
                return (xml.getCurrentLineNumber());
                // return(0);
            },
            getBytePos: function () {
                return (xml.getCurrentByteIndex());
                // return(0);
            },
            textDepth: 0,
            textHandlerList: []
        };
        var stateStatic = state.stateStatic;
        var resolve;
        var reject;
        var promise = new Promise(function (res, rej) {
            resolve = res;
            reject = rej;
        });
        var stream = cached.stream;
        var pendingList = this.pendingList;
        xml.on('startElement', function (name, attrTbl) {
            // xml.on('opentag', (node: sax.Tag) => {
            // var name = node.name;
            // var attrTbl = node.attributes;
            try {
                state = _this.startElement(state, name, attrTbl);
            }
            catch (err) {
                // Exceptions escaping from node-expat's event handlers cause weird effects.
                console.error(err);
                console.log('Stack:');
                console.error(err.stack);
            }
        });
        xml.on('endElement', function (name) {
            // xml.on('closetag', function() {
            if (state.xsdElement) {
                if (state.xsdElement.loaded) {
                    state.xsdElement.loaded(state);
                }
                if (state.xsdElement.resolve) {
                    // Schedule resolve hook to run after parsing is done.
                    // It might depend on definitions in scope but appearing later,
                    // and selectively postponing only hooks that cannot run yet
                    // would be extremely complicated.
                    pendingList.push(state);
                }
            }
            state = state.parent;
        });
        xml.on('text', function (text) {
            if (stateStatic.textDepth) {
                stateStatic.textHandlerList[stateStatic.textDepth - 1].addText(state, text);
            }
        });
        xml.on('error', function (err) {
            console.error(err);
        });
        // Expat-specific handler.
        stream.on('data', function (data) {
            xml.parse(data, false);
        });
        stream.on('end', function () {
            // xml.on('end', () => {
            // Finish parsing the file (synchronous call).
            xml.parse('', true); // Expat-specific line.
            resolve(importList.map(function (spec) {
                console.log('IMPORT into ' + spec.namespace.name + ' from ' + spec.url);
                return (loader.importFile(spec.url, spec.namespace));
            }));
        });
        // stream.pipe(xml);
        return (promise);
    };
    /** Bind references, call after all imports have been initialized. */
    Parser.prototype.resolve = function () {
        for (var pos = 0; pos < this.pendingList.length; ++pos) {
            var state = this.pendingList[pos];
            try {
                state.xsdElement.resolve(state);
            }
            catch (err) {
                console.error(err + ' on line ' + state.xsdElement.lineNumber + ' of ' + state.source.url);
                console.log('Stack:');
                console.error(err.stack);
            }
        }
        this.pendingList = [];
    };
    return Parser;
}());
exports.Parser = Parser;
//# sourceMappingURL=Parser.js.map