const defaultRoleLabels = {
    "administrator": "Administrador",
    "author": "Autor",
    "contributor": "Colaborador",
    "curso_raul": "Curso de Raúl Pacheco",
    "editor": "Editor Página Web",
    "llamadas-comercia": "Comercia Llamadas IA",
    "recordatorios": "Llamadas de Recordatorio",
    "subscriber": "Usuario Golden",
    "suscriptor_ia_30": "Paquete 30 directores",
    "suscriptor_ia_90": "Paquete 90 directores",
    "shop_manager": "Gestor de la Tienda",
    "tutor_instructor": "Tutor Instructor",
    "customer": "Cliente",
    "wpseo_manager": "Manager SEO de la Web",
    "wpseo_editor": "Editor SEO de la Web",
    "etn-speaker": "Ponente de evento",
    "etn-organizer": "Organizador de evento",
    "etn-customer": "Cliente del evento",
    "suscriptor_directores_ia": "Cliente que compró nuestros directores de IA"
  };
  
  // Leer de localStorage y combinar con los datos por defecto
  const storedRoleLabels = JSON.parse(localStorage.getItem("roleLabels")) || {};
  const roleLabels = { ...defaultRoleLabels, ...storedRoleLabels };
  
  // Exportar para su uso en la aplicación
  export default roleLabels;
  
  // Función para agregar nuevos roles dinámicamente
  export const addRoleLabel = (key, label) => {
    const updatedRoleLabels = { ...roleLabels, [key]: label };
    localStorage.setItem("roleLabels", JSON.stringify(updatedRoleLabels));
  };
  