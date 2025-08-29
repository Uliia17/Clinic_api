import React, { useEffect, useState } from "react";
import { IDoctor } from "../interfaces/doctorInterface";

export const DoctorsPage = () => {
    const [doctors, setDoctors] = useState<IDoctor[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState(""); // для пошуку
    const [sortField, setSortField] = useState<keyof IDoctor>("name"); // для сортування

    useEffect(() => {
        fetch("http://localhost:7000/doctors")
            .then(res => res.json())
            .then(data => {
                setDoctors(data.data || []);
                setLoading(false);
            })
            .catch(() => {
                setDoctors([]);
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Loading doctors...</p>;

    const filteredDoctors = doctors
        .filter(d =>
            [d.name, d.surname, d.phone, d.email]
                .filter(Boolean)
                .some(val => val!.toLowerCase().includes(search.toLowerCase()))
        )
        .sort((a, b) => {
            const valA = String(a[sortField] ?? "");
            const valB = String(b[sortField] ?? "");
            return valA.localeCompare(valB);
        });

    return (
        <div style={{ padding: 16 }}>
            <h1>Doctors</h1>

            <div style={{ marginBottom: 12 }}>
                <input
                    type="text"
                    placeholder="Search by name, surname, phone, email"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ padding: 6, width: 300, marginRight: 12 }}
                />
                <label>
                    Sort by:{" "}
                    <select value={sortField} onChange={(e) => setSortField(e.target.value as keyof IDoctor)}>
                        <option value="name">Name</option>
                        <option value="surname">Surname</option>
                    </select>
                </label>
            </div>

            <table border={1} cellPadding={5}>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Email</th>
                    <th>Name</th>
                    <th>Surname</th>
                    <th>Phone</th>
                    <th>Clinics</th>
                    <th>Services</th>
                    <th>Role</th>
                </tr>
                </thead>
                <tbody>
                {filteredDoctors.length === 0 ? (
                    <tr><td colSpan={8}>No doctors found</td></tr>
                ) : (
                    filteredDoctors.map((d) => (
                        <tr key={d._id}>
                            <td>{d._id}</td>
                            <td>{d.email}</td>
                            <td>{d.name}</td>
                            <td>{d.surname}</td>
                            <td>{d.phone}</td>
                            <td>{(d.clinics || []).join(", ")}</td>
                            <td>{(d.services || []).join(", ")}</td>
                            <td>{d.role}</td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    );
};


