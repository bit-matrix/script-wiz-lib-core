import { sha256context } from "@bitmatrix/sha256streaming";

test("sha256 context test", () => {
  const result = sha256context("aabbcc");

  console.log(result);
});
