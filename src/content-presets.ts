// --- Adhesion / Family ---

export const PANGRAMS = [
  'The quick brown fox jumps over the lazy dog.',
  'Sphinx of black quartz, judge my vow.',
  'Pack my box with five dozen liquor jugs.',
  'How vexingly quick daft zebras jump!',
  'The five boxing wizards jump quickly.',
  'Glib jocks quiz nymph to vex dwarf.',
  'Waltz, bad nymph, for quick jigs vex.',
];

export const ADHESION = [
  'Hamburgevons',
  'Rafgenduks',
  'nn oo HH OO',
  'AV Ta P.',
  'illuminate',
  'minimum',
  'millennium',
];

/** Repeated words for Family Overview (anode / ADHESION). */
export const ADHESION_REPEAT = ['anode', 'ADHESION'] as const;

/** German adhesion grid: each string is one row, words space-separated (proof pages 3–6). */
export const ADHESION_GRID: string[] = [
  'Idee Ode See nennend endenden Ionen Sonnen denn Henne',
  'Don da den Anno da nennen an Nonnen endende endenden da',
  'Idee Sonne endenden an Neon nennend dannen Nonnen Son-',
  'den Ende Hedda endenden Neon an Ode denen Don Henne',
  'Enden den da endende Nonnen Sonden nennend Seen enden-',
  'den Ode Ionen Neon Neon endende Henne da See den Ende',
  'an Anno Neon an Sande endenden Seen Sonden denn nennend',
  'den Eden den Seen See den dannen den Henne Hanne Ideen',
  'Hand den da nennen Don Seen Soda Don an Ode endende den',
  'Sand endende Seen denn Ode Sand Idee endenden an Sonden',
  'endenden nenne Ionen den den denen Eden nennen den en-',
  'dende Don Ende da Don an Sonden nennend da da dannen',
  'Idee Ideen Sonne endenden an Hedda nennend Henne enden-',
  'den endende See Sonden denn Sand dannen Don nennend',
  'Sonnen See an Nonne Sonnen Seen an Sand denen Ende',
  'Hanne nennen Hedda Hanne Hanne Seen endenden Eden Ode',
];

// --- Character set ---

export const CAPS_SAMPLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/** Character overview: uppercase, two lines (proof p7–8). */
export const CHARS_UC_LINE1 = 'ABCDEFGHIJKLMOP';
export const CHARS_UC_LINE2 = 'QRSTUVWXYZ';

/** Character overview: lowercase, two lines. */
export const CHARS_LC_LINE1 = 'abcdefghijklmop';
export const CHARS_LC_LINE2 = 'qrstuvwxyz';

/** Character overview: numerals (proof p9). */
export const CHARS_NUMERALS = '0123456789';

/** Character overview: punctuation (proof p9). */
export const CHARS_PUNCTUATION = ['()[],.;:-–_\'"=', '?!@\t#'];

// --- Spacing ---

/** Spacing strings: lowercase nn+letter+oo per letter (proof p10–11). */
export const SPACING_LC: string[] = [
  'nnonoonoonoonnonnono',
  'nnannaooaooannannaooaooannannaooaoo',
  'nnbnnbooboobnnbnnbooboobnnbnnboo',
  'nncnncoocoocnncnncoocoocnncnncoocoo',
  'nndnndoodoodnndnndoodoodnndnndoodo',
  'nnenneooeooennenneooeooennenneooe',
  'nnfnnfoofoofnnfnnfoofoofnnfnnfoofoofnn',
  'nngnngoogoognngnngoogoognngnngoog',
  'nnhnnhoohoohnnhnnhoohoohnnhnnhooh',
  'nninniooiooinninniooiooinninniooiooinninn',
  'nnjnnjoojoojnnjnnjoojoojnnjnnjoojoo',
  'nnknnkookooknnknnkookooknnknnkookoo',
  'nnlnnlooloolnnlnnlooloolnnlnnlooloolnnln',
  'nnmnnmoomoomnnmnnmoomoomnnm',
  'nnpnnpoopoopnnpnnpoopoopnnpnnpoopoo',
  'nnqnnqooqooqnnqnnqooqooqnnqnnqooqoo',
  'nnrnnrooroornnrnnrooroornnrnnrooroornnr',
  'nnsnnsoosoosnnsnnsoosoosnnsnnsoosoo',
  'nntnntootootnntnntootootnntnntootoot',
  'nnunnuoouoounnunnuoouoounnunnuoou',
  'nnvnnvoovoovnnvnnvoovoovnnvnnvoovoo',
  'nnwnnwoowoownnwnnwoowoownnwnnwo',
  'nnxnnxooxooxnnxnnxooxooxnnxnnxooxoo',
  'nnynnyooyooynnynnyooyooynnynnyooyoo',
  'nnznnzoozooznnznnzoozooznnznnzoozoo',
];

