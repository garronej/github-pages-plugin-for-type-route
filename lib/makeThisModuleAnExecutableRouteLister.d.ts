export declare type RouteDefs = {
    [routeName: string]: {
        "~internal": {
            path(arg: Record<string, unknown>): string | string[];
        };
    };
};
export declare function makeThisModuleAnExecutableRouteLister(routeDefs: RouteDefs): void;
