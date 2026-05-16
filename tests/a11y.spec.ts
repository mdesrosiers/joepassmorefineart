import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const pages = ["/", "/about", "/contact", "/paintings/121", "/paintings/001", "/404"];

const themes = [
  {
    name: "light",
    setup: async (page: import("@playwright/test").Page) => {
      await page.emulateMedia({ colorScheme: "light" });
      await page.evaluate(() => document.documentElement.classList.remove("dark"));
    },
  },
  {
    name: "dark",
    setup: async (page: import("@playwright/test").Page) => {
      await page.emulateMedia({ colorScheme: "dark" });
      await page.evaluate(() => document.documentElement.classList.add("dark"));
    },
  },
];

for (const path of pages) {
  for (const theme of themes) {
    test(`a11y ${path} (${theme.name})`, async ({ page }) => {
      await page.goto(path);
      await theme.setup(page);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(results.violations).toEqual([]);
    });
  }
}
