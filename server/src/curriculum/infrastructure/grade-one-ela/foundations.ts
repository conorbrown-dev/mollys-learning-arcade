import { buildWordItem as build, choiceItem as q, orderPartsItem as parts, type LessonSkillSpec } from "../lesson-activity-builder";

/**
 * Grade 1 reading foundations: phonological awareness, phonics and word
 * reading, and sentence features (1.RF.*).
 *
 * Sound work is carried entirely by narration, so a learner listens to the
 * tutor instead of handling letter cards or sound counters.
 */

const PHONICS_SCOPE = "ela.scope.grade-1.phonics";

export const GRADE_ONE_FOUNDATION_SPECS: readonly LessonSkillSpec[] = [
  {
    skillId: "ela.g1.rf.2.a.vowel-sounds",
    recipeId: "ela.auditory-contrast.v1",
    evidenceMode: "SPOKEN_ONLY",
    conceptDomain: "vowel-sound",
    misconception: "VOWEL_CONTRAST_CONFUSION",
    instruction: {
      prompt: "Every word has a vowel sound. A short vowel is quick. A long vowel says its own letter name.",
      narration: "Every word has a vowel sound. A short vowel is quick, like the a in cat. A long vowel says its own letter name, like the a in cake. Listen for the middle of the word.",
      tutorMessage: "Listen to the middle of the word.",
      displayTokens: ["cat", "cake"],
    },
    model: {
      prompt: "Listen: cat has short a. Cake has long a.",
      narration: "Cat. The middle sound is a quick short a. Cake. The middle sound says its name, long a. The vowel is the part that changes.",
      tutorMessage: "I say the word slowly and listen to the middle.",
      modelText: "cat · cake",
      displayTokens: ["short a", "long a"],
    },
    guided: [
      q("vs-g1", "What vowel sound do you hear in bike?", "long i", ["long i", "short i"], "Bike says the letter name i, so it is long i.", "Listen. Bike. What vowel sound do you hear?"),
      q("vs-g2", "What vowel sound do you hear in pot?", "short o", ["short o", "long o"], "Pot has a quick o, so it is short o.", "Listen. Pot. What vowel sound do you hear?"),
    ],
    independent: [
      q("vs-i1", "What vowel sound do you hear in home?", "long o", ["long o", "short o"], "Home says the letter name o, so it is long o.", "Listen. Home. What vowel sound do you hear?"),
      q("vs-i2", "What vowel sound do you hear in net?", "short e", ["short e", "long e"], "Net has a quick e, so it is short e.", "Listen. Net. What vowel sound do you hear?"),
      q("vs-i3", "Which word has a long vowel sound?", "five", ["five", "fin"], "Five says the letter name i. Fin has a quick short i.", "Listen. Five. Fin. Which word has a long vowel sound?"),
    ],
    mastery: [
      q("vs-m1", "What vowel sound do you hear in cute?", "long u", ["long u", "short u"], "Cute says the letter name u, so it is long u.", "Listen. Cute. What vowel sound do you hear?"),
      q("vs-m2", "Which word has a short vowel sound?", "hop", ["hop", "hope"], "Hop has a quick o. Hope says the letter name o.", "Listen. Hop. Hope. Which word has a short vowel sound?"),
      q("vs-m3", "What vowel sound do you hear in tape?", "long a", ["long a", "short a"], "Tape says the letter name a, so it is long a.", "Listen. Tape. What vowel sound do you hear?"),
    ],
  },
  {
    skillId: "ela.g1.rf.2.c.isolate-phonemes",
    recipeId: "ela.auditory-contrast.v1",
    evidenceMode: "SPOKEN_ONLY",
    conceptDomain: "phoneme-position",
    misconception: "SOUND_POSITION_CONFUSION",
    instruction: {
      prompt: "Words have a first sound, a middle sound, and a last sound.",
      narration: "Words have a first sound, a middle sound, and a last sound. In the word map, the first sound is mmm, the middle sound is short a, and the last sound is p.",
      tutorMessage: "Say the word slowly and hold each sound.",
      displayTokens: ["first", "middle", "last"],
    },
    model: {
      prompt: "Listen: m - a - p. The last sound in map is /p/.",
      narration: "Map. Mmm. Aaa. P. The first sound is mmm. The middle sound is short a. The last sound is p.",
      tutorMessage: "I stretch the word and listen for the part I need.",
      modelText: "m · a · p",
    },
    guided: [
      q("ip-g1", "What is the last sound in fish?", "/sh/", ["/sh/", "/f/"], "Fish ends with the /sh/ sound.", "Listen. Fish. What is the last sound?"),
      q("ip-g2", "What is the middle sound in bed?", "/e/", ["/e/", "/b/"], "Bed has short e in the middle.", "Listen. Bed. What is the middle sound?"),
    ],
    independent: [
      q("ip-i1", "What is the first sound in trap?", "/t/", ["/t/", "/r/"], "Trap begins with the /t/ sound, then /r/ follows it.", "Listen. Trap. What is the first sound?"),
      q("ip-i2", "What is the last sound in drum?", "/m/", ["/m/", "/d/"], "Drum ends with the /m/ sound.", "Listen. Drum. What is the last sound?"),
      q("ip-i3", "What is the middle sound in sun?", "/u/", ["/u/", "/n/"], "Sun has short u in the middle.", "Listen. Sun. What is the middle sound?"),
    ],
    mastery: [
      q("ip-m1", "What is the last sound in flag?", "/g/", ["/g/", "/f/"], "Flag ends with the /g/ sound.", "Listen. Flag. What is the last sound?"),
      q("ip-m2", "What is the first sound in ship?", "/sh/", ["/sh/", "/p/"], "Ship begins with the /sh/ sound.", "Listen. Ship. What is the first sound?"),
      q("ip-m3", "What is the middle sound in hot?", "/o/", ["/o/", "/t/"], "Hot has short o in the middle.", "Listen. Hot. What is the middle sound?"),
    ],
  },
  {
    skillId: "ela.g1.rf.2.b.blending",
    recipeId: "ela.phoneme-sequence.v1",
    evidenceMode: "SPOKEN_ONLY",
    conceptDomain: "blended-word",
    misconception: "ORDER_REVERSAL",
    instruction: {
      prompt: "When you push sounds together in order, they make a word.",
      narration: "When you push sounds together in order, they make a word. Listen. Fff. Iii. Shh. Those sounds blend into fish.",
      tutorMessage: "Keep the sounds in the order you hear them.",
      displayTokens: ["/f/", "/i/", "/sh/"],
    },
    model: {
      prompt: "Listen: /f/ /i/ /sh/ blends into fish.",
      narration: "Fff. Iii. Shh. I say them faster and closer together. Fish. The order stays the same from the first sound to the last.",
      tutorMessage: "I blend from left to right without stopping.",
      modelText: "/f/ /i/ /sh/ = fish",
    },
    guided: [
      q("bl-g1", "Blend these sounds: /s/ /t/ /o/ /p/. What word do they make?", "stop", ["stop", "pots"], "Those sounds in that order make stop.", "Listen. Sss.T. Ooo. P. What word do they make?"),
      q("bl-g2", "Blend these sounds: /f/ /r/ /o/ /g/. What word do they make?", "frog", ["frog", "fog"], "All four sounds blend to make frog.", "Listen. Fff. Rrr. Ooo. G. What word do they make?"),
    ],
    independent: [
      q("bl-i1", "Blend these sounds: /s/ /w/ /i/ /m/. What word do they make?", "swim", ["swim", "slim"], "Those sounds blend to make swim.", "Listen. Sss. Www. Iii. Mmm. What word do they make?"),
      q("bl-i2", "Blend these sounds: /h/ /a/ /n/ /d/. What word do they make?", "hand", ["hand", "had"], "Hand has all four sounds, including the /n/.", "Listen. H. Aaa. Nnn. D. What word do they make?"),
      q("bl-i3", "Blend these sounds: /ch/ /i/ /p/. What word do they make?", "chip", ["chip", "ship"], "The first sound is /ch/, so the word is chip.", "Listen. Ch. Iii. P. What word do they make?"),
    ],
    mastery: [
      q("bl-m1", "Blend these sounds: /b/ /e/ /s/ /t/. What word do they make?", "best", ["best", "bets"], "Those sounds in that order make best.", "Listen. B. Eee. Sss. T. What word do they make?"),
      q("bl-m2", "Blend these sounds: /c/ /l/ /a/ /p/. What word do they make?", "clap", ["clap", "cap"], "Clap keeps the /l/ right after the /c/.", "Listen. C. Lll. Aaa. P. What word do they make?"),
      q("bl-m3", "Blend these sounds: /m/ /i/ /l/ /k/. What word do they make?", "milk", ["milk", "mild"], "Those sounds blend to make milk.", "Listen. Mmm. Iii. Lll. K. What word do they make?"),
    ],
  },
  {
    skillId: "ela.g1.rf.2.d.segment-phonemes",
    recipeId: "ela.phoneme-sequence.v1",
    evidenceMode: "SPOKEN_ONLY",
    conceptDomain: "sound-sequence",
    misconception: "OMITTED_PHONEME",
    instruction: {
      prompt: "You can stretch a word out and name every sound in order.",
      narration: "You can stretch a word out and name every sound in order. Fish stretches into fff, iii, shh. That is three sounds.",
      tutorMessage: "Do not skip the quiet sounds in the middle.",
      displayTokens: ["fish", "= 3 sounds"],
    },
    model: {
      prompt: "Fish stretches into /f/ /i/ /sh/, so it has three sounds.",
      narration: "Fish. Fff. Iii. Shh. One, two, three. The letters s and h work together, so they make one sound.",
      tutorMessage: "I count sounds, not letters.",
      modelText: "f · i · sh",
    },
    guided: [
      q("sg-g1", "How many sounds are in the word stop?", "4", ["4", "3"], "Stop has /s/ /t/ /o/ /p/, which is four sounds.", "Listen. Stop. How many sounds do you hear?"),
      q("sg-g2", "Which sounds do you hear in chin, in order?", "/ch/ /i/ /n/", ["/ch/ /i/ /n/", "/c/ /h/ /i/ /n/"], "The letters c and h make one sound together, so chin has three sounds.", "Listen. Chin. Which sounds do you hear, in order?"),
    ],
    independent: [
      q("sg-i1", "How many sounds are in the word flag?", "4", ["4", "3"], "Flag has /f/ /l/ /a/ /g/, which is four sounds.", "Listen. Flag. How many sounds do you hear?"),
      q("sg-i2", "Which sounds do you hear in shop, in order?", "/sh/ /o/ /p/", ["/sh/ /o/ /p/", "/s/ /h/ /o/ /p/"], "The letters s and h make one sound, so shop has three sounds.", "Listen. Shop. Which sounds do you hear, in order?"),
      q("sg-i3", "How many sounds are in the word hand?", "4", ["4", "3"], "Hand has /h/ /a/ /n/ /d/. The /n/ is easy to miss.", "Listen. Hand. How many sounds do you hear?"),
    ],
    mastery: [
      q("sg-m1", "How many sounds are in the word swim?", "4", ["4", "3"], "Swim has /s/ /w/ /i/ /m/, which is four sounds.", "Listen. Swim. How many sounds do you hear?"),
      q("sg-m2", "Which sounds do you hear in path, in order?", "/p/ /a/ /th/", ["/p/ /a/ /th/", "/p/ /a/ /t/ /h/"], "The letters t and h make one sound together.", "Listen. Path. Which sounds do you hear, in order?"),
      q("sg-m3", "How many sounds are in the word milk?", "4", ["4", "3"], "Milk has /m/ /i/ /l/ /k/, which is four sounds.", "Listen. Milk. How many sounds do you hear?"),
    ],
  },
  {
    skillId: "ela.g1.rf.3.a.digraphs",
    recipeId: "ela.symbol-sound.v1",
    evidenceMode: "VISUAL_PRINT_WITH_NARRATED_DIRECTIONS",
    conceptDomain: "digraph-spelling",
    misconception: "GRAPHEME_SOUND_CONFUSION",
    contentScopeId: PHONICS_SCOPE,
    instruction: {
      prompt: "Sometimes two letters team up and make just one sound.",
      narration: "Sometimes two letters team up and make just one sound. The letters s and h together say shh. The letters c and h together say ch. The letters t and h together say th.",
      tutorMessage: "Two letters, one sound.",
      displayTokens: ["sh", "ch", "th", "wh"],
    },
    model: {
      prompt: "In ship, the letters s and h make one sound: /sh/.",
      narration: "Ship. I do not say s and then h. The team s h says shh. Shh. Iii. P. Ship.",
      tutorMessage: "I look for the letter team before I sound out.",
      modelText: "sh · i · p",
    },
    guided: [
      q("dg-g1", "Which letters spell the first sound in chop?", "ch", ["ch", "sh"], "The letters c and h spell the /ch/ sound in chop."),
      q("dg-g2", "Which word begins with the /sh/ sound?", "shed", ["shed", "sled"], "Shed starts with the letter team s h."),
    ],
    independent: [
      q("dg-i1", "Which letters spell the last sound in bath?", "th", ["th", "ch"], "The letters t and h spell the /th/ sound at the end of bath."),
      q("dg-i2", "Which word has a letter team that makes one sound?", "fish", ["fish", "flat"], "In fish the letters s and h make one sound. Flat has two separate sounds, /f/ and /l/."),
      q("dg-i3", "Which letters spell the first sound in when?", "wh", ["wh", "th"], "The letters w and h spell the sound at the start of when."),
    ],
    mastery: [
      q("dg-m1", "Which letters spell the first sound in thin?", "th", ["th", "sh"], "The letters t and h spell the /th/ sound in thin."),
      q("dg-m2", "Which word begins with the /ch/ sound?", "chin", ["chin", "shin"], "Chin starts with the letter team c h."),
      q("dg-m3", "Which word ends with a letter team that makes one sound?", "wish", ["wish", "wind"], "Wish ends with s h, which says shh. Wind ends with two separate sounds."),
    ],
  },
  {
    skillId: "ela.g1.rf.3.b.one-syllable-decode",
    recipeId: "ela.word-mapping.v1",
    evidenceMode: "VISUAL_PRINT_WITH_NARRATED_DIRECTIONS",
    independentEvidenceMode: "INDEPENDENT_READING",
    conceptDomain: "one-syllable-word",
    misconception: "GRAPHEME_SOUND_CONFUSION",
    contentScopeId: PHONICS_SCOPE,
    instruction: {
      prompt: "To read a word, say each letter's sound from left to right, then blend them.",
      narration: "To read a word, say each letter's sound from left to right, then blend them together. Letter teams count as one sound.",
      tutorMessage: "Left to right, then blend.",
      displayTokens: ["f", "l", "a", "g"],
    },
    model: {
      prompt: "Read flag: /f/ /l/ /a/ /g/ blends into flag.",
      narration: "Fff. Lll. Aaa. G. Now faster. Flag. I kept every sound and I did not skip the l.",
      tutorMessage: "I touch each letter as I say its sound.",
      modelText: "f · l · a · g",
    },
    guided: [
      q("od-g1", "Read this word: stop. Which word is it?", "stop", ["stop", "top"], "Stop begins with /s/ and then /t/. Top has no /s/."),
      build("od-g2", "Put the letters in order to spell the word drum.", "drum", ["m", "d", "u", "r"], "The sounds /d/ /r/ /u/ /m/ spell drum.", "Spell the word drum. Put the letters in order."),
    ],
    independent: [
      q("od-i1", "Read this word: crab. Which word is it?", "crab", ["crab", "cab"], "Crab has an /r/ right after the /c/."),
      build("od-i2", "Put the letters in order to spell the word pond.", "pond", ["n", "p", "d", "o"], "The sounds /p/ /o/ /n/ /d/ spell pond.", "Spell the word pond. Put the letters in order."),
      q("od-i3", "Which word says /s/ /w/ /i/ /m/?", "swim", ["swim", "slim"], "The second sound is /w/, so the word is swim."),
    ],
    mastery: [
      q("od-m1", "Read this word: trap. Which word is it?", "trap", ["trap", "tap"], "Trap has an /r/ right after the /t/."),
      build("od-m2", "Put the letters in order to spell the word nest.", "nest", ["s", "e", "n", "t"], "The sounds /n/ /e/ /s/ /t/ spell nest.", "Spell the word nest. Put the letters in order."),
      q("od-m3", "Which word says /m/ /i/ /l/ /k/?", "milk", ["milk", "mild"], "The last sound is /k/, so the word is milk."),
    ],
  },
  {
    skillId: "ela.g1.rf.3.c.long-vowels",
    recipeId: "ela.symbol-sound.v1",
    evidenceMode: "VISUAL_PRINT_WITH_NARRATED_DIRECTIONS",
    independentEvidenceMode: "INDEPENDENT_READING",
    conceptDomain: "silent-e-word",
    misconception: "VOWEL_CONTRAST_CONFUSION",
    contentScopeId: PHONICS_SCOPE,
    instruction: {
      prompt: "An e on the end is usually silent, and it makes the vowel before it say its name.",
      narration: "An e on the end of a word is usually silent. It makes the vowel before it say its own name. Hop has a quick short o. Add an e and it becomes hope, with a long o.",
      tutorMessage: "The last e is silent, but it changes the vowel.",
      displayTokens: ["hop", "hope"],
    },
    model: {
      prompt: "Add e to hop and it becomes hope.",
      narration: "Hop. Short o. Now I add a silent e on the end. Hope. The o says its name. The e itself stays quiet.",
      tutorMessage: "I check the end of the word before I say the vowel.",
      modelText: "hop → hope",
    },
    guided: [
      q("lv-g1", "Read this word: cake. What vowel sound does it have?", "long a", ["long a", "short a"], "The silent e makes the a say its name."),
      q("lv-g2", "Which word has a silent e that makes the vowel long?", "bike", ["bike", "big"], "Bike ends in a silent e, so the i says its name."),
    ],
    independent: [
      q("lv-i1", "Read this word: note. What vowel sound does it have?", "long o", ["long o", "short o"], "The silent e makes the o say its name."),
      q("lv-i2", "Which word says its vowel name?", "five", ["five", "fin"], "Five ends in a silent e, so the i is long."),
      q("lv-i3", "What happens when you add e to the end of tap?", "It becomes tape.", ["It becomes tape.", "It stays tap."], "The silent e makes the a long, so tap becomes tape."),
    ],
    mastery: [
      q("lv-m1", "Read this word: cute. What vowel sound does it have?", "long u", ["long u", "short u"], "The silent e makes the u say its name."),
      q("lv-m2", "Which word has a short vowel?", "rip", ["rip", "ripe"], "Rip has no silent e, so the i is short."),
      q("lv-m3", "What happens when you add e to the end of pin?", "It becomes pine.", ["It becomes pine.", "It stays pin."], "The silent e makes the i long, so pin becomes pine."),
    ],
  },
  {
    skillId: "ela.g1.rf.3.d.syllables",
    recipeId: "ela.auditory-contrast.v1",
    evidenceMode: "SPOKEN_ONLY",
    conceptDomain: "syllable-count",
    misconception: "OMITTED_PHONEME",
    instruction: {
      prompt: "Every syllable has one vowel sound. Count the vowel sounds to count the syllables.",
      narration: "Every syllable has exactly one vowel sound. If you can hear two vowel sounds, the word has two syllables. Nap has one. Nap kin has two.",
      tutorMessage: "One vowel sound means one syllable.",
      displayTokens: ["nap", "nap·kin"],
    },
    model: {
      prompt: "Napkin has two vowel sounds, so it has two syllables.",
      narration: "Nap. Kin. I hear a vowel sound in nap and another vowel sound in kin. Two vowel sounds, two syllables.",
      tutorMessage: "I say the word in chunks and listen for vowels.",
      modelText: "nap · kin = 2",
    },
    guided: [
      q("sy-g1", "How many syllables are in rabbit?", "2", ["2", "1"], "Rab bit has two vowel sounds, so it has two syllables.", "Listen. Rabbit. How many syllables do you hear?"),
      q("sy-g2", "How many syllables are in jump?", "1", ["1", "2"], "Jump has only one vowel sound, so it is one syllable.", "Listen. Jump. How many syllables do you hear?"),
    ],
    independent: [
      q("sy-i1", "How many syllables are in picnic?", "2", ["2", "1"], "Pic nic has two vowel sounds.", "Listen. Picnic. How many syllables do you hear?"),
      q("sy-i2", "How many syllables are in flag?", "1", ["1", "2"], "Flag has one vowel sound, so it is one syllable.", "Listen. Flag. How many syllables do you hear?"),
      q("sy-i3", "Which word has two syllables?", "sunset", ["sunset", "stand"], "Sun set has two vowel sounds. Stand has only one.", "Listen. Sunset. Stand. Which word has two syllables?"),
    ],
    mastery: [
      q("sy-m1", "How many syllables are in muffin?", "2", ["2", "1"], "Muf fin has two vowel sounds.", "Listen. Muffin. How many syllables do you hear?"),
      q("sy-m2", "How many syllables are in swim?", "1", ["1", "2"], "Swim has one vowel sound, so it is one syllable.", "Listen. Swim. How many syllables do you hear?"),
      q("sy-m3", "Which word has one syllable?", "best", ["best", "basket"], "Best has one vowel sound. Bas ket has two.", "Listen. Best. Basket. Which word has one syllable?"),
    ],
  },
  {
    skillId: "ela.g1.rf.3.e.two-syllable-decode",
    recipeId: "ela.word-mapping.v1",
    evidenceMode: "VISUAL_PRINT_WITH_NARRATED_DIRECTIONS",
    independentEvidenceMode: "INDEPENDENT_READING",
    conceptDomain: "two-syllable-word",
    misconception: "ORDER_REVERSAL",
    contentScopeId: PHONICS_SCOPE,
    instruction: {
      prompt: "Split a long word into syllables, read each one, then put them back together.",
      narration: "A long word is easier when you split it into syllables. Read the first chunk, read the second chunk, then say them together.",
      tutorMessage: "Read it in chunks, then join them.",
      displayTokens: ["nap", "kin"],
    },
    model: {
      prompt: "Read napkin as nap + kin.",
      narration: "Nap. Kin. Napkin. I read the first chunk, then the second chunk, then I say the whole word.",
      tutorMessage: "I keep the chunks in order.",
      modelText: "nap + kin = napkin",
    },
    guided: [
      parts("ts-g1", "Put the chunks in order to make the word sunset.", "sunset", ["sun", "set"], ["set", "sun"], "Sun comes first, then set.", "Build the word sunset from its two chunks."),
      q("ts-g2", "Which word is nap plus kin?", "napkin", ["napkin", "kinnap"], "Nap comes first, so the word is napkin."),
    ],
    independent: [
      parts("ts-i1", "Put the chunks in order to make the word rabbit.", "rabbit", ["rab", "bit"], ["bit", "rab"], "Rab comes first, then bit.", "Build the word rabbit from its two chunks."),
      q("ts-i2", "Which word is pic plus nic?", "picnic", ["picnic", "nicpic"], "Pic comes first, so the word is picnic."),
      parts("ts-i3", "Put the chunks in order to make the word kitten.", "kitten", ["kit", "ten"], ["ten", "kit"], "Kit comes first, then ten.", "Build the word kitten from its two chunks."),
    ],
    mastery: [
      parts("ts-m1", "Put the chunks in order to make the word basket.", "basket", ["bas", "ket"], ["ket", "bas"], "Bas comes first, then ket.", "Build the word basket from its two chunks."),
      q("ts-m2", "Which word is muf plus fin?", "muffin", ["muffin", "finmuf"], "Muf comes first, so the word is muffin."),
      parts("ts-m3", "Put the chunks in order to make the word magnet.", "magnet", ["mag", "net"], ["net", "mag"], "Mag comes first, then net.", "Build the word magnet from its two chunks."),
    ],
  },
  {
    skillId: "ela.g1.rf.3.f.inflectional-endings",
    recipeId: "ela.word-mapping.v1",
    evidenceMode: "VISUAL_PRINT_WITH_NARRATED_DIRECTIONS",
    independentEvidenceMode: "INDEPENDENT_READING",
    conceptDomain: "word-ending",
    misconception: "GRAPHEME_SOUND_CONFUSION",
    contentScopeId: PHONICS_SCOPE,
    instruction: {
      prompt: "Endings like s, ed, and ing attach to a word and change when or how many.",
      narration: "Endings like s, e d, and i n g attach to the end of a word. They change when something happened or how many there are. Jump becomes jumps, jumped, and jumping.",
      tutorMessage: "Find the base word, then read the ending.",
      displayTokens: ["jump", "jumps", "jumped", "jumping"],
    },
    model: {
      prompt: "Jump + ed = jumped, which already happened.",
      narration: "Jump. Now I add e d. Jumped. The ending tells me it already happened.",
      tutorMessage: "I cover the ending and read the base word first.",
      modelText: "jump + ed → jumped",
    },
    guided: [
      q("ie-g1", "Which word shows that it already happened?", "rested", ["rested", "resting"], "The ending e d tells you it already happened."),
      q("ie-g2", "Which word shows it is happening right now?", "playing", ["playing", "played"], "The ending i n g tells you it is happening now."),
    ],
    independent: [
      q("ie-i1", "Which word shows that it already happened?", "hopped", ["hopped", "hopping"], "The ending e d tells you it already happened."),
      q("ie-i2", "What is the base word in jumping?", "jump", ["jump", "jumpin"], "Take off the ending i n g and the base word is jump."),
      q("ie-i3", "Which word means more than one nap?", "naps", ["naps", "napped"], "The ending s tells you there is more than one."),
    ],
    mastery: [
      q("ie-m1", "What is the base word in wanted?", "want", ["want", "wante"], "Take off the ending e d and the base word is want."),
      q("ie-m2", "Which word shows it is happening right now?", "napping", ["napping", "napped"], "The ending i n g tells you it is happening now."),
      q("ie-m3", "Which word shows that it already happened?", "played", ["played", "plays"], "The ending e d tells you it already happened."),
    ],
  },
  {
    skillId: "ela.g1.rf.3.g.irregular-words",
    recipeId: "ela.word-mapping.v1",
    evidenceMode: "VISUAL_PRINT_WITH_NARRATED_DIRECTIONS",
    independentEvidenceMode: "INDEPENDENT_READING",
    conceptDomain: "irregular-word",
    misconception: "GRAPHEME_SOUND_CONFUSION",
    instruction: {
      prompt: "A few common words do not follow the usual sounds. You learn those by remembering them.",
      narration: "A few common words do not follow the usual sounds. The word said looks like it should rhyme with paid, but we say sed. Words like said, was, and come are learned by remembering the tricky part.",
      tutorMessage: "Remember the tricky part of the word.",
      displayTokens: ["said", "was", "come"],
    },
    model: {
      prompt: "The word said is read as sed.",
      narration: "Said. The letters a and i would usually say long a, but in this word we say sed. The s and the d sound just like you expect. Only the middle is tricky.",
      tutorMessage: "Most of the word is regular. I remember the one odd part.",
      modelText: "said → sed",
    },
    guided: [
      q("iw-g1", "How do we say this word: said?", "sed", ["sed", "sayed"], "Said is a tricky word. We say sed."),
      q("iw-g2", "How do we say this word: come?", "cum", ["cum", "coam"], "Come does not use the silent e rule. We say cum."),
    ],
    independent: [
      q("iw-i1", "How do we say this word: was?", "wuz", ["wuz", "wass"], "Was is a tricky word. We say wuz."),
      q("iw-i2", "Which word is a tricky word that you remember instead of sounding out?", "said", ["said", "sand"], "Said does not follow the usual sounds. Sand does."),
      q("iw-i3", "How do we say this word: one?", "wun", ["wun", "own"], "One is a tricky word. We say wun."),
    ],
    mastery: [
      q("iw-m1", "How do we say this word: two?", "too", ["too", "twoh"], "Two is a tricky word. The w stays silent."),
      q("iw-m2", "Which word is a tricky word?", "come", ["come", "cost"], "Come does not follow the silent e rule. Cost follows the usual sounds."),
      q("iw-m3", "How do we say this word: put?", "put with a short oo sound", ["put with a short oo sound", "put rhyming with cut"], "Put does not rhyme with cut. The u says a short oo sound."),
    ],
  },
  {
    skillId: "ela.g1.rf.1.a.sentence-features",
    recipeId: "ela.print-feature.v1",
    evidenceMode: "VISUAL_PRINT_WITH_NARRATED_DIRECTIONS",
    conceptDomain: "sentence-feature",
    misconception: "PRINT_DIRECTION_CONFUSION",
    instruction: {
      prompt: "A sentence starts with a capital letter, ends with a mark, and puts words in an order that makes sense.",
      narration: "A sentence starts with a capital letter and ends with a punctuation mark. The words also have to be in an order that makes sense.",
      tutorMessage: "Check the start, the end, and the order.",
      displayTokens: ["The frog hops."],
    },
    model: {
      prompt: "The frog hops. Capital T at the start, a period at the end.",
      narration: "The frog hops. It begins with a capital T. It ends with a period. The words are in an order that makes sense.",
      tutorMessage: "I check three things every time.",
      modelText: "The frog hops.",
    },
    guided: [
      q("sf-g1", "Which sentence has words in an order that makes sense?", "The frog hops.", ["The frog hops.", "Hops frog the."], "A sentence puts the words in an order a reader can follow."),
      q("sf-g2", "What is missing? the dog naps", "A capital letter and a period", ["A capital letter and a period", "Nothing is missing"], "A sentence needs a capital at the start and a mark at the end."),
    ],
    independent: [
      q("sf-i1", "Which one is a complete sentence?", "We saw a bird.", ["We saw a bird.", "saw a bird"], "A complete sentence begins with a capital and ends with a mark."),
      q("sf-i2", "Where does a capital letter go in a sentence?", "On the first word", ["On the first word", "On the last word"], "The first word of a sentence begins with a capital letter."),
      q("sf-i3", "Which sentence has words in an order that makes sense?", "My cat sleeps.", ["My cat sleeps.", "Sleeps cat my."], "The words must be in an order that makes sense."),
    ],
    mastery: [
      q("sf-m1", "Which one is written correctly?", "The sun is hot.", ["The sun is hot.", "the sun is hot"], "It needs both the capital letter and the end mark."),
      q("sf-m2", "What belongs at the end of a sentence?", "A punctuation mark", ["A punctuation mark", "A capital letter"], "A punctuation mark ends the sentence. The capital goes at the start."),
      q("sf-m3", "Which sentence is in an order that makes sense?", "Birds build nests.", ["Birds build nests.", "Nests birds build."], "The words must be in an order a reader can follow."),
    ],
  },
];
