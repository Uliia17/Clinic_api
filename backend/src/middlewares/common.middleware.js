import { isObjectIdOrHexString } from "mongoose";
import { ApiError } from "../errors/api.error";
class CommonMiddleware {
    isIdValidate(key) {
        return (req, res, next) => {
            try {
                const id = req.params[key];
                if (!isObjectIdOrHexString(id)) {
                    throw new ApiError(`${key}: ${id} is invalid ID`, 400);
                }
                next();
            }
            catch (e) {
                next(e);
            }
        };
    }
    validateBody(validator) {
        return async (req, res, next) => {
            try {
                req.body = await validator.validateAsync(req.body);
                next();
            }
            catch (e) {
                if (e && typeof e === "object" && "details" in e) {
                    // @ts-expect-error -- тут можна покращити типізацію
                    next(new ApiError(e.details[0].message, 400));
                }
                else {
                    next(new ApiError("Validation error", 400));
                }
            }
        };
    }
}
export const commonMiddleware = new CommonMiddleware();
