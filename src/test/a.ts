/* eslint-disable @typescript-eslint/no-explicit-any */
import { Level } from "level";

// Specify types of keys and values (any, in the case of json).
// The generic type parameters default to Level<string, string>.
const db = new Level<number, any>( "./db", { valueEncoding: "json" });

// All relevant methods then use those types
await db.put( 0, { x: 1234 });
await db.put( 3, { x: 1234 });
await db.put( 6, { x: 1234 });
await db.put( 9, { x: 1234 });
await db.put( 1, { x: 1234 });
await db.put( 12, { x: 1234 });
await db.put( -1, { x: 1234 });

// const keys = await db.keys;
const entries = await db.iterator().all();

console.log( entries );


// await revert( "b" );
// Specify different types when overriding encoding per operation
// await db.get<string, string>( "a", { valueEncoding: "utf8" });

// Though in some cases TypeScript can infer them
// const res = await db.get( "a", { valueEncoding: db.valueEncoding( "utf8" ) });
// console.log( res );




// // It works the same for sublevels
// const abc = db.sublevel( "abc" );
// await db.clear();
const xyz = db.sublevel<string, any>( "xyz", { valueEncoding: "json" });

// await xyz.put( "aa", { sublevel: 7777 });
const res2 = await xyz.get( "aa", { valueEncoding: db.valueEncoding( "utf8" ) });
console.log( res2 );



