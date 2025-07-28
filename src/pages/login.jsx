import { useEffect, useState } from "react";
import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    signInWithPopup
} from "firebase/auth";
import { auth } from "../componentes/firebase";
import { useNavigate } from "react-router-dom";
import ThreadsLoader from "./ThreadsLoader";

export default function Registrarse() {
    const [titulo] = useState("Threads - Iniciar sesión");
    const [exito, setExito] = useState("");
    const [error, setError] = useState("");
    const [email, setEmail] = useState("");
    const [contra, setContra] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 2500);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        document.title = titulo;
    }, [titulo]);

    const provider = new GoogleAuthProvider();

    const registrarConGoogle = async () => {
        try {
            const resultado = await signInWithPopup(auth, provider);
            setExito("Inicio de sesión con Google exitoso.");
            setError("");
            console.log("Usuario con Google:", resultado.user);
            navigate("/");
        } catch (error) {
            if (error.code === "auth/email-already-in-use") {
                setError("Este correo ya está registrado.");
            }
            else if (error.code == "auth/network-request-failed") {
                setError("No estás conectado a internet.")
            }
            else {
                setError("Error al registrar con Google.");
            }
            console.error("Error al registrar con Google:", error.message);
        }
    };

    const registrarCorreoConContra = async () => {
        try {
            const resultado = await createUserWithEmailAndPassword(auth, email, contra);
            setExito("Usuario registrado correctamente.");
            setError("");
            console.log("Nuevo usuario:", resultado.user);
        } catch (error) {
            if (error.code === "auth/email-already-in-use") {
                setError("Este correo ya está registrado.");
            } else {
                setError("Error al registrar el usuario.");
                console.error("Error de registro:", error);
            }
        }
    };

    const iniciarSesionConEmail = async () => {
        if (!email || !contra) {
            setError("Debes ingresar correo y contraseña.");
            return;
        }

        try {
            const resultado = await signInWithEmailAndPassword(auth, email, contra);
            setExito("Inicio de sesión exitoso.");
            setError("");
            console.log("Usuario con correo", resultado.user);
            navigate("/");
        } catch (error) {
            if (error.code === "auth/user-not-found") {
                setError("No existe una cuenta con ese correo.");
            } else if (error.code === "auth/wrong-password") {
                setError("La contraseña es incorrecta.");
            } else {
                setError("Error al iniciar sesión.");
            }
            console.error("Error:", error.message);
        }
    };

    return (
        <>
            {loading ? (
                <ThreadsLoader />
            ) : (
                <section className="tarjeta">
                    <header className="encabezado">
                        <img src="/threads.ico" alt="Ícono" />
                        <h4 className="titulo">Inicia sesión con tu cuenta de Threads</h4>
                        {error && <p className="error">{error}</p>}
                        {exito && <p className="exito">{exito}</p>}
                        <input
                            type="text"
                            className="campo"
                            placeholder="Correo electrónico"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <input
                            type="password"
                            className="campo"
                            placeholder="Contraseña"
                            value={contra}
                            onChange={(e) => setContra(e.target.value)}
                        />
                        <button className="boton-iniciar_sesion" onClick={iniciarSesionConEmail}>
                            Iniciar sesión
                        </button>

                        <button className="boton" onClick={registrarCorreoConContra}>
                            Registrarse
                        </button>
                        {/* <button className="boton" onClick={registrarConGoogle}>
                            Iniciar sesión con Google
                        </button> */}
                    </header>
                </section>
            )}
        </>
    );
}
