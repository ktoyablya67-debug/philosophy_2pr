const esbuild = require("esbuild");
const fs = require("fs");
const path = require("path");

const outfile = path.join(process.cwd(), "tmp-content-check.cjs");

try {
  esbuild.buildSync({
    entryPoints: ["./src/utils/validators.ts"],
    bundle: true,
    platform: "node",
    format: "cjs",
    outfile,
    logLevel: "silent",
  });
  const { validateData } = require(outfile);
  const messages = validateData();
  if (messages.length) {
    console.log(`CONTENT_CHECK_WARNINGS ${messages.length}`);
    messages.forEach((message) => console.log(`- ${message}`));
  } else {
    console.log("CONTENT_CHECK_OK");
  }
  process.exit(0);
} finally {
  if (fs.existsSync(outfile)) fs.unlinkSync(outfile);
}
