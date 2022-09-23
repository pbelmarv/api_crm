import React from "react";
import { Formik, Form, Field } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import Alerta from "./Alerta";
import Spinner from "./Spinner";

const Formulario = ({ cliente, cargando }) => {
    const navigate = useNavigate();

    // Creando un schema para yup
    const nuevoClienteSchema = Yup.object().shape({
        nombre: Yup.string()
            .min(3, "El nombre es muy corto")
            .max(50, "El nombre es muy largo")
            .required("El nombre del cliente es Obligatorio"),
        empresa: Yup.string().required(
            "El nombre de la empresa es obligatorio"
        ),
        email: Yup.string()
            .email("Email no válido")
            .required("El email es obligatorio"),
        telefono: Yup.number()
            .positive("Número no Válido")
            .integer("Número no Válido")
            .typeError("El número no es válido"),
    });

    const handleSubmit = async (values) => {
        // Guardamos los datos en un archivo Json
        try {
            let response;
            if (cliente.id) {
                // Editando un registro

                const url = `http://localhost:4000/clientes/${cliente.id}`;

                response = await fetch(url, {
                    method: "PUT",
                    body: JSON.stringify(values),
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
            } else {
                // Nuevo registro

                const url = "http://localhost:4000/clientes";

                response = await fetch(url, {
                    method: "POST",
                    body: JSON.stringify(values),
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
            }

            await response.json();
            navigate("/clientes");
        } catch (err) {
            console.log(err);
        }
    };

    return cargando ? (
        <Spinner />
    ) : (
        <>
            <div className="bg-white mt-10 px-5 py-10 rounded-xl shadow-lg md:w-3/4 mx-auto">
                <h1 className="text-gray-600 font-bold text-xl uppercase text-center">
                    {cliente?.nombre ? "Editar Cliente" : "Agregar Cliente"}
                </h1>

                <Formik
                    initialValues={{
                        nombre: cliente?.nombre ?? "",
                        empresa: cliente?.empresa ?? "",
                        email: cliente?.email ?? "",
                        telefono: cliente.telefono ?? "",
                        notas: cliente?.notas ?? "",
                    }}
                    enableReinitialize={true}
                    onSubmit={async (values, { resetForm }) => {
                        await handleSubmit(values);
                        resetForm();
                    }}
                    // Asignamos el formulario al Schema de Yup
                    validationSchema={nuevoClienteSchema}
                >
                    {({ errors, touched }) => {
                        // console.log(touched);
                        return (
                            <Form className="mt-10">
                                <div className="mb-4">
                                    <label
                                        className="text-gray-800"
                                        htmlFor="nombre"
                                    >
                                        Nombre:
                                    </label>
                                    <Field
                                        id="nombre"
                                        type="text"
                                        className="mt-2 block w-full p-3 bg-gray-150"
                                        placeholder="Nombre del Cliente"
                                        name="nombre"
                                    />
                                    {errors.nombre && touched.nombre ? (
                                        <Alerta>{errors.nombre}</Alerta>
                                    ) : null}
                                </div>
                                <div className="mb-4">
                                    <label
                                        className="text-gray-800"
                                        htmlFor="empresa"
                                    >
                                        Empresa:
                                    </label>
                                    <Field
                                        id="empresa"
                                        type="text"
                                        className="mt-2 block w-full p-3 bg-gray-150"
                                        placeholder="Empresa del Cliente"
                                        name="empresa"
                                    />
                                    {errors.empresa && touched.empresa ? (
                                        <Alerta>{errors.empresa}</Alerta>
                                    ) : null}
                                </div>
                                <div className="mb-4">
                                    <label
                                        className="text-gray-800"
                                        htmlFor="email"
                                    >
                                        Email:
                                    </label>
                                    <Field
                                        id="email"
                                        type="email"
                                        className="mt-2 block w-full p-3 bg-gray-150"
                                        placeholder="Email del Cliente"
                                        name="email"
                                    />
                                    {errors.email && touched.email ? (
                                        <Alerta>{errors.email}</Alerta>
                                    ) : null}
                                </div>
                                <div className="mb-4">
                                    <label
                                        className="text-gray-800"
                                        htmlFor="telefono"
                                    >
                                        Teléfono:
                                    </label>
                                    <Field
                                        id="telefono"
                                        type="tel"
                                        className="mt-2 block w-full p-3 bg-gray-150"
                                        placeholder="Teléfono del Cliente"
                                        name="telefono"
                                    />
                                    {errors.telefono && touched.telefono ? (
                                        <Alerta>{errors.telefono}</Alerta>
                                    ) : null}
                                </div>
                                <div className="mb-4">
                                    <label
                                        className="text-gray-800"
                                        htmlFor="notas"
                                    >
                                        Notas:
                                    </label>
                                    <Field
                                        as="textarea"
                                        id="notas"
                                        type="text"
                                        className="mt-2 block w-full p-3 bg-gray-150 h-40"
                                        placeholder="Notas del Cliente"
                                        name="notas"
                                    />
                                </div>

                                <input
                                    type="submit"
                                    value={
                                        cliente?.nombre
                                            ? "Editar Cliente"
                                            : "Agregar Cliente"
                                    }
                                    className="ease-in-out duration-300 mt-5 w-full bg-blue-800 p-3 text-white uppercase font-bold text-lg cursor-pointer"
                                />
                            </Form>
                        );
                    }}
                </Formik>
            </div>
        </>
    );
};

// DefaultProps: Si el prop esta presente toma los valores del prop, en caso que no
// tomará los valores por defecto
Formulario.defaultProps = {
    cliente: {},
    cargando: false,
};

export default Formulario;
