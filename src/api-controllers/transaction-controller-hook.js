import { useAxiosInterceptor } from '../axios/axios-interceptors';

// https://stackoverflow.com/questions/75319009/how-to-use-hooks-within-function-in-react-js
const useTransactionController = () => {
    const { xhrAxios } = useAxiosInterceptor();
    
    const initializeMembershipSub = async (signal, nano_id) => {
        return await xhrAxios.post(`/transactions/membership/initialize/${nano_id}`, {signal});
    }
    
    const initializeTrainingSub = async (signal, nano_id) => {
        return await xhrAxios.post(`/transactions/training/initialize/${nano_id}`, {signal});
    }
    
    const getAxios = () => xhrAxios;

    return {
        initializeMembershipSub,
        initializeTrainingSub,
        getAxios,
    }
}

export default useTransactionController;