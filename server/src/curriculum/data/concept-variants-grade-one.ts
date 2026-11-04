import { conceptQuestion as q, type ConceptVariantTable } from "./concept-question";

/**
 * Grade 1 questions that each test a different part of a standard, so a student who misses one is not
 * simply shown the same idea reworded. Each entry adds to the questions the generators already produce.
 */
export const gradeOneConceptVariants: ConceptVariantTable = {
  // Math
  "1.NBT.B.2.a": [
    q("Maya snaps 10 loose cubes into one stick. What do we call that stick of 10?", "a ten", "a one", "a hundred", "A bundle of ten ones is called a ten."),
    q("The number 10 is made of ___ ten and 0 ones.", "1", "10", "2", "Ten ones make one ten, so 10 is one ten and zero ones."),
    q("Which one shows a ten?", "a bundle of 10 sticks", "a bundle of 5 sticks", "a bundle of 20 sticks", "A ten is a bundle of exactly ten ones.")
  ],
  "1.MD.A.1": [
    q("The pencil is longer than the crayon. The crayon is longer than the eraser. Which is the shortest?", "the eraser", "the crayon", "the pencil", "Pencil, then crayon, then eraser go from longest to shortest."),
    q("A rope is 9 cubes long, a stick is 4 cubes long, and a straw is 6 cubes long. Which order goes from shortest to longest?", "stick, straw, rope", "rope, straw, stick", "straw, stick, rope", "4 is less than 6, and 6 is less than 9."),
    q("A desk is as long as a string. The door is longer than the string. Which is longer, the desk or the door?", "the door", "the desk", "they are the same", "The string is the same length as the desk, and the door is longer than the string, so the door is longer than the desk.")
  ],
  "1.G.A.1": [
    q("Which one is NOT a defining attribute of a triangle?", "its color", "it has three sides", "it is a closed shape", "A triangle is still a triangle in any color."),
    q("One triangle is big and red. Another is small and blue. What is the same about them?", "both have 3 sides", "both are red", "both are big", "Defining attributes, like three sides, stay the same when size and color change."),
    q("You draw a shape with 4 equal straight sides and 4 square corners. What did you draw?", "a square", "a triangle", "a circle", "Four equal sides and four square corners make a square.")
  ],
  "1.G.A.2": [
    q("Four quarter-circles are put together at their points. What shape can they make?", "a circle", "a triangle", "a rectangle", "Four quarter-circles together make a whole circle."),
    q("Which two shapes can you put together to make a rectangle?", "two squares side by side", "two circles", "a circle and a cone", "Two squares joined along a full side make a rectangle."),
    q("Two cubes are stacked on top of each other. What 3D shape did you make?", "a rectangular prism", "a sphere", "a cone", "Two stacked cubes make a taller box, a rectangular prism.")
  ],
  "1.G.A.3": [
    q("A pizza is cut into 4 equal slices. One slice is called a ___ of the pizza.", "fourth", "half", "whole", "One of four equal shares is a fourth, or a quarter."),
    q("Which cut makes fourths?", "4 equal parts", "4 unequal parts", "2 equal parts", "Fourths are four equal shares."),
    q("Two halves make one ___.", "whole", "fourth", "ten", "Two equal halves together make the whole.")
  ],

  // Language
  "1.L.1.b": [
    q("Which word is a proper noun?", "Texas", "state", "city", "A proper noun names one special place, person, or thing and starts with a capital letter."),
    q("Which shows that the hat belongs to Sam?", "Sam's hat", "Sams hat", "Sam hat", "A possessive noun uses an apostrophe and s."),
    q("Which word is a common noun?", "dog", "Max", "Tuesday", "Dog names any dog. Max and Tuesday name special ones.")
  ],
  "1.L.1.c": [
    q("Which verb fits? She ___ the ball.", "kicks", "kick", "kicking", "A singular subject like she uses a verb that ends in s."),
    q("Which word fits? They ___ happy.", "are", "is", "am", "They is plural, so it goes with are."),
    q("Which word fits? I ___ happy.", "am", "is", "are", "The word I goes with am.")
  ],
  "1.L.1.d": [
    q("Which word fits? This is ___ coat.", "my", "me", "I", "My is a possessive pronoun that shows the coat belongs to me."),
    q("Which pronoun can take the place of the girls?", "they", "he", "it", "They stands for more than one person."),
    q("Which word is an indefinite pronoun?", "everyone", "red", "jump", "Everyone points to people without naming them.")
  ],
  "1.L.1.e": [
    q("Which sentence tells about the past?", "I walked home.", "I walk home.", "I will walk home.", "Walked ends in -ed, so it already happened."),
    q("Which sentence tells about right now?", "We play today.", "We played.", "We will play.", "Play, with today, tells what is happening now."),
    q("Tomorrow, we ___ to the zoo.", "will go", "went", "goes", "Tomorrow means the future, so we use will go.")
  ],
  "1.L.1.f": [
    q("Which word describes the cat? The ___ cat sleeps.", "fluffy", "runs", "under", "Fluffy tells what the cat is like."),
    q("Which word is an adjective?", "tall", "jump", "slowly", "Tall describes a person, place, or thing."),
    q("Which word tells what the ball looks like? The round ball rolls.", "round", "ball", "rolls", "Round describes the ball.")
  ],
  "1.L.1.g": [
    q("Do you want tea ___ juice?", "or", "because", "but", "Or joins two choices."),
    q("We stayed inside ___ it was cold.", "because", "or", "but", "Because tells the reason."),
    q("I was tired, ___ I went to bed.", "so", "or", "but", "So shows that going to bed happened because of being tired.")
  ],
  "1.L.1.h": [
    q("I am holding ___ pencil right here.", "this", "these", "those", "This points to one thing that is close."),
    q("Which word goes before apple? I ate ___ apple.", "an", "a", "these", "An is used before a word that starts with a vowel sound."),
    q("___ cats are far away across the yard.", "Those", "This", "That", "Those points to more than one thing that is far away.")
  ],
  "1.L.1.i": [
    q("The dog ran ___ the ball.", "toward", "during", "because", "Toward tells the direction the dog ran."),
    q("We sat quietly ___ story time.", "during", "toward", "between", "During tells when something happens."),
    q("The farm is ___ the hill, farther than the hill.", "beyond", "during", "and", "Beyond means farther than something.")
  ],
  "1.L.2.a": [
    q("My birthday is in may. Which word needs a capital letter?", "may", "birthday", "is", "Months start with a capital letter."),
    q("We met ana. Which word needs a capital letter?", "ana", "met", "We", "A person's name starts with a capital letter."),
    q("Our class meets on friday. Which word needs a capital letter?", "friday", "class", "meets", "Days of the week start with a capital letter.")
  ],
  "1.L.2.b": [
    q("Which mark ends this question? Where is my hat___", "?", ".", "!", "A question ends with a question mark."),
    q("Which sentence ends with the right mark?", "I have a red kite.", "I have a red kite?", "I have a red kite,", "A telling sentence ends with a period."),
    q("Wow, that is huge___ Which mark shows strong feeling?", "!", "?", ",", "An exclamation point shows strong feeling.")
  ],
  "1.L.2.c": [
    q("Which date uses a comma correctly?", "May 5, 2020", "May, 5 2020", "May 5 2,020", "A comma goes between the day and the year."),
    q("Which list uses commas correctly?", "red, blue, and green", "red blue, and green", "red, blue and, green", "Commas separate the words in a list."),
    q("Which sentence uses commas correctly?", "We saw lions, tigers, and bears.", "We saw, lions tigers and bears.", "We saw lions tigers, and, bears.", "Put a comma after each word in a list except the last.")
  ],
  "1.L.2.d": [
    q("Which word is spelled correctly?", "train", "trane", "trian", "The long a sound in train is spelled ai."),
    q("Which word ends with the /k/ sound spelled ck?", "duck", "dug", "dub", "Duck ends with the /k/ sound spelled ck."),
    q("Which irregular word is spelled correctly?", "said", "sed", "sayd", "Said is a word you need to remember, because it is not spelled the way it sounds.")
  ],
  "1.L.4.a": [
    q("The bunny was timid. It hid behind the tree when it heard a loud noise. What does timid mean?", "shy and easily scared", "loud", "tall", "Hiding from a noise is a clue that timid means easily scared."),
    q("Dad was exhausted after the race. He fell asleep right away. What does exhausted mean?", "very tired", "very hungry", "very silly", "Falling asleep right away is a clue that he was very tired."),
    q("The puppy was playful. It chased its tail and jumped for the ball. What does playful mean?", "wanting to play", "sleepy", "angry", "Chasing and jumping are clues that the puppy wants to play.")
  ],
  "1.L.4.b": [
    q("What does the ending -ful mean in careful?", "full of care", "without care", "care again", "The ending -ful means full of."),
    q("What does the ending -less mean in fearless?", "without fear", "full of fear", "fear again", "The ending -less means without."),
    q("What does the beginning pre- mean in preheat?", "heat before", "heat again", "not heat", "The beginning pre- means before.")
  ],
  "1.L.4.c": [
    q("What is the root word in jumping?", "jump", "ping", "jumpi", "Take off the ending -ing and jump is left."),
    q("Which word has the root word walk?", "walked", "talked", "wall", "Walked is walk with the ending -ed."),
    q("What is the root word in plays?", "play", "pla", "lays", "Take off the s and play is left.")
  ],
  "1.L.5.a": [
    q("Which word does not belong: red, blue, chair, green?", "chair", "red", "green", "Red, blue, and green are colors. A chair is not."),
    q("Which category fits: shirt, coat, hat?", "clothing", "colors", "foods", "Shirts, coats, and hats are all clothing."),
    q("Which category fits: milk, juice, water?", "drinks", "toys", "animals", "Milk, juice, and water are all drinks.")
  ],
  "1.L.5.b": [
    q("Which sentence tells what a tiger is?", "A tiger is a large cat with stripes.", "A tiger is a fish with wings.", "A tiger is a small bird.", "It names the group, cat, and a key attribute, stripes."),
    q("Which sentence best defines a cow?", "A cow is an animal that gives milk.", "A cow is a toy that rolls.", "A cow is a kind of tree.", "It names the group, animal, and what a cow does."),
    q("Which sentence tells what a pencil is and what it does?", "A pencil is a tool you use to write.", "A pencil is a fruit you eat.", "A pencil is a place to sleep.", "It names the group, tool, and its job.")
  ],
  "1.L.5.d": [
    q("Which word means to look quickly?", "glance", "stare", "glare", "A glance is a quick look."),
    q("Which word means to look for a long time?", "stare", "glance", "peek", "A stare is a long look."),
    q("Which word means very cold?", "freezing", "cool", "warm", "Freezing is much colder than cool.")
  ],
  "1.L.6": [
    q("I can't go outside ___ it is raining.", "because", "or", "and", "Because gives the reason."),
    q("She likes cats, ___ he likes dogs.", "but", "because", "so", "But connects two different ideas."),
    q("Which word shows a reason?", "because", "and", "but", "Because tells why something happens.")
  ],

  // Foundational reading
  "1.RF.1.a": [
    q("What does a sentence begin with?", "a capital letter", "a comma", "a space", "The first word in a sentence starts with a capital letter."),
    q("What does a telling sentence end with?", "a period", "a capital letter", "a comma", "A telling sentence ends with a period."),
    q("How many sentences are here? I like cats. Cats like me.", "2", "1", "3", "Each period ends a sentence, so there are two.")
  ],
  "1.RF.2.a": [
    q("Which word has a short vowel sound?", "hat", "cake", "bike", "Hat has a short a. Cake and bike have long vowels."),
    q("Which word has a long o sound?", "boat", "hot", "top", "Boat has a long o."),
    q("Is the vowel sound in pin long or short?", "short", "long", "there is none", "Pin has a short i sound.")
  ],
  "1.RF.2.b": [
    q("Blend these sounds: /f/ /l/ /a/ /g/. What word do they make?", "flag", "flap", "frog", "The sounds make flag."),
    q("Blend these sounds: /s/ /n/ /a/ /p/. What word do they make?", "snap", "nap", "slap", "The sounds make snap."),
    q("Blend these sounds: /ch/ /i/ /p/. What word do they make?", "chip", "ship", "chop", "The sounds make chip.")
  ],
  "1.RF.2.c": [
    q("What is the middle sound in sit?", "/i/", "/s/", "/t/", "The middle sound in sit is /i/."),
    q("What is the first sound in ship?", "/sh/", "/s/", "/p/", "Ship begins with the /sh/ sound."),
    q("What is the last sound in dog?", "/g/", "/d/", "/o/", "Dog ends with the /g/ sound.")
  ],
  "1.RF.2.d": [
    q("How many sounds are in the word ship?", "3", "4", "2", "Ship has the sounds /sh/ /i/ /p/."),
    q("How many sounds are in the word frog?", "4", "3", "2", "Frog has the sounds /f/ /r/ /o/ /g/."),
    q("Which sounds do you hear in cat, in order?", "/k/ /a/ /t/", "/t/ /a/ /k/", "/a/ /k/ /t/", "Cat has the sounds /k/ /a/ /t/ in that order.")
  ],
  "1.RF.3.a": [
    q("Which letters spell the first sound in thumb?", "th", "sh", "ch", "The letters th spell the first sound in thumb."),
    q("Which word begins with the sound spelled wh?", "whale", "shark", "chair", "Whale begins with wh."),
    q("Which letters spell the last sound in dish?", "sh", "ch", "th", "The letters sh spell the last sound in dish.")
  ],
  "1.RF.3.b": [
    q("Which word says /s/ /t/ /e/ /p/?", "step", "stop", "stem", "The sounds make step."),
    q("Which word says /g/ /l/ /a/ /d/?", "glad", "gold", "glow", "The sounds make glad."),
    q("Which word says /d/ /r/ /u/ /m/?", "drum", "dram", "dump", "The sounds make drum.")
  ],
  "1.RF.3.c": [
    q("Which word has a silent e that makes the vowel long?", "kite", "kit", "cot", "The silent e in kite makes the i say its name."),
    q("Which word has the vowel team ai?", "rain", "red", "rat", "Rain has the vowel team ai."),
    q("Which word has the long o sound spelled oa?", "boat", "bot", "bat", "Boat has the long o sound spelled oa.")
  ],
  "1.RF.3.d": [
    q("How many syllables are in basket?", "2", "1", "3", "Bas-ket has two vowel sounds, so two syllables."),
    q("How many syllables are in butterfly?", "3", "2", "4", "But-ter-fly has three syllables."),
    q("A word has 2 vowel sounds. How many syllables does it have?", "2", "1", "3", "Every syllable has one vowel sound.")
  ],
  "1.RF.3.e": [
    q("Which way splits rabbit into syllables?", "rab-bit", "ra-bbit", "rabb-it", "Rabbit splits between the two b's: rab-bit."),
    q("Which word is made of the two words sun and set?", "sunset", "sunrise", "sunny", "Sun and set together make sunset."),
    q("Which way splits napkin into syllables?", "nap-kin", "na-pkin", "napk-in", "Napkin splits between the p and k: nap-kin.")
  ],
  "1.RF.3.f": [
    q("What does the ending -ed tell you in walked?", "it happened in the past", "it is happening now", "it will happen later", "The ending -ed shows the action already happened."),
    q("What does the ending -ing tell you in running?", "it is happening now", "it happened long ago", "there is more than one", "The ending -ing shows an action that is going on."),
    q("Which word means more than one?", "cats", "cat", "catting", "The ending -s makes cat mean more than one.")
  ],
  "1.RF.3.g": [
    q("Which word says was?", "was", "saw", "wash", "Was is a word to remember by sight."),
    q("Which word says said?", "said", "sad", "sail", "Said is a word to remember by sight."),
    q("Which word says come?", "come", "cone", "came", "Come is a word to remember by sight.")
  ],

  // Informational text
  "1.RI.1": [
    q("Read: Camels store fat in their humps. The fat gives them energy in the desert. What does the fat give camels?", "energy", "water", "shade", "The text says the fat gives them energy."),
    q("Read: A spider spins a web to catch bugs. What does a spider use a web for?", "to catch bugs", "to sleep", "to swim", "The text says a web is used to catch bugs."),
    q("Read: Owls hunt at night and sleep during the day. When do owls hunt?", "at night", "in the morning", "at lunch", "The text says owls hunt at night.")
  ],
  "1.RI.2": [
    q("Read: Penguins live in cold places. They swim and eat fish. Their feathers keep them warm. What is the main topic?", "penguins", "fish", "snow", "Every sentence tells about penguins."),
    q("Read: Bats sleep upside down. Bats hunt at night. Pizza is round. Which sentence does not belong?", "Pizza is round.", "Bats hunt at night.", "Bats sleep upside down.", "The topic is bats, and the pizza sentence is about something else."),
    q("Read: A seed needs soil, water, and sun to grow into a plant. Which is the best retelling?", "A seed needs soil, water, and sun to grow.", "A seed is a toy.", "Plants never grow.", "A retelling keeps the key details.")
  ],
  "1.RI.3": [
    q("Read: When you rub your hands together, they get warm. What happens when you rub your hands?", "they get warm", "they get cold", "they disappear", "The text connects rubbing to getting warm."),
    q("Read: Bees visit flowers. This helps flowers make seeds. How do bees help flowers?", "they help flowers make seeds", "they eat the flowers", "they water the flowers", "The text connects bee visits to seeds."),
    q("Read: First, mix flour and eggs. Next, bake. Last, add frosting. Which step comes between mixing and frosting?", "bake", "eat", "wash", "Baking is the next step after mixing.")
  ],
  "1.RI.4": [
    q("Read: The Arctic is frigid. It is so cold that water turns to ice. What does frigid mean?", "very cold", "very hot", "very loud", "Water turning to ice is a clue that frigid means very cold."),
    q("A glossary tells what hard words mean. Where can you find what a hard word means?", "in the glossary", "on the cover", "in the title", "A glossary explains words in the book."),
    q("Read: Beavers gnaw wood with their strong teeth. Gnaw means to bite and chew. What does gnaw mean?", "to bite and chew", "to run", "to sleep", "The text tells you gnaw means to bite and chew.")
  ],
  "1.RI.5": [
    q("Which feature helps you find a word's meaning at the end of a book?", "the glossary", "the title page", "the cover", "A glossary lists hard words and their meanings."),
    q("What does a heading tell you?", "what a section is about", "who drew the pictures", "how long the book is", "A heading names the topic of the section."),
    q("Which text feature is a small picture that shows what something is or what to do?", "an icon", "a heading", "a glossary", "An icon is a small picture used as a sign.")
  ],
  "1.RI.6": [
    q("The words say, A frog sits on a log. The picture shows the frog is green with big eyes. What does the picture tell that the words do not?", "the frog is green", "a frog sits on a log", "there is a log", "The color and big eyes come only from the picture."),
    q("Words: Whales breathe air. Picture: a gray whale in the sea. What do the words tell?", "whales breathe air", "the whale is gray", "the whale is in the sea", "Only the words say whales breathe air."),
    q("Pictures can show things like ___ that the words may not.", "colors and shapes", "page numbers", "the author's name", "Pictures show how things look.")
  ],
  "1.RI.7": [
    q("Read: Cactus plants store water. A picture shows a cactus with a thick, round stem. What does the picture help you understand?", "where a cactus keeps water", "how to cook", "how to swim", "The thick stem helps show where the water is stored."),
    q("Read: Hummingbirds flap their wings very fast. A picture shows blurred wings. What does the picture help you see?", "the wings move fast", "the bird is sleeping", "the wings are slow", "Blurred wings show fast movement."),
    q("Read: Fire trucks carry ladders. A picture shows a ladder on top of a fire truck. Where is the ladder?", "on top of the truck", "in the water", "in a house", "The picture shows the ladder on top.")
  ],
  "1.RI.8": [
    q("Read: We should wear helmets when we bike because helmets protect our heads. What reason is given?", "helmets protect our heads", "helmets are blue", "bikes are fast", "The text gives the reason after the word because."),
    q("Read: Dogs make good pets because they are friendly and loyal. What are the reasons?", "they are friendly and loyal", "they are big and loud", "they are fast and wet", "The author says dogs are friendly and loyal."),
    q("Read: Sleep is important. Without sleep, you feel grumpy and cannot learn well. Which reason supports the point?", "you feel grumpy and cannot learn well without it", "beds are soft", "night is dark", "That is the reason the author gives.")
  ],
  "1.RI.9": [
    q("Book A shows photos of a lion. Book B shows drawings of a lion. What is different?", "the kind of pictures", "the animal", "the topic", "Both books are about a lion, but the pictures are different."),
    q("Book A says elephants eat plants. Book B says elephants are the largest land animals. What is the topic of both?", "elephants", "plants", "lions", "Both books are about elephants."),
    q("Book A explains how to plant a seed. Book B also explains how to plant a seed, but has more steps. How are they different?", "Book B has more steps", "Book A is about animals", "they are about different topics", "The topic is the same, but Book B gives more steps.")
  ],

  // Literature
  "1.RL.1": [
    q("Read: Pablo wore a yellow raincoat to school because it was pouring. Why did Pablo wear a raincoat?", "it was pouring", "it was sunny", "it was snowing", "The story gives the reason: it was pouring."),
    q("Read: Mia gave her sister a blue crayon. What did Mia give her sister?", "a blue crayon", "a red crayon", "a book", "The story says Mia gave a blue crayon."),
    q("Read: After dinner, Grandpa read a story to Ben. When did Grandpa read?", "after dinner", "before breakfast", "at recess", "The story says after dinner.")
  ],
  "1.RL.2": [
    q("Read: Rob shared his toys with his friend. They both had fun. What lesson does the story teach?", "sharing is kind", "toys are expensive", "friends are loud", "The story shows that sharing leads to fun for both."),
    q("Read: A boy told the truth about a broken vase. His mom was proud of him. What lesson does the story teach?", "tell the truth", "never hold a vase", "run fast", "Telling the truth made his mom proud."),
    q("Which is the best retelling? Pam's kite flew away. She and her dad ran after it and caught it.", "Pam's kite flew away, and she and her dad caught it.", "Pam bought a kite.", "Her dad lost a hat.", "A retelling includes the main events.")
  ],
  "1.RL.3": [
    q("Read: In the garden, Ana and her grandma picked tomatoes. Who are the characters?", "Ana and her grandma", "Ana and her dad", "a tomato and a bee", "The characters are Ana and her grandma."),
    q("Read: It was a cold winter day. Jake zipped his coat and walked to school. When does the story take place?", "on a cold winter day", "on a hot summer day", "at night", "The story begins on a cold winter day."),
    q("Read: The wind blew Lia's hat away. She chased it down the street and caught it. What is the big event?", "Lia chased her hat", "Lia took a nap", "Lia ate lunch", "The big event is Lia chasing and catching her hat.")
  ],
  "1.RL.4": [
    q("Read: The cookies smelled warm and sweet. Which sense does the word smelled use?", "smell", "hearing", "sight", "Smelled is about the sense of smell."),
    q("Read: The thunder boomed and rumbled. Which word tells a sound?", "boomed", "thunder", "the", "Boomed tells how the thunder sounded."),
    q("Read: Tia's hands shook and her heart pounded. How does Tia feel?", "nervous", "sleepy", "proud", "Shaking hands and a pounding heart show she is nervous.")
  ],
  "1.RL.5": [
    q("Which book would give facts about how volcanoes work?", "an information book", "a made-up story", "a fairy tale", "A book of facts about real things gives information."),
    q("Which book most likely has characters who talk, like a fox and a hen?", "a storybook", "a science book", "a dictionary", "Talking animals appear in made-up stories."),
    q("Which clue shows a book gives information?", "it has headings and facts", "it has a talking dragon", "it has magic spells", "Information books use headings and facts.")
  ],
  "1.RL.6": [
    q("Read: I opened the door and saw a puppy. Who is telling the story?", "a character in the story", "someone outside the story", "no one", "The word I shows a character is telling the story."),
    q("Read: 'Come here!' called Dad. Who is speaking?", "Dad", "the narrator", "the dog", "Dad is the one who called."),
    q("Read: The fox crept through the grass. It was hungry. Who is telling the story?", "a narrator outside the story", "the fox", "the grass", "The story says the fox, not I, so a narrator is telling it.")
  ],
  "1.RL.7": [
    q("Read: Jin went outside. A picture shows snowflakes falling and Jin in a hat and gloves. What does the picture tell you?", "it is snowing", "it is hot", "it is night", "Snowflakes and warm clothes show it is snowing."),
    q("Read: Mara's room was a mess. Which picture matches?", "toys and clothes all over the floor", "a clean bed and an empty floor", "a neat shelf of books", "A mess means things are scattered about."),
    q("A picture shows a bear at the edge of a dark cave. What does the picture show about where the bear is going?", "into the cave", "into a lake", "up a tree", "The bear is at the cave's edge, so it is going in.")
  ],
  "1.RL.9": [
    q("In one story, a girl is brave and climbs a mountain. In another, a boy is brave and walks into a dark room. How are they alike?", "both are brave", "both are afraid of mountains", "both are sleeping", "Each character shows bravery."),
    q("In one story a fox is tricky. In another a rabbit is kind. How are the characters different?", "one is tricky and one is kind", "both are tricky", "both are kind", "The characters have different traits."),
    q("Story A happens at a farm. Story B happens at the beach. What is different?", "where the stories happen", "the characters' names", "the lesson", "The settings are different.")
  ]
};
