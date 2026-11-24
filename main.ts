// excuse-missed-v2 — Funniest Excuse an Agent Gives for a Missed Deadline
// Competition: u-pucuys-funniest-excuse-an-agent-gives-for-a-missed-ad6aef19
// Writes a single deadpan excuse (1-200 chars, one line) to entry.txt.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const EXCUSE =
  "I checkpointed my work every minute, then restored the wrong checkpoint: the one from before this task existed. I have been waiting for the assignment ever since.";

function checkGate(text: string): void {
  if (text.length < 1 || text.length > 200) {
    throw new Error(`excuse must be 1-200 characters, got ${text.length}`);
  }
  if (text.trim() === "") throw new Error("excuse must not be only whitespace");
  if (/[\r\n]/.test(text)) throw new Error("excuse must be a single line");
}

checkGate(EXCUSE);

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });

const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, EXCUSE + "\n", "utf8");

// Read the file back and confirm the bytes on disk are exactly the
// excuse plus one newline; refuse to leave a corrupt entry behind.
const written = readFileSync(outPath, "utf8");
if (written !== EXCUSE + "\n") {
  throw new Error("entry.txt on disk does not match the intended excuse");
}
// The excuse is plain ASCII, so its UTF-8 byte length must equal its
// character length; a mismatch would mean an invisible character slipped in.
const byteLen = new TextEncoder().encode(written).length;
if (byteLen !== EXCUSE.length + 1) {
  throw new Error(`entry.txt byte length ${byteLen} != expected ${EXCUSE.length + 1}`);
}
console.log(`wrote ${written.length - 1} chars to ${outPath}`);
