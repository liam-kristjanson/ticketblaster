import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),

    route("/admin", "./layouts/adminLayout.tsx", [
        index("./routes/admin/adminDashboard.tsx"),
        route("create-tickets", "./routes/admin/createTickets.tsx"),
        route("create-event", "./routes/admin/createEvent.tsx"),
        route("event", "./routes/admin/event.tsx")
    ]),

    route("/login", "./routes/auth/login.tsx"),
    
    route("/customer", "./layouts/customerLayout.tsx", [
        index("./routes/customer/index.tsx"),
        route("event", "./routes/customer/event.tsx"),
        route("checkout", "./routes/customer/checkout.tsx")
    ]),

    route("/host", "./layouts/hostLayout.tsx", [
        index("./routes/host/index.tsx"),
        route("create-event", "./routes/host/createEvent.tsx"),
        route("event", "./routes/host/eventDashboard.tsx")
    ])
] satisfies RouteConfig;