/** Spacing strings: uppercase HH+letter+OO per letter (proof p10–11). */
export const SPACING_UC: string[] = [
  'HHOHOOHOOHOOHHOHHOHO',
  'HHAHHAOOAOOAHHAHHAOOAOOAHHAH',
  'HHBHHBOOBOOBHHBHHBOOBOOBHHB',
  'HHCHHCOOCOOCHHCHHCOOCOOCHHCH',
  'HHDHHDOODOODHHDHHDOODOODHHD',
  'HHEHHEOOEOOEHHEHHEOOEOOEHHEHH',
  'HHFHHFOOFOOFHHFHHFOOFOOFHHFHH',
  'HHGHHGOOGOOGHHGHHGOOGOOGHHG',
  'HHIHHIOOIOOIHHIHHIOOIOOIHHIHHIOOIO',
  'HHJHHJOOJOOJHHJHHJOOJOOJHHJHHJO',
  'HHKHHKOOKOOKHHKHHKOOKOOKHHKH',
  'HHLHHLOOLOOLHHLHHLOOLOOLHHLHHL',
  'HHNHHNOONOONHHNHHNOONOONHH',
  'HHMHHMOOMOOMHHMHHMOOMOO',
  'HHPHHPOOPOOPHHPHHPOOPOOPHHPHH',
  'HHQHHQOOQOOQHHQHHQOOQOOQHH',
  'HHRHHROOROORHHRHHROOROORHHRH',
  'HHSHHSOOSOOSHHSHHSOOSOOSHHSHH',
  'HHTHHTOOTOOTHHTHHTOOTOOTHHTHHT',
  'HHUHHUOOUOOUHHUHHUOOUOOUHHU',
  'HHVHHVOOVOOVHHVHHVOOVOOVHHVHH',
  'HHWHHWOOWOOWHHWHHWOOWOOWH',
  'HHXHHXOOXOOXHHXHHXOOXOOXHHXHH',
  'HHYHHYOOYOOYHHYHHYOOYOOYHHYHH',
  'HHZHHZOOZOOZHHZHHZOOZOOZHHZHH',
];

/** Spacing with punctuation: lowercase and uppercase (proof p11–12). */
export const SPACING_PUNCT_LC: string[] = [
  'nn.nn.oo.oo.nn.nn.oo.oo.nn.nn.oo.oo',
  'nn,nn,oo,oo,nn,nn,oo,oo,nn,nn,oo,oo',
  'nn:nn:oo:oo:nn:nn:oo:oo:nn:nn:oo:oo',
  'nn;nn;oo;oo;nn;nn;oo;oo;nn;nn;oo;oo',
  'nn-nn-oo-oo-nn-nn-oo-oo-nn-nn-oo-oo',
  'nn–nn–oo–oo–nn–nn–oo–oo–nn–nn–oo–oo',
];
export const SPACING_PUNCT_UC: string[] = [
  'HH.HH.OO.OO.HH.HH.OO.OO.HH.HH.OO.OO',
  'HH,HH,OO,OO,HH,HH,OO,OO,HH,HH,OO,OO',
  'HH:HH:OO:OO:HH:HH:OO:OO:HH:HH:OO:OO',
  'HH;HH;OO;OO;HH;HH;OO;OO;HH;HH;OO;OO',
  'HH-HH-OO-OO-HH-HH-OO-OO-HH-HH',
  'HH–HH–OO–OO–HH–HH–OO–OO–HH–HH',
];

