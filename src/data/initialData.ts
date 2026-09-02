import { Category, Script, Tag } from "../types";

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: "cat-inggris",
    name: "Naskah Bahasa Inggris",
    slug: "naskah-bahasa-inggris",
    description: "Koleksi naskah drama berbahasa Inggris untuk pembelajaran bahasa, kompetisi storytelling, dan pementasan drama bilingual.",
    icon: "Globe",
    scriptCount: 1,
    publishedScripts: 1,
    totalScripts: 1
  },
  {
    id: "cat-jawa",
    name: "Naskah Bahasa Jawa",
    slug: "naskah-bahasa-jawa",
    description: "Koleksi naskah drama sandiwara, ketoprak, dan lakon tradisional maupun kontemporer berbahasa Jawa (krama & ngoko).",
    icon: "Scroll",
    scriptCount: 1,
    publishedScripts: 1,
    totalScripts: 1
  },
  {
    id: "cat-remaja",
    name: "Naskah Drama Remaja",
    slug: "naskah-drama-remaja",
    description: "Naskah drama edukatif bertema persahabatan, sekolah, pencarian jati diri, dan motivasi yang cocok untuk siswa SMP dan SMA.",
    icon: "Sparkles",
    scriptCount: 1,
    publishedScripts: 1,
    totalScripts: 1
  },
  {
    id: "cat-film",
    name: "Naskah Film",
    slug: "naskah-film",
    description: "Skenario film pendek, film indie, dan naskah audio visual dengan format standar screenplay sinematografi.",
    icon: "Film",
    scriptCount: 1,
    publishedScripts: 1,
    totalScripts: 1
  },
  {
    id: "cat-islami",
    name: "Naskah Islami",
    slug: "naskah-islami",
    description: "Naskah bertema dakwah, nilai-nilai religius Islami, keteladanan akhlak, dan sejarah peradaban Islam.",
    icon: "Moon",
    scriptCount: 1,
    publishedScripts: 1,
    totalScripts: 1
  },
  {
    id: "cat-monolog",
    name: "Naskah Monolog",
    slug: "naskah-monolog",
    description: "Naskah tunggal untuk 1 aktor dengan kedalaman psikologis, cocok untuk festival seni, ujian teater, dan eksplorasi keaktoran.",
    icon: "Mic",
    scriptCount: 1,
    publishedScripts: 1,
    totalScripts: 1
  },
  {
    id: "cat-teater",
    name: "Naskah Teater",
    slug: "naskah-teater",
    description: "Naskah teater panggung klasik, realisme, absurd, dan modern dengan ansambel pemain beragam untuk pementasan teater festival.",
    icon: "Theater",
    scriptCount: 1,
    publishedScripts: 1,
    totalScripts: 1
  }
];

export const INITIAL_TAGS: Tag[] = [
  { id: "tag-1", name: "Persahabatan", slug: "persahabatan", scriptCount: 2 },
  { id: "tag-2", name: "Pendidikan", slug: "pendidikan", scriptCount: 3 },
  { id: "tag-3", name: "Komedi", slug: "komedi", scriptCount: 1 },
  { id: "tag-4", name: "Tragedi", slug: "tragedi", scriptCount: 2 },
  { id: "tag-5", name: "Festival Seni", slug: "festival-seni", scriptCount: 4 },
  { id: "tag-6", name: "FLS2N", slug: "fls2n", scriptCount: 2 },
  { id: "tag-7", name: "Keluarga", slug: "keluarga", scriptCount: 2 },
  { id: "tag-8", name: "Sejarah", slug: "sejarah", scriptCount: 1 },
  { id: "tag-9", name: "Cinta Tanah Air", slug: "cinta-tanah-air", scriptCount: 2 },
  { id: "tag-10", name: "Moralitas", slug: "moralitas", scriptCount: 5 },
  { id: "tag-11", name: "Psikologis", slug: "psikologis", scriptCount: 2 },
  { id: "tag-12", name: "Satir", slug: "satir", scriptCount: 1 },
  { id: "tag-13", name: "Tradisi", slug: "tradisi", scriptCount: 2 }
];

