import React, { useEffect, useState } from "react";

type DoctorForUI = {
    _id: string;
    name: string;
    surname: string;
    phone?: string;
    clinics: string[];
    services: string[];
};

type ServiceForUI = {
    _id: string;
    name: string;
    address?: string;
    phone?: string;
    clinics: string[];
    doctors: DoctorForUI[];
    createdAt?: string;
    updatedAt?: string;
};

const BACKEND_URL = "http://localhost:7000";

export default function ServicesPage() {
    const [services, setServices] = useState<ServiceForUI[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState(""); // текст пошуку
    const [sortAsc, setSortAsc] = useState(true); // сортування за назвою

    useEffect(() => {
        async function load() {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`${BACKEND_URL}/services`);
                if (!response.ok) throw new Error(`HTTP error ${response.status}`);

                const text = await response.text();
                let payload: any;
                try {
                    payload = JSON.parse(text);
                } catch {
                    throw new Error("Server returned HTML or invalid JSON");
                }

                const arr = Array.isArray(payload) ? payload : payload?.data ?? [];

                const normalized: ServiceForUI[] = arr.map((s: any) => {
                    const clinics = Array.isArray(s.clinics)
                        ? s.clinics.map((c: any) => (typeof c === "string" ? c : c.name ?? String(c._id ?? "")))
                        : [];

                    const doctors: DoctorForUI[] = Array.isArray(s.doctors)
                        ? s.doctors.map((d: any) => {
                            const dClinics = Array.isArray(d.clinics)
                                ? d.clinics.map((c: any) => (typeof c === "string" ? c : c.name ?? String(c._id ?? "")))
                                : [];
                            const dServices = Array.isArray(d.services)
                                ? d.services.map((sv: any) => (typeof sv === "string" ? sv : sv.name ?? String(sv._id ?? "")))
                                : [];
                            return {
                                _id: String(d._id ?? ""),
                                name: String(d.name ?? ""),
                                surname: String(d.surname ?? ""),
                                phone: d.phone ?? "",
                                clinics: dClinics,
                                services: dServices,
                            };
                        })
                        : [];

                    return {
                        _id: String(s._id ?? ""),
                        name: String(s.name ?? ""),
                        address: s.address ?? "",
                        phone: s.phone ?? "",
                        clinics,
                        doctors,
                        createdAt: s.createdAt,
                        updatedAt: s.updatedAt,
                    };
                });

                setServices(normalized);
            } catch (err: any) {
                console.error(err);
                setError(err.message || "Unknown error");
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    if (loading) return <p>Loading services...</p>;
    if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

    // Фільтрація та сортування
    const filteredServices = services
        .filter(s => s.name.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));

    return (
        <div>
            <h1>Services</h1>

            <div style={{ marginBottom: 16 }}>
                <input
                    type="text"
                    placeholder="Search services..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{ padding: 6, fontSize: 14, marginRight: 8 }}
                />
                <button onClick={() => setSortAsc(!sortAsc)}>
                    Sort {sortAsc ? "⬆️" : "⬇️"}
                </button>
            </div>

            <table border={1} cellPadding={5}>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Clinics</th>
                    <th>Doctors</th>
                    <th>Doctors' services</th>
                </tr>
                </thead>
                <tbody>
                {filteredServices.length === 0 ? (
                    <tr><td colSpan={5}>No services found</td></tr>
                ) : filteredServices.map((s) => {
                    const clinics = Array.from(new Set(s.doctors.flatMap(d => d.clinics)));
                    return (
                        <tr key={s._id}>
                            <td>{s._id}</td>
                            <td>{s.name}</td>
                            <td>{clinics.length ? clinics.join(", ") : "-"}</td>
                            <td>
                                {s.doctors.length
                                    ? s.doctors.map(d =>
                                        `${d.name} ${d.surname ?? ""}${d.phone ? ` (${d.phone})` : ""}`
                                    ).join(", ")
                                    : "-"}
                            </td>
                            <td>
                                {s.doctors.length
                                    ? Array.from(new Set(s.doctors.flatMap(d => d.services))).join(", ")
                                    : "-"}
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
}
