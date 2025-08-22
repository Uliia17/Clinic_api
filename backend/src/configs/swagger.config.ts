import { OpenAPIV3 } from "openapi-types";

const swaggerDocument: OpenAPIV3.Document = {
    openapi: "3.0.0",
    info: {
        title: "Medical API Documentation",
        version: "1.0.0",
        description:
            "API documentation for Doctors, Clinics, Services and Auth",
    },
    servers: [
        {
            url: "http://localhost:7000",
            description: "Local server",
        },
    ],
    tags: [
        { name: "Auth", description: "Authentication endpoints" },
        { name: "Doctors", description: "Doctors endpoints" },
        { name: "Clinics", description: "Clinics endpoints" },
        { name: "Services", description: "Medical services endpoints" },
    ],
    paths: {
        // ---------- AUTH ----------
        "/auth/sign-up": {
            post: {
                tags: ["Auth"],
                summary: "Register new user",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    email: { type: "string", format: "email" },
                                    password: {
                                        type: "string",
                                        format: "password",
                                    },
                                    name: { type: "string" },
                                    surname: { type: "string" },
                                },
                                required: [
                                    "email",
                                    "password",
                                    "name",
                                    "surname",
                                ],
                            },
                        },
                    },
                },
                responses: {
                    "201": { description: "User successfully registered" },
                    "400": { description: "Bad request" },
                },
            },
        },
        "/auth/sign-in": {
            post: {
                tags: ["Auth"],
                summary: "Login user",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    email: { type: "string", format: "email" },
                                    password: {
                                        type: "string",
                                        format: "password",
                                    },
                                },
                                required: ["email", "password"],
                            },
                        },
                    },
                },
                responses: {
                    "200": { description: "User successfully logged in" },
                    "401": { description: "Unauthorized" },
                },
            },
        },
        "/auth/me": {
            get: {
                tags: ["Auth"],
                summary: "Get current authenticated user",
                security: [{ bearerAuth: [] }],
                responses: {
                    "200": { description: "User profile returned" },
                    "401": { description: "Unauthorized" },
                },
            },
        },

        // ---------- DOCTORS ----------
        "/doctors": {
            get: {
                tags: ["Doctors"],
                summary: "Get all doctors with pagination and filters",
                parameters: [
                    {
                        name: "page",
                        in: "query",
                        schema: { type: "integer", default: 1 },
                    },
                    {
                        name: "pageSize",
                        in: "query",
                        schema: { type: "integer", default: 10 },
                    },
                    { name: "search", in: "query", schema: { type: "string" } },
                    {
                        name: "specialization",
                        in: "query",
                        schema: { type: "string" },
                    },
                ],
                responses: {
                    "200": { description: "List of doctors with pagination" },
                },
            },
            post: {
                tags: ["Doctors"],
                summary: "Create new doctor",
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    name: { type: "string" },
                                    surname: { type: "string" },
                                    specialization: { type: "string" },
                                    hospitalId: { type: "string" },
                                },
                                required: ["name", "surname", "specialization"],
                            },
                        },
                    },
                },
                responses: {
                    "201": { description: "Doctor successfully created" },
                },
            },
        },
        "/doctors/{id}": {
            get: {
                tags: ["Doctors"],
                summary: "Get doctor by id",
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: { type: "string" },
                    },
                ],
                responses: { "200": { description: "Doctor details" } },
            },
            patch: {
                tags: ["Doctors"],
                summary: "Update doctor by id",
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: { type: "string" },
                    },
                ],
                responses: {
                    "200": { description: "Doctor updated successfully" },
                },
            },
            delete: {
                tags: ["Doctors"],
                summary: "Delete doctor by id",
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: { type: "string" },
                    },
                ],
                responses: {
                    "204": { description: "Doctor deleted successfully" },
                },
            },
        },

        // ---------- Clinics ----------
        "/Clinics": {
            get: {
                tags: ["Clinics"],
                summary: "Get all Clinics with pagination",
                parameters: [
                    {
                        name: "page",
                        in: "query",
                        schema: { type: "integer", default: 1 },
                    },
                    {
                        name: "pageSize",
                        in: "query",
                        schema: { type: "integer", default: 10 },
                    },
                    { name: "search", in: "query", schema: { type: "string" } },
                ],
                responses: {
                    "200": { description: "List of Clinics with pagination" },
                },
            },
            post: {
                tags: ["Clinics"],
                summary: "Create new hospital",
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    name: { type: "string" },
                                    address: { type: "string" },
                                    phone: { type: "string" },
                                },
                                required: ["name", "address"],
                            },
                        },
                    },
                },
                responses: {
                    "201": { description: "Hospital successfully created" },
                },
            },
        },
        "/Clinics/{id}": {
            get: {
                tags: ["Clinics"],
                summary: "Get hospital by id",
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: { type: "string" },
                    },
                ],
                responses: { "200": { description: "Hospital details" } },
            },
            patch: {
                tags: ["Clinics"],
                summary: "Update hospital by id",
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: { type: "string" },
                    },
                ],
                responses: {
                    "200": { description: "Hospital updated successfully" },
                },
            },
            delete: {
                tags: ["Clinics"],
                summary: "Delete hospital by id",
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: { type: "string" },
                    },
                ],
                responses: {
                    "204": { description: "Hospital deleted successfully" },
                },
            },
        },

        // ---------- SERVICES ----------
        "/services": {
            get: {
                tags: ["Services"],
                summary: "Get all services with pagination and filters",
                parameters: [
                    {
                        name: "page",
                        in: "query",
                        schema: { type: "integer", default: 1 },
                    },
                    {
                        name: "pageSize",
                        in: "query",
                        schema: { type: "integer", default: 10 },
                    },
                    { name: "search", in: "query", schema: { type: "string" } },
                ],
                responses: {
                    "200": { description: "List of services with pagination" },
                },
            },
            post: {
                tags: ["Services"],
                summary: "Create new service",
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    name: { type: "string" },
                                    description: { type: "string" },
                                    price: { type: "number" },
                                },
                                required: ["name", "price"],
                            },
                        },
                    },
                },
                responses: {
                    "201": { description: "Service successfully created" },
                },
            },
        },
        "/services/{id}": {
            get: {
                tags: ["Services"],
                summary: "Get service by id",
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: { type: "string" },
                    },
                ],
                responses: { "200": { description: "Service details" } },
            },
            patch: {
                tags: ["Services"],
                summary: "Update service by id",
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: { type: "string" },
                    },
                ],
                responses: {
                    "200": { description: "Service updated successfully" },
                },
            },
            delete: {
                tags: ["Services"],
                summary: "Delete service by id",
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: { type: "string" },
                    },
                ],
                responses: {
                    "204": { description: "Service deleted successfully" },
                },
            },
        },
    },
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
            },
        },
    },
};

export { swaggerDocument };