/** Spacing numerals: nn0..., 110..., HH0... (proof p12–13). */
export const SPACING_NUMERALS_LC: string[] = [
  'nn0nn0oo0oo0nn0nn0oo0oo0nn0nn0oo0oo',
  'nn1nn1oo1oo1nn1nn1oo1oo1nn1nn1oo1oo',
  'nn2nn2oo2oo2nn2nn2oo2oo2nn2nn2oo2oo',
  'nn3nn3oo3oo3nn3nn3oo3oo3nn3nn3oo3oo',
  'nn4nn4oo4oo4nn4nn4oo4oo4nn4nn4oo4oo',
  'nn5nn5oo5oo5nn5nn5oo5oo5nn5nn5oo5oo',
  'nn6nn6oo6oo6nn6nn6oo6oo6nn6nn6oo6oo',
  'nn7nn7oo7oo7nn7nn7oo7oo7nn7nn7oo7oo',
  'nn8nn8oo8oo8nn8nn8oo8oo8nn8nn8oo8oo',
  'nn9nn9oo9oo9nn9nn9oo9oo9nn9nn9oo9oo',
];
export const SPACING_NUMERALS_UC: string[] = [
  '110110100100110110100100',
  '11211200200211211200200',
  '11311300300311311300300',
  '11411400400411411400400',
  '11511500500511511500500',
  '11611600600611611600600',
  '11711700700711711700700',
  '11811800800811811800800',
  '11911900900911911900900',
];
export const SPACING_NUMERALS_HH: string[] = [
  'HH0HH0OO0OO0HH0HH0OO0OO0HH0HH',
  'HH1HH1OO1OO1HH1HH1OO1OO1HH1HH1OO',
  'HH2HH2OO2OO2HH2HH2OO2OO2HH2HH2',
  'HH3HH3OO3OO3HH3HH3OO3OO3HH3HH3',
  'HH4HH4OO4OO4HH4HH4OO4OO4HH4HH4',
  'HH5HH5OO5OO5HH5HH5OO5OO5HH5HH5',
  'HH6HH6OO6OO6HH6HH6OO6OO6HH6HH',
  'HH7HH7OO7OO7HH7HH7OO7OO7HH7HH7',
  'HH8HH8OO8OO8HH8HH8OO8OO8HH8HH',
  'HH9HH9OO9OO9HH9HH9OO9OO9HH9HH',
];

// --- Kerning pairs ---

/** Classic kerning pairs (AT, AV, Fa, LO, etc.) for proofing. */
export const KERNING_CLASSIC: string[] = [
  'AT AV AW AY Av Aw Ay',
  'Fa Fe Fo Kv Kw Ky LO',
  'LV LY PA Pa Pe Po TA',
  'Ta Te Ti To Tr Ts Tu Ty',
  'UA VA Va Ve Vo Vr Vu Vy',
  'WA WO Wa We Wr Wv Wy',
];

/** Incidentals: letter + punctuation (problem letters f, r, v, w, y, T, V, W, Y). */
export const INCIDENTALS_LETTER_PUNCT: string[] = [
  'f. f, f; f:',
  'r. r, r; r:',
  'v. v, v; v:',
  'w. w, w; w:',
  'y. y, y; y:',
  'T. T, T; T:',
  'V. V, V; V:',
  'W. W, W; W:',
  'Y. Y, Y; Y:',
];

/** Incidentals: exclamation and question (w! w? f! f?, guillemots). */
export const INCIDENTALS_EXCLAM_QUEST: string[] = [
  'w! w? f! f? ¡a ¿a',
  '«n» «o» ‹n› ‹o›',
];

// --- Sidebearing ---

