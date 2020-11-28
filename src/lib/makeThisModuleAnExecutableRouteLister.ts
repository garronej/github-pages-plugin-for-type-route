export type RouteDefs = {
    [routeName: string]: {
        "~internal": { path(arg: Record<string, unknown>): string | string[] };
    };
};

declare const document: any;

export function makeThisModuleAnExecutableRouteLister(
    routeDefs: RouteDefs,
): void {
    if (typeof document !== "undefined") {
        return;
    }

    const routeList = Object.keys(routeDefs)
        .map(routeName => routeDefs[routeName]["~internal"].path({}))
        .reduce<string[]>(
            (prev, curr) => [
                ...prev,
                ...(typeof curr === "string" ? [curr] : curr),
            ],
            [],
        );

    console.log(JSON.stringify(routeList));

    process.exit(0);
}
