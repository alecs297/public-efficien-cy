import fs from "fs";

/**
 * Read dir and load routes from all .js files inside
 * 
 * @param {String} dir Current path
 * @param {String[]} routes Current routes
 * @returns {file: String, route: String} files and their routes
 */
async function buildRoutes(dir="api", routes=[]) {
    let files = fs.readdirSync(dir);

    for (let i = 0; i < files.length; i++) {
        let file = files[i];

        if (file.startsWith(".")) return;
        file = `${dir}/${file}`

        if (await fs.lstatSync(file).isDirectory()) {
            routes.concat(...(await buildRoutes(file, routes)));
        } else {
            if (file.endsWith(".js")) {
                routes.push(file)
            }
        }        
    }

    return routes;
}

/**
 * Adds routes to a router from a folder
 */
class ApiRouter {
    constructor (router) {
        this.router = router;
        this.routes = [];
    }

    async init() {
        const routes = await buildRoutes("api")

        await Promise.all(routes.map(async route => {
            const endpoint = (await import("../" + route))

            const final_urls = endpoint.custom_routes ? 
                endpoint.custom_routes.map(custom_route => {
                    return `/${route.split("/").slice(0, -1).join("/")}/${custom_route}`;
                })
                :
                ["/" + (route.slice(0, - (".js".length)))];
            
            final_urls.forEach(final_url => {
                if (endpoint.get) this.router.get(final_url, endpoint.get)
                if (endpoint.post) this.router.post(final_url, endpoint.get)
                this.routes.push({url: final_url, endpoint: endpoint})
            })
        }))
    }

}

export default ApiRouter;