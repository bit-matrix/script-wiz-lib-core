import Sha256Stream from "@bitmatrix/sha256streaming";

test("sha256 context test", () => {
  const result = Sha256Stream.sha256Initializer("aabbcc");

  console.log(result);
});
