import React, { useEffect, useState } from "react";
import {IService} from "../interfaces/serviceInterface";

export const ServicesPage = () => {
    const [services, setServices] = useState<IService[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://localhost:7000/services")
            .then(res => res.json())
            .then(data => {
                setServices(data);
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Loading services...</p>;

    return (
        <div>
            <h1>Services</h1>
            <table border={1} cellPadding={5}>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Created At</th>
                    <th>Updated At</th>
                </tr>
                </thead>
                <tbody>
                {services.map((s) => (
                    <tr key={s._id ?? s.name}>
                        <td>{s._id ?? "N/A"}</td>
                        <td>{s.name}</td>
                        <td>{new Date(s.createdAt).toLocaleString()}</td>
                        <td>{new Date(s.updatedAt).toLocaleString()}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};
