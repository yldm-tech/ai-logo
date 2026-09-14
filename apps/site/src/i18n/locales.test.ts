/**
 * Checks the eleven locale files against en.json, which is the one that gets edited first.
 *
 * A missing key does not break anything loudly: i18next falls back to English and the page still renders, so a translation that was never updated reads as half a page of English to the reader it was written for and as nothing at all to everyone else. An extra key is the same drift from the other end — a string that outlived the component that used it.
 *
 * The strings themselves carry two things a translator can drop without the file failing to parse. An interpolation whose `{{count}}` did not survive renders a sentence with the number missing, and a `<c>` or `<a>` that lost its pair takes its whole `Trans` element with it, because react-i18next matches the tags in the string against the components handed to it.
 *
 * Everything here is derived from en.json and from the directory listing rather than written down, so a key or a language added tomorrow is covered by this test today.
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vite-plus/test";

import { LANGUAGES } from "./index";

// Read off disk rather than imported one by one: a file this test does not know about is exactly the file this test exists to find.
const DIR = join(import.meta.dirname, "locales");

type Tree = { [key: string]: string | Tree };

const load = (code: string) => JSON.parse(readFileSync(join(DIR, `${code}.json`), "utf8")) as Tree;

/** Dotted paths, so a difference is reported as the key someone would search the repo for rather than as a diff of two nested objects. */
const flatten = (tree: Tree, prefix = ""): [string, string][] =>
  Object.entries(tree).flatMap(([key, value]): [string, string][] =>
    typeof value === "string" ? [[`${prefix}${key}`, value]] : flatten(value, `${prefix}${key}.`),
  );

const PLURAL = /_(few|many|one|other|two|zero)$/;

/** The plural forms a language actually has, from the same CLDR data i18next resolves a count with. English needs two and Chinese one, so demanding the same suffixes everywhere would be wrong in both directions: a Russian file without `_few` falls through to English on 22 of every 100 counts. */
const categories = (code: string) => new Intl.PluralRules(code).resolvedOptions().pluralCategories;

const base = (key: string) => key.replace(PLURAL, "");

const singulars = (keys: Iterable<string>) => [...keys].filter((key) => !PLURAL.test(key)).sort();

const plurals = (keys: Iterable<string>) => {
  const groups = new Map<string, string[]>();
  for (const key of keys) {
    const suffix = PLURAL.exec(key)?.[1];
    if (suffix) groups.set(base(key), [...(groups.get(base(key)) ?? []), suffix].sort());
  }
  return groups;
};

const codes = readdirSync(DIR)
  .filter((name) => name.endsWith(".json"))
  .map((name) => name.replace(/\.json$/, ""))
  .sort();

const en = new Map(flatten(load("en")));
const translations = new Map(codes.map((code) => [code, new Map(flatten(load(code)))]));
const others = codes.filter((code) => code !== "en");

/** The English string a translation is measured against. A plural form is measured against en.json's `_other`, because the forms a language has are its own — Russian has two English does not, and they are translations of the same sentence. */
const reference = (key: string) => en.get(key) ?? en.get(`${base(key)}_other`) ?? en.get(base(key));

/** The whole token, `{{count}}` rather than `count`: what has to survive translation is the placeholder as i18next will look for it. */
const placeholders = (text: string) => [...new Set(text.match(/\{\{[^{}]+\}\}/g) ?? [])];

/** Opening and closing tags both, and counted rather than merely present: three `<c>` in the English string and two in the translation means a code span was lost, and an unbalanced pair renders the string as its own markup. */
const tags = (text: string) => (text.match(/<\/?[ac]>/g) ?? []).sort().join("");

describe("locales", () => {
  // The files and the picker are edited separately: a translation nobody added to LANGUAGES is unreachable, and a language in the picker with no file renders the whole site in English the moment it is chosen.
  it("ships a file for every language the picker offers, and no others", () => {
    expect(codes).toEqual(LANGUAGES.map((language) => language.value).sort());
  });

  it.each(others)("%s has exactly the keys en.json has", (code) => {
    const translation = translations.get(code)!;
    const mine = singulars(translation.keys());
    const theirs = singulars(en.keys());

    expect(
      theirs.filter((key) => !translation.has(key)),
      `${code}.json is missing keys`,
    ).toEqual([]);
    expect(
      mine.filter((key) => !en.has(key)),
      `${code}.json has keys en.json does not`,
    ).toEqual([]);
  });

  it.each(others)("%s pluralises exactly the keys en.json pluralises", (code) => {
    const mine = plurals(translations.get(code)!.keys());
    const theirs = plurals(en.keys());

    expect([...mine.keys()].sort(), `${code}.json pluralises different keys`).toEqual(
      [...theirs.keys()].sort(),
    );

    // Every form the language has, and nothing that is not a form of it. An extra suffix is never read; a missing one is read as English.
    for (const key of theirs.keys()) {
      expect(mine.get(key) ?? [], `${code}.json has the wrong plural forms for ${key}`).toEqual(
        [...categories(code)].sort(),
      );
    }
  });

  it.each(others)("%s keeps every interpolation placeholder", (code) => {
    const dropped = [...translations.get(code)!]
      .flatMap(([key, translated]) =>
        placeholders(reference(key) ?? "")
          .filter((placeholder) => !translated.includes(placeholder))
          .map((placeholder) => `${key}: ${placeholder}`),
      )
      .sort();

    expect(dropped, `${code}.json drops placeholders`).toEqual([]);
  });

  it.each(others)("%s keeps every <c> and <a> tag", (code) => {
    const changed = [...translations.get(code)!]
      .filter(([key, translated]) => tags(reference(key) ?? "") !== tags(translated))
      .map(([key, translated]) => `${key}: ${tags(reference(key) ?? "")} → ${tags(translated)}`)
      .sort();

    expect(changed, `${code}.json changes markup tags`).toEqual([]);
  });
});
