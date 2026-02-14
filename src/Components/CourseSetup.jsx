import { useEffect, useState } from "react";
import { Button, Form, } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import AsyncSelect from 'react-select/async';
import Select from "react-select";
import Datetime from 'react-datetime';
import { yupResolver } from "@hookform/resolvers/yup";
import { subDays } from 'date-fns';

import { course_selection_schema } from "../Utils/yup-schema-validator/game-creation-schema";
import ErrorMessage from "./ErrorMessage";
import { useActiveCourses } from "../app-context/active-courses-context";


const CourseSetup = ({data, gameMode, handleSaveCourseSetting, btnRedText = 'Cancel', btnBlueText = 'Save', handleCancel, asyncCourseSearch}) => {

    const { courses } = useActiveCourses();
    const activeCourses = courses();

    const [ golfCourseOptions, setGolfCourseOptions ] = useState(null);
	const [holeOptions, setHoleOptions] = useState([]);
	const [holesLoading, setHolesLoading] = useState(true);

    const yesterday = subDays(new Date(), 1); // Subtracts 1 day from today to use as past dates
    const disablePastDt = current => current.isAfter(yesterday);

	const {
		register,
		handleSubmit,
		control,
		setValue,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(course_selection_schema),
		defaultValues: {
			course: null,
            startDate: new Date(),
		},
	});
        
    useEffect(() => {
        const options = activeCourses?.map(course => ({label: course.name, value: course}));
        setGolfCourseOptions(options);
        if(data){
            /*  this component can be loaded from different pages:
                1.  from GameMode to create new game
                2.  from GameBoard to change settings of yet to play or in-play games
                In case od GameMode, startDate will be available in data. While in GameBoard, the date field will be available due to data fetch from db.
                Hence, two different setup modes: newSetup and oldSetup.
                Because of these two reasons and the fact that this jsx only consumes the data prop, it makes sense to pass the data prop directly than using ongoingRound context.
                This data prop is passed from both GameMode and GameBoard jsx components
            */
            setValue('name', data.name);
            data.startDate ? newSetup(options) : oldSetup(options);
        }
    }, [data]);

    //  Handle golf course selection change
    const handleGolfCourseChange = (selectedCourse) => {
        const arr = [];
        if(selectedCourse?.value.no_of_holes === 18){
            let full = {label: 'Full 18', value: 1};
            let front = {label: 'Front 9', value: 2};
            let back = {label: 'Back 9', value: 3};
            arr.splice(0, 0, full, front, back);
        }else {
            arr.push({label: 'Front 9', value: 2});
        }
        setHoleOptions(arr);
        setHolesLoading(false);
        setValue("hole_mode", null);
        return arr;
    };

    const newSetup = (options) => {
        setValue('startDate', data.startDate); // startDate in GameMode.jsx and date in GameBoard.jsx
        const selectedCourse = options.find(opt => opt.value.id === data.course.value.id);
        const holeOpts = handleGolfCourseChange(selectedCourse);
        setValue('course', selectedCourse);
        switch (data.hole_mode.value) {
            case 1:
                setValue("hole_mode", holeOpts.find(opt => opt.value === 1));
                break;
            case 2:
                setValue("hole_mode", holeOpts.find(opt => opt.value === 2));
                break;
            case 3:
                setValue("hole_mode", holeOpts.find(opt => opt.value === 3));
                break;
            default:
                break;
        }
    }

    const oldSetup = (options) => {
        setValue('startDate', data.date); // startDate in GameMode.jsx and date in GameBoard.jsx
        const selectedCourse = options.find(opt => opt.value.id === data.course_id);
        const holeOpts = handleGolfCourseChange(selectedCourse);
        setValue('course', selectedCourse);
        switch (data.hole_mode) {
            case 1:
                setValue("hole_mode", holeOpts.find(opt => opt.value === 1));
                break;
            case 2:
                setValue("hole_mode", holeOpts.find(opt => opt.value === 2));
                break;
            case 3:
                setValue("hole_mode", holeOpts.find(opt => opt.value === 3));
                break;
            default:
                break;
        }
    }

    return (
        <div className="d-flex flex-column justify-content-center align-items-center text-center p-md-5 p-3 border rounded-4 bg-light shadow mb-5">
            <h2 className="mb-4">
                Select Course & Hole Type{" "}
                {gameMode && (
                    <span className="badge text-bg-info">
                        <small className="fw-bold text-white">{gameMode}</small>
                    </span>
                )}
            </h2>
            <Form className="mb-4 row d-flex justify-content-center">
                <div className="d-flex row">
                    <Form.Group className="col-12 col-md-6 mb-3">
                        <Form.Label className="fw-bold">Game Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Game Name"
                            {...register("name")}
                        />
                        <ErrorMessage source={errors.name} />
                    </Form.Group>

                    <Form.Group className="col-12 col-md-6 mb-3">
                        <Form.Label className="fw-bold">Game Date</Form.Label>
                        <Controller
                            name="startDate"
                            control={control}
                            render={({ field }) => (
                                <Datetime
                                    {...field}
                                    timeFormat={false}
                                    closeOnSelect={true}
                                    dateFormat="DD/MM/YYYY"
                                    isValidDate={disablePastDt}
                                    inputProps={{
                                        placeholder: "Choose date",
                                        className: "form-control",
                                        readOnly: true, // Optional: makes input read-only
                                    }}
                                    value={field.value ? new Date(field.value) :  null}
                                    onChange={(date) => field.onChange(date ? date.toDate() : null) }
                                    /*	react-hook-form is unable to reset the value in the Datetime component because of the below bug.
                                        refs:
                                            *	https://stackoverflow.com/questions/46053202/how-to-clear-the-value-entered-in-react-datetime
                                            *	https://stackoverflow.com/questions/69536272/reactjs-clear-date-input-after-clicking-clear-button
                                        there's clearly a rendering bug in component if you try to pass a null or empty value in controlled component mode: 
                                        the internal input still got the former value entered with the calendar (uncontrolled ?) despite the fact that that.state.value
                                        or field.value is null : I've been able to "patch" it with the renderInput prop :*/
                                    renderInput={(props) => {
                                        return <input {...props} value={field.value ? props.value : ''} />
                                    }}
                                />
                            )}
                        />
                        <ErrorMessage source={errors.startDate} />
                    </Form.Group>
                </div>

                <div className="d-flex row">
                    <Form.Group className="col-12 col-md-6 mb-3">
                        <Form.Label className="fw-bold">Choose Course</Form.Label>
                        <Controller
                            name="course"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                                <AsyncSelect
                                    name="course"
                                    value={value}
                                    className="text-dark w-100"
                                    isClearable
                                    // getOptionLabel={getOptionLabel}
                                    getOptionValue={(option) => option}
                                    // defaultValue={initialObject}
                                    defaultOptions={golfCourseOptions}
                                    cacheOptions
                                    loadOptions={asyncCourseSearch}
                                    onChange={(val) => {
                                        onChange(val);
                                        handleGolfCourseChange(val)} 
                                    }
                                />
                            )}
                        />
                        <ErrorMessage source={errors.course} />
                    </Form.Group>
                    <Form.Group className="col-12 col-md-6 mb-3">
                        <Form.Label className="fw-bold">How many holes are you playing?</Form.Label>
                        <Controller
                            name="hole_mode"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                                <Select
                                    required
                                    name="hole_mode"
                                    placeholder="Number of holes..."
                                    className="text-dark"
                                    isLoading={holesLoading}
                                    options={holeOptions}
                                    value={value}
                                    onChange={(val) => { onChange(val) }}
                                />
                            )}
                        />
                        <ErrorMessage source={errors.hole_mode} />
                    </Form.Group>
                </div>
            </Form>
            <div className="d-flex flex-row row justify-content-center container gap-3 flex-md-row-reverse mb-2">
                <Button onClick={handleSubmit(handleSaveCourseSetting)} className="me-2 btn-primary col-md-4 col-sm-12">
                    {btnBlueText}
                </Button>
                <Button variant="secondary" onClick={handleCancel} className="me-2 btn-danger col-md-4 col-sm-12" >
                    {btnRedText}
                </Button>
            </div>
        </div>
    )
}

export default CourseSetup;