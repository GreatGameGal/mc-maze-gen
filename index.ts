import nbt from "prismarine-nbt";
import { encodeLitematica } from "./litematica-utils";

const { TagType } = nbt;

const MAZE_HEIGHT_PER_LAYER = 3;
const MAZE_GENERATED_COUNT = 8;
const MAZE_WIDTH = 17;
const MAZE_LENGTH = 17;


enum Cell {
  None = 0,
  LeftWall = 1 << 1,
  TopWall = 1 << 2,
  RightWall = 1 << 3,
  BottomWall = 1 << 4,
  AllWalls = Cell.LeftWall | Cell.RightWall | Cell.TopWall | Cell.BottomWall,
  Visited = 1 << 5,
}

interface Maze {
  width: number;
  height: number;
  data: Array<Cell>;
}

function stepMaze (maze: Maze, cellX: number, cellY: number): void {
  const pos = maze.width * cellY + cellX;
  maze.data[pos] |= Cell.Visited;
  const unvisitedNeighbors: (
    | Cell.LeftWall
    | Cell.TopWall
    | Cell.RightWall
    | Cell.BottomWall
  )[] = [];
  if (cellX > 0 && (maze.data[pos - 1] & Cell.Visited) == 0) {
    unvisitedNeighbors.push(Cell.LeftWall);
  }
  // +1 y pos is +maze.width
  if (cellY > 0 && (maze.data[pos - maze.width] & Cell.Visited) == 0) {
    unvisitedNeighbors.push(Cell.TopWall);
  }
  if (cellX < maze.width - 1 && (maze.data[pos + 1] & Cell.Visited) == 0) {
    unvisitedNeighbors.push(Cell.RightWall);
  }
  if (
    cellY < maze.height - 1 &&
    (maze.data[pos + maze.width] & Cell.Visited) == 0
  ) {
    unvisitedNeighbors.push(Cell.BottomWall);
  }
  while (unvisitedNeighbors.length > 0) {
    const chosenInex = Math.floor(Math.random() * unvisitedNeighbors.length);
    const chosen = unvisitedNeighbors.splice(chosenInex, 1)[0];
    maze.data[pos] ^= chosen;
    switch (chosen) {
      case Cell.LeftWall:
        if (maze.data[pos - 1] & Cell.Visited) {
          break;
        }
        maze.data[pos - 1] ^= Cell.RightWall;
        stepMaze(maze, cellX - 1, cellY);
        break;

      case Cell.TopWall:
        if (maze.data[pos - maze.width] & Cell.Visited) {
          break;
        }
        maze.data[pos - maze.width] ^= Cell.BottomWall;
        stepMaze(maze, cellX, cellY - 1);
        break;

      case Cell.RightWall:
        if (maze.data[pos + 1] & Cell.Visited) {
          break;
        }
        maze.data[pos + 1] ^= Cell.LeftWall;
        stepMaze(maze, cellX + 1, cellY);
        break;

      case Cell.BottomWall:
        if (maze.data[pos + maze.width] & Cell.Visited) {
          break;
        }
        maze.data[pos + maze.width] ^= Cell.TopWall;
        stepMaze(maze, cellX, cellY + 1);
        break;
    }
  }
}

function generateMaze (
  width: number,
  height: number,
  startX: number,
  startY: number
): Maze {
  const maze = {
    width,
    height,
    data: new Array(width * height).fill(Cell.AllWalls),
  };

  stepMaze(maze, startX, startY);

  return maze;
}

function renderMaze (maze: Maze) {
  const gridWidth = 1 + maze.width * 3;
  const gridHeight = 1 + maze.height * 3;
  const grid = new Uint8Array(1 + (maze.width + maze.height) * 3 + maze.width * maze.height * 9);
  grid[0] = 1;
  for (let x = 0; x < maze.width; x++) {
    const gX = 1 + x * 3;
    for (let y = 0; y < maze.height; y++) {
      const gY = 1 + y * 3;
      const pos = maze.width * y + x;
      const gPos = gridWidth * gY + gX;
      const cell = maze.data[pos];
      if ((cell & Cell.LeftWall) != 0) {
        for (let i = 0; i < 3; i++) {
          grid[gPos - 1 + gridWidth * i] = 1;
        }
      }
      if ((cell & Cell.TopWall) != 0) {
        for (let i = 0; i < 3; i++) {
          grid[gPos + i - gridWidth] = 1;
        }
      }
      if ((cell & Cell.RightWall) != 0) {
        for (let i = 0; i < 3; i++) {
          grid[gPos + 2 + gridWidth * i] = 1;
        }
      }
      if ((cell & Cell.BottomWall) != 0) {
        for (let i = 0; i < 3; i++) {
          grid[gPos + i + gridWidth * 2] = 1;
        }
      }
    }
  }

  // Hack to clean up some corners.
  for (let x = 1; x < gridWidth - 1; x++) {
    for (let y = 1; y < gridHeight - 1; y++) {
      const pos = gridWidth * y + x;
      if (
        grid[pos + 1] &&
        grid[pos + gridWidth] &&
        !grid[pos + gridWidth + 1]
      ) {
        grid[pos] = 1;
      }
    }
  }

  return grid;
}

function printMaze (maze: Maze, fillCharacter = "██", emptyCharacter = "  ") {
  const grid = renderMaze(maze);

  const gridWidth = 1 + maze.width * 3;
  const gridHeight = 1 + maze.height * 3;

  let out = "";
  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      out += grid[gridWidth * y + x] ? fillCharacter : emptyCharacter;
    }
    out += "\n";
  }
  console.log(out);
}

