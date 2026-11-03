import { choiceItem as q, passageItem as read, type LessonSkillSpec } from "../lesson-activity-builder";

/** Grade 1 reading informational text (1.RI.*). Short true passages, shown and read aloud. */

export const GRADE_ONE_INFORMATION_SPECS: readonly LessonSkillSpec[] = [
  {
    skillId: "ela.g1.ri.1.key-details",
    recipeId: "ela.controlled-sentence.v1",
    evidenceMode: "SUPPORTED_READING",
    conceptDomain: "text-detail",
    misconception: "LITERAL_DETAIL_CONFUSION",
    instruction: {
      prompt: "In a facts text, the answer to a question is stated right in the words.",
      narration: "A facts text tells you true information. When you are asked a question, go back and find the sentence that answers it.",
      tutorMessage: "Find the sentence that answers it.",
      displayTokens: ["who", "what", "where", "why"],
    },
    model: {
      prompt: "Bats sleep during the day. When do bats sleep? During the day.",
      narration: "Bats sleep during the day and hunt at night. The question asks when they sleep. The words during the day answer it.",
      tutorMessage: "I reread and point to the answer.",
      modelText: "sleep … during the day",
    },
    guided: [
      read("ik-g1", "Bats sleep during the day. At night they fly out to hunt for insects.", "When do bats hunt?", "At night", ["At night", "In the morning"], "The text says they hunt at night."),
      read("ik-g2", "Camels store fat in their humps. The fat gives them energy on long trips.", "What do camels store in their humps?", "Fat", ["Fat", "Water"], "The text says camels store fat."),
    ],
    independent: [
      read("ik-i1", "Honeybees make honey from flower nectar. They store it in the hive.", "Where do bees store honey?", "In the hive", ["In the hive", "In a flower"], "The text says they store it in the hive."),
      read("ik-i2", "Penguins cannot fly. They use their wings like paddles to swim fast.", "How do penguins use their wings?", "Like paddles to swim", ["Like paddles to swim", "To fly high"], "The text says they use them like paddles."),
      read("ik-i3", "Most frogs begin life as tadpoles in the water. Later they grow legs.", "Where do tadpoles live?", "In the water", ["In the water", "In a tree"], "The text says tadpoles begin life in the water."),
    ],
    mastery: [
      read("ik-m1", "Owls hunt at night. Their large eyes help them see in very little light.", "What helps owls see at night?", "Their large eyes", ["Their large eyes", "Their sharp claws"], "The text says their large eyes help them see."),
      read("ik-m2", "A beaver cuts down small trees with its teeth. It uses them to build a dam.", "What does a beaver build?", "A dam", ["A dam", "A nest"], "The text says it builds a dam."),
      read("ik-m3", "Sunflowers turn their heads to follow the sun across the sky.", "What do sunflowers follow?", "The sun", ["The sun", "The wind"], "The text says they follow the sun."),
    ],
  },
  {
    skillId: "ela.g1.ri.2.main-topic",
    recipeId: "ela.controlled-sentence.v1",
    evidenceMode: "SUPPORTED_READING",
    conceptDomain: "main-topic",
    misconception: "LITERAL_DETAIL_CONFUSION",
    instruction: {
      prompt: "The main topic is what the whole text is mostly about, not one small fact.",
      narration: "The main topic is what the whole text is mostly about. Every sentence should connect to it. A detail is only one piece of it.",
      tutorMessage: "Ask what every sentence is about.",
      displayTokens: ["topic = whole", "detail = one part"],
    },
    model: {
      prompt: "A text where every sentence is about bats has the main topic bats.",
      narration: "Bats sleep by day. Bats hunt at night. Bats use sound to find food. Every sentence is about bats, so bats is the main topic. Sound is only one detail.",
      tutorMessage: "I check that the topic covers every sentence.",
      modelText: "topic = bats",
    },
    guided: [
      read("mt-g1", "Bats sleep by day. They hunt at night. They use sound to find food.", "What is the main topic?", "Bats", ["Bats", "Sound"], "Every sentence is about bats."),
      read("mt-g2", "Rain helps plants grow. It fills rivers. It gives animals water to drink.", "What is the main topic?", "Why rain matters", ["Why rain matters", "Rivers"], "Every sentence tells something rain does."),
    ],
    independent: [
      read("mt-i1", "Bees visit flowers. They carry pollen. They help new plants grow.", "What is the main topic?", "How bees help plants", ["How bees help plants", "Flowers"], "Every sentence is about what bees do for plants."),
      read("mt-i2", "Teeth help you bite. They help you chew. Brushing keeps them strong.", "What is the main topic?", "Teeth", ["Teeth", "Brushing"], "Every sentence is about teeth."),
      read("mt-i3", "Trees give shade. They make homes for birds. They clean the air.", "What is the main topic?", "How trees help", ["How trees help", "Birds"], "Every sentence names something trees do."),
    ],
    mastery: [
      read("mt-m1", "Ice melts in the sun. Snow turns to water. Frost disappears by noon.", "What is the main topic?", "Frozen water melting", ["Frozen water melting", "Noon"], "Every sentence is about frozen water turning to water."),
      read("mt-m2", "Dogs can hear tiny sounds. They can smell very well. Their senses are sharp.", "What is the main topic?", "A dog's senses", ["A dog's senses", "Sounds"], "Every sentence is about how dogs sense the world."),
      read("mt-m3", "Wear a helmet. Watch for cars. Ride where drivers can see you.", "What is the main topic?", "Staying safe on a bike", ["Staying safe on a bike", "Helmets"], "Every sentence gives a bike safety rule."),
    ],
  },
  {
    skillId: "ela.g1.ri.3.connections",
    recipeId: "ela.controlled-sentence.v1",
    evidenceMode: "SUPPORTED_READING",
    conceptDomain: "text-connection",
    misconception: "LITERAL_DETAIL_CONFUSION",
    instruction: {
      prompt: "Facts in a text often connect. One thing can cause another, or come before it.",
      narration: "Two facts in a text are often linked. One may cause the other, or one may happen first and the other after. Words like because, so, then, and next show the link.",
      tutorMessage: "Ask how the two facts are linked.",
      displayTokens: ["because", "so", "then"],
    },
    model: {
      prompt: "Rain fell, so the river rose. The rain caused the river to rise.",
      narration: "Rain fell for two days. Then the river rose. The rain came first and caused the river to rise. That is the connection between the two facts.",
      tutorMessage: "I ask which fact came first.",
      modelText: "rain → river rose",
    },
    guided: [
      read("tc-g1", "Rain fell for two days. Then the river rose over its banks.", "What made the river rise?", "The rain", ["The rain", "The wind"], "The rain came first and caused the river to rise."),
      read("tc-g2", "A seed gets water and sun. Then a small green shoot appears.", "What happens after a seed gets water and sun?", "A shoot appears", ["A shoot appears", "The seed dries up"], "The text says a shoot appears next."),
    ],
    independent: [
      read("tc-i1", "The days grow colder. Many birds fly south to find food.", "Why do the birds fly south?", "Because it grows cold and they need food", ["Because it grows cold and they need food", "Because they are tired"], "The cold and the search for food cause the trip."),
      read("tc-i2", "A caterpillar eats leaves. Later it forms a hard case and becomes a butterfly.", "What comes after the caterpillar eats?", "It forms a hard case", ["It forms a hard case", "It lays eggs"], "The text says it forms a case next."),
      read("tc-i3", "Snow covers the grass. Deer dig down to reach the plants beneath.", "Why do the deer dig?", "Because snow covers the plants", ["Because snow covers the plants", "Because they are playing"], "The snow is what makes digging necessary."),
    ],
    mastery: [
      read("tc-m1", "The sun heats the ocean. Water rises into the air and forms clouds.", "What causes clouds to form?", "The sun heating the water", ["The sun heating the water", "The clouds cooling the sun"], "The sun's heat lifts water into the air."),
      read("tc-m2", "A bee lands on a flower. Pollen sticks to its legs and travels to the next flower.", "What happens after the bee lands?", "Pollen sticks to its legs", ["Pollen sticks to its legs", "The flower closes"], "The text says pollen sticks to its legs."),
      read("tc-m3", "Wind blows hard across dry soil. Dust lifts into the air.", "What makes the dust lift?", "The wind", ["The wind", "The rain"], "The wind blowing is what lifts the dust."),
    ],
  },
  {
    skillId: "ela.g1.ri.4.word-meaning",
    recipeId: "ela.controlled-sentence.v1",
    evidenceMode: "SUPPORTED_READING",
    conceptDomain: "text-word-meaning",
    misconception: "LITERAL_DETAIL_CONFUSION",
    instruction: {
      prompt: "A facts text often explains a new word right in the sentence.",
      narration: "When a facts text uses a new word, the sentence nearby usually explains it. Read on and look for the explanation.",
      tutorMessage: "Read the next sentence for the meaning.",
      displayTokens: ["new word", "→ explained"],
    },
    model: {
      prompt: "Bats are nocturnal, which means they are awake at night.",
      narration: "Bats are nocturnal. That means they are awake at night. The text explains the word right after using it.",
      tutorMessage: "I look for the words that mean or which means.",
      modelText: "nocturnal = awake at night",
    },
    guided: [
      read("wm-g1", "Bats are nocturnal. That means they are awake at night.", "What does nocturnal mean?", "Awake at night", ["Awake at night", "Able to fly"], "The text explains it in the next sentence."),
      read("wm-g2", "A young frog is called a tadpole. It has a tail and lives in water.", "What is a tadpole?", "A young frog", ["A young frog", "A kind of fish"], "The text says a young frog is called a tadpole."),
    ],
    independent: [
      read("wm-i1", "Some animals hibernate. They sleep deeply all winter long.", "What does hibernate mean?", "To sleep deeply through winter", ["To sleep deeply through winter", "To move to a new place"], "The next sentence explains the word."),
      read("wm-i2", "Bees live in a colony. A colony is a large group that lives together.", "What is a colony?", "A large group living together", ["A large group living together", "A kind of flower"], "The text gives the meaning directly."),
      read("wm-i3", "The desert is arid, so very little rain falls there.", "What does arid mean?", "Very dry", ["Very dry", "Very cold"], "Very little rain is the clue."),
    ],
    mastery: [
      read("wm-m1", "Many birds migrate. They travel a long way when the seasons change.", "What does migrate mean?", "To travel far when seasons change", ["To travel far when seasons change", "To build a nest"], "The next sentence explains it."),
      read("wm-m2", "A camel's hump stores fat. This fat is a reserve, or a supply saved for later.", "What is a reserve?", "A supply saved for later", ["A supply saved for later", "A kind of hump"], "The text gives the meaning after the comma."),
      read("wm-m3", "Owls are predators. They hunt other animals for food.", "What is a predator?", "An animal that hunts others", ["An animal that hunts others", "An animal that eats plants"], "The next sentence explains it."),
    ],
  },
  {
    skillId: "ela.g1.ri.5.text-features",
    recipeId: "ela.print-feature.v1",
    evidenceMode: "VISUAL_PRINT_WITH_NARRATED_DIRECTIONS",
    conceptDomain: "text-feature",
    misconception: "UNCLASSIFIED",
    instruction: {
      prompt: "Facts books have special parts that help you find information fast.",
      narration: "A heading tells you what a section is about. A table of contents lists the sections and their pages. A glossary explains hard words. A caption explains a picture.",
      tutorMessage: "Each part has its own job.",
      displayTokens: ["heading", "contents", "glossary", "caption"],
    },
    model: {
      prompt: "To find what page a section starts on, use the table of contents.",
      narration: "If I want to know which page the section about frogs starts on, I use the table of contents at the front. It lists each section and its page.",
      tutorMessage: "I match the question to the right part.",
      modelText: "page number → contents",
    },
    guided: [
      q("tf-g1", "Which part tells you what page a section starts on?", "The table of contents", ["The table of contents", "The glossary"], "The table of contents lists sections and page numbers."),
      q("tf-g2", "What does a heading do?", "It tells what a section is about", ["It tells what a section is about", "It explains a hard word"], "A heading names the topic of the section."),
    ],
    independent: [
      q("tf-i1", "Which part explains the meaning of a hard word?", "The glossary", ["The glossary", "The table of contents"], "A glossary lists hard words and what they mean."),
      q("tf-i2", "What does a caption do?", "It explains a picture", ["It explains a picture", "It lists the pages"], "A caption is the small line of text that explains a picture."),
      q("tf-i3", "You want to know what a section is about before you read it. What do you look at?", "The heading", ["The heading", "The glossary"], "The heading names the topic of the section."),
    ],
    mastery: [
      q("tf-m1", "Which part would help you find the page about volcanoes?", "The table of contents", ["The table of contents", "The caption"], "The table of contents lists sections and pages."),
      q("tf-m2", "You do not know the word habitat. Where do you look?", "The glossary", ["The glossary", "The heading"], "A glossary explains hard words."),
      q("tf-m3", "What is the small line of text under a photo called?", "A caption", ["A caption", "A heading"], "A caption explains the picture it sits beside."),
    ],
  },
  {
    skillId: "ela.g1.ri.6.words-and-pictures",
    recipeId: "ela.print-feature.v1",
    evidenceMode: "VISUAL_PRINT_WITH_NARRATED_DIRECTIONS",
    conceptDomain: "source-of-information",
    misconception: "UNCLASSIFIED",
    instruction: {
      prompt: "Some information comes from the words and some comes from the pictures.",
      narration: "In a facts book, the words tell you some things and the pictures show you others. A picture can show what something looks like. The words can tell you something a picture cannot show, like a name or a number.",
      tutorMessage: "Ask where you learned it.",
      displayTokens: ["words tell", "pictures show"],
    },
    model: {
      prompt: "A photo shows what an owl looks like. The words tell you what it eats.",
      narration: "A photo of an owl shows me its round face and big eyes. The words tell me that owls eat mice. I could not learn that from the photo alone.",
      tutorMessage: "I ask whether I could see it or had to read it.",
      modelText: "see it vs. read it",
    },
    guided: [
      q("wp-g1", "Where would you learn what an owl looks like?", "From the picture", ["From the picture", "From the glossary"], "A picture shows you what something looks like."),
      q("wp-g2", "Where would you learn what an owl eats?", "From the words", ["From the words", "From the picture"], "A picture cannot tell you what an animal eats."),
    ],
    independent: [
      q("wp-i1", "Where would you learn the color of a bird's feathers?", "From the picture", ["From the picture", "From the page number"], "A picture shows color."),
      q("wp-i2", "Where would you learn how long a whale can live?", "From the words", ["From the words", "From the picture"], "A number like that has to be written in the words."),
      q("wp-i3", "What can a picture show that words take longer to explain?", "What something looks like", ["What something looks like", "What something is named"], "A picture shows appearance at a glance."),
    ],
    mastery: [
      q("wp-m1", "Where would you learn the shape of a leaf?", "From the picture", ["From the picture", "From the words"], "A picture shows shape directly."),
      q("wp-m2", "Where would you learn the name of a tool in a photo?", "From the caption or the words", ["From the caption or the words", "From the photo alone"], "A photo shows the tool but cannot name it."),
      q("wp-m3", "Where would you learn how many eggs a turtle lays?", "From the words", ["From the words", "From the picture"], "A number has to be written out."),
    ],
  },
  {
    skillId: "ela.g1.ri.7.illustration-details",
    recipeId: "ela.controlled-sentence.v1",
    evidenceMode: "SUPPORTED_READING",
    conceptDomain: "illustration-detail",
    misconception: "LITERAL_DETAIL_CONFUSION",
    instruction: {
      prompt: "A picture in a facts book adds details the words describe.",
      narration: "A picture in a facts book is not just decoration. It shows the thing the words are describing, so you can see it for yourself.",
      tutorMessage: "Match the picture to what the words say.",
      displayTokens: ["🖼️", "+", "facts"],
    },
    model: {
      prompt: "If the words say a camel has one hump, the picture should show one hump.",
      narration: "Some camels have one hump and some have two. If the words say one hump, then the matching picture shows a camel with exactly one hump.",
      tutorMessage: "I count what the words say first.",
      modelText: "one hump → one hump",
    },
    guided: [
      read("id-g1", "This kind of camel has one hump on its back.", "Which picture matches?", "🐪 A camel with one hump", ["🐪 A camel with one hump", "🐫 A camel with two humps"], "The text says one hump."),
      read("id-g2", "A honeybee has six legs and two pairs of wings.", "Which picture matches?", "🐝 A bee with six legs", ["🐝 A bee with six legs", "🕷️ An insect with eight legs"], "The text says six legs."),
    ],
    independent: [
      read("id-i1", "A starfish usually has five arms.", "Which picture matches?", "⭐ A starfish with five arms", ["⭐ A starfish with five arms", "🔺 A shape with three sides"], "The text says five arms."),
      read("id-i2", "An apple tree grows round red fruit on its branches.", "Which picture matches?", "🍎 A tree with round red fruit", ["🍎 A tree with round red fruit", "🌴 A tree with long leaves and no fruit"], "The text says round red fruit."),
      q("id-i3", "Why does a facts book include pictures?", "To show what the words describe", ["To show what the words describe", "To make the book longer"], "Pictures let you see what is being described."),
    ],
    mastery: [
      read("id-m1", "A ladybug has a round red back with black spots.", "Which picture matches?", "🐞 A round red beetle with spots", ["🐞 A round red beetle with spots", "🦋 A butterfly with wide wings"], "The text describes a ladybug."),
      read("id-m2", "This bird has a long curved beak for reaching inside flowers.", "Which picture matches?", "🐦 A bird with a long curved beak", ["🐦 A bird with a long curved beak", "🦆 A bird with a wide flat bill"], "The text says a long curved beak."),
      read("id-m3", "A full moon looks like a complete bright circle.", "Which picture matches?", "🌕 A full bright circle", ["🌕 A full bright circle", "🌙 A thin curved sliver"], "The text says a complete circle."),
    ],
  },
  {
    skillId: "ela.g1.ri.8.reasons",
    recipeId: "ela.controlled-sentence.v1",
    evidenceMode: "SUPPORTED_READING",
    conceptDomain: "author-reason",
    misconception: "LITERAL_DETAIL_CONFUSION",
    instruction: {
      prompt: "When an author says you should do something, look for the reason given.",
      narration: "Sometimes an author makes a point and then gives a reason for it. The reason answers the question why. Look for the sentence that explains why.",
      tutorMessage: "Find the sentence that says why.",
      displayTokens: ["point", "+ reason"],
    },
    model: {
      prompt: "Wear a helmet, because it protects your head in a fall.",
      narration: "You should wear a helmet when you ride. It protects your head if you fall. The first sentence is the point. The second sentence is the reason.",
      tutorMessage: "I separate the point from the reason.",
      modelText: "point → reason",
    },
    guided: [
      read("ar-g1", "You should wear a helmet when you ride. It protects your head if you fall.", "What reason does the author give?", "It protects your head", ["It protects your head", "Helmets come in colors"], "The second sentence gives the reason."),
      read("ar-g2", "Wash your hands before you eat. Washing removes germs that can make you sick.", "What reason does the author give?", "Washing removes germs", ["Washing removes germs", "Water is wet"], "The reason is that washing removes germs."),
    ],
    independent: [
      read("ar-i1", "Plants need sunlight. Without it they cannot make the food they need to grow.", "What reason does the author give?", "They cannot make food without it", ["They cannot make food without it", "Sunlight is warm"], "The reason explains why sunlight matters."),
      read("ar-i2", "Get plenty of sleep. Your body repairs itself while you rest.", "What reason does the author give?", "The body repairs itself during rest", ["The body repairs itself during rest", "Beds are soft"], "The second sentence gives the reason."),
      read("ar-i3", "Keep the lid on the trash can. An open can attracts animals looking for food.", "What reason does the author give?", "An open can attracts animals", ["An open can attracts animals", "Lids are round"], "The reason is that it attracts animals."),
    ],
    mastery: [
      read("ar-m1", "Drink water on hot days. Your body loses water when you sweat.", "What reason does the author give?", "The body loses water from sweating", ["The body loses water from sweating", "Water has no taste"], "The second sentence gives the reason."),
      read("ar-m2", "Read every day. Reading helps you learn new words.", "What reason does the author give?", "It helps you learn new words", ["It helps you learn new words", "Books have pages"], "The reason is learning new words."),
      read("ar-m3", "Do not feed wild ducks bread. Bread does not give them what they need to stay healthy.", "What reason does the author give?", "Bread is not healthy for them", ["Bread is not healthy for them", "Ducks swim well"], "The reason is that bread is not good for them."),
    ],
  },
  {
    skillId: "ela.g1.ri.9.compare-texts",
    recipeId: "ela.controlled-sentence.v1",
    evidenceMode: "SUPPORTED_READING",
    conceptDomain: "text-comparison",
    misconception: "LITERAL_DETAIL_CONFUSION",
    instruction: {
      prompt: "Two texts about the same topic can agree on some things and tell you different things.",
      narration: "When two texts cover the same topic, compare them. Sometimes both say the same fact. Sometimes one adds something the other leaves out.",
      tutorMessage: "Ask what both say and what only one says.",
      displayTokens: ["both", "only one"],
    },
    model: {
      prompt: "Both texts say bats fly. Only the second says bats use sound.",
      narration: "The first text says bats fly at night. The second says bats fly and use sound to find food. Both mention flying. Only the second mentions sound.",
      tutorMessage: "I look for the fact that appears twice.",
      modelText: "both: fly · only B: sound",
    },
    guided: [
      read("ct2-g1", "Text A: Bats fly at night. Text B: Bats fly and use sound to find food.", "What do both texts say?", "Bats fly", ["Bats fly", "Bats use sound"], "Only Text B mentions sound. Both mention flying."),
      read("ct2-g2", "Text A: Bees make honey. Text B: Bees make honey and live in hives.", "What does only Text B tell you?", "Bees live in hives", ["Bees live in hives", "Bees make honey"], "Both say they make honey. Only B mentions hives."),
    ],
    independent: [
      read("ct2-i1", "Text A: Owls hunt at night. Text B: Owls hunt at night and have sharp claws.", "What does only Text B tell you?", "Owls have sharp claws", ["Owls have sharp claws", "Owls hunt at night"], "Both say they hunt at night."),
      read("ct2-i2", "Text A: Trees give shade. Text B: Trees clean the air and give shade.", "What do both texts say?", "Trees give shade", ["Trees give shade", "Trees clean the air"], "Only Text B mentions cleaning the air."),
      read("ct2-i3", "Text A: Frogs begin as tadpoles. Text B: Frogs begin as tadpoles and grow legs later.", "What does only Text B tell you?", "Frogs grow legs later", ["Frogs grow legs later", "Frogs begin as tadpoles"], "Both mention tadpoles."),
    ],
    mastery: [
      read("ct2-m1", "Text A: Camels store fat. Text B: Camels store fat and can go days without water.", "What does only Text B tell you?", "Camels can go days without water", ["Camels can go days without water", "Camels store fat"], "Both mention stored fat."),
      read("ct2-m2", "Text A: Penguins swim fast and cannot fly. Text B: Penguins cannot fly.", "What do both texts say?", "Penguins cannot fly", ["Penguins cannot fly", "Penguins swim fast"], "Only Text A mentions swimming fast."),
      read("ct2-m3", "Text A: Rain fills rivers. Text B: Rain fills rivers and helps plants grow.", "What does only Text B tell you?", "Rain helps plants grow", ["Rain helps plants grow", "Rain fills rivers"], "Both mention filling rivers."),
    ],
  },
];
