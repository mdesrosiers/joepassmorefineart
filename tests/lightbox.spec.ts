import { test, expect } from "@playwright/test";

test("clicking a thumbnail opens the lightbox and updates the URL", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator("a[data-painting-slug='121']").click();
  await expect(page).toHaveURL(/\/paintings\/121/);
  await expect(page.locator("#lightbox")).toBeVisible();
});

test("Esc closes the lightbox", async ({ page }) => {
  await page.goto("/");
  await page.locator("a[data-painting-slug='121']").click();
  await page.keyboard.press("Escape");
  await expect(page.locator("#lightbox")).not.toBeVisible();
});

test("ArrowRight navigates to next painting", async ({ page }) => {
  await page.goto("/");
  await page.locator("a[data-painting-slug='121']").click();
  await page.keyboard.press("ArrowRight");
  await expect(page).toHaveURL(/\/paintings\/120/);
});

test("Direct visit to /paintings/042 renders standalone page (no lightbox)", async ({
  page,
}) => {
  await page.goto("/paintings/042");
  await expect(page.locator("article img")).toBeVisible();
  await expect(page.locator("#lightbox")).toHaveCount(0);
});
