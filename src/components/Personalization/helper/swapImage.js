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

import { SRC } from "../../../constants/tagNames";
import { setAttribute, removeAttribute } from "./dom";
import { isImage, loadImage } from "./images";

export default (container, url) => {
  if (!isImage(container)) {
    return;
  }

  // Start downloading the image
  loadImage(url);

  // Remove "src" so there is no flicker
  removeAttribute(container, SRC);

  // Replace the image "src"
  setAttribute(container, SRC, url);
};
