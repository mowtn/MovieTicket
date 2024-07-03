function getRule(name, value, validateRules) {
    for (const rule of validateRules) {
        if (rule.name === name && rule.test(value)) {
            return rule
        }
    }
}

function validateField(name, value, validateRules, oldErrors) {
    const errors = { ...oldErrors }
    const rule = getRule(name, value, validateRules)
    if (rule) errors[name] = rule.message
    else delete errors[name]
    return errors
}

function validateObject(dataObj, validateRules) {
    const errors = {}
    validateRules.forEach((rule) => {
        if (!errors.hasOwnProperty(rule.name) && rule.test(dataObj[rule.name])) errors[rule.name] = rule.message
    })
    return errors
}

export { validateField, validateObject, getRule }
