import "@babel/polyfill";

import Config from "./Config";

require('./libs/daijima/trace.js');
require('./libs/daijima/requestanimationframe.js');


let packName = "HAU";
let pack = new Config(window, packName);

import "../scss/common.scss";
import "../scss/hero.scss";
import "../scss/floors.scss";

// import * as styles from "../scss/common.scss";

import Common from './Common';

new Common(pack);

require('./barba-custom.js');