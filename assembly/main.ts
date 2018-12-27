declare function sayHello(): void;

sayHello();

export function add(x: i32, y: i32): i32 {
  return x + y;
}

export function power(base: i32, exponent: i32): i32 {
  return (base ** exponent) as i32;
}
