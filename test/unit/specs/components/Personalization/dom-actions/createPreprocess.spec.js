/*
Copyright 2023 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/
import { vi, beforeEach, describe, it, expect } from "vitest";
import createPreprocess from "../../../../../../src/components/Personalization/dom-actions/createPreprocess.js";

describe("Personalization::dom-actions::createPreprocess", () => {
  let preprocessor1;
  let preprocessor2;
  let preprocess;
  beforeEach(() => {
    preprocessor1 = vi.fn();
    preprocessor2 = vi.fn();
    preprocess = createPreprocess([preprocessor1, preprocessor2]);
  });
  it("handles an empty action", () => {
    expect(preprocess({})).toEqual({});
  });
  it("passes the data through", () => {
    preprocessor1.mockImplementation((data) => data);
    preprocessor2.mockImplementation((data) => data);
    expect(
      preprocess({
        a: 1,
        b: 2,
      }),
    ).toEqual({
      a: 1,
      b: 2,
    });
  });
  it("passes the data through when the preprocessor returns undefined", () => {
    preprocessor1.mockImplementation(() => undefined);
    preprocessor2.mockImplementation(() => undefined);
    expect(
      preprocess({
        a: 1,
        b: 2,
      }),
    ).toEqual({
      a: 1,
      b: 2,
    });
  });
  it("updates the data", () => {
    preprocessor1.mockImplementation(() => ({
      c: 3,
    }));
    preprocessor2.mockImplementation(() => ({
      d: 4,
    }));
    expect(
      preprocess({
        a: 1,
        b: 2,
      }),
    ).toEqual({
      a: 1,
      b: 2,
      c: 3,
      d: 4,
    });
  });
  it("updates the data2", () => {
    preprocessor1.mockImplementation((data) => ({
      ...data,
      c: 3,
    }));
    preprocessor2.mockImplementation((data) => ({
      ...data,
      d: 4,
    }));
    expect(
      preprocess({
        a: 1,
        b: 2,
      }),
    ).toEqual({
      a: 1,
      b: 2,
      c: 3,
      d: 4,
    });
  });
});
