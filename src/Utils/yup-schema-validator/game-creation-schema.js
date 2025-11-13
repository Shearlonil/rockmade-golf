import * as yup from "yup";

const cashier_invoice_search_schema = yup.object().shape({
	invoice_id: yup
		.number()
		.positive('Invoice id must be greater than 1')
		.required("Invoice id is required"),
});

const course_selection_schema = yup.object().shape({
	course: yup.object().required("Select a Golf Course"),
	hole_mode: yup.object().required("Select number of holes to play")
});

const invoice_disc_schema = yup.object().shape({
	invoice_disc: yup
		.number()
		.nullable()
		.min(1, 'Invoice Discount cannot be less than 0')
		.required("Invoice Discount must be at least 0"),
	invoice_disc_type: yup
		.string()
		.required("Select an option")
		.oneOf(["n", "perc"], "Invalid option selected"),
});

const customer_selection_schema = yup.object().shape({
	customer: yup.object().required("Select a customer"),
	cash: yup
		.number()
		.nullable()
		.min(0, 'Cash amount cannot be less than 0')
		.required("Cash amount must be at least 0"),
	transfer: yup
		.number()
		.min(0, 'Transfer amount cannot be less than 0')
		.nullable()
		.required("Transfer amount must be at least 0"),
	atm: yup
		.number()
		.nullable()
		.min(0, 'POS/ATM amount cannot be less than 0')
		.required("POS/ATM amount must be at least 0"),
	print_receipt: yup.boolean(),
});

export { cashier_invoice_search_schema, course_selection_schema, customer_selection_schema, invoice_disc_schema };
