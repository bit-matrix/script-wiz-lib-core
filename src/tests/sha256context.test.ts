import { sha256straming } from "@bitmatrix/sha256streaming";

test("sha256 context test", () => {
  const result = sha256straming.sha256Initializer("aabbcc");

  console.log(result);
});
