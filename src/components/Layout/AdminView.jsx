import React from "react";
import Box from "@mui/material/Box";
import "../../App.css";
import { PiBoatFill } from "react-icons/pi";
import { MdOutlineBedroomParent } from "react-icons/md";
import { SiMentorcruise } from "react-icons/si";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { Outlet, Link } from "react-router-dom";

// Definimos las opciones de navegación con React Router
const NAVIGATION = [
  {

    segment: "habitaciones",
    title: "Habitaciones",
    icon: <MdOutlineBedroomParent />,
    link: <Link to="/admin/habitacion"className="dashboardLinks">Habitaciones</Link>,
  },
  {
    segment: "barcos",
    title: "Barcos",
    icon: <PiBoatFill />,
    link: <Link to="/admin/barco"className="dashboardLinks">Barcos</Link>,
  },
  {
    segment: "crucero",
    title: "Cruceros",
    icon: <SiMentorcruise />,
    link: <Link to="/admin/crucero"className="dashboardLinks">Cruceros</Link>,
  },
];


function DashboardLayoutBranding() {
  return (
    <AppProvider
      navigation={NAVIGATION.map((item) => ({
        title: item.link, // Aquí se usa el Link en lugar de solo el texto
        icon: item.icon,
      }))}
      branding={{
        logo: (
          <img
            src="../../uploads/LogoCrucerosAdventure.png"
            alt="Administración"
          />
        ),
        title: "Consola de administración",
        homeUrl: "/admin", // Ruta de inicio del panel
      }}
    >
      <DashboardLayout sx={{ width: "100%", overflowX: "hidden" }}>
        <Box
          sx={{
            flexGrow: 1,
            p: 4,
            minHeight: "calc(100vh - 64px)", // Resta el tamaño del header
            overflow: "hidden", // Evita el scroll innecesario
          }}
        >
          <Outlet /> {/*React Router renderizará el contenido aquí */}
        </Box>
      </DashboardLayout>
    </AppProvider>
  );
}

export function AdminView() {
  return <DashboardLayoutBranding />;
}
