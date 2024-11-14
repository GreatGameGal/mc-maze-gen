import nbt from "prismarine-nbt";

export function parseLitematic (raw: ArrayBufferLike): nbt.NBT {
  const uncompressed = new Buffer(Bun.gunzipSync(new Uint8Array(raw)));

  return nbt.parseUncompressed(uncompressed, "big");
}

export function encodeLitematica (data: nbt.NBT): ArrayBufferLike {
  return Bun.gzipSync(nbt.writeUncompressed(data, "big")).buffer;
}
