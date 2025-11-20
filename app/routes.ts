import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  route("/", "routes/mainLayout.tsx", [
    index("routes/home.tsx"),
    route("crearEnvio", "routes/crearEnvio.tsx"),
    route("configuracion", "routes/actualizarEnvio.tsx"),
  ]),
] satisfies RouteConfig;