function setAt (
  dataArr: number[],
  bitsPer: number,
  index: number,
  value: number
) {
  const maxEntryValue = (1 << bitsPer) - 1;
  const startOffset = index * bitsPer;
  const startArrIndex = Number(startOffset >> 5);
  const endArrIndex = Number(startOffset + bitsPer - 1 >> 5);
  const startBitOffset = startOffset % 32;
  dataArr[startArrIndex] =
    dataArr[startArrIndex] & ~(maxEntryValue << startBitOffset) |
    (value & maxEntryValue) << startBitOffset;

  if (startArrIndex != endArrIndex) {
    const endOffset = 32 - startBitOffset;
    const j1 = bitsPer - endOffset;
    dataArr[endArrIndex] =
      dataArr[endArrIndex] >> j1 << j1 |
      (value & maxEntryValue) >> endOffset;
  }
}

for (let m = 0; m < MAZE_GENERATED_COUNT; m++) {
  const maze = generateMaze(MAZE_WIDTH, MAZE_LENGTH, 0, 0);
  const now = Date.now();
  const dateNow = new Date(now);
  const timeName = `${dateNow.getFullYear()}.${dateNow
    .getMonth()
    .toString()
    .padStart(2, "0")}.${dateNow.getDay().toString().padStart(2, "0")}.${dateNow
    .getHours()
    .toString()
    .padStart(2, "0")}.${dateNow
    .getMinutes()
    .toString()
    .padStart(2, "0")}.${dateNow
    .getSeconds()
    .toString()
    .padStart(2, "0")}-${m}`;

  const renderedMaze = renderMaze(maze);
  printMaze(maze);
  const renderedWidth = 1 + maze.width * 3;
  const renderedHeight = 1 + maze.height * 3;
  const renderedFilled = renderedMaze.reduce((a, b) => a + b);
  const renderedTotal = renderedMaze.length;
  const dataArr: number[] = new Array(Math.ceil(renderedTotal * 2 * 4 / 32)).fill(0);

  for (let x = 0; x < renderedWidth; x++) {
    for (let y = 0; y < 4; y++) {
      for (let z = 0; z < renderedHeight; z++) {
        const index = y * renderedTotal + z * renderedWidth + x;
        setAt(
          dataArr,
          2,
          index,
          y != 0 ? renderedMaze[renderedWidth * z + x] : 2
        );
      }
    }
  }
  const mazeArr: [number, number][] = [];
  for (let i = 0; i < dataArr.length; i += 2) {
    mazeArr.push([ dataArr[i + 1] ?? 0, dataArr[i] ]);
  }

  const nowBig = BigInt(now);
  const weirdNow: [number, number] = [ Number(nowBig >> 32n & 0xffffffffn), Number(nowBig & 0xffffffffn) ];

  // @ts-expect-error Incomplete type in library.
  const mazematic: nbt.NBT = nbt.comp({
    MinecraftDataVersion: nbt.int(2586),
    Version: nbt.int(5),
    Metadata: nbt.comp({
      TimeCreated: nbt.long(weirdNow),
      TimeModified: nbt.long(weirdNow),
      EnclosingSize: nbt.comp({
        x: nbt.int(1 + maze.width * 3),
        y: nbt.int(MAZE_HEIGHT_PER_LAYER + 1),
        z: nbt.int(1 + maze.height * 3),
      }),
      Description: nbt.string("An auto-generated maze."),
      RegionCount: nbt.int(1),
      TotalBlocks: nbt.int(renderedTotal + renderedFilled * 3),
      Author: nbt.string("GreatGameGal"),
      TotalVolume: nbt.int(renderedTotal * 4),
      Name: nbt.string(`Maze ${timeName}`),
    }),
    Regions: nbt.comp({
      Maze: nbt.comp({
        BlockStates: {
          type: TagType.LongArray,
          value: mazeArr,
        },
        PendingBlockTicks: nbt.list({
          // @ts-expect-error This type is incomplete but from a library.
          type: "end",
          value: [],
        }),
        Position: nbt.comp({
          x: nbt.int(0),
          y: nbt.int(0),
          z: nbt.int(0),
        }),
        BlockStatePalette: nbt.list({
          type: TagType.Compound,
          value: [
            { Name: nbt.string("minecraft:air") },
            { Name: nbt.string("minecraft:stone") },
            { Name: nbt.string("minecraft:stone_bricks") },
          ],
        }),
        Size: nbt.comp({
          x: nbt.int(1 + maze.width * 3),
          y: nbt.int(MAZE_HEIGHT_PER_LAYER + 1),
          z: nbt.int(1 + maze.height * 3),
        }),
        PendingFluidTicks: nbt.list({
          // @ts-expect-error Incomplete type in library.
          type: "end",
          value: [],
        }),
        TileEntities: nbt.list({
          // @ts-expect-error Incomplete type in library.
          type: "end",
          value: [],
        }),
        Entities: nbt.list({
          // @ts-expect-error Incomplete type in library.
          type: "end",
          value: [],
        }),
      }),
    }),
  });

  Bun.write(
    Bun.file(`./litematics/maze.${timeName}.litematic`),
    encodeLitematica(mazematic)
  );
  Bun.sleep(1);
}
