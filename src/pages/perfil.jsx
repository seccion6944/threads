import { getAuth } from 'firebase/auth';

export default function Perfil() {
    const auth = getAuth();
    const usuario = auth.currentUser;

    return (
        <div>
            <h2>Perfil del Usuario</h2>
            <p>Nombre: {usuario?.displayName || 'Sin nombre'}</p>
            <p>Email: {usuario?.email}</p>
        </div>
    );
}
