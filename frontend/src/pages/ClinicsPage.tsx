import React, { useEffect, useState } from "react";
import {IClinic} from "../interfaces/clinicInterface";

export const ClinicsPage = () => {
    const [clinics, setClinics] = useState<IClinic[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://localhost:7000/clinics")
            .then((res) => res.json())
            .then((data) => {
                setClinics(data);
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Loading clinics...</p>;

    return (
        <div>
            <h1>Clinics</h1>
            <table border={1} cellPadding={5}>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Address</th>
                    <th>Phone</th>
                    <th>Doctors</th>
                    <th>Services</th>
                    <th>Created At</th>
                    <th>Updated At</th>
                </tr>
                </thead>
                <tbody>
                {clinics.map((c) => (
                    <tr key={c._id ?? c.name}>
                        <td>{c._id ?? "N/A"}</td>
                        <td>{c.name}</td>
                        <td>{c.address ?? "-"}</td>
                        <td>{c.phone ?? "-"}</td>
                        <td>{c.doctors?.join(", ") ?? "-"}</td>
                        <td>{c.services?.join(", ") ?? "-"}</td>
                        <td>{new Date(c.createdAt).toLocaleString()}</td>
                        <td>{new Date(c.updatedAt).toLocaleString()}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};
