import * as st from "scripting-tools";
import { join, basename, dirname, relative } from "path";
import * as fs from "fs";
import { parse as parseUrl } from "url";
import { id } from "evt/tools/typeSafety/id";

const pathToNode = process.argv[0];
const pathToRouterTs = process.argv[2];
const buildDir = "build";

try {
    st.execSync(
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
    basename(pathToRouterTs.replace(/ts$/i, "js")),
);

const publicUrl = parseUrl(
    JSON.parse(fs.readFileSync("package.json").toString("utf8"))["homepage"],
).path!;

const paths = id<string[]>(
    JSON.parse(
        st.execSync([pathToNode, pathToRouterJs].join(" "), {
            "env": {
                "PUBLIC_URL": publicUrl,
            },
        }),
    ),
)
    .map(path => relative(publicUrl, path))
    .filter(path => path !== "");

st.execSync(`rm ${pathToRouterJs}`);

const indexHtmlPath = join(buildDir, "index.html");

for (const path of paths) {
    st.execSync(`mkdir -p ${join(buildDir, dirname(path))}`);
    st.execSync(`cp ${indexHtmlPath} ${join(buildDir, path)}.html`);
}
