type RouteHandler = (params: Record<string, string>) => void;

interface Route {
  pattern: RegExp;
  paramNames: string[];
  handler: RouteHandler;
}

/**
 * Minimal hash-based SPA router.
 * Maps URL hashes like #/posts/123 to view handlers.
 */
export class Router {
  private routes: Route[] = [];

  /** Registers a route pattern and its handler */
  public on(path: string, handler: RouteHandler): this {
    // Convert :param segments to named regex groups
    const paramNames: string[] = [];
    const regexStr = path.replace(/:([a-zA-Z]+)/g, (_match, name: string) => {
      paramNames.push(name);
      return "([^/]+)";
    });

    this.routes.push({
      pattern: new RegExp(`^${regexStr}$`),
      paramNames,
      handler,
    });

    return this;
  }

  /** Starts listening to hash changes and resolves the current hash */
  public start(): void {
    window.addEventListener("hashchange", () => this.resolve());
    this.resolve();
  }

  /** Navigates to the given hash path */
  public static navigate(path: string): void {
    window.location.hash = path;
  }

  /** Resolves the current hash against registered routes */
  private resolve(): void {
    const hash = window.location.hash.slice(1) || "/";

    for (const route of this.routes) {
      const match = hash.match(route.pattern);
      if (match) {
        const params: Record<string, string> = {};
        route.paramNames.forEach((name, i) => {
          params[name] = match[i + 1];
        });
        route.handler(params);
        return;
      }
    }

    // Default: redirect to feed if logged in, else to login
    const token = localStorage.getItem("token");
    Router.navigate(token ? "/feed" : "/login");
  }
}
