#!/usr/bin/env node

import { join, dirname, relative, sep } from "path";
import * as fs from "fs";
import { parse as parseUrl } from "url";
import { execSync } from "child_process";

/** https://docs.tsafe.dev/id  */
const id = <T>(x: T) => x;

const pathToNode = process.argv[0];
const pathToRouterTs = process.argv[2];
const buildDir = "build";

try {
    execSync(
        [
            pathToNode,
            join("node_modules", "typescript", "bin", "tsc"),
            `--outDir ${buildDir}`,
            pathToRouterTs,
        ].join(" "),
    );
} catch {}

const pathToRouterJs = join(
    buildDir,
    pathToRouterTs.replace(/ts$/i, "js").split(sep).slice(1).join(sep),
);

const publicUrl = parseUrl(
    JSON.parse(fs.readFileSync("package.json").toString("utf8"))["homepage"],
).path!;

const paths = id<string[]>(
    JSON.parse(
        execSync([pathToNode, pathToRouterJs].join(" "), {
            "env": {
                "PUBLIC_URL": publicUrl,
            },
        }).toString("utf8"),
    ),
)
    .map(path => relative(publicUrl, path))
    .filter(path => path !== "");

execSync(`rm ${pathToRouterJs}`);

const indexHtmlPath = join(buildDir, "index.html");

for (const path of paths) {
    execSync(`mkdir -p ${join(buildDir, dirname(path))}`);
    execSync(`cp ${indexHtmlPath} ${join(buildDir, path)}.html`);
}

execSync(`cp ${indexHtmlPath} ${join(buildDir, "404.html")}`);
