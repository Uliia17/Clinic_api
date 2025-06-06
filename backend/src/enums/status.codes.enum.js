export var StatusCodesEnum;
(function (StatusCodesEnum) {
    StatusCodesEnum[StatusCodesEnum["OK"] = 200] = "OK";
    StatusCodesEnum[StatusCodesEnum["CREATED"] = 201] = "CREATED";
    StatusCodesEnum[StatusCodesEnum["NO_CONTENT"] = 204] = "NO_CONTENT";
    StatusCodesEnum[StatusCodesEnum["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    StatusCodesEnum[StatusCodesEnum["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    StatusCodesEnum[StatusCodesEnum["FORBIDDEN"] = 403] = "FORBIDDEN";
    StatusCodesEnum[StatusCodesEnum["NOT_FOUND"] = 404] = "NOT_FOUND";
})(StatusCodesEnum || (StatusCodesEnum = {}));
