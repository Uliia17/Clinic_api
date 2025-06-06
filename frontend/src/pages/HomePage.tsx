import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const HomePage = () => {
    const doctor = useSelector((state: RootState) => state.auth.me);

    return (
        <div style={{ padding: "20px" }}>
            <h1>Welcome to the clinic!</h1>

            {doctor ? (
                <nav>
                    <ul>
                        <li><Link to="/doctors">Doctors page</Link></li>
                        <li><Link to="/clinics">Clinics page</Link></li>
                        <li><Link to="/services">Services page</Link></li>
                    </ul>
                </nav>
            ) : (
                <>
                    <p>Login or register to see more</p>
                    <nav>
                        <ul>
                            <li><Link to="/login">Enter</Link></li>
                            <li><Link to="/register">Register</Link></li>
                        </ul>
                    </nav>
                </>
            )}
        </div>
    );
};

export { HomePage };



