import * as yup from "yup";

const course_selection_schema = yup.object().shape({
	game_name: yup.string().required("Game name is required"),
	course: yup.object().required("Select a Golf Course"),
	hole_mode: yup.object().required("Select number of holes to play")
});

export { course_selection_schema };
