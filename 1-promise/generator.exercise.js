function* generator() {
  const list = [1, 2, 3];

  for (let i of list) {
    yield i;
  }
}

const g = generator();

console.log(g.next());
console.log(g.next());
console.log(g.next());
console.log(g.next());
