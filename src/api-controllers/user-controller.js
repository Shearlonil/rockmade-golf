import httpService from "../axios/http-service";
import cryptoHelper from "../Utils/crypto-helper";

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

    await httpService.post(`/users/onboarding`, formData, {signal})
}

const getAxios = () => {
    return httpService.getAxios();
}

export default {
    onboard,
    getAxios,
}