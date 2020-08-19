import Router from "next/router";
import NProgress from "nprogress";
import { isServer } from "src/utils/isServer";

NProgress.configure({ showSpinner: false });

let timer: number;
let state: string;
let activeRequests = 0;
const delay = 250;

function load() {
  if (state === "loading") {
    return;
  }

  state = "loading";

  timer = setTimeout(function () {
    NProgress.start();
  }, delay); // only show progress bar if it takes longer than the delay
}

function stop() {
  if (activeRequests > 0) {
    return;
  }

  state = "stop";

  clearTimeout(timer);
  NProgress.done();
}

Router.events.on("routeChangeStart", load);
Router.events.on("routeChangeComplete", stop);
Router.events.on("routeChangeError", stop);

export function incrementRequest() {
  activeRequests++;
  if (!isServer()) {
    load();
  }
}

export function decrementRequest() {
  activeRequests--;
  if (!isServer()) {
    stop();
  }
}

export default function Dummy () {
  return null;
}
