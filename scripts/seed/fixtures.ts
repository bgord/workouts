// cSpell:ignore Aparts
export const password = "1234567890";

export const categories = {
  abs: { id: "cfee8759-23b3-4ab5-92de-d4eacccf13cd", name: "Abs" },
  biceps: { id: "08f888d0-8b58-4419-808f-c9691df8fefa", name: "Biceps" },
  calves: { id: "068ba72c-424e-4ebb-ba3f-933ed67d227f", name: "Calves" },
  chest: { id: "7896055d-22f8-4769-bc8d-050665f7289f", name: "Chest" },
  forearms: { id: "24e18bd8-1ba9-4938-8647-e4336006c3c9", name: "Forearms" },
  glutes: { id: "2f38f582-2297-47e3-b0c2-9a03e7868867", name: "Glutes" },
  hamstrings: { id: "4c50279f-ad24-4ebf-9323-2f0a17bfefc4", name: "Hamstrings" },
  lats: { id: "e14726a4-0335-479d-9e67-77558cf47b14", name: "Lats" },
  lowerBack: { id: "d0228b96-5cd2-4bcd-ba7d-331b8ebf2eaf", name: "Lower back" },
  quads: { id: "02be5629-f4c6-46e0-8b56-88d1ef364fb3", name: "Quads" },
  shoulders: { id: "bec803ef-e1d0-4446-bca0-de146f8ac008", name: "Shoulders" },
  triceps: { id: "805860a2-72b9-4e67-b145-a6e4b90caab1", name: "Triceps" },
  upperMidBack: { id: "38d787bb-2fbe-4dfd-8c3e-d46df660cfa3", name: "Upper/mid back" },
};

