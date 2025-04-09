const defaultRoleLabels = {
    "administrator": "Administrator",
    "editor": "Editor",
    "author": "Author",
    "contributor": "Contributor",
    "subscriber": "Subscriber",
    "customer": "Customer",
    "shop_manager": "Shop Manager",
    "tutor_instructor": "Tutor Instructor",
    "wpseo_manager": "SEO Manager",
    "wpseo_editor": "SEO Editor",
    "etn-speaker": "Eventin Speaker",
    "etn-organizer": "Eventin Organizer",
    "etn-customer": "Eventin Customer",
    "suscriptor_directores_ia": "Suscriptor Directores IA",
    "suscriptor_ia_30": "Suscriptor IA 30",
    "suscriptor_ia_90": "Suscriptor IA 90",
    "recordatorios": "Recordatorios",
    "llamadas-comercia": "Llamadas-Comercia",
    "curso_raul": "Curso Raul",
    "oasis_club_customer": "Cliente Oasis Club",
    "elite_academy": "Elite Academy",

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
  