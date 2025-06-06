const auth = "/auth"
const doctors = "/doctors"
const clinics = "/clinics"
const services = "/services"

const urls = {
    auth:{
        login: `${auth}/sign-in`,
        register: `${auth}/sign-up`,
        refresh: `${auth}/refresh`,
        me: `${auth}/me`,
    }, doctors, clinics, services
}

export {urls}