export const exercises = {
  bicepsCurlBarStraight: {
    id: "1e1b6d3d-56b7-4784-a197-c3661349aacc",
    name: "Biceps curl bar straight",
    description:
      "Stand tall, elbows pinned to your sides. Curl the bar up without swinging, lower under control.",
    resistance: "weighted",
    categories: [categories.biceps, categories.forearms],
  },
  bulgarianSplitSquatDumbbell: {
    id: "554fe080-03fe-49cb-a69c-e14ee77e7e70",
    name: "Bulgarian split squat dumbbell",
    description:
      "Rear foot on a bench, dumbbells at your sides. Drop the back knee straight down, drive through the front heel.",
    resistance: "weighted",
    categories: [categories.glutes, categories.hamstrings, categories.quads],
  },
  calfRaisesLegPress: {
    id: "db7fe303-df78-47fb-8123-bf708638aeb2",
    name: "Calf raises leg press",
    description:
      "Balls of the feet on the platform edge. Push through the toes to full extension, lower into a deep stretch.",
    resistance: "weighted",
    categories: [categories.calves],
  },
  calfRaisesMachine: {
    id: "e939f5e1-e4f1-4825-85a7-7135c20d3188",
    name: "Calf raises machine",
    description:
      "Shoulders under the pads, heels off the step. Rise as high as possible, pause, lower slowly.",
    resistance: "weighted",
    categories: [categories.calves],
  },
  calfRaisesSeatedDumbbells: {
    id: "57a93a3c-fcc7-4f56-a851-3bb5c90adee0",
    name: "Calf raises seated dumbbells",
    description: "Seated, dumbbells resting on the knees. Lift the heels high, lower into a full stretch.",
    resistance: "weighted",
    categories: [categories.calves],
  },
  calfRaisesStandingDumbbellSingleLeg: {
    id: "ef0e05d4-449e-4392-83a4-7b4e2c0ded6b",
    name: "Calf raises standing dumbbell single leg",
    description:
      "One foot on a step, dumbbell in the same-side hand. Rise onto the toes, lower the heel below the step.",
    resistance: "weighted",
    categories: [categories.calves],
  },
  concentrationCurlDumbbell: {
    id: "0ac34de0-732f-42c4-baea-b38ba1759f75",
    name: "Concentration curl dumbbell",
    description:
      "Seated, elbow braced against the inner thigh. Curl without moving the upper arm, squeeze at the top.",
    resistance: "weighted",
    categories: [categories.biceps, categories.forearms],
  },
  facePull: {
    id: "209915f0-2099-41ae-aa55-060d670af8dc",
    name: "Face pull",
    description:
      "Rope at face height. Pull towards the forehead with high elbows, spreading the rope apart at the end.",
    resistance: "weighted",
    categories: [categories.shoulders, categories.upperMidBack],
  },
  hammerCurlDumbbells: {
    id: "3410b3ef-df5f-4467-a5f7-d21ea8e0c71a",
    name: "Hammer curl dumbbells",
    description:
      "Neutral grip, palms facing each other. Curl without rotating the wrists, keep the elbows still.",
    resistance: "weighted",
    categories: [categories.biceps, categories.forearms],
  },
  hangingLegRaise: {
    id: "9b3f6c2e-4d1a-4e8b-a7c5-2f6d8e0b1c3a",
    name: "Hanging leg raise",
    description:
      "Hang from the bar, arms straight. Raise the legs to hip height without swinging, lower slowly.",
    resistance: "bodyweight",
    categories: [categories.abs],
  },
  hammerStrengthIncline: {
    id: "b28c649e-c58e-400e-9b9c-646181919db4",
    name: "Hammer strength incline",
    description:
      "Handles in line with the upper chest. Press up and slightly in, lower until the chest is stretched.",
    resistance: "weighted",
    categories: [categories.chest, categories.shoulders, categories.triceps],
  },
  independentChestPress: {
    id: "4171e0ed-844f-46b9-9946-c4c562f57a0d",
    name: "Independent chest press",
    description: "Handles at mid-chest, shoulder blades back. Press both arms evenly, control the return.",
    resistance: "weighted",
    categories: [categories.chest, categories.shoulders, categories.triceps],
  },
  latPullDownCable: {
    id: "d4fc3793-a8c1-42b7-8162-dc7c59dadda9",
    name: "Lat pull-down cable",
    description:
      "Grip slightly wider than the shoulders. Pull the bar to the upper chest leading with the elbows, no leaning back.",
    resistance: "weighted",
    categories: [categories.biceps, categories.forearms, categories.lats, categories.upperMidBack],
  },
  lateralRaiseDumbbells: {
    id: "867680bc-73d3-4827-930f-47795690ca8e",
    name: "Lateral raise dumbbells",
    description: "Slight bend in the elbows. Raise to shoulder height leading with the elbows, lower slowly.",
    resistance: "weighted",
    categories: [categories.shoulders, categories.upperMidBack],
  },
  legCurlLying: {
    id: "988255d6-e7a4-4149-b2b7-a140dd6e97ca",
    name: "Leg curl lying",
    description:
      "Knees just off the pad edge, hips pressed down. Curl the heels towards the glutes, lower under control.",
    resistance: "weighted",
    categories: [categories.hamstrings],
  },
  legCurlSeated: {
    id: "dec297bd-5e97-4fae-904c-c614147769d2",
    name: "Leg curl seated",
    description: "Thigh pad locked down, knees in line with the pivot. Curl fully, pause, return slowly.",
    resistance: "weighted",
    categories: [categories.hamstrings],
  },
  legExtensionBothLegs: {
    id: "dfca1f6a-c724-4b0e-826e-37bb7a36e7f6",
    name: "Leg extension both legs",
    description:
      "Knees in line with the pivot, back against the pad. Extend fully, pause, lower under control.",
    resistance: "weighted",
    categories: [categories.quads],
  },
  legExtensionSingleLeg: {
    id: "3aea56d2-b58c-4838-9ade-7ee3349fe03a",
    name: "Leg extension single leg",
    description: "One leg at a time, knee in line with the pivot. Extend fully and hold briefly at the top.",
    resistance: "weighted",
    categories: [categories.quads],
  },
  legPressBridge: {
    id: "442226bb-e686-44e2-9d4f-c6d4f6e6051c",
    name: "Leg press bridge",
    description:
      "Feet high and wide on the platform to bias glutes and hamstrings. Press through the heels, control the descent.",
    resistance: "weighted",
    categories: [categories.glutes, categories.hamstrings, categories.quads],
  },
  legPressHorizontal: {
    id: "83816ce3-ff71-44d2-b275-67ec4f5f52f6",
    name: "Leg press horizontal",
    description:
      "Feet shoulder-width apart on the platform. Bend the knees to about 90 degrees, press back without locking out.",
    resistance: "weighted",
    categories: [categories.glutes, categories.hamstrings, categories.quads],
  },
  lowRowCable: {
    id: "bcab0134-a75b-4dfc-af68-d849a9c05114",
    name: "Low row cable",
    description:
      "Chest up, slight forward lean at the start. Row the handle to the lower ribs, squeeze the shoulder blades.",
    resistance: "weighted",
    categories: [categories.biceps, categories.forearms, categories.lats, categories.upperMidBack],
  },
  lowRowIsoLateral: {
    id: "bb53b601-1b2d-48c7-b6b9-1b5bf750a6bc",
    name: "Low row iso-lateral",
    description:
      "Chest against the pad. Row each handle towards the hip, squeeze the shoulder blades together.",
    resistance: "weighted",
    categories: [categories.biceps, categories.forearms, categories.lats, categories.upperMidBack],
  },
  lowRowMachine: {
    id: "42839455-9845-4ad1-9797-4d2a5975920d",
    name: "Low row machine",
    description:
      "Chest against the pad, arms fully extended. Pull the handles to the torso, pause, return slowly.",
    resistance: "weighted",
    categories: [categories.biceps, categories.forearms, categories.lats, categories.upperMidBack],
  },
  overheadPressSeatedDumbbells: {
    id: "269593cc-3ca4-49a0-81d7-50f6d6ba3982",
    name: "Overhead press seated dumbbells",
    description:
      "Back against an upright bench, dumbbells at shoulder height. Press overhead without arching, lower to the ears.",
    resistance: "weighted",
    categories: [categories.shoulders, categories.triceps, categories.upperMidBack],
  },
  pecDeck: {
    id: "70373bb8-e0ab-43ec-8201-4188fc7f38a3",
    name: "Pec deck",
    description:
      "Elbows slightly bent, handles at chest height. Bring the arms together in an arc, squeeze, open slowly.",
    resistance: "weighted",
    categories: [categories.biceps, categories.chest, categories.shoulders],
  },
  pecFlyCable: {
    id: "bbff7ad1-e63d-4d83-8938-2356bddf6a6d",
    name: "Pec fly cable",
    description:
      "Cables at shoulder height, one step forward. Sweep the hands together in a wide arc, control the stretch.",
    resistance: "weighted",
    categories: [categories.biceps, categories.chest, categories.shoulders],
  },
  pecFlyMachine: {
    id: "0cdd77e8-ab97-4b01-8f6e-6a6e26574f62",
    name: "Pec fly machine",
    description: "Handles in line with the chest. Hug the handles together, pause, return to a full stretch.",
    resistance: "weighted",
    categories: [categories.biceps, categories.chest, categories.shoulders],
  },
  pullUp: {
    id: "68c6c2e7-2c01-46a8-9dc0-e0e49b892657",
    name: "Pull-up",
    description: "Hang with an overhand grip. Pull until the chin clears the bar, lower to a full hang.",
    resistance: "weighted",
    categories: [categories.biceps, categories.forearms, categories.lats, categories.upperMidBack],
  },
  romanianDeadliftDumbbellSingleLeg: {
    id: "6097f8e7-3f02-4d6e-ba38-c551471ec57a",
    name: "Romanian deadlift dumbbell single leg",
    description:
      "Dumbbell in the opposite hand. Hinge at the hip with the back leg rising, stop when the hamstring is stretched.",
    resistance: "weighted",
    categories: [categories.glutes, categories.hamstrings, categories.lowerBack],
  },
  straightArmPulldownBar: {
    id: "86f8a1d1-29d3-49a1-a60a-ea2dfe4d9df3",
    name: "Straight-arm pulldown bar",
    description:
      "Arms straight, slight hip hinge. Sweep the bar down to the thighs using the lats, return slowly.",
    resistance: "weighted",
    categories: [categories.lats, categories.upperMidBack],
  },
  superHorizontalBenchPress: {
    id: "ce5054e8-3f37-427b-b303-a6f44b4bbb34",
    name: "Super horizontal bench press",
    description:
      "Handles at mid-chest, feet flat. Press forward to near lockout, lower until the chest is stretched.",
    resistance: "weighted",
    categories: [categories.chest, categories.shoulders, categories.triceps],
  },
  tricepsExtensionOverheadCable: {
    id: "b0686d56-0f67-44b0-9bfa-04def9665c91",
    name: "Triceps extension overhead cable",
    description:
      "Facing away from the stack, rope behind the head. Extend the elbows fully, keep the upper arms still.",
    resistance: "weighted",
    categories: [categories.triceps],
  },
  tricepsPushDownBar: {
    id: "6748ac08-f295-45d9-8698-a55cfa7b7cd8",
    name: "Triceps push-down bar",
    description: "Elbows pinned to the sides. Push the bar down to full lockout, return to about 90 degrees.",
    resistance: "weighted",
    categories: [categories.triceps],
  },
};

