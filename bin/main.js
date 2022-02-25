#!/usr/bin/env node
"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var e_1, _a;
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var fs = require("fs");
var url_1 = require("url");
var child_process_1 = require("child_process");
/** https://docs.tsafe.dev/id  */
var id = function (x) { return x; };
var pathToNode = process.argv[0];
var pathToRouterTs = process.argv[2];
var buildDir = "build";
try {
    (0, child_process_1.execSync)([
        pathToNode,
        (0, path_1.join)("node_modules", "typescript", "bin", "tsc"),
        "--outDir ".concat(buildDir),
        pathToRouterTs,
    ].join(" "));
}
catch (_b) { }
var pathToRouterJs = (0, path_1.join)(buildDir, pathToRouterTs.replace(/ts$/i, "js").split(path_1.sep).slice(1).join(path_1.sep));
var publicUrl = (0, url_1.parse)(JSON.parse(fs.readFileSync("package.json").toString("utf8"))["homepage"]).path;
var paths = id(JSON.parse((0, child_process_1.execSync)([pathToNode, pathToRouterJs].join(" "), {
    "env": {
        "PUBLIC_URL": publicUrl,
    },
}).toString("utf8")))
    .map(function (path) { return (0, path_1.relative)(publicUrl, path); })
    .filter(function (path) { return path !== ""; });
(0, child_process_1.execSync)("rm ".concat(pathToRouterJs));
var indexHtmlPath = (0, path_1.join)(buildDir, "index.html");
try {
    for (var paths_1 = __values(paths), paths_1_1 = paths_1.next(); !paths_1_1.done; paths_1_1 = paths_1.next()) {
        var path = paths_1_1.value;
        (0, child_process_1.execSync)("mkdir -p ".concat((0, path_1.join)(buildDir, (0, path_1.dirname)(path))));
        (0, child_process_1.execSync)("cp ".concat(indexHtmlPath, " ").concat((0, path_1.join)(buildDir, path), ".html"));
    }
}
catch (e_1_1) { e_1 = { error: e_1_1 }; }
finally {
    try {
        if (paths_1_1 && !paths_1_1.done && (_a = paths_1.return)) _a.call(paths_1);
    }
    finally { if (e_1) throw e_1.error; }
}
(0, child_process_1.execSync)("cp ".concat(indexHtmlPath, " ").concat((0, path_1.join)(buildDir, "404.html")));
//# sourceMappingURL=main.js.map