/* eslint-disable no-unused-vars */
//https://mui.com/material-ui/react-table/#sorting-amp-selecting
import * as React from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { visuallyHidden } from "@mui/utils";
import { useEffect } from "react";
import ReservaService from "../../services/ReservaService";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Button from "@mui/material/Button";
import { IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import {useUsuarioContext} from "../../context/usuarioContext";

ListReservas.propTypes = {
  data: PropTypes.array,
};

// Función para extraer el número de un string (ejemplo: "Habitacion10" -> 10)
function extractNumber(text) {
  const match = text.match(/\d+/); // Busca números en el string
  return match ? parseInt(match[0], 10) : 0; // Convierte a número o devuelve 0 si no hay número
}

// Función para comparar de forma descendente (mayor a menor)
function descendingComparator(a, b, orderBy) {
  const isNumericColumn = ["numero", "maxHuesped", "tamanno"].includes(orderBy);

  let aValue = a[orderBy];
  let bValue = b[orderBy];

  if (isNumericColumn) {
    aValue = parseFloat(aValue) || 0;
    bValue = parseFloat(bValue) || 0;
  } else {
    // Si la columna es "Descripcion", extraemos el número
    const aNum = extractNumber(aValue);
    const bNum = extractNumber(bValue);

    if (aNum !== bNum) {
      return bNum - aNum; // Comparación numérica
    }

    // Si no hay números o son iguales, comparar alfabéticamente
    aValue = aValue.toLowerCase();
    bValue = bValue.toLowerCase();
  }

  if (bValue < aValue) return -1;
  if (bValue > aValue) return 1;
  return 0;
}

// Función para definir el comparador de orden (ascendente o descendente)
function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Función para ordenar de forma estable
function stableSort(array, comparator) {
  return array
    .map((el, index) => [el, index])
    .sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1]; // Mantener estabilidad
    })
    .map((el) => el[0]);
}

//--- Encabezados de la tabla ---
const headCells = [
  {
    id: "idReserva",
    numeric: false,
    disablePadding: true,
    label: "Código de reserva",
  },
  {
    id: "usuario",
    numeric: false,
    disablePadding: false,
    label: "Usuario",
  },
  {
    id: "crucero",
    numeric: false,
    disablePadding: false,
    label: "Crucero",
  },

  {
    id: "fechaInicio",
    numeric: false,
    disablePadding: false,
    label: "Fecha de Inicio",
  },
  {
    id: "fechaFinal",
    numeric: false,
    disablePadding: false,
    label: "Fecha de regreso",
  },
];

//Encabezado tabla
function TableHabitacionesHead(props) {
  const { order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell></TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

//Propiedades Encabezado tabla
TableHabitacionesHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

//Barra de opciones
function TableHabitacionesToolbar(props) {
  const { numSelected } = props;
  const { idSelected } = props;
  const navigate = useNavigate();
  const update = () => {
    return navigate(`/habitacion/update/${idSelected}`);
  };
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Lista de reservas
          <br></br>
        </Typography>

        
        
      )}
      <Button
        style={{ marginRight: "15px", backgroundColor: "#16537e" }}
        component={Link}
        to="/reserva/crear"
        variant="contained"
        endIcon={<AddIcon />}
      >
        Reservar
      </Button>
      
    </Toolbar>
  );
}
//Propiedades Barra de opciones
TableHabitacionesToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  idSelected: PropTypes.number.isRequired,
};

//Componente tabla con hooks
export function ListReservas() {
  //Datos a cargar en la tabla
  const [data, setData] = useState(null);

  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);

  //Obtener lista del API (useEffect)
  useEffect(() => {
    ReservaService.getReservas()
      .then((response) => {
        console.log(response);
        setData(response.data);
        setError(response.error);
        setLoaded(true);
      })
      .catch((error) => {
        if (error instanceof SyntaxError) {
          setError(error);
          console.log(error);
          setLoaded(false);
          throw new Error("Respuesta no válida del servidor");
        }
      });
  }, []);

  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("idReserva");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleRequestSort = (event, property) => {
    let newOrder = "asc";

    if (orderBy === property) {
      newOrder = order === "asc" ? "desc" : "asc";
    }

    setOrder(newOrder);
    setOrderBy(property);
  };

  //Seleccionar solo un elemento de la tabla
  const handleClick = (event, name) => {
    let newSelected = [name];
    const selectedIndex = selected.indexOf(name);

    if (selectedIndex === 0) {
      newSelected = [];
    }
    setSelected(newSelected);
  };

  //Cambiar de página
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  //Cambiar cantidad de filas por página
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  //Cambiar densidad
  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  // Evita un salto de diseño al llegar a la última página con datos vacíos.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  // Usar el contexto para acceder al usuario
  const { usuario } = useUsuarioContext();

  if (!loaded) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      {data && data.length > 0 && (
        <Box sx={{ width: "100%" }}>
          <Paper sx={{ width: "100%", mb: 2 }}>
            <TableHabitacionesToolbar
              numSelected={selected.length}
              idSelected={Number(selected[0]) || 0}
            />
            <TableContainer>
              <Table
                sx={{ minWidth: 750 }}
                aria-labelledby="tableTitle"
                size={dense ? "small" : "medium"}
              >
                <TableHabitacionesHead
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={handleRequestSort}
                  rowCount={data.length}
                />
                <TableBody>
                  {stableSort(data, getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      const isItemSelected = isSelected(row.id);
                      const labelId = `enhanced-table-checkbox-${index}`;

                      return (
                        <TableRow
                          hover
                          onClick={(event) => handleClick(event, row.id)}
                          role="checkbox"
                          aria-checked={isItemSelected}
                          tabIndex={-1}
                          key={row.id}
                          selected={isItemSelected}
                          sx={{ cursor: "pointer" }}
                        >
                          {/* Contenido de la tabla */}
                          <TableCell
                            component="th"
                            id={labelId}
                            scope="data"
                            padding="none"
                          >
                            {row.title}
                          </TableCell>
                          <TableCell align="left">{row.idReserva}</TableCell>
                          <TableCell align="left">{usuario ? `${usuario.nombre} (${usuario.correoElectronico})` : ""}</TableCell>
                          <TableCell align="left">{row.crucero}</TableCell>
                          <TableCell align="left">
                            {new Date(row.fechaInicio).toLocaleDateString(
                              "es-CR",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                timeZone: "UTC",
                              }
                            )}
                          </TableCell>
                          <TableCell align="left">
                            {new Date(row.fechaFinal).toLocaleDateString(
                              "es-CR",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                timeZone: "UTC",
                              }
                            )}
                          </TableCell>
                          {/* Contenido de la tabla */}

                          <TableCell>
                            <IconButton
                              component={Link}
                              to={`/reserva/${row.idReserva}`}
                              aria-label="Detalle"
                              sx={{ ml: "auto", backgroundColor: "#00304E" }}
                            ></IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow
                      style={{
                        height: (dense ? 33 : 53) * emptyRows,
                      }}
                    >
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Paginación */}
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={data.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Filas por página"
              labelDisplayedRows={({ from, to, count }) =>
                `${from}-${to} de ${count} página(s)`
              }
            />
            {/* Paginación */}
          </Paper>

          {/* Espaciado */}
          <FormControlLabel
            control={<Switch checked={dense} onChange={handleChangeDense} />}
            label="Espaciado"
          />
        </Box>
      )}
    </>
  );
}
