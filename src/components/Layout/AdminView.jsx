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
    link: "/admin/habitacion", // Solo la ruta
  },
  {
    segment: "barcos",
    title: "Barcos",
    icon: <PiBoatFill />,
    link: "/admin/barco",
   
  },
  {
    segment: "crucero",
    title: "Cruceros",
    icon: <SiMentorcruise />,
    link: "/admin/crucero", // Solo la ruta
  },

];


function DashboardLayoutBranding() {
  return (
    <AppProvider
      navigation={NAVIGATION.map((item) => ({
        title: (
          // <Box sx={{ display: "flex", alignItems: "center", width: "100%", marginLeft:"12px"}}>
            <Link
              to={item.link}
              className="dashboardLinks"
              style={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                color: "inherit",
                width: "100%",
                paddingLeft: "25px",
                paddingRight: "23px",
                paddingTop: "12px",
                paddingBottom: "12px",
                marginLeft: "12px",
                marginRight: "25px",

              }}
            >
              {item.title}
              {/* <span style={{ paddingRight: "10px" }}>{item.title}</span> */}
            </Link>
          // </Box>
        ),
        icon: (
          // <Box sx={{ display: "flex", alignItems: "center", width: "100%",marginLeft:"-12px" }}>
            <Link
              to={item.link}
              className="dashboardLinks"
              style={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                color: "inherit",
                width: "100%",
                paddingLeft: "30px",
                paddingRight: "30px",
                paddingTop: "12px",
                paddingBottom: "12px",
                marginLeft: "-25px",
                // marginRight: "40px",
              }}
            >
              <span style={{ paddingRight: "0px" }}>{item.icon}</span>
            </Link>
          // </Box>
        ),
      }))}
      branding={{
        logo: (
          <></>
        ),
        title: "Vista de administrador",
        homeUrl: "/admin", // Ruta de inicio del panel
      }}
    >
      <DashboardLayout
        sx={{ width: "100%", overflowX: "hidden" }}
        showThemeToggle={false}
      >
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
