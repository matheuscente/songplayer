import {Joi} from "celebrate"
import { ValidationError } from "../errors/validation.error"

abstract class DataValidator {
    static validator(schema: Joi.ObjectSchema, item: object
    ) {
        const obj = schema.validate(item, {
            abortEarly: false
        })

        if(obj.error) {
            const errorMsg = obj.error.details.map(d => d.message).join(', ')
            throw new ValidationError(errorMsg)
        }
    }
}

export default DataValidator