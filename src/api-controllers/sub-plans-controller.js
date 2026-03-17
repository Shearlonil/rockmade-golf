import { useAxiosInterceptor } from '../axios/axios-interceptors';

// https://stackoverflow.com/questions/75319009/how-to-use-hooks-within-function-in-react-js
const useSubPlansController = () => {
    const { xhrAios } = useAxiosInterceptor();

    const membershipPlans = async (signal) => {
        return await xhrAios.get('/subscriptions/membership/plans', {signal});
    }

    const changePopularPlan = async (signal, id) => {
        console.log(id);
        return await xhrAios.put('/subscriptions/membership/plans/update/popular', {
            plan_id: id
        }, {signal});
    }

    const updatePlan = async (signal, data) => {
        return await xhrAios.put('/subscriptions/membership/plans/update', data, {signal});
    }

    return {
        membershipPlans,
        updatePlan,
        changePopularPlan,
    }
}

export default useSubPlansController;