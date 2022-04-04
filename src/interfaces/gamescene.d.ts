import { Position } from "./position"

export interface GameScene {
    order: number,
    id: string,
    data: string[][],
    starting_position: Position
}