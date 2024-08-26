import { token, base_url, tenant, retry_count } from "../config/environment_config.js";
import { httpMethods } from "../resources/http_methods.js";
import supertest  from "supertest";

const apiClient = supertest(base_url);

const invalidStatusCodes = new Set([408, 413, 429, 500, 502, 503, 504, 521, 522, 524]);

function setHeader(request){
    request.set('Authorization', `Bearer ${token}`);
    request.set('Content-Type', 'application/json')
    //request.set('tenant-id', tenant-id);

    return request;
}

export async function request(method, endPoint, payload = null ){
    let request;

    switch(method.toLowerCase()){

        case httpMethods.GET:
            request = apiClient.get(endPoint);
            break;
        
        case httpMethods.POST:
            request = apiClient.post(endPoint);
            if (payload) {
                request.send(payload);
            }
            break;

        case httpMethods.PUT:
            request = apiClient.put(endPoint);
            if (payload) {
                request.send(payload);
            }
            break;
        
        case httpMethods.PATCH:
            request = apiClient.patch(endPoint);
            if (payload) {
                request.send(payload);
            }
            break;
        
        case httpMethods.DELETE:
            request = apiClient.delete(endPoint);
            break;

        default:
            throw new Error(`Unsupported method: ${method}`);
        
    }

    request.retry(retry_count, (err, resp) => {
        if(err != null || err != undefined){
            console.warn(`API call failed with error - ${err.code}, Retrying API call.`);
        }
        if(resp!=null && invalidStatusCodes.has(resp.status))
        {
            console.warn(`API call failed with ${resp.status} error code, Retrying API call.`);
        }                    
    });

    return setHeader(request);
}