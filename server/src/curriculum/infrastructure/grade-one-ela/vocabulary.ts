import { choiceItem as q, passageItem as read, type LessonSkillSpec } from "../lesson-activity-builder";

/** Grade 1 vocabulary: context clues, word parts, categories, and shades of meaning (1.L.4.*, 1.L.5.*, 1.L.6). */

export const GRADE_ONE_VOCABULARY_SPECS: readonly LessonSkillSpec[] = [
  {
    skillId: "ela.g1.l.4.a.context-clues",
    recipeId: "ela.controlled-sentence.v1",
    evidenceMode: "SUPPORTED_READING",
    conceptDomain: "context-clue",
    misconception: "LITERAL_DETAIL_CONFUSION",
    instruction: {
      prompt: "The words around a new word can tell you what it means.",
      narration: "When you meet a word you do not know, read the rest of the sentence. The other words often give you a clue about what it means.",
      tutorMessage: "Read the whole sentence before you decide.",
      displayTokens: ["new word", "+ clues", "= meaning"],
    },
    model: {
      prompt: "The soup was steaming, so it was too hot to eat.",
      narration: "The soup was steaming, so it was too hot to eat. I may not know steaming, but the words too hot to eat tell me steaming means very hot.",
      tutorMessage: "I hunt for the clue words.",
      modelText: "steaming → very hot",
    },
    guided: [
      read("cc-g1", "The soup was steaming, so it was too hot to eat.", "What does steaming mean here?", "very hot", ["very hot", "very cold"], "The words too hot to eat are the clue."),
      read("cc-g2", "The puppy was timid and hid behind a chair.", "What does timid mean here?", "shy", ["shy", "loud"], "Hiding behind a chair is a clue that timid means shy."),
    ],
    independent: [
      read("cc-i1", "The room was silent because everyone had gone home.", "What does silent mean here?", "very quiet", ["very quiet", "very bright"], "Everyone had gone home, so the room was quiet."),
      read("cc-i2", "Ana was thrilled when she opened her present.", "What does thrilled mean here?", "very happy", ["very happy", "very tired"], "Opening a present is a clue that thrilled means very happy."),
      read("cc-i3", "The path was narrow, so we walked one behind the other.", "What does narrow mean here?", "not wide", ["not wide", "very long"], "Walking one behind the other is the clue."),
    ],
    mastery: [
      read("cc-m1", "The old dog was weary and slept all afternoon.", "What does weary mean here?", "very tired", ["very tired", "very hungry"], "Sleeping all afternoon is the clue."),
      read("cc-m2", "The gift was enormous and would not fit inside the car.", "What does enormous mean here?", "very big", ["very big", "very small"], "It would not fit through the door, so it was very big."),
      read("cc-m3", "She spoke in a gentle voice so the baby would not wake.", "What does gentle mean here?", "soft and calm", ["soft and calm", "loud and sharp"], "She did not want to wake the baby."),
    ],
  },
  {
    skillId: "ela.g1.l.4.b.affixes",
    recipeId: "ela.print-feature.v1",
    evidenceMode: "VISUAL_PRINT_WITH_NARRATED_DIRECTIONS",
    conceptDomain: "affix-meaning",
    misconception: "UNCLASSIFIED",
    instruction: {
      prompt: "A word part added to the front or back of a word changes its meaning.",
      narration: "Some word parts attach to the front of a word. The part u n means not or undo. Other parts attach to the back. The part e r can mean a person who does something.",
      tutorMessage: "Find the base word, then read the added part.",
      displayTokens: ["un + wrap", "teach + er"],
    },
    model: {
      prompt: "Unwrap means to undo the wrapping.",
      narration: "Unwrap. The base word is wrap. The part u n at the front means undo. So unwrap means to undo the wrapping.",
      tutorMessage: "I cover the word part and read the base word first.",
      modelText: "un + wrap",
    },
    guided: [
      q("af-g1", "What does the beginning un- mean in unwrap?", "not or undo", ["not or undo", "again"], "The part un means not or undo."),
      q("af-g2", "What does unhappy mean?", "not happy", ["not happy", "very happy"], "The part un means not, so unhappy means not happy."),
    ],
    independent: [
      q("af-i1", "What does the ending -er mean in teacher?", "a person who does it", ["a person who does it", "more than one"], "A teacher is a person who teaches."),
      q("af-i2", "What does unlock mean?", "to undo a lock", ["to undo a lock", "to lock again"], "The part un means undo."),
      q("af-i3", "What does the ending -ful mean in helpful?", "full of", ["full of", "without"], "Helpful means full of help."),
    ],
    mastery: [
      q("af-m1", "What does unsafe mean?", "not safe", ["not safe", "very safe"], "The part un means not."),
      q("af-m2", "What does the ending -er mean in painter?", "a person who does it", ["a person who does it", "more than one"], "A painter is a person who paints."),
      q("af-m3", "What does careful mean?", "full of care", ["full of care", "without care"], "The ending ful means full of."),
    ],
  },
  {
    skillId: "ela.g1.l.4.c.root-words",
    recipeId: "ela.print-feature.v1",
    evidenceMode: "VISUAL_PRINT_WITH_NARRATED_DIRECTIONS",
    conceptDomain: "root-word",
    misconception: "UNCLASSIFIED",
    instruction: {
      prompt: "The root word is the word left after you take off any added parts.",
      narration: "The root word is the base. Take off the added parts and the root is what remains. In jumping, take off i n g and the root word is jump.",
      tutorMessage: "Peel off the extra parts.",
      displayTokens: ["jumping → jump", "retell → tell"],
    },
    model: {
      prompt: "Jumping comes from the root word jump.",
      narration: "Jumping. I take off the ending i n g. What is left is jump. Jump is the root word. Jungle only looks similar; it is not jump with an ending.",
      tutorMessage: "I check that the leftover part is a real word.",
      modelText: "jumping → jump",
    },
    guided: [
      q("rw-g1", "Which word comes from the root word jump?", "jumping", ["jumping", "jungle"], "Jumping is jump with an ending added. Jungle only looks similar."),
      q("rw-g2", "What is the root word in helper?", "help", ["help", "helpe"], "Take off the ending e r and the root word is help."),
    ],
    independent: [
      q("rw-i1", "What is the root word in painted?", "paint", ["paint", "painte"], "Take off the ending e d and the root word is paint."),
      q("rw-i2", "Which word comes from the root word play?", "playful", ["playful", "plant"], "Playful is play with an ending added."),
      q("rw-i3", "What is the root word in unlocked?", "lock", ["lock", "unlock"], "Take off un at the front and e d at the back, and the root word is lock."),
    ],
    mastery: [
      q("rw-m1", "What is the root word in rested?", "rest", ["rest", "reste"], "Take off the ending e d and the root word is rest."),
      q("rw-m2", "Which word comes from the root word care?", "careful", ["careful", "carrot"], "Careful is care with an ending added."),
      q("rw-m3", "What is the root word in singer?", "sing", ["sing", "singe"], "Take off the ending e r and the root word is sing."),
    ],
  },
  {
    skillId: "ela.g1.l.5.a.categories",
    recipeId: "ela.print-feature.v1",
    evidenceMode: "VISUAL_PRINT_WITH_NARRATED_DIRECTIONS",
    conceptDomain: "word-category",
    misconception: "UNCLASSIFIED",
    instruction: {
      prompt: "Words that go together belong to the same group.",
      narration: "Some words belong to the same group because they are the same kind of thing. Shirt, socks, and coat are all clothing. Apple, banana, and grape are all fruit.",
      tutorMessage: "Ask what kind of thing each word is.",
      displayTokens: ["clothing", "fruit", "animals"],
    },
    model: {
      prompt: "Shirt and socks both belong to the group clothing.",
      narration: "Shirt and socks. Both are things you wear, so they belong to the group clothing. A banana is food, so it would not fit that group.",
      tutorMessage: "I name the group out loud.",
      modelText: "shirt + socks = clothing",
    },
    guided: [
      q("ct-g1", "Which two things belong in the same group?", "shirt and socks", ["shirt and socks", "shirt and banana"], "A shirt and socks are both clothing."),
      q("ct-g2", "Which word belongs with dog, cat, and horse?", "cow", ["cow", "chair"], "Dog, cat, horse, and cow are all animals."),
    ],
    independent: [
      q("ct-i1", "Which word belongs with apple, banana, and grape?", "pear", ["pear", "shoe"], "All of them are fruit."),
      q("ct-i2", "Which word does not belong with red, blue, and green?", "table", ["table", "yellow"], "Red, blue, green, and yellow are colors. Table is furniture."),
      q("ct-i3", "What group do fork, spoon, and knife belong to?", "things you eat with", ["things you eat with", "things you wear"], "All three are used for eating."),
    ],
    mastery: [
      q("ct-m1", "Which word belongs with car, bus, and train?", "boat", ["boat", "bread"], "All of them carry people from place to place."),
      q("ct-m2", "Which word does not belong with chair, table, and bed?", "apple", ["apple", "desk"], "Chair, table, bed, and desk are furniture. Apple is food."),
      q("ct-m3", "What group do rain, snow, and wind belong to?", "weather", ["weather", "food"], "All three describe the weather."),
    ],
  },
  {
    skillId: "ela.g1.l.5.b.word-definitions",
    recipeId: "ela.print-feature.v1",
    evidenceMode: "VISUAL_PRINT_WITH_NARRATED_DIRECTIONS",
    conceptDomain: "word-definition",
    misconception: "UNCLASSIFIED",
    instruction: {
      prompt: "A good explanation of a word says what group it belongs to and what makes it special.",
      narration: "To explain a word, first say what kind of thing it is, then say what makes it different. A bicycle is a vehicle. What makes it special is that it has two wheels and you ride it.",
      tutorMessage: "Name the group, then the special part.",
      displayTokens: ["what kind", "+ what is special"],
    },
    model: {
      prompt: "A bicycle is a vehicle with wheels that people ride.",
      narration: "A bicycle is a vehicle with wheels that people ride. Vehicle is the group. With wheels that people ride is what makes it special.",
      tutorMessage: "I give both parts, not just one.",
      modelText: "vehicle + you ride it",
    },
    guided: [
      q("wd-g1", "Which sentence tells what a bicycle is and what it does?", "A bicycle is a vehicle with wheels that people ride.", ["A bicycle is a vehicle with wheels that people ride.", "A bicycle is very."], "It names the group and what makes a bicycle special."),
      q("wd-g2", "Which sentence best explains what a spoon is?", "A spoon is a tool you use to eat soup.", ["A spoon is a tool you use to eat soup.", "A spoon is shiny."], "It names the group, tool, and what it is for."),
    ],
    independent: [
      q("wd-i1", "Which sentence best explains what a nest is?", "A nest is a home that a bird builds.", ["A nest is a home that a bird builds.", "A nest is in a tree."], "It names the group, home, and what makes it special."),
      q("wd-i2", "Which sentence best explains what a boot is?", "A boot is a shoe that covers your ankle.", ["A boot is a shoe that covers your ankle.", "A boot is brown."], "It names the group, shoe, and what makes it special."),
      q("wd-i3", "What two parts does a good explanation have?", "The group and what makes it special", ["The group and what makes it special", "The color and the size"], "You name the kind of thing, then what sets it apart."),
    ],
    mastery: [
      q("wd-m1", "Which sentence best explains what a mitten is?", "A mitten is a cover that keeps your hand warm.", ["A mitten is a cover that keeps your hand warm.", "A mitten is soft."], "It names the group and what it does."),
      q("wd-m2", "Which sentence best explains what a lake is?", "A lake is a large body of water with land around it.", ["A lake is a large body of water with land around it.", "A lake is cold."], "It names the group and what makes it special."),
      q("wd-m3", "Which sentence best explains what a drum is?", "A drum is an instrument you hit to make a sound.", ["A drum is an instrument you hit to make a sound.", "A drum is loud."], "It names the group, instrument, and what you do with it."),
    ],
  },
  {
    skillId: "ela.g1.l.5.d.shades-of-meaning",
    recipeId: "ela.print-feature.v1",
    evidenceMode: "VISUAL_PRINT_WITH_NARRATED_DIRECTIONS",
    conceptDomain: "shade-of-meaning",
    misconception: "UNCLASSIFIED",
    instruction: {
      prompt: "Some words mean almost the same thing, but one is stronger than the other.",
      narration: "Some words are close in meaning but not equal. Happy and delighted both feel good, but delighted is stronger. Warm and hot are close, but hot is stronger.",
      tutorMessage: "Ask which word is stronger.",
      displayTokens: ["happy → delighted", "warm → hot"],
    },
    model: {
      prompt: "Delighted is stronger than happy.",
      narration: "Happy. Delighted. Both are good feelings, but delighted means very happy. If I am only a little pleased, happy fits better.",
      tutorMessage: "I line the words up from weaker to stronger.",
      modelText: "happy < delighted",
    },
    guided: [
      q("sm-g1", "Which word means very happy?", "delighted", ["delighted", "sad"], "Delighted means very happy."),
      q("sm-g2", "Which word is stronger than warm?", "hot", ["hot", "cool"], "Hot is stronger than warm. Cool is the opposite direction."),
    ],
    independent: [
      q("sm-i1", "Which word means very big?", "enormous", ["enormous", "tiny"], "Enormous means very big."),
      q("sm-i2", "Which word is stronger than tired?", "exhausted", ["exhausted", "awake"], "Exhausted means very tired."),
      q("sm-i3", "Which word means a little wet?", "damp", ["damp", "soaked"], "Damp is a little wet. Soaked is very wet."),
    ],
    mastery: [
      q("sm-m1", "Which word means very hungry?", "starving", ["starving", "full"], "Starving means very hungry."),
      q("sm-m2", "Which word is stronger than cold?", "freezing", ["freezing", "warm"], "Freezing is stronger than cold."),
      q("sm-m3", "Which word means a little angry?", "annoyed", ["annoyed", "furious"], "Annoyed is a little angry. Furious is very angry."),
    ],
  },
  {
    skillId: "ela.g1.l.6.acquired-words",
    recipeId: "ela.controlled-sentence.v1",
    evidenceMode: "SUPPORTED_READING",
    conceptDomain: "word-use",
    misconception: "LITERAL_DETAIL_CONFUSION",
    instruction: {
      prompt: "Use the new words you have learned when you talk and write.",
      narration: "Once you learn a new word, look for places to use it. Joining words, describing words, and feeling words all help you say exactly what you mean.",
      tutorMessage: "Pick the word that fits the sentence best.",
      displayTokens: ["because", "but", "finally"],
    },
    model: {
      prompt: "I wanted to play, but it started to rain.",
      narration: "I wanted to play, but it started to rain. The word but fits because the two ideas disagree. If I used and, the sentence would not show the problem.",
      tutorMessage: "I try the word in the sentence before I choose.",
      modelText: "… but it started to rain.",
    },
    guided: [
      read("aw-g1", "I wanted to play outside.", "Which word connects these ideas? I wanted to play, ___ it started to rain.", "but", ["but", "blue"], "But connects two ideas that are different."),
      read("aw-g2", "The plant grew very tall.", "Which word fits? The plant grew tall ___ we watered it.", "because", ["because", "under"], "Because tells why the plant grew."),
    ],
    independent: [
      read("aw-i1", "We looked everywhere for the lost key.", "Which word fits? We looked and looked, and ___ we found it.", "finally", ["finally", "nearly"], "Finally tells you it happened at the end of a long search."),
      read("aw-i2", "The puppy ran to the door.", "Which word best describes how the puppy felt?", "excited", ["excited", "sleepy"], "Running to the door shows excitement."),
      read("aw-i3", "The sky turned dark and the wind blew hard.", "Which word best describes the weather?", "stormy", ["stormy", "sunny"], "A dark sky and hard wind describe a storm."),
    ],
    mastery: [
      read("aw-m1", "Ana practiced the song every day.", "Which word fits? Ana practiced every day, ___ she sang it perfectly.", "so", ["so", "or"], "So shows what happened because she practiced."),
      read("aw-m2", "The baby yawned and rubbed her eyes.", "Which word best describes the baby?", "sleepy", ["sleepy", "hungry"], "Yawning and rubbing her eyes show she is sleepy."),
      read("aw-m3", "We packed our bags the night before the trip.", "Which word fits? We packed ___ the trip.", "before", ["before", "after"], "The packing happened the night before."),
    ],
  },
];
