"use strict";
// This file is part of cxsd, copyright (c) 2015-2016 BusFaster Ltd.
// Released under the MIT license, see LICENSE.
Object.defineProperty(exports, "__esModule", { value: true });
var Scope_1 = require("./Scope");
/** Parser state, passed around between functions. */
var State = (function () {
    function State(parent, rule, source) {
        if (parent) {
            this.stateStatic = parent.stateStatic;
            this.parent = parent;
            this.source = parent.source;
            this.scope = new Scope_1.Scope(parent.scope);
        }
        else {
            this.source = source;
            this.scope = new Scope_1.Scope(null);
        }
        this.rule = rule;
    }
    State.prototype.getScope = function () { return (this.scope); };
    State.prototype.setScope = function (scope) { this.scope = scope; };
    /** Begin capturing text content between tags, sent to the handler of the innermost tag. */
    State.prototype.startText = function (xsdElement) {
        this.stateStatic.textHandlerList[this.stateStatic.textDepth++] = xsdElement;
    };
    /** Finish capturing text content. */
    State.prototype.endText = function () { --this.stateStatic.textDepth; };
    return State;
}());
exports.State = State;
//# sourceMappingURL=State.js.map