export const startingLoads: Record<string, number> = {
  [exercises.superHorizontalBenchPress.id]: 60,
  [exercises.overheadPressSeatedDumbbells.id]: 16,
  [exercises.tricepsPushDownBar.id]: 25,
  [exercises.pecFlyMachine.id]: 40,
  [exercises.tricepsExtensionOverheadCable.id]: 15,
  [exercises.lateralRaiseDumbbells.id]: 8,
  [exercises.pullUp.id]: 0,
  [exercises.lowRowCable.id]: 50,
  [exercises.straightArmPulldownBar.id]: 25,
  [exercises.concentrationCurlDumbbell.id]: 10,
  [exercises.hammerCurlDumbbells.id]: 12,
  [exercises.facePull.id]: 20,
  [exercises.legPressHorizontal.id]: 120,
  [exercises.bulgarianSplitSquatDumbbell.id]: 14,
  [exercises.romanianDeadliftDumbbellSingleLeg.id]: 16,
  [exercises.legCurlSeated.id]: 40,
  [exercises.legExtensionSingleLeg.id]: 20,
  [exercises.calfRaisesMachine.id]: 60,
  [exercises.hangingLegRaise.id]: 0,
};

export const ppl = {
  name: "PPL",
  description: "3x times (or more per week) - Monday Push, Wednesday Pull, Saturday Legs.",
  sections: {
    push: {
      name: "Push",
      warmup:
        "10x Arm Circles forward\n10x Arm Circles backward\n10x Band Shoulder Dislocates\n15x Band Pull-Aparts\n10x Dumbbell External Rotation",
      cooldown: "Doorway chest stretch, 2 minutes each side",
      instructions: [
        {
          exercise: exercises.superHorizontalBenchPress,
          sets: 4,
          reps: { min: 5, max: 5 },
          progression: "double_progression",
        },
        {
          exercise: exercises.overheadPressSeatedDumbbells,
          sets: 3,
          reps: { min: 8, max: 10 },
          progression: "double_progression",
        },
        {
          exercise: exercises.tricepsPushDownBar,
          sets: 3,
          reps: { min: 8, max: 10 },
          progression: "double_progression",
        },
        {
          exercise: exercises.pecFlyMachine,
          sets: 3,
          reps: { min: 10, max: 12 },
          progression: "double_progression",
        },
        {
          exercise: exercises.tricepsExtensionOverheadCable,
          sets: 3,
          reps: { min: 8, max: 10 },
          progression: "double_progression",
        },
        {
          exercise: exercises.lateralRaiseDumbbells,
          sets: 3,
          reps: { min: 8, max: 12 },
          progression: "double_progression",
        },
      ],
    },
    pull: {
      name: "Pull",
      warmup:
        "10x Arm Circles forward\n10x Arm Circles backward\n10x Band Shoulder Dislocates\n15x Band Pull-Aparts",
      instructions: [
        { exercise: exercises.pullUp, sets: 4, reps: { min: 4, max: 6 }, progression: "linear_progression" },
        {
          exercise: exercises.lowRowCable,
          sets: 3,
          reps: { min: 8, max: 10 },
          progression: "double_progression",
        },
        {
          exercise: exercises.straightArmPulldownBar,
          sets: 3,
          reps: { min: 8, max: 10 },
          progression: "double_progression",
        },
        {
          exercise: exercises.concentrationCurlDumbbell,
          sets: 3,
          reps: { min: 8, max: 10 },
          progression: "double_progression",
        },
        {
          exercise: exercises.hammerCurlDumbbells,
          sets: 3,
          reps: { min: 8, max: 10 },
          progression: "double_progression",
        },
        {
          exercise: exercises.facePull,
          sets: 3,
          reps: { min: 12, max: 15 },
          progression: "double_progression",
        },
      ],
    },
    legs: {
      name: "Legs",
      instructions: [
        {
          exercise: exercises.legPressHorizontal,
          sets: 4,
          reps: { min: 6, max: 8 },
          progression: "double_progression",
        },
        {
          exercise: exercises.bulgarianSplitSquatDumbbell,
          sets: 3,
          reps: { min: 8, max: 10 },
          progression: "double_progression",
        },
        {
          exercise: exercises.romanianDeadliftDumbbellSingleLeg,
          sets: 3,
          reps: { min: 8, max: 10 },
          progression: "double_progression",
        },
        {
          exercise: exercises.legCurlSeated,
          sets: 3,
          reps: { min: 10, max: 12 },
          progression: "double_progression",
        },
        {
          exercise: exercises.legExtensionSingleLeg,
          sets: 3,
          reps: { min: 10, max: 12 },
          progression: "double_progression",
        },
        {
          exercise: exercises.calfRaisesMachine,
          sets: 3,
          reps: { min: 12, max: 15 },
          progression: "double_progression",
        },
        {
          exercise: exercises.hangingLegRaise,
          sets: 3,
          reps: { min: 10, max: 15 },
          progression: "double_progression",
        },
      ],
    },
  },
};

