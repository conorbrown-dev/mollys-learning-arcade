import { conceptQuestion as q, type ConceptVariantTable } from "./concept-question";

/**
 * Grade 2 questions that each test a different part of a standard, so a student who misses one is not
 * simply shown the same idea reworded. Each entry adds to the questions the generators already produce.
 */
export const gradeTwoConceptVariants: ConceptVariantTable = {
  // Math
  "2.NBT.A.1.a": [
    q("A bundle of 10 tens is called a ___.", "hundred", "thousand", "ten", "Ten tens make one hundred."),
    q("10 tens are equal to how many ones?", "100", "10", "1,000", "Each ten is 10 ones, and 10 tens is 100 ones."),
    q("Which one equals one hundred?", "10 tens", "10 ones", "100 tens", "Ten tens make one hundred.")
  ],
  "2.NBT.B.9": [
    q("To add 38 + 25, Sam adds 30 + 20 first and then 8 + 5. Why does this work?", "it adds the tens and the ones separately", "it ignores the ones", "it takes the tens away", "Splitting each number into tens and ones lets you add each place on its own."),
    q("Why do we trade 10 ones for 1 ten when adding?", "10 ones are worth the same as 1 ten", "ones do not matter", "a ten is bigger than a hundred", "Ten ones and one ten have the same value, so the trade keeps the total the same."),
    q("To subtract 50 − 18, Mia takes away 10 and then takes away 8. Why does this work?", "18 is the same as 10 and 8", "50 is the same as 18", "8 is bigger than 10", "Taking away 10 and then 8 takes away 18 altogether.")
  ],
  "2.MD.A.1": [
    q("Which tool is best to measure an eraser?", "a ruler", "a thermometer", "a clock", "A ruler measures short lengths in inches or centimeters."),
    q("Which tool has a small straight edge with inches and centimeters marked on it?", "a ruler", "a clock", "a scale", "A ruler has inch and centimeter marks."),
    q("A meter stick is best for measuring ___.", "the width of a door", "the length of a crayon", "a grain of rice", "A meter stick is long, so it fits bigger things like a door.")
  ],
  "2.MD.A.2": [
    q("Measuring the same table with smaller units gives a ___ number.", "greater", "smaller", "the same", "You need more small units to cover the same length."),
    q("A rope measures 12 inches and also 1 foot. Why is the number for inches bigger?", "an inch is shorter than a foot", "an inch is longer than a foot", "the rope changed size", "Smaller units take more of them to match the same length."),
    q("Mia measured a book with paper clips and with crayons. The crayon count was smaller. Which unit is longer?", "the crayon", "the paper clip", "they are the same", "Fewer units are needed when each unit is longer.")
  ],
  "2.MD.A.3": [
    q("Which is a reasonable estimate for the length of a school bus?", "10 meters", "10 centimeters", "10 inches", "A school bus is very long, about 10 meters."),
    q("Which is a reasonable estimate for the width of your hand?", "3 inches", "3 feet", "3 meters", "A hand is a few inches wide."),
    q("Which is a reasonable estimate for the length of a car?", "4 meters", "4 centimeters", "4 inches", "A car is several meters long.")
  ],
  "2.MD.D.9": [
    q("A line plot shows lengths of 2, 3, 3, 3, and 5 inches. How many objects were measured?", "5", "3", "13", "Each X stands for one object, and there are five."),
    q("On a line plot, what does each X stand for?", "one measurement", "one inch", "one color", "Each X is one measurement."),
    q("Pencil lengths are 4, 5, 5, and 6 inches. What is the longest length?", "6 inches", "4 inches", "5 inches", "Six is the greatest of the lengths.")
  ],
  "2.G.A.1": [
    q("How many faces does a cube have?", "6", "4", "8", "A cube has six square faces."),
    q("A shape has 6 sides and 6 angles. What is it?", "a hexagon", "a pentagon", "a triangle", "A hexagon has six sides and six angles."),
    q("Which shape is a quadrilateral?", "a rectangle", "a triangle", "a pentagon", "A quadrilateral has four sides.")
  ],
  "2.G.A.3": [
    q("A rectangle is cut into 3 equal shares. One share is called a ___.", "third", "half", "fourth", "One of three equal shares is a third."),
    q("Three thirds make one ___.", "whole", "half", "third", "Three equal thirds together make the whole."),
    q("Which cut makes halves?", "2 equal parts", "2 unequal parts", "3 equal parts", "Halves are two equal shares.")
  ],

  // Language
  "2.L.1.a": [
    q("A ___ of fish swam by.", "school", "flock", "herd", "A group of fish is called a school."),
    q("A ___ of birds flew by.", "flock", "herd", "pack", "A group of birds is called a flock."),
    q("Which collective noun names people who play music together?", "band", "flock", "litter", "A band is a group of musicians.")
  ],
  "2.L.1.b": [
    q("One tooth, two ___.", "teeth", "tooths", "toothes", "The plural of tooth is teeth."),
    q("One foot, two ___.", "feet", "foots", "feets", "The plural of foot is feet."),
    q("One man, two ___.", "men", "mans", "manes", "The plural of man is men.")
  ],
  "2.L.1.c": [
    q("We built the fort by ___.", "ourselves", "ourself", "us", "Ourselves is the reflexive pronoun for we."),
    q("The cat cleaned ___.", "itself", "themselves", "myself", "Itself refers back to the cat."),
    q("I taught ___ to ride a bike.", "myself", "me", "mine", "Myself refers back to the person speaking.")
  ],
  "2.L.1.d": [
    q("Yesterday, I ___ my lunch.", "ate", "eated", "eaten", "The past tense of eat is ate."),
    q("Last night, the bird ___ away.", "flew", "flyed", "flown", "The past tense of fly is flew."),
    q("Yesterday we ___ a loud noise.", "heard", "heared", "hearded", "The past tense of hear is heard.")
  ],
  "2.L.1.e": [
    q("Which word is an adverb? She runs quickly.", "quickly", "she", "runs", "Quickly tells how she runs."),
    q("Which word is an adjective? The ___ dog barked.", "loud", "loudly", "barked", "An adjective like loud describes the dog."),
    q("Choose the right word. She sang ___.", "sweetly", "sweet", "sweeter", "An adverb like sweetly tells how she sang.")
  ],
  "2.L.1.f": [
    q("Which is a compound sentence?", "I like pizza, and my sister likes pasta.", "I like pizza.", "Pizza and pasta.", "A compound sentence joins two complete ideas."),
    q("Which is NOT a complete sentence?", "Ran down the hill.", "The boy ran.", "We play.", "A complete sentence needs someone doing the action."),
    q("Which sentence rearranges The dog chased the ball correctly?", "The ball was chased by the dog.", "The ball chased the dog.", "Chased dog the ball.", "The meaning stays the same when the words are rearranged this way.")
  ],
  "2.L.2.a": [
    q("We eat turkey on thanksgiving. Which word needs a capital letter?", "thanksgiving", "turkey", "eat", "Holidays start with a capital letter."),
    q("We sailed down the Mississippi river. Which word needs a capital letter?", "river", "sailed", "down", "Each word in a geographic name starts with a capital letter."),
    q("Mom packed sunny Juice boxes. Which word needs a capital letter?", "sunny", "packed", "boxes", "Each word in a product name starts with a capital letter.")
  ],
  "2.L.2.b": [
    q("Which greeting is written correctly?", "Dear Grandma,", "Dear, Grandma", "Dear Grandma.", "A comma goes at the end of the greeting."),
    q("Which closing is written correctly?", "Sincerely,", "Sincerely.", "Sincerely;", "A comma goes after the closing word."),
    q("Which letter beginning is correct?", "Dear Aunt Jo,", "Dear Aunt, Jo", "Dear, Aunt Jo", "The comma comes after the whole name.")
  ],
  "2.L.2.c": [
    q("Which is the contraction for do not?", "don't", "dont'", "do'nt", "The apostrophe takes the place of the missing o."),
    q("Which is the contraction for it is?", "it's", "its'", "it'is", "The apostrophe takes the place of the missing i."),
    q("Which is the contraction for we will?", "we'll", "well", "we'l", "The apostrophe takes the place of the missing letters wi.")
  ],
  "2.L.2.d": [
    q("Which word ends with the same pattern as light?", "night", "kit", "bite", "Night and light both end in -ight."),
    q("Which word has the same vowel pattern as boil?", "coin", "cow", "cot", "Boil and coin both use oi."),
    q("Which spelling follows the pattern of badge for the /j/ sound after a short vowel?", "fudge", "fuj", "fuge", "After a short vowel, the /j/ sound is often spelled dge.")
  ],
  "2.L.3.a": [
    q("Which greeting is more informal?", "Hey, what's up?", "Good morning, how are you?", "Hello, Mr. Smith.", "Informal language is relaxed, like what you say to a friend."),
    q("Which is more formal for writing to the library?", "Dear Librarian, thank you for your help.", "Yo librarian, thx!", "Hey you!", "Formal language is polite and complete."),
    q("Which is something you might say to a friend at recess?", "Wanna play tag?", "Would you care to join me in a game of tag?", "Greetings, fellow student.", "Friends usually talk in a relaxed, informal way.")
  ],
  "2.L.4.a": [
    q("The giant boulder was so heavy that four friends could not lift it. What does boulder mean?", "a very large rock", "a small leaf", "a tiny seed", "Something too heavy to lift is a large rock."),
    q("Lena was delighted when she won. She smiled and cheered. What does delighted mean?", "very happy", "very sad", "tired", "Smiling and cheering are clues that she was very happy."),
    q("The soup was scalding. Tom burned his tongue. What does scalding mean?", "very hot", "very cold", "salty", "Burning his tongue is a clue that the soup was very hot.")
  ],
  "2.L.4.b": [
    q("What does unlock mean?", "to open a lock", "to lock again", "to lock first", "The prefix un- means to do the opposite."),
    q("What does the prefix re- mean in rewrite?", "write again", "write before", "not write", "The prefix re- means again."),
    q("What does disagree mean?", "to not agree", "to agree again", "to agree first", "The prefix dis- means not.")
  ],
  "2.L.4.c": [
    q("Knowing the word teach helps you understand teacher. What is a teacher?", "a person who teaches", "a place to teach", "a thing used for teaching", "The ending -er names a person who does the action."),
    q("Knowing the word color helps you understand colorful. What does colorful mean?", "full of color", "without color", "color again", "The ending -ful means full of."),
    q("Knowing the word kind helps you understand kindness. What does kindness mean?", "being kind", "being rude", "being fast", "Kindness is the quality of being kind.")
  ],
  "2.L.4.d": [
    q("What is a bookshelf?", "a shelf for books", "a book about shelves", "a very tall book", "The two small words tell you it is a shelf for books."),
    q("What is sunlight?", "light from the sun", "a lamp", "a sun made of light", "Sun plus light means light from the sun."),
    q("Which two words make up football?", "foot and ball", "fo and tball", "foot and tall", "Foot and ball together make football.")
  ],
  "2.L.5.a": [
    q("Which animal could be described as tiny?", "an ant", "an elephant", "a whale", "An ant is very small."),
    q("Which place could be described as noisy?", "a busy playground", "a quiet library", "a sleeping baby's room", "A busy playground has lots of loud sounds."),
    q("Which food could be described as crunchy?", "a carrot", "soup", "pudding", "A raw carrot makes a crunch when you bite it.")
  ],
  "2.L.5.b": [
    q("Which word means to move very fast?", "sprint", "stroll", "creep", "Sprint means to run very fast."),
    q("Which word means a small amount of rain?", "drizzle", "downpour", "storm", "Drizzle is light rain."),
    q("Which word means more tired than sleepy?", "exhausted", "awake", "rested", "Exhausted is a stronger word than sleepy.")
  ],
  "2.L.6": [
    q("Which word best describes how a cheetah runs?", "swiftly", "slowly", "sadly", "Swiftly means very fast."),
    q("Which sentence tells what the soup tastes like?", "The soup was salty.", "The soup was on the table.", "We ate the soup.", "Salty is a describing word for taste."),
    q("Which describing word tells how loud a big thunderstorm is?", "booming", "quiet", "tiny", "Booming means very loud.")
  ],

  // Foundational reading
  "2.RF.3.a": [
    q("Which word has a long vowel sound?", "tape", "tap", "top", "The silent e in tape makes the a long."),
    q("Which word has the short u sound?", "cup", "cube", "cute", "Cup has the short u sound."),
    q("Which pair of words has the same vowel sound?", "hop, pot", "hop, hope", "cap, cape", "Hop and pot both have the short o sound.")
  ],
  "2.RF.3.b": [
    q("Which word has the vowel team ee?", "feet", "fed", "fat", "Feet has the vowel team ee."),
    q("Which word has the vowel team oo?", "moon", "mop", "mom", "Moon has the vowel team oo."),
    q("Which word has the vowel team ow, as in cow?", "town", "top", "tin", "Town has the vowel team ow.")
  ],
  "2.RF.3.c": [
    q("Which two-syllable word has a long a sound in its first part?", "paper", "pepper", "puppet", "Pa-per has a long a in the first syllable."),
    q("Which two-syllable word has a long i sound in its first part?", "silent", "sister", "simple", "Si-lent has a long i in the first syllable."),
    q("Which two-syllable word has a long e sound at the end?", "happy", "hammer", "hundred", "Hap-py ends with a long e sound.")
  ],
  "2.RF.3.d": [
    q("What does the ending -ful mean in thankful?", "full of thanks", "without thanks", "thanks again", "The ending -ful means full of."),
    q("What does the ending -er mean in teacher?", "a person who teaches", "more teaching", "not teach", "The ending -er can name a person who does something."),
    q("What does unfair mean?", "not fair", "very fair", "fair again", "The prefix un- means not.")
  ],
  "2.RF.3.e": [
    q("Which word has the /f/ sound spelled ph?", "phone", "face", "fan", "Phone spells /f/ with ph."),
    q("Which word has a silent k at the start?", "knee", "keep", "kite", "In knee, the k is silent."),
    q("Which word has a silent w at the start?", "write", "wet", "win", "In write, the w is silent.")
  ],
  "2.RF.3.f": [
    q("Which word says because?", "because", "becuz", "becase", "Because is a word to remember by sight."),
    q("Which word says friend?", "friend", "freind", "frend", "Friend is a word to remember by sight."),
    q("Which word says people?", "people", "peeple", "peple", "People is a word to remember by sight.")
  ],

  // Informational text
  "2.RI.1": [
    q("A passage says the Nile River is in Africa. Which question does it answer?", "Where is the Nile River?", "Who lives at the Nile?", "When did it rain?", "The detail tells where the river is."),
    q("A text says, Bakers get up before sunrise so bread is fresh by morning. Which question does it answer?", "Why do bakers get up early?", "Where is the bakery?", "Who buys the bread?", "The detail gives the reason."),
    q("A passage says the festival is on Saturday. Which question does it answer?", "When is the festival?", "Who is at the festival?", "How big is the festival?", "The detail tells when.")
  ],
  "2.RI.2": [
    q("A text has three paragraphs: what bears eat, where bears sleep, and how bears care for cubs. What is the main topic?", "bears", "food", "cubs", "Every paragraph is about bears."),
    q("A paragraph explains step by step how a spider spins a web. What is its focus?", "how a spider spins a web", "why spiders are scary", "where spiders live", "The paragraph focuses on spinning a web."),
    q("A paragraph begins: Whales are the largest animals. It tells how big blue whales grow. What is its focus?", "the size of whales", "what whales eat", "where whales sleep", "The details are all about how big whales are.")
  ],
  "2.RI.3": [
    q("First, a seed gets water. Then roots grow. Next, a stem pushes up. What happens right after roots grow?", "a stem pushes up", "the seed gets water", "the plant dies", "The text says the stem pushes up next."),
    q("Because the lake froze, children could skate. What is the connection?", "the frozen lake made skating possible", "skating froze the lake", "the children froze", "The freezing caused skating to be possible."),
    q("To make a paper airplane, first fold the paper in half. Next, fold the corners. Last, fly it. Which step comes first?", "fold the paper in half", "fly it", "fold the corners", "Folding the paper in half is the first step.")
  ],
  "2.RI.4": [
    q("In a text about the ocean, tide means the rise and fall of the sea. What does tide mean?", "the rise and fall of the sea", "a kind of fish", "a boat", "The text tells you what tide means."),
    q("In a science book, a predator is an animal that hunts other animals. What is a predator?", "an animal that hunts others", "a plant", "a rock", "The text defines predator."),
    q("A glossary says, magnet: an object that pulls iron. What does a magnet do?", "pulls iron", "melts ice", "makes light", "The glossary tells what a magnet does.")
  ],
  "2.RI.5": [
    q("Why are some words in bold print?", "they are important words", "they are mistakes", "they are page numbers", "Bold print points out important words."),
    q("Where do you find a caption?", "under a picture", "on the back cover", "in the index", "A caption sits near a picture and explains it."),
    q("Which feature lists topics in ABC order with page numbers at the back of a book?", "the index", "the table of contents", "the title page", "An index lists topics alphabetically with their pages.")
  ],
  "2.RI.6": [
    q("An author writes about how to make a bird feeder step by step. Why?", "to explain how to do something", "to tell a funny story", "to ask for money", "Steps explain how to do something."),
    q("A text describes what a rainforest looks like and sounds like. What does the author want to do?", "describe", "argue", "trick the reader", "The author wants to describe the rainforest."),
    q("A text starts with the question, Why is the sky blue? What does the author want to do?", "answer a question", "scare readers", "sell shoes", "The text is written to answer the question.")
  ],
  "2.RI.7": [
    q("A diagram of the water cycle has arrows. What do the arrows show?", "which way the water moves", "how heavy water is", "what water tastes like", "Arrows show direction."),
    q("A photo of a tarantula is next to the text. How does it help?", "it shows what the animal looks like", "it tells the animal's name", "it gives page numbers", "A photo shows details that words may not."),
    q("A map in a text about a river shows where it flows. What does the map help you see?", "where the river is", "how deep it is", "what fish live in it", "A map shows places.")
  ],
  "2.RI.8": [
    q("The author says we should plant trees because trees give shade and clean the air. What supports the point?", "trees give shade and clean the air", "trees are green", "parks have grass", "That is the reason given for planting trees."),
    q("The author says recess is important. It gives kids time to move and rest. Which reason supports the point?", "kids get time to move and rest", "recess is loud", "kids like snacks", "The author's reason is movement and rest."),
    q("Which point does this reason support? Exercise makes your heart strong.", "we should exercise", "we should watch TV", "we should skip lunch", "The reason supports exercising.")
  ],
  "2.RI.9": [
    q("Text A says frogs eat insects. Text B says frogs also eat worms. What is different?", "Text B adds worms", "Text A is about cats", "both say frogs eat only worms", "Text B gives another thing frogs eat."),
    q("Two texts explain how to plant a seed. One has pictures and one has a diagram. What do they share?", "the topic, planting a seed", "the kinds of pictures", "the number of pages", "Both texts are about planting a seed."),
    q("Two texts are about volcanoes. One explains how volcanoes form. The other tells about famous eruptions. How are they different?", "one explains how they form, the other tells about eruptions", "both explain how they form", "both tell about eruptions", "They cover different parts of the topic.")
  ],

  // Literature
  "2.RL.1": [
    q("In a story, Omar ran because the bus was leaving. Who ran?", "Omar", "the bus", "the driver", "The story says Omar ran."),
    q("In a story, the picnic was held at the lake on Sunday. Where was the picnic?", "at the lake", "at school", "at the park", "The story says the picnic was at the lake."),
    q("In a story, Tess felt proud because she finished her painting. How did Tess feel?", "proud", "scared", "bored", "The story says Tess felt proud.")
  ],
  "2.RL.2": [
    q("In a fable, an ant works all summer while a grasshopper plays. In winter, the ant has food. What is the lesson?", "work hard and plan ahead", "play all summer", "winter is cold", "The ant's planning paid off."),
    q("A folktale shows a girl who shares her last bread with a stranger and is rewarded. What is the moral?", "kindness is rewarded", "never talk to strangers", "bread is tasty", "Her kindness led to a reward."),
    q("Which is the best retelling of a story where a slow turtle wins a race by never giving up?", "A slow turtle wins by never giving up.", "A rabbit eats lunch.", "A turtle sleeps all day.", "A retelling includes the main events.")
  ],
  "2.RL.3": [
    q("When Sam's team lost, he shook hands and said good game. How did Sam respond?", "he was a good sport", "he cried and ran away", "he yelled", "Shaking hands shows good sportsmanship."),
    q("When the power went out, Rosa lit candles and told stories. How did Rosa respond to the challenge?", "she stayed calm and found a way to have fun", "she gave up", "she broke a lamp", "Rosa found a way to handle the problem."),
    q("When Dev lost his lunch money, he told his teacher. Why was that a good response?", "an adult could help him", "it made lunch cheaper", "he got more money", "Asking a trusted adult is a good way to solve a problem.")
  ],
  "2.RL.4": [
    q("A poem has the words buzzing bees by the blue lake. Words that start with the same sound are called ___.", "alliteration", "rhyme", "a repeated line", "Words with the same beginning sound make alliteration."),
    q("Which pair of words rhymes?", "cat, hat", "cat, dog", "hat, sun", "Cat and hat end with the same sound."),
    q("A song has a steady beat you can clap along to. What does the beat add?", "rhythm", "a setting", "a character", "A steady beat gives a song its rhythm.")
  ],
  "2.RL.5": [
    q("Which part of a story tells how the problem is solved?", "the ending", "the beginning", "the title", "The ending concludes the action."),
    q("A story begins: One morning, Jo woke up to find her dog missing. What does this beginning introduce?", "a character and the problem", "the ending", "the moral", "The beginning introduces who is in the story and what goes wrong."),
    q("What happens in the middle of a story?", "the action builds as characters try to solve the problem", "the story is introduced", "the story says the end", "The middle shows what the characters do about the problem.")
  ],
  "2.RL.6": [
    q("Read: 'I love rainy days,' said Pia. 'I hate them,' said Ben. How are Pia and Ben different?", "they feel differently about rain", "they both love rain", "they both hate rain", "The characters have different points of view."),
    q("When reading aloud, how can you show a mouse speaking and then a bear?", "use a squeaky voice and then a deep voice", "read very quickly", "whisper the whole time", "Different voices show different characters."),
    q("Read: 'I won!' cheered Max. 'I lost,' sighed Lee. Who feels sad?", "Lee", "Max", "both", "Lee sighed about losing.")
  ],
  "2.RL.7": [
    q("The words say, The storm came fast. The picture shows dark clouds and bending trees. What does the picture add?", "how strong the storm is", "the name of the character", "the end of the story", "The picture shows how strong the storm is."),
    q("The words say, Jon got a gift. The picture shows Jon smiling with a big box. What does the picture help show?", "that Jon is happy", "that Jon is lost", "that it is night", "A smile shows he is happy."),
    q("A picture shows sand and cactus plants under a hot sun. Which setting does it show?", "a hot, dry desert", "a snowy mountain", "a deep sea", "Sand and cactus show a desert.")
  ],
  "2.RL.9": [
    q("Two versions of a story take place in different settings. One is in a village and one is in a city. What is different?", "where the story takes place", "the main problem", "the moral", "The settings are different."),
    q("Two versions of a folktale have different endings. What does that mean?", "the stories end in different ways", "the stories are exactly the same", "one has no characters", "Different endings mean the stories finish differently."),
    q("Two authors tell the same fairy tale. In one the hero is a girl and in the other the hero is a boy. What is different?", "the main character", "the title", "the lesson", "The main character is different.")
  ]
};
