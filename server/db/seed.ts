import { db, initSchema } from "./index";
import bcrypt from "bcryptjs";
import crypto from "crypto";

initSchema();

console.log("🌱 Seeding database for Ruang Naskah Drama...");

// 1. Seed Admin User
const adminEmail = "admin@ruangnaskah.id";
const existingAdmin = db.query("SELECT * FROM users WHERE email = ?").get(adminEmail);

if (!existingAdmin) {
  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync("AdminRuangNaskah2026!", salt);
  const adminId = crypto.randomUUID();

  db.query(`
    INSERT INTO users (id, name, email, password_hash, role, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `).run(adminId, "Administrator Ruang Naskah", adminEmail, passwordHash, "admin");

  console.log(`✅ Default admin created: ${adminEmail} / AdminRuangNaskah2026!`);
} else {
  console.log(`ℹ️ Admin user already exists.`);
}

// 2. Seed 7 Core PRD Categories
const categories = [
  {
    name: "Naskah Bahasa Inggris",
    slug: "naskah-bahasa-inggris",
    description: "Koleksi naskah drama berbahasa Inggris untuk pembelajaran bahasa, kompetisi storytelling, dan pementasan teater drama bilingual.",
    icon: "Globe"
  },
  {
    name: "Naskah Bahasa Jawa",
    slug: "naskah-bahasa-jawa",
    description: "Koleksi naskah drama sandiwara, ketoprak, dan lakon tradisional maupun kontemporer berbahasa Jawa (krama & ngoko).",
    icon: "Scroll"
  },
  {
    name: "Naskah Drama Remaja",
    slug: "naskah-drama-remaja",
    description: "Naskah drama edukatif bertema persahabatan, sekolah, pencarian jati diri, dan motivasi yang cocok untuk siswa SMP dan SMA.",
    icon: "Sparkles"
  },
  {
    name: "Naskah Film",
    slug: "naskah-film",
    description: "Skenario film pendek, film indie, dan naskah audio visual dengan format standar screenplay sinematografi.",
    icon: "Film"
  },
  {
    name: "Naskah Islami",
    slug: "naskah-islami",
    description: "Naskah bertema dakwah, nilai-nilai religius Islami, keteladanan akhlak, dan sejarah peradaban Islam untuk peringatan hari besar keagamaan.",
    icon: "Moon"
  },
  {
    name: "Naskah Monolog",
    slug: "naskah-monolog",
    description: "Naskah tunggal untuk 1 aktor dengan kedalaman psikologis, cocok untuk festival seni, ujian teater, dan eksplorasi keaktoran.",
    icon: "Mic"
  },
  {
    name: "Naskah Teater",
    slug: "naskah-teater",
    description: "Naskah teater panggung klasik, realisme, absurd, dan modern dengan ansambel pemain beragam untuk pementasan teater festival.",
    icon: "Theater"
  }
];

const categoryMap = new Map<string, string>();

for (const cat of categories) {
  const existing = db.query("SELECT * FROM categories WHERE slug = ?").get(cat.slug) as any;
  if (!existing) {
    const id = crypto.randomUUID();
    db.query(`
      INSERT INTO categories (id, name, slug, description, icon, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `).run(id, cat.name, cat.slug, cat.description, cat.icon);
    categoryMap.set(cat.slug, id);
  } else {
    categoryMap.set(cat.slug, existing.id);
  }
}
console.log(`✅ ${categories.length} core categories initialized.`);

// 3. Seed Initial Tags
const initialTags = [
  "Persahabatan", "Pendidikan", "Komedi", "Tragedi", "Festival Seni",
  "FLS2N", "Keluarga", "Sejarah", "Cinta Tanah Air", "Moralitas",
  "Psikologis", "Satir", "Tradisi", "Kemandirian", "Lingkungan"
];

const tagMap = new Map<string, string>();
for (const tagName of initialTags) {
  const slug = tagName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const existing = db.query("SELECT * FROM tags WHERE slug = ?").get(slug) as any;
  if (!existing) {
    const id = crypto.randomUUID();
    db.query("INSERT INTO tags (id, name, slug) VALUES (?, ?, ?)").run(id, tagName, slug);
    tagMap.set(slug, id);
  } else {
    tagMap.set(slug, existing.id);
  }
}
console.log(`✅ ${initialTags.length} tags initialized.`);

