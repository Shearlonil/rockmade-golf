import { useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';
import AsyncSelect from 'react-select/async';
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';

import { ThreeDotLoading } from '../react-loading-indicators/Indicator';
import handleErrMsg from '../../Utils/error-handler';
import ErrorMessage from '../ErrorMessage';

const AsyncSearchDialog = ({ show, handleClose, handleSubmitResult, message, searchFn, mapFn, networkRequest }) => {

    const schema = yup.object().shape({
        entity: yup.object().typeError("Make a valid selection").required("Required"),
    });

    const [entityOptions, setEntityOptions] = useState([]);

    const modalLoaded = () => {
    };

    const minimizeModal = () => {
        handleClose();
    }

    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({resolver: yupResolver(schema),});
    
    const onSubmit = async (data) => {
        await handleSubmitResult(data.entity.value);
    };

    const asyncSearch = async (inputValue, callback) => {
        /*  refs: https://stackoverflow.com/questions/65963103/how-can-i-setup-react-select-to-work-correctly-with-server-side-data-by-using  */
        try {
            const results = await searchFn(inputValue);
            setEntityOptions(results);
            callback(results);
        } catch (error) {
            if (error.name === 'AbortError' || error.name === 'CanceledError') {
                // Request was intentionally aborted, handle silently
                return;
            }
            toast.error(handleErrMsg(error).msg);
        }
    };

    return (
        <Modal show={show} onHide={minimizeModal} onEntered={modalLoaded}>
            <Modal.Header closeButton>
                <Modal.Title>{message}</Modal.Title>
            </Modal.Header>
            <Form>
                <Modal.Body>
                    <div className="d-flex flex-column">
                        <Controller
                            name="entity"
                            control={control}
                            render={({ field: { onChange } }) => (
                                <AsyncSelect
                                    className="text-dark w-100"
                                    isClearable
                                    getOptionValue={(option) => option}
                                    defaultOptions={entityOptions}
                                    cacheOptions
                                    loadOptions={asyncSearch}
                                    onChange={(val) =>  onChange(val) }
                                />
                            )}
                        />
                        <ErrorMessage source={errors.entity} />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={minimizeModal} disabled={networkRequest} style={{width: '100px'}}>
                        {networkRequest && ( <ThreeDotLoading color="#ffffffff" size="small" /> )}
                        {!networkRequest && 'Cancel'}
                    </Button>
                    <Button variant="primary" onClick={handleSubmit(onSubmit)} disabled={networkRequest} style={{width: '100px'}}>
                        {networkRequest && ( <ThreeDotLoading color="#ffffffff" size="small" /> )}
                        {!networkRequest && 'Select'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

export default AsyncSearchDialog;