export const INITIAL_SCRIPTS: Script[] = [
  {
    id: "script-1",
    title: "Di Balik Tirai Kelas Sebelah",
    slug: "di-balik-tirai-kelas-sebelah",
    author: "Rendra Prasetyo",
    category_id: "cat-remaja",
    category_name: "Naskah Drama Remaja",
    category_slug: "naskah-drama-remaja",
    category: INITIAL_CATEGORIES[2],
    language: "Bahasa Indonesia",
    genre: "Drama Edukasi / Persahabatan",
    performance_type: "Teater Panggung",
    duration: "35 Menit",
    cast_count: 5,
    age_group: "Remaja (SMP/SMA)",
    views: 1420,
    downloads: 385,
    synopsis: "Kisah tentang sekelompok siswa SMA yang sedang mempersiapkan festival seni sekolah. Di tengah perbedaan karakter dan konflik persaingan akademik, mereka menemukan makna sejati dari kerja sama, kejujuran, dan saling memaafkan.",
    cast_list: JSON.stringify([
      { name: "ANDI (17 tahun)", role: "Ketua kelas yang perfeksionis dan memikul beban ekspektasi orang tua." },
      { name: "BAYU (17 tahun)", role: "Sahabat Andi, ceria, sedikit ceroboh namun sangat setia kawan." },
      { name: "CITRA (16 tahun)", role: "Siswa berprestasi yang diam-diam mencintai seni teater." },
      { name: "DINA (17 tahun)", role: "Ketua OSIS yang tegas dan berorientasi pada aturan." },
      { name: "PAK SURYA (45 tahun)", role: "Guru pembimbing seni budaya yang bijaksana." }
    ]),
    tags: ["Persahabatan", "Pendidikan", "FLS2N", "Keluarga"],
    status: "Terbit",
    content: `[ADEGAN 1]
LATAR: RUANG KELAS XII-IPA 2 SAAT SORE HARI SETELAH JAM PULANG SEKOLAH. SINAR MATAHARI SENJA MENEROBOS JENDELA KACA YANG BERDEBU. DI ATAS MEJA GURU TERGELETAK BEBERAPA TULISAN NASKAH TEATER YANG CORET-MORETAN.

(ANDI DUDUK TERMENUNG DI SUDUT RUANGAN DENGAN KEPALA TERTELUNGKUP DI ATAS MEJA. BAYU MASUK SAMBIL MEMBAWA DUA KOTAK SUSU KEDELAI HANGAT DAN SEBUNGKUS ROTI.)

BAYU
(Meletakkan susu di samping tangan Andi dengan sengaja)
Kalau meja itu bisa bicara, Andi, dia sudah minta ganti rugi karena tiap sore kamu tumpahi keluhan tanpa henti.

ANDI
(Mengangkat kepala perlahan, matanya tampak letih)
Bukan keluhan, Bay. Ini keputusasaan yang tertata rapi. Lusa panggung harus siap, tapi babak ketiga masih berantakan. Pak Surya menolak ide naskah kita kemarin karena dianggap terlalu kaku.

CITRA
(Masuk terengah-engah dari pintu samping, membawa tumpukan map karton)
Bukan naskahnya yang kaku, Ndi. Kita yang terlalu takut keluar dari zona aman! Kita menulis tentang mimpi orang lain, bukan mimpi kita sendiri.

BAYU
(Menyeruput susunya)
Nah, dengar itu filosofi sang sastrawan kelas kita. Bikin naskah tentang kita saja: siswa yang tersiksa oleh try out tapi tetap ingin bermimpi mementaskan seni!

ANDI
(Tersenyum tipis, mulai bangkit)
Kamu serius, Cit? Kalau kita angkat cerita tentang tekanan ujian dan mimpi terpendam... apa dewan juri tidak akan menganggapnya terlalu frontal?

CITRA
(Mendekat dan meletakkan map terbuka di hadapan Andi)
Justru teater adalah cermin kejujuran, Andi. Penonton tidak butuh dongeng palsu yang sempurna. Mereka ingin melihat luka dan harapan yang nyata!

(DINA MASUK DENGAN BUKU AGENDA DAN JADWAL OSIS.)

DINA
Waktu kalian di aula hanya tersisa besok sore. Kalau belum ada kepastian naskah yang lolos kurasi Pak Surya, panggung utama terpaksa dialihkan ke tim paduan suara.

ANDI
(Mengambil spidol papan tulis, matanya berbinar)
Tunggu, Dina! Beri kami waktu 15 menit. Kita akan tulis ulang naskah ini sekarang juga. Bersama-sama.

(SEMUA SALING BERTATAP MUKA. BAYU TERSENYUM LEBAR, CITRA MENGANGGUK OPTIMIS. CAHAYA MEREDUP PERLAHAN SAAT MEREKA MULAI MENULIS DI PAPAN TULIS.)

[BLACKOUT]`,
    cover_url: "",
    created_at: "2026-03-01 10:00:00"
  },
  {
    id: "script-2",
    title: "Suara Dari Sunyi",
    slug: "suara-dari-sunyi",
    author: "Dewi Lestari Kumala",
    category_id: "cat-monolog",
    category_name: "Naskah Monolog",
    category_slug: "naskah-monolog",
    category: INITIAL_CATEGORIES[5],
    language: "Bahasa Indonesia",
    genre: "Drama Psikologis",
    performance_type: "Monolog",
    duration: "20 Menit",
    cast_count: 1,
    age_group: "Umum / Dewasa",
    views: 2150,
    downloads: 512,
    synopsis: "Sebuah monolog intens tentang seorang penjaga mercusuar tua di pesisir terpencil yang berbicara dengan bayang-bayang masa lalu dan suara deru ombak di malam badai terdahsyat abad ini.",
    cast_list: JSON.stringify([
      { name: "SARMAN (60 tahun)", role: "Penjaga mercusuar tua yang setia menjaga lentera suar di pulau karang terpencil." }
    ]),
    tags: ["Psikologis", "Festival Seni", "Moralitas"],
    status: "Terbit",
    content: `[PANGGUNG DIMULAI DALAM KEGELAPAN TOTAL]
SUARA DESIR ANGIN LAUT DAN GEMURUH OMBAK MENGHANTAM BATU KARANG DENGAR JELAS. SEBUAH LAMPU SPOTLIGHT KUNING TUA PERLAHAN MENYALA DARI ATAS, MENYOROTI SARMAN YANG DUDUK DI KURSI KAYU REYOT, MEMEGANG SEBUAH LAMPU BADAI DAN KAIN LAP KUSUT.

SARMAN
(Tersenyum dingin memandang ke arah penonton seolah memandang lautan lepas)
Tiga puluh empat tahun... Laut ini tidak pernah meminta maaf pada karang yang dihantamnya setiap detik. Dan aku tidak pernah meminta maaf pada malam karena telah menyalakan api suar ini.

(Ia berdiri perlahan, persendiannya berderit, menatap ke atas)
Kalian di daratan sana mengira cahaya mercusuar ini untuk menerangi jalan kapal pulang? Keliru! Cahaya ini ada untuk memperingatkan mereka: menjauhlah! Di sini hanya ada batu karang tajam dan kesendirian yang menenggelamkan.

(Mengusap lampu badai dengan kain lap)
Istriku dulu berkata, suara laut adalah nyanyian malaikat. Tapi waktu badai merenggut perahu nelayan putraku lima belas tahun lalu... aku tahu, laut tidak bernyanyi. Laut hanya menelan.

(Terdengar bunyi petir menggelegar di kejauhan. Lampu panggung berkedip-kedip)
Malam ini badai datang lagi. Angin berbisik memanggil namaku. Tapi lentera ini tidak boleh padam. Selama nafasku masih berhembus, mercusuar ini akan tetap menyala!

(SARMAN MENGANGKAT LAMPU BADAI TINGGI-TINGGI KE ARAH ANGIN MALAM. MUSIK KLIMAKS MENGALUN KUAT.)

[BLACKOUT]`,
    cover_url: "",
    created_at: "2026-03-01 11:30:00"
  },
  {
    id: "script-3",
    title: "Lakon Semar Gugat: Prajurit Kalang",
    slug: "lakon-semar-gugat-prajurit-kalang",
    author: "Ki Sudarman Ciptoraharjo",
    category_id: "cat-jawa",
    category_name: "Naskah Bahasa Jawa",
    category_slug: "naskah-bahasa-jawa",
    category: INITIAL_CATEGORIES[1],
    language: "Bahasa Jawa",
    genre: "Sandiwara Tradisional / Ketoprak",
    performance_type: "Teater Panggung",
    duration: "45 Menit",
    cast_count: 8,
    age_group: "Umum",
    views: 1890,
    downloads: 420,
    synopsis: "Lakon sandiwara basa Jawa ingkang nyaritakake babagan prajurit desa ingkang njagi kalestarening bumi pertiwi lan piwulang luhur trapsila saking Ki Lurah Semar kagem para panguwasa.",
    cast_list: JSON.stringify([
      { name: "KI LURAH SEMAR", role: "Pamong sejati ingkang paring piweling luhur." },
      { name: "GARENG", role: "Putra pambarep, tangkas lan grapyak." },
      { name: "PETRUK", role: "Putra panengah, lantip pamicaranipun." },
      { name: "BAGONG", role: "Putra wuragil, jujur lan blak-kotang." },
      { name: "RADEN SURYANEGARA", role: "Ksatria mudha ingkang nggayuh kautaman." }
    ]),
    tags: ["Tradisi", "Satir", "Moralitas", "Cinta Tanah Air"],
    status: "Terbit",
    content: `[BABAK I: PADHEPOKAN KARANG KABUDAYAN]
SWANTEN GENDHING JAVANESE GAMELAN MENGALUN SLENDRO MANYURA. GARENG, PETRUK, LAN BAGONG NEMBE LELENGGAHAN ING SANGISORE WIT RINGIN KURUNG.

BAGONG
(Ngguyu nyekikik karo ndudut klambine Petruk)
Kowe ki lho Truk, saben dina kok mung ngalamun mikirke beras larang. Mbok ya kaya aku, mangan tela pendhem wis marem wetenge!

PETRUK
(Nyentak Bagong nganggo tangane sing dawa)
Gong, Bagong! Kahanan praja saiki lagi kisruh. Wong cilik padha sambat, banyu larang, lemah garing. Awake dhewe dadi punakawan aja mung mikir warege weteng dhewe!

GARENG
(Nengahi kanthi sabar)
Wis wis, aja padha padu. Kae lho Rama Semar rawuh. Ayo padha ngaturake sungkem.

(KI LURAH SEMAR RAWUH KANTHI LAKU ALON, NYEKEL TONGKAT KAJENG JATI.)

SEMAR
(Uluk salam kanthi swanten anteb)
He... anak-anakku para punakawan. Elinga, negara kuwi dadi ayom ayem dudu amarga gedhene kraton utawa akehe prajurit bersenjata. Nanging amarga adile panguwasa lan sucine ati para kawula!

PETRUK
Rama, menawi para nayaka praja sami lali kaliyan janjinipun, lajeng sinten ingkang kedah ngengetaken?

SEMAR
(Mulat marang langit)
Kewajibane awake dhewe, kanthi laku utama lan tetep andhap asor. Bener bakal ketara, luput bakal sirna!

[TIRAI KATUTUP]`,
    cover_url: "",
    created_at: "2026-03-01 12:00:00"
  },
  {
    id: "script-4",
    title: "Shadows of the Forgotten Oath",
    slug: "shadows-of-the-forgotten-oath",
    author: "Alexander M. Croft",
    category_id: "cat-inggris",
    category_name: "Naskah Bahasa Inggris",
    category_slug: "naskah-bahasa-inggris",
    category: INITIAL_CATEGORIES[0],
    language: "Bahasa Inggris",
    genre: "Historical Mystery",
    performance_type: "Teater Panggung",
    duration: "40 Menit",
    cast_count: 6,
    age_group: "Remaja / Dewasa",
    views: 980,
    downloads: 245,
    synopsis: "Set in a rainy Victorian harbor town, three former comrades reunite after ten years to decipher a hidden journal that could either save their innocent friend from the gallows or doom them all.",
    cast_list: JSON.stringify([
      { name: "CAPTAIN ARTHUR STERLING (42)", role: "A decorated navy veteran burdened by secrets." },
      { name: "ELEANOR VANCE (35)", role: "An astute investigative journalist seeking the truth." },
      { name: "JULIAN FROST (38)", role: "A wealthy merchant who has everything to lose." }
    ]),
    tags: ["Festival Seni", "Sejarah", "Moralitas"],
    status: "Terbit",
    content: `[SCENE 1: THE SALTY CROW TAVERN - A STORMY MIDNIGHT]
HEAVY RAIN LASHES AGAINST THE FOGGED WINDOWPANES. A LONE CANDLE FLICKERS IN THE CENTER OF A ROUND OAKEN TABLE.

ARTHUR
(Pouring black tea into a porcelain cup, his hand slightly trembling)
Ten years, Julian. Ten years of silence, and you summoned us here at the edge of the world.

JULIAN
(Looking around anxiously before leaning in)
Because the clock has run out, Arthur. Inspector Graves found the maritime ledger. By sunrise tomorrow, Thomas will hang if we do not produce the original charter!

ELEANOR
(Slides a leather-bound notebook across the table)
The ledger is here. But the signatures inside... they don't belong to Thomas. They belong to someone in this very room.

ARTHUR
(His eyes widen as he stares at the handwriting)
Good heavens... Julian, what did you do on that winter night in 1884?

[DRAMATIC MUSIC RISES - SCENE FADES]`,
    cover_url: "",
    created_at: "2026-03-01 13:00:00"
  },
  {
    id: "script-5",
    title: "Lentera di Ujung Lorong",
    slug: "lentera-di-ujung-lorong",
    author: "Ustadz H. Ahmad Fauzi & Tim",
    category_id: "cat-islami",
    category_name: "Naskah Islami",
    category_slug: "naskah-islami",
    category: INITIAL_CATEGORIES[4],
    language: "Bahasa Indonesia",
    genre: "Drama Religi / Dakwah",
    performance_type: "Teater Panggung",
    duration: "30 Menit",
    cast_count: 4,
    age_group: "Umum",
    views: 1650,
    downloads: 470,
    synopsis: "Kisah haru di sebuah panti asuhan ketika seorang pemuda yang lama tersesat dalam kehidupan malam kembali untuk mencari jejak doa ibunya yang telah tiada.",
    cast_list: JSON.stringify([
      { name: "ILHAM (24 tahun)", role: "Pemuda yang mencari jalan taubat dan ketenangan batin." },
      { name: "KYAI HASAN (65 tahun)", role: "Pengasuh pondok panti yang ramah dan penuh kasih." },
      { name: "ZAHRA (12 tahun)", role: "Anak panti yang cerdas dan hafal Al-Qur'an." }
    ]),
    tags: ["Moralitas", "Keluarga", "Pendidikan"],
    status: "Terbit",
    content: `[ADEGAN 1: SERAMBI MUSHOLA SAAT MENJELANG SUBUH]
SUASANA HENING. TERDENGAR SUARA GEMICIK AIR WUDHU DAN LANTUNAN AYAT SUCI AL-QUR'AN DARI DALAM MUSHOLA. ILHAM BERDIRI RAGU DI DEPAN PINTU GERBANG, BAJUNYA BASAH OLEH EMBUN PAGI.

KYAI HASAN
(Keluar sambil merapikan sorban putihnya, menyapa dengan senyum teduh)
Pintu mushola ini tidak pernah dikunci, anak muda. Kenapa berdiri di luar kedinginan?

ILHAM
(Menundukkan pandangan, suaranya tercekat)
Kyai... saya merasa kaki saya terlalu kotor untuk menginjak sajadah suci ini. Dosa saya terlampau banyak.

KYAI HASAN
(Mendekat dan menepuk pundak Ilham dengan lembut)
Ketahuilah Ilham, pintu taubat Allah jauh lebih luas daripada samudera dosa manusia. Yang membuat kita celaka bukanlah besarnya dosa masa lalu, melainkan keengganan kita untuk melangkah pulang.

(ZAHRA KELUAR MEMBAWA SEGELAS TEH MANIS HANGAT DAN MENYERAHKANNYA PADA ILHAM.)

ZAHRA
Silakan diminum, Kak. Kata Kyai, air hangat bisa menenangkan hati yang resah.

ILHAM
(Menatap mata jernih Zahra, air matanya menetes perlahan)
Terima kasih, Dik... Ya Allah, bimbinglah hamba.

[LAMPU PANGGUNG MELEMBUT DENGAN IRINGAN SUARA ADZAN SUBUH]`,
    cover_url: "",
    created_at: "2026-03-01 14:00:00"
  },
  {
    id: "script-6",
    title: "Retak di Ruang Kemudi",
    slug: "retak-di-ruang-kemudi",
    author: "Bagus Wicaksono",
    category_id: "cat-film",
    category_name: "Naskah Film",
    category_slug: "naskah-film",
    category: INITIAL_CATEGORIES[3],
    language: "Bahasa Indonesia",
    genre: "Sci-Fi / Thriller Sinematik",
    performance_type: "Skenario Film Pendek",
    duration: "25 Menit",
    cast_count: 3,
    age_group: "Dewasa / Remaja",
    views: 1310,
    downloads: 310,
    synopsis: "Skenario film pendek berlatar stasiun riset bawah laut tahun 2055 di Palung Jawa, saat kru mendeteksi anomali sinyal biologis yang memaksa mereka memilih antara protokol keselamatan atau menyelamatkan rekan mereka di luar pangkalan.",
    cast_list: JSON.stringify([
      { name: "KAPTEN TARA (36)", role: "Komandan stasiun yang teguh pada protokol keamanan." },
      { name: "DR. RIAN (32)", role: "Oseanografer yang idealis dan berani mengambil risiko." },
      { name: "AI SYSTEM - 'KENCANA'", role: "Suara kecerdasan buatan stasiun selam." }
    ]),
    tags: ["Pendidikan", "Moralitas", "Festival Seni"],
    status: "Terbit",
    content: `SCENE 1. INT. CONTROL ROOM - STASIUN SELAM BIMA - NIGHT (DEPTH: 4000M)
SOUND: LOW FREQUENCY HUMMING OF SUBMERSIBLE ENGINES. RHYTHMIC SONAR PING.

CLOSE UP ON: DIGITAL DEPTH GAUGE: [4,120 METERS]. OXYGEN LEVEL: [74%].

TARA (36) stares at the multi-layered sonar display. Red alerts blink on the outer airlock monitor.

TARA
Kencana, perjelas frekuensi sinyal di sektor Charlie-4.

KENCANA (V.O.)
Sinyal terdeteksi bukan anomali geologis, Kapten. Pola detak jantung organik... 110 denyut per menit.

RIAN (32) bursts in through the hydraulic seal door, clutching a thermal tablet.

RIAN
Tara! Itu sinyal dari pakaian selam milik Farhan! Dia masih hidup di palung!

TARA
(Without turning around, voice steady but tense)
Pakaian selam Farhan kehabisan daya dua jam lalu, Rian. Tekanan di kedalaman empat ribu meter tidak memungkinkan manusia bertahan tanpa kapsul hermetis.

RIAN
Lalu bagaimana kau menjelaskan detak jantung ini?! Buka pintu airlock sekarang juga!

TARA
(Turns, confronting Rian eye-to-eye)
Dan membiarkan tekanan air menghancurkan seluruh laboratorium ini bersama kita berdua? Aku tidak akan mempertaruhkan nyawa tim untuk ilusi!

[CUT TO BLACK - SUDDEN IMPACT SOUND ON THE HULL GLASS]`,
    cover_url: "",
    created_at: "2026-03-01 15:00:00"
  },
  {
    id: "script-7",
    title: "Pentas Terakhir Sang Maestro",
    slug: "pentas-terakhir-sang-maestro",
    author: "W.S. Hardjono",
    category_id: "cat-teater",
    category_name: "Naskah Teater",
    category_slug: "naskah-teater",
    category: INITIAL_CATEGORIES[6],
    language: "Bahasa Indonesia",
    genre: "Tragedi Realisme",
    performance_type: "Teater Panggung",
    duration: "50 Menit",
    cast_count: 7,
    age_group: "Umum",
    views: 2980,
    downloads: 780,
    synopsis: "Sebuah mahakarya teater panggung tentang seorang sutradara teater legendaris yang bersikeras menyelesaikan pementasan terakhirnya di gedung kesenian tua yang terancam digusur menjadi pusat perbelanjaan.",
    cast_list: JSON.stringify([
      { name: "MAESTRO RADEN SALEH (70)", role: "Sutradara teater legendaris yang mengabdikan seluruh hidupnya untuk panggung." },
      { name: "LAKSMI (28)", role: "Aktris utama yang setia mendampingi sang guru." },
      { name: "HENDRA (40)", role: "Pengusaha properti yang hendak merobohkan gedung teater." },
      { name: "DAMAR (22)", role: "Penata cahaya muda yang energik." }
    ]),
    tags: ["Tragedi", "Cinta Tanah Air", "Moralitas", "Tradisi"],
    status: "Terbit",
    content: `[BABAK PEMBUKA: GEDUNG KESENIAN KENCANA - MALAM HARI]
PANGGUNG DILATARI OLEH DEKORASI TEATER RETRO TAHUN 80-AN. DEBU MENERBANG KETIKA LAMPU UTAMA DINYALAKAN. RADEN SALEH BERDIRI DI TENGAH PANGGUNG DENGAN TONGKAT KAYU MAHONI.

RADEN SALEH
(Menatap bangku-bangku penonton yang kosong melompong)
Kalian lihat kursi-kursi kayu ini? Selama empat puluh tahun, kursi-kursi ini telah menampung tawa, air mata, tepuk tangan, dan perenungan ribuan jiwa manusia!

LAKSMI
(Masuk dari sayap kanan panggung membawa kostum kebaya)
Bapak... surat pemberitahuan pengosongan sudah tiba tadi siang. Besok alat berat akan mulai membongkar dinding panggung ini.

RADEN SALEH
(Tersenyum getir)
Mereka bisa merobohkan semen dan batu bata ini, Laksmi. Tapi mereka tidak akan pernah bisa membongkar sukma teater yang telah mengakar di hati kita. Malam ini, kita akan mainkan babak terakhir! Nyalakan semua lampu, Damar!

DAMAR
(Dari ruang kontrol cahaya di balkon atas)
Semua lampu sorot siap, Maestro!

(SELURUH LAMPU PANGGUNG MENYALA TERANG BENDERANG. MAESTRO MENGANGKAT KEDUA TANGANNYA SEBAGAI TANDA MULAINYA PERTUNJUKAN.)

[BLACKOUT DENGAN SUARA GEMURUH TEPUK TANGAN PENONTON IMAJINER]`,
    cover_url: "",
    created_at: "2026-03-01 16:00:00"
  }
];
