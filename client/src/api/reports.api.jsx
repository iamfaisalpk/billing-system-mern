import api from "./axios";

export const fetchCustomerReport = (customerId) =>
    api.get(`/api/reports/customer/${customerId}`);

export const fetchDateWiseReport = (from, to) =>
    api.get(`/api/reports/sales?from=${from}&to=${to}`);


