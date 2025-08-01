import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),

    route("/admin", "./layouts/adminLayout.tsx", [
        index("./routes/admin/adminDashboard.tsx"),
        route("create-tickets", "./routes/admin/createTickets.tsx"),
        route("create-event", "./routes/admin/createEvent.tsx")
    ]),

    route("/login", "./routes/auth/login.tsx"),
    
    route("/customer", "./layouts/customerLayout.tsx", [
        index("./routes/customer/index.tsx")
    ])
] satisfies RouteConfig;
