import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from "../types";
import xhr from "./xhr";
import { buildURL, combineURL, isAbsoluteURL } from "../helpers/url";
import { transformRequest, transformResponse } from "../helpers/data";
import { flattenHeaders, processHeaders } from "../helpers/headers";
import transform from "./transform";

export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
	throwIfCancellationRequested(config);
	processConfig(config);
	return xhr(config).then((resolve) => {
		return transformResponseData(resolve);
	});
}

function processConfig(config: AxiosRequestConfig): void {
	config.url = transformURL(config);
	// config.headers = transformHeaders(config);
	config.data = transform(config.data, config.headers, config.transformRequest);
	config.headers = flattenHeaders(config.headers, config.method!);
}

export function transformURL(config: AxiosRequestConfig): string {
	const { params, paramsSerializer, baseURL } = config;
	let { url } = config;
	if (baseURL && !isAbsoluteURL(url!)) {
		url = combineURL(baseURL, url);
	}
	return buildURL(url!, params, paramsSerializer);
}

function transformRequestData(config: AxiosRequestConfig): any {
	return transformRequest(config.data);
}

function transformHeaders(config: AxiosRequestConfig): any {
	const { headers = {}, data } = config;
	return processHeaders(headers, data);
}

function transformResponseData(resolve: AxiosResponse): AxiosResponse {
	// resolve.data = transformResponse(resolve.data);
	resolve.data = transform(resolve.data, resolve.headers, resolve.config.transformResponse);
	return resolve;
}

function throwIfCancellationRequested(config: AxiosRequestConfig): void {
	if (config.cancelToken) {
		config.cancelToken.throwIfRequested();
	}
}
