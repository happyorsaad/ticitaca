import assert from "assert";
import { ColyseusTestServer, boot } from "@colyseus/testing";

// import your "app.config.ts" file here.
import appConfig from "../src/app.config";
import { PieceType } from "../src/rooms/schema/GameState";
import { PlayMoveCommand } from "../src/commands/PlayMoveCommand";

describe("Testing Winning Condition", () => {
  let playMoveCommand: PlayMoveCommand = new PlayMoveCommand();
  it("testing three in a row", async () => {
    let board2d: number[][] = [
      [PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE],
      [PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE],
      [PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.LARGE_0, PieceType.LARGE_0, PieceType.LARGE_0, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE],
      [PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE],
      [PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE],
      [PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE],
      [PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE],
      [PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE],
      [PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE],
      [PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE],
    ];

    let matches = playMoveCommand.checkThreeInRow(board2d);
    assert.strictEqual([PieceType.LARGE_0, PieceType.LARGE_0, PieceType.LARGE_0], matches[0]);

    board2d =  [
      [PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE],
      [PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE],
      [PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE],
      [PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE],
      [PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.LARGE_1, PieceType.LARGE_1, PieceType.LARGE_1, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE],
      [PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE],
      [PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE],
      [PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE],
      [PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE],
      [PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE],
    ];

    matches = playMoveCommand.checkThreeInRow(board2d);
    assert.notStrictEqual([PieceType.LARGE_1, PieceType.LARGE_1, PieceType.LARGE_1], matches[0]);

    board2d =  [
      [PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE],
      [PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE],
      [PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE],
      [PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE],
      [PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.SMALL_1, PieceType.SMALL_1, PieceType.SMALL_1, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE],
      [PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE],
      [PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE],
      [PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE],
      [PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE],
      [PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE],
    ];

    matches = playMoveCommand.checkThreeInRow(board2d);
    assert.notStrictEqual([PieceType.SMALL_1, PieceType.SMALL_1, PieceType.SMALL_1], matches[0]);

  });

  it("testing three in a column", async () => {
    let board2d: number[][] = [
      [PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE],
      [PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE],
      [PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.LARGE_0, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE],
      [PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.LARGE_0, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE],
      [PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.LARGE_0, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE],
      [PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE],
      [PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE],
      [PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE],
      [PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE],
      [PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE],
    ];

    let matches = playMoveCommand.checkThreeInColumn(board2d);
    assert.notStrictEqual([PieceType.LARGE_0, PieceType.LARGE_0, PieceType.LARGE_0], matches[0]);

    board2d =  [
      [PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE],
      [PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE],
      [PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE],
      [PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE],
      [PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.LARGE_1, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE],
      [PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.LARGE_1, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE],
      [PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.LARGE_1, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE],
      [PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE],
      [PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE],
      [PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE],
    ];

    matches = playMoveCommand.checkThreeInColumn(board2d);
    assert.notStrictEqual([PieceType.LARGE_1, PieceType.LARGE_1, PieceType.LARGE_1], matches[0]);

    board2d =  [
      [PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE],
      [PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE],
      [PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE],
      [PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE],
      [PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.SMALL_1, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE],
      [PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.SMALL_1, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE],
      [PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.SMALL_1, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE],
      [PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE],
      [PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE],
      [PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE],
    ];

    matches = playMoveCommand.checkThreeInColumn(board2d);
    assert.notStrictEqual([PieceType.SMALL_1, PieceType.SMALL_1, PieceType.SMALL_1], matches[0]);

  });

  it("testing three in a diagnal", async () => {
    let board2d: number[][] = [
      [PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE],
      [PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE],
      [PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.LARGE_0, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE],
      [PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.LARGE_0, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE],
      [PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.LARGE_0, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE],
      [PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE],
      [PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE],
      [PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE],
      [PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE],
      [PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE],
    ];

    let matches = playMoveCommand.checkThreeInDiagonal(board2d);
    assert.notStrictEqual([PieceType.LARGE_0, PieceType.LARGE_0, PieceType.LARGE_0], matches[0]);

    board2d =  [
      [PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE],
      [PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE],
      [PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.LARGE_1, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE],
      [PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.LARGE_1, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE],
      [PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.LARGE_1, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE],
      [PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE],
      [PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE],
      [PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE],
      [PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE],
      [PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE],
    ];

    matches = playMoveCommand.checkThreeInDiagonal(board2d);
    assert.notStrictEqual([PieceType.LARGE_1, PieceType.LARGE_1, PieceType.LARGE_1], matches[0]);

    board2d =  [
      [PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE],
      [PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE],
      [PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE],
      [PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.SMALL_1, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE],
      [PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.SMALL_1, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE],
      [PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.SMALL_1, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE],
      [PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE],
      [PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE],
      [PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE],
      [PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE, PieceType.NO_PIECE],
    ];

    matches = playMoveCommand.checkThreeInDiagonal(board2d);
    assert.notStrictEqual([PieceType.SMALL_1, PieceType.SMALL_1, PieceType.SMALL_1], matches[0]);

  });
});
