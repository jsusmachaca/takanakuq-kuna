import cors from 'cors'
import { ACCEPTED_ORIGINS } from '../config/config.js'

export const corsMiddleware = () => {
    return cors({
        origin: (origin, callback) => {
            if(ACCEPTED_ORIGINS.includes(origin) || !origin) {
                return callback(null, true)
            }
            // if(!origin) {
            //     return callback(null, true)
            // }
            return callback(new Error('not allowed by cors'))
        }
    })
}