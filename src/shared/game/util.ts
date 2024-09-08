import {Pair} from "../interfaces/pair";
import thePlayer from "../../client/js/objects/client-the-player";

export function getAdjacentTiles(x: number, y: number): Pair<number>[] {
    let functions = [
        (x: number, y: number) => [x + 1, y + 1],
        (x: number, y: number) => [x + 2, y],
        (x: number, y: number) => [x + 1, y - 1],
        (x: number, y: number) => [x - 1, y - 1],
        (x: number, y: number) => [x - 2, y],
        (x: number, y: number) => [x - 1, y + 1]
    ];

    let results = functions.map(func => func(x, y))

    let tiles: Pair<number>[] = []

    for (let i = 0; i < results.length; i++) {
        let x = results[i][0];
        let y = results[i][1];

        tiles.push(new Pair<number>(x, y))
    }

    return tiles;
}

export function calculateMoves(tiles: Pair<number>[], isOccupied: Function): Pair<number>[]  {
    tiles.forEach(tile => {
        let adjTiles = getAdjacentTiles(tile.first, tile.second)

        adjTiles.forEach(adjPair => {
            if (isOccupied(adjPair)) return;

            tiles.push(new Pair(adjPair.first, adjPair.second));
        })
    })

    return tiles;
}