import React, { useEffect, useState } from "react";
import { IDoctor } from "../interfaces/doctorInterface";

export const DoctorsPage = () => {
    const [doctors, setDoctors] = useState<IDoctor[]>([]);
    const [loading, setLoading] = useState(true);

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

    return (
        <div>
            <h1>Doctors</h1>
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
                {doctors.length === 0 ? (
                    <tr><td colSpan={8}>No doctors found</td></tr>
                ) : (
                    doctors.map((d) => (
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

