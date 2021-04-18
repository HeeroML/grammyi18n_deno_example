import { Composer, } from '../composer.ts';
export class Router {
    constructor(router, routeHandlers = new Map()) {
        this.router = router;
        this.routeHandlers = routeHandlers;
    }
    route(route, ...middleware) {
        this.routeHandlers.set(route, new Composer(...middleware));
        return this;
    }
    otherwise(...middleware) {
        this.otherwiseHandler = new Composer(...middleware);
        return this;
    }
    middleware() {
        return new Composer()
            .lazy(ctx => {
            const route = this.router(ctx);
            return ((route === undefined
                ? this.otherwiseHandler
                : this.routeHandlers.get(route)) ?? []);
        })
            .middleware();
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicm91dGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFJSCxRQUFRLEdBQ1gsTUFBTSxnQkFBZ0IsQ0FBQTtBQXFCdkIsTUFBTSxPQUFPLE1BQU07SUFXZixZQUNxQixNQUFzQyxFQUNoRCxnQkFBZ0IsSUFBSSxHQUFHLEVBQXlCO1FBRHRDLFdBQU0sR0FBTixNQUFNLENBQWdDO1FBQ2hELGtCQUFhLEdBQWIsYUFBYSxDQUFtQztJQUN4RCxDQUFDO0lBVUosS0FBSyxDQUFDLEtBQWEsRUFBRSxHQUFHLFVBQWdDO1FBQ3BELElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxJQUFJLFFBQVEsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUE7UUFDMUQsT0FBTyxJQUFJLENBQUE7SUFDZixDQUFDO0lBVUQsU0FBUyxDQUFDLEdBQUcsVUFBZ0M7UUFDekMsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksUUFBUSxDQUFDLEdBQUcsVUFBVSxDQUFDLENBQUE7UUFDbkQsT0FBTyxJQUFJLENBQUE7SUFDZixDQUFDO0lBRUQsVUFBVTtRQUNOLE9BQU8sSUFBSSxRQUFRLEVBQUs7YUFDbkIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQTtZQUM5QixPQUFPLENBQ0gsQ0FBQyxLQUFLLEtBQUssU0FBUztnQkFDaEIsQ0FBQyxDQUFDLElBQUksQ0FBQyxnQkFBZ0I7Z0JBQ3ZCLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FDN0MsQ0FBQTtRQUNMLENBQUMsQ0FBQzthQUNELFVBQVUsRUFBRSxDQUFBO0lBQ3JCLENBQUM7Q0FDSiJ9