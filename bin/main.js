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
var buildDir = (function () {
    var e_2, _a;
    try {
        for (var _b = __values(["build", "dist"]), _c = _b.next(); !_c.done; _c = _b.next()) {
            var dir = _c.value;
            if (fs.existsSync(dir)) {
                return dir;
            }
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_2) throw e_2.error; }
    }
    throw new Error("Error: There is no dist or build folder !");
})();
if (!fs.existsSync((0, path_1.join)(buildDir, "index.html"))) {
    throw new Error("Error: There is no index.html file present !");
}
var originalRouterTs = fs.readFileSync(pathToRouterTs, {
    "encoding": "utf8",
});
var tempRouterTsPath = undefined;
if (originalRouterTs.includes("__BASE_URL__")) {
    var modifiedRouterTs = originalRouterTs.replace(/__BASE_URL__/g, 'process.env["PUBLIC_URL"]');
    tempRouterTsPath = pathToRouterTs.replace(".ts", ".temp_".concat(Date.now(), ".ts"));
    fs.writeFileSync(tempRouterTsPath, modifiedRouterTs);
}
var tmpDistDir = ".dist_tmp_xKLsKdIdJd";
try {
    (0, child_process_1.execSync)([
        pathToNode,
        (0, path_1.join)("node_modules", "typescript", "bin", "tsc"),
        "--outDir ".concat(tmpDistDir),
        "--rootDir ./src/",
        tempRouterTsPath !== null && tempRouterTsPath !== void 0 ? tempRouterTsPath : pathToRouterTs,
    ].join(" "));
}
catch (_b) { }
function createPathToRouter(fileType) {
    return (0, path_1.join)(tmpDistDir, (tempRouterTsPath !== null && tempRouterTsPath !== void 0 ? tempRouterTsPath : pathToRouterTs)
        .replace(/ts$/i, fileType)
        .split(path_1.sep)
        .slice(1)
        .join(path_1.sep));
}
var pathToRouterJs = createPathToRouter("js");
var pathToRouterCjs = createPathToRouter("cjs");
(0, child_process_1.execSync)("mv ".concat(pathToRouterJs, " ").concat(pathToRouterCjs));
var PUBLIC_URL = (function () {
    var homepage = JSON.parse(fs.readFileSync("package.json").toString("utf8"))["homepage"];
    var out = "/";
    if (homepage !== undefined) {
        out = (0, url_1.parse)(homepage).path;
    }
    return out === "/" ? "" : out;
})();
var paths = id(JSON.parse((0, child_process_1.execSync)([pathToNode, pathToRouterCjs].join(" "), {
    "env": {
        PUBLIC_URL: PUBLIC_URL,
    },
}).toString("utf8")))
    .map(function (path) { return (0, path_1.relative)(PUBLIC_URL || "/", path); })
    .filter(function (path) { return path !== ""; });
(0, child_process_1.execSync)("rm -r ".concat(tmpDistDir));
if (tempRouterTsPath !== undefined) {
    (0, child_process_1.execSync)("rm ".concat(tempRouterTsPath));
}
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