export const fullBody = {
  name: "Full body",
  description: "2x per week - Monday and Thursday.",
  sections: {
    fullBody: {
      name: "Full body",
      instructions: [
        {
          exercise: exercises.legPressHorizontal,
          sets: 3,
          reps: { min: 8, max: 10 },
          progression: "double_progression",
        },
        {
          exercise: exercises.superHorizontalBenchPress,
          sets: 3,
          reps: { min: 8, max: 10 },
          progression: "double_progression",
        },
        {
          exercise: exercises.latPullDownCable,
          sets: 3,
          reps: { min: 10, max: 12 },
          progression: "double_progression",
        },
        {
          exercise: exercises.lateralRaiseDumbbells,
          sets: 3,
          reps: { min: 12, max: 15 },
          progression: "double_progression",
        },
      ],
    },
  },
};

export const core = {
  name: "Core",
  description: "Hanging work after every session.",
  sections: {
    core: {
      name: "Core",
      instructions: [
        {
          exercise: exercises.hangingLegRaise,
          sets: 3,
          reps: { min: 10, max: 15 },
          progression: "double_progression",
        },
      ],
    },
  },
};

export const admin = {
  email: "admin@example.com",
  scheduledWorkout: { id: "205aca4e-f3ed-4425-ba74-3a010fbcc92c" },
  plan: {
    id: "557a288a-5d7a-4294-bf15-2558074e123a",
    name: fullBody.name,
    description: fullBody.description,
    sections: {
      fullBody: { id: "41b2b2f7-9bc8-4836-acb5-02d73a97dc24", ...fullBody.sections.fullBody },
    },
  },
};

