// components/ConnectStrava.tsx
'use client';

export default function ConnectStrava() {
  const handleConnect = () => {
    const params = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID!,
      redirect_uri: `${window.location.origin}/api/strava/callback`,
      response_type: 'code',
      scope: 'activity:read_all',
    });
    window.location.href = `https://www.strava.com/oauth/authorize?${params}`;
  };

  return (
<div className="btn_strava">
<button 
  onClick={handleConnect}
  style={{ 
    background: '#FC4C02', 
    border: 'none',
    borderRadius: "50%", 
    cursor: 'pointer', 
    fontWeight: 500,
    // Estilos añadidos para el círculo perfecto:
    width: '50px',       // Ajusta el tamaño que necesites
    height: '50px',      // Debe ser igual al width
    padding: '0',        // Elimina el padding por defecto del botón
    display: 'flex',     // Centra el icono dentro del círculo
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',      // Asegura que el icono de Strava se vea blanco
    fontSize: '24px'     // Ajusta el tamaño del icono según el tamaño del círculo
  }}
>
  <i className="bi bi-strava"></i>
</button>
</div>
  );
}