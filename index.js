import m3 from "mrmr";
import msg_index from "./msg_index.json";
import fs from "fs";

let all_items = {};

const keys = Object.keys(msg_index);

for (let i = 0; i <= 100; i++) {
  const items = JSON.parse(fs.readFileSync(`items/${i}.json`, "utf-8"));
  for (let itemKey of Object.keys(items)) {
    const item = items[itemKey];
    const key = m3.sum(Buffer.from(item["zh_name"]), 2538058380);
    if (!keys.includes(key.toString())) continue;
    const text_key = msg_index[key];
    const category = Math.floor(parseInt(text_key) / 1000);
    if (typeof category !== "number") continue;
    if (category < 0 || category > 100) continue;
    if (category === NaN) {
      console.log(item);
      continue;
    }
    const lang_file = JSON.parse(fs.readFileSync(`en/${category}.json`, "utf-8"));
    const name = lang_file[text_key];
    console.log(`${itemKey}: ${name}`);
    all_items[itemKey] = name;
  }
}

fs.writeFile("items.json", JSON.stringify(all_items), (err) => {
  if (err) {
    console.log("Error: %O", err);
    return;
  }
  console.log("items.json saved");
});