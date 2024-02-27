/*
Copyright 2020 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

export default () => {
  const clickMetaStorage = {};
  const clickItemStorage = {};

  const storeClickMeta = (
    propositionId,
    itemId,
    scopeType,
    notification,
    interactId
  ) => {
    // eslint-disable-next-line no-param-reassign
    interactId = parseInt(interactId, 10);

    if (!clickMetaStorage[interactId]) {
      clickMetaStorage[interactId] = {};
      clickItemStorage[interactId] = {};
    }

    if (!clickItemStorage[interactId][propositionId]) {
      clickItemStorage[interactId][propositionId] = new Set();
    }

    clickItemStorage[interactId][propositionId].add(itemId);

    clickMetaStorage[interactId][propositionId] = {
      ...notification,
      scopeType
    };
  };

  const getClickMetas = interactIds => {
    if (!Array.isArray(interactIds) || interactIds.length === 0) {
      return [];
    }

    return Object.values(
      interactIds
        .map(value => parseInt(value, 10))
        .reduce((metaMap, interactId) => {
          Object.keys(clickMetaStorage[interactId] || {}).forEach(
            propositionId => {
              if (!metaMap[propositionId]) {
                metaMap[propositionId] = {
                  proposition: clickMetaStorage[interactId][propositionId],
                  items: new Set()
                };
              }

              metaMap[propositionId].items = new Set([
                ...metaMap[propositionId].items,
                ...clickItemStorage[interactId][propositionId]
              ]);
            }
          );
          return metaMap;
        }, {})
    ).map(({ proposition, items }) => ({
      ...proposition,
      items: Array.from(items).map(id => ({ id }))
    }));
  };

  return {
    storeClickMeta,
    getClickMetas
  };
};
