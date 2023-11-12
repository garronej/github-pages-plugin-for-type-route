#!/usr/bin/env node

import { join, dirname, relative, sep } from "path";
import * as fs from "fs";
import { parse as parseUrl } from "url";
import { execSync } from "child_process";

/** https://docs.tsafe.dev/id  */
const id = <T>(x: T) => x;

const pathToNode = process.argv[0];
const buildDir = "build";
const tmpDistDir = ".dist_tmp_xKLsKdIdJd";

const PUBLIC_URL = (() => {
    cra: {
        if (fs.existsSync("vite.config.ts")) {
            break cra;
        }

        const homepage = JSON.parse(
            fs.readFileSync("package.json").toString("utf8"),
        )["homepage"];

        let out: string | undefined = "/";

        if (homepage !== undefined) {
            out = parseUrl(homepage).path;
        }

        return out === "/" ? "" : out;
    }

    const viteConfigRaw = fs.readFileSync("vite.config.ts").toString("utf8");

    if (!/["']?base["']?:/.test(viteConfigRaw)) {
        return "/";
    }

    const baseRegex = /["']?base["']?:\s*[`'"]([^'"]+)[`'"],?/;
    const match = viteConfigRaw.match(baseRegex);

    if (match === null) {
        throw new Error(
            "Cannot parse your vite.config.ts file. Please add a base parameter to it.",
        );
    }

    return match[1];
})();

const { pathToModifiedRouterTs } = (() => {
    const pathToRouterTs = process.argv[2];
    const routerTsRaw = fs.readFileSync(pathToRouterTs).toString("utf8");

    //TODO: Modify routerTsRaw
    const routerTsRawModified = routerTsRaw.replace(
        /(process.env.PUBLIC_URL)|(import.meta.env.BASE_URL)/g,
        JSON.stringify(PUBLIC_URL),
    );
    const pathToModifiedRouterTs = join(
        dirname(pathToRouterTs),
        "router_tmp.ts",
    );

    fs.writeFileSync(
        pathToModifiedRouterTs,
        Buffer.from(routerTsRawModified, "utf8"),
    );

    return { pathToModifiedRouterTs };
})();

try {
    execSync(
        [
            pathToNode,
            join("node_modules", "typescript", "bin", "tsc"),
            `--outDir ${tmpDistDir}`,
            "--rootDir ./src/",
            pathToModifiedRouterTs,
        ].join(" "),
    );
} catch {}

execSync(`rm ${pathToModifiedRouterTs}`);

const pathToRouterJs = join(
    tmpDistDir,
    pathToModifiedRouterTs.replace(/ts$/i, "cjs").split(sep).slice(1).join(sep),
);

fs.renameSync(
    join(pathToRouterJs.replace(/cjs$/i, "js")),
    join(pathToRouterJs),
);

const paths = id<string[]>(
    JSON.parse(
        execSync([pathToNode, pathToRouterJs].join(" ")).toString("utf8"),
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
