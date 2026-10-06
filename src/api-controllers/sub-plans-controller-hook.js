import { useAxiosInterceptor } from '../axios/axios-interceptors';

// https://stackoverflow.com/questions/75319009/how-to-use-hooks-within-function-in-react-js
const useSubPlansController = () => {
    const { xhrAxios } = useAxiosInterceptor();

    const membershipPlans = async (signal) => {
        return await xhrAxios.get('/subscriptions/membership/plans', {signal});
    }

    const changePopularPlan = async (signal, id) => {
        console.log(id);
        return await xhrAxios.put('/subscriptions/membership/plans/update/popular', {
            plan_id: id
        }, {signal});
    }

    const updatePlan = async (signal, data) => {
        return await xhrAxios.put('/subscriptions/membership/plans/update', data, {signal});
    }

    const addPlanBenefit = async (signal, data) => {
        return await xhrAxios.post('/subscriptions/membership/plans/desc/add', data, {signal});
    }

    const removePlanBenefit = async (signal, data) => {
        return await xhrAxios.put('/subscriptions/membership/plans/desc/remove', data, {signal});
    }

    const updatePlanBenefit = async (signal, data) => {
        return await xhrAxios.put('/subscriptions/membership/plans/desc/update', data, {signal});
    }

    return {
        membershipPlans,
        updatePlan,
        changePopularPlan,
        addPlanBenefit,
        removePlanBenefit,
        updatePlanBenefit,
    }
}

export default useSubPlansController;