export const empty = { email: "empty@example.com" };

export const emptyMutation = { email: "empty-mutation@example.com" };

export const builder = {
  email: "builder@example.com",
  plan: {
    id: "500f8ed2-2708-4703-a6dc-534b9dc576af",
    name: ppl.name,
    description: ppl.description,
    sections: {
      push: { id: "05568f55-10b2-407b-a001-e9fac7ac5204", ...ppl.sections.push },
      pull: { id: "949e2de0-5a92-45c7-90de-0884e599e2a2", ...ppl.sections.pull },
      legs: { id: "e31bacbf-ff60-42a2-a617-d1cb960f98b6", ...ppl.sections.legs },
    },
  },
};

export const builderMutation = {
  email: "builder-mutation@example.com",
  plan: {
    id: "99c624ce-4cde-4fb8-9a7b-eb5491ee07e5",
    name: ppl.name,
    description: ppl.description,
    sections: {
      push: { id: "63099b9f-fe51-4ff8-aead-12de1b1e7274", ...ppl.sections.push },
      pull: { id: "bd4da05d-9a07-4aa9-9d1b-765cd1d30064", ...ppl.sections.pull },
      legs: { id: "47777a35-1cff-40f8-96b7-b72e0612a080", ...ppl.sections.legs },
    },
  },
};

