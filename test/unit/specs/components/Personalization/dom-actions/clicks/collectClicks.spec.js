/*
Copyright 2019 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import createClickStorage from "../../../../../../../src/components/Personalization/createClickStorage";
import {
  appendNode,
  createNode,
  removeNode,
  selectNodes
} from "../../../../../../../src/utils/dom";
import collectClicks from "../../../../../../../src/components/Personalization/dom-actions/clicks/collectClicks";

describe("Personalization::tracking::clicks", () => {
  let storeClickMeta;
  let getClickMetas;

  beforeEach(() => {
    selectNodes(".eq").forEach(removeNode);
    ({ storeClickMeta, getClickMetas } = createClickStorage());
  });

  afterEach(() => {
    selectNodes(".eq").forEach(removeNode);
  });

  it("should collect clicks with interact-id, label and token", () => {
    storeClickMeta(
      "AT:1234",
      "063",
      "page",
      {
        id: "AT:1234",
        scope: "example_scope"
      },
      99
    );

    const content = `
      <div class="b" data-aep-interact-id="99">
        <div id="one" class="c" data-aep-click-label="lbl-first" data-aep-click-token="tok-111">first</div>
        <div id="two" class="c" data-aep-click-label="lbl-second" data-aep-click-token="tok-222">second</div>
        <div id="three" class="c" data-aep-click-label="lbl-third" data-aep-click-token="tok-333">third</div>
      </div>
    `;
    const node = createNode(
      "DIV",
      { id: "abc", class: "eq" },
      { innerHTML: content }
    );

    appendNode(document.body, node);

    [
      {
        elementId: "one",
        expectedLabel: "lbl-first",
        expectedToken: "tok-111"
      },
      {
        elementId: "two",
        expectedLabel: "lbl-second",
        expectedToken: "tok-222"
      },
      {
        elementId: "three",
        expectedLabel: "lbl-third",
        expectedToken: "tok-333"
      }
    ].forEach(definition => {
      const element = document.getElementById(definition.elementId);
      const {
        decisionsMeta,
        propositionActionLabel,
        propositionActionToken
      } = collectClicks(element, getClickMetas);

      expect(decisionsMeta).toEqual([
        {
          id: "AT:1234",
          scope: "example_scope",
          items: [
            {
              id: "063"
            }
          ]
        }
      ]);
      expect(propositionActionLabel).toEqual(definition.expectedLabel);
      expect(propositionActionToken).toEqual(definition.expectedToken);
    });
  });

  it("should find closest label and token", () => {
    storeClickMeta(
      "AT:1234",
      "063",
      "page",
      {
        id: "AT:1234",
        scope: "example_scope"
      },
      99
    );

    const content = `
      <div class="b" data-aep-interact-id="99" data-aep-click-label="lbl-main" data-aep-click-token="tok-main">
        <div id="one" class="c">first</div>
        <div id="two" class="c">second</div>
        <div id="three" class="c" data-aep-click-label="lbl-third" data-aep-click-token="tok-333">third</div>
      </div>
    `;
    const node = createNode(
      "DIV",
      { id: "abc", class: "eq" },
      { innerHTML: content }
    );
    appendNode(document.body, node);

    [
      {
        elementId: "one",
        expectedLabel: "lbl-main",
        expectedToken: "tok-main"
      },
      {
        elementId: "two",
        expectedLabel: "lbl-main",
        expectedToken: "tok-main"
      },
      {
        elementId: "three",
        expectedLabel: "lbl-third",
        expectedToken: "tok-333"
      }
    ].forEach(definition => {
      const element = document.getElementById(definition.elementId);
      const {
        decisionsMeta,
        propositionActionLabel,
        propositionActionToken
      } = collectClicks(element, getClickMetas);

      expect(decisionsMeta).toEqual([
        {
          id: "AT:1234",
          scope: "example_scope",
          items: [
            {
              id: "063"
            }
          ]
        }
      ]);
      expect(propositionActionLabel).toEqual(definition.expectedLabel);
      expect(propositionActionToken).toEqual(definition.expectedToken);
    });
  });

  it("should find closest label and token (nesting)", () => {
    storeClickMeta(
      "AT:1234",
      "063",
      "page",
      {
        id: "AT:1234",
        scope: "example_scope"
      },
      99
    );

    const content = `
      <div class="b" data-aep-interact-id="99">
        <div id="one" class="c">
          <div id="onechild">
            <div id="onegrandchild" data-aep-click-label="lbl-onegrandchild">
              <div id="onegreatgrandchild" data-aep-click-token="tok-onegreatgrandchild"></div>
            </div>
          </div>
        </div>
      </div>
    `;
    const node = createNode(
      "DIV",
      { id: "abc", class: "eq" },
      { innerHTML: content }
    );
    appendNode(document.body, node);

    [
      {
        elementId: "onegreatgrandchild",
        expectedLabel: "lbl-onegrandchild",
        expectedToken: "tok-onegreatgrandchild"
      },
      {
        elementId: "onegrandchild",
        expectedLabel: "lbl-onegrandchild",
        expectedToken: null
      },
      {
        elementId: "onechild",
        expectedLabel: null,
        expectedToken: null
      }
    ].forEach(definition => {
      const element = document.getElementById(definition.elementId);
      const {
        decisionsMeta,
        propositionActionLabel,
        propositionActionToken
      } = collectClicks(element, getClickMetas);

      expect(decisionsMeta).toEqual([
        {
          id: "AT:1234",
          scope: "example_scope",
          items: [
            {
              id: "063"
            }
          ]
        }
      ]);
      expect(propositionActionLabel).toEqual(definition.expectedLabel);
      expect(propositionActionToken).toEqual(definition.expectedToken);
    });
  });

  it("handles case where no interact-id exists", () => {
    storeClickMeta(
      "AT:1234",
      "063",
      "page",
      {
        id: "AT:1234",
        scope: "example_scope"
      },
      99
    );

    const content = `
      <div class="b" >
        <div id="one" class="c">
          <div id="onechild">
            <div id="onegrandchild">
              <div id="onegreatgrandchild"></div>
            </div>
          </div>
        </div>
      </div>
    `;
    const node = createNode(
      "DIV",
      { id: "abc", class: "eq" },
      { innerHTML: content }
    );
    appendNode(document.body, node);

    const element = document.getElementById("onegreatgrandchild");
    expect(collectClicks(element, getClickMetas)).toEqual({});
  });

  it("should collect and dedup clicks with labels", () => {
    // outer
    storeClickMeta(
      "1",
      "p",
      "page",
      {
        id: "AT:outer-id-1",
        scope: "outer-scope1"
      },
      99
    );
    storeClickMeta(
      "1",
      "a",
      "page",
      {
        id: "AT:outer-id-1",
        scope: "outer-scope1"
      },
      99
    );
    storeClickMeta(
      "2",
      "b",
      "page",
      {
        id: "AJO:inner-id-2",
        scope: "inner-scope2",
        trackingLabel: "outer-label-2"
      },
      99
    );
    storeClickMeta(
      "3",
      "c",
      "page",
      {
        id: "AJO:outer-id-3",
        scope: "outer-scope3",
        trackingLabel: "outer-label-3"
      },
      99
    );

    // inner
    storeClickMeta(
      "4",
      "d",
      "page",
      {
        id: "AT:inner-id-1",
        scope: "inner-scope1"
      },
      11
    );
    storeClickMeta(
      "2",
      "b",
      "page",
      {
        id: "AJO:inner-id-2",
        scope: "inner-scope2",
        trackingLabel: "inner-label-2"
      },
      11
    );
    storeClickMeta(
      "6",
      "f",
      "page",
      {
        id: "AJO:inner-id-3",
        scope: "inner-scope3",
        trackingLabel: "inner-label-3"
      },
      11
    );

    const content = `
      <div class="b" data-aep-interact-id="99" data-aep-click-label="outer-label-2" data-aep-click-token="outer-token-2">
        <div id="one" class="c" data-aep-interact-id="11" data-aep-click-label="inner-label-2" data-aep-click-token="inner-token-2">first</div>
        <div id="two" class="c">second</div>
        <div id="three" class="c">third</div>
      </div>
    `;
    const node = createNode(
      "DIV",
      { id: "abc", class: "eq" },
      { innerHTML: content }
    );

    appendNode(document.body, node);

    const element = document.getElementById("one");
    const {
      decisionsMeta,
      propositionActionLabel,
      propositionActionToken
    } = collectClicks(element, getClickMetas);

    expect(decisionsMeta).toEqual(
      jasmine.arrayContaining([
        {
          id: "AJO:inner-id-2",
          scope: "inner-scope2",
          items: [
            {
              id: "b"
            }
          ]
        },
        {
          id: "AT:inner-id-1",
          scope: "inner-scope1",
          items: [
            {
              id: "d"
            }
          ]
        },
        {
          id: "AJO:inner-id-3",
          scope: "inner-scope3",
          items: [
            {
              id: "f"
            }
          ]
        },
        {
          id: "AT:outer-id-1",
          scope: "outer-scope1",
          items: [
            {
              id: "p"
            },
            {
              id: "a"
            }
          ]
        },
        {
          id: "AJO:outer-id-3",
          scope: "outer-scope3",
          items: [
            {
              id: "c"
            }
          ]
        }
      ])
    );
    expect(propositionActionLabel).toEqual("inner-label-2");
    expect(propositionActionToken).toEqual("inner-token-2");
  });
});
