import React from "react";
import Select from "react-select";
import PropTypes from "prop-types";

SelectPuerto.propTypes = {
  data: PropTypes.array.isRequired,
  field: PropTypes.object.isRequired,
  onChange: PropTypes.func,
};

export function SelectPuerto({ field, data, onChange }) {
  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#ADD8E6" : state.isSelected ? "white" : "white",
      color: state.isSelected ? "black" : "black",
      cursor: "pointer",
      transition: "background-color 0.2s ease-in-out",
    }),
    control: (provided) => ({
      ...provided,
      borderColor: "gray",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#16537e",
      },
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
  };

  const options = data.map((puerto) => ({
    label: `${puerto.nombre} / País: ${puerto.pais.descripcion}`,
    value: puerto.idPuerto,  // Aseguramos que sea `idPuerto`
    obj: puerto, // Guardamos el objeto completo
  }));
  
  const selectedOption = options.find((opt) => opt.value === field.value) || null;
  
  return (
    <Select
      styles={customStyles}
      options={options}
      placeholder="Seleccione un puerto"
      value={selectedOption} // Mantiene la opción seleccionada
      onChange={(selectedOption) => {
        field.onChange(selectedOption.value); // Guarda solo el ID en react-hook-form
        if (onChange) onChange(selectedOption.obj); // Guarda el objeto completo en selectedPuerto
      }}
    />
  );
}
