import { useAxiosInterceptor } from '../axios/axios-interceptors';

// https://stackoverflow.com/questions/75319009/how-to-use-hooks-within-function-in-react-js
const useCourseController = () => {
    const { xhrAxios } = useAxiosInterceptor();
    
    const onboardingCourseSearch = async (signal, data) => {
        return await xhrAxios.get(`/courses/onboarding/query`, {
            params: {
                str: data.inputValue
            }
        }, {signal});
    }
    
    const onboardingCoursesInit = async (signal) => {
        return await xhrAxios.get(`/courses/onboarding/active`, {signal});
    }
    
    const finById = async (signal, id) => {
        return await xhrAxios.get(`/courses/search/${id}`, {signal});
    }
    
    const fetchAllActive = async (signal) => {
        return await xhrAxios.get(`/courses/active/all`, {signal});
    }
    
    const activeCoursesPageInit = async (signal, pageSize) => {
        return await xhrAxios.get(`/courses/active/init/${pageSize}`, {signal});
    }
    
    const courseSearch = async (signal, data) => {
        return await xhrAxios.get(`/courses/query`, {
            params: {
                str: data.inputValue, status: data.courseStatus
            }
        }, {signal});
    }
    
    const paginateFetch = async (signal, data) => {
        return await xhrAxios.get(`/courses/search/page/${data.page}`, {
            params: {
                pageSize: data.pageSize, status: data.courseStatus, page: data.page
            }
        }, {signal});
    }
    
    const gameCourseSearch = async (signal, inputValue) => {
        return await xhrAxios.get(`/courses/games/search`, {
            params: {
                str: inputValue
            }
        }, {signal});
    }
    
    const limitGameCourseSearch = async (signal, pageSize) => {
        return await xhrAxios.get(`/courses/games/init/${pageSize}`, {signal});
    }
    
    const createCourse = async (signal, data) => {
        return await xhrAxios.post(`/courses/create`, data, {signal});
    }
    
    // for changing number of holes in a course. Either was 18 and now updating to 9 holes or was 9 and now updating to 18
    const updateCourseHoleCount = async (signal, data) => {
        return await xhrAxios.post(`/courses/holes/update`, data, {signal});
    }
    
    // for updating values (par and hcp) of a hole in a course
    const updateCourseHole = async (signal, data) => {
        return await xhrAxios.post(`/courses/hole/update`, data, {signal});
    }
    
    const updateCourse = async (signal, data) => {
        return await xhrAxios.post(`/courses/update`, data, {signal});
    }
    
    const status = async (signal, data) => {
        return await xhrAxios.put(`/courses/status`, data, {signal});
    }

    return {
        finById,
        onboardingCourseSearch,
        onboardingCoursesInit,
        fetchAllActive,
        activeCoursesPageInit,
        paginateFetch,
        gameCourseSearch,
        limitGameCourseSearch,
        createCourse,
        updateCourseHoleCount,
        updateCourseHole,
        updateCourse,
        courseSearch,
        status,
    }
}

export default useCourseController;