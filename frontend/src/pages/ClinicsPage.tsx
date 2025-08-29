import React, { useEffect, useState } from "react";
import { IClinic } from "../interfaces/clinicInterface";

function nameFromDoctorItem(d: any): string {
    if (!d && d !== 0) return "";
    if (typeof d === "string") return d;
    if (d.name || d.surname) return `${d.name ?? ""}${d.surname ? " " + d.surname : ""}`.trim();
    if (d.$oid) return String(d.$oid);
    if (d._id) return String(d._id);
    return String(d);
}

function nameFromServiceItem(s: any): string {
    if (!s && s !== 0) return "";
    if (typeof s === "string") return s;
    if (s.name) return String(s.name);
    if (s.$oid) return String(s.$oid);
    if (s._id) return String(s._id);
    return String(s);
}

export const ClinicsPage = () => {
    const [clinics, setClinics] = useState<IClinic[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [sortAsc, setSortAsc] = useState(true);

    useEffect(() => {
        fetch("http://localhost:7000/clinics", { mode: "cors" })
            .then((res) => {
                if (!res.ok) throw new Error(`Server error: ${res.status}`);
                return res.json();
            })
            .then((payload) => {
                const items = Array.isArray(payload) ? payload : payload?.data ?? [];
                setClinics(items);
            })
            .catch((err) => {
                console.error("Fetch clinics error:", err);
                setError(String(err.message ?? err));
                setClinics([]);
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p>Loading clinics...</p>;
    if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

    const filteredClinics = clinics
        .filter((c) =>
            c.name?.toLowerCase().includes(search.toLowerCase())
        )
        .sort((a, b) => {
            const nameA = a.name ?? "";
            const nameB = b.name ?? "";
            return sortAsc ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
        });

    return (
        <div>
            <h1>Clinics</h1>

            <div style={{ marginBottom: 16 }}>
                <input
                    type="text"
                    placeholder="Search by name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ padding: 6, fontSize: 14, marginRight: 8 }}
                />
                <button onClick={() => setSortAsc(!sortAsc)}>
                    Sort {sortAsc ? "⬆️" : "⬇️"}
                </button>
            </div>

            <table border={1} cellPadding={5}>
                <thead>
                <tr>
                    <th>ID</th><th>Name</th><th>Address</th><th>Phone</th><th>Doctors</th><th>Services</th>
                </tr>
                </thead>
                <tbody>
                {filteredClinics.length === 0 ? (
                    <tr><td colSpan={6}>No clinics found</td></tr>
                ) : filteredClinics.map((c) => (
                    <tr key={c._id ?? c.name}>
                        <td>{c._id ?? "N/A"}</td>
                        <td>{c.name}</td>
                        <td>{c.address ?? "-"}</td>
                        <td>{c.phone ?? "-"}</td>
                        <td>
                            {Array.isArray(c.doctors)
                                ? c.doctors.map(nameFromDoctorItem).filter(Boolean).join(", ")
                                : String(c.doctors ?? "-")}
                        </td>
                        <td>
                            {Array.isArray(c.services)
                                ? c.services.map(nameFromServiceItem).filter(Boolean).join(", ")
                                : String(c.services ?? "-")}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};
