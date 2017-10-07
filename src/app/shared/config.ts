let BaseUrl: string = "http://localhost:5000/";
//let BaseUrl: string = "http://localhost:44391/";
let apiBaseUrl: string = BaseUrl + "api/"
export const CONFIG = {
    authUrl: BaseUrl + 'connect/token',
    accountUrl: apiBaseUrl + 'auth/',
    valuesUrl: apiBaseUrl + 'values'
}