import { z } from 'zod'


const userSchema = z.object({
  username: z.string({ required_error: 'username field is required' }),
  first_name: z.string({ required_error: 'first_name field is required' }),
  last_name: z.string({ required_error: 'last_name field is required' }),
  email: z.string({ required_error: 'email field is required' }).email(),
  password: z.string({ required_error: 'password field is required' }).min(6),
  confirm_password: z.string({ required_error: 'confirm password is required' }).min(6)
})

const profileSchema = z.object({
  description: z.string().nullable().default(null),
  profile_image: z.string().nullable().default(null)
}).refine(data => data.description !== null || data.profile_image !== null, {
  message: "at least one of the 'description' or 'profile_image' fields must be present.",
});

export const userValidation = (data) => {
  return userSchema.refine(data => data.password === data.confirm_password, {
    message: "passwords  don't match",
  }).safeParse(data)
}

export const userValidationPartial = (data) => {
  return userSchema.partial().safeParse(data)
}

export const userProfileValidation = (data) => {
  return profileSchema.safeParse(data)
}

/*
const data = {
    username: 'ppp',
    first_name: 'asd',
    last_name: 'dsadas',
    email: 'mibro@gmail.com',
    password: 'adsadas',
    confirm_password: 'addsadas'
}
const ss = userValidation(data)
console.log(ss.error)
*/