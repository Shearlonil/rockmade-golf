import * as yup from "yup";

let email_regx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const schema = yup.object().shape({
    fname: yup.string().required("First Name is required"),
    lname: yup.string().required("Last Name is required"),
    // email: yup.string().email("Invalid email").required("Email is required"),
    dob: yup.date().required("date of birth is required"),
    sex: yup.object().typeError("Select gender from the list").required("Select gender from the list"),
    pw: yup.string().min(6, "Password must be at least 6 characters").required(),
    confirm_pw: yup.string().oneOf([yup.ref("pw"), null], "Passwords must match").required("Confirm Password is required"),
    country: yup.object().typeError("Select a country from the list").required("Select a country"),
    home_club: yup.object().typeError("Select your Home Club from the list").required("Home Club is required"),
    hcp: yup.number().typeError("HCP can only be a number").min(0, 'HCP cannot be less than 0').required('HCP is required'),
    // otp sent to mail for registration
    otp: yup.string().required('otp is required for email verfication'),
});

export const profile_update_schema = yup.object().shape({
    fname: yup.string().required("First Name is required"),
    lname: yup.string().required("Last Name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    phone_no: yup
        .string()
        .matches(/^\d{11}$/, "Phone number must be 11 digits")
        .required("Phone Number is required"),
    gender: yup.string().oneOf(["M", "F"], "Please select a gender").required(),
    username: yup.string().min(4, "Username must be at least 4 characters").required(),
});

export const emailSchema = yup.string().matches(email_regx, 'A valid email format example@mail.com is required');