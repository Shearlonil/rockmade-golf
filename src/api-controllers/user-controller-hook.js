import { useAxiosInterceptor } from '../axios/axios-interceptors';

// https://stackoverflow.com/questions/75319009/how-to-use-hooks-within-function-in-react-js
const useUserController = () => {
    const { xhrAios } = useAxiosInterceptor();
    
    const onboard = async (signal, data) => {
        let formData = new FormData();
        formData.append('fname', data.fname);
        formData.append('lname', data.lname);
        formData.append('email', data.email);
        formData.append('gender', data.sex.value);
        formData.append('hc_id', data.home_club.value.id);
        formData.append('country_id', data.country.value.id);
        formData.append('hcp', data.hcp);
        formData.append('otp', data.otp);
        formData.append('dob', data.dob);cryptoHelper.encrypt(data.pw)
        formData.append('pw', cryptoHelper.encrypt(data.pw));
        if(data.file){
            formData.append('img', data.file);
        }
    
        await xhrAios.post(`/users/onboarding`, formData, {signal})
    }
    
    const getAxios = () => {
        return xhrAios;
    }

    return {
        onboard,
        getAxios,
    }
}

export default useUserController;