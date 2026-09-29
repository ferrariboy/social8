/**
 * BC Grade 8 Social Studies Discovery Portal - Curriculum Data
 * Comprehensive 24-Unit Schema (8 Modules x 3 Units)
 * Aligned with the British Columbia Social Studies 8 Curriculum (c. 600 CE - 1750 CE)
 */

const CURRICULUM_DATA = [
  // ==========================================
  // MODULE 1: The Foundations of Feudal Worlds
  // ==========================================
  {
    moduleId: "M1",
    moduleNumber: 1,
    moduleTitle: "Module 1: The Foundations of Feudal Worlds",
    era: "c. 500 – 1200 CE",
    description: "Explore the collapse of centralized Roman administration in Western Europe and the rise of feudalism, manorialism, and the Catholic Church as stabilizing forces.",
    units: [
      {
        unitId: "M1-U1",
        unitNumber: 1,
        title: "Unit 1: The Fragmentation of Western Europe",
        subtitle: "Charlemagne, Germanic Kingdoms, and the Treaty of Verdun",
        videoEmbedUrl: "https://www.youtube-nocookie.com/embed/H2S4a4aPj3w",
        videoTitle: "Charlemagne and the Carolingian Renaissance",
        content: {
          background: "Following the administrative collapse of the Western Roman Empire in 476 CE, Western Europe experienced radical political fragmentation. Centralized Roman military garrisons, road maintenance networks, and standardized currency systems evaporated. In their place emerged a patchwork of regional Germanic kingdoms, notably the Franks. In 800 CE, Pope Leo III crowned the Frankish king Charlemagne as 'Emperor of the Romans,' inaugurating the Holy Roman Empire. Charlemagne attempted to revive literacy, Roman legal codification, and centralized bureaucracy—an era known as the Carolingian Renaissance. However, following the death of Charlemagne's son Louis the Pious, the historic Treaty of Verdun (843 CE) partitioned the realm among his three grandsons into West Francia, Middle Francia, and East Francia, laying the geographic foundations for modern France and Germany while cementing regional fragmentation.",
          primarySource: "Excerpts from chronicler Einhard in his contemporary work 'Life of Charlemagne' (Vita Karoli Magni, c. 830 CE): 'He was constant in his exercise of riding and hunting... He also paid close attention to the liberal arts and respected scholars greatly. He tried also to write, and used to keep tablets and blank sheets under his pillow in bed, so that in his spare hours he might accustom his hand to form letters; though he began late in life and made slow progress.' This reveals the rare imperial drive to restore administrative literacy and scholarship to a fragmented post-Roman Europe.",
          focus: "Technical Focus - The Missi Dominici & Carolingian Minuscule: To govern his sprawling territories without modern telecommunications, Charlemagne instituted the Missi Dominici ('Envoys of the Ruler'). These traveling inspection pairs—combining one secular count and one church bishop—inspected county judicial courts, audited royal taxes, and curbed localized noble corruption. Simultaneously, Carolingian scholars developed 'Carolingian Minuscule,' a standardized, legible script featuring lowercase letters, spaces between words, and punctuation, which dramatically lowered copying errors in legal and religious manuscripts.",
          graphicDescription: "[MAP & ARTIFACT INDEX: Map of the Division of the Carolingian Empire under the 843 CE Treaty of Verdun, illustrating West Francia (Charles the Bald), Lotharingia / Central Kingdom (Lothair I), and East Francia (Louis the German). Accompanied by a facsimile of Carolingian Minuscule script displaying uniform letterforms and word spacing.]"
        },
        quiz: [
          {
            questionText: "Which administrative inspection system did Charlemagne implement to maintain royal supervision across his sprawling empire?",
            options: [
              "The Missi Dominici",
              "The Praetorian Guard",
              "The Janissary Corps",
              "The Imperial Bureau of Censors"
            ],
            correctIndex: 0,
            explanation: "Charlemagne dispatched the Missi Dominici ('Envoys of the Ruler') in pairs of one bishop and one noble count to inspect regional jurisdictions, audit taxes, and enforce imperial edicts."
          },
          {
            questionText: "What was the lasting geopolitical consequence of the Treaty of Verdun (843 CE)?",
            options: [
              "It permanently unified Western and Eastern Europe under Byzantine rule",
              "It divided the Frankish realm among Charlemagne's three grandsons, forming the roots of France and Germany",
              "It abolished feudal lordships in favor of democratic city councils",
              "It surrendered the Mediterranean coastline to Scandinavian Viking raiders"
            ],
            correctIndex: 1,
            explanation: "The Treaty of Verdun split the Carolingian Empire into three separate kingdoms: West Francia, Lotharingia, and East Francia, laying the historic borders that evolved into France and Germany."
          }
        ]
      },
      {
        unitId: "M1-U2",
        unitNumber: 2,
        title: "Unit 2: The Feudal Pyramid & The Manorial Economy",
        subtitle: "Lords, Vassals, Fiefs, and the Open-Field System",
        videoEmbedUrl: "https://www.youtube-nocookie.com/embed/z-_rV_8QvOI",
        videoTitle: "Feudalism and the Medieval Manor",
        content: {
          background: "Faced with persistent raids from Vikings, Magyars, and Saracens, post-Carolingian Europe lacked a standing centralized army. In response, a socio-political contract called feudalism emerged. Monarchs granted parcels of hereditary land known as fiefs to noble lords in exchange for sworn military allegiance and armored cavalry service (knights). In turn, these lords oversaw self-sufficient agricultural estates called manors. Manorialism formed the economic backbone of medieval life: unfree peasants known as serfs were legally bound to the land. In exchange for the lord's physical protection inside stone palisades and castles, serfs performed mandatory field labor (corvée), paid milling fees, and surrendered a portion of every grain harvest.",
          primarySource: "From the Anglo-Saxon Custumal of the Manor of Alwalton (1279 CE): 'Each serf owes three days of manual labor each week on the lord’s demesne land, except during harvest when five days are required. He cannot sell an ox or horse without license from the lord’s bailiff, nor may his daughter marry without payment of the merchet fee.' This legal register details the profound economic dependency and lack of personal mobility experienced by serfs on a medieval English manor.",
          focus: "Agricultural Innovations - The Heavy Plow & Three-Field Rotation: The European agricultural boom between 1000 and 1300 CE was spurred by two technological revolutions: the Carruca (a heavy, wheeled iron-tipped moldboard plow capable of turning dense clay soils of Northern Europe) and the Three-Field Crop Rotation system. By dividing arable land into Autumn planting (wheat/rye), Spring planting (nitrogen-fixing legumes, barley, oats), and Fallow pasture, crop yields increased by 16-50% while feeding draft horses equipped with new padded horse collars.",
          graphicDescription: "[SCHEMATIC DIAGRAM: Cross-section of a 12th-century medieval manor. Features the central stone manor house and village church, surrounded by the lord's demesne strips, common pastures, watermill, forge, and long narrow open-field strips cultivated through communal ox-teams.]"
        },
        quiz: [
          {
            questionText: "What was the fundamental exchange at the heart of the feudal relationship between a lord and a vassal?",
            options: [
              "Cash gold salary in exchange for foreign ambassador duties",
              "A grant of land (fief) in exchange for sworn military service and political loyalty",
              "Religious forgiveness in exchange for building village monasteries",
              "Universal voting rights in exchange for annual grain payments"
            ],
            correctIndex: 1,
            explanation: "Feudalism was founded on land tenure: a lord granted a vassal a fief (land), and in return, the vassal pledged military defense, armed knights, and sworn loyalty."
          },
          {
            questionText: "How did the introduction of the three-field crop rotation system revolutionize medieval European agriculture?",
            options: [
              "It reduced farmland use to once every ten years to preserve topsoil",
              "It allowed two-thirds of the land to be farmed simultaneously while rotating soil-enriching legumes and grains",
              "It eliminated the need for animal fertilizers or draft horses entirely",
              "It shifted all agricultural production into enclosed commercial greenhouses"
            ],
            correctIndex: 1,
            explanation: "The three-field system planted one field with winter crops, one with spring legumes (which replenished nitrogen), and left one fallow, preventing soil exhaustion and significantly boosting yields."
          }
        ]
      },
      {
        unitId: "M1-U3",
        unitNumber: 3,
        title: "Unit 3: The Medieval Church & Monasticism",
        subtitle: "Spiritual Supranational Power, Scriptoria, and Cathedrals",
        videoEmbedUrl: "https://www.youtube-nocookie.com/embed/rNCw2Mv9_5g",
        videoTitle: "The Medieval Catholic Church and Monasteries",
        content: {
          background: "In a fragmented Europe divided into hundreds of rival fiefdoms and dukedoms, the Roman Catholic Church functioned as the sole universal, supranational institution. Headed by the Pope in Rome, the Church possessed its own comprehensive legal code (Canon Law), collected a universal 10% agricultural tax (the tithe), and held unparalleled spiritual leverage through sacraments. Monarchs who defied papal edicts faced the dire threat of excommunication (personal expulsion) or interdict (the suspension of all religious sacraments across an entire kingdom). Concurrently, monastic orders following the Rule of Saint Benedict withdrew from secular society to pursue lives devoted to prayer, manual labor, and communal intellectual preservation.",
          primarySource: "From Chapter 48 of the 'Rule of Saint Benedict' (c. 530 CE): 'Idleness is the enemy of the soul. Therefore, the brothers should have specified periods for manual labor as well as for prayerful reading... When they live by the work of their hands, as our fathers and the apostles did, then they are truly monks.' This monastic mandate created an enduring institutional culture of disciplined work and manuscript production.",
          focus: "Intellectual Infrastructure - The Scriptorium & Gothic Engineering: Monastic communities served as Europe's primary intellectual repositories. In monastery scriptoria, monk-scribes spent months meticulously transcribing Latin bibles, theological treatises, and classical Greek and Roman texts onto animal parchment (vellum), illuminating them with gold leaf and minerals. By the 12th century, ecclesiastical wealth catalyzed the Gothic architectural revolution: the invention of pointed arches, ribbed vaults, and external flying buttresses allowed stone cathedrals (such as Notre-Dame and Chartres) to support soaring walls filled with stained-glass narratives.",
          graphicDescription: "[ARCHITECTURAL DIAGRAM: Structural breakdown of a Gothic Cathedral, showing how exterior flying buttresses transfer lateral thrust away from massive stained glass clerestory windows down to grounded masonry piers.]"
        },
        quiz: [
          {
            questionText: "What severe diplomatic sanction could a medieval Pope impose on a rebellious monarch that suspended all religious rites across an entire realm?",
            options: [
              "The Interdict",
              "The Inquisition Trial",
              "The Pax Romana",
              "The Feudal Investiture"
            ],
            correctIndex: 0,
            explanation: "An Interdict closed churches, denied burials in consecrated ground, and suspended public sacraments across a ruler's realm, applying immense pressure on kings from rebellious subjects."
          },
          {
            questionText: "Which architectural breakthrough allowed Gothic cathedrals to install expansive stained-glass windows instead of thick, dark Romanesque walls?",
            options: [
              "Solid concrete domes and iron steel beams",
              "Flying buttresses and ribbed groin vaults",
              "Timber cantilever trusses and sod turf roofs",
              "Corbeled brick arches without external supports"
            ],
            correctIndex: 1,
            explanation: "Flying buttresses directed the immense weight and outward thrust of stone ceilings away from walls into exterior piers, allowing walls to be filled with brilliant stained-glass windows."
          }
        ]
      }
    ]
  },

  // ==========================================
  // MODULE 2: The Islamic Golden Age & Regional Networks
  // ==========================================
  {
    moduleId: "M2",
    moduleNumber: 2,
    moduleTitle: "Module 2: The Islamic Golden Age & Regional Networks",
    era: "c. 750 – 1258 CE",
    description: "Discover how the Abbasid Caliphate, Baghdad's House of Wisdom, and Islamic Iberia catalyzed a world-changing renaissance in mathematics, astronomy, medicine, and philosophy.",
    units: [
      {
        unitId: "M2-U1",
        unitNumber: 4,
        title: "Unit 1: The Caliphates & The Pax Islamica",
        subtitle: "Trans-Eurasian Trade, Dinar Currency, and Urban Centers",
        videoEmbedUrl: "https://www.youtube-nocookie.com/embed/Tpcbfxtdo8w",
        videoTitle: "The Rise of Islamic Caliphates and Trade Networks",
        content: {
          background: "Between the 7th and 8th centuries, the rapid expansion of the Umayyad and subsequently the Abbasid Caliphates established an interconnected empire stretching from the Atlantic shores of Morocco to the borders of the Indus River valley. The Abbasid capital of Baghdad, founded in 762 CE as the 'Round City' by Caliph al-Mansur along the Tigris River, quickly grew into a metropolis of over one million residents. This vast geopolitical zone formed the 'Pax Islamica'—a zone of safe commercial travel governed by standardized Islamic commercial jurisprudence. Muslim merchants linked the Indian Ocean maritime spice routes, the trans-Saharan camel caravans, and the Silk Roads, introducing innovations in paper currency, letters of credit (suftaja), and joint-stock trade partnerships.",
          primarySource: "From the travel chronicles of Muslim merchant and geographer Ibn Hawqal in 'The Configuration of the Earth' (Surat al-Ard, c. 977 CE): 'I have seen in the city of Sijilmasa a promissory note (suftaja) written for forty-two thousand dinars from a merchant of Basra. I have never heard in any corner of the East of such vast financial transactions executed with such promptitude and legal reliability.' This demonstrates the sophisticated, cross-continental financial instruments active across the Caliphate.",
          focus: "Economic Innovation - Letters of Credit (Suftaja) & The Dinar: To avoid the immense physical peril of transporting tons of heavy gold coins past highway bandits and pirate corsairs, Abbasid merchants developed the 'suftaja' (an early ancestor of the modern bank check or promissory note). A merchant could deposit gold dinars with a licensed banker in Baghdad, receive a sealed suftaja, and redeem full cash value in Cairo, Cordoba, or Samarkand upon arrival.",
          graphicDescription: "[MAP: Abbasid Trade Networks spanning the Indian Ocean, Mediterranean Sea, and Trans-Saharan routes. Shows major trading hubs: Baghdad, Cairo, Cordoba, Basra, and Guangzhou, with trade goods including silk, spices, glassware, and gold dinar mints.]"
        },
        quiz: [
          {
            questionText: "What financial innovation developed by Islamic merchants functioned like an early cashier's check or promissory note?",
            options: [
              "The Suftaja",
              "The Guild Charter",
              "The Manorial Demesne",
              "The Domesday Ledger"
            ],
            correctIndex: 0,
            explanation: "The suftaja was a sealed letter of credit that allowed merchants to deposit money in one city and withdraw it in another, avoiding highway robbery."
          },
          {
            questionText: "Why was the geographic location of Baghdad on the Tigris River crucial to its explosion as a global hub?",
            options: [
              "It was completely isolated from all sea and caravan routes",
              "It stood at the intersection of major Silk Road overland trade and Persian Gulf maritime networks",
              "It was situated directly in the Arctic fur-trading corridor",
              "It was inaccessible to foreign diplomats and merchants"
            ],
            correctIndex: 1,
            explanation: "Baghdad was centrally positioned between the Tigris and Euphrates, granting direct riverine access to the Persian Gulf maritime network and overland Silk Road routes."
          }
        ]
      },
      {
        unitId: "M2-U2",
        unitNumber: 5,
        title: "Unit 2: The House of Wisdom & Scientific Innovations",
        subtitle: "Bayt al-Hikma, Algebra, Optics, and Ibn Sina's Canon",
        videoEmbedUrl: "https://www.youtube-nocookie.com/embed/FFp_Kz_9oOQ",
        videoTitle: "Baghdad's House of Wisdom and Scientific Golden Age",
        content: {
          background: "Under the patronage of Abbasid Caliphs Harun al-Rashid and al-Ma'mun, the Grand Library of Baghdad—known as the House of Wisdom (Bayt al-Hikma)—became the world's preeminent intellectual hub. Scholars of Muslim, Jewish, Christian, and Persian backgrounds gathered to systematically translate classical Greek (Aristotle, Euclid, Galen), Indian (Sanskrit mathematics), and Persian philosophical texts into Arabic. Rather than passively archiving knowledge, these thinkers engaged in rigorous empirical verification. Muhammad ibn Musa al-Khwarizmi formulated algebra ('al-jabr') and popularized the Hindu-Arabic numeral system and the zero concept. Ibn al-Haytham (Alhazen) pioneered the modern scientific method and revolutionized optics, while Ibn Sina (Avicenna) authored 'The Canon of Medicine', a comprehensive medical encyclopedia that remained Europe's standard textbook for over five centuries.",
          primarySource: "From Ibn al-Haytham's introduction to his masterwork 'Book of Optics' (Kitab al-Manazir, c. 1021 CE): 'The duty of the seeker after truth is not to place his trust in the writings of the ancients, but rather to question his belief in them and subject their claims to inquiry, demonstration, and empirical experiment, and not rely on the sayings of any human being whose nature is fraught with every kind of imperfection and deficiency.' This passage is one of history's clearest early formulations of the scientific method.",
          focus: "Scientific Revolution - Optics, Anatomy, and Astrolabes: Muslim astronomers perfected the brass astrolabe—a sophisticated mechanical analog computer calculating the positions of the sun and stars, determining geographic latitude, prayer times, and navigation coordinates. In medicine, hospitals (Bimaristans) were established as public healthcare centers offering specialized wards, clean running water, anatomical research, and quarantine protocols for contagious diseases.",
          graphicDescription: "[INSTRUMENT BLUEPRINT: An engraved Islamic brass astrolabe from 10th-century Isfahan, showing the rete, coordinate plates, alidade sight, and celestial degree rings used for astronomical navigation.]"
        },
        quiz: [
          {
            questionText: "Which scholar at the House of Wisdom developed foundational algebraic principles and helped transmit the decimal numeral system including zero?",
            options: [
              "Muhammad ibn Musa al-Khwarizmi",
              "Charlemagne",
              "Marco Polo",
              "Einhard the Chronicler"
            ],
            correctIndex: 0,
            explanation: "Al-Khwarizmi authored 'Al-Kitab al-mukhtasar fi hisab al-jabr wal-muqabala', from which the term 'algebra' is derived, and championed the Hindu-Arabic numerals."
          },
          {
            questionText: "What was Ibn Sina's (Avicenna) most influential contribution to medieval science?",
            options: [
              "The design of the first magnetic marine compass",
              "The Canon of Medicine, a monumental medical encyclopedia used for centuries",
              "The invention of the Gutenberg movable type printing press",
              "The creation of the feudal knight cavalry manual"
            ],
            correctIndex: 1,
            explanation: "Ibn Sina wrote 'The Canon of Medicine' (Al-Qanun fi al-Tibb), standardizing pharmacology, pathology, and clinical diagnostic methods across both the Islamic world and Europe."
          }
        ]
      },
      {
        unitId: "M2-U3",
        unitNumber: 6,
        title: "Unit 3: Al-Andalus & Mediterranean Cultural Synthesis",
        subtitle: "Cordoba's Libraries, Convivencia, and the Transmission of Knowledge",
        videoEmbedUrl: "https://www.youtube-nocookie.com/embed/jrnQCb7E8z8",
        videoTitle: "Islamic Spain: The Splendor of Cordoba and Al-Andalus",
        content: {
          background: "In 711 CE, Muslim forces crossed the Strait of Gibraltar into the Iberian Peninsula, establishing an Islamic province that evolved into the Umayyad Caliphate of Cordoba, known as Al-Andalus. By the 10th century, Cordoba was the most prosperous city in Western Europe, featuring paved and lit streets, public baths, and an imperial library containing over 400,000 cataloged manuscripts. Al-Andalus became famous for its era of 'Convivencia' (coexistence), during which Muslim rulers, Sephardic Jewish communities, and Mozarabic Christians lived in close proximity, collaborating in business, civic administration, and intellectual translation. Jewish scholars like Moses Maimonides and Muslim philosophers like Ibn Rushd (Averroes) wrote groundbreaking commentaries reconciling Aristotelian logic with religious faith.",
          primarySource: "From German nun and poet Hrosvitha of Gandersheim (c. 965 CE), writing of Cordoba from distant Saxony: 'The brilliant jewel of the world shone in the West, a city newly founded, rich and bathed in the grace of knowledge, adorned with seven hundred mosques, sixty thousand palaces, and celebrated for the profound learning of its doctors.' Her account reflects Northern Europe's awe of Iberian urbanity and scholarship.",
          focus: "Translation Centers - The Toledo Translation Movement: In the 12th century, following the Christian Reconquista of Toledo, Archbishop Raymond established the Toledo School of Translators. Teams of Arabic, Hebrew, and Latin scholars translated hundreds of scientific manuscripts from Arabic back into Latin. Works on geometry, pharmacology, astronomy, and philosophy flooded northern universities in Paris, Oxford, and Bologna, sparking Europe's High Middle Ages intellectual revival.",
          graphicDescription: "[ARCHITECTURAL SKETCH: The prayer hall of the Great Mosque of Cordoba (Mezquita), highlighting its double-tiered red-and-white horseshoe arches resting on reused Roman jasper and granite columns.]"
        },
        quiz: [
          {
            questionText: "What Spanish city was renowned during the 10th century as the intellectual capital of Western Europe with over 70 libraries and paved streets?",
            options: [
              "Cordoba",
              "London",
              "Frankfurt",
              "Vienna"
            ],
            correctIndex: 0,
            explanation: "Cordoba in Al-Andalus was Europe's most populous and technologically advanced city during the 10th century, famous for its massive libraries and street lighting."
          },
          {
            questionText: "What was the historical significance of the Toledo School of Translators in 12th-century Spain?",
            options: [
              "They banned all non-Latin scientific writings throughout the Mediterranean",
              "They translated Arabic scientific and philosophical masterworks into Latin, revitalizing European universities",
              "They built military warships for the Byzantine imperial fleet",
              "They dismantled the Silk Road caravan routes to preserve secrets"
            ],
            correctIndex: 1,
            explanation: "The Toledo translators made Islamic and preserved Greek scientific, mathematical, and philosophical texts accessible to European scholars, igniting the 12th-century European renaissance."
          }
        ]
      }
    ]
  },

  // ==========================================
  // MODULE 3: East Asian Dynasties & Medieval Japan
  // ==========================================
  {
    moduleId: "M3",
    moduleNumber: 3,
    moduleTitle: "Module 3: East Asian Dynasties & Medieval Japan",
    era: "c. 618 – 1600 CE",
    description: "Analyze the economic and maritime explosion of China's Tang, Song, and Ming dynasties, alongside the rise of the samurai warrior caste and the shogunate in feudal Japan.",
    units: [
      {
        unitId: "M3-U1",
        unitNumber: 7,
        title: "Unit 1: Tang & Song Dynasties: The Commercial Revolution",
        subtitle: "The Civil Service Meritocracy, Movable Type, and Paper Money",
        videoEmbedUrl: "https://www.youtube-nocookie.com/embed/Q-mkVSasZIM",
        videoTitle: "China's Song Dynasty: World's First Commercial Revolution",
        content: {
          background: "During the Tang (618–907 CE) and Song (960–1279 CE) dynasties, China experienced an unprecedented economic, cultural, and technological boom. The imperial government strengthened the Civil Service Examination (Keju), creating a scholar-bureaucrat elite (mandarins) based on Confucian merit rather than aristocratic birth. The construction and expansion of the Grand Canal linked the agricultural breadbasket of the southern Yangtze River basin to the northern military frontiers. In agriculture, the introduction of drought-resistant, fast-ripening Champa rice from Vietnam enabled double-cropping, causing China's population to double to over 100 million. Chinese cities became bustling commercial capitals powered by the world's first government-issued paper currency (Jiaozi).",
          primarySource: "From Song scholar-official Shen Kuo in his work 'Dream Pool Essays' (Mengxi Bitan, 1088 CE): 'During the Qingli reign, Bi Sheng, a commoner, invented movable type. His method was to take sticky clay and cut in it characters as thin as the edge of a coin. Each character formed, as it were, a single type. He baked them in the fire to make them hard... If one were to print only two or three copies, it was neither simple nor easy. But if one were to print tens, hundreds, or thousands of copies, it was marvelously rapid.' This documents the invention of movable type printing four centuries before Europe.",
          focus: "The Four Great Inventions: The Tang and Song eras perfected four technologies that transformed global history: the Magnetic Compass (south-pointing needle aiding deep-sea maritime navigation), Gunpowder (originally formulated by Daoist alchemists as an elixir of immortality, later deployed in fireworks, fire lances, and early cannons), Woodblock/Movable Type Printing, and Papermaking.",
          graphicDescription: "[HISTORICAL ILLUSTRATION: Section of the famous Song dynasty handscroll 'Along the River During the Qingming Festival' (Zhang Zeduan), depicting bustling commercial wharves, arched bridges, merchants, wine shops, and river barges in Kaifeng.]"
        },
        quiz: [
          {
            questionText: "How did the imperial Civil Service Examination (Keju) reshape Chinese governance during the Tang and Song dynasties?",
            options: [
              "It reserved all ministerial posts exclusively for hereditary warrior nobility",
              "It selected imperial bureaucrats based on competitive examinations testing Confucian philosophy and literature",
              "It allowed foreign ambassadors to appoint local provincial tax collectors",
              "It selected court officials through an annual lottery of peasant farmers"
            ],
            correctIndex: 1,
            explanation: "The Keju examinations allowed educated men of non-noble backgrounds to enter the civil service, establishing a merit-based Confucian scholar-official administration."
          },
          {
            questionText: "What was the immediate consequence of introducing fast-ripening Champa rice to Song China?",
            options: [
              "A catastrophic famine that depopulated southern river valleys",
              "Double-cropping harvests that caused China's population to soar beyond 100 million",
              "The total abandonment of the Grand Canal trade system",
              "The outlawing of paper currency in southern merchant markets"
            ],
            correctIndex: 1,
            explanation: "Champa rice matured in just 60 days instead of 120 days and resisted drought, permitting two harvests per year and fueling a massive demographic surge."
          }
        ]
      },
      {
        unitId: "M3-U2",
        unitNumber: 8,
        title: "Unit 2: The Rise of the Samurai & Feudal Japan",
        subtitle: "Shoguns, Daimyo, Bushido, and the Kamakura Bakumatsu",
        videoEmbedUrl: "https://www.youtube-nocookie.com/embed/gT42YJ1eN-k",
        videoTitle: "Feudal Japan: The Age of the Samurai and the Shogun",
        content: {
          background: "While the refined Heian court in Kyoto prioritized classical poetry and aesthetic rituals, powerful warrior clans in the provinces amassed private landholdings. In 1185 CE, following the bloody Genpei War between the Taira and Minamoto clans, Minamoto no Yoritomo seized supreme political and military control. In 1192 CE, the Emperor granted Yoritomo the title of Shogun ('Supreme Military Commander'), establishing the Kamakura Bakufu (military tent government). While the Emperor remained a revered spiritual figurehead in Kyoto, actual governing authority was held by the Shogun and distributed to regional warlords called Daimyo. Defending these lords was an elite warrior class known as Samurai, bound by a strict martial ethical code later codified as Bushido ('Way of the Warrior').",
          primarySource: "From the opening lines of 'The Tale of the Heike' (Heike Monogatari, 13th century): 'The sound of the Gion Shoja bells echoes the impermanence of all things; the color of the sala flowers reveals the truth that the prosperous must decline. The proud do not endure, they are like a dream on a spring night; the mighty fall at last, they are as dust before the wind.' This epic text captures the Zen-influenced philosophical mindset of the medieval Japanese warrior class.",
          focus: "Warrior Culture - Bushido, Castles, and Katana Metallurgy: Samurai warfare evolved from mounted archery into close-quarters swordsmanship using the curved, folded-steel Katana. Samurai adhered to strict principles of honor, loyalty to their Daimyo, and mental discipline honed through Zen Buddhism. Dishonor or failure in battle was expiated through Seppuku (ritual disembowelment). To defend their lands, Daimyo constructed multi-tiered wooden and stone fortresses with moats, angled stone bastions, and labyrinthine gatehouse traps (such as Himeji Castle).",
          graphicDescription: "[ARMOR & FORTRESS SCHEMATIC: Diagram of 14th-century Samurai O-yoroi armor (lacquered iron lamellar plates tied with silk cords, kabuto helmet with kuwagata crest, and face-mask mempo), set against the concentric stone walls and tenshu keep of Himeji Castle.]"
        },
        quiz: [
          {
            questionText: "What was the political role of the Japanese Emperor during the Kamakura and Ashikaga shogunate periods?",
            options: [
              "He held absolute day-to-day military and administrative command over all provinces",
              "He served as a sacred, ceremonial figurehead while actual political and military power resided with the Shogun",
              "He served as the chief admiral of Chinese maritime trading fleets",
              "He was exiled permanently to the island of Hokkaido"
            ],
            correctIndex: 1,
            explanation: "The Emperor retained sacred spiritual and dynastic legitimacy in Kyoto, but the Shogun (military dictator) held the real executive power, army command, and land control."
          },
          {
            questionText: "What was the martial code of ethics governing samurai behavior, emphasizing loyalty, self-discipline, and honor?",
            options: [
              "Bushido",
              "The Mandate of Heaven",
              "Chivalric Investiture",
              "Canon Law"
            ],
            correctIndex: 0,
            explanation: "Bushido ('Way of the Warrior') was the ethical code emphasizing absolute loyalty to the daimyo, personal honor, martial excellence, and acceptance of mortality."
          }
        ]
      },
      {
        unitId: "M3-U3",
        unitNumber: 9,
        title: "Unit 3: The Ming Dynasty & The Maritime Voyages of Zheng He",
        subtitle: "Treasure Fleets, The Forbidden City, and the Haijin Policy",
        videoEmbedUrl: "https://www.youtube-nocookie.com/embed/UPxUZOUUMLI",
        videoTitle: "Zheng He and the Ming Treasure Fleet Expeditions",
        content: {
          background: "In 1368 CE, peasant rebel leader Zhu Yuanzhang overthrew the Mongol-led Yuan Dynasty and proclaimed the Ming Dynasty ('Brilliant'). Seeking to assert Chinese cultural dominance and restore traditional Confucian structures, Ming emperors undertook massive public works: reinforcing and expanding the brick-faced Great Wall of China, constructing the imperial Forbidden City palace complex in Beijing, and dredging the Grand Canal. Under the third emperor, Yongle, China launched the greatest naval expeditions of the pre-modern world. Between 1405 and 1433 CE, Admiral Zheng He commanded seven massive maritime voyages across the Indian Ocean, visiting Southeast Asia, India, the Persian Gulf, and the East African coast.",
          primarySource: "Inscription on the Changle Stele erected by Zheng He in Fujian (1431 CE): 'We have traversed more than one hundred thousand li of immense water spaces and have beheld in the ocean huge waves like mountains rising sky-high, and we have set eyes on barbarian regions far away hidden in a blue haze of light vapors, while our sails loftily unfurled like clouds day and night continued their course rapid like that of a shooting star, traversing those savage waves as if we were treading a public thoroughfare.'",
          focus: "Engineering Triumph - The Treasure Ships (Baochuan): Zheng He's fleet numbered over 300 vessels manned by nearly 30,000 crewmen, physicians, astrologers, and cartographers. The flagship 'Baochuan' (Treasure Ships) were mammoth nine-masted wooden giants reportedly over 400 feet long—more than four times the size of Columbus's Santa Maria. They featured water-tight bulkhead compartments, balanced rudders, and battened lug sails. Despite this technological supremacy, following Yongle's death, Confucian scholar-officials halted the voyages, dismantled the shipyards, and enacted the Haijin (maritime trade ban) to redirect imperial taxes toward defending the northern border against nomadic incursions.",
          graphicDescription: "[COMPARATIVE SHIP DIAGRAM: Scale comparison between Zheng He's colossal 400-foot multi-masted Ming Treasure Ship and Christopher Columbus's 85-foot Santa Maria caravel, showing the stark technological scale of 15th-century Chinese naval engineering.]"
        },
        quiz: [
          {
            questionText: "What was the primary diplomatic goal of Admiral Zheng He's seven Indian Ocean voyages between 1405 and 1433?",
            options: [
              "To conquer foreign nations and convert their populations to Christianity",
              "To project imperial Ming prestige, enroll foreign kingdoms into the tribute system, and display Chinese supremacy",
              "To locate a secret polar northwest passage to northern Europe",
              "To permanently abandon mainland China and establish military colonies in Africa"
            ],
            correctIndex: 1,
            explanation: "Zheng He's treasure fleet was designed to project Ming power, secure tribute from overseas monarchs, establish trade alliances, and demonstrate the glory of the Yongle Emperor."
          },
          {
            questionText: "Why did the Ming imperial court dismantle the treasure fleet and halt maritime voyages after 1433?",
            options: [
              "The entire fleet was sunk in a single storm near the Horn of Africa",
              "Confucian scholar-officials viewed the expeditions as costly luxuries and prioritized defense against northern land threats",
              "European caravels blockaded all major Chinese coastal ports",
              "China ran completely out of iron, silk, and timber reserves"
            ],
            correctIndex: 1,
            explanation: "Conservative Confucian bureaucrats argued that the voyages squandered treasury funds that were desperately needed to rebuild the northern Great Wall against renewed Mongol threats."
          }
        ]
      }
    ]
  },

  // ==========================================
  // MODULE 4: The Mongol Empire & Trans-Eurasian Exchange
  // ==========================================
  {
    moduleId: "M4",
    moduleNumber: 4,
    moduleTitle: "Module 4: The Mongol Empire & Trans-Eurasian Exchange",
    era: "c. 1206 – 1368 CE",
    description: "Examine how Genghis Khan unified the nomadic tribes to forge the largest contiguous land empire in world history, establishing the Pax Mongolica across the Silk Roads.",
    units: [
      {
        unitId: "M4-U1",
        unitNumber: 10,
        title: "Unit 1: Genghis Khan & The Nomadic Steppe Warfare",
        subtitle: "Pastoral Nomadism, Composite Bows, and Feigned Retreats",
        videoEmbedUrl: "https://www.youtube-nocookie.com/embed/szxPar0BcMo",
        videoTitle: "Genghis Khan and the Rise of the Mongol Empire",
        content: {
          background: "In the harsh, arid grasslands of the Central Asian steppe, nomadic pastoralists lived in portable felt tents (gers or yurts), herding horses, sheep, and cattle. In 1206 CE, a charismatic warrior chieftain named Temüjin united the warring Mongol, Tatar, and Merkit tribes. At a grand tribal council (Kurultai), he was proclaimed 'Genghis Khan' ('Universal Ruler'). Breaking with aristocratic tribal tradition, Genghis promoted officers based on battlefield merit and absolute loyalty rather than noble lineage. He reorganized the entire army into decimal units (arban of 10, jagun of 100, mingghan of 1,000, and tumen of 10,000), creating the most disciplined, swift, and lethal cavalry force in medieval history.",
          primarySource: "From 'The Secret History of the Mongols' (written c. 1240 CE): 'He who has conquered his enemies and captured their lands must share the glory and the herds with those who fought by his side. Let no man advance beyond his tumen; let no man hold back when the horse-tail banners signal the charge. In hunting as in war, the circle must close without gaps.' This chronicle underscores the extreme collective discipline and egalitarian distribution of spoils instituted by Genghis Khan.",
          focus: "Tactical Superiority - The Mongol Composite Bow & Mobility: Every Mongol warrior operated with 3 to 5 hardy steppe ponies, allowing cavalry forces to travel over 100 kilometers a day without exhausting their mounts. Their primary weapon was the recurved composite bow, constructed from layers of horn, wood, and sinew, capable of penetrating armor at ranges exceeding 250 meters. In battle, they mastered psychological warfare, coordinated encirclement tactics borrowed from hunting (the Nerge), and the devastating 'feigned retreat'—luring enemy forces into chasing an apparently broken unit straight into a prepared ambush.",
          graphicDescription: "[MILITARY TACTICAL DIAGRAM: Step-by-step schematic of the Mongol 'Feigned Retreat' maneuver: Initial skirmish, staged disorganized flight, pursuers breaking formation over open terrain, followed by flanking encirclement by hidden reserve cavalry tumens firing composite bows.]"
        },
        quiz: [
          {
            questionText: "How did Genghis Khan reorganize his nomadic warrior society to break ancient tribal rivalries?",
            options: [
              "He assigned military commands strictly based on hereditary aristocratic lineage",
              "He introduced a decimal military structure and promoted officers based on merit and loyalty",
              "He abolished all horse riding and converted nomads into static infantry archers",
              "He forced all soldiers to adopt Roman legionary shields and gladius swords"
            ],
            correctIndex: 1,
            explanation: "Genghis Khan dismantled traditional aristocratic clans, organizing soldiers into decimal units (tens, hundreds, thousands, ten-thousands) led by officers chosen for merit."
          },
          {
            questionText: "What battlefield advantage allowed Mongol armies to cover distances of up to 100 kilometers per day?",
            options: [
              "Paved stone highways stretching continuously across the Gobi desert",
              "Each warrior brought multiple steppe horses, rotating mounts to prevent exhaustion",
              "Mechanical steam carts powered by coal deposits",
              "Total reliance on heavy baggage wagons pulled by oxen"
            ],
            correctIndex: 1,
            explanation: "Every warrior rode with a string of 3 to 5 durable ponies, switching mounts on the march, living on dried curd and mare's milk, and traveling without slow supply trains."
          }
        ]
      },
      {
        unitId: "M4-U2",
        unitNumber: 11,
        title: "Unit 2: Pax Mongolica & The Silk Roads",
        subtitle: "The Yam Courier Network, Paiza Passports, and Trans-Eurasian Trade",
        videoEmbedUrl: "https://www.youtube-nocookie.com/embed/v_UK_U3FbjA",
        videoTitle: "The Silk Road and the Pax Mongolica",
        content: {
          background: "At its height, the Mongol Empire spanned from the Sea of Japan to the plains of Poland, incorporating over 100 million subjects under a single imperial hegemony. This unprecedented geopolitical consolidation created the 'Pax Mongolica' (Mongol Peace). For the first time in history, merchants, diplomats, missionaries, and scientists could journey safely along the entire length of the Silk Roads. Mongol rulers enforced strict religious tolerance, codified universal laws under the Yassa, suppressed banditry, lowered tariffs, and subsidized merchant caravans (ortoq). Caravans transported raw silk, blue-and-white porcelain, Persian carpets, spices, medicinal rhubarb, and scientific treatises between Europe, the Middle East, and East Asia.",
          primarySource: "From Italian merchant Francesco Balducci Pegolotti's commercial handbook 'The Merchant’s Handbook' (Pratica della Mercatura, c. 1340 CE): 'The road you travel from Tana [Black Sea] to Cathay [China] is perfectly safe, whether by day or by night, according to what the merchants say who have used it... You will find fresh provisions and mounts at every stage along the way without harassment from armed brigands.' This highlights the unprecedented commercial safety established by Mongol governance.",
          focus: "Communication Network - The Yam Postal System & Paiza: To administer an empire that spanned 24 million square kilometers, the Mongols established the 'Yam' (Örtöö)—the world's fastest communication relay system. Relay stations spaced 40 to 50 kilometers apart maintained fresh horses, food, and lodging. Couriers carrying official inscribed metal medallions called 'Paiza' could requisition fresh mounts immediately, galloping up to 300 kilometers per day. The paiza functioned as an imperial passport, declaring that anyone who obstructed the bearer would be executed.",
          graphicDescription: "[MAP & ARTIFACT: Silk Road routes under the Pax Mongolica connecting Karakorum, Khanbaliq (Beijing), Samarkand, Tabriz, and Sarai. Inset: An engraved bronze silver-inlaid Mongol Paiza inscribed in Phags-pa script: 'By the strength of Eternal Heaven, let the name of the Khan be holy. Whosoever does not respect it shall be slain.']"
        },
        quiz: [
          {
            questionText: "What was the function of the Mongol 'Yam' (Örtöö) system across Eurasia?",
            options: [
              "A high-speed postal and messenger relay network with horse stations every 40-50 km",
              "A system of underground irrigation canals in the Gobi desert",
              "A religious monastery order dedicated to translating Buddhist scrolls",
              "A naval lighthouse network along the Persian Gulf coast"
            ],
            correctIndex: 0,
            explanation: "The Yam was an imperial courier relay system featuring stations with fresh horses and provisions, allowing messengers to ride hundreds of miles per day."
          },
          {
            questionText: "What was a 'Paiza' in the Mongol Empire?",
            options: [
              "A heavy curved sword used by siege engineers",
              "An official metal passport tablet granting safe passage and horse requisitions",
              "A tax paid exclusively by Buddhist monks",
              "A ceramic storage vessel used to transport gunpowder"
            ],
            correctIndex: 1,
            explanation: "A Paiza was an inscribed metal tablet worn by envoys and high-ranking merchants that granted official authority to requisition horses and travel without hindrance."
          }
        ]
      },
      {
        unitId: "M4-U3",
        unitNumber: 12,
        title: "Unit 3: The Four Khanates & The Eurasian Aftermath",
        subtitle: "Yuan China, The Golden Horde, Ilkhanate, and Chagatai",
        videoEmbedUrl: "https://www.youtube-nocookie.com/embed/wUVvTqvjUaM",
        videoTitle: "The Division of the Mongol Empire: The Four Khanates",
        content: {
          background: "Following the death of Möngke Khan in 1259 CE, succession disputes permanently fractured the unified empire into four autonomous khanates: the Yuan Dynasty in China and Mongolia (ruled by Kublai Khan), the Golden Horde in Russia and the Ukrainian steppe, the Ilkhanate in Persia and the Middle East, and the Chagatai Khanate in Central Asia. In China, Kublai Khan founded the Yuan Dynasty (1271–1368 CE), adopting Chinese court ritual, establishing the capital of Dadu (Beijing), and employing foreign administrators—including Venetian traveler Marco Polo. In Persia, Ilkhan Ghazan converted to Islam in 1295 CE, integrating Mongol rule with Islamic civilization. However, political fragmentation, economic inflation, peasant uprisings, and the devastating spread of the Black Death along Silk Road trade routes brought an end to Mongol hegemony by the mid-14th century.",
          primarySource: "From 'The Travels of Marco Polo' (Dictated c. 1298 CE): 'The Great Khan Kublai sits on a high throne in the midst of his hall, adorned with cloth of gold and pearls... The order and beauty of his court is so magnificent that no man who has not seen it could believe it. He causes great highways to be planted with trees, so that travelers might not lose their way, and provides hospices for the sick and needy.' This text introduced medieval Europe to the wealth and sophisticated administration of Yuan China.",
          focus: "Cultural Synthesis - Persian Miniatures & Astronomical Exchanges: Despite political division, the khanates facilitated unprecedented intellectual cross-pollination. The Ilkhanate observatory at Maragha, directed by Nasir al-Din al-Tusi, collaborated with Yuan astronomers in Beijing, sharing planetary models and spherical trigonometry. Persian manuscripts incorporated Chinese dragon and cloud motifs, while Chinese imperial medicine adopted Persian herbal remedies.",
          graphicDescription: "[MAP: Division of Eurasia into the Four Khanates c. 1280 CE: Yuan Dynasty (green, East Asia), Chagatai Khanate (orange, Central Asia), Ilkhanate (purple, Persia/Mesopotamia), and the Golden Horde (yellow, Eastern Europe/Steppes).]"
        },
        quiz: [
          {
            questionText: "Which grandson of Genghis Khan conquered the Song Dynasty, founded the Yuan Dynasty, and moved the imperial capital to Beijing (Dadu)?",
            options: [
              "Kublai Khan",
              "Batu Khan",
              "Hulagu Khan",
              "Tamerlane"
            ],
            correctIndex: 0,
            explanation: "Kublai Khan established the Yuan Dynasty in 1271, becoming Emperor of China, integrating Mongol rule with Chinese governance, and receiving Marco Polo at his court."
          },
          {
            questionText: "What catastrophic biological disaster was unintentionally accelerated by the open trade routes of the Pax Mongolica in the mid-1300s?",
            options: [
              "The spread of the Black Death (bubonic plague) across Eurasia",
              "The total extinction of Eurasian draft horses",
              "The Great Irish Potato Blight",
              "The Mediterranean malaria epidemic of 1150"
            ],
            correctIndex: 0,
            explanation: "The interconnected trade networks of the Mongol Empire inadvertently carried the Yersinia pestis bacteria from Central Asia to ports in the Black Sea and Western Europe."
          }
        ]
      }
    ]
  },

  // ==========================================
  // MODULE 5: Civilizations of Africa & The Americas
  // ==========================================
  {
    moduleId: "M5",
    moduleNumber: 5,
    moduleTitle: "Module 5: Civilizations of Africa & The Americas",
    era: "c. 800 – 1530 CE",
    description: "Explore the extraordinary engineering, urban wealth, and agricultural mastery of the Mali Empire, the Aztec Empire at Tenochtitlan, and the Inka mountain realm of Tawantinsuyu.",
    units: [
      {
        unitId: "M5-U1",
        unitNumber: 13,
        title: "Unit 1: The Empires of West Africa: Ghana, Mali, and Songhai",
        subtitle: "The Gold-Salt Trade, Mansa Musa's Hajj, and Timbuktu's Manuscripts",
        videoEmbedUrl: "https://www.youtube-nocookie.com/embed/jvnU0v6hcUo",
        videoTitle: "Mansa Musa and the Wealth of the Mali Empire",
        content: {
          background: "Across the Sahelian belt of West Africa, successive empires—Ghana, Mali, and Songhai—amassed extraordinary geopolitical power by controlling the Trans-Saharan trade routes. This commercial network rested on a vital commodity exchange: desert salt from Taghaza was traded for gold mined in the southern forests of Bambuk and Akan. Under the Mali Empire (founded by Sundiata Keita c. 1235 CE), wealth peaked during the reign of Mansa Musa (1312–1337 CE). In 1324 CE, Mansa Musa embarked on his historic pilgrimage (Hajj) to Mecca, accompanied by thousands of attendants, soldiers, and camels laden with gold. His lavish gifts and spending in Cairo distributed so much gold that the regional value of the metal plummeted for over a decade. Upon returning, he commissioned the Sankore Mosque and University in Timbuktu, transforming it into an intellectual center attracting scholars in astronomy, law, and medicine.",
          primarySource: "From Arab historian Ibn Fadlallah al-Umari, writing in Cairo in 'Masalik al-Absar' (c. 1342 CE): 'This man [Mansa Musa] flooded Cairo with his benefactions. He left no court emir nor holder of a royal office without the gift of a load of gold. The people of Cairo earned huge sums from him... Gold was at a high price in Egypt until they came in that year. The mithqal did not cease falling in price; its value was wiped out because of the amount of gold they brought into Egypt.'",
          focus: "Intellectual Legacy - The Timbuktu Manuscripts & Sudano-Sahelian Architecture: Timbuktu became a vibrant commercial book trade center where manuscripts were worth more than gold. Over 300,000 hand-written texts in Arabic and African languages recorded optics, mathematics, botany, astronomy, and human rights. Architecturally, West African builders perfected the Sudano-Sahelian style—using sun-baked adobe mud bricks reinforced with protruding wooden beams (toron) that served as permanent scaffolding during annual replastering festivals (as seen at the Great Mosque of Djenné).",
          graphicDescription: "[MAP & HISTORICAL SKETCH: The Catalan Atlas of 1375 drawn by Abraham Cresques, depicting West African caravan routes and showing Mansa Musa seated upon a throne, crowned in gold and holding a massive golden orb, greeting a camel merchant in the Sahara.]"
        },
        quiz: [
          {
            questionText: "What vital commodity mined in the Sahara was traded almost equal in value for gold mined in West Africa?",
            options: [
              "Rock Salt",
              "Timber logs",
              "Porcelain plates",
              "Silk fabrics"
            ],
            correctIndex: 0,
            explanation: "Salt was essential for human survival in hot climates to preserve meat and maintain hydration; miners cut heavy blocks of rock salt at Taghaza to trade for gold."
          },
          {
            questionText: "What was the economic consequence of Mansa Musa's 1324 pilgrimage across Cairo?",
            options: [
              "He exhausted his entire personal treasury and had to walk home on foot",
              "He distributed so much gold that he caused widespread monetary inflation for over a decade",
              "He signed a treaty surrendering Mali's mines to the Roman Pope",
              "He was captured and ransomed by Venetian privateers"
            ],
            correctIndex: 1,
            explanation: "Mansa Musa gave away and spent so much pure gold in Cairo and Mecca that the regional value of gold dropped significantly and took over a decade to recover."
          }
        ]
      },
      {
        unitId: "M5-U2",
        unitNumber: 14,
        title: "Unit 2: Mesoamerican Urban Empires: Maya and Aztecs",
        subtitle: "Tenochtitlan, Chinampas Agriculture, Glyphs, and Calendars",
        videoEmbedUrl: "https://www.youtube-nocookie.com/embed/uY2e_v25g44",
        videoTitle: "The Aztec Empire and the Island City of Tenochtitlan",
        content: {
          background: "In the Valley of Mexico, the Mexica (Aztec) civilization engineered one of the most remarkable urban centers of the pre-Columbian world: Tenochtitlan. Founded in 1325 CE on an island in Lake Texcoco following a divine prophecy (an eagle perched on a cactus devouring a serpent), Tenochtitlan expanded to over 200,000 residents—larger than Paris, London, or Madrid at the time. To sustain this dense population in a shallow saline lake basin, the Mexica developed 'chinampas' (artificial floating garden islands). Connected to the mainland by stone causeways with removable wooden drawbridges, the city was organized around the monumental Templo Mayor, where state religious rituals and tribute ceremonies took place. The Aztec Triple Alliance collected taxes in feathers, jade, cocoa beans, and warrior tunics from hundreds of conquered tributary city-states.",
          primarySource: "From Spanish conquistador Bernal Díaz del Castillo in 'The True History of the Conquest of New Spain' (recounting their 1519 arrival): 'When we saw so many cities and villages built in the water and other great towns on dry land and that straight and level causeway going towards Mexico, we were amazed and said that it was like the enchantments they tell of in the legend of Amadis, on account of the great towers and cues and buildings rising from the water... Some of our soldiers even asked whether the things that we saw were not a dream.'",
          focus: "Hydraulic Engineering & Chinampas Agriculture: Chinampas were constructed by weaving underwater wattle fences of juniper stakes into the lakebed and filling the enclosures with decaying vegetation, silt, and rich mud. Willow trees (ahuejote) were planted along borders; their deep root systems anchored the islands against erosion. Silt-fed chinampas yielded up to seven vegetable harvests per year without soil depletion. Furthermore, Aztec engineers constructed the 16-kilometer Dike of Nezahualcoyotl—a stone-and-timber floodwall with sluice gates that separated Lake Texcoco's brackish eastern waters from fresh spring water surrounding the city.",
          graphicDescription: "[ENGINEERING BLUEPRINT: Cross-section diagram of an Aztec Chinampa garden plot. Shows the layers of reeds, lake silt, ahuejote willow roots anchoring the plot, surrounding drainage canals with dugout canoes (acalli), and maize crops.]"
        },
        quiz: [
          {
            questionText: "What agricultural engineering breakthrough allowed the Aztecs to produce up to seven harvests a year around Tenochtitlan?",
            options: [
              "Deep iron moldboard plows pulled by oxen",
              "Chinampas—artificial raised garden plots constructed from reeds, lake silt, and willow trees",
              "Dry-farming terraces built exclusively on mountain peaks",
              "Extensive greenhouses warmed by volcanic thermal vents"
            ],
            correctIndex: 1,
            explanation: "Chinampas were raised garden beds built directly in shallow lakebeds, constantly irrigated by lake water and enriched with nutrient-dense canal silt."
          },
          {
            questionText: "What was the purpose of the 16-kilometer Dike of Nezahualcoyotl built across Lake Texcoco?",
            options: [
              "To prevent Spanish sailing ships from reaching the Pacific ocean",
              "To prevent floods and separate freshwater around the city from brackish water in the eastern lake",
              "To act as an impenetrable fortress wall against northern Maya armies",
              "To drain the entire lake dry for open pasture land"
            ],
            correctIndex: 1,
            explanation: "The dike acted as a hydraulic flood control barrier and segregated freshwater springs near the city from salty lake waters to the east."
          }
        ]
      },
      {
        unitId: "M5-U3",
        unitNumber: 15,
        title: "Unit 3: The Inka Empire of the Andes: Tawantinsuyu",
        subtitle: "The Qhapaq Ñan Road Network, Quipu Ledgers, and Terrace Farming",
        videoEmbedUrl: "https://www.youtube-nocookie.com/embed/UO5ktWUP44U",
        videoTitle: "The Inka Empire: Engineering Tawantinsuyu",
        content: {
          background: "Stretching over 4,000 kilometers along the spine of the South American Andes, the Inka Empire—known in Quechua as Tawantinsuyu ('The Four United Regions')—represented a triumph of high-altitude civil engineering. Ruling from their imperial capital of Cusco, situated at 3,400 meters elevation, the Inka organized an empire of 10 to 12 million subjects without the use of wheeled transport, draft animals (relying solely on llamas for light cargo), iron tools, or an alphabetic writing script. Instead, the Inka state was powered by the 'Mit'a'—a mandatory seasonal labor tax required of all citizens to build roads, terraces, suspension bridges, and fortress temples. Surplus freeze-dried potatoes (chuño) and dried llama meat (ch'arki) were stored in state storehouses (qullqas) along highways to prevent famine.",
          primarySource: "From chronicler Pedro Cieza de León in 'Chronicles of Peru' (1553): 'In all the memory of people I think there is no record of another road comparable to this, which passes through deep valleys and over snowy mountains, cut through the living rock along torrential rivers... In all these places it was clean, clear of debris, with inns, storehouses, and temples of the Sun at regular intervals. A letter could travel from Quito to Cusco in five days through the relay runners.'",
          focus: "Data & Infrastructure - The Quipu & The Qhapaq Ñan: To administer taxation, census counts, military stockpiles, and crop yields without alphabetic writing, Inka bureaucrats used the 'Quipu'. This recording device consisted of a main primary cord from which hung hundreds of multicolored cotton or camelid fiber strings; numeric values were encoded through a base-10 positional system of knots. To unite this rugged empire, the Inka constructed the 'Qhapaq Ñan'—a 40,000-kilometer paved highway system with stone staircases, tunnels cut through granite cliffs, and woven ichu-grass suspension bridges (keshwa chaca). Chasqui relay runners galloped along these roads carrying messages up to 240 kilometers per day.",
          graphicDescription: "[DATA ENCODING & ARTIFACT: Diagram of an Inka Quipu, displaying the primary horizontal cord, pendant cords of varying dyed wool colors (representing commodities), and decimal knot types (figure-eight, long knots, and single knots) encoding census data.]"
        },
        quiz: [
          {
            questionText: "How did the Inka administrative elite record census data, crop yields, and tax accounting without an alphabetic writing system?",
            options: [
              "By carving stone tablets with Egyptian hieroglyphs",
              "Using the Quipu—a complex tactile system of knotted, multicolored strings",
              "By painting wooden scrolls with animal blood dyes",
              "Through memorized songs taught exclusively to child messengers"
            ],
            correctIndex: 1,
            explanation: "The Quipu used colored cords and precise decimal-based knot placements to record complex census figures, tax obligations, and warehouse inventories."
          },
          {
            questionText: "What was the 'Mit'a' in the Inka imperial economic system?",
            options: [
              "A universal gold coin used in Andean marketplace trade",
              "A mandatory labor tax where subjects built roads, terraces, and monuments for the state",
              "A religious decree forbidding people from climbing high mountain passes",
              "A tribute paid in woven Spanish wool blankets"
            ],
            correctIndex: 1,
            explanation: "The Mit'a was a community labor tax where every able-bodied citizen performed public works (constructing roads, terrace farms, bridges, or mining) for the empire."
          }
        ]
      }
    ]
  },

  // ==========================================
  // MODULE 6: Crisis, Conflict, and Transformation in Europe
  // ==========================================
  {
    moduleId: "M6",
    moduleNumber: 6,
    moduleTitle: "Module 6: Crisis, Conflict, and Transformation in Europe",
    era: "c. 1095 – 1453 CE",
    description: "Investigate the seismic shocks that dismantled medieval feudalism: the Crusades, the Black Death pandemic, and the military revolution of the Hundred Years' War.",
    units: [
      {
        unitId: "M6-U1",
        unitNumber: 16,
        title: "Unit 1: The Crusades: Contact, Conquest, and Repercussions",
        subtitle: "The Council of Clermont, Crusader States, and Mediterranean Trade",
        videoEmbedUrl: "https://www.youtube-nocookie.com/embed/X0zudTQelzI",
        videoTitle: "The Crusades: Pilgrimage, Warfare, and Cultural Contact",
        content: {
          background: "In November 1095 CE, at the Council of Clermont, Pope Urban II delivered an impassioned sermon calling upon European nobles and knights to cease internal warfare and march east to assist the Byzantine Empire and 'liberate' Jerusalem from Seljuk Muslim rule. Promising the remission of sins, the First Crusade culminated in the bloody capture of Jerusalem in 1099 CE and the establishment of four Latin Crusader States (Edessa, Antioch, Tripoli, and Jerusalem). Subsequent crusades, including the Third Crusade featuring Richard the Lionheart and the Kurdish sultan Saladin, ended in negotiated truces permitting unarmed Christian pilgrims access to holy shrines. The catastrophic Fourth Crusade (1204 CE) demonstrated shifting motives when Venetian merchants diverted crusader armies to sack the Christian Byzantine capital of Constantinople.",
          primarySource: "From Arab historian and warrior Usama ibn Munqidh in his autobiographical memoir 'The Book of Contemplation' (Kitab al-I'tibar, c. 1180 CE): 'Among the Franks there are some who have settled among us and cultivated friendships with Muslims. These are much superior to those who have recently arrived from their own lands... One day I entered the al-Aqsa mosque, which was occupied by the Templars, who were my friends. When I stood up to pray, they placed a small chapel at my disposal so I might perform my prayers in peace.' This reveals complex intercultural accommodation alongside military hostilities.",
          focus: "Economic & Cultural Repercussions: While militarily failing to maintain permanent control over the Levant, the Crusades profoundly transformed Western Europe. Italian maritime republics (Venice, Genoa, and Pisa) grew immensely wealthy by chartering naval transports and establishing trading outposts in the eastern Mediterranean. Returning crusaders brought home demands for Eastern luxury commodities: cane sugar, silk, spices, damask textiles, mirrors, and citrus fruits. Contact also exposed European scholars to advanced Islamic cartography, navigational instruments, and rediscovered Greek philosophical texts.",
          graphicDescription: "[TACTICAL MAP: Routes of the Major Crusades across Europe and the Mediterranean toward the Levant. Features trade routes of Venetian galleys and highlights the Four Crusader Outremer States surrounded by the Fatimid and Seljuk realms.]"
        },
        quiz: [
          {
            questionText: "What major commercial consequence for Italian city-states like Venice and Genoa resulted from the Crusades?",
            options: [
              "They were completely bankrupted and lost all Mediterranean shipping ports",
              "They established lucrative trading monopolies connecting Eastern luxury goods to European markets",
              "They relocated their merchant headquarters permanently to the Baltic Sea",
              "They banned all naval trade with the Byzantine Empire and North Africa"
            ],
            correctIndex: 1,
            explanation: "Venetian and Genoese merchants built naval fleets to transport crusaders and in return secured trading outposts, establishing monopolies on silk, sugar, and spice imports."
          },
          {
            questionText: "What was the tragic outcome of the Fourth Crusade in 1204 CE?",
            options: [
              "Crusader armies completely converted to Islam in Damascus",
              "Crusaders attacked and sacked the Christian Byzantine capital of Constantinople instead of marching to Jerusalem",
              "The crusader fleet was lost navigating around southern Africa",
              "Saladin conquered Rome and dissolved the Papacy"
            ],
            correctIndex: 1,
            explanation: "Diverted by Venetian commercial interests and Byzantine political intrigue, crusaders sacked Constantinople, shattering Byzantine power and deepening the East-West Christian schism."
          }
        ]
      },
      {
        unitId: "M6-U2",
        unitNumber: 17,
        title: "Unit 2: The Black Death (Yersinia Pestis) & Social Upheaval",
        subtitle: "The 1347 Pandemic, Demographic Shock, and the Peasant Revolts",
        videoEmbedUrl: "https://www.youtube-nocookie.com/embed/m5_AK0NpP6U",
        videoTitle: "The Black Death: The Pandemic That Changed Europe",
        content: {
          background: "In October 1347 CE, twelve Genoese trading galleys arrived in Messina, Sicily, carrying dying sailors covered in black, oozing swellings. The Black Death—caused by the bacterium Yersinia pestis and transmitted through rat fleas hitchhiking on merchant grain ships—swept across Western Europe with ferocious lethality. Between 1347 and 1351 CE, the pandemic extinguished an estimated 30% to 60% of Europe's entire population (over 25 million people). With no understanding of microscopic germ theory, medieval populations attributed the plague to divine wrath, poisonous planetary alignments ('miasmas'), or blamed scapegoated minority populations. Entire villages were abandoned, agricultural fields reverted to wilderness, and social hierarchies collapsed under existential terror.",
          primarySource: "From Florentine author Giovanni Boccaccio in the introduction to 'The Decameron' (c. 1353 CE): 'The condition of the lower and middle classes was even more pitiable to behold... Thousands fell sick daily, and being without care or aid, almost all died. Many breathed their last in the open streets, day and night; and of many others who died at home, the neighbors knew nothing until the stench of their decaying bodies betrayed them... Brother was abandoned by brother, uncle by nephew, and often the wife by her husband; what is even worse, fathers and mothers refused to nurse their own children.'",
          focus: "Socio-Economic Upheaval - The Collapse of Serfdom: The sudden, catastrophic shortage of agricultural labor upended the centuries-old feudal order. With fields rotting unharvested, surviving peasants realized their labor was now indispensable. Serfs demanded cash wages, lower rents, and the freedom to leave estates for better pay. When monarchs and lords attempted to freeze wages at pre-plague levels (such as England's Statute of Laborers in 1351), violent insurrections erupted—notably the Jacquerie in France (1358) and the English Peasants' Revolt of 1381 led by Wat Tyler. Serfdom began steadily unraveling across Western Europe.",
          graphicDescription: "[EPIDEMIOLOGICAL MAP & WOODCUT: Map displaying the chronologic wave-front spread of the plague from the Black Sea port of Kaffa through Mediterranean ports to London and Scandinavia (1347-1351). Inset: The Danse Macabre woodcut depicting skeletons dancing with popes, kings, and laborers alike.]"
        },
        quiz: [
          {
            questionText: "How did the demographic collapse caused by the Black Death alter the balance of power between European peasants and feudal lords?",
            options: [
              "It caused serfs to lose all bargaining power, resulting in lifelong enslavement",
              "The severe labor shortage enabled surviving peasants to demand higher wages and loosened the restrictions of serfdom",
              "It forced all peasants to abandon farming permanently and live exclusively in monastery cloisters",
              "It abolished all private property across Europe"
            ],
            correctIndex: 1,
            explanation: "Because so many laborers died, surviving workers were in high demand and could demand cash wages and lower rents, accelerating the decline of feudal manorialism."
          },
          {
            questionText: "What was the biological vector responsible for transmitting the bubonic plague bacterium Yersinia pestis?",
            options: [
              "Fleas living on black rats that traveled aboard merchant ships and cargo wagons",
              "Drinking contaminated mountain stream water during winter",
              "Mosquitoes breeding in stagnant rice paddies",
              "Eating infected beef from wild cattle"
            ],
            correctIndex: 0,
            explanation: "Yersinia pestis was carried by fleas hosted on black rats (Rattus rattus), which traveled along commercial trade routes in grain sacks and ship holds."
          }
        ]
      },
      {
        unitId: "M6-U3",
        unitNumber: 18,
        title: "Unit 3: The Hundred Years' War & The Decline of Chivalry",
        subtitle: "The English Longbow, Gunpowder Artillery, and Joan of Arc",
        videoEmbedUrl: "https://www.youtube-nocookie.com/embed/kbhQYp_k53o",
        videoTitle: "The Hundred Years' War and the Military Revolution",
        content: {
          background: "Between 1337 and 1453 CE, the kingdoms of England and France fought an intermittent series of destructive conflicts known as the Hundred Years' War. Sparked by English claims to the French crown through Edward III and disputes over the valuable wine-producing duchy of Gascony and Flemish wool markets, the war fundamentally transformed European warfare. Early battles—notably Crécy (1346) and Agincourt (1415)—shattered the traditional dominance of heavy armored noble cavalry. English yeomen armed with six-foot yew longbows rained armor-piercing bodkin arrows down on French knights trapped in muddy terrain. In 1429, a teenage peasant girl named Joan of Arc claimed divine visions, inspired the demoralized French Dauphin Charles VII, and broke the English siege of Orléans.",
          primarySource: "From French chronicler Enguerrand de Monstrelet's account of the Battle of Agincourt (1415 CE): 'The French were so burdened with heavy armor they could hardly move forward through the sodden mud, which was knee-deep... The English archers, seeing this, shot their arrows with such fury that none dared face them; then, dropping their bows, they fell upon the French knights with axes, swords, and mallets, slaughtering thousands while the king looked on in dismay.'",
          focus: "Military Revolution - The Longbow & Gunpowder Cannons: The Hundred Years' War marked the end of the chivalric knight as the decisive battlefield unit. The English Longbow fired 10 to 12 arrows per minute with killing power at 200 yards. Towards the war's conclusion, French kings developed the Bureau brothers' modernized gunpowder siege artillery. French cannons smashed through stone castle walls at Castillon (1453), expelling the English from all continental territories except Calais. Monarchs began bypassing feudal levies entirely, hiring permanent standing royal armies funded by centralized taxation.",
          graphicDescription: "[MILITARY TECHNOLOGY DIAGRAM: Side-by-side comparison of a Welsh/English yew Longbow with armor-piercing bodkin arrowhead, alongside an early cast-bronze French siege bombard cannon mounted on a wheeled wooden chassis.]"
        },
        quiz: [
          {
            questionText: "Which weapon employed by English yeomen at the Battle of Agincourt decisively decimated the charge of armored French chivalric knights?",
            options: [
              "The Welsh Longbow",
              "The Roman Pilum javelin",
              "The Samurai Katana",
              "The Macedonian Sarissa spear"
            ],
            correctIndex: 0,
            explanation: "The six-foot English longbow had rapid firing speed and steel bodkin points capable of piercing plate armor and unhorsing charging cavalry in wet mud."
          },
          {
            questionText: "What was the long-term political impact of the Hundred Years' War on European governance?",
            options: [
              "It destroyed centralized monarchies and empowered local feudal barons",
              "It accelerated the rise of centralized nation-states with standing armies funded by royal taxes",
              "It united France and England permanently under a shared parliament",
              "It resulted in the total collapse of all European textile trade"
            ],
            correctIndex: 1,
            explanation: "The war stimulated early national identity in both France and England, and required monarchs to build permanent standing royal armies financed through centralized state taxation."
          }
        ]
      }
    ]
  },

  // ==========================================
  // MODULE 7: The European Renaissance, Reformation, and Worldviews
  // ==========================================
  {
    moduleId: "M7",
    moduleNumber: 7,
    moduleTitle: "Module 7: The European Renaissance, Reformation, and Worldviews",
    era: "c. 1350 – 1600 CE",
    description: "Witness the flowering of humanism in Renaissance Italy, the democratization of literacy via Gutenberg's printing press, and the religious upheaval of the Protestant Reformation.",
    units: [
      {
        unitId: "M7-U1",
        unitNumber: 19,
        title: "Unit 1: The Italian Renaissance & Humanism",
        subtitle: "Florence, Medici Patronage, Linear Perspective, and Civic Virtue",
        videoEmbedUrl: "https://www.youtube-nocookie.com/embed/Vufba_ZcoR0",
        videoTitle: "The Renaissance: Florence, Humanism, and Art",
        content: {
          background: "Beginning in the 14th century in prosperous northern Italian city-states like Florence, Venice, and Milan, a cultural movement known as the Renaissance ('Rebirth') emerged. Enriched by Mediterranean trade and textile manufacturing, wealthy merchant dynasties—most famously the Medici family of Florence—channeled immense wealth into artistic and architectural patronage. Renaissance thinkers turned away from medieval scholasticism toward 'Humanism' (Studia Humanitatis). Championed by scholars like Francesco Petrarch, humanists sought out forgotten classical Roman and Greek manuscripts, emphasizing human reason, individual agency, and civic virtue. In the visual arts, polymaths such as Leonardo da Vinci, Michelangelo, and Brunelleschi fused empirical anatomical observation with mathematical linear perspective to create lifelike art.",
          primarySource: "From Italian philosopher Pico della Mirandola in 'Oration on the Dignity of Man' (1486 CE): 'We have given you, O Adam, no fixed place, no form of your own, nor any gift peculiar to yourself alone, so that according to your own longing and judgment you may have and possess whatever place, whatever form you desire... You, constrained by no limits, may determine your own nature through your own free will, in whose hand I have placed you.' This text epitomizes the Renaissance celebration of human capability and potential.",
          focus: "Artistic Innovation - Linear Perspective & Chiaroscuro: Filippo Brunelleschi formulated the mathematical rules of Linear Perspective around 1415 CE. By establishing a horizon line and a single vanishing point toward which all parallel lines (orthogonals) converge, artists created the illusion of realistic three-dimensional depth on a two-dimensional surface. Combined with Chiaroscuro (the subtle modulation of light and shadow to model rounded volume) and anatomical dissection, Renaissance painting broke radically from flat, symbolic medieval styles.",
          graphicDescription: "[GEOMETRIC ART DIAGRAM: Brunelleschi's system of single-point Linear Perspective demonstrating how orthogonal sightlines converge from the viewer's eye onto the central Vanishing Point across a tiled floor grid.]"
        },
        quiz: [
          {
            questionText: "What was the central philosophy of Renaissance Humanism as promoted by Petrarch and other Italian scholars?",
            options: [
              "The total rejection of literacy and classical texts in favor of blind superstition",
              "An intellectual movement emphasizing human dignity, individual potential, and classical Greco-Roman learning",
              "A military philosophy advocating the destruction of all Italian merchant banks",
              "The belief that only monks in monasteries should be permitted to read"
            ],
            correctIndex: 1,
            explanation: "Humanism focused on the study of classical antiquity (history, literature, philosophy, rhetoric) to cultivate human potential, critical thinking, and civic virtue."
          },
          {
            questionText: "Which technical breakthrough allowed Renaissance artists like Brunelleschi and Leonardo to render convincing three-dimensional space on a flat surface?",
            options: [
              "Mathematical linear perspective using a vanishing point",
              "Gold leaf background foiling",
              "Stylized two-dimensional hieroglyphic outlines",
              "Unblended tempera egg washes without shadows"
            ],
            correctIndex: 0,
            explanation: "Linear perspective used mathematical geometry with a horizon line and converging orthogonal lines to create the optical illusion of realistic depth."
          }
        ]
      },
      {
        unitId: "M7-U2",
        unitNumber: 20,
        title: "Unit 2: The Printing Press & Information Revolution",
        subtitle: "Johannes Gutenberg, Movable Metal Type, and Vernacular Literacy",
        videoEmbedUrl: "https://www.youtube-nocookie.com/embed/1oIEkK7i-kI",
        videoTitle: "Johannes Gutenberg and the Printing Press Revolution",
        content: {
          background: "Around 1440 CE in Mainz, Germany, a goldsmith named Johannes Gutenberg synthesized several existing technologies into a revolutionary communications system: the movable metal type printing press. Prior to Gutenberg, every book in Europe had to be laboriously copied by hand by scribes onto expensive animal vellum; a single Bible could take a monastery scriptorium a full year to produce and cost more than a vineyard. Gutenberg created durable, interchangeable punch-cut alloy metal type pieces (lead, tin, and antimony), an oil-based printing ink that adhered to metal, and adapted a wooden screw press used in winemaking. In 1455 CE, he demonstrated the commercial feasibility of his invention by publishing the 42-Line Gutenberg Bible.",
          primarySource: "From German humanist and poet Sebastian Brant in 'The Ship of Fools' (Das Narrenschiff, 1494 CE): 'O happy Germany, that was deemed worthy to invent this glorious art! What blessings this noble craft hath brought! Now all men may purchase books at small cost; divine scripture is brought to every village, and the treasures of philosophy are no longer hidden away behind monastery gates for the eyes of the few.'",
          focus: "The Media Revolution - Standardization & Censorship Crises: By 1500 CE, print shops operated in over 250 European cities, producing an estimated 20 million volumes (incunabula)—more books than Europe had produced in the preceding thousand years. The printing press democratized literacy, standardized vernacular national languages (German, English, French, Italian) over Latin, and allowed new scientific and political ideas to spread uncontrollably. When authorities attempted to suppress dissenting ideas, printers simply published anonymous pamphlets under forged colophons overnight.",
          graphicDescription: "[SCHEMATIC DIAGRAM: The Gutenberg wooden screw press mechanism. Displays the hand mold for casting movable lead alloy type, the type-case composing stick, ink leather dabbers, and the weighted screw platen pressing damp rag paper.]"
        },
        quiz: [
          {
            questionText: "What alloy combination did Gutenberg engineer to ensure movable type would not break or shrink during cooling?",
            options: [
              "Pure gold and silver",
              "Lead, tin, and antimony",
              "Cast iron and mercury",
              "Copper and volcanic pumice"
            ],
            correctIndex: 1,
            explanation: "Gutenberg's metallurgical breakthrough used a precise alloy of lead, tin, and antimony that melted at low temperatures and expanded slightly upon cooling to create sharp type edges."
          },
          {
            questionText: "How did the spread of the printing press fundamentally change European society by 1500 CE?",
            options: [
              "It made books exclusively affordable to royal kings and dukes",
              "It dramatically reduced book production costs, increased literacy, and standardized vernacular languages",
              "It eliminated the German language in favor of classical Hebrew",
              "It caused the total closure of all European universities"
            ],
            correctIndex: 1,
            explanation: "The press drastically lowered the cost of books, democratized reading beyond clergy, and enabled rapid dissemination of religious and scientific ideas."
          }
        ]
      },
      {
        unitId: "M7-U3",
        unitNumber: 21,
        title: "Unit 3: The Protestant Reformation & Religious Schism",
        subtitle: "Martin Luther's 95 Theses, Indulgences, and the Peace of Augsburg",
        videoEmbedUrl: "https://www.youtube-nocookie.com/embed/1o8oIELbNxE",
        videoTitle: "The Protestant Reformation: Luther and Religious Schism",
        content: {
          background: "On October 31, 1517 CE, an Augustinian monk and university theology professor named Martin Luther nailed his Ninety-Five Theses to the door of All Saints' Church in Wittenberg, Germany. Luther was outraged by the aggressive sale of papal indulgences—certificates marketed by the Dominican friar Johann Tetzel that promised to release souls from purgatory in exchange for cash donations to reconstruct St. Peter's Basilica in Rome. Luther argued that salvation could not be bought; rather, forgiveness was a free gift from God received through faith alone (sola fide) and that religious authority rested entirely in the Bible (sola scriptura), not papal decrees. Thanks to the printing press, Luther's German writings spread across Europe in weeks, igniting the Protestant Reformation and shattering Western Christendom's religious unity.",
          primarySource: "Martin Luther's defiant declaration at the Imperial Diet of Worms before Holy Roman Emperor Charles V (1521 CE): 'Unless I am convinced by the testimony of the Scriptures or by clear reason (for I do not trust either in the Pope or in councils alone, since it is well known that they have often erred and contradicted themselves), I am bound by the Scriptures I have quoted and my conscience is captive to the Word of God. I cannot and I will not recant anything, since it is neither safe nor right to go against conscience. Here I stand, I can do no other, may God help me. Amen.'",
          focus: "Political Repercussions - The Peace of Augsburg (1555 CE): The Reformation quickly became a political struggle. German princes seized upon Lutheranism as a legitimate means to confiscate wealthy Catholic monastic lands and assert territorial independence from the Holy Roman Emperor. Decades of religious conflict ended temporarily with the Peace of Augsburg (1555 CE), which established the principle 'Cuius regio, eius religio' ('Whose realm, his religion')—granting each regional prince the legal right to determine whether his lands would be Lutheran or Catholic, permanently fracturing the empire.",
          graphicDescription: "[HISTORICAL WOODCUT: Lucas Cranach the Elder's Reformation polemical woodcut comparing Christ washing his disciples' feet on one side with the Pope demanding kings kiss his velvet slippers on the other, designed to spread rapidly among illiterate townspeople.]"
        },
        quiz: [
          {
            questionText: "What specific church practice prompted Martin Luther to draft and distribute his famous Ninety-Five Theses in 1517?",
            options: [
              "The practice of building Gothic stained glass cathedrals",
              "The aggressive commercial sale of papal indulgences promising remission of sins",
              "The translation of the Latin Bible into local German dialects",
              "The introduction of organ music into Sunday church services"
            ],
            correctIndex: 1,
            explanation: "Luther attacked the abusive sale of indulgences, arguing that the Church could not sell salvation for money and that salvation came through faith alone."
          },
          {
            questionText: "What constitutional principle was established by the Peace of Augsburg (1555) in the Holy Roman Empire?",
            options: [
              "Universal religious freedom for all individual peasants and serfs",
              "Cuius regio, eius religio: each territorial prince decided the religion of his own realm",
              "The total banning of all Christian denominations across Germany",
              "The transfer of all papal authority to the King of England"
            ],
            correctIndex: 1,
            explanation: "The Peace of Augsburg codified 'Cuius regio, eius religio', permitting German princes to choose between Catholicism and Lutheranism for their territories."
          }
        ]
      }
    ]
  },

  // ==========================================
  // MODULE 8: The Age of Exploration & Global Interconnection (to 1750)
  // ==========================================
  {
    moduleId: "M8",
    moduleNumber: 8,
    moduleTitle: "Module 8: The Age of Exploration & Global Interconnection",
    era: "c. 1450 – 1750 CE",
    description: "Analyze how maritime technologies, the Portuguese caravel, the Columbian Exchange, and transatlantic mercantile trade permanently interconnected global world systems by 1750.",
    units: [
      {
        unitId: "M8-U1",
        unitNumber: 22,
        title: "Unit 1: Maritime Innovations & The Portuguese Caravels",
        subtitle: "Prince Henry, Astrolabes, Lateen Sails, and the Route to India",
        videoEmbedUrl: "https://www.youtube-nocookie.com/embed/1v0o9_L8Z-M",
        videoTitle: "The Age of Exploration: Portuguese Navigators and Caravels",
        content: {
          background: "Following the Ottoman capture of Constantinople in 1453 CE, traditional overland Silk Road trade routes were subjected to heavy tariffs, motivating Western European kingdoms to seek direct maritime routes to the spice-rich markets of South and Southeast Asia. Positioned on Europe's Atlantic rim, the Kingdom of Portugal led this maritime expansion. Under the patronage of Prince Henry the Navigator, Portuguese cartographers, astronomers, and shipwrights congregated at Sagres to synthesize maritime knowledge. Portuguese navigators progressively charted the western coast of Africa. In 1488 CE, Bartolomeu Dias rounded the stormy Cape of Good Hope, and in 1498 CE, Vasco da Gama successfully crossed the Indian Ocean to Calicut, India, securing a direct oceanic spice trade route for Europe.",
          primarySource: "From the anonymous shipboard journal of Vasco da Gama's First Voyage (Roteiro, 1498 CE): 'When we arrived at Calicut, the captain-major sent a messenger ashore... The Moors surrounded him, and two Christians of Tunis greeted him in Castilian saying: 'May the Devil take thee! What brought thee hither?' And he answered: 'We come in search of Christians and spices.' This succinct statement encapsulated the dual religious and commercial motivations driving European oceanic exploration.",
          focus: "Nautical Technology - The Caravel & Volta do Mar: Portuguese shipbuilders created the 'Caravel'—a light, maneuverable, shallow-draft vessel combining Atlantic square-rigged sails with triangular Mediterranean 'lateen' sails. Lateen sails allowed ships to tack into the wind (sail close to the wind direction). To return safely from southern Africa against prevailing headwinds, Portuguese captains perfected the 'Volta do Mar' ('turn of the sea')—a counterintuitive navigation maneuver where ships sailed far west into the open Atlantic to catch circular prevailing wind systems.",
          graphicDescription: "[NAUTICAL BLUEPRINT: Blueprint schematic of a Portuguese Caravel (such as the Nina). Highlights the triangular lateen rigging, sternpost rudder, shallow hull draft, along with navigation tools: mariner's astrolabe, quadrant, and lead-line sounding weight.]"
        },
        quiz: [
          {
            questionText: "What was the technical advantage of the triangular lateen sail utilized on Portuguese caravels?",
            options: [
              "It allowed ships to sail efficiently against the wind by tacking",
              "It allowed ships to submerge underwater during naval cannon battles",
              "It completely eliminated the need for human helmsmen or rudders",
              "It could only catch wind blowing directly from behind the stern"
            ],
            correctIndex: 0,
            explanation: "Lateen sails allowed caravels to sail at an angle across the wind (tacking), enabling explorers to return home against prevailing coastal wind currents."
          },
          {
            questionText: "Which Portuguese explorer rounded the Cape of Good Hope and sailed across the Indian Ocean to reach Calicut, India in 1498?",
            options: [
              "Vasco da Gama",
              "Christopher Columbus",
              "Ferdinand Magellan",
              "Hernán Cortés"
            ],
            correctIndex: 0,
            explanation: "Vasco da Gama commanded the first European expedition to reach India by sailing around Africa, establishing direct maritime spice trade access for Portugal."
          }
        ]
      },
      {
        unitId: "M8-U2",
        unitNumber: 23,
        title: "Unit 2: The Columbian Exchange & Ecological Transformation",
        subtitle: "Pathogens, Crops, Livestock, and the Demographic Great Dying",
        videoEmbedUrl: "https://www.youtube-nocookie.com/embed/HQPA5oNpfM4",
        videoTitle: "The Columbian Exchange: Crash Course World History",
        content: {
          background: "The voyage of Christopher Columbus in 1492 CE initiated the 'Columbian Exchange'—the unprecedented transatlantic transfer of biological organisms, agricultural crops, human populations, and infectious diseases between the Eastern and Western Hemispheres. Because Indigenous peoples of the Americas had been immunologically isolated from Afro-Eurasia for millennia, they possessed no antibodies against crowd diseases like smallpox, measles, influenza, and typhus. The introduction of these pathogens caused 'The Great Dying,' extinguishing an estimated 80% to 90% of the Indigenous population within a century. In reverse, American domesticates transformed Afro-Eurasian agriculture: calorically dense potatoes, sweet potatoes, maize, cassava, tomatoes, and chili peppers sparked population explosions across Europe, China, and Africa.",
          primarySource: "From the indigenous Nahuatl perspective recorded in the Florentine Codex (compiled by Bernardino de Sahagún, c. 1576): 'Before the Spaniards appeared to us, there occurred an epidemic of a sickness, a sore sickness: it came over the people to be their devastation. It was smallpox; it spread over the people with great destruction of men. Many died of it; no longer could they walk, but lay in their dwellings and beds. They could not move; they could not turn by themselves. And very many starved to death, for there was none to feed them.'",
          focus: "Ecological Revolution - The Global Spread of Crops & Livestock: While European pigs, cattle, and horses altered American ecosystems and plains cultures, American crops revolutionized European food security. The potato produced three times more calories per acre of poor soil than traditional wheat or rye, drastically reducing cyclical European famines. In China, drought-resistant sweet potatoes and maize allowed mountain slopes to be farmed, fueling the Qing dynasty's massive population boom.",
          graphicDescription: "[BIOLOGICAL EXCHANGE SCHEMATIC: Infographic showing organisms traveling across the Atlantic. From Americas to Afro-Eurasia: Potatoes, Maize, Tomatoes, Cacao, Tobacco, Syphilis. From Afro-Eurasia to Americas: Smallpox, Measles, Horses, Cattle, Sugar Cane, Coffee, Wheat.]"
        },
        quiz: [
          {
            questionText: "Why were Old World infectious diseases like smallpox and measles so devastating to Indigenous American populations after 1492?",
            options: [
              "Indigenous communities had zero pre-existing immunological exposure or antibodies against these pathogens",
              "The diseases were artificially synthesized in Spanish laboratory facilities",
              "Indigenous diets contained no vitamin C or proteins",
              "The diseases only infected people who consumed maize and cassava"
            ],
            correctIndex: 0,
            explanation: "Due to geographic isolation, Indigenous Americans had no previous exposure or acquired immunity to Afro-Eurasian pathogens, causing mortality rates up to 90%."
          },
          {
            questionText: "How did American domestic crops like potatoes and maize transform European and Asian societies?",
            options: [
              "They caused massive widespread agricultural famine across Europe",
              "They provided dense caloric nutrition that spurred demographic growth and reduced famines",
              "They completely replaced rice farming throughout Southeast Asia",
              "They poisoned European draft horses and livestock"
            ],
            correctIndex: 1,
            explanation: "Potatoes, maize, and cassava yielded far more calories per acre than Old World grains, stabilizing food supplies and fueling global population growth."
          }
        ]
      },
      {
        unitId: "M8-U3",
        unitNumber: 24,
        title: "Unit 3: Transatlantic Trade & The Early Modern World System",
        subtitle: "The Middle Passage, Mercantilism, Potosí Silver, and Global Networks",
        videoEmbedUrl: "https://www.youtube-nocookie.com/embed/dnV_MTFEGIY",
        videoTitle: "The Atlantic Slave Trade and Mercantilism",
        content: {
          background: "By the 17th and 18th centuries, European maritime powers (Spain, Portugal, England, France, and the Netherlands) had constructed a globally integrated economic system governed by 'Mercantilism'—the economic theory that a nation's power depended on accumulating bullion (gold and silver) by maintaining a positive balance of trade through colonial monopolies. In the Americas, the catastrophic collapse of Indigenous populations collided with the rapid expansion of labor-intensive plantation cash crops (sugar cane, tobacco, cotton). European merchants organized the brutal Triangular Trade across the Atlantic: European manufactured weapons and textiles were traded in West Africa for enslaved human beings; millions were forced through the horrific 'Middle Passage' to the Americas, and plantation commodities were shipped back to European factories. Simultaneously, silver mined by conscripted workers at Potosí (Bolivia) flowed across the Pacific in Manila Galleons to purchase Chinese silk and porcelain, creating history's first truly global financial network by 1750.",
          primarySource: "From Olaudah Equiano in 'The Interesting Narrative of the Life of Olaudah Equiano' (1789), describing the Middle Passage: 'The stench of the hold while we were on the coast was so intolerably loathsome, that it was dangerous to remain there for any time... The closeness of the place, and the heat of the climate, added to the number in the ship, which was so crowded that each had scarcely room to turn himself, almost suffocated us. The shrieks of the women, and the groans of the dying, rendered the whole a scene of horror almost inconceivable.'",
          focus: "Global Economy - The Manila Galleons & The Silver Drain: Spain's extraction of hundreds of thousands of tons of silver from the Cerro Rico at Potosí transformed international commerce. Under the Ming dynasty's Single Whip Law, all imperial taxes in China had to be paid in pure silver. Spanish Manila Galleons sailed annually between Acapulco (Mexico) and Manila (Philippines), trading Mexican silver pesos for Chinese silk, tea, and porcelain. Silver functioned as the world's universal reserve currency, directly linking the economies of the Americas, Europe, and Asia.",
          graphicDescription: "[GLOBAL TRADE DIAGRAM: The 18th-century Global Mercantile Network: Triangular Atlantic trade routes (manufactured goods, enslaved Africans via Middle Passage, raw sugar/tobacco), alongside the Pacific Manila Galleon silver route connecting Potosí, Acapulco, and China.]"
        },
        quiz: [
          {
            questionText: "What was the dominant economic theory guiding European colonial powers in the 17th and 18th centuries, emphasizing bullion accumulation and trade surpluses?",
            options: [
              "Mercantilism",
              "Feudal Manorialism",
              "Industrial Socialism",
              "Anarcho-Syndicalism"
            ],
            correctIndex: 0,
            explanation: "Mercantilism held that national wealth and geopolitical dominance required accumulating gold and silver reserves while controlling colonial raw materials and export markets."
          },
          {
            questionText: "What Pacific trade route transported silver mined in the Americas directly to Asia in exchange for Chinese silk and porcelain?",
            options: [
              "The Manila Galleon route between Acapulco and the Philippines",
              "The Hanseatic League Baltic convoys",
              "The Viking North Atlantic crossing",
              "The Mediterranean galley circuit"
            ],
            correctIndex: 0,
            explanation: "Spanish Manila Galleons sailed between Acapulco and Manila, exchanging silver from Potosí and Mexico for Chinese silk, spices, and porcelain."
          }
        ]
      }
    ]
  }
];

// Verify integrity
if (typeof window !== 'undefined') {
  window.CURRICULUM_DATA = CURRICULUM_DATA;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CURRICULUM_DATA;
}
