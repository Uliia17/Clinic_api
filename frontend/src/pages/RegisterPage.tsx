import React, { useState } from "react";

const BACKEND_URL = "http://localhost:7000";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [clinics, setClinics] = useState(""); // comma-separated
    const [services, setServices] = useState(""); // comma-separated

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        try {
            const body = {
                name,
                surname,
                phone,
                email,
                password,
                clinics: clinics.split(",").map((c) => c.trim()).filter(Boolean),
                services: services.split(",").map((s) => s.trim()).filter(Boolean),
            };

            const res = await fetch(`${BACKEND_URL}/auth/signUp`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Registration failed");
            }

            setMessage("Registration successful!");
            setName("");
            setSurname("");
            setPhone("");
            setEmail("");
            setPassword("");
            setClinics("");
            setServices("");
        } catch (err: any) {
            setMessage(`Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={containerStyle}>
            <h1>Register</h1>
            {message && <div style={messageStyle}>{message}</div>}
            <form onSubmit={handleSubmit} style={formStyle}>
                <label style={labelStyle}>
                    Name:
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        style={inputStyle}
                    />
                </label>
                <label style={labelStyle}>
                    Surname:
                    <input
                        type="text"
                        value={surname}
                        onChange={(e) => setSurname(e.target.value)}
                        style={inputStyle}
                    />
                </label>
                <label style={labelStyle}>
                    Phone:
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        style={inputStyle}
                    />
                </label>
                <label style={labelStyle}>
                    Email:
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={inputStyle}
                    />
                </label>
                <label style={labelStyle}>
                    Password:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={inputStyle}
                    />
                </label>
                <label style={labelStyle}>
                    Clinics (comma-separated):
                    <input
                        type="text"
                        value={clinics}
                        onChange={(e) => setClinics(e.target.value)}
                        style={inputStyle}
                    />
                </label>
                <label style={labelStyle}>
                    Services (comma-separated):
                    <input
                        type="text"
                        value={services}
                        onChange={(e) => setServices(e.target.value)}
                        style={inputStyle}
                    />
                </label>
                <button type="submit" style={buttonStyle} disabled={loading}>
                    {loading ? "Registering..." : "Register"}
                </button>
            </form>
        </div>
    );
}

const containerStyle: React.CSSProperties = {
    maxWidth: 400,
    margin: "50px auto",
    padding: 20,
    border: "1px solid #ccc",
    borderRadius: 8,
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
};

const formStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
};

const labelStyle: React.CSSProperties = {
    marginBottom: 12,
    display: "flex",
    flexDirection: "column",
    fontWeight: 500,
};

const inputStyle: React.CSSProperties = {
    padding: 8,
    fontSize: 14,
    borderRadius: 4,
    border: "1px solid #ccc",
};

const buttonStyle: React.CSSProperties = {
    padding: 10,
    fontSize: 16,
    borderRadius: 4,
    border: "none",
    backgroundColor: "#007bff",
    color: "#fff",
    cursor: "pointer",
};

const messageStyle: React.CSSProperties = {
    marginBottom: 16,
    color: "green",
    fontWeight: 500,
};
