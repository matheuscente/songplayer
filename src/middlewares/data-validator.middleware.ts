import { celebrate, Segments, Joi } from "celebrate";

export class RoutesDataValidator {
  static bodyValidator(schema: Joi.ObjectSchema) {
    return celebrate({
      [Segments.BODY]: schema
    });
  }

  static queryValidator(schema: Joi.ObjectSchema) {
    return celebrate({
      [Segments.QUERY]: schema
    })
  }

  static paramsValidator(schema: Joi.ObjectSchema) {
    return celebrate({
      [Segments.PARAMS]: schema
    });
  }
}