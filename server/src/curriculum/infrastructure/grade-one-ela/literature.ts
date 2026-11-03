import { choiceItem as q, passageItem as read, type LessonSkillSpec } from "../lesson-activity-builder";

/**
 * Grade 1 reading literature (1.RL.*).
 *
 * Each passage is a few short sentences shown on screen and read aloud, so the
 * question measures comprehension rather than decoding speed.
 */

export const GRADE_ONE_LITERATURE_SPECS: readonly LessonSkillSpec[] = [
  {
    skillId: "ela.g1.rl.1.key-details",
    recipeId: "ela.controlled-sentence.v1",
    evidenceMode: "SUPPORTED_READING",
    conceptDomain: "story-detail",
    misconception: "LITERAL_DETAIL_CONFUSION",
    instruction: {
      prompt: "The answer to a question about a story is usually right there in the words.",
      narration: "When someone asks who, what, where, or when about a story, the answer is usually right there in the words. Read it again and find the part that answers the question.",
      tutorMessage: "Go back and find the exact words.",
      displayTokens: ["who", "what", "where", "when"],
    },
    model: {
      prompt: "Ana lost her red hat at the park. Where did she lose it? At the park.",
      narration: "Ana lost her red hat at the park. The question asks where. The words at the park answer it, so that is my answer.",
      tutorMessage: "I point to the words that answer the question.",
      modelText: "lost her hat … at the park",
    },
    guided: [
      read("rk-g1", "Ana lost her red hat at the park. She looked under the slide.", "Where did Ana lose her hat?", "At the park", ["At the park", "At school"], "The story says she lost it at the park."),
      read("rk-g2", "Sam baked muffins on Saturday. He shared them with his sister.", "Who did Sam share the muffins with?", "His sister", ["His sister", "His teacher"], "The story says he shared them with his sister."),
    ],
    independent: [
      read("rk-i1", "The kitten hid in a basket. Mia found it after dinner.", "Where did the kitten hide?", "In a basket", ["In a basket", "Under the bed"], "The story says the kitten hid in a basket."),
      read("rk-i2", "Jon planted seeds in a cup. Three days later a green shoot appeared.", "What appeared after three days?", "A green shoot", ["A green shoot", "A flower"], "The story says a green shoot appeared."),
      read("rk-i3", "It rained all morning, so the class stayed inside and read books.", "Why did the class stay inside?", "Because it rained", ["Because it rained", "Because it snowed"], "The story says it rained all morning."),
    ],
    mastery: [
      read("rk-m1", "Lena found a shell on the beach. She put it in her pocket to keep.", "What did Lena find?", "A shell", ["A shell", "A stone"], "The story says she found a shell."),
      read("rk-m2", "The puppy chewed a sock. Dad put the sock in the wash.", "Who put the sock in the wash?", "Dad", ["Dad", "The puppy"], "The story says Dad put it in the wash."),
      read("rk-m3", "On Monday the class visited a farm. They fed the goats.", "When did the class visit the farm?", "On Monday", ["On Monday", "On Friday"], "The story says it was Monday."),
    ],
  },
  {
    skillId: "ela.g1.rl.3.story-elements",
    recipeId: "ela.controlled-sentence.v1",
    evidenceMode: "SUPPORTED_READING",
    conceptDomain: "story-element",
    misconception: "LITERAL_DETAIL_CONFUSION",
    instruction: {
      prompt: "Every story has characters, a setting, and events that happen.",
      narration: "Characters are who the story is about. The setting is where and when it happens. The events are what happens, in order.",
      tutorMessage: "Ask who, where, and what happened.",
      displayTokens: ["characters", "setting", "events"],
    },
    model: {
      prompt: "In Ana lost her hat at the park, Ana is the character and the park is the setting.",
      narration: "Ana lost her hat at the park. Ana is who the story is about, so Ana is the character. The park is where it happens, so the park is the setting.",
      tutorMessage: "I sort the parts before I answer.",
      modelText: "Ana = who · park = where",
    },
    guided: [
      read("se-g1", "Ana and her dog walked to the pond. They watched the ducks swim.", "Who are the characters?", "Ana and her dog", ["Ana and her dog", "The ducks only"], "The story is about Ana and her dog."),
      read("se-g2", "The snow fell outside while Tom read by the fire.", "What is the setting?", "Inside, by the fire, in winter", ["Inside, by the fire, in winter", "At a summer beach"], "Snow and a fire tell you where and when."),
    ],
    independent: [
      read("se-i1", "Mia woke early and tiptoed to the kitchen to make toast.", "What is the setting?", "The kitchen, early in the morning", ["The kitchen, early in the morning", "A park at night"], "The story says the kitchen, early."),
      read("se-i2", "Carlos and his cousin built a fort from blankets in the living room.", "Who are the characters?", "Carlos and his cousin", ["Carlos and his cousin", "Carlos only"], "Both of them build the fort."),
      read("se-i3", "The bus rolled down a bumpy road. Ellie held her bag tight.", "Where does this happen?", "On a bus", ["On a bus", "In a house"], "The story says the bus rolled down a road."),
    ],
    mastery: [
      read("se-m1", "Deep in the woods, two rabbits dug a new burrow before dark.", "What is the setting?", "The woods, before dark", ["The woods, before dark", "A city street at noon"], "The story says deep in the woods, before dark."),
      read("se-m2", "Nina and her grandmother picked beans in the garden all afternoon.", "Who are the characters?", "Nina and her grandmother", ["Nina and her grandmother", "The beans"], "The story is about Nina and her grandmother."),
      read("se-m3", "The waves splashed as Omar built a sandcastle near the water.", "Where does this happen?", "At the beach", ["At the beach", "In a forest"], "Waves and sand tell you it is the beach."),
    ],
  },
  {
    skillId: "ela.g1.rl.2.lesson",
    recipeId: "ela.controlled-sentence.v1",
    evidenceMode: "SUPPORTED_READING",
    conceptDomain: "story-lesson",
    misconception: "LITERAL_DETAIL_CONFUSION",
    instruction: {
      prompt: "Many stories teach a lesson about how to act or what matters.",
      narration: "A lesson is the idea a story wants you to carry away. It is not one small detail. Ask what the character learned by the end.",
      tutorMessage: "Ask what the character learned.",
      displayTokens: ["What did they learn?"],
    },
    model: {
      prompt: "A story where sharing makes a game more fun teaches that sharing is kind.",
      narration: "Two children argue over one ball. Then they play together and have more fun. The lesson is that sharing makes things better, not that the ball was round.",
      tutorMessage: "I choose the big idea, not a small detail.",
      modelText: "lesson = sharing is kind",
    },
    guided: [
      read("sl-g1", "Rosa would not share her blocks. Later she played with Ben and built a tall tower together.", "What is the lesson?", "Sharing makes things better", ["Sharing makes things better", "Blocks are red"], "The story shows that playing together worked better."),
      read("sl-g2", "Theo kept trying to tie his shoes. On the tenth try, he did it.", "What is the lesson?", "Keep trying and you can learn", ["Keep trying and you can learn", "Shoes are hard to find"], "Theo succeeded because he kept trying."),
    ],
    independent: [
      read("sl-i1", "Kira told the truth about the broken cup. Her mom thanked her for being honest.", "What is the lesson?", "Telling the truth is important", ["Telling the truth is important", "Cups break easily"], "Kira was thanked for being honest."),
      read("sl-i2", "Sam rushed his drawing and did not like it. He slowed down and tried again.", "What is the lesson?", "Taking your time helps", ["Taking your time helps", "Drawing is boring"], "Slowing down made the work better."),
      read("sl-i3", "Nina helped a new student find the library. They became friends.", "What is the lesson?", "Being kind can make a friend", ["Being kind can make a friend", "Libraries are quiet"], "Her kindness led to a friendship."),
    ],
    mastery: [
      read("sl-m1", "Max wanted the biggest slice. He gave it to his sister instead and felt glad.", "What is the lesson?", "Thinking of others feels good", ["Thinking of others feels good", "Cake tastes sweet"], "Max felt glad after giving the slice away."),
      read("sl-m2", "Ava was afraid to swim. She practiced each day until she could float.", "What is the lesson?", "Practice helps you get past fear", ["Practice helps you get past fear", "Water is cold"], "Practicing is what changed things for Ava."),
      read("sl-m3", "Leo forgot his lunch. Three friends each shared a little with him.", "What is the lesson?", "Friends help each other", ["Friends help each other", "Lunch is at noon"], "The friends helping Leo is the big idea."),
    ],
  },
  {
    skillId: "ela.g1.rl.4.feeling-words",
    recipeId: "ela.controlled-sentence.v1",
    evidenceMode: "SUPPORTED_READING",
    conceptDomain: "feeling-word",
    misconception: "LITERAL_DETAIL_CONFUSION",
    instruction: {
      prompt: "Writers choose words that make you feel something or picture something.",
      narration: "Some words do more than name a thing. They tell you how someone feels or help you picture the scene. Trembled tells you more than moved.",
      tutorMessage: "Ask what feeling the word gives you.",
      displayTokens: ["trembled", "beamed", "whispered"],
    },
    model: {
      prompt: "She beamed tells you she was very happy.",
      narration: "She beamed at her sister. Beamed means she smiled in a big, bright way. The writer could have said looked, but beamed tells you how she felt.",
      tutorMessage: "I ask why the writer picked that word.",
      modelText: "beamed → very happy",
    },
    guided: [
      read("fw-g1", "Ana beamed when she saw the puppy.", "How did Ana feel?", "Very happy", ["Very happy", "Angry"], "Beamed means she smiled brightly."),
      read("fw-g2", "Tom trembled as the thunder crashed.", "How did Tom feel?", "Afraid", ["Afraid", "Excited"], "Trembled means he shook, which shows fear."),
    ],
    independent: [
      read("fw-i1", "Mia groaned when she saw the long line.", "How did Mia feel?", "Disappointed", ["Disappointed", "Delighted"], "Groaning shows she was unhappy about the line."),
      read("fw-i2", "The children whispered so the baby could sleep.", "What does whispered tell you?", "They spoke very softly", ["They spoke very softly", "They shouted"], "Whispered means a very soft voice."),
      read("fw-i3", "Ben grinned as he opened the box.", "How did Ben feel?", "Pleased", ["Pleased", "Worried"], "A grin is a wide, happy smile."),
    ],
    mastery: [
      read("fw-m1", "Lena sighed and put down her pencil.", "How did Lena feel?", "Tired or frustrated", ["Tired or frustrated", "Thrilled"], "A sigh shows she was worn out or frustrated."),
      read("fw-m2", "The puppy bounded across the yard.", "What does bounded tell you?", "It ran with big happy leaps", ["It ran with big happy leaps", "It walked slowly"], "Bounded means leaping energetically."),
      read("fw-m3", "Omar froze when he heard the noise.", "How did Omar feel?", "Startled", ["Startled", "Bored"], "Freezing in place shows he was startled."),
    ],
  },
  {
    skillId: "ela.g1.rl.5.text-types",
    recipeId: "ela.print-feature.v1",
    evidenceMode: "VISUAL_PRINT_WITH_NARRATED_DIRECTIONS",
    conceptDomain: "text-type",
    misconception: "UNCLASSIFIED",
    instruction: {
      prompt: "A story is made up. A facts book tells you true information.",
      narration: "A story has characters and things that happen, and it is usually made up. A facts book, also called an informational book, tells you true things about a real topic.",
      tutorMessage: "Ask whether it tells a tale or gives facts.",
      displayTokens: ["story", "facts book"],
    },
    model: {
      prompt: "A book about a talking bear is a story. A book about real bears gives facts.",
      narration: "A talking bear who goes to school is made up, so that is a story. A book that tells what bears eat and where they sleep gives facts, so it is informational.",
      tutorMessage: "I ask whether it could really happen.",
      modelText: "made up vs. true",
    },
    guided: [
      q("tt-g1", "Which one is a story?", "A bear who talks and goes to school", ["A bear who talks and goes to school", "A book about what bears eat"], "A talking bear is made up, so it is a story."),
      q("tt-g2", "Which one is a facts book?", "A book about how plants grow", ["A book about how plants grow", "A tale about a flying horse"], "A book about how plants grow gives true information."),
    ],
    independent: [
      q("tt-i1", "Which one is a story?", "A dragon who guards a castle", ["A dragon who guards a castle", "A book about castles in history"], "Dragons are made up, so that is a story."),
      q("tt-i2", "Which one gives facts?", "A book about the planets", ["A book about the planets", "A tale about a boy who flies to Mars on a bird"], "A book about the planets gives true information."),
      q("tt-i3", "How can you tell a story from a facts book?", "A story is made up; a facts book is true", ["A story is made up; a facts book is true", "A story is long; a facts book is short"], "The difference is made up versus true, not length."),
    ],
    mastery: [
      q("tt-m1", "Which one is a story?", "A mouse who writes letters to the moon", ["A mouse who writes letters to the moon", "A book about what mice eat"], "A letter-writing mouse is made up."),
      q("tt-m2", "Which one gives facts?", "A book about how bridges are built", ["A book about how bridges are built", "A tale about a bridge that sings"], "How bridges are built is true information."),
      q("tt-m3", "Which one is a story?", "Three pigs who build houses and talk", ["Three pigs who build houses and talk", "A book about farm animals"], "Talking pigs who build houses are made up."),
    ],
  },
  {
    skillId: "ela.g1.rl.6.narrator",
    recipeId: "ela.controlled-sentence.v1",
    evidenceMode: "SUPPORTED_READING",
    conceptDomain: "narrator",
    misconception: "LITERAL_DETAIL_CONFUSION",
    instruction: {
      prompt: "Someone is always telling a story. Sometimes it is a character, sometimes an outside voice.",
      narration: "If the story uses the word I, a character is telling it. If the story uses names and the words he or she, someone outside the story is telling it.",
      tutorMessage: "Look for the word I.",
      displayTokens: ["I = a character", "he, she = outside voice"],
    },
    model: {
      prompt: "I ran to the bus tells you a character is speaking.",
      narration: "I ran to the bus. The word I means the person in the story is telling it. If it said Sam ran to the bus, someone outside would be telling it.",
      tutorMessage: "I check which words the story uses.",
      modelText: "I ran … vs. Sam ran …",
    },
    guided: [
      read("nr-g1", "I ran to catch the bus. My bag bounced behind me.", "Who is telling this story?", "A character in the story", ["A character in the story", "Someone outside the story"], "The word I shows a character is telling it."),
      read("nr-g2", "Sam ran to catch the bus. His bag bounced behind him.", "Who is telling this story?", "Someone outside the story", ["Someone outside the story", "Sam himself"], "The story uses Sam and his, not I."),
    ],
    independent: [
      read("nr-i1", "My sister and I made a snowman after lunch.", "Who is telling this story?", "A character in the story", ["A character in the story", "Someone outside the story"], "The words my and I show a character is telling it."),
      read("nr-i2", "Ana opened the door and saw the rain.", "Who is telling this story?", "Someone outside the story", ["Someone outside the story", "Ana herself"], "The story uses Ana, not I."),
      read("nr-i3", "I could not find my shoe anywhere.", "Which word tells you a character is speaking?", "I", ["I", "shoe"], "The word I shows the speaker is in the story."),
    ],
    mastery: [
      read("nr-m1", "We packed our bags and left before sunrise.", "Who is telling this story?", "A character in the story", ["A character in the story", "Someone outside the story"], "The words we and our show a character is telling it."),
      read("nr-m2", "The twins packed their bags and left before sunrise.", "Who is telling this story?", "Someone outside the story", ["Someone outside the story", "One of the twins"], "The story uses the twins and their, not we."),
      read("nr-m3", "I watched the storm from my window.", "Who is telling this story?", "A character in the story", ["A character in the story", "Someone outside the story"], "The word I shows a character is telling it."),
    ],
  },
  {
    skillId: "ela.g1.rl.7.story-illustrations",
    recipeId: "ela.controlled-sentence.v1",
    evidenceMode: "SUPPORTED_READING",
    conceptDomain: "story-picture",
    misconception: "LITERAL_DETAIL_CONFUSION",
    instruction: {
      prompt: "Pictures and words work together. The picture shows what the words describe.",
      narration: "In a story, the picture and the words tell you the same thing in different ways. The picture can show you what a character looks like or where the story happens.",
      tutorMessage: "Match the picture to the words.",
      displayTokens: ["📖", "+", "🖼️"],
    },
    model: {
      prompt: "If the words say she held a red balloon, the picture should show a red balloon.",
      narration: "She held a red balloon. The picture that matches would show a girl holding a red balloon, not a blue kite.",
      tutorMessage: "I find the detail in the words first.",
      modelText: "words ↔ picture",
    },
    guided: [
      read("si-g1", "Ana held a red balloon at the fair.", "Which picture matches the story?", "🎈 A girl holding a red balloon", ["🎈 A girl holding a red balloon", "🪁 A girl flying a blue kite"], "The words say a red balloon."),
      read("si-g2", "The cat slept on a soft blue pillow.", "Which picture matches the story?", "🐈 A cat asleep on a blue pillow", ["🐈 A cat asleep on a blue pillow", "🐕 A dog asleep in a basket"], "The words say a cat on a blue pillow."),
    ],
    independent: [
      read("si-i1", "Tom built a tall tower of blocks.", "Which picture matches the story?", "🧱 A tall block tower", ["🧱 A tall block tower", "🏖️ A sandcastle"], "The words say a tower of blocks."),
      read("si-i2", "Three ducks swam across the pond.", "Which picture matches the story?", "🦆 Three ducks on water", ["🦆 Three ducks on water", "🐦 One bird in a tree"], "The words say three ducks swimming."),
      q("si-i3", "What can a picture add to a story?", "It shows what the words describe", ["It shows what the words describe", "It changes what happened"], "A picture shows the same events the words tell."),
    ],
    mastery: [
      read("si-m1", "Mia wore red boots in the rain.", "Which picture matches the story?", "🌧️ A girl in red boots in the rain", ["🌧️ A girl in red boots in the rain", "☀️ A girl in sandals in the sun"], "The words say red boots and rain."),
      read("si-m2", "The old tree had one swing hanging from it.", "Which picture matches the story?", "🌳 A tree with a single swing", ["🌳 A tree with a single swing", "🌲 A tree with no swing"], "The words say one swing."),
      read("si-m3", "Leo carried a basket of apples.", "Which picture matches the story?", "🍎 A boy with a basket of apples", ["🍎 A boy with a basket of apples", "🍌 A boy with a bunch of bananas"], "The words say apples."),
    ],
  },
  {
    skillId: "ela.g1.rl.9.compare-characters",
    recipeId: "ela.controlled-sentence.v1",
    evidenceMode: "SUPPORTED_READING",
    conceptDomain: "character-comparison",
    misconception: "LITERAL_DETAIL_CONFUSION",
    instruction: {
      prompt: "You can compare two characters by noticing how they are alike and how they differ.",
      narration: "When a story has two characters, look at what each one does. Sometimes they want the same thing. Sometimes one is careful while the other hurries.",
      tutorMessage: "Ask what each character does.",
      displayTokens: ["alike", "different"],
    },
    model: {
      prompt: "One hare races ahead and one tortoise goes slowly, but both want to win.",
      narration: "The hare runs fast and then rests. The tortoise moves slowly but never stops. They are different in speed, but they are alike because both want to win.",
      tutorMessage: "I look for one likeness and one difference.",
      modelText: "both want to win · one is slow",
    },
    guided: [
      read("cc2-g1", "Ben rushed his drawing. Ana worked slowly and carefully.", "How are Ben and Ana different?", "Ben rushed and Ana took care", ["Ben rushed and Ana took care", "They both rushed"], "The story says Ben hurried and Ana worked carefully."),
      read("cc2-g2", "Both Mia and Leo wanted the last seat on the bus.", "How are Mia and Leo alike?", "They both wanted the same seat", ["They both wanted the same seat", "They both sat down"], "The story says both wanted the last seat."),
    ],
    independent: [
      read("cc2-i1", "Rosa shared her snack. Tom kept his in his bag.", "How are Rosa and Tom different?", "Rosa shared and Tom did not", ["Rosa shared and Tom did not", "They both shared"], "The story says Rosa shared and Tom kept his."),
      read("cc2-i2", "Both bears looked for berries by the river all morning.", "How are the two bears alike?", "They both looked for berries", ["They both looked for berries", "They both went fishing"], "The story says both looked for berries."),
      read("cc2-i3", "Ana spoke loudly on stage. Her brother whispered his line.", "How are they different?", "One was loud and one was quiet", ["One was loud and one was quiet", "They were both loud"], "The story says she spoke loudly and he whispered."),
    ],
    mastery: [
      read("cc2-m1", "Kai climbed the hill quickly. Nina stopped often to rest.", "How are Kai and Nina different?", "Kai was quick and Nina rested", ["Kai was quick and Nina rested", "They both rested often"], "The story says Kai was quick and Nina stopped to rest."),
      read("cc2-m2", "Both girls packed umbrellas because rain was coming.", "How are the two girls alike?", "They both brought umbrellas", ["They both brought umbrellas", "They both forgot their coats"], "The story says both brought umbrellas."),
      read("cc2-m3", "Omar tried the hard puzzle first. Lena started with the easy one.", "How are they different?", "They chose different puzzles to start", ["They chose different puzzles to start", "They chose the same puzzle"], "Omar began with the hard one and Lena with the easy one."),
    ],
  },
];
