import * as yup from "yup";

const dispensaryPageSchema = yup.object().shape({
    course: yup.object().required("Select a golf course"),

    quantity_val: yup
        .number()
        .nullable()
        .positive("Quantity must be positive")
        .required("Dispense Quantity is required"),
    dispense_qty_type: yup
        .string()
        .required("Select an option")
        .oneOf(["Pkg", "Unit"], "Invalid quantity type selected"),

    store_qty: yup
        .number()
        .nullable()
        .positive("Quantity must be positive")
        .required("Store quantity required for the selected payment mode"),
    store_qty_type: yup
        .string()
        .required("Select an option")
        .oneOf(["Unit", "Pkg"], "Invalid quantity type selected"),
});

export { dispensaryPageSchema };
