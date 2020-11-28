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
var st = require("scripting-tools");
var path_1 = require("path");
var fs = require("fs");
var url_1 = require("url");
var id_1 = require("evt/tools/typeSafety/id");
var pathToNode = process.argv[0];
var pathToRouterTs = process.argv[2];
var buildDir = "build";
try {
    st.execSync([
        pathToNode,
        path_1.join("node_modules", "typescript", "bin", "tsc"),
        "--outDir " + buildDir,
        pathToRouterTs,
    ].join(" "));
}
catch (_b) { }
var pathToRouterJs = path_1.join(buildDir, path_1.basename(pathToRouterTs.replace(/ts$/i, "js")));
var publicUrl = url_1.parse(JSON.parse(fs.readFileSync("package.json").toString("utf8"))["homepage"]).path;
var paths = id_1.id(JSON.parse(st.execSync([pathToNode, pathToRouterJs].join(" "), {
    "env": {
        "PUBLIC_URL": publicUrl,
    },
})))
    .map(function (path) { return path_1.relative(publicUrl, path); })
    .filter(function (path) { return path !== ""; });
st.execSync("rm " + pathToRouterJs);
var indexHtmlPath = path_1.join(buildDir, "index.html");
try {
    for (var paths_1 = __values(paths), paths_1_1 = paths_1.next(); !paths_1_1.done; paths_1_1 = paths_1.next()) {
        var path = paths_1_1.value;
        st.execSync("mkdir -p " + path_1.join(buildDir, path_1.dirname(path)));
        st.execSync("cp " + indexHtmlPath + " " + path_1.join(buildDir, path) + ".html");
    }
}
catch (e_1_1) { e_1 = { error: e_1_1 }; }
finally {
    try {
        if (paths_1_1 && !paths_1_1.done && (_a = paths_1.return)) _a.call(paths_1);
    }
    finally { if (e_1) throw e_1.error; }
}
//# sourceMappingURL=main.js.map