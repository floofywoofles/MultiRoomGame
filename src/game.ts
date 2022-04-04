import readline from "readline-sync";
import DataStore from "nedb";
import {Scene} from "./scene";

const db: DataStore = new DataStore({filename: `${__dirname}/db/scenes.db`, autoload: true});
const scene: Scene = new Scene("main_room", db);

function init(){
    scene.loadScenesFromDirectory(); // Loads all scenes into DB to prevent unnecessary overhead
    scene.showScenesFromDB();
}

init();