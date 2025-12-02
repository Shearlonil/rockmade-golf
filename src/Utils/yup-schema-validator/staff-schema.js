import * as yup from "yup";

let email_regx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const schema = yup.object().shape({
    fname: yup.string().required("First Name is required!"),
    lname: yup.string().required("Last Name is required!"),
    email: yup
        .string()
        .email()
        .matches(email_regx, 'A valid personal email format email@mail.com is required').required("Email is required"),
    phone: yup.number().typeError("Must be a number").required("Phone number is required"),
    sex: yup.object().typeError("Select gender from the list").required("Select gender from the list"),
    authorities: yup.array(),
});

export { schema };