import { auth } from "../../lib/auth";

type RegisterPatient = {
    name: string;
    email: string;
    password: string;
}

type LoginPatient = {
    email: string;
    password: string;
}

const registerPatient = async (payload: RegisterPatient) => {
    const {name, email, password} = payload;
    const data = await auth.api.signUpEmail({
        body: {
            name,
            email,
            password
        },
        asResponse: true 
    })

    if (!data.ok) {
        throw new Error("Failed to register patient")
    }

    //todo create record in patient table
    return data;
}

const loginPatient = async (payload: LoginPatient) => {
    const {email, password} = payload;

    const data = await auth.api.signInEmail({
        body: {
            email,
            password
        },
        asResponse: true
    })

    if (!data.ok) {
        throw new Error("Failed to login patient")
    }

    return data;
}

export const authService = {
    registerPatient,
    loginPatient
}