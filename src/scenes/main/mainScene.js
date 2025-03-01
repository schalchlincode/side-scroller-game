import preload from "./configurationMethods/preload";
import create from "./configurationMethods/create";
import update from "./configurationMethods/update";

function doPreload() {
  preload(this);
}

function doCreate() {
  create(this);
}

function doUpdate() {
  update(this);
}

export default {
  preload: doPreload,
  create: doCreate,
  update: doUpdate,
};
