#!/usr/bin/env node

import { join, dirname, relative, sep } from "path";
import * as fs from "fs";
import { parse as parseUrl } from "url";
import { execSync } from "child_process";

/** https://docs.tsafe.dev/id  */
const id = <T>(x: T) => x;

const pathToNode = process.argv[0];
const pathToRouterTs = process.argv[2];
const buildDir = (()=>{
    for(const dir of ["build", "dist"]){
        if(fs.existsSync(dir)){
            return dir;
        }
    }
    throw new Error("Error: There is no dist or build folder !")
})();

if(!fs.existsSync(join(buildDir, "index.html"))){
    throw new Error("Error: There is no index.html file present !");
}

const tmpDistDir = ".dist_tmp_xKLsKdIdJd";

try {
    execSync(
        [
            pathToNode,
            join("node_modules", "typescript", "bin", "tsc"),
            `--outDir ${tmpDistDir}`,
            "--rootDir ./src/",
            pathToRouterTs,
        ].join(" "),
    );
} catch {}

function createPathToRouter(fileType: "js" | "cjs") {
    return join(
        tmpDistDir,
        pathToRouterTs.replace(/ts$/i, fileType).split(sep).slice(1).join(sep),
    )
}

const pathToRouterJs = createPathToRouter("js");
const pathToRouterCjs = createPathToRouter("cjs");

execSync(`mv ${pathToRouterJs} ${pathToRouterCjs}`);


const PUBLIC_URL = (() => {
    const homepage = JSON.parse(
        fs.readFileSync("package.json").toString("utf8"),
    )["homepage"];

    let out: string | undefined = "/";

    if (homepage !== undefined) {
        out = parseUrl(homepage).path;
    }

    return out === "/" ? "" : out;
})();

const paths = id<string[]>(
    JSON.parse(
        execSync([pathToNode, pathToRouterCjs].join(" "), {
            "env": {
                PUBLIC_URL,
            },
        }).toString("utf8"),
    ),
)
    .map(path => relative(PUBLIC_URL || "/", path))
    .filter(path => path !== "");

execSync(`rm -r ${tmpDistDir}`);

const indexHtmlPath = join(buildDir, "index.html");

for (const path of paths) {
    execSync(`mkdir -p ${join(buildDir, dirname(path))}`);
    execSync(`cp ${indexHtmlPath} ${join(buildDir, path)}.html`);
}

execSync(`cp ${indexHtmlPath} ${join(buildDir, "404.html")}`);
