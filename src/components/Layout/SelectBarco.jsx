import React from "react";
import Select from "react-select";
import PropTypes from "prop-types";

SelectBarco.propTypes = {
  data: PropTypes.array,
  field: PropTypes.object,
};
export function SelectBarco({ field, data }) {
  return (
    <>
      <>
        <Select
          defaultValue=""
          value={field.value}
          options={data.map((barco) => ({
            label: (
              <div style={{ display: "flex", justifyContent: "space-between",alignItems: "center" }}>
                {barco.nombre} / Capacidad: {barco.capacidadHuesped} pasajeros
                <img
                  src={barco.foto} // Aquí va la imagen en Base64
                  alt={barco.nombre}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                  }}
                />
              </div>
            ),
            value: barco.id,
          }))}
          placeholder="Seleccione un barco"
        />
      </>
    </>
  );
}