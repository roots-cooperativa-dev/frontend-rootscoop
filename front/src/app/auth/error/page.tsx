export default function ErrorPage({ searchParams }: { searchParams: { message?: string } }) {
    const isBanned = searchParams?.message === "Error al crear el usuario"

    return (
        <div style={{ padding: "2rem", fontFamily: "sans-serif", textAlign: "center" }}>
            <h1 style={{ fontSize: "2rem", color: "#d00000" }}>Acceso denegado</h1>
            <p style={{ fontSize: "1.2rem", marginTop: "1rem" }}>
                {isBanned
                    ? "Tu cuenta ha sido suspendida o estás bloqueado para acceder al sistema. Si creés que esto es un error, por favor contactá al administrador."
                    : searchParams?.message
                        ? decodeURIComponent(searchParams.message)
                        : "Ocurrió un error inesperado."}
            </p>
        </div>
    )
}