export const drafter = {
  email: "drafter@example.com",
  plan: {
    id: "062643f4-0e7c-4c38-b7ee-1d96d7a7200b",
    name: ppl.name,
    description: ppl.description,
    sections: {
      push: { id: "8eac614d-a8af-4014-b2bc-c3c7e024003a", ...ppl.sections.push },
      pull: { id: "ca944435-2138-4039-b4bc-8905396fd173", ...ppl.sections.pull },
      legs: { id: "a928600d-5f9a-4f72-854d-2fe7d6176a1c", ...ppl.sections.legs },
    },
  },
};

export const athlete = {
  email: "athlete@example.com",
  scheduledWorkout: { id: "84d48b25-7c52-4466-8f98-4b435b337bb0" },
  bodyParts: {
    waist: { id: "0f45cbd8-7c28-4ea3-8881-df023ebe309d", name: "Waist" },
    chest: { id: "e8d40984-53c7-4270-bc60-7755252afbd9", name: "Chest" },
    armRight: { id: "10da7966-a035-430e-ac73-a7f47a307af6", name: "Arm (right)" },
    thighRight: { id: "10c1a7d9-dd6c-4ad7-9915-236c4a6642cb", name: "Thigh (right)" },
    calfRight: { id: "e2713f5e-0d09-46f1-88a9-6b3cb6b41c2a", name: "Calf (right)" },
  },
  plan: {
    id: "82274685-eb24-433f-b987-6bec85ebe9b2",
    name: ppl.name,
    description: ppl.description,
    sections: {
      push: { id: "4ff73632-4aa9-4e51-9365-a4b8a4335f4d", ...ppl.sections.push },
      pull: { id: "b4a8f075-efbb-4ebf-87d5-3f591ac1c394", ...ppl.sections.pull },
      legs: { id: "45f4d04c-41b6-434e-8d1a-6cacbdd5cc52", ...ppl.sections.legs },
    },
  },
};

