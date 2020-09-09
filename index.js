import m3 from "mrmr";
import msg_index from "./sd/gettext/msg_index/index.json";
import fs from "fs";
import categoryFile from "./sd/items/category.json";
import groupFile from "./sd/items/group.json";

const msg_index_keys = Object.keys(msg_index);
const langDicts = {};

// Initialize the language map cache
const filenames = fs.readdirSync("sd/gettext/en/");
for (let filename of filenames) {
  const content = fs.readFileSync(`sd/gettext/en/${filename}`, "utf-8");
  const key = filename.replace(".json", "");
  langDicts[key] = JSON.parse(content);
}

const getIndexKey = (name) => m3.sum(Buffer.from(name), 2538058380);

const getTranslatedName = (key) => {
  if (!msg_index_keys.includes(key.toString())) return undefined;
  const text_key = msg_index[key];
  const category = Math.floor(parseInt(text_key) / 1000);
  const lang_file = langDicts[category];
  const name = lang_file[text_key];
  return name;
};

function parseItems() {
  let all_items = {};
  for (let i = 0; i <= 100; i++) {
    const items = JSON.parse(fs.readFileSync(`sd/items/${i}.json`, "utf-8"));
    for (let itemKey of Object.keys(items)) {
      const item = items[itemKey];
      const key = getIndexKey(item["zh_name"]);
      if (!msg_index_keys.includes(key.toString())) continue;
      const text_key = msg_index[key];
      const category = Math.floor(parseInt(text_key) / 1000);
      const lang_file = langDicts[category];
      const name = lang_file[text_key];
      all_items[itemKey] = name;
    }
  }
  return all_items;
}

function parseCategoryFile() {
  const all_groups = {};
  for (let categoryKey of Object.keys(categoryFile)) {
    const category = categoryFile[categoryKey];
    const indexKey = getIndexKey(category["zh_name"]);
    const name = getTranslatedName(indexKey);
    if (!name) continue;
    const groups = {};
    for (let groupKey of Object.keys(groupFile)) {
      let group = groupFile[groupKey];
      const indexKey = getIndexKey(group["zh_name"]);
      const name = getTranslatedName(indexKey);
      groups[groupKey] = name;
    }
    all_groups[categoryKey] = { name, groups };
  }
  return all_groups;
}

fs.writeFile("out/groups.json", JSON.stringify(parseCategoryFile()), (err) => {
  if (err) {
    console.log("Error: %O", err);
    return;
  }
  console.log("out/groups.json saved");
});

fs.writeFile("out/items.json", JSON.stringify(parseItems()), (err) => {
  if (err) {
    console.log("Error: %O", err);
    return;
  }
  console.log("out/items.json saved");
});
