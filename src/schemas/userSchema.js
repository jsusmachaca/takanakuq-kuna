import { z } from "zod";

const userSchema = z.object({
    username: z.string({required_error: 'username field is required'}),
    first_name: z.string({required_error: 'first_name field is required'}),
    last_name: z.string({required_error: 'last_name field is required'}),
    email: z.string({required_error: 'email field is required'}).email(),
    password: z.string({required_error: 'password field is required'}).min(6),
    confirm_password: z.string({required_error: 'confirm password is required'})
})


export const userValidation = (data) => {
    return userSchema.safeParse(data)
}

export const userValidationPartial = (data) => {
    return userSchema.partial().safeParse(data)
}

/*
const data = {
    id: 1,
    username: 'ppp',
    first_name: 'asd',
    last_name: 'dsadas',
    email: 'mibro@gmail.com',
    password: 'adsadas'
}
const ss = userValidation({ input: data })
console.log(ss)
*/