async function longTime(time) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("success");
    }, time);
  });
}

async function test() {
  const value = await longTime(1000);
  return value;
}

async function testParent() {
  const value = await test();
  console.log("kerita log:", value, "value");
}

testParent();
