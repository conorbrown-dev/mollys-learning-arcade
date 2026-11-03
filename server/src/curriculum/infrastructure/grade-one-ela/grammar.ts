import { choiceItem as q, type LessonSkillSpec } from "../lesson-activity-builder";

/** Grade 1 grammar: the parts of a sentence a first grader names and uses (1.L.1.*). */

export const GRADE_ONE_GRAMMAR_SPECS: readonly LessonSkillSpec[] = [
  {
    skillId: "ela.g1.l.1.b.nouns",
    recipeId: "ela.print-feature.v1",
    evidenceMode: "VISUAL_PRINT_WITH_NARRATED_DIRECTIONS",
    conceptDomain: "noun",
    misconception: "UNCLASSIFIED",
    instruction: {
      prompt: "A noun names a person, a place, a thing, or an animal.",
      narration: "A noun is a naming word. It names a person, a place, a thing, or an animal. Teacher, school, cup, and rabbit are all nouns.",
      tutorMessage: "Ask yourself: does this word name something?",
      displayTokens: ["person", "place", "thing", "animal"],
    },
    model: {
      prompt: "In the sentence The dog ran, the noun is dog.",
      narration: "The dog ran. Dog names an animal, so dog is the noun. Ran is not a noun, because ran is something you do.",
      tutorMessage: "I look for the word that names something.",
      modelText: "The dog ran.",
    },
    guided: [
      q("nn-g1", "Which word names a place?", "school", ["school", "jump"], "School names a place, so it is a noun. Jump is an action."),
      q("nn-g2", "Which word is a noun in this sentence? The cat sleeps.", "cat", ["cat", "sleeps"], "Cat names an animal. Sleeps is an action."),
    ],
    independent: [
      q("nn-i1", "Which word names a thing?", "cup", ["cup", "quickly"], "Cup names a thing, so it is a noun."),
      q("nn-i2", "Which word is a noun in this sentence? Birds build nests.", "nests", ["nests", "build"], "Nests names things. Build is an action."),
      q("nn-i3", "Which word names a person?", "teacher", ["teacher", "happy"], "Teacher names a person. Happy describes how someone feels."),
    ],
    mastery: [
      q("nn-m1", "Which word names an animal?", "rabbit", ["rabbit", "hop"], "Rabbit names an animal. Hop is an action."),
      q("nn-m2", "Which word is a noun in this sentence? My sister reads books.", "books", ["books", "reads"], "Books names things. Reads is an action."),
      q("nn-m3", "Which word names a place?", "park", ["park", "run"], "Park names a place. Run is an action."),
    ],
  },
  {
    skillId: "ela.g1.l.1.f.adjectives",
    recipeId: "ela.print-feature.v1",
    evidenceMode: "VISUAL_PRINT_WITH_NARRATED_DIRECTIONS",
    conceptDomain: "adjective",
    misconception: "UNCLASSIFIED",
    instruction: {
      prompt: "An adjective describes a noun. It tells what kind, how many, or which one.",
      narration: "An adjective is a describing word. It tells you more about a noun: what kind, how many, or which one. In a red kite, the word red describes the kite.",
      tutorMessage: "Find the noun, then find the word describing it.",
      displayTokens: ["red kite", "three cats", "soft blanket"],
    },
    model: {
      prompt: "In the red kite, the adjective is red.",
      narration: "The red kite. Kite is the noun. Red tells me what kind of kite, so red is the adjective.",
      tutorMessage: "I find the noun first, then ask what describes it.",
      modelText: "the red kite",
    },
    guided: [
      q("aj-g1", "Which word describes the kite?", "red", ["red", "fly"], "Red tells what kind of kite, so it is an adjective."),
      q("aj-g2", "Which word is an adjective in this sentence? The soft blanket is warm.", "soft", ["soft", "blanket"], "Soft describes the blanket. Blanket is the noun."),
    ],
    independent: [
      q("aj-i1", "Which word is an adjective in this sentence? I saw three birds.", "three", ["three", "birds"], "Three tells how many birds, so it is an adjective."),
      q("aj-i2", "Which word describes the dog?", "loud", ["loud", "dog"], "Loud tells what kind of dog. Dog is the noun."),
      q("aj-i3", "What does an adjective do?", "It describes a noun.", ["It describes a noun.", "It names a place."], "An adjective describes. A noun names."),
    ],
    mastery: [
      q("aj-m1", "Which word is an adjective in this sentence? The tall tree swayed.", "tall", ["tall", "tree"], "Tall describes the tree."),
      q("aj-m2", "Which word describes the soup?", "hot", ["hot", "soup"], "Hot tells what kind of soup."),
      q("aj-m3", "Which word is an adjective in this sentence? She has two cats.", "two", ["two", "cats"], "Two tells how many cats."),
    ],
  },
  {
    skillId: "ela.g1.l.1.e.verb-tense",
    recipeId: "ela.print-feature.v1",
    evidenceMode: "VISUAL_PRINT_WITH_NARRATED_DIRECTIONS",
    conceptDomain: "verb-tense",
    misconception: "UNCLASSIFIED",
    instruction: {
      prompt: "Verbs change to show whether something already happened, is happening now, or will happen later.",
      narration: "A verb is an action word, and it changes to tell you when. Walked already happened. Walk is happening now. Will walk has not happened yet.",
      tutorMessage: "Look for the time word and the verb ending.",
      displayTokens: ["walked", "walk", "will walk"],
    },
    model: {
      prompt: "Tomorrow I will visit Grandma.",
      narration: "Tomorrow I will visit Grandma. The word tomorrow tells me it has not happened yet, and will visit matches that time.",
      tutorMessage: "I match the verb to when it happens.",
      modelText: "will visit = later",
    },
    guided: [
      q("vt-g1", "Which sentence tells about tomorrow?", "Tomorrow I will visit Grandma.", ["Tomorrow I will visit Grandma.", "Tomorrow I visited Grandma."], "Will visit tells about something that has not happened yet."),
      q("vt-g2", "Which word shows it already happened?", "played", ["played", "plays"], "The ending e d shows it already happened."),
    ],
    independent: [
      q("vt-i1", "Which sentence tells about yesterday?", "Yesterday we walked home.", ["Yesterday we walked home.", "Yesterday we will walk home."], "Walked shows it already happened."),
      q("vt-i2", "Which word shows it is happening right now?", "is running", ["is running", "ran"], "Is running shows it is happening now. Ran already happened."),
      q("vt-i3", "Which sentence tells about later?", "We will bake a cake.", ["We will bake a cake.", "We baked a cake."], "Will bake has not happened yet."),
    ],
    mastery: [
      q("vt-m1", "Which sentence tells about something that already happened?", "She finished her book.", ["She finished her book.", "She will finish her book."], "Finished shows it already happened."),
      q("vt-m2", "Which word fits? Last night we ___ a movie.", "watched", ["watched", "will watch"], "Last night already happened, so the verb is watched."),
      q("vt-m3", "Which word fits? Next week I ___ my cousin.", "will see", ["will see", "saw"], "Next week has not happened yet, so the verb is will see."),
    ],
  },
  {
    skillId: "ela.g1.l.1.c.noun-verb-agreement",
    recipeId: "ela.print-feature.v1",
    evidenceMode: "VISUAL_PRINT_WITH_NARRATED_DIRECTIONS",
    conceptDomain: "agreement",
    misconception: "UNCLASSIFIED",
    instruction: {
      prompt: "One thing and many things use different verb forms.",
      narration: "When one thing does the action, the verb usually ends in s. The cat plays. When more than one thing does the action, the verb has no s. The cats play.",
      tutorMessage: "Count the nouns, then pick the verb.",
      displayTokens: ["The cat plays.", "The cats play."],
    },
    model: {
      prompt: "The cats play, because cats is more than one.",
      narration: "The cats play. Cats is more than one, so the verb is play with no s. If it were one cat, I would say the cat plays.",
      tutorMessage: "I check whether the noun is one or many first.",
      modelText: "cats → play",
    },
    guided: [
      q("ag-g1", "Choose the sentence whose naming word and action word match.", "The cats play.", ["The cats play.", "The cats plays."], "Cats is more than one, so the verb is play."),
      q("ag-g2", "Which word fits? The dog ___ in the yard.", "runs", ["runs", "run"], "Dog is one, so the verb ends in s."),
    ],
    independent: [
      q("ag-i1", "Which word fits? The birds ___ in the tree.", "sing", ["sing", "sings"], "Birds is more than one, so the verb has no s."),
      q("ag-i2", "Which sentence is correct?", "My friend helps me.", ["My friend helps me.", "My friend help me."], "Friend is one, so the verb is helps."),
      q("ag-i3", "Which word fits? The boys ___ a game.", "want", ["want", "wants"], "Boys is more than one, so the verb is want."),
    ],
    mastery: [
      q("ag-m1", "Which sentence is correct?", "The horses eat hay.", ["The horses eat hay.", "The horses eats hay."], "Horses is more than one, so the verb is eat."),
      q("ag-m2", "Which word fits? My sister ___ to school.", "walks", ["walks", "walk"], "Sister is one, so the verb ends in s."),
      q("ag-m3", "Which sentence is correct?", "The children laugh.", ["The children laugh.", "The children laughs."], "Children means more than one, so the verb is laugh."),
    ],
  },
  {
    skillId: "ela.g1.l.1.d.pronouns",
    recipeId: "ela.print-feature.v1",
    evidenceMode: "VISUAL_PRINT_WITH_NARRATED_DIRECTIONS",
    conceptDomain: "pronoun",
    misconception: "UNCLASSIFIED",
    instruction: {
      prompt: "A pronoun takes the place of a noun so you do not repeat the same name.",
      narration: "A pronoun stands in for a noun. Instead of saying Molly went to Molly's room, you say Molly went to her room. He, she, it, we, and they are all pronouns.",
      tutorMessage: "Find the noun the pronoun replaces.",
      displayTokens: ["he", "she", "it", "we", "they"],
    },
    model: {
      prompt: "Mia and I can become we.",
      narration: "Mia and I went outside. Instead of saying Mia and I again, I can say we went outside. We takes the place of Mia and I.",
      tutorMessage: "I check who the pronoun is standing in for.",
      modelText: "Mia and I → we",
    },
    guided: [
      q("pr-g1", "Which word can take the place of Mia and I?", "we", ["we", "blue"], "We is a pronoun that stands in for Mia and I."),
      q("pr-g2", "Which word can take the place of the dog?", "it", ["it", "run"], "It is a pronoun that can stand in for a thing or an animal."),
    ],
    independent: [
      q("pr-i1", "Which word can take the place of my brother?", "he", ["he", "them"], "He stands in for one boy or man."),
      q("pr-i2", "Which word can take the place of the children?", "they", ["they", "she"], "They stands in for more than one person."),
      q("pr-i3", "What does a pronoun do?", "It takes the place of a noun.", ["It takes the place of a noun.", "It describes a noun."], "A pronoun replaces a noun. An adjective describes one."),
    ],
    mastery: [
      q("pr-m1", "Which word can take the place of Grandma?", "she", ["she", "it"], "She stands in for one woman or girl."),
      q("pr-m2", "Which word can take the place of the books?", "they", ["they", "he"], "They stands in for more than one thing."),
      q("pr-m3", "Which sentence uses a pronoun correctly? Sam lost his hat, so ___ looked for it.", "he", ["he", "they"], "Sam is one person, so the pronoun is he."),
    ],
  },
  {
    skillId: "ela.g1.l.1.h.determiners",
    recipeId: "ela.print-feature.v1",
    evidenceMode: "VISUAL_PRINT_WITH_NARRATED_DIRECTIONS",
    conceptDomain: "determiner",
    misconception: "UNCLASSIFIED",
    instruction: {
      prompt: "Little words like a, an, the, this, and those come before a noun and point to it.",
      narration: "Some small words come right before a noun and point to it. A, an, and the are the most common. This and that point to one thing. These and those point to more than one.",
      tutorMessage: "These words always have a noun close behind.",
      displayTokens: ["a dog", "the dog", "this dog", "those dogs"],
    },
    model: {
      prompt: "This dog points to one dog that is close by.",
      narration: "This dog. The word this comes before the noun dog and points to one dog near me. If there were many, I would say these dogs.",
      tutorMessage: "I check whether it points to one or to many.",
      modelText: "this dog · these dogs",
    },
    guided: [
      q("dt-g1", "Which word can come before the noun dog to point to one dog?", "this", ["this", "quickly"], "This points to one noun. Quickly describes an action."),
      q("dt-g2", "Which word fits? I ate ___ apple.", "an", ["an", "a"], "Apple begins with a vowel sound, so it takes an."),
    ],
    independent: [
      q("dt-i1", "Which word fits? She has ___ cat.", "a", ["a", "an"], "Cat begins with a consonant sound, so it takes a."),
      q("dt-i2", "Which word points to more than one thing?", "those", ["those", "that"], "Those points to more than one. That points to one."),
      q("dt-i3", "Which word fits? We saw ___ owl in the tree.", "an", ["an", "a"], "Owl begins with a vowel sound, so it takes an."),
    ],
    mastery: [
      q("dt-m1", "Which word fits? He read ___ book you gave him.", "the", ["the", "an"], "The points to a specific book you both know about."),
      q("dt-m2", "Which word points to one thing that is close by?", "this", ["this", "these"], "This points to one. These points to more than one."),
      q("dt-m3", "Which word fits? I need ___ eraser.", "an", ["an", "a"], "Eraser begins with a vowel sound, so it takes an."),
    ],
  },
  {
    skillId: "ela.g1.l.1.i.prepositions",
    recipeId: "ela.print-feature.v1",
    evidenceMode: "VISUAL_PRINT_WITH_NARRATED_DIRECTIONS",
    conceptDomain: "preposition",
    misconception: "UNCLASSIFIED",
    instruction: {
      prompt: "Some words tell where something is or when something happens.",
      narration: "Words like in, on, under, over, beside, before, and after tell you where something is or when something happens. The cat is under the table tells you where the cat is.",
      tutorMessage: "Ask where or when.",
      displayTokens: ["in", "on", "under", "beside"],
    },
    model: {
      prompt: "The toy is inside the box. Inside tells where.",
      narration: "The toy is inside the box. Inside tells me where the toy is. If I changed inside to beside, the toy would be in a different place.",
      tutorMessage: "I ask where the thing is.",
      modelText: "inside the box",
    },
    guided: [
      q("pp-g1", "Which word tells where the toy is? The toy is ___ the box.", "inside", ["inside", "happy"], "Inside tells where the toy is. Happy describes a feeling."),
      q("pp-g2", "Which word tells where the bird sits?", "on", ["on", "and"], "On tells where. And joins two ideas."),
    ],
    independent: [
      q("pp-i1", "Which word tells where the shoes are? The shoes are ___ the bed.", "under", ["under", "quickly"], "Under tells where the shoes are."),
      q("pp-i2", "Which word tells when? We eat ___ the game.", "before", ["before", "green"], "Before tells when something happens."),
      q("pp-i3", "Which word tells where? The cat jumped ___ the fence.", "over", ["over", "soft"], "Over tells where the cat jumped."),
    ],
    mastery: [
      q("pp-m1", "Which word tells where? The book is ___ the shelf.", "on", ["on", "but"], "On tells where the book is."),
      q("pp-m2", "Which word tells when? We clean up ___ dinner.", "after", ["after", "loud"], "After tells when."),
      q("pp-m3", "Which word tells where? She sat ___ her friend.", "beside", ["beside", "slowly"], "Beside tells where she sat."),
    ],
  },
  {
    skillId: "ela.g1.l.1.g.conjunctions",
    recipeId: "ela.print-feature.v1",
    evidenceMode: "VISUAL_PRINT_WITH_NARRATED_DIRECTIONS",
    conceptDomain: "conjunction",
    misconception: "UNCLASSIFIED",
    instruction: {
      prompt: "Joining words like and, but, so, and or connect two ideas.",
      narration: "A joining word connects two ideas. And adds one idea to another. But shows that the ideas are different. So shows what happened because of something. Or gives a choice.",
      tutorMessage: "Ask how the two ideas fit together.",
      displayTokens: ["and", "but", "so", "or"],
    },
    model: {
      prompt: "I wanted to play, but it started to rain.",
      narration: "I wanted to play, but it started to rain. The two ideas disagree with each other, so the joining word is but, not and.",
      tutorMessage: "I ask whether the ideas agree or disagree.",
      modelText: "wanted to play … but … rain",
    },
    guided: [
      q("cj-g1", "Which word can join the ideas I like apples ___ bananas?", "and", ["and", "under"], "And joins two things in a list."),
      q("cj-g2", "Which word fits? I was tired, ___ I went to bed.", "so", ["so", "but"], "So shows what happened because she was tired."),
    ],
    independent: [
      q("cj-i1", "Which word fits? I wanted to play, ___ it started to rain.", "but", ["but", "and"], "But shows the two ideas are different."),
      q("cj-i2", "Which word gives a choice? Do you want milk ___ juice?", "or", ["or", "and"], "Or gives a choice between two things."),
      q("cj-i3", "Which word fits? It was cold, ___ I wore a coat.", "so", ["so", "or"], "So shows what happened because it was cold."),
    ],
    mastery: [
      q("cj-m1", "Which word fits? She looked for her hat, ___ she could not find it.", "but", ["but", "so"], "But shows the two ideas disagree."),
      q("cj-m2", "Which word fits? We packed snacks ___ water.", "and", ["and", "but"], "And adds one thing to another."),
      q("cj-m3", "Which word fits? The bell rang, ___ we lined up.", "so", ["so", "or"], "So shows what happened because the bell rang."),
    ],
  },
];
