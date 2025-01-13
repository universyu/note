import { computed } from "./computed.js";
import { reactive } from "./reactive.js";
import { effect } from "./effect.js";

const state = reactive({ a: 1, b: 2 });

const sum = computed(() => {
  console.log("compute", state.a + state.b);
  return state.a + state.b;
});

effect(() => {
  console.log("render", sum.value);
});
state.a++;
