import { setStorage } from "./utils";

const API_BASE_PATH = process.env.API_BASE_PATH;

export function SpeedDetectionFetch() {
    fetch(`${API_BASE_PATH}/ip`)
    .then(response => response.json())
    .then(data => {
        setStorage("state", data);
    }).catch((error) => {
        console.log("error", error);
    });
}