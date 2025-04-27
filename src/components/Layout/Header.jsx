import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { Menu, MenuItem } from "@mui/material";
import { Link } from "react-router-dom";
import Badge from "@mui/material/Badge";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircle from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import LiveTvIcon from "@mui/icons-material/LiveTv";
import Tooltip from "@mui/material/Tooltip";
import { useUsuarioContext } from "../../context/usuarioContext";
import { motion } from "framer-motion";

export default function Header() {
  //Gestión menu usuario
  const [anchorElUser, setAnchorEl] = React.useState(null);
  //Gestión menu opciones
  const [mobileOpcionesAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  //Booleano Menu opciones responsivo
  const isMobileOpcionesMenuOpen = Boolean(mobileOpcionesAnchorEl);
  //Gestión menu principal
  const [anchorElPrincipal, setAnchorElPrincipal] = React.useState(null);
  //Abierto menu usuario
  const handleUserMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  //Cerrado menu usuario
  const handleUserMenuClose = () => {
    setAnchorEl(null);
    handleOpcionesMenuClose();
  };
  //Abierto menu principal
  const handleOpenPrincipalMenu = (event) => {
    setAnchorElPrincipal(event.currentTarget);
  };
  //Cerrado menu principal
  const handleClosePrincipalMenu = () => {
    setAnchorElPrincipal(null);
  };
  //Abierto menu opciones
  const handleOpcionesMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };
  //Cerrado menu opciones
  const handleOpcionesMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  // Usar el contexto para acceder al usuario
  const { usuario } = useUsuarioContext();

  // Verificar si usuario es null antes de intentar acceder a 'tipo'
  if (!usuario) {
    return <div></div>; // Puedes mostrar un mensaje o spinner mientras se carga
  }

  let navItems = [];

  //Lista enlaces menu usuario
  const userItems = [
    { name: "Login", link: "/user/login", login: false },
    { name: "Registrarse", link: "/user/create", login: false },
    { name: "Logout", link: "/user/logout", login: true },
  ];

  //Filtrar el navbar segun el tipo de usuario
  usuario.tipo === "admin"
    ? // Lista enlaces menu principal
      (navItems = [
        {
          name: "Home",
          image: "../../uploads/LogoTransparente.png",
          link: "/",
        },
        { name: "Admin", link: "/admin" },
        { name: "Habitaciones", link: "/habitacion" },
        { name: "Barcos", link: "/barco" },
        { name: "Cruceros", link: "/crucero" },
        { name: "Reservas", link: "/reserva" },
      ])
    : (navItems = [
        {
          name: "Home",
          image: "../../uploads/LogoTransparente.png",
          link: "/",
        },
        { name: "Habitaciones", link: "/habitacion" },
        { name: "Barcos", link: "/barco" },
        { name: "Cruceros", link: "/crucero" },
        { name: "Reservas", link: "/reserva" },
      ]);

  // Identificador menu principal
  const menuIdPrincipal = "menu-appbar";

  // Menu Principal
  const menuPrincipal = (
    <Box sx={{ display: { xs: "none", sm: "block" } }}>
      {navItems &&
        usuario &&
        navItems.map((item, index) => {
          return (
            <Button
              key={index}
              component={Link}
              to={item.link}
              color="secondary"
            >
              {item.name === "Home" ? (
                <img
                  src={item.image}
                  alt="Logo"
                  style={{ width: "80px", height: "80px" }} // Ajusta el tamaño según sea necesario
                />
              ) : (
                <Typography textAlign="center">{item.name}</Typography>
              )}
            </Button>
          );
        })}
    </Box>
  );
  //Menu Principal responsivo
  const menuPrincipalMobile = navItems.map((page, index) => (
    <MenuItem key={index} component={Link} to={page.link}>
      <Typography sx={{ textAlign: "center" }}>{page.name}</Typography>
    </MenuItem>
  ));
  //Identificador menu usuario
  const userMenuId = "user-menu";
  //Menu Usuario
  const userMenu = (
    <Box sx={{ flexGrow: 0 }}>
      <IconButton
        size="large"
        edge="end"
        aria-label="account of current user"
        aria-controls={userMenuId}
        aria-haspopup="true"
        onClick={handleUserMenuOpen}
        color="inherit"
      >
        <AccountCircle />
      </IconButton>

      <Menu
        sx={{ mt: "45px" }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorElUser)}
        onClose={handleUserMenuClose}
      >
        <MenuItem>
          <Typography variant="subtitle1" gutterBottom>
            Email usuario
          </Typography>
        </MenuItem>

        {userItems.map((setting, index) => {
          return (
            <MenuItem key={index} component={Link} to={setting.link}>
              <Typography sx={{ textAlign: "center" }}>
                {setting.name}
              </Typography>
            </MenuItem>
          );
        })}
      </Menu>
    </Box>
  );
  //Identificador menu opciones
  const menuOpcionesId = "badge-menu-mobile";
  //Menu opciones responsivo
  const menuOpcionesMobile = (
    <Menu
      anchorEl={mobileOpcionesAnchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuOpcionesId}
      keepMounted
      open={isMobileOpcionesMenuOpen}
      onClose={handleOpcionesMenuClose}
    >
      <MenuItem>
        <IconButton size="large" color="inherit">
          <Badge badgeContent={4} color="primary">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
        <p>Compras</p>
      </MenuItem>
      <MenuItem>
        <IconButton size="large" color="inherit">
          <Badge badgeContent={17} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notificaciones</p>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.5,
          duration: 1,
          ease: "easeIn",
        }}
        style={{ overflow: "hidden" }} // Para que no se vean los elementos durante la animación
      >
        <AppBar
          position="static"
          color="primaryLight"
          sx={{ backgroundColor: "primaryLight.main" }}
        >
          <Toolbar>
            <IconButton
              size="large"
              color="inherit"
              aria-controls={menuIdPrincipal}
              aria-haspopup="true"
              sx={{ mr: 2 }}
              onClick={handleOpenPrincipalMenu}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id={menuIdPrincipal}
              anchorEl={anchorElPrincipal}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElPrincipal)}
              onClose={handleClosePrincipalMenu}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              {menuPrincipalMobile}
            </Menu>

            {/* Enlace página inicio */}
            <Tooltip title="Cruceros Adventure">
              <IconButton
                size="large"
                edge="end"
                component="a"
                href="/"
                aria-label="Cruceros Adventure"
                color="primary"
              >
                <LiveTvIcon />
              </IconButton>
            </Tooltip>

            {/* Enlace página inicio */}
            {menuPrincipal}
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              <IconButton size="large" color="inherit">
                <Badge badgeContent={4} color="primary">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
              <IconButton size="large" color="inherit">
                <Badge badgeContent={17} color="primary">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Box>
            <div>{userMenu}</div>
            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="show more"
                aria-controls={menuOpcionesId}
                aria-haspopup="true"
                onClick={handleOpcionesMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
      </motion.div>

      {menuOpcionesMobile}
    </Box>
  );
}
