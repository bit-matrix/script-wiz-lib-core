import aa from "@bitmatrix/sha256streaming";

test("sha256 context test", () => {
  const result = aa.mod.sha256Initializer("aabbcc");

  console.log(result);
});
