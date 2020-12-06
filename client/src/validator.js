function isValidEmail(email) {
    if (/(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*$/.test(email))
        return true;
    return false;
}

export function check(text, userOption) {
    // structure option
    let option = {
        notEmpty: {
            check: false,
            message: ""
        },
        isEmail: {
            check: false,
            message: ""
        },
        length: {
            check: false,
            min: 0,
            message: ""
        },
        ...userOption
    }

    let error = {
        exist: false,
        message: ""
    }

    if (option.notEmpty.check) {
        if (text.length === 0) {
            error = {
                exist: true,
                message: option.notEmpty.message
            }
            return error;
        }
    }

    if (option.length.check) {
        if (text.length < option.length.min) {
            error = {
                exist: true,
                message: option.length.message         
            }
            return error;
        }
    }

    if (option.isEmail.check) {
        if (!isValidEmail(text)) {
            error = {
                exist: true,
                message: option.isEmail.message         
            }
            return error;
        }
    }

    return error;
}