/** Sidebearing: H + every uppercase letter (HAHBHCHD...HZ). */
export const SIDEBEARING_H_UC =
  'HAHBHCHDHEHFHGHHHIHJHKHLHMHNHOHPHQHRHSHTHUHVHWHXHYHZH';

/** Sidebearing: n + every lowercase letter (nanbnc...nz). */
export const SIDEBEARING_N_LC =
  'nanbncndnenfngnhninjnknlnmnnnonpnqnrnsntnunvnwnxnynzn';

/** Sidebearing: o + every lowercase letter (oaoboc...oz). */
export const SIDEBEARING_O_LC =
  'oaobocodoeofogohoiojokolomonooopoqorosotouovowoxoyozo';

// --- Words ---

/** A–Z specimen words for two-column layout A–K | L–Z (proof p14–15). */
export const WORDS_AZ: string[] = [
  'Aaron', 'Able', 'Ache', 'Advert', 'Aegis', 'Aft', 'Age', 'Ahe', 'Ails', 'Ajar', 'Akin', 'Aloe', 'Amish', 'And',
  'Band', 'Bet', 'Bing', 'Bloat', 'Bog', 'Carry', 'Celar', 'Cinthia', 'Cope', 'Crap', 'Cult', 'Cycle', 'Cantina', 'Calvin',
  'Dark', 'Demon', 'Dingo', 'Dope', 'Dumb', 'Each', 'Eels', 'Einar', 'Eons', 'Euchre', 'Ever', 'Eiler', 'Emit', 'Eves',
  'Fact', 'Fever', 'Fire', 'Fine', 'Font', 'Framer', 'Fur', 'Ford', 'Fuhr', 'Folder', 'Funk',
  'Gayle', 'Gentle', 'Girl', 'Gnome', 'Gonot', 'Grinning', 'Gulf', 'Gwen', 'Gyro',
  'Harder', 'Help', 'Hilton', 'Honor', 'Hunk', 'Ian', 'Ieo', 'Iggie', 'Iillian', 'Ion', 'Iugia',
  'Jacky', 'Jester', 'Jimmy', 'Joint', 'Junk', 'Kangaroo', 'Keep', 'Kill', 'Kline', 'Kop', 'Kudees', 'Klick', 'Kva', 'Kole',
  'Lak', 'Learned', 'Listing', 'Load', 'Lung', 'Mail', 'Meal', 'Mind', 'Mode', 'Music',
  'Nail', 'Net', 'Nile', 'Nooke', 'Numb', 'Oatmeal', 'Oer', 'Offer', 'Ogor', 'Oolong',
  'Painter', 'Peal', 'Pile', 'Phone', 'Pjb', 'Qanat', 'Qels', 'Qix', 'Qon', 'Quest', 'Quazar',
  'Rate', 'Red', 'Right', 'Rogal', 'Run', 'Sallie', 'Scutt', 'Sensation', 'Shell', 'Sink', 'Smellie', 'Soul', 'Spoke', 'Sqish', 'Stoner',
  'Tail', 'Teal', 'Them', 'Timer', 'Tome', 'Toll', 'Trustee', 'Tsing', 'Tumbs', 'Titling',
  'Uarco', 'Ue', 'Ui', 'Umbrella', 'Under', 'Uo', 'Upper', 'Ursula', 'User', 'Utterly', 'Uwe',
  'Vain', 'Vc', 'Veto', 'Vine', 'Vlad', 'Vulgar', 'Wale', 'Wet', 'What', 'Window', 'Wren', 'Wynde',
  'Xanth', 'Xelo', 'Xi', 'Xo', 'Xu', 'Xylo', 'Yviye', 'Yz', 'Yatzy', 'Yvonne', 'Yggdrasil',
  'Zanzabar', 'Zellis', 'Zion', 'Zope', 'Zulu',
];

export const WORDS_SAMPLE = 'alignment ascender baseline cap-height counter descender glyph kerning ligature serif x-height';

// --- Specimen text ---

