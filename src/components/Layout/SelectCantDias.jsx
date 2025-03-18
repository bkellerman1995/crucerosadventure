import React from "react";
import Select from "react-select";
import PropTypes from "prop-types";

SelectCantDias.propTypes = {
  data: PropTypes.array,
  field: PropTypes.object,
};
export function SelectCantDias() {

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused
        ? "#ADD8E6" // Color cuando se hace hover
        : state.isSelected
        ? "white" // Color cuando está seleccionado (blanco)
        : "white", // Color normal
  
      color: state.isSelected ? "black" : "black", // Asegura que el texto sea visible
      cursor: "pointer", // Cambia el cursor al pasar el mouse
      transition: "background-color 0.2s ease-in-out", // Suaviza la transición de color
    }),
  
    control: (provided) => ({
      ...provided,
      borderColor: "gray",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#16537e", // Cambia el borde cuando pasas el mouse
      },
    }),
  
    menu: (provided) => ({
      ...provided,
      zIndex: 9999, // Asegura que el menú esté visible sobre otros elementos
    }),
  };

  return (
    <>
      <>
        <Select
          placeholder="Seleccione"
          styles={customStyles}
          options={[
            { label: "7", value: 7 },
            { label: "8", value: 7 },
            { label: "9", value: 7 },
            { label: "10", value: 7 },
            { label: "11", value: 7 },
            { label: "12", value: 7 },
            { label: "13", value: 7 },
            { label: "14", value: 14 },
          ]}
        />
      </>
    </>
  );
}