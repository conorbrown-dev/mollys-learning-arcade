import { choiceItem as q, type LessonSkillSpec } from "../lesson-activity-builder";

/** Grade 1 conventions: capitalization, end punctuation, commas, and spelling patterns (1.L.2.*). */

const PHONICS_SCOPE = "ela.scope.grade-1.phonics";

export const GRADE_ONE_CONVENTION_SPECS: readonly LessonSkillSpec[] = [
  {
    skillId: "ela.g1.l.2.a.capitalization",
    recipeId: "ela.print-feature.v1",
    evidenceMode: "VISUAL_PRINT_WITH_NARRATED_DIRECTIONS",
    conceptDomain: "capitalization",
    misconception: "UNCLASSIFIED",
    instruction: {
      prompt: "Capital letters start a sentence and begin the names of people, places, days, and months.",
      narration: "Capital letters do two jobs. They start a sentence, and they begin names. Names of people, names of places, days of the week, and months of the year all begin with a capital.",
      tutorMessage: "Sentences and names get capitals.",
      displayTokens: ["Sam", "Tulsa", "Monday", "June"],
    },
    model: {
      prompt: "Sam visited Tulsa in June.",
      narration: "Sam visited Tulsa in June. Sam is a person's name, so it is capital. Tulsa is a place, so it is capital. June is a month, so it is capital. The word visited is none of those, so it stays lowercase.",
      tutorMessage: "I ask whether each word is a name.",
      modelText: "Sam visited Tulsa in June.",
    },
    guided: [
      q("cap-g1", "Which sentence uses capital letters correctly?", "Sam visited Tulsa.", ["Sam visited Tulsa.", "sam visited tulsa."], "Sam is a person's name and Tulsa is a place, so both begin with capitals."),
      q("cap-g2", "Which word needs a capital letter?", "monday", ["monday", "morning"], "Monday is a day of the week, so it needs a capital. Morning is not a name."),
    ],
    independent: [
      q("cap-i1", "Which sentence uses capital letters correctly?", "We go to school in August.", ["We go to school in August.", "we go to School in august."], "The sentence starts with a capital and August is a month."),
      q("cap-i2", "Which word needs a capital letter?", "june", ["june", "summer"], "June is a month. Summer is a season and does not need a capital."),
      q("cap-i3", "Why does the word Molly begin with a capital?", "It is a person's name.", ["It is a person's name.", "It is a long word."], "Names of people always begin with a capital letter."),
    ],
    mastery: [
      q("cap-m1", "Which sentence uses capital letters correctly?", "My friend Ana lives in Oklahoma.", ["My friend Ana lives in Oklahoma.", "my friend ana lives in oklahoma."], "The sentence start, the name Ana, and the place Oklahoma all need capitals."),
      q("cap-m2", "Which word needs a capital letter?", "friday", ["friday", "today"], "Friday is a day of the week. Today is not a name."),
      q("cap-m3", "Which words in this sentence need capitals? we saw ana on tuesday", "we, ana, and tuesday", ["we, ana, and tuesday", "only ana"], "The first word starts the sentence, Ana is a name, and Tuesday is a day."),
    ],
  },
  {
    skillId: "ela.g1.l.2.b.end-punctuation",
    recipeId: "ela.print-feature.v1",
    evidenceMode: "VISUAL_PRINT_WITH_NARRATED_DIRECTIONS",
    conceptDomain: "end-mark",
    misconception: "UNCLASSIFIED",
    instruction: {
      prompt: "A telling sentence ends with a period. A question ends with a question mark. An excited sentence ends with an exclamation mark.",
      narration: "The mark at the end tells you how a sentence sounds. A telling sentence ends with a period. A sentence that asks something ends with a question mark. A sentence full of excitement ends with an exclamation mark.",
      tutorMessage: "The end mark matches the job of the sentence.",
      displayTokens: [".", "?", "!"],
    },
    model: {
      prompt: "Where is my hat? That sentence asks, so it ends with a question mark.",
      narration: "Where is my hat. That sentence is asking me something, so it needs a question mark, not a period.",
      tutorMessage: "I ask whether the sentence tells, asks, or shouts.",
      modelText: "Where is my hat?",
    },
    guided: [
      q("ep-g1", "Which mark belongs at the end? Do you like pizza", "A question mark", ["A question mark", "A period"], "The sentence asks something, so it ends with a question mark."),
      q("ep-g2", "Which sentence ends with the correct mark?", "We saw a rainbow!", ["We saw a rainbow!", "We saw a rainbow,"], "A comma cannot end a sentence. An exclamation mark shows excitement."),
    ],
    independent: [
      q("ep-i1", "Which mark belongs at the end? The cat is asleep", "A period", ["A period", "A question mark"], "The sentence tells something, so it ends with a period."),
      q("ep-i2", "Which mark belongs at the end? What time is it", "A question mark", ["A question mark", "A period"], "The sentence asks something."),
      q("ep-i3", "Which sentence is punctuated correctly?", "Watch out!", ["Watch out!", "Watch out"], "Every sentence needs an end mark, and this one shows excitement."),
    ],
    mastery: [
      q("ep-m1", "Which mark belongs at the end? Where did you go", "A question mark", ["A question mark", "A period"], "The sentence asks something."),
      q("ep-m2", "Which sentence ends with the correct mark?", "I found my shoe.", ["I found my shoe.", "I found my shoe?"], "The sentence tells something, so it takes a period."),
      q("ep-m3", "Which mark shows that someone is excited?", "!", ["!", "."], "An exclamation mark shows strong feeling."),
    ],
  },
  {
    skillId: "ela.g1.l.2.c.commas",
    recipeId: "ela.print-feature.v1",
    evidenceMode: "VISUAL_PRINT_WITH_NARRATED_DIRECTIONS",
    conceptDomain: "comma-use",
    misconception: "UNCLASSIFIED",
    instruction: {
      prompt: "A comma separates the things in a list so the reader knows where each one ends.",
      narration: "When you name three or more things in a row, a comma goes between them. The comma tells the reader where one thing ends and the next begins.",
      tutorMessage: "Commas keep a list from running together.",
      displayTokens: ["a hat,", "a map,", "and a snack"],
    },
    model: {
      prompt: "I packed a hat, a map, and a snack.",
      narration: "I packed a hat, a map, and a snack. There is a comma after hat and a comma after map. Without them the list would run together.",
      tutorMessage: "I put a comma after each item except the last.",
      modelText: "a hat, a map, and a snack",
    },
    guided: [
      q("cm-g1", "Which sentence uses commas correctly?", "I packed a hat, a map, and a snack.", ["I packed a hat, a map, and a snack.", "I packed a hat a map and a snack."], "Commas separate the items in the list."),
      q("cm-g2", "Where does a comma go? I like cats dogs and birds", "After cats and after dogs", ["After cats and after dogs", "After birds"], "Commas go between the items, not after the last one."),
    ],
    independent: [
      q("cm-i1", "Which sentence uses commas correctly?", "We saw a fox, a deer, and an owl.", ["We saw a fox, a deer, and an owl.", "We saw a fox a deer and an owl."], "Each item in the list is separated by a comma."),
      q("cm-i2", "Why do we use commas in a list?", "To show where each item ends", ["To show where each item ends", "To end the sentence"], "A comma separates items. A period ends the sentence."),
      q("cm-i3", "Which sentence uses commas correctly?", "I have a pen, a book, and a bag.", ["I have a pen, a book, and a bag.", "I have, a pen a book and a bag."], "The commas belong between the items in the list."),
    ],
    mastery: [
      q("cm-m1", "Which sentence uses commas correctly?", "She picked apples, pears, and plums.", ["She picked apples, pears, and plums.", "She picked apples pears and plums."], "Commas separate the three fruits."),
      q("cm-m2", "Where does a comma go? We read books maps and signs", "After books and after maps", ["After books and after maps", "After signs"], "Commas go between the items in the list."),
      q("cm-m3", "Which sentence uses commas correctly?", "He has a red hat, a blue coat, and black boots.", ["He has a red hat, a blue coat, and black boots.", "He has a red hat a blue coat and black boots."], "Each item is separated by a comma."),
    ],
  },
  {
    skillId: "ela.g1.l.2.d.spelling-patterns",
    recipeId: "ela.symbol-sound.v1",
    evidenceMode: "VISUAL_PRINT_WITH_NARRATED_DIRECTIONS",
    conceptDomain: "spelling-pattern",
    misconception: "GRAPHEME_SOUND_CONFUSION",
    contentScopeId: PHONICS_SCOPE,
    instruction: {
      prompt: "Spell a word by writing a letter or letter team for each sound you hear.",
      narration: "To spell a word, say it slowly and write a letter or letter team for each sound. The sound shh is spelled s h. The sound ch is spelled c h.",
      tutorMessage: "One spelling for each sound.",
      displayTokens: ["sh", "ch", "th"],
    },
    model: {
      prompt: "Spell shop: /sh/ is s h, /o/ is o, /p/ is p.",
      narration: "Shop. Shh is spelled s h. Ooo is spelled o. P is spelled p. S h o p spells shop.",
      tutorMessage: "I match each sound to its spelling.",
      modelText: "sh + o + p",
    },
    guided: [
      q("sp-g1", "Which word begins with the /ch/ sound?", "chop", ["chop", "shop"], "The letters c and h spell the /ch/ sound in chop."),
      q("sp-g2", "How do you spell the /sh/ sound?", "sh", ["sh", "ss"], "The sound shh is spelled with the letters s and h."),
    ],
    independent: [
      q("sp-i1", "Which spelling is correct for the word that means a small boat home for fish?", "dish", ["dish", "dich"], "The /sh/ sound at the end is spelled s h."),
      q("sp-i2", "How do you spell the /th/ sound?", "th", ["th", "ht"], "The sound is spelled t h, in that order."),
      q("sp-i3", "Which word is spelled correctly?", "when", ["when", "wen"], "The sound at the start of when is spelled w h."),
    ],
    mastery: [
      q("sp-m1", "Which word is spelled correctly?", "fish", ["fish", "fich"], "The /sh/ sound is spelled s h."),
      q("sp-m2", "Which word is spelled correctly?", "path", ["path", "pach"], "The /th/ sound at the end is spelled t h."),
      q("sp-m3", "Which word begins with the /sh/ sound?", "ship", ["ship", "chip"], "Ship begins with s h. Chip begins with c h."),
    ],
  },
];
