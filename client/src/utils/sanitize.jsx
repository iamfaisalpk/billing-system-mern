export const sanitizeInput = (value) =>
    value.replace(/[<>]/g, "");
