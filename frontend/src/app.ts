import '@popperjs/core';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Router} from "./router";

class App {
    constructor() {
         new Router();
    }
}

(new App());