import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {authActions} from "../redux/slices/authSlice";
import {IAuth} from "../interfaces/authInterface";
import {useAppDispatch, useAppSelector} from "../hooks/reduxHooks";

const LoginPage = () => {
    const { register, handleSubmit } = useForm<IAuth>();
    const { error } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const login: SubmitHandler<IAuth> = async (doctor) => {
        const { meta: { requestStatus } } = await dispatch(authActions.login({ doctor }));

        if (requestStatus === "fulfilled") {
            navigate("/");
        }
    };

    return (
        <form onSubmit={handleSubmit(login)}>
            <input type="text" placeholder="email" {...register("email")} />
            <input type="password" placeholder="password" {...register("password")} />
            <button>Login</button>
            {error && <div>Username or password incorrect</div>}
        </form>
    );
};

export { LoginPage };
