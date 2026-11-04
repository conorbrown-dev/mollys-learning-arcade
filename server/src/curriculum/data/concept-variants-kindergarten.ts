import { conceptQuestion as q, type ConceptVariantTable } from "./concept-question";

/**
 * Kindergarten questions that each test a different part of a standard, so a student who misses one is not
 * simply shown the same idea reworded. Each entry adds to the questions the generators already produce.
 */
export const kindergartenConceptVariants: ConceptVariantTable = {
  // Math
  "K.CC.B.4.a": [
    q("What number name do you say first when you count objects?", "one", "two", "ten", "Counting starts with the number name one."),
    q("You count 3 apples: one, two, three. Which number name goes with the last apple?", "three", "one", "four", "The last apple gets the last number name you say, which is three."),
    q("Why should you touch each object only one time when you count?", "so each object gets exactly one number name", "so you can count faster", "so you can skip some objects", "Pairing each object with one number name keeps the count correct.")
  ],
  "K.G.A.1": [
    q("A ball is next to a block. Which word means the same as next to?", "beside", "above", "behind", "Beside and next to both mean at the side of something."),
    q("A cat sits in front of a door. Where is the door compared to the cat?", "behind the cat", "above the cat", "in front of the cat", "If the cat is in front of the door, the door is behind the cat."),
    q("A window is shaped like a rectangle. Which shape name describes the window?", "rectangle", "circle", "triangle", "The window has four sides, two long and two short, so it is a rectangle.")
  ],
  "K.G.A.2": [
    q("A triangle is turned upside down. What shape is it now?", "a triangle", "a square", "a circle", "Turning a shape does not change its name."),
    q("There is a very big circle and a very small circle. What is true about them?", "both are circles", "only the big one is a circle", "neither is a circle", "A shape keeps its name no matter how big or small it is."),
    q("A square is tilted so it looks like a diamond. What is its name?", "square", "circle", "triangle", "A tilted square still has four equal sides and four corners, so it is still a square.")
  ],
  "K.G.A.3": [
    q("Which one is flat?", "a circle drawn on paper", "a ball", "a can", "A drawing on paper is flat. A ball and a can are solid."),
    q("A cube is a ___ shape.", "solid", "flat", "empty", "A cube takes up space, so it is a solid, three-dimensional shape."),
    q("Which real object is shaped like a solid cylinder?", "a can of soup", "a sheet of paper", "a stop sign", "A soup can is solid and round with flat circles on the ends, like a cylinder.")
  ],
  "K.G.B.4": [
    q("How many corners does a triangle have?", "3", "4", "0", "A triangle has three corners."),
    q("Which shape has no straight sides?", "circle", "square", "triangle", "A circle is one round line with no straight sides."),
    q("What is the same about a square and a rectangle?", "they both have 4 sides and 4 corners", "they both have 3 sides", "they both have no corners", "Squares and rectangles each have four sides and four corners.")
  ],
  "K.G.B.5": [
    q("To draw a triangle, what do you draw?", "three straight lines that connect", "one round line", "four straight lines", "A triangle is made of three straight sides that meet at corners."),
    q("Which things could you use to build a model of a rectangle?", "four sticks, two long and two short", "one long stick", "three round balls", "A rectangle has two long sides and two short sides."),
    q("You draw one curved line that closes up. What shape did you draw?", "a circle", "a square", "a triangle", "One closed curved line makes a circle.")
  ],
  "K.G.B.6": [
    q("Two half-circles are put together along their flat sides. What shape can they make?", "a circle", "a square", "a triangle", "Two matching half-circles make one whole circle."),
    q("Four same-size squares are put in 2 rows of 2. What bigger shape do they make?", "a bigger square", "a circle", "a triangle", "Two rows of two squares make a larger square."),
    q("Two same-size rectangles are put side by side with full sides touching. What can they make?", "a bigger rectangle", "a circle", "a triangle", "Joining two rectangles along a full side makes a larger rectangle.")
  ],
  "K.MD.A.1": [
    q("A watermelon is heavy. Which attribute are you describing?", "weight", "color", "taste", "Heavy tells how much something weighs."),
    q("Which words describe the length of a rope?", "long or short", "red or blue", "sweet or sour", "Long and short tell about length."),
    q("Which two things can you measure about a book?", "how long it is and how heavy it is", "its title and its author", "its story and its pictures", "Length and weight are things you can measure.")
  ],
  "K.MD.A.2": [
    q("A pencil is longer than a crayon. Which one is shorter?", "the crayon", "the pencil", "they are the same", "If the pencil is longer, the crayon is shorter."),
    q("A box is heavier than a book. Which one has more weight?", "the box", "the book", "they are the same", "Heavier means more weight."),
    q("Which weighs less, a feather or a rock?", "the feather", "the rock", "they weigh the same", "A feather is much lighter than a rock.")
  ],
  "K.MD.B.3": [
    q("You sort 5 cars and 2 trucks. Which group has more?", "the cars", "the trucks", "they are the same", "Five is more than two, so the cars group is bigger."),
    q("A basket has 3 red blocks, 4 blue blocks, and 1 green block. Which color has the fewest?", "green", "red", "blue", "One is less than three and four, so green has the fewest."),
    q("You sort 2 apples and 2 pears. What can you say?", "both groups have the same number", "apples have more", "pears have more", "Two apples and two pears are equal groups.")
  ],

  // Language
  "K.L.1.b": [
    q("Which word is an action word?", "jump", "table", "red", "Jump tells what someone does, so it is a verb."),
    q("Which word names a thing?", "chair", "run", "happy", "A chair is a thing, so the word chair is a noun."),
    q("The girl sings. Which word tells what the girl does?", "sings", "girl", "the", "Sings is the action in the sentence.")
  ],
  "K.L.1.c": [
    q("Which word means more than one box?", "boxes", "box", "boxed", "Words that end in x add -es to mean more than one."),
    q("One bird, two ___.", "birds", "bird", "birding", "Add -s to bird to mean more than one."),
    q("Which word means just one?", "dish", "dishes", "dishs", "Dish is one. Dishes means more than one.")
  ],
  "K.L.1.d": [
    q("___ is lunch? Which question word asks about time?", "When", "Who", "Where", "When asks about time."),
    q("Which question word asks why something happens?", "Why", "Where", "Who", "Why asks for a reason."),
    q("Which question word asks how something is done?", "How", "Who", "When", "How asks about the way something is done.")
  ],
  "K.L.1.e": [
    q("The cat jumped ___ the box. Which word tells where it went?", "in", "happy", "eat", "In is a word that shows where the cat went."),
    q("The book is ___ the shelf. Which word fits best?", "on", "run", "blue", "On tells where the book is."),
    q("The ball fell ___ the table. Which word fits best?", "off", "red", "sing", "Off tells which way the ball moved.")
  ],
  "K.L.2.a": [
    q("Which word must always be a capital letter?", "I", "am", "happy", "The word I is always written as a capital letter."),
    q("Which word needs a capital letter? the dog ran.", "the", "dog", "ran", "The first word in a sentence starts with a capital letter."),
    q("Which sentence starts with a capital letter?", "We like to play.", "go to the park.", "play with us.", "A sentence begins with a capital letter.")
  ],
  "K.L.2.b": [
    q("Which mark ends an excited sentence? We won___", "!", "?", ",", "An exclamation point shows excitement."),
    q("What is this mark called: ?", "question mark", "period", "comma", "A question mark ends a question."),
    q("What is this mark called: .", "period", "question mark", "exclamation point", "A period ends a telling sentence.")
  ],
  "K.L.2.c": [
    q("Which letter makes the /t/ sound at the start of top?", "t", "b", "p", "The letter t makes the /t/ sound."),
    q("Which letter spells the short sound /a/ in cat?", "a", "e", "o", "The middle sound in cat is spelled with a."),
    q("Which letter spells the last sound in dog?", "g", "d", "b", "Dog ends with the /g/ sound, spelled g.")
  ],
  "K.L.2.d": [
    q("Which spelling matches the word pig?", "pig", "peg", "pog", "The sounds /p/ /i/ /g/ are spelled p, i, g."),
    q("Which spelling matches the sounds /b/ /e/ /d/?", "bed", "bad", "bid", "The middle sound /e/ is spelled with e."),
    q("Which spelling matches the sounds /h/ /o/ /t/?", "hot", "hut", "hat", "The middle sound /o/ is spelled with o.")
  ],
  "K.L.4.a": [
    q("In \"Duck! A ball is coming,\" what does duck mean?", "bend down quickly", "a bird that quacks", "a kind of food", "Here duck is an action. It means to bend down."),
    q("In \"He swings the bat,\" what is a bat?", "a stick used to hit a ball", "a flying animal", "a kind of shoe", "Bat can be an animal, but here it is the stick used in baseball."),
    q("In \"Dad will park the car,\" what does park mean?", "to leave the car in a spot", "to play on a slide", "to eat lunch", "Here park is an action. It means to stop and leave a car.")
  ],
  "K.L.4.b": [
    q("What does the ending -s tell you in the word cats?", "more than one", "only one", "none", "Adding -s to cat means more than one cat."),
    q("What does the ending -ful mean in joyful?", "full of joy", "without joy", "joy again", "The ending -ful means full of."),
    q("What does the ending -less mean in helpless?", "without help", "full of help", "help again", "The ending -less means without.")
  ],
  "K.L.5.a": [
    q("Which one does not belong in the group: apple, banana, chair?", "chair", "apple", "banana", "Apples and bananas are fruit. A chair is not."),
    q("Which group name fits: dog, cat, horse?", "animals", "foods", "clothes", "Dogs, cats, and horses are all animals."),
    q("Which group name fits: shirt, pants, socks?", "clothes", "toys", "fruits", "Shirts, pants, and socks are all things we wear.")
  ],
  "K.L.5.b": [
    q("What is the opposite of hot?", "cold", "sunny", "red", "Cold is the opposite of hot."),
    q("What is the opposite of up?", "down", "over", "top", "Down is the opposite of up."),
    q("What is the opposite of open?", "shut", "wide", "tall", "Shut is the opposite of open.")
  ],
  "K.L.5.c": [
    q("Where at school would you find books to borrow?", "the library", "the playground", "the bus", "A library is the place with books to borrow."),
    q("Which place at school is where you eat lunch?", "the cafeteria", "the library", "the nurse's office", "Students eat lunch in the cafeteria."),
    q("Which thing would you use on a rainy day?", "an umbrella", "sunglasses", "sandals", "An umbrella keeps you dry in the rain.")
  ],
  "K.L.5.d": [
    q("Which word shows a faster way to move than walk?", "run", "crawl", "sit", "Running is faster than walking."),
    q("Which is a quiet way to talk?", "whisper", "shout", "yell", "Whisper means to talk very softly."),
    q("Which word means to speak very loudly?", "shout", "whisper", "hum", "Shout means to speak in a loud voice.")
  ],
  "K.L.6": [
    q("Which word names a feeling?", "happy", "table", "run", "Happy tells how someone feels."),
    q("Which word names a shape?", "circle", "purple", "seven", "A circle is a shape."),
    q("Which word names a day of the week?", "Monday", "April", "winter", "Monday is a day of the week.")
  ],

  // Foundational reading
  "K.RF.1.a": [
    q("Where do you start reading on a page?", "at the top left", "at the bottom right", "in the middle", "We start at the top left and read toward the right."),
    q("You finish a line. Where do your eyes go next?", "to the start of the next line down", "back up to the line above", "to the next page", "After a line ends, we go down to the left side of the next line."),
    q("How do you turn the pages of a story?", "from the front of the book to the back", "from the back to the front", "in any order", "We read page by page from the front.")
  ],
  "K.RF.1.b": [
    q("The letters c-a-t spell which spoken word?", "cat", "cap", "car", "The letters c, a, and t in order spell cat."),
    q("You say the word sun. How can you write it?", "with the letters s-u-n", "with the letters m-o-o-n", "with a number", "Every spoken word can be written with letters."),
    q("Which letters, in order, spell top?", "t-o-p", "p-o-t", "o-t-p", "The order of the letters matters. Top is t, o, p.")
  ],
  "K.RF.1.c": [
    q("What separates one word from the next in a sentence?", "a space", "a number", "a picture", "Spaces show where one word ends and the next begins."),
    q("How many words are in this sentence? I see a dog.", "4", "3", "5", "The words are I, see, a, and dog."),
    q("Which one has the right spaces between words?", "The cat sat.", "Thecat sat.", "The catsat.", "Each word needs a space on both sides.")
  ],
  "K.RF.2.b": [
    q("How many syllables, or claps, are in banana?", "3", "2", "1", "Ba-na-na has three parts."),
    q("How many syllables, or claps, are in dog?", "1", "2", "3", "Dog has one part."),
    q("Which word has 2 syllables?", "apple", "cat", "banana", "Ap-ple has two parts.")
  ],
  "K.RF.2.c": [
    q("Blend /c/ with the ending chunk -at. What word do you make?", "cat", "cup", "cot", "/c/ and -at make cat."),
    q("The word sun can be split into a beginning sound and an ending chunk. What is the ending chunk?", "-un", "-an", "-up", "Sun is /s/ and -un."),
    q("Blend /h/ with the ending chunk -op. What word do you make?", "hop", "hip", "top", "/h/ and -op make hop.")
  ],
  "K.RF.2.e": [
    q("Change the last sound in cat from /t/ to /p/. What word do you make?", "cap", "cut", "mat", "Cat becomes cap when the ending sound changes to /p/."),
    q("Add /s/ to the front of top. What word do you make?", "stop", "tops", "pot", "Adding /s/ before top makes stop."),
    q("Change the middle sound in hat from /a/ to /i/. What word do you make?", "hit", "hot", "hut", "Hat becomes hit when the middle sound changes to /i/.")
  ],
  "K.RF.3.a": [
    q("Which letter makes the /b/ sound?", "b", "d", "p", "The letter b makes the /b/ sound."),
    q("Which word starts with the /t/ sound?", "tiger", "lion", "bear", "Tiger starts with the /t/ sound."),
    q("What sound does the letter l make?", "/l/", "/r/", "/w/", "The letter l makes the /l/ sound.")
  ],
  "K.RF.3.b": [
    q("Which word has the short a sound, like cat?", "bag", "bug", "bog", "Bag has the short a sound."),
    q("Which letter spells the short sound in pot?", "o", "a", "u", "The middle sound in pot is spelled with o."),
    q("Which word has the long a sound, like cake?", "make", "mat", "map", "Make has the long a sound.")
  ],
  "K.RF.3.c": [
    q("Which word says the?", "the", "then", "she", "The word the is a sight word to know by heart."),
    q("Which word says is?", "is", "in", "it", "The word is is a sight word."),
    q("Which word says to?", "to", "do", "so", "The word to is a sight word.")
  ],
  "K.RF.3.d": [
    q("Hat and hot are spelled almost the same. Which letter is different?", "the middle letter", "the first letter", "the last letter", "Hat and hot differ in the middle letter, a and o."),
    q("Bat and bag are spelled almost the same. Which letter is different?", "the last letter", "the first letter", "the middle letter", "Bat and bag differ in the last letter, t and g."),
    q("Which word is different from the others: cat, cat, cap?", "cap", "cat", "none of them", "Cap ends with p, but the other two end with t.")
  ],

  // Informational text
  "K.RI.1": [
    q("Read: Ants carry food to their home. What do ants carry?", "food", "sticks", "toys", "The text says ants carry food."),
    q("Read: A whale is big and lives in the sea. Where does a whale live?", "in the sea", "in a tree", "in a desert", "The text says a whale lives in the sea."),
    q("Read: The sun gives us light and heat. What does the sun give us?", "light and heat", "snow and ice", "wind and rain", "The text says the sun gives light and heat.")
  ],
  "K.RI.2": [
    q("Read: Bees make honey. Bees live in hives. Bees can fly. What is this text mostly about?", "bees", "trees", "cars", "Every sentence tells about bees."),
    q("Read: Rain falls from clouds. Rain helps plants grow. Rain fills puddles. What is this text mostly about?", "rain", "snow", "sleeping", "Every sentence tells about rain."),
    q("Read: Cows give milk. Cows eat grass. Which is a detail about cows?", "they eat grass", "they drive cars", "they live in water", "The text says cows eat grass.")
  ],
  "K.RI.3": [
    q("Read: Plants need water. Without water, plants dry up. What happens to a plant without water?", "it dries up", "it sings", "it grows faster", "The text connects no water to drying up."),
    q("Read: Ice melts when it gets warm. What makes ice melt?", "getting warm", "getting cold", "a song", "The text says ice melts when it gets warm."),
    q("Read: A frog and a toad both hop. How are they the same?", "they both hop", "they both fly", "they both read", "The text says both animals hop.")
  ],
  "K.RI.4": [
    q("Read: The cave was dark, so Ben used a flashlight. What does dark mean?", "no light", "very loud", "very hot", "Ben needed a flashlight, so dark means there was no light."),
    q("You read a word you do not know. What can you do?", "ask a question or look at the picture", "skip the whole book", "close your eyes", "Questions and pictures can help you find a word's meaning."),
    q("Read: The kite soared high. The picture shows a kite far up in the sky. What does soared mean?", "flew high", "fell down", "sat still", "The picture shows the kite flying high.")
  ],
  "K.RI.5": [
    q("The front cover shows the title and a picture. Where is the front cover?", "on the front of the book", "on the back of the book", "after the last page", "The front cover is the outside front of a book."),
    q("Which part of a book is on the back of the book?", "the back cover", "the front cover", "the title page", "The back cover is on the outside back."),
    q("Which page is inside the book and shows the title and author again?", "the title page", "the back cover", "the last page", "The title page is inside the book near the front.")
  ],
  "K.RI.6": [
    q("Who is the author of a book?", "the person who wrote the words", "the person who draws the pictures", "the person who reads it", "An author writes the words."),
    q("What does an illustrator do?", "draws the pictures", "writes the words", "prints the book", "An illustrator makes the pictures."),
    q("A book has words by Lee and pictures by Sam. Who is the illustrator?", "Sam", "Lee", "the reader", "Sam made the pictures, so Sam is the illustrator.")
  ],
  "K.RI.7": [
    q("Read: A cow eats grass. The picture shows a cow in a green field. What does the picture show?", "where the cow is", "what time it is", "a new animal", "The picture shows the green field where the cow eats."),
    q("Read: A seed grows. The picture shows a tiny sprout coming up. What does the picture show?", "the seed starting to grow", "a big tree", "a car", "The sprout shows the seed growing."),
    q("A text says a camel has a hump. Which picture matches?", "a camel with a hump", "a camel without a hump", "a horse with a saddle", "The picture should show the hump the text tells about.")
  ],
  "K.RI.8": [
    q("Read: We eat vegetables because they help us grow strong. Why do we eat vegetables?", "they help us grow strong", "they are loud", "they are toys", "The text gives the reason: vegetables help us grow strong."),
    q("Read: We brush our teeth so they stay clean. What reason does the author give?", "so teeth stay clean", "so teeth fall out", "so we can sleep", "The author says we brush so teeth stay clean."),
    q("Read: Bikes are fun because you can ride fast and feel the wind. Which is a reason?", "you can ride fast and feel the wind", "bikes are blue", "bikes cost money", "That is the reason the author gives for bikes being fun.")
  ],
  "K.RI.9": [
    q("Book A shows a cat sleeping. Book B shows a cat running. How are the books different?", "one cat sleeps and one runs", "one is about a dog", "both cats sleep", "The books show the cat doing different things."),
    q("Book A says bees make honey. Book B says bees live in hives. What is the topic of both books?", "bees", "cows", "fish", "Both books are about bees."),
    q("Two books are about the moon. One has photos and one has drawings. What is different?", "the kind of pictures", "what they are about", "the moon", "Both are about the moon. Only the pictures are different.")
  ],

  // Literature
  "K.RL.1": [
    q("Read: Zed rode his red bike to the park. What color was Zed's bike?", "red", "blue", "green", "The story says it was a red bike."),
    q("Read: Lily fed the fish at noon. Who fed the fish?", "Lily", "Zed", "Dad", "The story says Lily fed the fish."),
    q("Read: The puppy hid under the bed because it heard thunder. Why did the puppy hide?", "it heard thunder", "it was hungry", "it saw a cat", "The story gives the reason: the puppy heard thunder.")
  ],
  "K.RL.2": [
    q("Read: Ben put on his coat. Then he went outside. What did Ben do first?", "put on his coat", "went outside", "ate lunch", "Ben put on his coat before he went outside."),
    q("Read: A hen laid an egg. The egg cracked. A chick came out. What came out at the end?", "a chick", "a hen", "a duck", "The story ends with a chick coming out."),
    q("Which is the best retelling of: A boy lost his kite. He found it in a tree.", "A boy lost his kite and found it in a tree.", "A boy ate a pie.", "A girl lost her hat.", "A retelling tells the main events in order.")
  ],
  "K.RL.3": [
    q("Read: Tom and Ann made a cake. Who is in the story?", "Tom and Ann", "Sam and Pat", "Mom and Zoe", "The characters are Tom and Ann."),
    q("Read: At night, Mia looked at the moon from her bed. When does the story happen?", "at night", "in the morning", "at lunch", "The story says it is night."),
    q("Read: A fox chased a rabbit, but the rabbit ran into a hole. What big thing happened?", "the rabbit hid in a hole", "the fox took a nap", "the rabbit flew", "The rabbit escaped by running into a hole.")
  ],
  "K.RL.4": [
    q("Read: The room was silent. No one made a sound. What does silent mean?", "no sound", "very loud", "very bright", "No one made a sound, so silent means quiet."),
    q("Read: Max was thrilled. He jumped up and down and cheered. What does thrilled mean?", "very happy", "sleepy", "sad", "Jumping and cheering show he was very happy."),
    q("Read: The puppy was tiny. It fit in one hand. What does tiny mean?", "very small", "very big", "very fast", "Fitting in one hand means very small.")
  ],
  "K.RL.5": [
    q("Which kind of book has short lines that often rhyme?", "a poem", "a calendar", "a recipe", "Poems often use short rhyming lines."),
    q("Which book gives facts about real sharks?", "an information book", "a make-believe story", "a poem about a dancing fish", "A book of facts about real things is an information book."),
    q("Which kind of text tells about characters and what happens to them?", "a story", "a sign", "a list", "A story has characters and events.")
  ],
  "K.RL.6": [
    q("Who tells the story with words?", "the author", "the illustrator", "the printer", "The author writes the words of the story."),
    q("Who shows the story with pictures?", "the illustrator", "the author", "the teacher", "The illustrator draws the pictures."),
    q("A storybook has words by Jo and pictures by Kim. Who is the author?", "Jo", "Kim", "the reader", "Jo wrote the words, so Jo is the author.")
  ],
  "K.RL.7": [
    q("Read: Pam felt scared. The picture shows Pam hiding under a blanket. What does the picture show?", "how Pam feels", "where lunch is", "a new character", "Hiding under a blanket shows Pam is scared."),
    q("Read: The bear walked into the cave. Which picture matches?", "a bear going into a cave", "a bear in a boat", "a fish in a tree", "The picture should match the story."),
    q("A picture shows a girl with a big smile holding a trophy. What does the picture tell you about the girl?", "she is happy", "she is cold", "she is lost", "A big smile and a trophy show she is happy.")
  ],
  "K.RL.9": [
    q("In one story a girl finds a lost puppy. In another a boy finds a lost kitten. How are the stories alike?", "someone finds a lost pet", "both are about lunch", "both are about flying", "In both stories, a child finds a lost pet."),
    q("In one story a bear goes to the beach. In another a bear goes to the snow. How are the stories different?", "where the bear goes", "the animal", "the bears' names", "The animal is the same, but the places are different."),
    q("In one story Pip is brave. In another Ben is shy. How are Pip and Ben different?", "Pip is brave and Ben is shy", "both are brave", "both are shy", "One character is brave and the other is shy.")
  ]
};
