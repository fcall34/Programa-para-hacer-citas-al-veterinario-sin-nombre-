import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function VerifyEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/verify-email/${token}`
        );

        const data = await res.json();

        if (data.success) {
          setStatus("success");
        } else {
          setStatus("error");
        }
      } catch (err) {
        setStatus("error");
      }
    };

    verify();
  }, [token]);

  if (status === "loading") {
    return <h2>Verificando tu correo...</h2>;
  }

  if (status === "success") {
    return (
      <div>
        <h2>✅ Correo verificado</h2>
        <p>Ya puedes iniciar sesión.</p>
      </div>
    );
  }

  return (
    <div>
      <h2>❌ Enlace inválido o expirado</h2>
      <p>Solicita un nuevo correo de verificación.</p>
    </div>
  );
}
