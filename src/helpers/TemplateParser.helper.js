const replaceTemplate = (template, values) => {
    return template.replace(/%(\w+)%/g, (match, key) => {
        return values[key] || match;
    });
}

module.exports = { replaceTemplate }