export const HEADLINE_SENTENCES = [
  'Type is the clothing of words.',
  'Typography is the craft of endowing human language with a durable visual form.',
  'Good typography is invisible.',
  'Readability and legibility are not the same.',
  'Letters are the pixels of language.',
];

export const PARAGRAPHS = {
  short:
    'When Gregor Samsa woke one morning from troubled dreams, he found himself transformed in his bed into a monstrous insect.',
  kafka:
    'When Gregor Samsa woke one morning from troubled dreams, he found himself transformed in his bed into a monstrous insect. He lay on his armour-like back, and if he lifted his head a little he could see his brown belly, slightly domed and divided by arches into stiff sections. The bedding was hardly able to cover it and seemed ready to slide off any moment. His many legs, pitifully thin compared with the size of the rest of him, waved about helplessly as he looked.',
  typography:
    'Typography is the art and technique of arranging type to make written language legible, readable and appealing when displayed. The arrangement involves selecting typefaces, point sizes, line lengths, line-spacing, and letter-spacing, and adjusting the space between pairs of letters.',
  /** German specimen for waterfall / Regular Specimen (proof). */
  germanSpecimen:
    'Krummes Mumm Neuen anbohrend (Asyl) Mohr paar Wille war_wild titanische um; angespritzter Hose schlag klug. per festliegendes tilge welksten satten Bub-Sept Amuletten Jux am Unke erlag General ihn Kreis ich Bobkonstruktion? willigeren Bungalow Los Exoten planst Gauner Beeren fernbleibendem "Formblatt Fluchtwege" Furnier sprang mixt um klipp gilt! Vogtes ab seh am Piste. verbuchtes verzehre abbaute, Jacke Lupe See wo aufgeregt–Gibt einer fair flitz zotig Liz aufgescheuchten Erhardt in [Rat Bill Po] du verbog dieselben Asse gekantet Uni lach beschimpfenden Dotierungen breitem wagst da Vorsatz; aufgeforstet Absatzes, Angebern aufgebraustes: Dung ein pfiffigem Doppelpass Bar lenkst einzulenken eng Gicht Fresspaket errichtenden sehr tu=seine hob Part idealerem 1798, Sam Berta sein Ehe hergebrachten Po stolzer Assistentinnen Wirt dominierende echten \'Optimum\' Dachs ob am Box (Serie erkanntes dreimal) Minarett by graue fortbleibendes Oil edle bunte baumle pumpten eilst knotig Dom Person, Rabat Hirn da Po fiel "Ameisenhaufen" abspenstige Job Wurfpfeile Zopf Max Ulan Volke rollte Erz send Otter Tor Weltatlas.',
  /** Emil Ruder spacing test: multilingual words for even colour (top and bottom paragraphs should match). */
  ruder:
    'bibel malhabile modo biegen peuple punibile blind qualifier quindi damals quelle dinamica china quelque analiso schaden salomon macchina schein sellier secondo lager sommier singolo legion unique possibile mime unanime unico mohn usuel legge nagel abonner unione puder agir punizione quälen aiglon dunque huldigen allégir quando geduld alliance uomini vertrag crainte screw verwalter croyant science verzicht fratricide sketchy vorrede frivolité story yankee instruction take zwetschge lyre treaty zypresse navette tricycle fraktur nocturne typograph kraft pervertir vanity raffeln presto victory reaktion prévoyant vivacity rekord priorité wayward revolte proscrire efficiency tritt raviver without trotzkopf tactilité through tyrann arrêt known',
};

export const WORLD_SCRIPTS = {
  greek: 'Γαζέες καὶ μυρτιὲς δὲν θὰ βρῶ πιὰ στὸ χρυσαφὶ ξέφωτο.',
  cyrillic: 'Съешь же ещё этих мягких французских булок, да выпей чаю.',
  hebrew: 'דג סקרן שט בים מאוכזב ולפתע מצא חברה.',
};

/** German specimen paragraph for waterfall (re-export from PARAGRAPHS). */
export const GERMAN_SPECIMEN = PARAGRAPHS.germanSpecimen;
