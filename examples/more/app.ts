import axios, { AxiosError } from "../../src/index";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import qs from "qs";

/***********************************************************************************************************************
 * 													text for credentials 											   *
 * *********************************************************************************************************************/

document.cookie = "a=b";

axios.get("/more/get").then((res) => {
	console.log(res);
});

axios
	.post(
		"http://127.0.0.1:8088/more/server2",
		{},
		{
			withCredentials: true,
		}
	)
	.then((res) => {
		console.log(res);
	});

/***********************************************************************************************************************
 * 													text for xsrf        											   *
 * *********************************************************************************************************************/

const instance_xsrf = axios.create({
	xsrfCookieName: "XSRF-TOKEN-D",
	xsrfHeaderName: "X-XSRF-TOKEN-D",
});

instance_xsrf.get("/more/get").then((res) => {
	console.log(res);
});

/***********************************************************************************************************************
 * 											text for download | upload 												   *
 * *********************************************************************************************************************/

const instance = axios.create();

function calculatePercentage(loaded: number, total: number) {
	return Math.floor(loaded * 1.0) / total;
}

function loadProgressBar() {
	const setupStartProgress = () => {
		instance.interceptors.request.use((config) => {
			NProgress.start();
			return config;
		});
	};

	const setupUpdateProgress = () => {
		const update = (e: ProgressEvent) => {
			console.log(e);
			NProgress.set(calculatePercentage(e.loaded, e.total));
		};
		instance.defaults.onDownloadProgress = update;
		instance.defaults.onUploadProgress = update;
	};

	const setupStopProgress = () => {
		instance.interceptors.response.use(
			(response) => {
				NProgress.done();
				return response;
			},
			(error) => {
				NProgress.done();
				return Promise.reject(error);
			}
		);
	};

	setupStartProgress();
	setupUpdateProgress();
	setupStopProgress();
}

loadProgressBar();

const downloadEl = document.getElementById("download");

downloadEl!.addEventListener("click", (e) => {
	instance.get("https://img.mukewang.com/5cc01a7b0001a33718720632.jpg");
});

const uploadEl = document.getElementById("upload");

uploadEl!.addEventListener("click", (e) => {
	const data = new FormData();
	const fileEl = document.getElementById("file") as HTMLInputElement;
	if (fileEl.files) {
		data.append("file", fileEl.files[0]);

		instance.post("/more/upload", data);
	}
});

/***********************************************************************************************************************
 * 											text for HTTP Authentication 											   *
 * *********************************************************************************************************************/

axios
	.post(
		"/more/post",
		{
			a: 1,
		},
		{
			auth: {
				username: "Yee",
				password: "123456",
			},
		}
	)
	.then((res) => {
		console.log(res);
	});

/***********************************************************************************************************************
 * 											text for validateStatus      											   *
 * *********************************************************************************************************************/

axios
	.get("/more/304")
	.then((res) => {
		console.log(res);
	})
	.catch((e: AxiosError) => {
		console.log(e.message);
	});

axios
	.get("/more/304", {
		validateStatus(status) {
			return status >= 200 && status < 400;
		},
	})
	.then((res) => {
		console.log(res);
	})
	.catch((e: AxiosError) => {
		console.log(e.message);
	});

/***********************************************************************************************************************
 * 											text for paramsSerializer     											   *
 * *********************************************************************************************************************/

axios
	.get("/more/get", {
		params: new URLSearchParams("a=b&c=d"),
	})
	.then((res) => {
		console.log(res);
	});

axios
	.get("/more/get", {
		params: {
			a: 1,
			b: 2,
			c: ["a", "b", "c"],
		},
	})
	.then((res) => {
		console.log(res);
	});

const instance_serializer = axios.create({
	paramsSerializer(params) {
		return qs.stringify(params, { arrayFormat: "brackets" });
	},
});

instance_serializer
	.get("/more/get", {
		params: {
			a: 1,
			b: 2,
			c: ["a", "b", "c"],
		},
	})
	.then((res) => {
		console.log(res);
	});

/***********************************************************************************************************************
 * 											text for baseURL             											   *
 * *********************************************************************************************************************/
const instance_baseURL = axios.create({
	baseURL: "https://img.mukewang.com/",
});

instance_baseURL.get("5cc01a7b0001a33718720632.jpg");

instance_baseURL.get("https://img.mukewang.com/szimg/5becd5ad0001b89306000338-360-202.jpg");

/***********************************************************************************************************************
 * 											text for axios static extension            			     				   *
 * *********************************************************************************************************************/

function getA() {
	return axios.get("/more/A");
}

function getB() {
	return axios.get("/more/B");
}

axios.all([getA(), getB()]).then(
	axios.spread(function (resA, resB) {
		console.log(resA.data);
		console.log(resB.data);
	})
);

axios.all([getA(), getB()]).then(([resA, resB]) => {
	console.log(resA.data);
	console.log(resB.data);
});

const fakeConfig = {
	baseURL: "https://www.baidu.com/",
	url: "/user/12345",
	params: {
		idClient: 1,
		idTest: 2,
		testString: "thisIsATest",
	},
};
console.log(axios.getUrl(fakeConfig));
