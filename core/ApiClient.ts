import axios, {AxiosResponse} from "axios";

class ApiClient {

    activeRequests: Map<string, Promise<any>> = new Map()

    get<T = any>(key: string, url: string): Promise<AxiosResponse<T>> {
        const inFlight = this.activeRequests.get(key)
        if (inFlight) {
            console.log("sharing request for", key)
            return inFlight
        }

        const request = axios.get(url)
            .finally(() => {
                this.activeRequests.delete(key)
            })
        this.activeRequests.set(key, request)

        return request
    }

}

const client = Object.freeze(new ApiClient())
export default client
