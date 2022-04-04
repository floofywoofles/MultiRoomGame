import { GameScene } from "./interfaces/gamescene";
import type DataStore from "nedb"
import fs from "fs";
import { Position } from "./interfaces/position";

export class Scene {
    private currScene: string;
    private db: DataStore;

    constructor(currScene: string, db: any){
        this.currScene = currScene
        this.db = db;
    }

    get getScene(): string{
        return this.currScene;
    }

    showScenesFromDB(){
        this.db.find({}, (err: any, doc: any) => {
            if(err){
                console.error(err);
                process.exit(1);
            }

            console.log(doc);
        })
    }

    set setScene(scene: GameScene){

    }

    isValidScene(scene: GameScene): boolean{
        if(scene){
            if(scene.order > 0 && scene.id.length > 0){
                // All scenes must be 6x6
                if(scene.data[0].length === 6 && scene.data.length === 6){
                    const {x,y}: Position = scene.starting_position;

                    // Check if starting_position is not out of index
                    if(x <= 6 && y <= 6 && x && y){
                        return true;
                    } else {
                        console.error("Invalid starting position. Must be in range of 6x6 scene");
                    }
                } else {
                    console.error("Invalid scene length and/or height");
                }
            } else {
                console.error("Invalid order and/or length");
            }
        } else {
            console.error("Undefined scene");
        }

        return false;
    }

    sortSceneDB(){
        // Sort DB By Order
        this.db.find({}).sort({order: 0}).exec((err: any, docs: any)=>{
            if(err){
                console.error(err);
                process.exit(1);
            }
        })
    }

    loadScenesFromDirectory(): void{
        const dirs: string[] = fs.readdirSync(`${__dirname}/scenes`);
        const dbIsClear: any = this.db.find({});

        //console.log(dbIsClear);
        // Make sure db is clear
        if(dbIsClear){
            //console.log("Clearing DB")
            this.db.remove({},{multi: true}, (err: any, numRemoved: any)=>{
                if(err){
                    console.error(err);
                    process.exit(1);
                }
            })
        }

        if(dirs.length > 0){
            for(let i = 0; i < dirs.length; i++){
                if(dirs[i].indexOf('.json') > -1){
                    try{
                        const file: GameScene = JSON.parse(fs.readFileSync(`${__dirname}/scenes/${dirs[i]}`, 'utf-8'));

                        if(this.isValidScene(file)){
                            this.db.insert(file, (err: any, newDoc: any)=>{
                                if(err){
                                    console.error(err);
                                    process.exit(1);
                                }
                            })

                            // Sorts scenes by order (1 through x)
                            //this.sortSceneDB();
                        } else {
                            console.error("Scene is not valid");
                            process.exit(1);
                        }
                    } catch(err){
                        console.error("Improper scene. All values must match interface requirements");
                    }
                }
            }
        } else {
            console.error("Unable to load scenes");
            process.exit(1);
        }
    }   
}