// 4. Seed Rich Sample Scripts
const sampleScripts = [
  {
    title: "Di Balik Tirai Kelas Sebelah",
    slug: "di-balik-tirai-kelas-sebelah",
    author: "Rendra Prasetyo",
    categorySlug: "naskah-drama-remaja",
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
    cover_url: "/placeholder-cover-1.jpg"
  },
  {
    title: "Suara Dari Sunyi",
    slug: "suara-dari-sunyi",
    author: "Dewi Lestari Kumala",
    categorySlug: "naskah-monolog",
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
    cover_url: "/placeholder-cover-2.jpg"
  },
  {
    title: "Lakon Semar Gugat: Prajurit Kalang",
    slug: "lakon-semar-gugat-prajurit-kalang",
    author: "Ki Sudarman Ciptoraharjo",
    categorySlug: "naskah-bahasa-jawa",
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
    cover_url: "/placeholder-cover-3.jpg"
  },
  {
    title: "Shadows of the Forgotten Oath",
    slug: "shadows-of-the-forgotten-oath",
    author: "Alexander M. Croft",
    categorySlug: "naskah-bahasa-inggris",
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
    cover_url: "/placeholder-cover-4.jpg"
  },
  {
    title: "Lentera di Ujung Lorong",
    slug: "lentera-di-ujung-lorong",
    author: "Ustadz H. Ahmad Fauzi & Tim",
    categorySlug: "naskah-islami",
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
    cover_url: "/placeholder-cover-5.jpg"
  },
  {
    title: "Retak di Ruang Kemudi",
    slug: "retak-di-ruang-kemudi",
    author: "Bagus Wicaksono",
    categorySlug: "naskah-film",
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
    cover_url: "/placeholder-cover-6.jpg"
  },
  {
    title: "Pentas Terakhir Sang Maestro",
    slug: "pentas-terakhir-sang-maestro",
    author: "W.S. Hardjono",
    categorySlug: "naskah-teater",
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
    cover_url: "/placeholder-cover-7.jpg"
  }
];

for (const script of sampleScripts) {
  const existing = db.query("SELECT * FROM scripts WHERE slug = ?").get(script.slug) as any;
  const categoryId = categoryMap.get(script.categorySlug) || "";

  if (!existing && categoryId) {
    const scriptId = crypto.randomUUID();
    db.query(`
      INSERT INTO scripts (
        id, title, slug, author, synopsis, cast_list, category_id,
        language, genre, performance_type, duration, cast_count,
        age_group, content, cover_url, status, views, downloads,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Terbit', ?, ?, datetime('now'), datetime('now'))
    `).run(
      scriptId,
      script.title,
      script.slug,
      script.author,
      script.synopsis,
      script.cast_list,
      categoryId,
      script.language,
      script.genre,
      script.performance_type,
      script.duration,
      script.cast_count,
      script.age_group,
      script.content,
      script.cover_url,
      script.views,
      script.downloads
    );

    // Link script tags
    for (const tagName of script.tags) {
      const slug = tagName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const tagId = tagMap.get(slug);
      if (tagId) {
        db.query("INSERT OR IGNORE INTO script_tags (script_id, tag_id) VALUES (?, ?)").run(scriptId, tagId);
      }
    }
  }
}
console.log(`✅ Sample scripts seeded successfully.`);

// 5. Seed Sample Submission (Pending & Reviewed)
const existingSub = db.query("SELECT * FROM submissions LIMIT 1").get();
if (!existingSub) {
  const catDramaRemaja = categoryMap.get("naskah-drama-remaja") || "";
  db.query(`
    INSERT INTO submissions (
      id, contributor_name, email, institution, title, author,
      category_id, language, genre, performance_type, duration,
      cast_count, age_group, synopsis, cast_list, tags, content,
      status, admin_note, copyright_agreed, created_at
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending', NULL, 1, datetime('now')
    )
  `).run(
    crypto.randomUUID(),
    "Budi Santoso, S.Pd",
    "budi.santoso@sman1teater.sch.id",
    "Komunitas Teater SMA 1 Merdeka",
    "Jejak Langkah di Pesisir Senja",
    "Budi Santoso",
    catDramaRemaja,
    "Bahasa Indonesia",
    "Drama Realis",
    "Teater Panggung",
    "30 Menit",
    4,
    "Remaja (SMP/SMA)",
    "Perjuangan anak-anak nelayan di pesisir desa yang ingin mendirikan taman baca gratis di tepi pantai.",
    JSON.stringify([
      { name: "Rian (16)", role: "Pemuda pesisir penggerak taman baca" },
      { name: "Maya (15)", role: "Sahabat Rian pencinta buku" },
      { name: "Pak Kades (50)", role: "Kepala desa yang awalnya ragu" }
    ]),
    "Pendidikan, Persahabatan, Lingkungan",
    "[NASKAH CONTOH JEJAK LANGKAH DI PESISIR SENJA]\nADEGAN 1: PANTAI SENJA..."
  );
  console.log(`✅ Sample pending submission seeded.`);
}

console.log("🎉 Seeding completed successfully!");

