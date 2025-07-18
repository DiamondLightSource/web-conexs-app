import { expect, afterEach } from "vitest";
import { beforeAll, afterAll } from 'vitest'
import {server} from '../src/mocks/node'
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";

expect.extend(matchers);

class ResizeObserver {
  observe() {
    // do nothing
  }
  unobserve() {
    // do nothing
  }
  disconnect() {
    // do nothing
  }
}

window.ResizeObserver = ResizeObserver;

afterEach(() => {
  cleanup();
});



 
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
