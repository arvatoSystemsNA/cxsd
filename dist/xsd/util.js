"use strict";
// This file is part of cget, copyright (c) 2015 BusFaster Ltd.
// Released under the MIT license, see LICENSE.
Object.defineProperty(exports, "__esModule", { value: true });
// Define some simple utility functions to avoid depending on other packages.
var fs = require("fs");
var url = require("url");
var path = require("path");
var Promise = require("bluebird");
/** Asynchronous versions of fs methods, wrapped by Bluebird. */
exports.fsa = {
    stat: Promise.promisify(fs.stat),
    open: Promise.promisify(fs.open),
    close: Promise.promisify(fs.close),
    rename: Promise.promisify(fs.rename),
    mkdir: Promise.promisify(fs.mkdir),
    read: Promise.promisify(fs.read),
    readFile: Promise.promisify(fs.readFile),
    writeFile: Promise.promisify(fs.writeFile)
};
var againSymbol = {};
var again = function () { return againSymbol; };
/** Promise while loop. */
function repeat(fn) {
    return (Promise.try(function () {
        return fn(again);
    }).then(function (result) {
        return (result == againSymbol) ? repeat(fn) : result;
    }));
}
exports.repeat = repeat;
/** Copy all members of src object to dst object. */
function extend(dst, src) {
    for (var _i = 0, _a = Object.keys(src); _i < _a.length; _i++) {
        var key = _a[_i];
        dst[key] = src[key];
    }
    return (dst);
}
exports.extend = extend;
/** Make shallow clone of object. */
function clone(src) {
    return (extend({}, src));
}
exports.clone = clone;
/** Create a new directory and its parent directories.
 * If a path component to create conflicts with an existing file,
 * rename to file to <component>/<indexName>. */
function mkdirp(pathName, indexName) {
    var partList = path.resolve(pathName).split(path.sep);
    var prefixList = partList.slice(0);
    var pathPrefix;
    // Remove path components until an existing directory is found.
    return (repeat(function (again) {
        if (!prefixList.length)
            return;
        pathPrefix = prefixList.join(path.sep);
        return (Promise.try(function () { return exports.fsa.stat(pathPrefix); }).then(function (stats) {
            if (stats.isFile()) {
                // Trying to convert a file into a directory.
                // Rename the file to indexName and move it into the new directory.
                var tempPath = pathPrefix + '.' + makeTempSuffix(6);
                return (Promise.try(function () {
                    return exports.fsa.rename(pathPrefix, tempPath);
                }).then(function () {
                    return exports.fsa.mkdir(pathPrefix);
                }).then(function () {
                    return exports.fsa.rename(tempPath, path.join(pathPrefix, indexName));
                }));
            }
            else if (!stats.isDirectory()) {
                throw (new Error('Tried to create a directory inside something weird: ' + pathPrefix));
            }
        }).catch(function (err) {
            // Re-throw unexpected errors.
            if (err.code != 'ENOENT' && err.code != 'ENOTDIR')
                throw (err);
            prefixList.pop();
            return (again());
        }));
    })).then(function () { return Promise.reduce(
    // Create path components that didn't exist yet.
    partList.slice(prefixList.length), function (pathPrefix, part, index, len) {
        var pathNew = pathPrefix + path.sep + part;
        return (Promise.try(function () {
            return exports.fsa.mkdir(pathNew);
        }).catch(function (err) {
            // Because of a race condition with simultaneous cache stores,
            // the directory might already exist.
            if (err.code != 'EEXIST')
                throw (err);
        }).then(function () {
            return pathNew;
        }));
    }, pathPrefix); });
}
exports.mkdirp = mkdirp;
/** Create a string of random letters and numbers. */
function makeTempSuffix(length) {
    return (Math.floor((Math.random() + 1) * Math.pow(36, length))
        .toString(36)
        .substr(1));
}
exports.makeTempSuffix = makeTempSuffix;
function sanitizePath(path) {
    return (path
        .replace(/[^-_./0-9A-Za-z]/g, '_')
        .replace(/(^|\/)[-_./]+/g, '$1')
        .replace(/[-_./]+($|\/)/g, '$1'));
}
exports.sanitizePath = sanitizePath;
function isDir(cachePath) {
    return (exports.fsa.stat(cachePath).then(function (stats) { return stats.isDirectory(); }).catch(function (err) { return false; }));
}
exports.isDir = isDir;
function sanitizeUrl(urlRemote) {
    var urlParts = url.parse(urlRemote, false, true);
    var origin = urlParts.host;
    if (urlParts.pathname.charAt(0) != '/')
        origin += '/';
    origin += urlParts.pathname;
    return ([
        urlParts.protocol || 'http:',
        '//',
        url.resolve('', origin),
        urlParts.search || ''
    ].join(''));
}
exports.sanitizeUrl = sanitizeUrl;
//# sourceMappingURL=util.js.map