export const athleteMutation = {
  email: "athlete-mutation@example.com",
  scheduledWorkout: { id: "cd6aba9a-80fb-48c9-9fa0-37adb5915031" },
  bodyParts: {
    waist: { id: "cab2b985-aa02-415d-8bae-3a175ae7f21c", name: "Waist" },
    chest: { id: "79e2e5d0-3bde-48bc-a580-eedf7d8191a7", name: "Chest" },
    armRight: { id: "e7f38be8-c8bb-424e-a05a-d5d2352a192b", name: "Arm (right)" },
    thighRight: { id: "9a74505b-6068-43da-9bc4-4fa884d79090", name: "Thigh (right)" },
    calfRight: { id: "bd9fdad3-887a-427d-a2b7-a85cad6107c2", name: "Calf (right)" },
  },
  plan: {
    id: "f5219087-e3d1-4466-8000-d204c4c9cfe2",
    name: ppl.name,
    description: ppl.description,
    sections: {
      push: { id: "29269f93-4504-4df9-a092-4024c2598135", ...ppl.sections.push },
      pull: { id: "7b6f3dce-5761-4978-a6fb-6550d7ddab05", ...ppl.sections.pull },
      legs: { id: "7651be7a-d628-4458-9d47-a83ddd8582d2", ...ppl.sections.legs },
    },
  },
};

export const active = {
  email: "active@example.com",
  workout: { id: "80422684-2d70-4d20-9622-8e2ff3126814" },
  plan: {
    id: "d38f181d-7b73-4b1e-84ad-65d806409218",
    name: ppl.name,
    description: ppl.description,
    sections: {
      push: { id: "bda41f3e-e8c0-49fe-804d-0a033fe7671c", ...ppl.sections.push },
      pull: { id: "332dd599-7873-4c8c-8a10-ae50976d5b88", ...ppl.sections.pull },
      legs: { id: "162f52fe-193c-496f-9673-612a06610ff6", ...ppl.sections.legs },
    },
  },
};

export const activeMutation = {
  email: "active-mutation@example.com",
  workout: { id: "6af521cc-c468-4b42-a6b5-3093dfafee1a" },
  plan: {
    id: "325956c7-ccb9-47ec-a8fa-1d169035b335",
    name: ppl.name,
    description: ppl.description,
    sections: {
      push: { id: "1f9105c6-2ce2-4ee8-9aa6-91f94928d05f", ...ppl.sections.push },
      pull: { id: "7d0d5eec-4f2b-41ff-b07f-6659aaf1b0b9", ...ppl.sections.pull },
      legs: { id: "89174f6d-5aa1-44ca-9f6d-85744a5b5f8f", ...ppl.sections.legs },
    },
  },
};

export const archivist = {
  email: "archivist@example.com",
  archivedPlan: {
    id: "b8aab91f-94c6-4021-b548-6554e9c1ec98",
    name: ppl.name,
    description: ppl.description,
    sections: {
      push: { id: "79fbe780-86b9-4cfe-abd6-be4d31378f7a", ...ppl.sections.push },
      pull: { id: "e277c025-2bbd-484c-a4ec-719b683a0007", ...ppl.sections.pull },
      legs: { id: "87bc13ad-b26e-453a-908f-4a1e29c0bd25", ...ppl.sections.legs },
    },
  },
  plan: {
    id: "b1bf6b7d-623a-4d34-8140-2c1b5d47b8ab",
    name: fullBody.name,
    description: fullBody.description,
    sections: {
      fullBody: { id: "0aff0b76-8bc8-431c-b41f-6557aacb96c9", ...fullBody.sections.fullBody },
    },
  },
};

export const archivistMutation = {
  email: "archivist-mutation@example.com",
  archivedPlan: {
    id: "ff1230ba-4d60-4ae3-9e52-3e4dc8c57324",
    name: ppl.name,
    description: ppl.description,
    sections: {
      push: { id: "46f8e829-3e66-4671-b406-f413fe735f6c", ...ppl.sections.push },
      pull: { id: "ac75dd55-b3d0-45e1-b3cb-79a597bb4eb8", ...ppl.sections.pull },
      legs: { id: "af2853d0-c672-4054-b9d4-7010f7b6cc37", ...ppl.sections.legs },
    },
  },
  plan: {
    id: "fad607a6-21ed-4033-ad42-b159798e4a6b",
    name: fullBody.name,
    description: fullBody.description,
    sections: {
      fullBody: { id: "f053e3ca-3d3f-4ba1-800f-df4e0eb428d8", ...fullBody.sections.fullBody },
    },
  },
};

