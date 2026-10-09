// cSpell:ignore unassigns spinbutton
import * as fixtures from "../../scripts/seed/fixtures";
import { expect, test } from "./test";

test.describe("Catalog - admin", () => {
  test.use({ storageState: ".auth/admin.json" });
  test.describe.configure({ mode: "serial" });

  test("rejects a too short category name", async ({ page }) => {
    await page.goto("/catalog");

    await page.getByRole("button", { name: "Categories", exact: true }).click();
    await page.getByLabel("New category").fill("ab");
    await page.getByRole("button", { name: "Add", exact: true }).click();

    await expect(page.getByLabel("New category").and(page.locator(":invalid"))).toHaveCount(1);

    await page.reload();
    await page.getByRole("button", { name: "Categories", exact: true }).click();

    await expect(page.getByText("ab", { exact: true })).toBeHidden();
  });

  test("adds a category", async ({ page }) => {
    const dialog = page.getByRole("dialog", { name: "Categories" });

    await page.goto("/catalog");

    await page.getByRole("button", { name: "Categories", exact: true }).click();
    await page.getByLabel("New category").fill("Neck");
    await page.getByRole("button", { name: "Add", exact: true }).click();

    await expect(dialog.getByText("Neck", { exact: true })).toBeVisible();
    await expect(
      dialog.getByRole("listitem", { name: "Neck" }).getByText("No exercises", { exact: true }),
    ).toBeVisible();
    await expect(page.getByLabel("New category")).toHaveValue("");

    await page.reload();
    await page.getByRole("button", { name: "Categories", exact: true }).click();

    await expect(dialog.getByText("Neck", { exact: true })).toBeVisible();
  });

  test("rejects a duplicate category name", async ({ page }) => {
    await page.goto("/catalog");

    await page.getByRole("button", { name: "Categories", exact: true }).click();
    await page.getByLabel("New category").fill(fixtures.categories.abs.name.toUpperCase());
    await page.getByRole("button", { name: "Add", exact: true }).click();

    await expect(page.getByText("Could not add the category")).toBeVisible();

    await page.reload();
    await page.getByRole("button", { name: "Categories", exact: true }).click();

    await expect(page.getByRole("button", { name: "Rename Abs" })).toHaveCount(1);
  });

  test("rejects a too short exercise name and description", async ({ page }) => {
    await page.goto("/catalog");

    await page.getByRole("button", { name: "New exercise" }).click();
    await page.getByLabel("Exercise name").fill("ab");
    await page.getByLabel("Description").fill("ab");
    await page.getByRole("button", { name: "Next", exact: true }).click();

    await expect(page.getByLabel("Exercise name").and(page.locator(":invalid"))).toHaveCount(1);
    await expect(page.getByLabel("Description").and(page.locator(":invalid"))).toHaveCount(1);

    await page.reload();

    await expect(page.getByText("33 of 33")).toBeVisible();
  });

  test("rejects a duplicate exercise name", async ({ page }) => {
    await page.goto("/catalog");

    await page.getByRole("button", { name: "New exercise" }).click();
    await page.getByLabel("Exercise name").fill(fixtures.exercises.facePull.name.toUpperCase());
    await page
      .getByLabel("Description")
      .fill("Lie on your back, curl the head up with a plate on the forehead.");
    await page.getByRole("button", { name: "Next", exact: true }).click();
    await page.getByRole("button", { name: "Next", exact: true }).click();
    await page.getByLabel("Select image").setInputFiles("scripts/seed/assets/exercise.webp");
    await page.getByRole("button", { name: "Add", exact: true }).click();

    await expect(page.getByText("Could not add the exercise")).toBeVisible();

    await page.reload();

    await expect(page.getByText("33 of 33")).toBeVisible();
  });

  test("adds an exercise", async ({ page }) => {
    await page.goto("/catalog");

    await page.getByRole("button", { name: "New exercise" }).click();
    await page.getByLabel("Exercise name").fill("Neck curl");
    await page
      .getByLabel("Description")
      .fill("Lie on your back, curl the head up with a plate on the forehead.");
    await page.getByRole("button", { name: "Next", exact: true }).click();

    await expect(
      page.getByRole("group", { name: "Load step" }).getByRole("radio", { name: "2.5 kg", exact: true }),
    ).toBeChecked();

    await page.getByRole("dialog", { name: "New exercise" }).getByText("Bodyweight", { exact: true }).click();

    await expect(page.getByRole("group", { name: "Load step" })).toBeHidden();

    await page.getByRole("button", { name: "Next", exact: true }).click();
    await page.getByLabel("Select image").setInputFiles("scripts/seed/assets/exercise.webp");
    await page.getByRole("button", { name: "Add", exact: true }).click();

    await expect(page).toHaveURL(/\/catalog\/exercise\/[0-9a-f-]{36}$/);
    await expect(page.getByRole("heading", { level: 1, name: "Neck curl" })).toBeVisible();

    await page.goto("/catalog");

    await expect(page.getByText("34 of 34")).toBeVisible();
    await expect(page.getByRole("link", { name: "Neck curl Bodyweight", exact: true })).toBeVisible();

    await page.getByRole("button", { name: "New exercise" }).click();

    await expect(page.getByLabel("Exercise name")).toHaveValue("");
  });

  test("rejects a too short new exercise name", async ({ page }) => {
    await page.goto("/catalog");
    await page.getByRole("textbox", { name: "Search by name" }).fill("Neck curl");
    await page.getByRole("link", { name: "Neck curl Bodyweight", exact: true }).click();

    await page.getByRole("button", { name: "Rename Neck curl" }).click();
    await page.getByLabel("Exercise name").fill("ab");
    await page.getByRole("button", { name: "Save", exact: true }).click();

    await expect(page.getByLabel("Exercise name").and(page.locator(":invalid"))).toHaveCount(1);

    await page.reload();

    await expect(page.getByRole("heading", { level: 1, name: "Neck curl" })).toBeVisible();
  });

  test("renames the exercise", async ({ page }) => {
    await page.goto("/catalog");
    await page.getByRole("textbox", { name: "Search by name" }).fill("Neck curl");
    await page.getByRole("link", { name: "Neck curl Bodyweight", exact: true }).click();

    await page.getByRole("button", { name: "Rename Neck curl" }).click();
    await page.getByLabel("Exercise name").fill("Neck flexion");
    await page.getByRole("button", { name: "Save", exact: true }).click();

    await expect(page.getByRole("heading", { level: 1, name: "Neck flexion" })).toBeVisible();

    await page.reload();

    await expect(page.getByRole("heading", { level: 1, name: "Neck flexion" })).toBeVisible();
  });

  test("assigns the category to the exercise", async ({ page }) => {
    const categories = page.getByRole("list", { name: "Categories" });

    await page.goto("/catalog");
    await page.getByRole("textbox", { name: "Search by name" }).fill("Neck flexion");
    await page.getByRole("link", { name: "Neck flexion" }).click();

    await page.getByRole("button", { name: "Assign", exact: true }).click();
    await page.getByLabel("Category to assign").selectOption({ label: "Neck" });
    await page.getByLabel("Role", { exact: true }).selectOption({ label: "Secondary" });
    await page.getByRole("button", { name: "Assign", exact: true }).click();

    await expect(categories.getByRole("combobox", { name: "Change role of Neck" })).toHaveValue("secondary");

    await page.reload();

    await expect(categories.getByRole("combobox", { name: "Change role of Neck" })).toHaveValue("secondary");
  });

  test("sets the category role", async ({ page }) => {
    const categories = page.getByRole("list", { name: "Categories" });
    const role = categories.getByRole("combobox", { name: "Change role of Neck" });

    await page.goto("/catalog");
    await page.getByRole("textbox", { name: "Search by name" }).fill("Neck flexion");
    await page.getByRole("link", { name: "Neck flexion" }).click();

    await role.selectOption({ label: "Primary" });

    await expect(categories.getByRole("img", { name: "Primary", exact: true })).toBeVisible();
    await expect(role).toHaveValue("primary");

    await page.reload();

    await expect(role).toHaveValue("primary");
  });

  test("rejects a too short new category name", async ({ page }) => {
    const field = page.getByRole("form", { name: "Rename Neck" }).getByLabel("Category name");

    await page.goto("/catalog");

    await page.getByRole("button", { name: "Categories", exact: true }).click();
    await page.getByRole("button", { name: "Rename Neck" }).click();
    await field.fill("ab");
    await page.getByRole("button", { name: "Save", exact: true }).click();

    await expect(field.and(page.locator(":invalid"))).toHaveCount(1);

    await page.reload();
    await page.getByRole("button", { name: "Categories", exact: true }).click();

    await expect(page.getByRole("button", { name: "Rename Neck" })).toBeVisible();
  });

  test("renames the category", async ({ page }) => {
    const categories = page.getByRole("list", { name: "Categories" });

    await page.goto("/catalog");

    await page.getByRole("button", { name: "Categories", exact: true }).click();
    await page.getByRole("button", { name: "Rename Neck" }).click();
    await page.getByRole("form", { name: "Rename Neck" }).getByLabel("Category name").fill("Neck and traps");
    await page.getByRole("button", { name: "Save", exact: true }).click();

    await expect(page.getByRole("button", { name: "Rename Neck and traps" })).toBeVisible();

    await page.reload();
    await page.getByRole("textbox", { name: "Search by name" }).fill("Neck flexion");
    await page.getByRole("link", { name: "Neck flexion" }).click();

    await expect(categories.getByRole("combobox", { name: "Change role of Neck and traps" })).toBeVisible();
  });

  test("rejects an empty exercise description", async ({ page }) => {
    await page.goto("/catalog");
    await page.getByRole("textbox", { name: "Search by name" }).fill("Neck flexion");
    await page.getByRole("link", { name: "Neck flexion" }).click();

    await page
      .getByRole("button", { name: "Lie on your back, curl the head up with a plate on the forehead." })
      .click();
    await page.getByLabel("Description").fill("");
    await page.getByRole("button", { name: "Save", exact: true }).click();

    await expect(page.getByLabel("Description").and(page.locator(":invalid"))).toHaveCount(1);

    await page.reload();

    await expect(
      page.getByRole("button", { name: "Lie on your back, curl the head up with a plate on the forehead." }),
    ).toBeVisible();
  });

  test("rejects a too short exercise description", async ({ page }) => {
    await page.goto("/catalog");
    await page.getByRole("textbox", { name: "Search by name" }).fill("Neck flexion");
    await page.getByRole("link", { name: "Neck flexion" }).click();

    await page
      .getByRole("button", { name: "Lie on your back, curl the head up with a plate on the forehead." })
      .click();
    await page.getByLabel("Description").fill("ab");
    await page.getByRole("button", { name: "Save", exact: true }).click();

    await expect(page.getByLabel("Description").and(page.locator(":invalid"))).toHaveCount(1);

    await page.reload();

    await expect(
      page.getByRole("button", { name: "Lie on your back, curl the head up with a plate on the forehead." }),
    ).toBeVisible();
  });

  test("edits the exercise description", async ({ page }) => {
    await page.goto("/catalog");
    await page.getByRole("textbox", { name: "Search by name" }).fill("Neck flexion");
    await page.getByRole("link", { name: "Neck flexion" }).click();

    await page
      .getByRole("button", { name: "Lie on your back, curl the head up with a plate on the forehead." })
      .click();
    await page.getByLabel("Description").fill("Lie on your back, curl the head up against a light plate.");
    await page.getByRole("button", { name: "Save", exact: true }).click();

    await expect(
      page.getByRole("button", { name: "Lie on your back, curl the head up against a light plate." }),
    ).toBeVisible();

    await page.reload();

    await expect(
      page.getByRole("button", { name: "Lie on your back, curl the head up against a light plate." }),
    ).toBeVisible();
  });

  test("sets the load step of an exercise", async ({ page }) => {
    await page.goto(`/catalog/exercise/${fixtures.exercises.bicepsCurlBarStraight.id}`);

    await page.getByRole("button", { name: "Change load step: 2.5 kg" }).click();
    await page.getByRole("group", { name: "Load step" }).getByText("Dumbbells", { exact: true }).click();
    await page.getByRole("button", { name: "Save", exact: true }).click();

    await expect(page.getByRole("button", { name: "Change load step: Dumbbells" })).toBeVisible();

    await page.reload();

    await expect(page.getByRole("button", { name: "Change load step: Dumbbells" })).toBeVisible();
  });

  test("changes the exercise image", async ({ page }) => {
    const image = page.getByRole("img", { name: "Neck flexion" });

    await page.goto("/catalog");
    await page.getByRole("textbox", { name: "Search by name" }).fill("Neck flexion");
    await page.getByRole("link", { name: "Neck flexion" }).click();
    const before = await image.getAttribute("src");

    await page.getByRole("button", { name: "Change image", exact: true }).click();
    await page.getByLabel("Select image").setInputFiles("scripts/seed/assets/exercise-alternative.webp");
    await page.getByRole("button", { name: "Save", exact: true }).click();

    await expect(image).not.toHaveAttribute("src", before ?? "");

    await page.reload();

    await expect(image).not.toHaveAttribute("src", before ?? "");
  });

  test("unassigns the category from the exercise", async ({ page }) => {
    await page.goto("/catalog");
    await page.getByRole("textbox", { name: "Search by name" }).fill("Neck flexion");
    await page.getByRole("link", { name: "Neck flexion" }).click();

    await page.getByRole("button", { name: "Unassign Neck and traps" }).click();

    await expect(page.getByText("No categories assigned")).toBeVisible();

    await page.reload();

    await expect(page.getByText("No categories assigned")).toBeVisible();
  });

  test("deletes an exercise used only by a workout", async ({ page }) => {
    const row = page.getByRole("listitem", { name: "Neck flexion", exact: true });

    await page.goto(`/workouts/${fixtures.admin.scheduledWorkout.id}`);
    await page.getByRole("button", { name: "Add exercise" }).click();
    await page.getByRole("searchbox", { name: "Exercise" }).fill("Neck flexion");
    await page.getByRole("radio", { name: "Neck flexion" }).click();
    await page.getByRole("spinbutton", { name: "Sets", exact: true }).fill("3");
    await page.getByRole("spinbutton", { name: "Reps", exact: true }).fill("12");
    await page.getByRole("spinbutton", { name: "Max reps", exact: true }).fill("15");
    await page
      .getByRole("dialog", { name: "Add exercise" })
      .getByRole("button", { name: "Add exercise" })
      .click();
    await expect(row.getByRole("link", { name: "Neck flexion", exact: true })).toBeVisible();
    await page.goto("/catalog");
    await page.getByRole("textbox", { name: "Search by name" }).fill("Neck flexion");
    await page.getByRole("link", { name: "Neck flexion" }).click();

    await page.getByRole("button", { name: "More actions" }).click();
    await page.getByRole("menuitem", { name: "Delete" }).click();
    await page.getByRole("button", { name: "Delete", exact: true }).click();
    await expect(page).toHaveURL("/catalog");
    await expect(page.getByText("33 of 33")).toBeVisible();
    await page.goto(`/workouts/${fixtures.admin.scheduledWorkout.id}`);

    await expect(row.getByText("Neck flexion", { exact: true })).toBeVisible();
    await expect(row.getByRole("img", { name: "Neck flexion" })).toHaveCount(0);
    await expect(row.getByRole("link", { name: "Neck flexion", exact: true })).toBeHidden();
  });

  test("deletes the unused category", async ({ page }) => {
    await page.goto("/catalog");

    await page.getByRole("button", { name: "Categories", exact: true }).click();
    await page.getByRole("button", { name: "Delete Neck and traps" }).click();
    await page.getByRole("button", { name: "Delete", exact: true }).click();

    await expect(page.getByRole("button", { name: "Rename Neck and traps" })).toBeHidden();

    await page.reload();
    await page.getByRole("button", { name: "Categories", exact: true }).click();

    await expect(page.getByRole("button", { name: "Rename Neck and traps" })).toBeHidden();
  });

  test("deletes a category assigned to an exercise", async ({ page }) => {
    const categories = page.getByRole("list", { name: "Categories" });

    await page.goto("/catalog");
    await page.getByRole("button", { name: "Categories", exact: true }).click();
    await page.getByLabel("New category").fill("Grip");
    await page.getByRole("button", { name: "Add", exact: true }).click();
    await expect(page.getByRole("button", { name: "Delete Grip" })).toBeVisible();
    await page.goto(`/catalog/exercise/${fixtures.exercises.hammerCurlDumbbells.id}`);
    await page.getByRole("button", { name: "Assign", exact: true }).click();
    await page.getByLabel("Category to assign").selectOption({ label: "Grip" });
    await page.getByRole("button", { name: "Assign", exact: true }).click();
    await expect(categories.getByRole("combobox", { name: "Change role of Grip" })).toBeVisible();

    await page.goto("/catalog");
    await page.getByRole("button", { name: "Categories", exact: true }).click();
    await expect(
      page
        .getByRole("listitem", { name: "Grip" })
        .getByText(fixtures.exercises.hammerCurlDumbbells.name, { exact: true }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Delete Grip" }).click();
    await page.getByRole("button", { name: "Delete", exact: true }).click();
    await expect(page.getByRole("button", { name: "Delete Grip" })).toBeHidden();
    await page.goto(`/catalog/exercise/${fixtures.exercises.hammerCurlDumbbells.id}`);

    await expect(categories.getByRole("combobox", { name: "Change role of Grip" })).toBeHidden();
    await expect(categories.getByRole("combobox", { name: "Change role of Biceps" })).toBeVisible();
    await expect(categories.getByRole("combobox", { name: "Change role of Forearms" })).toBeVisible();
  });
});