export const hoarder = {
  email: "hoarder@example.com",
  plan: {
    id: "2ee70939-6fba-460c-bd28-a21c13c49c77",
    name: "Hoarder",
    description: ppl.description,
    sections: {
      everything: {
        id: "1c2a8ad8-2953-4624-97b4-b00b91390e86",
        name: "Everything",
        instructions: Object.values(exercises)
          .slice(0, 20)
          .map((exercise) => ({
            exercise,
            sets: 3,
            reps: { min: 8, max: 10 },
            progression: "double_progression",
          })),
      },
      one: {
        id: "f084da35-7b46-49c9-835e-941682d54a17",
        name: "One",
        instructions: [
          {
            exercise: exercises.superHorizontalBenchPress,
            sets: 3,
            reps: { min: 8, max: 10 },
            progression: "double_progression",
          },
        ],
      },
      two: {
        id: "abac17e1-f155-486e-a1dd-4152f88befb5",
        name: "Two",
        instructions: [
          {
            exercise: exercises.lateralRaiseDumbbells,
            sets: 3,
            reps: { min: 8, max: 10 },
            progression: "double_progression",
          },
        ],
      },
      three: {
        id: "165ee6f3-6a09-4a6f-b70d-ca0a39212dc0",
        name: "Three",
        instructions: [
          {
            exercise: exercises.hammerCurlDumbbells,
            sets: 3,
            reps: { min: 8, max: 10 },
            progression: "double_progression",
          },
        ],
      },
      four: {
        id: "3d743021-88ac-4ce7-89ae-723853860c9f",
        name: "Four",
        instructions: [
          {
            exercise: exercises.facePull,
            sets: 3,
            reps: { min: 8, max: 10 },
            progression: "double_progression",
          },
        ],
      },
    },
  },
  activeWorkout: { id: "817329e6-15ac-48d7-a4a9-1a9c09006a29" },
  draftWorkouts: {
    today: { id: "927ab753-7390-47c0-9f3c-3bfef845e62e" },
    tomorrow: { id: "981ed6b7-a997-4410-a7df-355b252a967e" },
    dayAfter: { id: "8b8603e7-4867-450b-b02b-061956a7c88e" },
  },
};

export const pocket = {
  email: "pocket@example.com",
  scheduledWorkout: { id: "7dd0a8b7-aea6-4811-9cb3-18be098c6189" },
  plan: {
    id: "249923f3-2563-46cc-8c6a-4762ea794d03",
    name: ppl.name,
    description: ppl.description,
    sections: {
      push: { id: "f5eb314c-bce0-484d-bcac-068960c072e3", ...ppl.sections.push },
      pull: { id: "34092112-fa7c-4db7-80b9-0286dd32bc25", ...ppl.sections.pull },
      legs: { id: "58e79dbd-6558-44ae-9880-26749217272a", ...ppl.sections.legs },
    },
  },
};

export const hanger = {
  email: "hanger@example.com",
  completedWorkout: { id: "beee0d1e-9899-49ae-85b6-618db067c62e" },
  scheduledWorkout: { id: "30c52cc3-93f0-41b8-94e8-bb820132c086" },
  plan: {
    id: "edca0413-1962-4233-b801-0d1cf6676f31",
    name: core.name,
    description: core.description,
    sections: {
      core: { id: "b5c226f5-a1a0-40db-97cf-dfc651aa3273", ...core.sections.core },
    },
  },
};

export const polyglot = { email: "polyglot@example.com", language: "pl" };

export const polyglotMutation = { email: "polyglot-mutation@example.com", language: "pl" };

export const disposable = { email: "disposable@example.com" };
