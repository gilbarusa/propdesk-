
// ══════════════════════════════════════════════════════
//  DATA
// ══════════════════════════════════════════════════════
const SEED_DATA = [
  {id:1,apt:"n",owner:"ERA LT",name:"Name",type:"long-term",rent:0.0,balance:0,due:"",lease_end:"",checkin:"",note:"Notes | Via: VIa | Tel: Phone No | Email: Email",history:[],archived:false},
  {id:2,apt:"223",owner:"ERA LT",name:"Chris Kennedy",type:"long-term",rent:2600.0,balance:0,due:"2026-03-10",lease_end:"2025-10-10",checkin:"2025-10-10",note:"Via: Booking | Tel: 2134141259",history:[{"date": "2025-10-10", "text": "Move-in 2025-10-10"}],archived:false},
  {id:3,apt:"314",owner:"ERA LT",name:"Amira Glover",type:"short-stay",rent:823.44,balance:0,due:"2026-03-23",lease_end:"2026-03-23",checkin:"2026-01-05",note:"Via: Vrbo | Tel: 14455445925 | Email: amiraglover@yahoo.com",history:[],archived:false},
  {id:4,apt:"104",owner:"ERA LT",name:"Heather Shandler",type:"month-to-month",rent:2880.0,balance:1440,due:"2026-04-07",lease_end:"2026-04-07",checkin:"2026-02-23",note:"Via: Airbnb | Tel: 15618009905 | Email: Suew17050@yahoo.com",history:[],archived:false},
  {id:5,apt:"Montg 5",owner:"Elkins LT",name:"Dr Shradha Kakde",type:"short-stay",rent:1762.41,balance:0,due:"2026-03-24",lease_end:"2026-03-24",checkin:"2026-03-09",note:"Via: Airbnb | Tel: 6892504273 | Email: Meghnathkakde11@gmail.com",history:[],archived:false},
  {id:6,apt:"215",owner:"ERA LT",name:"Irina Stesel",type:"short-stay",rent:1903.2,balance:0,due:"2026-03-25",lease_end:"2026-03-25",checkin:"2026-03-15",note:"Via: Airbnb | Tel: 17732970907 | Email: Istesel@gmail.com",history:[],archived:false},
  {id:7,apt:"426-3",owner:"ERA LT",name:"Danene Bowman",type:"short-stay",rent:1504.75,balance:0,due:"2026-03-27",lease_end:"2026-03-27",checkin:"2026-02-21",note:"Via: Airbnb | Tel: 12675842987 | Email: Warritlam@gmail.com",history:[],archived:false},
  {id:8,apt:"317",owner:"ERA LT",name:"Carol Tyndale",type:"month-to-month",rent:2700.0,balance:0,due:"2026-03-27",lease_end:"",checkin:"2026-02-02",note:"Via: Airbnb | Tel: 2675951099 | Email: Carol6@comcost.net",history:[{"date": "2026-02-02", "text": "Move-in 2026-02-02"}],archived:false},
  {id:9,apt:"207",owner:"ERA LT",name:"Jerry",type:"short-stay",rent:770.0,balance:0,due:"2026-03-29",lease_end:"2026-03-29",checkin:"2026-03-08",note:"Via: Airbnb | Tel: 3312713679",history:[],archived:false},
  {id:10,apt:"208",owner:"ERA LT",name:"Thomas",type:"short-stay",rent:770.0,balance:0,due:"2026-03-29",lease_end:"2026-03-29",checkin:"2026-03-08",note:"Via: Airbnb | Tel: 3312713679",history:[],archived:false},
  {id:11,apt:"205",owner:"ERA LT",name:"Jerry",type:"short-stay",rent:770.0,balance:0,due:"2026-03-29",lease_end:"2026-03-29",checkin:"2026-03-08",note:"Via: Airbnb | Tel: 3312713679",history:[],archived:false},
  {id:12,apt:"232",owner:"ERA LT",name:"Oleh Chubatiuk",type:"month-to-month",rent:2300.0,balance:0,due:"2026-03-31",lease_end:"",checkin:"2024-12-01",note:"Via: facebook | Tel: (267) 258-8686 | Email: olehchubatiuk@gmail.com",history:[{"date": "2024-12-01", "text": "Move-in 2024-12-01"}],archived:false},
  {id:13,apt:"426-4",owner:"ERA LT",name:"Dajana Ford",type:"long-term",rent:1830.0,balance:0,due:"2026-03-31",lease_end:"2026-09-30",checkin:"2024-10-09",note:"Via: Airbnb | Tel: (215) 669-4696 /2156694696 | Email: daybella126@gmail.com",history:[{"date": "2024-10-09", "text": "Move-in 2024-10-09"}],archived:false},
  {id:14,apt:"Montg 6",owner:"Elkins LT",name:"Victoria Deans",type:"long-term",rent:1650.0,balance:0,due:"2026-03-31",lease_end:"2027-01-31",checkin:"2026-01-23",note:"Via: Zillow | Tel: (484) 250-9741 | Email: deansvictoria5@gmail.com",history:[{"date": "2026-01-23", "text": "Move-in 2026-01-23"}],archived:false},
  {id:15,apt:"Montg 4",owner:"Elkins LT",name:"Lashaie N. Lee Lewis",type:"long-term",rent:1930.0,balance:0,due:"2026-03-31",lease_end:"2026-09-30",checkin:"2025-11-01",note:"Via: Zillow | Tel: (267) 824-0067 | Email: lashaielee@gmail.com",history:[{"date": "2025-11-01", "text": "Move-in 2025-11-01"}],archived:false},
  {id:16,apt:"323",owner:"ERA LT",name:"Lesia Riabkova",type:"long-term",rent:1800.0,balance:0,due:"2026-03-31",lease_end:"2027-01-31",checkin:"2025-02-01",note:"Via: facebook | Tel: (773) 499-2003 | Email: lesyariabkova80@gmail.com",history:[{"date": "2025-02-01", "text": "Move-in 2025-02-01"}],archived:false},
  {id:17,apt:"121",owner:"ERA LT",name:"Amnon Saad",type:"long-term",rent:1200.0,balance:0,due:"2026-03-31",lease_end:"2025-03-31",checkin:"2022-06-01",note:"Via: Lindy",history:[{"date": "2022-06-01", "text": "Move-in 2022-06-01"}],archived:false},
  {id:18,apt:"Melrose CH",owner:"Melrose Properties",name:"Otar Khaniashvili",type:"long-term",rent:2350.0,balance:0,due:"2026-03-31",lease_end:"2026-04-30",checkin:"2024-05-03",note:"Via: facebook | Tel: (551) 587-4824 | Email: otootookh@gmail.com",history:[{"date": "2024-05-03", "text": "Move-in 2024-05-03"}],archived:false},
  {id:19,apt:"426-1",owner:"ERA LT",name:"Pavel Artyshevskii",type:"long-term",rent:2070.0,balance:0,due:"2026-03-31",lease_end:"2026-12-15",checkin:"2022-12-14",note:"Via: facebook | Tel: (267) 437-1645 | Email: freedom202244@gmail.com",history:[{"date": "2022-12-14", "text": "Move-in 2022-12-14"}],archived:false},
  {id:20,apt:"329",owner:"ERA LT",name:"Vitalii Savonenko",type:"month-to-month",rent:1835.0,balance:0,due:"2026-03-31",lease_end:"",checkin:"2023-09-18",note:"Via: facebook | Tel: (215) 960-6999 | Email: vitaly1974s@gmail.com",history:[{"date": "2023-09-18", "text": "Move-in 2023-09-18"}],archived:false},
  {id:21,apt:"311",owner:"ERA LT",name:"Vladimir Fominykh",type:"long-term",rent:1830.0,balance:0,due:"2026-03-31",lease_end:"2026-09-30",checkin:"2022-08-17",note:"Via: facebook | Tel: 845-873-2725 | Email: vovowner@gmail.com",history:[{"date": "2022-08-17", "text": "Move-in 2022-08-17"}],archived:false},
  {id:22,apt:"Montg Studio B",owner:"Elkins LT",name:"Sergey Lobodin",type:"long-term",rent:1000.0,balance:0,due:"2026-03-31",lease_end:"2026-11-30",checkin:"2025-11-18",note:"Via: facebook | Tel: (215) 3076841 | Email: kachuyea@arcadia.edu",history:[{"date": "2025-11-18", "text": "Move-in 2025-11-18"}],archived:false},
  {id:23,apt:"211",owner:"ERA LT",name:"Giorgi Devnosadze",type:"long-term",rent:1600.0,balance:0,due:"2026-03-31",lease_end:"2027-01-31",checkin:"2026-02-06",note:"Via: facebook | Tel: (732) 228-2069 | Email: devnosadze91@gmail.com",history:[{"date": "2026-02-06", "text": "Move-in 2026-02-06"}],archived:false},
  {id:24,apt:"127",owner:"ERA LT",name:"Maksim Fursov",type:"long-term",rent:1850.0,balance:0,due:"2026-03-31",lease_end:"2026-08-31",checkin:"2023-09-01",note:"Via: facebook | Tel: (267) 336-3421 | Email: maksonf1259@gmail.com",history:[{"date": "2023-09-01", "text": "Move-in 2023-09-01"}],archived:false},
  {id:25,apt:"Montg 1",owner:"Elkins LT",name:"Deborah Massaud",type:"long-term",rent:1650.0,balance:0,due:"2026-03-31",lease_end:"2026-09-30",checkin:"2025-09-09",note:"Via: Zillow | Tel: (215) 696-3732 | Email: ndzajs6@comcast.net",history:[{"date": "2025-09-09", "text": "Move-in 2025-09-09"}],archived:false},
  {id:26,apt:"Montg  10",owner:"Elkins LT",name:"Danielle Corrado",type:"long-term",rent:2100.0,balance:0,due:"2026-03-31",lease_end:"2026-03-31",checkin:"2024-04-01",note:"Via: Zillow | Tel: (561) 578-2873 | Email: daniellencorrado@gmail.com",history:[{"date": "2024-04-01", "text": "Move-in 2024-04-01"}],archived:false},
  {id:27,apt:"Melrose A2",owner:"Melrose Properties",name:"Renat Sakiev",type:"long-term",rent:1600.0,balance:0,due:"2026-03-31",lease_end:"2026-07-31",checkin:"2025-08-01",note:"Via: facebook | Tel: (717) 434-0879 Nargiza 445-500-93-33, 717-885-42-58 | Email: tonimontana0009@icloud.com",history:[{"date": "2025-08-01", "text": "Move-in 2025-08-01"}],archived:false},
  {id:28,apt:"222",owner:"ERA LT",name:"Kevin Smith",type:"long-term",rent:2400.0,balance:0,due:"2026-03-31",lease_end:"2026-03-02",checkin:"2023-02-24",note:"Via: apartments com | Tel: (267) 253-1289 | Email: kevin_8379@msn.com",history:[{"date": "2023-02-24", "text": "Move-in 2023-02-24"}],archived:false},
  {id:29,apt:"122",owner:"ERA LT",name:"Ekaterina Shakhova",type:"long-term",rent:2060.0,balance:0,due:"2026-03-31",lease_end:"2026-05-31",checkin:"2022-05-01",note:"Via: facebook | Tel: 215-509-8997 | Email: shakhova.katarina@gmail.com",history:[{"date": "2022-05-01", "text": "Move-in 2022-05-01"}],archived:false},
  {id:30,apt:"325",owner:"ERA LT",name:"Naijeya Shykye Lyons",type:"long-term",rent:1450.0,balance:0,due:"2026-03-31",lease_end:"2027-01-31",checkin:"2026-02-08",note:"Via: Zillow | Tel: (267) 588-3026 | Email: n.lyons6998@gmail.com",history:[{"date": "2026-02-08", "text": "Move-in 2026-02-08"}],archived:false},
  {id:31,apt:"219",owner:"ERA LT",name:"SiNing Wang",type:"long-term",rent:3350.0,balance:0,due:"2026-03-31",lease_end:"2026-08-31",checkin:"2025-08-23",note:"Tel: (646) 881-8428 | Email: 3273215917@qq.com",history:[{"date": "2025-08-23", "text": "Move-in 2025-08-23"}],archived:false},
  {id:32,apt:"Montg #1A",owner:"Elkins LT",name:"Marissa Bluestine / Joshua Bluestine",type:"month-to-month",rent:1220.0,balance:0,due:"2026-03-31",lease_end:"",checkin:"2024-02-01",note:"Via: Facebook | Tel: (215) 740-8211 | Email: joshbforschool@gmail.com",history:[{"date": "2024-02-01", "text": "Move-in 2024-02-01"}],archived:false},
  {id:33,apt:"230",owner:"ERA LT",name:"Farrukh Kurbanov",type:"long-term",rent:1800.0,balance:0,due:"2026-03-31",lease_end:"2027-01-31",checkin:"2026-02-01",note:"Via: facebook | Tel: (445) 888-1315 | Email: kurbanovfarrukh662@gmail.com",history:[{"date": "2026-02-01", "text": "Move-in 2026-02-01"}],archived:false},
  {id:34,apt:"Montg 7",owner:"Elkins LT",name:"Kristina Newton",type:"long-term",rent:1820.0,balance:0,due:"2026-03-31",lease_end:"2026-06-30",checkin:"2025-04-02",note:"Via: Airbnb | Tel: (267) 983-8094 | Email: knewton37@gmail.com",history:[{"date": "2025-04-02", "text": "Move-in 2025-04-02"}],archived:false},
  {id:35,apt:"203",owner:"ERA LT",name:"Franz Noel",type:"long-term",rent:2450.0,balance:0,due:"2026-03-31",lease_end:"2026-05-31",checkin:"2023-06-01",note:"Via: renter.com | Tel: (267) 408-7982 | Email: FRANTZN686@GMAIL.COM",history:[{"date": "2023-06-01", "text": "Move-in 2023-06-01"}],archived:false},
  {id:36,apt:"Montg 1B",owner:"Elkins LT",name:"Bhargavkumar Chaudhary",type:"long-term",rent:1275.0,balance:0,due:"2026-03-31",lease_end:"2026-08-31",checkin:"2025-09-01",note:"Via: Zillow | Tel: (215) 385-4685 | Email: bhargavchaudhary395@gmail.com",history:[{"date": "2025-09-01", "text": "Move-in 2025-09-01"}],archived:false},
  {id:37,apt:"220",owner:"ERA LT",name:"David Zarandia",type:"month-to-month",rent:1450.0,balance:0,due:"2026-03-31",lease_end:"",checkin:"2024-03-01",note:"Via: facebook | Tel: (267) 979-4540 | Email: datazarandia@yahoo.com",history:[{"date": "2024-03-01", "text": "Move-in 2024-03-01"}],archived:false},
  {id:38,apt:"128",owner:"ERA LT",name:"Dawn Mccoy",type:"short-stay",rent:1722.02,balance:0,due:"2026-03-31",lease_end:"2026-03-31",checkin:"2026-02-28",note:"Via: Airbnb | Tel: 2157677174 | Email: Dawnmccoy3288@yahoo.com",history:[],archived:false},
  {id:39,apt:"225",owner:"ERA LT",name:"Tyvesha Jackson",type:"long-term",rent:3700.04,balance:0,due:"2026-03-31",lease_end:"2026-03-31",checkin:"2025-06-08",note:"Via: Vrbo | Tel: 2673063019 | Email: chocolatethai27@gmail.com",history:[{"date": "2025-06-08", "text": "Move-in 2025-06-08"}],archived:false},
  {id:40,apt:"Montg 3",owner:"Elkins LT",name:"Darron Wilson",type:"short-stay",rent:2884.7,balance:0,due:"2026-03-31",lease_end:"2026-03-31",checkin:"2026-02-25",note:"Via: Airbnb | Tel: 12156178005 | Email: darron.wilson@comhar.org",history:[],archived:false},
  {id:41,apt:"111",owner:"ERA LT",name:"Kristen Brooker",type:"month-to-month",rent:2500.0,balance:0,due:"2026-04-02",lease_end:"2026-04-02",checkin:"2025-10-02",note:"Via: Zillow | Tel: (603) 359-0916 | Email: kristenbrooker333@gmail.com",history:[{"date": "2025-10-02", "text": "Move-in 2025-10-02"}],archived:false},
  {id:42,apt:"Montg 2",owner:"Elkins LT",name:"Gina Krier",type:"month-to-month",rent:2850.0,balance:0,due:"2026-04-04",lease_end:"",checkin:"2026-02-04",note:"Via: Airbnb | Tel: (267) 716-5106 | Email: gmkrier@gmail.com",history:[{"date": "2026-02-04", "text": "Move-in 2026-02-04"}],archived:false},
  {id:43,apt:"Montg 5B",owner:"Elkins LT",name:"Hider Shaaban",type:"short-stay",rent:1894.76,balance:0,due:"2026-04-06",lease_end:"2026-04-06",checkin:"2026-03-08",note:"Via: Airbnb | Tel: 2157895616 | Email: aloffreda23@gmail.com",history:[],archived:false},
  {id:44,apt:"Montg 8",owner:"Elkins LT",name:"Justin Krebs",type:"month-to-month",rent:1100.0,balance:0,due:"2026-04-09",lease_end:"",checkin:"2026-03-09",note:"Via: FF | Tel: (605) 430-6888 | Email: jtk1996@hotmail.com",history:[{"date": "2026-03-09", "text": "Move-in 2026-03-09"}],archived:false},
  {id:45,apt:"Retail Fox Chase",owner:"Fox Chase Properties",name:"Maryam Gurbandurdyyeva",type:"long-term",rent:0.0,balance:0,due:"2026-04-11",lease_end:"2027-01-11",checkin:"2025-01-12",note:"Tel: (267) 779-0102 | Email: evangelinas1210@gmail.com",history:[{"date": "2025-01-12", "text": "Move-in 2025-01-12"}],archived:false},
  {id:46,apt:",facebook,$1",owner:"ERA LT",name:"",type:"available",rent:0.0,balance:0,due:"",lease_end:"",checkin:"",note:"",history:[],archived:false},
  {id:47,apt:"Fox Chase  2",owner:"Fox Chase Properties",name:"Gabrielle Pereira",type:"short-stay",rent:1846.32,balance:0,due:"2026-04-13",lease_end:"2026-04-13",checkin:"2026-03-13",note:"Via: Airbnb | Tel: 12039196929 | Email: Arthur.oliveira0294@gmail.com",history:[],archived:false},
  {id:48,apt:"426-Office",owner:"ERA LT",name:"Clamira Smith",type:"long-term",rent:1450.0,balance:0,due:"2026-04-15",lease_end:"2026-06-15",checkin:"2025-05-15",note:"Via: facebook | Tel: (267) 597-4656 | Email: clamirasmith@icloud.com",history:[{"date": "2025-05-15", "text": "Move-in 2025-05-15"}],archived:false},
  {id:49,apt:"112",owner:"ERA LT",name:"Damaris Suyapa Bejarano Reyes",type:"short-stay",rent:2535.84,balance:0,due:"2026-04-17",lease_end:"2026-04-17",checkin:"2026-03-17",note:"Via: Airbnb | Email: Afaby8224@gmail.com",history:[],archived:false},
  {id:50,apt:"221",owner:"ERA LT",name:"Miesha Sassone",type:"month-to-month",rent:1750.0,balance:0,due:"2026-04-21",lease_end:"",checkin:"2026-03-21",note:"Via: FF | Tel: (724) 504-2775 | Email: mieshasassone@gmail.com",history:[{"date": "2026-03-21", "text": "Move-in 2026-03-21"}],archived:false},
  {id:51,apt:"Montg 9",owner:"Elkins LT",name:"Whitney Diane Rustin",type:"long-term",rent:2250.0,balance:0,due:"2026-04-25",lease_end:"2026-04-25",checkin:"2025-04-26",note:"Via: Zillow | Tel: (267) 267-1173 | Email: whitneyrustin@gmail.com",history:[{"date": "2025-04-26", "text": "Move-in 2025-04-26"}],archived:false},
  {id:52,apt:"330",owner:"ERA LT",name:"Tetiana Holoborodko",type:"short-stay",rent:2986.91,balance:0,due:"2026-04-30",lease_end:"2026-04-30",checkin:"2026-03-14",note:"Via: Airbnb | Tel: 380674923971 | Email: kiri4enkototiana@gmail.com",history:[],archived:false},
  {id:53,apt:"Fox Chase  1",owner:"Fox Chase Properties",name:"Richard Odonnell",type:"long-term",rent:8296.24,balance:0,due:"2026-04-30",lease_end:"2026-04-30",checkin:"2026-01-13",note:"Via: Vrbo | Tel: 14046260337 | Email: Rodonnell3560dows@gmail.com",history:[{"date": "2026-01-13", "text": "Move-in 2026-01-13"}],archived:false},
  {id:54,apt:"210",owner:"ERA LT",name:"Joe Masalta",type:"long-term",rent:7191.96,balance:0,due:"2026-06-01",lease_end:"2026-06-01",checkin:"2026-03-01",note:"Via: Airbnb | Tel: 267-615-4780 | Email: joemasalta5326@gmail.com",history:[{"date": "2026-03-01", "text": "Move-in 2026-03-01"}],archived:false},
  {id:55,apt:"Melrose C2",owner:"Melrose Properties",name:"Brian Rodger",type:"long-term",rent:7346.42,balance:0,due:"2026-06-28",lease_end:"2026-06-28",checkin:"2026-03-20",note:"Via: Airbnb | Tel: 17633398361 | Email: Brian.rodger@astontech.com",history:[{"date": "2026-03-20", "text": "Move-in 2026-03-20"}],archived:false},
  {id:56,apt:"206",owner:"ERA LT",name:"Maureen Kacillas",type:"long-term",rent:7600.95,balance:0,due:"2026-06-30",lease_end:"2026-06-30",checkin:"2026-02-24",note:"Via: Airbnb | Tel: 15705924712 | Email: Salim.Akbar.2025@gmail.com",history:[{"date": "2026-02-24", "text": "Move-in 2026-02-24"}],archived:false},
  {id:57,apt:"131",owner:"ERA LT",name:"Randy / Robert Keppler",type:"long-term",rent:2500.0,balance:0,due:"2026-12-12",lease_end:"2026-12-12",checkin:"2025-08-07",note:"Tel: (267) 680-5837 | Email: rschumacher148@gmail.com",history:[{"date": "2025-08-07", "text": "Move-in 2025-08-07"}],archived:false},
  {id:58,apt:"132",owner:"ERA LT",name:"Sheriie Panichelli",type:"long-term",rent:0.0,balance:0,due:"",lease_end:"",checkin:"",note:"Tel: 2674081128 | Email: sherriepanic18@gmail.com",history:[],archived:false},
  {id:59,apt:"320",owner:"ERA LT",name:"Taron Stokes",type:"long-term",rent:0.0,balance:0,due:"",lease_end:"",checkin:"2026-04-01",note:"",history:[{"date": "2026-04-01", "text": "Move-in 2026-04-01"}],archived:false},
  {id:60,apt:"Melrose B1",owner:"Melrose Properties",name:"",type:"available",rent:0.0,balance:0,due:"",lease_end:"",checkin:"",note:"",history:[],archived:false},
  {id:61,apt:"331",owner:"ERA LT",name:"",type:"available",rent:0.0,balance:0,due:"",lease_end:"",checkin:"",note:"",history:[],archived:false},
  {id:62,apt:"115",owner:"ERA LT",name:"",type:"available",rent:0.0,balance:0,due:"",lease_end:"",checkin:"",note:"",history:[],archived:false},
  {id:63,apt:"202",owner:"ERA LT",name:"",type:"available",rent:0.0,balance:0,due:"",lease_end:"",checkin:"",note:"",history:[],archived:false},
  {id:64,apt:"318",owner:"ERA LT",name:"",type:"available",rent:0.0,balance:0,due:"",lease_end:"",checkin:"",note:"",history:[],archived:false},
  {id:65,apt:"212",owner:"ERA LT",name:"",type:"available",rent:0.0,balance:0,due:"",lease_end:"",checkin:"",note:"",history:[],archived:false},
  {id:66,apt:"301",owner:"ERA LT",name:"",type:"available",rent:0.0,balance:0,due:"",lease_end:"",checkin:"",note:"",history:[],archived:false},
  {id:67,apt:"332",owner:"ERA LT",name:"",type:"available",rent:0.0,balance:0,due:"",lease_end:"",checkin:"",note:"",history:[],archived:false},
  {id:68,apt:"305",owner:"ERA LT",name:"",type:"available",rent:0.0,balance:0,due:"",lease_end:"",checkin:"",note:"",history:[],archived:false},
  {id:69,apt:"310",owner:"ERA LT",name:"",type:"available",rent:0.0,balance:0,due:"",lease_end:"",checkin:"",note:"",history:[],archived:false},
  {id:70,apt:"302",owner:"ERA LT",name:"",type:"available",rent:0.0,balance:0,due:"",lease_end:"",checkin:"",note:"",history:[],archived:false},
  {id:71,apt:"Melrose C1",owner:"Melrose Properties",name:"",type:"available",rent:0.0,balance:0,due:"",lease_end:"",checkin:"",note:"",history:[],archived:false},
  {id:72,apt:"Melrose A1",owner:"Melrose Properties",name:"",type:"available",rent:0.0,balance:0,due:"",lease_end:"",checkin:"",note:"",history:[],archived:false},
  {id:73,apt:"Melrose B2",owner:"Melrose Properties",name:"",type:"available",rent:0.0,balance:0,due:"",lease_end:"",checkin:"",note:"",history:[],archived:false},
  {id:74,apt:"426-2",owner:"ERA LT",name:"",type:"available",rent:0.0,balance:0,due:"",lease_end:"",checkin:"",note:"",history:[],archived:false},
  {id:75,apt:"426-Studio",owner:"ERA LT",name:"",type:"available",rent:0.0,balance:0,due:"",lease_end:"",checkin:"",note:"",history:[],archived:false},
  {id:76,apt:"Garage 1",owner:"Montgomery Garages",name:"Mark Levitt",type:"month-to-month",rent:90.0,balance:0,due:"2024-09-30",lease_end:"",checkin:"",note:"Via: original | Tel: (267) 968-9968 | Email: makoesq@gmail.com",history:[],archived:false},
  {id:77,apt:"Garage 2",owner:"Montgomery Garages",name:"Andrea Berger Bratman",type:"month-to-month",rent:80.0,balance:0,due:"2025-10-31",lease_end:"",checkin:"",note:"Via: original | Tel: (610) 304-8590 | Email: endlessideas@att.net",history:[],archived:false},
  {id:78,apt:"Garage 3",owner:"Montgomery Garages",name:"Andrea Berger Bratman",type:"month-to-month",rent:80.0,balance:0,due:"2025-10-31",lease_end:"",checkin:"",note:"Via: original | Tel: (610) 304-8590 | Email: endlessideas@att.net",history:[],archived:false},
  {id:79,apt:"Garage 4",owner:"Montgomery Garages",name:"",type:"available",rent:0.0,balance:0,due:"",lease_end:"",checkin:"",note:"",history:[],archived:false},
  {id:80,apt:"Garage 5",owner:"Montgomery Garages",name:"Deborah Massaud",type:"long-term",rent:74.0,balance:0,due:"2026-03-31",lease_end:"2026-09-30",checkin:"2025-10-01",note:"Via: Zillow | Tel: (215) 696-3732 | Email: ndzajs6@comcast.net",history:[{"date": "2025-10-01", "text": "Move-in 2025-10-01"}],archived:false},
  {id:81,apt:"205",owner:"ERA LT",name:"Kate Bergan",type:"long-term",rent:0.0,balance:0,due:"",lease_end:"",checkin:"",note:"",history:[],archived:false}
];
const ARCHIVED_SEED = [
  {id:1000,apt:"Unknown",owner:"ERA LT",name:"Antonio Benvenuti",type:"short-stay",rent:3400.0,balance:0,due:"2023-07-31",note:"Via: abnb | Tel: 917-763-4706 | Email: benvenutiant@gmail.com",history:[{"date": "2023-07-01", "text": "$3,400.00 \u2014 stay (2023-07-01 \u2192 2023-07-31)"}],archived:true,archived_date:"2023-07-31"},
  {id:1001,apt:"Unknown",owner:"ERA LT",name:"Betty Gabilanes",type:"long-term",rent:7200.0,balance:0,due:"2022-07-16",note:"Via: ABNB",history:[{"date": "2022-02-01", "text": "$7,200 \u2014 monthly (est.)"}, {"date": "2022-03-01", "text": "$7,200 \u2014 monthly (est.)"}, {"date": "2022-04-01", "text": "$7,200 \u2014 monthly (est.)"}, {"date": "2022-05-01", "text": "$7,200 \u2014 monthly (est.)"}, {"date": "2022-06-01", "text": "$7,200 \u2014 monthly (est.)"}, {"date": "2022-07-01", "text": "$7,200 \u2014 monthly (est.)"}],archived:true,archived_date:"2022-07-16"},
  {id:1002,apt:"426-4",owner:"ERA LT",name:"Michael Gibbons",type:"short-stay",rent:546.0,balance:0,due:"2022-02-26",note:"Via: abnb | Tel: 470-430-2409",history:[{"date": "2022-02-18", "text": "$546.00 \u2014 stay (2022-02-18 \u2192 2022-02-26)"}],archived:true,archived_date:"2022-02-26"},
  {id:1003,apt:"426-1",owner:"ERA LT",name:"Danetta Kellar",type:"short-stay",rent:1783.0,balance:0,due:"2022-03-12",note:"Via: Abnb | Tel: 39 327 376 4592",history:[{"date": "2022-02-12", "text": "$1,783.00 \u2014 stay (2022-02-12 \u2192 2022-03-12)"}],archived:true,archived_date:"2022-03-12"},
  {id:1004,apt:"219",owner:"ERA LT",name:"Michael Cirrincione",type:"long-term",rent:1024.0,balance:0,due:"2022-03-27",note:"Via: 1024 | Tel: 973-289-1261",history:[{"date": "2022-03-01", "text": "$1,024 \u2014 monthly (est.)"}],archived:true,archived_date:"2022-03-27"},
  {id:1005,apt:"230",owner:"ERA LT",name:"Christopher Cummings",type:"long-term",rent:963.0,balance:0,due:"2022-03-27",note:"Via: 963 | Tel: 217-412-5568",history:[{"date": "2022-03-01", "text": "$963 \u2014 monthly (est.)"}],archived:true,archived_date:"2022-03-27"},
  {id:1006,apt:"Noble",owner:"Noble Properties",name:"Sienna Brooks",type:"short-stay",rent:985.52,balance:0,due:"2022-03-30",note:"Via: abnb | Tel: 13107454434",history:[{"date": "2022-03-26", "text": "$985.52 \u2014 stay (2022-03-26 \u2192 2022-03-30)"}],archived:true,archived_date:"2022-03-30"},
  {id:1007,apt:"122",owner:"ERA LT",name:"Jessica Arriaga",type:"long-term",rent:2300.0,balance:0,due:"2022-01-16",note:"Via: Private | Tel: 267-227-6632 | Email: JessicaArriaga14@gmail.com",history:[],archived:true,archived_date:"2022-01-16"},
  {id:1008,apt:"202",owner:"ERA LT",name:"Dona Cook",type:"long-term",rent:2100.0,balance:0,due:"2024-02-29",note:"Via: Zillow | Tel: 267-455-7117 | Email: danac1015@gmail.com",history:[{"date": "2022-03-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2022-04-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2022-05-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2022-06-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2022-07-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2022-08-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2022-09-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2022-10-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2022-11-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2022-12-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2023-01-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2023-02-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2023-03-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2023-04-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2023-05-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2023-06-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2023-07-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2023-08-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2023-09-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2023-10-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2023-11-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2023-12-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2024-01-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2024-02-01", "text": "$2,100 \u2014 monthly (est.)"}],archived:true,archived_date:"2024-02-29"},
  {id:1009,apt:"223",owner:"ERA LT",name:"Andrew Wolfsont",type:"short-stay",rent:1000.0,balance:0,due:"2022-04-02",note:"Via: Abnb | Tel: 518-322-1443",history:[{"date": "2022-03-17", "text": "$1,000.00 \u2014 stay (2022-03-17 \u2192 2022-04-02)"}],archived:true,archived_date:"2022-04-02"},
  {id:1010,apt:"426-1",owner:"ERA LT",name:"Orlando Nieves",type:"short-stay",rent:650.0,balance:0,due:"2022-04-03",note:"Via: abnb",history:[{"date": "2022-03-25", "text": "$650.00 \u2014 stay (2022-03-25 \u2192 2022-04-03)"}],archived:true,archived_date:"2022-04-03"},
  {id:1011,apt:"320",owner:"ERA LT",name:"Ethan Chan",type:"long-term",rent:1800.0,balance:0,due:"2022-01-07",note:"Via: private | Tel: 917-617-7405 | Email: EthanChan@gmail.com",history:[],archived:true,archived_date:"2022-01-07"},
  {id:1012,apt:"426-2",owner:"ERA LT",name:"Sakinah Alexander",type:"short-stay",rent:1002.0,balance:0,due:"2022-04-07",note:"Via: airbnb | Tel: 267-382-9638",history:[{"date": "2022-03-21", "text": "$1,002.00 \u2014 stay (2022-03-21 \u2192 2022-04-07)"}],archived:true,archived_date:"2022-04-07"},
  {id:1013,apt:"115",owner:"ERA LT",name:"Anaiya Harlem",type:"short-stay",rent:4166.0,balance:0,due:"2023-03-04",note:"Via: abnb | Tel: 215-809-0872",history:[{"date": "2023-02-20", "text": "$4,166.00 \u2014 stay (2023-02-20 \u2192 2023-03-04)"}],archived:true,archived_date:"2023-03-04"},
  {id:1014,apt:"426-2",owner:"ERA LT",name:"Erin Coppola",type:"short-stay",rent:1100.0,balance:0,due:"2022-04-24",note:"Via: arbnb | Tel: 585-419-5234",history:[{"date": "2022-04-08", "text": "$1,100.00 \u2014 stay (2022-04-08 \u2192 2022-04-24)"}],archived:true,archived_date:"2022-04-24"},
  {id:1015,apt:"230",owner:"ERA LT",name:"Aki Azamov",type:"short-stay",rent:1151.0,balance:0,due:"2022-04-30",note:"Via: arbnb | Tel: 603-348-2219",history:[{"date": "2022-04-17", "text": "$1,151.00 \u2014 stay (2022-04-17 \u2192 2022-04-30)"}],archived:true,archived_date:"2022-04-30"},
  {id:1016,apt:"426-1",owner:"ERA LT",name:"Fatiha Nait Mouloud",type:"short-stay",rent:1746.0,balance:0,due:"2022-04-03",note:"Via: Abnb | Tel: 267-335-7387",history:[{"date": "2022-04-03", "text": "$1,746.00 \u2014 stay (2022-04-03 \u2192 2022-04-03)"}],archived:true,archived_date:"2022-04-03"},
  {id:1017,apt:"128",owner:"ERA LT",name:"Morgan Matetic",type:"long-term",rent:1800.0,balance:0,due:"2022-03-17",note:"Via: Private | Email: mtm0001@salus.edu",history:[{"date": "2022-02-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2022-03-01", "text": "$1,800 \u2014 monthly (est.)"}],archived:true,archived_date:"2022-03-17"},
  {id:1018,apt:"211",owner:"ERA LT",name:"Shelley Radinsky",type:"short-stay",rent:1560.0,balance:0,due:"2022-04-15",note:"Via: abnb",history:[{"date": "2022-03-24", "text": "$1,560.00 \u2014 stay (2022-03-24 \u2192 2022-04-15)"}],archived:true,archived_date:"2022-04-15"},
  {id:1019,apt:"215",owner:"ERA LT",name:"Fatos",type:"long-term",rent:1800.0,balance:0,due:"2022-02-14",note:"Via: Zillow | Tel: 917-868-2466 | Email: fwti09@gmail.com",history:[{"date": "2022-02-01", "text": "$1,800 \u2014 monthly (est.)"}],archived:true,archived_date:"2022-02-14"},
  {id:1020,apt:"426-1",owner:"ERA LT",name:"Lynda Trinh",type:"short-stay",rent:818.0,balance:0,due:"2022-05-22",note:"Via: arbnb | Tel: 647-570-9917",history:[{"date": "2022-05-13", "text": "$818.00 \u2014 stay (2022-05-13 \u2192 2022-05-22)"}],archived:true,archived_date:"2022-05-22"},
  {id:1021,apt:"320",owner:"ERA LT",name:"Daniel Payne",type:"short-stay",rent:1484.0,balance:0,due:"2022-05-27",note:"Via: abnb | Tel: 804-944-0217",history:[{"date": "2022-05-07", "text": "$1,484.00 \u2014 stay (2022-05-07 \u2192 2022-05-27)"}],archived:true,archived_date:"2022-05-27"},
  {id:1022,apt:"426-4",owner:"ERA LT",name:"Keisha Dixon Wilson",type:"short-stay",rent:4457.0,balance:0,due:"2022-05-27",note:"Via: arbnb | Tel: 215-776-0751",history:[{"date": "2022-03-27", "text": "$4,457.00 \u2014 stay (2022-03-27 \u2192 2022-05-27)"}],archived:true,archived_date:"2022-05-27"},
  {id:1023,apt:"230",owner:"ERA LT",name:"Víctor Rodríguez",type:"short-stay",rent:1165.0,balance:0,due:"2022-05-28",note:"Via: abnb | Tel: 951-217-5673",history:[{"date": "2022-05-14", "text": "$1,165.00 \u2014 stay (2022-05-14 \u2192 2022-05-28)"}],archived:true,archived_date:"2022-05-28"},
  {id:1024,apt:"426-1",owner:"ERA LT",name:"Ulukbek Shadymanov",type:"short-stay",rent:663.0,balance:0,due:"2022-05-30",note:"Via: arbnb | Tel: 484-919-9756",history:[{"date": "2022-05-22", "text": "$663.00 \u2014 stay (2022-05-22 \u2192 2022-05-30)"}],archived:true,archived_date:"2022-05-30"},
  {id:1025,apt:"223",owner:"ERA LT",name:"Marisha Mason",type:"short-stay",rent:2701.0,balance:0,due:"2022-05-31",note:"Via: abnb | Tel: 267-307-1140",history:[{"date": "2022-04-24", "text": "$2,701.00 \u2014 stay (2022-04-24 \u2192 2022-05-31)"}],archived:true,archived_date:"2022-05-31"},
  {id:1026,apt:"219",owner:"ERA LT",name:"Evgeny Kozyrev",type:"short-stay",rent:2000.0,balance:0,due:"2022-06-01",note:"Via: arbnb | Tel: 7657670829 | Email: eakozyrev09@gmail.com",history:[{"date": "2022-04-29", "text": "$2,000.00 \u2014 stay (2022-04-29 \u2192 2022-06-01)"}],archived:true,archived_date:"2022-06-01"},
  {id:1027,apt:"426-1",owner:"ERA LT",name:"Justin Tanger",type:"short-stay",rent:800.0,balance:0,due:"2022-06-09",note:"Via: abnb | Tel: 1 802-345-7229",history:[{"date": "2022-05-30", "text": "$800.00 \u2014 stay (2022-05-30 \u2192 2022-06-09)"}],archived:true,archived_date:"2022-06-09"},
  {id:1028,apt:"128",owner:"ERA LT",name:"John Adeniran",type:"short-stay",rent:1086.0,balance:0,due:"2022-06-18",note:"Via: airbnb",history:[{"date": "2022-06-04", "text": "$1,086.00 \u2014 stay (2022-06-04 \u2192 2022-06-18)"}],archived:true,archived_date:"2022-06-18"},
  {id:1029,apt:"426-1",owner:"ERA LT",name:"Christopher Getz",type:"short-stay",rent:860.0,balance:0,due:"2022-06-18",note:"Via: abnb | Tel: 760-533-8397",history:[{"date": "2022-06-09", "text": "$860.00 \u2014 stay (2022-06-09 \u2192 2022-06-18)"}],archived:true,archived_date:"2022-06-18"},
  {id:1030,apt:"426-2",owner:"ERA LT",name:"Sarita Chandan Sharma",type:"short-stay",rent:650.0,balance:0,due:"2022-06-20",note:"Via: abnb | Tel: 91 88265 63200",history:[{"date": "2022-06-12", "text": "$650.00 \u2014 stay (2022-06-12 \u2192 2022-06-20)"}],archived:true,archived_date:"2022-06-20"},
  {id:1031,apt:"211",owner:"ERA LT",name:"Annalise Igyarto",type:"short-stay",rent:3101.0,balance:0,due:"2022-06-23",note:"Via: abnb | Tel: 571-444-9196",history:[{"date": "2022-05-15", "text": "$3,101.00 \u2014 stay (2022-05-15 \u2192 2022-06-23)"}],archived:true,archived_date:"2022-06-23"},
  {id:1032,apt:"426-2",owner:"ERA LT",name:"Mitchell Spirt",type:"short-stay",rent:628.0,balance:0,due:"2022-06-27",note:"Via: abnb | Tel: 310-418-3223",history:[{"date": "2022-06-20", "text": "$628.00 \u2014 stay (2022-06-20 \u2192 2022-06-27)"}],archived:true,archived_date:"2022-06-27"},
  {id:1033,apt:"426-4",owner:"ERA LT",name:"Tifffany Bristow",type:"short-stay",rent:1500.0,balance:0,due:"2022-06-27",note:"Via: abnb | Tel: 706-941-6141 | Email: tiffany_cunningham77@yahoo.com",history:[{"date": "2022-05-27", "text": "$1,500.00 \u2014 stay (2022-05-27 \u2192 2022-06-27)"}],archived:true,archived_date:"2022-06-27"},
  {id:1034,apt:"Office",owner:"ERA LT",name:"Sarahi and Ethan",type:"long-term",rent:3000.0,balance:0,due:"2022-06-07",note:"Via: Facebook | Tel: 2158348398",history:[{"date": "2022-03-01", "text": "$3,000 \u2014 monthly (est.)"}, {"date": "2022-04-01", "text": "$3,000 \u2014 monthly (est.)"}, {"date": "2022-05-01", "text": "$3,000 \u2014 monthly (est.)"}, {"date": "2022-06-01", "text": "$3,000 \u2014 monthly (est.)"}],archived:true,archived_date:"2022-06-07"},
  {id:1035,apt:"320",owner:"ERA LT",name:"Melissa Cadd",type:"short-stay",rent:2095.0,balance:0,due:"2022-06-30",note:"Via: abnb | Tel: 443-752-9716",history:[{"date": "2022-05-31", "text": "$2,095.00 \u2014 stay (2022-05-31 \u2192 2022-06-30)"}],archived:true,archived_date:"2022-06-30"},
  {id:1036,apt:"426-4",owner:"ERA LT",name:"Livio Daljani",type:"short-stay",rent:533.0,balance:0,due:"2022-06-30",note:"Via: abnb | Tel: 215-594-1172",history:[{"date": "2022-06-23", "text": "$533.00 \u2014 stay (2022-06-23 \u2192 2022-06-30)"}],archived:true,archived_date:"2022-06-30"},
  {id:1037,apt:"215",owner:"ERA LT",name:"Sana Ahsun",type:"long-term",rent:1900.0,balance:0,due:"",note:"Via: zillow | Tel: 412-716-6146 | Email: sana.ahsun@jefferson.edu",history:[{"date": "2022-06-01", "text": "$1,900 \u2014 monthly (est.)"}, {"date": "2022-07-01", "text": "$1,900 \u2014 monthly (est.)"}, {"date": "2022-08-01", "text": "$1,900 \u2014 monthly (est.)"}, {"date": "2022-09-01", "text": "$1,900 \u2014 monthly (est.)"}, {"date": "2022-10-01", "text": "$1,900 \u2014 monthly (est.)"}, {"date": "2022-11-01", "text": "$1,900 \u2014 monthly (est.)"}, {"date": "2022-12-01", "text": "$1,900 \u2014 monthly (est.)"}, {"date": "2023-01-01", "text": "$1,900 \u2014 monthly (est.)"}, {"date": "2023-02-01", "text": "$1,900 \u2014 monthly (est.)"}, {"date": "2023-03-01", "text": "$1,900 \u2014 monthly (est.)"}, {"date": "2023-04-01", "text": "$1,900 \u2014 monthly (est.)"}, {"date": "2023-05-01", "text": "$1,900 \u2014 monthly (est.)"}, {"date": "2023-06-01", "text": "$1,900 \u2014 monthly (est.)"}, {"date": "2023-07-01", "text": "$1,900 \u2014 monthly (est.)"}, {"date": "2023-08-01", "text": "$1,900 \u2014 monthly (est.)"}, {"date": "2023-09-01", "text": "$1,900 \u2014 monthly (est.)"}, {"date": "2023-10-01", "text": "$1,900 \u2014 monthly (est.)"}, {"date": "2023-11-01", "text": "$1,900 \u2014 monthly (est.)"}, {"date": "2023-12-01", "text": "$1,900 \u2014 monthly (est.)"}, {"date": "2024-01-01", "text": "$1,900 \u2014 monthly (est.)"}, {"date": "2024-02-01", "text": "$1,900 \u2014 monthly (est.)"}, {"date": "2024-03-01", "text": "$1,900 \u2014 monthly (est.)"}, {"date": "2024-04-01", "text": "$1,900 \u2014 monthly (est.)"}, {"date": "2024-05-01", "text": "$1,900 \u2014 monthly (est.)"}, {"date": "2024-06-01", "text": "$1,900 \u2014 monthly (est.)"}, {"date": "2024-07-01", "text": "$1,900 \u2014 monthly (est.)"}, {"date": "2024-08-01", "text": "$1,900 \u2014 monthly (est.)"}, {"date": "2024-09-01", "text": "$1,900 \u2014 monthly (est.)"}, {"date": "2024-10-01", "text": "$1,900 \u2014 monthly (est.)"}, {"date": "2024-11-01", "text": "$1,900 \u2014 monthly (est.)"}, {"date": "2024-12-01", "text": "$1,900 \u2014 monthly (est.)"}, {"date": "2025-01-01", "text": "$1,900 \u2014 monthly (est.)"}, {"date": "2025-02-01", "text": "$1,900 \u2014 monthly (est.)"}, {"date": "2025-03-01", "text": "$1,900 \u2014 monthly (est.)"}, {"date": "2025-04-01", "text": "$1,900 \u2014 monthly (est.)"}, {"date": "2025-05-01", "text": "$1,900 \u2014 monthly (est.)"}],archived:true,archived_date:"2022-06-01"},
  {id:1038,apt:"230",owner:"ERA LT",name:"Carl F Sapelli",type:"short-stay",rent:2238.0,balance:0,due:"2022-06-25",note:"Via: abnb | Tel: 267-544-7110",history:[{"date": "2022-05-28", "text": "$2,238.00 \u2014 stay (2022-05-28 \u2192 2022-06-25)"}],archived:true,archived_date:"2022-06-25"},
  {id:1039,apt:"426-4",owner:"ERA LT",name:"Carl F Sapelli",type:"short-stay",rent:2200.0,balance:0,due:"2022-07-15",note:"Via: abnb",history:[{"date": "2022-07-02", "text": "$2,200.00 \u2014 stay (2022-07-02 \u2192 2022-07-15)"}],archived:true,archived_date:"2022-07-15"},
  {id:1040,apt:"426-2",owner:"ERA LT",name:"Raymond",type:"short-stay",rent:0.0,balance:0,due:"2022-07-24",note:"Via: abnb",history:[],archived:true,archived_date:"2022-07-24"},
  {id:1041,apt:"426-4",owner:"ERA LT",name:"Dawn Killmer",type:"short-stay",rent:1038.0,balance:0,due:"2022-07-30",note:"Via: abnb",history:[{"date": "2022-07-17", "text": "$1,038.00 \u2014 stay (2022-07-17 \u2192 2022-07-30)"}],archived:true,archived_date:"2022-07-30"},
  {id:1042,apt:"219",owner:"ERA LT",name:"Chris Colquitt",type:"short-stay",rent:2200.0,balance:0,due:"2022-06-30",note:"Via: abnb | Tel: 2158139151",history:[{"date": "2022-06-01", "text": "$2,200.00 \u2014 stay (2022-06-01 \u2192 2022-06-30)"}],archived:true,archived_date:"2022-06-30"},
  {id:1043,apt:"323",owner:"ERA LT",name:"Samuel Chan",type:"long-term",rent:1029.0,balance:0,due:"2022-07-29",note:"Via: Lindy | Tel: (267) 986-9125 | Email: xanth712@yahoo.com",history:[{"date": "2022-06-01", "text": "$1,029 \u2014 monthly (est.)"}, {"date": "2022-07-01", "text": "$1,029 \u2014 monthly (est.)"}],archived:true,archived_date:"2022-07-29"},
  {id:1044,apt:"320",owner:"ERA LT",name:"Adam Rodgers",type:"short-stay",rent:2492.0,balance:0,due:"2022-07-31",note:"Via: abnb | Tel: 215-681-9355",history:[{"date": "2022-07-01", "text": "$2,492.00 \u2014 stay (2022-07-01 \u2192 2022-07-31)"}],archived:true,archived_date:"2022-07-31"},
  {id:1045,apt:"211",owner:"ERA LT",name:"Olusola Lawanson",type:"short-stay",rent:3300.0,balance:0,due:"2022-08-08",note:"Via: abnb | Tel: 234 809 945 0083",history:[{"date": "2022-06-27", "text": "$3,300.00 \u2014 stay (2022-06-27 \u2192 2022-08-08)"}],archived:true,archived_date:"2022-08-08"},
  {id:1046,apt:"211",owner:"ERA LT",name:"Lee Johnson",type:"short-stay",rent:2870.0,balance:0,due:"2022-08-14",note:"Via: airbnb",history:[{"date": "2022-07-08", "text": "$2,870.00 \u2014 stay (2022-07-08 \u2192 2022-08-14)"}],archived:true,archived_date:"2022-08-14"},
  {id:1047,apt:"426-2",owner:"ERA LT",name:"Alex Ruiz",type:"short-stay",rent:0.0,balance:0,due:"2022-08-13",note:"Via: abnb | Tel: 847-372-2114",history:[],archived:true,archived_date:"2022-08-13"},
  {id:1048,apt:"215",owner:"ERA LT",name:"Tifffany Bristow",type:"short-stay",rent:2200.0,balance:0,due:"2022-06-20",note:"Via: abnb | Tel: 706-941-6141 | Email: tiffany_cunningham77@yahoo.com",history:[{"date": "2022-05-27", "text": "$2,200.00 \u2014 stay (2022-05-27 \u2192 2022-06-20)"}],archived:true,archived_date:"2022-06-20"},
  {id:1049,apt:"219",owner:"ERA LT",name:"Nadine Maxwell",type:"short-stay",rent:1171.0,balance:0,due:"2022-08-22",note:"Via: abnb | Tel: 516-451-5136",history:[{"date": "2022-08-08", "text": "$1,171.00 \u2014 stay (2022-08-08 \u2192 2022-08-22)"}],archived:true,archived_date:"2022-08-22"},
  {id:1050,apt:"426-2",owner:"ERA LT",name:"Andre Edwards",type:"short-stay",rent:533.0,balance:0,due:"2022-08-25",note:"Via: abnb | Tel: 954-612-1293",history:[{"date": "2022-08-18", "text": "$533.00 \u2014 stay (2022-08-18 \u2192 2022-08-25)"}],archived:true,archived_date:"2022-08-25"},
  {id:1051,apt:"426-1",owner:"ERA LT",name:"Manohar Murthi",type:"long-term",rent:2806.0,balance:0,due:"2022-08-13",note:"Tel: 52 985 126 4324",history:[{"date": "2022-07-01", "text": "$2,806 \u2014 monthly (est.)"}, {"date": "2022-08-01", "text": "$2,806 \u2014 monthly (est.)"}],archived:true,archived_date:"2022-08-13"},
  {id:1052,apt:"128",owner:"ERA LT",name:"Vladimir Fominykh",type:"long-term",rent:1700.0,balance:0,due:"2022-08-17",note:"Via: facebook | Tel: 845-873-2725 | Email: vovowner@gmail.com",history:[{"date": "2022-05-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2022-06-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2022-07-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2022-08-01", "text": "$1,700 \u2014 monthly (est.)"}],archived:true,archived_date:"2022-08-17"},
  {id:1053,apt:"426-2",owner:"ERA LT",name:"Cynthia Andriajatovo",type:"short-stay",rent:2868.29,balance:0,due:"2022-09-05",note:"Via: abnb",history:[{"date": "2022-07-29", "text": "$2,868.29 \u2014 stay (2022-07-29 \u2192 2022-09-05)"}],archived:true,archived_date:"2022-09-05"},
  {id:1054,apt:"230",owner:"ERA LT",name:"Danielle Cerminaro",type:"short-stay",rent:3400.0,balance:0,due:"2022-08-14",note:"Via: airbnb | Tel: 570-956-3996",history:[{"date": "2022-07-03", "text": "$3,400.00 \u2014 stay (2022-07-03 \u2192 2022-08-14)"}],archived:true,archived_date:"2022-08-14"},
  {id:1055,apt:"426-4",owner:"ERA LT",name:"James Jackson",type:"short-stay",rent:1196.0,balance:0,due:"2022-08-27",note:"Via: abnb | Tel: 267-776-5962",history:[{"date": "2022-08-10", "text": "$1,196.00 \u2014 stay (2022-08-10 \u2192 2022-08-27)"}],archived:true,archived_date:"2022-08-27"},
  {id:1056,apt:"426-1",owner:"ERA LT",name:"Igor Kirillov",type:"short-stay",rent:925.0,balance:0,due:"2022-09-08",note:"Via: abnb | Tel: 267-213-5987",history:[{"date": "2022-08-29", "text": "$925.00 \u2014 stay (2022-08-29 \u2192 2022-09-08)"}],archived:true,archived_date:"2022-09-08"},
  {id:1057,apt:"426-2",owner:"ERA LT",name:"Archil Shengelia",type:"short-stay",rent:570.0,balance:0,due:"2022-09-26",note:"Via: abnb | Tel: 848-298-4074",history:[{"date": "2022-09-19", "text": "$570.00 \u2014 stay (2022-09-19 \u2192 2022-09-26)"}],archived:true,archived_date:"2022-09-26"},
  {id:1058,apt:"426-4",owner:"ERA LT",name:"Eugene Myatt",type:"short-stay",rent:560.0,balance:0,due:"2022-09-23",note:"Via: abnb | Tel: 267-528-9150",history:[{"date": "2022-09-16", "text": "$560.00 \u2014 stay (2022-09-16 \u2192 2022-09-23)"}],archived:true,archived_date:"2022-09-23"},
  {id:1059,apt:"127",owner:"ERA LT",name:"Shonya Payne-",type:"long-term",rent:1092.0,balance:0,due:"2022-10-07",note:"Via: Lindy | Tel: 215-439-8102",history:[{"date": "2022-06-01", "text": "$1,092 \u2014 monthly (est.)"}, {"date": "2022-07-01", "text": "$1,092 \u2014 monthly (est.)"}, {"date": "2022-08-01", "text": "$1,092 \u2014 monthly (est.)"}, {"date": "2022-09-01", "text": "$1,092 \u2014 monthly (est.)"}, {"date": "2022-10-01", "text": "$1,092 \u2014 monthly (est.)"}],archived:true,archived_date:"2022-10-07"},
  {id:1060,apt:"212",owner:"ERA LT",name:"Metzgar Delanie/Johnson Brandon",type:"long-term",rent:1900,balance:0,due:"2022-10-31",note:"Via: Facebook | Tel: 267-800-5861 | Email: dmetzgar12@gmail.com",history:[{"date": "2022-03-01", "text": "$19,001,839 \u2014 monthly (est.)"}, {"date": "2022-04-01", "text": "$19,001,839 \u2014 monthly (est.)"}, {"date": "2022-05-01", "text": "$19,001,839 \u2014 monthly (est.)"}, {"date": "2022-06-01", "text": "$19,001,839 \u2014 monthly (est.)"}, {"date": "2022-07-01", "text": "$19,001,839 \u2014 monthly (est.)"}, {"date": "2022-08-01", "text": "$19,001,839 \u2014 monthly (est.)"}, {"date": "2022-09-01", "text": "$19,001,839 \u2014 monthly (est.)"}, {"date": "2022-10-01", "text": "$19,001,839 \u2014 monthly (est.)"}],archived:true,archived_date:"2022-10-31"},
  {id:1061,apt:"225",owner:"ERA LT",name:"Darlyne Ryan",type:"long-term",rent:1076.0,balance:0,due:"2022-11-13",note:"Via: Lindy | Tel: 215-554-4898 | Email: ryan-darlene@aramark.com",history:[{"date": "2022-06-01", "text": "$1,076 \u2014 monthly (est.)"}, {"date": "2022-07-01", "text": "$1,076 \u2014 monthly (est.)"}, {"date": "2022-08-01", "text": "$1,076 \u2014 monthly (est.)"}, {"date": "2022-09-01", "text": "$1,076 \u2014 monthly (est.)"}, {"date": "2022-10-01", "text": "$1,076 \u2014 monthly (est.)"}, {"date": "2022-11-01", "text": "$1,076 \u2014 monthly (est.)"}],archived:true,archived_date:"2022-11-13"},
  {id:1062,apt:"219",owner:"ERA LT",name:"Atif Nehvi",type:"short-stay",rent:1330.0,balance:0,due:"2022-10-01",note:"Via: abnb | Tel: 647-808-0947",history:[{"date": "2022-09-15", "text": "$1,330.00 \u2014 stay (2022-09-15 \u2192 2022-10-01)"}],archived:true,archived_date:"2022-10-01"},
  {id:1063,apt:"426-1",owner:"ERA LT",name:"Mariana Peralta",type:"long-term",rent:9600.0,balance:0,due:"2022-10-01",note:"Via: abnb | Tel: 347-220-4646",history:[{"date": "2022-06-01", "text": "$9,600 \u2014 monthly (est.)"}, {"date": "2022-07-01", "text": "$9,600 \u2014 monthly (est.)"}, {"date": "2022-08-01", "text": "$9,600 \u2014 monthly (est.)"}, {"date": "2022-09-01", "text": "$9,600 \u2014 monthly (est.)"}, {"date": "2022-10-01", "text": "$9,600 \u2014 monthly (est.)"}],archived:true,archived_date:"2022-10-01"},
  {id:1064,apt:"426-2",owner:"ERA LT",name:"Kayla Wilson",type:"short-stay",rent:1983.0,balance:0,due:"2022-10-01",note:"Via: abnb | Tel: 267-582-0401",history:[{"date": "2022-09-01", "text": "$1,983.00 \u2014 stay (2022-09-01 \u2192 2022-10-01)"}],archived:true,archived_date:"2022-10-01"},
  {id:1065,apt:"230",owner:"ERA LT",name:"David Hall",type:"short-stay",rent:1407.0,balance:0,due:"2022-09-17",note:"Via: abnb | Tel: 619-613-9630",history:[{"date": "2022-09-17", "text": "$1,407.00 \u2014 stay (2022-09-17 \u2192 2022-09-17)"}],archived:true,archived_date:"2022-09-17"},
  {id:1066,apt:"211",owner:"ERA LT",name:"Ebony Dash",type:"short-stay",rent:1935.0,balance:0,due:"2022-09-17",note:"Via: Abnb | Tel: 267-235-3556",history:[{"date": "2022-08-31", "text": "$1,935.00 \u2014 stay (2022-08-31 \u2192 2022-09-17)"}],archived:true,archived_date:"2022-09-17"},
  {id:1067,apt:"426-1",owner:"ERA LT",name:"Kristina Best",type:"short-stay",rent:1027.0,balance:0,due:"2022-10-08",note:"Via: abnb | Tel: 760-201-6887",history:[{"date": "2022-09-27", "text": "$1,027.00 \u2014 stay (2022-09-27 \u2192 2022-10-08)"}],archived:true,archived_date:"2022-10-08"},
  {id:1068,apt:"426-3",owner:"ERA LT",name:"Contractors",type:"long-term",rent:3400.0,balance:0,due:"2022-09-27",note:"",history:[{"date": "2022-08-01", "text": "$3,400 \u2014 monthly (est.)"}, {"date": "2022-09-01", "text": "$3,400 \u2014 monthly (est.)"}],archived:true,archived_date:"2022-09-27"},
  {id:1069,apt:"230",owner:"ERA LT",name:"Hailey Cheperon",type:"long-term",rent:1245.0,balance:0,due:"2022-10-18",note:"Via: aibnb | Tel: 8609420231",history:[{"date": "2022-10-01", "text": "$1,245 \u2014 monthly (est.)"}],archived:true,archived_date:"2022-10-18"},
  {id:1070,apt:"320",owner:"ERA LT",name:"Dyeyanik Rodriguez",type:"short-stay",rent:2244.0,balance:0,due:"2022-09-29",note:"Via: abnb | Tel: 215-668-6603",history:[{"date": "2022-09-29", "text": "$2,244.00 \u2014 stay (2022-09-29 \u2192 2022-09-29)"}],archived:true,archived_date:"2022-09-29"},
  {id:1071,apt:"426-2",owner:"ERA LT",name:"Anastasia Zemchenko",type:"long-term",rent:0.0,balance:0,due:"2022-09-24",note:"",history:[],archived:true,archived_date:"2022-09-24"},
  {id:1072,apt:"426-4",owner:"ERA LT",name:"Olena Bogdanovych",type:"long-term",rent:2167.0,balance:0,due:"2023-10-26",note:"Via: abnb | Tel: (267) 616-6795 | Email: elena.bogdanovich.eb@gmail.com",history:[{"date": "2022-10-01", "text": "$2,167 \u2014 monthly (est.)"}, {"date": "2022-11-01", "text": "$2,167 \u2014 monthly (est.)"}, {"date": "2022-12-01", "text": "$2,167 \u2014 monthly (est.)"}, {"date": "2023-01-01", "text": "$2,167 \u2014 monthly (est.)"}, {"date": "2023-02-01", "text": "$2,167 \u2014 monthly (est.)"}, {"date": "2023-03-01", "text": "$2,167 \u2014 monthly (est.)"}, {"date": "2023-04-01", "text": "$2,167 \u2014 monthly (est.)"}, {"date": "2023-05-01", "text": "$2,167 \u2014 monthly (est.)"}, {"date": "2023-06-01", "text": "$2,167 \u2014 monthly (est.)"}, {"date": "2023-07-01", "text": "$2,167 \u2014 monthly (est.)"}, {"date": "2023-08-01", "text": "$2,167 \u2014 monthly (est.)"}, {"date": "2023-09-01", "text": "$2,167 \u2014 monthly (est.)"}, {"date": "2023-10-01", "text": "$2,167 \u2014 monthly (est.)"}],archived:true,archived_date:"2023-10-26"},
  {id:1073,apt:"211",owner:"ERA LT",name:"David Hartt",type:"short-stay",rent:1477.0,balance:0,due:"2022-10-31",note:"Via: abnb | Tel: 312-813-0813",history:[{"date": "2022-10-14", "text": "$1,477.00 \u2014 stay (2022-10-14 \u2192 2022-10-31)"}],archived:true,archived_date:"2022-10-31"},
  {id:1074,apt:"128",owner:"ERA LT",name:"Nadine Maxwell",type:"long-term",rent:1850.0,balance:0,due:"2023-08-21",note:"Via: abnb | Tel: 516-451-5136",history:[{"date": "2022-08-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2022-09-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2022-10-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2022-11-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2022-12-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2023-01-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2023-02-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2023-03-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2023-04-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2023-05-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2023-06-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2023-07-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2023-08-01", "text": "$1,850 \u2014 monthly (est.)"}],archived:true,archived_date:"2023-08-21"},
  {id:1075,apt:"311",owner:"ERA LT",name:"Aleem - balance 350+850 + 150 (paid rent $2,100)",type:"long-term",rent:2250.0,balance:0,due:"2022-11-07",note:"Via: private | Tel: 2155599872 | Email: deerparl0317@gmail.com",history:[{"date": "2022-07-01", "text": "$2,250 \u2014 monthly (est.)"}, {"date": "2022-08-01", "text": "$2,250 \u2014 monthly (est.)"}, {"date": "2022-09-01", "text": "$2,250 \u2014 monthly (est.)"}, {"date": "2022-10-01", "text": "$2,250 \u2014 monthly (est.)"}, {"date": "2022-11-01", "text": "$2,250 \u2014 monthly (est.)"}],archived:true,archived_date:"2022-11-07"},
  {id:1076,apt:"426-1",owner:"ERA LT",name:"Daytona Mccoy",type:"short-stay",rent:694.0,balance:0,due:"2022-11-06",note:"Via: abnb | Tel: 267-251-5913",history:[{"date": "2022-10-30", "text": "$694.00 \u2014 stay (2022-10-30 \u2192 2022-11-06)"}],archived:true,archived_date:"2022-11-06"},
  {id:1077,apt:"426-1",owner:"ERA LT",name:"Oleg Lomaka",type:"short-stay",rent:694.0,balance:0,due:"2022-11-09",note:"Via: abnb | Tel: 380 50 611 1183",history:[{"date": "2022-11-16", "text": "$694.00 \u2014 stay (2022-11-16 \u2192 2022-11-09)"}],archived:true,archived_date:"2022-11-09"},
  {id:1078,apt:"128",owner:"ERA LT",name:"Daytona Mccoy",type:"short-stay",rent:357.0,balance:0,due:"2022-11-09",note:"Via: abnb | Tel: 267-251-5913",history:[{"date": "2022-11-09", "text": "$357.00 \u2014 stay (2022-11-09 \u2192 2022-11-09)"}],archived:true,archived_date:"2022-11-09"},
  {id:1079,apt:"212",owner:"ERA LT",name:"Margaret Gromlich",type:"short-stay",rent:802.0,balance:0,due:"2022-11-21",note:"Via: abnb | Tel: 13025283678",history:[{"date": "2022-11-13", "text": "$802.00 \u2014 stay (2022-11-13 \u2192 2022-11-21)"}],archived:true,archived_date:"2022-11-21"},
  {id:1080,apt:"211",owner:"ERA LT",name:"Stepan",type:"short-stay",rent:1165.0,balance:0,due:"2022-11-29",note:"Via: abnb | Tel: 2153955920",history:[{"date": "2022-11-15", "text": "$1,165.00 \u2014 stay (2022-11-15 \u2192 2022-11-29)"}],archived:true,archived_date:"2022-11-29"},
  {id:1081,apt:"212",owner:"ERA LT",name:"Sharron Russell",type:"short-stay",rent:1215.0,balance:0,due:"2022-12-03",note:"Via: abnbb | Tel: 484-222-1537",history:[{"date": "2022-11-21", "text": "$1,215.00 \u2014 stay (2022-11-21 \u2192 2022-12-03)"}],archived:true,archived_date:"2022-12-03"},
  {id:1082,apt:"223",owner:"ERA LT",name:"Maged Khoory",type:"long-term",rent:10250.0,balance:0,due:"2022-12-09",note:"Via: abnb | Tel: 207-475-5838",history:[{"date": "2022-06-01", "text": "$10,250 \u2014 monthly (est.)"}, {"date": "2022-07-01", "text": "$10,250 \u2014 monthly (est.)"}, {"date": "2022-08-01", "text": "$10,250 \u2014 monthly (est.)"}, {"date": "2022-09-01", "text": "$10,250 \u2014 monthly (est.)"}, {"date": "2022-10-01", "text": "$10,250 \u2014 monthly (est.)"}, {"date": "2022-11-01", "text": "$10,250 \u2014 monthly (est.)"}, {"date": "2022-12-01", "text": "$10,250 \u2014 monthly (est.)"}],archived:true,archived_date:"2022-12-09"},
  {id:1083,apt:"426-1",owner:"ERA LT",name:"Alexander Thermenos",type:"short-stay",rent:908.0,balance:0,due:"2022-12-14",note:"Via: abnb | Tel: 321-439-1712",history:[{"date": "2022-12-05", "text": "$908.00 \u2014 stay (2022-12-05 \u2192 2022-12-14)"}],archived:true,archived_date:"2022-12-14"},
  {id:1084,apt:"320",owner:"ERA LT",name:"Christina Stevens",type:"short-stay",rent:1861.0,balance:0,due:"2022-11-21",note:"Via: abnb | Tel: 1 310-272-0545",history:[{"date": "2022-10-28", "text": "$1,861.00 \u2014 stay (2022-10-28 \u2192 2022-11-21)"}],archived:true,archived_date:"2022-11-21"},
  {id:1085,apt:"318",owner:"ERA LT",name:"Maggie Gromlitch",type:"long-term",rent:2100.0,balance:0,due:"2022-12-31",note:"Via: zillow | Tel: 3025283678 | Email: mkg.gromlich@gmail.com",history:[{"date": "2022-12-01", "text": "$2,100 \u2014 monthly (est.)"}],archived:true,archived_date:"2022-12-31"},
  {id:1086,apt:"Noble",owner:"Noble Properties",name:"Neal Gauger",type:"short-stay",rent:6400.0,balance:0,due:"2022-12-31",note:"Via: abnb | Tel: 267-255-0685 | Email: nealjgauger@gmail.com",history:[{"date": "2022-12-14", "text": "$6,400.00 \u2014 stay (2022-12-14 \u2192 2022-12-31)"}],archived:true,archived_date:"2022-12-31"},
  {id:1087,apt:"221",owner:"ERA LT",name:"Priscilla Porch notice till 12/31/22,",type:"long-term",rent:1850.0,balance:0,due:"2023-06-30",note:"Via: private | Tel: (267) 205-0025 | Email: priscillaporch@yahoo.com",history:[{"date": "2022-07-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2022-08-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2022-09-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2022-10-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2022-11-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2022-12-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2023-01-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2023-02-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2023-03-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2023-04-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2023-05-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2023-06-01", "text": "$1,850 \u2014 monthly (est.)"}],archived:true,archived_date:"2023-06-30"},
  {id:1088,apt:"115",owner:"ERA LT",name:"Karla Witherspoon",type:"short-stay",rent:1950.0,balance:0,due:"2021-12-24",note:"Via: abnb | Tel: 484-358-1943",history:[{"date": "2021-10-31", "text": "$1,950.00 \u2014 stay (2021-10-31 \u2192 2021-12-24)"}],archived:true,archived_date:"2021-12-24"},
  {id:1089,apt:"Melrose CH",owner:"Melrose Properties",name:"Dominic Sampson- paid only $130 -move out 02/28",type:"long-term",rent:1280.0,balance:0,due:"2023-03-31",note:"Via: original | Tel: 215-279-3024 | Email: dominicsampson23@gmail.com",history:[{"date": "2023-01-01", "text": "$1,280 \u2014 monthly (est.)"}, {"date": "2023-02-01", "text": "$1,280 \u2014 monthly (est.)"}, {"date": "2023-03-01", "text": "$1,280 \u2014 monthly (est.)"}],archived:true,archived_date:"2023-03-31"},
  {id:1090,apt:"223",owner:"ERA LT",name:"Iraklii Margelashvili",type:"long-term",rent:1850.0,balance:0,due:"2023-12-30",note:"Via: facebook | Tel: (936) 777-3523 | Email: irakli059@gmail.com",history:[{"date": "2022-12-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2023-01-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2023-02-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2023-03-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2023-04-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2023-05-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2023-06-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2023-07-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2023-08-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2023-09-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2023-10-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2023-11-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2023-12-01", "text": "$1,850 \u2014 monthly (est.)"}],archived:true,archived_date:"2023-12-30"},
  {id:1091,apt:"222",owner:"ERA LT",name:"Patricia Jones - notice to vacate,",type:"long-term",rent:1900.0,balance:0,due:"2023-02-09",note:"Via: Zillow | Tel: 215-837-0986 | Email: pattyj2501@gmail.com",history:[{"date": "2022-02-01", "text": "$1,900 \u2014 monthly (est.)"}, {"date": "2022-03-01", "text": "$1,900 \u2014 monthly (est.)"}, {"date": "2022-04-01", "text": "$1,900 \u2014 monthly (est.)"}, {"date": "2022-05-01", "text": "$1,900 \u2014 monthly (est.)"}, {"date": "2022-06-01", "text": "$1,900 \u2014 monthly (est.)"}, {"date": "2022-07-01", "text": "$1,900 \u2014 monthly (est.)"}, {"date": "2022-08-01", "text": "$1,900 \u2014 monthly (est.)"}, {"date": "2022-09-01", "text": "$1,900 \u2014 monthly (est.)"}, {"date": "2022-10-01", "text": "$1,900 \u2014 monthly (est.)"}, {"date": "2022-11-01", "text": "$1,900 \u2014 monthly (est.)"}, {"date": "2022-12-01", "text": "$1,900 \u2014 monthly (est.)"}, {"date": "2023-01-01", "text": "$1,900 \u2014 monthly (est.)"}, {"date": "2023-02-01", "text": "$1,900 \u2014 monthly (est.)"}],archived:true,archived_date:"2023-02-09"},
  {id:1092,apt:"Noble",owner:"Noble Properties",name:"Irina Abrams",type:"short-stay",rent:724.0,balance:0,due:"2023-02-18",note:"Via: abnb | Tel: 8654054953",history:[{"date": "2023-02-15", "text": "$724.00 \u2014 stay (2023-02-15 \u2192 2023-02-18)"}],archived:true,archived_date:"2023-02-18"},
  {id:1093,apt:"211",owner:"ERA LT",name:"Vincent Sacco",type:"short-stay",rent:6049.0,balance:0,due:"2023-02-28",note:"Via: abnb | Tel: 484-238-5935",history:[{"date": "2022-12-01", "text": "$6,049.00 \u2014 stay (2022-12-01 \u2192 2023-02-28)"}],archived:true,archived_date:"2023-02-28"},
  {id:1094,apt:"223",owner:"ERA LT",name:"Amy Barnhart",type:"short-stay",rent:4962.0,balance:0,due:"2023-02-28",note:"Via: abnb | Tel: 734-323-4450",history:[{"date": "2023-01-29", "text": "$4,962.00 \u2014 stay (2023-01-29 \u2192 2023-02-28)"}],archived:true,archived_date:"2023-02-28"},
  {id:1095,apt:"426-2",owner:"ERA LT",name:"Seda Darchieva-",type:"long-term",rent:1400.0,balance:0,due:"2023-11-07",note:"Via: Facebook | Tel: (619) 983-5760 | Email: khamzatsigauri@gmail.com",history:[{"date": "2022-11-01", "text": "$1,400 \u2014 monthly (est.)"}, {"date": "2022-12-01", "text": "$1,400 \u2014 monthly (est.)"}, {"date": "2023-01-01", "text": "$1,400 \u2014 monthly (est.)"}, {"date": "2023-02-01", "text": "$1,400 \u2014 monthly (est.)"}, {"date": "2023-03-01", "text": "$1,400 \u2014 monthly (est.)"}, {"date": "2023-04-01", "text": "$1,400 \u2014 monthly (est.)"}, {"date": "2023-05-01", "text": "$1,400 \u2014 monthly (est.)"}, {"date": "2023-06-01", "text": "$1,400 \u2014 monthly (est.)"}, {"date": "2023-07-01", "text": "$1,400 \u2014 monthly (est.)"}, {"date": "2023-08-01", "text": "$1,400 \u2014 monthly (est.)"}, {"date": "2023-09-01", "text": "$1,400 \u2014 monthly (est.)"}, {"date": "2023-10-01", "text": "$1,400 \u2014 monthly (est.)"}, {"date": "2023-11-01", "text": "$1,400 \u2014 monthly (est.)"}],archived:true,archived_date:"2023-11-07"},
  {id:1096,apt:"Melrose A2",owner:"Melrose Properties",name:"Greg Orme-",type:"long-term",rent:1030.0,balance:0,due:"2023-03-31",note:"Via: original | Tel: 215-990-6086 | Email: gorm70@aol.com",history:[{"date": "2023-01-01", "text": "$1,030 \u2014 monthly (est.)"}, {"date": "2023-02-01", "text": "$1,030 \u2014 monthly (est.)"}, {"date": "2023-03-01", "text": "$1,030 \u2014 monthly (est.)"}],archived:true,archived_date:"2023-03-31"},
  {id:1097,apt:"223",owner:"ERA LT",name:"Fatiha",type:"short-stay",rent:2100.0,balance:0,due:"2023-03-31",note:"Via: abnb | Tel: 267-3357387",history:[{"date": "2023-03-01", "text": "$2,100.00 \u2014 stay (2023-03-01 \u2192 2023-03-31)"}],archived:true,archived_date:"2023-03-31"},
  {id:1098,apt:"318",owner:"ERA LT",name:"Jeannette Bergfeld",type:"short-stay",rent:0.0,balance:0,due:"2023-04-14",note:"Via: abnb | Tel: 314-471-9879",history:[],archived:true,archived_date:"2023-04-14"},
  {id:1099,apt:"Melrose C1",owner:"Melrose Properties",name:"Boichuk Liliia",type:"long-term",rent:1500.0,balance:0,due:"2024-01-31",note:"Via: facebook | Tel: 215-3595790 | Email: boychulilia@gmail.com",history:[{"date": "2023-02-01", "text": "$1,500 \u2014 monthly (est.)"}, {"date": "2023-03-01", "text": "$1,500 \u2014 monthly (est.)"}, {"date": "2023-04-01", "text": "$1,500 \u2014 monthly (est.)"}, {"date": "2023-05-01", "text": "$1,500 \u2014 monthly (est.)"}, {"date": "2023-06-01", "text": "$1,500 \u2014 monthly (est.)"}, {"date": "2023-07-01", "text": "$1,500 \u2014 monthly (est.)"}, {"date": "2023-08-01", "text": "$1,500 \u2014 monthly (est.)"}, {"date": "2023-09-01", "text": "$1,500 \u2014 monthly (est.)"}, {"date": "2023-10-01", "text": "$1,500 \u2014 monthly (est.)"}, {"date": "2023-11-01", "text": "$1,500 \u2014 monthly (est.)"}, {"date": "2023-12-01", "text": "$1,500 \u2014 monthly (est.)"}, {"date": "2024-01-01", "text": "$1,500 \u2014 monthly (est.)"}],archived:true,archived_date:"2024-01-31"},
  {id:1100,apt:"Noble",owner:"Noble Properties",name:"Krista",type:"long-term",rent:0.0,balance:0,due:"2023-05-07",note:"",history:[],archived:true,archived_date:"2023-05-07"},
  {id:1101,apt:"330",owner:"ERA LT",name:"Nato Abramashvili",type:"short-stay",rent:1240.0,balance:0,due:"2023-05-08",note:"Via: abnb | Tel: 9089372046",history:[{"date": "2023-04-22", "text": "$1,240.00 \u2014 stay (2023-04-22 \u2192 2023-05-08)"}],archived:true,archived_date:"2023-05-08"},
  {id:1102,apt:"Melrose C1",owner:"Melrose Properties",name:"Wenqi",type:"short-stay",rent:565.0,balance:0,due:"2023-05-14",note:"Via: airbnb",history:[{"date": "2023-05-09", "text": "$565.00 \u2014 stay (2023-05-09 \u2192 2023-05-14)"}],archived:true,archived_date:"2023-05-14"},
  {id:1103,apt:"115",owner:"ERA LT",name:"Carol Kamen",type:"short-stay",rent:1294.0,balance:0,due:"2023-05-15",note:"Via: airbnb | Tel: 602-882-0819",history:[{"date": "2023-05-01", "text": "$1,294.00 \u2014 stay (2023-05-01 \u2192 2023-05-15)"}],archived:true,archived_date:"2023-05-15"},
  {id:1104,apt:"232-Era",owner:"ERA LT",name:"Shah Pallavi",type:"short-stay",rent:2900.0,balance:0,due:"2023-04-26",note:"Via: abnb | Tel: (609) 577-0832 | Email: shirish11@hotmail.com",history:[{"date": "2023-03-27", "text": "$2,900.00 \u2014 stay (2023-03-27 \u2192 2023-04-26)"}],archived:true,archived_date:"2023-04-26"},
  {id:1105,apt:"115",owner:"ERA LT",name:"Tata Lei",type:"short-stay",rent:1340.0,balance:0,due:"2023-05-20",note:"Via: airbnb | Tel: 602-882-0819",history:[{"date": "2023-05-07", "text": "$1,340.00 \u2014 stay (2023-05-07 \u2192 2023-05-20)"}],archived:true,archived_date:"2023-05-20"},
  {id:1106,apt:"115",owner:"ERA LT",name:"Amy Navon",type:"short-stay",rent:0.0,balance:0,due:"2023-05-23",note:"Via: airbnb | Tel: 484-809-4077",history:[],archived:true,archived_date:"2023-05-23"},
  {id:1107,apt:"Noble",owner:"Noble Properties",name:"William Beckelman",type:"short-stay",rent:937.31,balance:0,due:"2023-05-24",note:"Via: airbnb | Tel: 732-768-3331",history:[{"date": "2023-05-21", "text": "$937.31 \u2014 stay (2023-05-21 \u2192 2023-05-24)"}],archived:true,archived_date:"2023-05-24"},
  {id:1108,apt:"202",owner:"ERA LT",name:"Dmytro Kyveliuk -",type:"long-term",rent:2300.0,balance:0,due:"2023-06-15",note:"Via: facebook | Tel: (215) 512-8669 | Email: kyveliukd@gmail.com",history:[{"date": "2022-07-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2022-08-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2022-09-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2022-10-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2022-11-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2022-12-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2023-01-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2023-02-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2023-03-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2023-04-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2023-05-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2023-06-01", "text": "$2,300 \u2014 monthly (est.)"}],archived:true,archived_date:"2023-06-15"},
  {id:1109,apt:"Office",owner:"ERA LT",name:"ReinaLee Colon/ Beauty company/ willbe late this month",type:"long-term",rent:1400.0,balance:0,due:"2023-07-31",note:"Via: Facebook | Tel: 267-912-2298 | Email: reinaleecolon24@outlook.com",history:[{"date": "2022-08-01", "text": "$1,400 \u2014 monthly (est.)"}, {"date": "2022-09-01", "text": "$1,400 \u2014 monthly (est.)"}, {"date": "2022-10-01", "text": "$1,400 \u2014 monthly (est.)"}, {"date": "2022-11-01", "text": "$1,400 \u2014 monthly (est.)"}, {"date": "2022-12-01", "text": "$1,400 \u2014 monthly (est.)"}, {"date": "2023-01-01", "text": "$1,400 \u2014 monthly (est.)"}, {"date": "2023-02-01", "text": "$1,400 \u2014 monthly (est.)"}, {"date": "2023-03-01", "text": "$1,400 \u2014 monthly (est.)"}, {"date": "2023-04-01", "text": "$1,400 \u2014 monthly (est.)"}, {"date": "2023-05-01", "text": "$1,400 \u2014 monthly (est.)"}, {"date": "2023-06-01", "text": "$1,400 \u2014 monthly (est.)"}, {"date": "2023-07-01", "text": "$1,400 \u2014 monthly (est.)"}],archived:true,archived_date:"2023-07-31"},
  {id:1110,apt:"426-3",owner:"ERA LT",name:"Anastasia Zemchenko -move out 05/15",type:"long-term",rent:2100.0,balance:0,due:"2023-09-24",note:"Via: abnb",history:[{"date": "2022-09-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2022-10-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2022-11-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2022-12-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2023-01-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2023-02-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2023-03-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2023-04-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2023-05-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2023-06-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2023-07-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2023-08-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2023-09-01", "text": "$2,100 \u2014 monthly (est.)"}],archived:true,archived_date:"2023-09-24"},
  {id:1111,apt:"Melrose CH",owner:"Melrose Properties",name:"Milton Virgilio - paid for 1 month 5/12",type:"short-stay",rent:2600.0,balance:0,due:"2023-06-11",note:"Via: abnb | Tel: 484-541-3606",history:[{"date": "2023-05-08", "text": "$2,600.00 \u2014 stay (2023-05-08 \u2192 2023-06-11)"}],archived:true,archived_date:"2023-06-11"},
  {id:1112,apt:"426-3",owner:"ERA LT",name:"Olufumialayo",type:"short-stay",rent:960.0,balance:0,due:"2023-05-29",note:"Via: abnb | Tel: 267-596-5790",history:[{"date": "2023-05-19", "text": "$960.00 \u2014 stay (2023-05-19 \u2192 2023-05-29)"}],archived:true,archived_date:"2023-05-29"},
  {id:1113,apt:"205",owner:"ERA LT",name:"Fatiha",type:"short-stay",rent:1876.0,balance:0,due:"2023-06-12",note:"Via: abnb | Tel: 267-335-7387",history:[{"date": "2023-05-22", "text": "$1,876.00 \u2014 stay (2023-05-22 \u2192 2023-06-12)"}],archived:true,archived_date:"2023-06-12"},
  {id:1114,apt:"Melrose C1",owner:"Melrose Properties",name:"Jennifer",type:"short-stay",rent:0.0,balance:0,due:"2023-06-15",note:"Via: vrbo",history:[],archived:true,archived_date:"2023-06-15"},
  {id:1115,apt:"232-Era",owner:"ERA LT",name:"Anthony",type:"short-stay",rent:0.0,balance:0,due:"2023-06-12",note:"Via: abnb | Tel: 1 314-326-2275",history:[],archived:true,archived_date:"2023-06-12"},
  {id:1116,apt:"Melrose CH",owner:"Melrose Properties",name:"Khalidi Ponela",type:"short-stay",rent:558.0,balance:0,due:"2023-06-20",note:"Via: abnb | Tel: 215-681-9200",history:[{"date": "2023-06-16", "text": "$558.00 \u2014 stay (2023-06-16 \u2192 2023-06-20)"}],archived:true,archived_date:"2023-06-20"},
  {id:1117,apt:"426-3",owner:"ERA LT",name:"Alisha Ellis",type:"short-stay",rent:528.0,balance:0,due:"2023-06-21",note:"Via: abnb | Tel: 412-808-4068",history:[{"date": "2023-06-16", "text": "$528.00 \u2014 stay (2023-06-16 \u2192 2023-06-21)"}],archived:true,archived_date:"2023-06-21"},
  {id:1118,apt:"330",owner:"ERA LT",name:"Matt Chialton",type:"short-stay",rent:2550.0,balance:0,due:"2023-06-23",note:"Via: airbnb | Tel: 44 7855 954893",history:[{"date": "2023-05-22", "text": "$2,550.00 \u2014 stay (2023-05-22 \u2192 2023-06-23)"}],archived:true,archived_date:"2023-06-23"},
  {id:1119,apt:"223",owner:"ERA LT",name:"Alaisha Sayed",type:"long-term",rent:4400.0,balance:0,due:"2023-06-26",note:"Via: facebook | Tel: (717) 580-9103 | Email: AlaishaSayed@gmail.com",history:[{"date": "2023-04-01", "text": "$4,400 \u2014 monthly (est.)"}, {"date": "2023-05-01", "text": "$4,400 \u2014 monthly (est.)"}, {"date": "2023-06-01", "text": "$4,400 \u2014 monthly (est.)"}],archived:true,archived_date:"2023-06-26"},
  {id:1120,apt:"Melrose CH",owner:"Melrose Properties",name:"Jeremy Locke",type:"short-stay",rent:558.0,balance:0,due:"2023-06-26",note:"Via: abnb | Tel: 615-638-6823",history:[{"date": "2023-06-23", "text": "$558.00 \u2014 stay (2023-06-23 \u2192 2023-06-26)"}],archived:true,archived_date:"2023-06-26"},
  {id:1121,apt:"219",owner:"ERA LT",name:"Dmitro Kulibabin -paid 1000 6/29",type:"long-term",rent:1850.0,balance:0,due:"2023-10-14",note:"Via: Facebook | Tel: 2679445953 | Email: dk1000085@gmail.com",history:[{"date": "2022-10-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2022-11-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2022-12-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2023-01-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2023-02-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2023-03-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2023-04-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2023-05-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2023-06-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2023-07-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2023-08-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2023-09-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2023-10-01", "text": "$1,850 \u2014 monthly (est.)"}],archived:true,archived_date:"2023-10-14"},
  {id:1122,apt:"329",owner:"ERA LT",name:"Avery Rolle-",type:"long-term",rent:1700.0,balance:0,due:"2024-03-11",note:"Via: Facebook | Tel: 717-856-8980 | Email: averyrolle@gmail.com",history:[{"date": "2022-03-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2022-04-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2022-05-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2022-06-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2022-07-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2022-08-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2022-09-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2022-10-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2022-11-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2022-12-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2023-01-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2023-02-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2023-03-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2023-04-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2023-05-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2023-06-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2023-07-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2023-08-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2023-09-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2023-10-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2023-11-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2023-12-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2024-01-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2024-02-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2024-03-01", "text": "$1,700 \u2014 monthly (est.)"}],archived:true,archived_date:"2024-03-11"},
  {id:1123,apt:"426/3",owner:"ERA LT",name:"Valimagomed Magomedov",type:"short-stay",rent:528.0,balance:0,due:"223-06-28",note:"Via: abnb | Tel: 267-885-8639",history:[{"date": "2023-06-21", "text": "$528.00 \u2014 stay (2023-06-21 \u2192 223-06-28)"}],archived:true,archived_date:"223-06-28"},
  {id:1124,apt:"CH",owner:"ERA LT",name:"Xianwang Rao",type:"long-term",rent:0.0,balance:0,due:"2023-07-04",note:"Tel: 8615919890136",history:[],archived:true,archived_date:"2023-07-04"},
  {id:1125,apt:"223",owner:"ERA LT",name:"Tyler Selek",type:"long-term",rent:0.0,balance:0,due:"2023-07-09",note:"Tel: 717-663-9070",history:[],archived:true,archived_date:"2023-07-09"},
  {id:1126,apt:"232-Era",owner:"ERA LT",name:"Alison Martin",type:"short-stay",rent:2706.0,balance:0,due:"2023-06-19",note:"Via: abnb | Tel: 267-401-4913",history:[{"date": "2023-06-19", "text": "$2,706.00 \u2014 stay (2023-06-19 \u2192 2023-06-19)"}],archived:true,archived_date:"2023-06-19"},
  {id:1127,apt:"426-3",owner:"ERA LT",name:"Patrick Moylan",type:"short-stay",rent:0.0,balance:0,due:"2023-07-04",note:"Via: abnb | Tel: 267-575-6633",history:[],archived:true,archived_date:"2023-07-04"},
  {id:1128,apt:"207",owner:"ERA LT",name:"Marcella Vence - paid 800",type:"long-term",rent:1500.0,balance:0,due:"2023-05-31",note:"Via: facebook | Tel: 267-982-9604 | Email: myvance36@gmail.com",history:[{"date": "2022-06-01", "text": "$1,500 \u2014 monthly (est.)"}, {"date": "2022-07-01", "text": "$1,500 \u2014 monthly (est.)"}, {"date": "2022-08-01", "text": "$1,500 \u2014 monthly (est.)"}, {"date": "2022-09-01", "text": "$1,500 \u2014 monthly (est.)"}, {"date": "2022-10-01", "text": "$1,500 \u2014 monthly (est.)"}, {"date": "2022-11-01", "text": "$1,500 \u2014 monthly (est.)"}, {"date": "2022-12-01", "text": "$1,500 \u2014 monthly (est.)"}, {"date": "2023-01-01", "text": "$1,500 \u2014 monthly (est.)"}, {"date": "2023-02-01", "text": "$1,500 \u2014 monthly (est.)"}, {"date": "2023-03-01", "text": "$1,500 \u2014 monthly (est.)"}, {"date": "2023-04-01", "text": "$1,500 \u2014 monthly (est.)"}, {"date": "2023-05-01", "text": "$1,500 \u2014 monthly (est.)"}],archived:true,archived_date:"2023-05-31"},
  {id:1129,apt:"205",owner:"ERA LT",name:"Swe Swe Hlaing",type:"long-term",rent:1876.0,balance:0,due:"2023-07-23",note:"Via: 1876 | Tel: 929-328-9172",history:[{"date": "2023-06-01", "text": "$1,876 \u2014 monthly (est.)"}, {"date": "2023-07-01", "text": "$1,876 \u2014 monthly (est.)"}],archived:true,archived_date:"2023-07-23"},
  {id:1130,apt:"426-3",owner:"ERA LT",name:"Syed Abbas",type:"short-stay",rent:730.0,balance:0,due:"2023-07-27",note:"Via: abnb | Tel: 347-653-0563",history:[{"date": "2023-07-19", "text": "$730.00 \u2014 stay (2023-07-19 \u2192 2023-07-27)"}],archived:true,archived_date:"2023-07-27"},
  {id:1131,apt:"Melrose CH",owner:"Melrose Properties",name:"Jesus Gavina",type:"short-stay",rent:0.0,balance:0,due:"2023-07-05",note:"Via: abnb | Tel: 256-470-3867",history:[],archived:true,archived_date:"2023-07-05"},
  {id:1132,apt:"Noble",owner:"Noble Properties",name:"Alastair Sanderson",type:"short-stay",rent:1730.0,balance:0,due:"2023-07-29",note:"Via: abnb | Tel: 44 7557 733938",history:[{"date": "2023-07-23", "text": "$1,730.00 \u2014 stay (2023-07-23 \u2192 2023-07-29)"}],archived:true,archived_date:"2023-07-29"},
  {id:1133,apt:"Melrose A2",owner:"Melrose Properties",name:"Carolyn Gessner",type:"long-term",rent:1550.0,balance:0,due:"2023-08-15",note:"Via: Facebook | Tel: (215) 880-8781 | Email: carlyhg1994@gmail.com",history:[{"date": "2023-04-01", "text": "$1,550 \u2014 monthly (est.)"}, {"date": "2023-05-01", "text": "$1,550 \u2014 monthly (est.)"}, {"date": "2023-06-01", "text": "$1,550 \u2014 monthly (est.)"}, {"date": "2023-07-01", "text": "$1,550 \u2014 monthly (est.)"}, {"date": "2023-08-01", "text": "$1,550 \u2014 monthly (est.)"}],archived:true,archived_date:"2023-08-15"},
  {id:1134,apt:"320",owner:"ERA LT",name:"Andreii Mytsak",type:"long-term",rent:1850.0,balance:0,due:"2024-01-04",note:"Via: facebook | Tel: (267) 310-5265 | Email: mytsak.andrey@gmail.com",history:[{"date": "2023-01-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2023-02-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2023-03-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2023-04-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2023-05-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2023-06-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2023-07-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2023-08-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2023-09-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2023-10-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2023-11-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2023-12-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2024-01-01", "text": "$1,850 \u2014 monthly (est.)"}],archived:true,archived_date:"2024-01-04"},
  {id:1135,apt:"223",owner:"ERA LT",name:"Mark Edelson",type:"short-stay",rent:2252.0,balance:0,due:"2023-08-05",note:"Via: abnb | Tel: 302-584-4360",history:[{"date": "2023-07-09", "text": "$2,252.00 \u2014 stay (2023-07-09 \u2192 2023-08-05)"}],archived:true,archived_date:"2023-08-05"},
  {id:1136,apt:"330",owner:"ERA LT",name:"Brady",type:"short-stay",rent:0.0,balance:0,due:"2023-08-05",note:"Via: abnb",history:[],archived:true,archived_date:"2023-08-05"},
  {id:1137,apt:"Melrose CH",owner:"Melrose Properties",name:"Khambrel Evans",type:"short-stay",rent:548.0,balance:0,due:"2023-08-05",note:"Via: abnb | Tel: 215-278-5213",history:[{"date": "2023-07-31", "text": "$548.00 \u2014 stay (2023-07-31 \u2192 2023-08-05)"}],archived:true,archived_date:"2023-08-05"},
  {id:1138,apt:"232",owner:"ERA LT",name:"Tyler Selek",type:"short-stay",rent:1843.0,balance:0,due:"2023-07-31",note:"Via: abnb | Tel: 717-663-9070",history:[{"date": "2023-07-12", "text": "$1,843.00 \u2014 stay (2023-07-12 \u2192 2023-07-31)"}],archived:true,archived_date:"2023-07-31"},
  {id:1139,apt:"318",owner:"ERA LT",name:"Joseph",type:"short-stay",rent:0.0,balance:0,due:"2023-07-01",note:"Via: abnb",history:[],archived:true,archived_date:"2023-07-01"},
  {id:1140,apt:"426-3",owner:"ERA LT",name:"Ryan Gott",type:"short-stay",rent:576.0,balance:0,due:"2023-08-18",note:"Via: abnb | Tel: 918-766-4650",history:[{"date": "2023-08-12", "text": "$576.00 \u2014 stay (2023-08-12 \u2192 2023-08-18)"}],archived:true,archived_date:"2023-08-18"},
  {id:1141,apt:"205",owner:"ERA LT",name:"Mara FosterGray",type:"long-term",rent:1905.0,balance:0,due:"2023-08-19",note:"Tel: 814-602-3028",history:[{"date": "2023-07-01", "text": "$1,905 \u2014 monthly (est.)"}, {"date": "2023-08-01", "text": "$1,905 \u2014 monthly (est.)"}],archived:true,archived_date:"2023-08-19"},
  {id:1142,apt:"223",owner:"ERA LT",name:"Tyler Selek",type:"short-stay",rent:1843.0,balance:0,due:"2023-07-31",note:"Via: abnb | Tel: 717-663-9070",history:[{"date": "2023-07-12", "text": "$1,843.00 \u2014 stay (2023-07-12 \u2192 2023-07-31)"}],archived:true,archived_date:"2023-07-31"},
  {id:1143,apt:"426-3",owner:"ERA LT",name:"Ammar Nomani",type:"short-stay",rent:1066.03,balance:0,due:"2023-09-01",note:"Via: abnb",history:[{"date": "2023-08-19", "text": "$1,066.03 \u2014 stay (2023-08-19 \u2192 2023-09-01)"}],archived:true,archived_date:"2023-09-01"},
  {id:1144,apt:"320",owner:"ERA LT",name:"Thayjas Patil",type:"short-stay",rent:3151.0,balance:0,due:"2023-09-02",note:"Via: abnb | Tel: 610-451-5707",history:[{"date": "2023-07-30", "text": "$3,151.00 \u2014 stay (2023-07-30 \u2192 2023-09-02)"}],archived:true,archived_date:"2023-09-02"},
  {id:1145,apt:"Melrose CH",owner:"Melrose Properties",name:"Vera Wubah",type:"short-stay",rent:2421.0,balance:0,due:"2023-09-12",note:"Via: abnb | Tel: 267-266-0174",history:[{"date": "2023-08-07", "text": "$2,421.00 \u2014 stay (2023-08-07 \u2192 2023-09-12)"}],archived:true,archived_date:"2023-09-12"},
  {id:1146,apt:"329",owner:"ERA LT",name:"Josh Gagnon",type:"short-stay",rent:1235.0,balance:0,due:"2023-09-16",note:"Via: abnb | Tel: 856-701-2592",history:[{"date": "2023-09-02", "text": "$1,235.00 \u2014 stay (2023-09-02 \u2192 2023-09-16)"}],archived:true,archived_date:"2023-09-16"},
  {id:1147,apt:"230",owner:"ERA LT",name:"Volodymyr Bilokobylskyi",type:"long-term",rent:1600.0,balance:0,due:"2023-09-19",note:"Via: facebook | Tel: (267) 265-5422 | Email: polina20091975@gmail.com",history:[{"date": "2022-11-01", "text": "$1,600 \u2014 monthly (est.)"}, {"date": "2022-12-01", "text": "$1,600 \u2014 monthly (est.)"}, {"date": "2023-01-01", "text": "$1,600 \u2014 monthly (est.)"}, {"date": "2023-02-01", "text": "$1,600 \u2014 monthly (est.)"}, {"date": "2023-03-01", "text": "$1,600 \u2014 monthly (est.)"}, {"date": "2023-04-01", "text": "$1,600 \u2014 monthly (est.)"}, {"date": "2023-05-01", "text": "$1,600 \u2014 monthly (est.)"}, {"date": "2023-06-01", "text": "$1,600 \u2014 monthly (est.)"}, {"date": "2023-07-01", "text": "$1,600 \u2014 monthly (est.)"}, {"date": "2023-08-01", "text": "$1,600 \u2014 monthly (est.)"}, {"date": "2023-09-01", "text": "$1,600 \u2014 monthly (est.)"}],archived:true,archived_date:"2023-09-19"},
  {id:1148,apt:"205",owner:"ERA LT",name:"Yang Gu",type:"short-stay",rent:1165.0,balance:0,due:"2023-09-25",note:"Via: abnb | Tel: (920)-539-3458",history:[{"date": "2023-09-10", "text": "$1,165.00 \u2014 stay (2023-09-10 \u2192 2023-09-25)"}],archived:true,archived_date:"2023-09-25"},
  {id:1149,apt:"318",owner:"ERA LT",name:"Tsehaitu",type:"short-stay",rent:2784.72,balance:0,due:"2023-09-28",note:"Via: abnb | Tel: 1-808-391-8353",history:[{"date": "2023-08-29", "text": "$2,784.72 \u2014 stay (2023-08-29 \u2192 2023-09-28)"}],archived:true,archived_date:"2023-09-28"},
  {id:1150,apt:"112",owner:"ERA LT",name:"Kennesha Warren",type:"long-term",rent:2100.0,balance:0,due:"2023-09-24",note:"Via: Zillow | Tel: 832-764-1324 | Email: kenneshawarren@gmail.com",history:[{"date": "2022-03-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2022-04-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2022-05-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2022-06-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2022-07-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2022-08-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2022-09-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2022-10-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2022-11-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2022-12-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2023-01-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2023-02-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2023-03-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2023-04-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2023-05-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2023-06-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2023-07-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2023-08-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2023-09-01", "text": "$2,100 \u2014 monthly (est.)"}],archived:true,archived_date:"2023-09-24"},
  {id:1151,apt:"131",owner:"ERA LT",name:"Art Beitchman",type:"long-term",rent:1400.0,balance:0,due:"2023-09-30",note:"Via: Lindy | Email: artbeitchman68@gmail.com",history:[{"date": "2022-06-01", "text": "$1,400 \u2014 monthly (est.)"}, {"date": "2022-07-01", "text": "$1,400 \u2014 monthly (est.)"}, {"date": "2022-08-01", "text": "$1,400 \u2014 monthly (est.)"}, {"date": "2022-09-01", "text": "$1,400 \u2014 monthly (est.)"}, {"date": "2022-10-01", "text": "$1,400 \u2014 monthly (est.)"}, {"date": "2022-11-01", "text": "$1,400 \u2014 monthly (est.)"}, {"date": "2022-12-01", "text": "$1,400 \u2014 monthly (est.)"}, {"date": "2023-01-01", "text": "$1,400 \u2014 monthly (est.)"}, {"date": "2023-02-01", "text": "$1,400 \u2014 monthly (est.)"}, {"date": "2023-03-01", "text": "$1,400 \u2014 monthly (est.)"}, {"date": "2023-04-01", "text": "$1,400 \u2014 monthly (est.)"}, {"date": "2023-05-01", "text": "$1,400 \u2014 monthly (est.)"}, {"date": "2023-06-01", "text": "$1,400 \u2014 monthly (est.)"}, {"date": "2023-07-01", "text": "$1,400 \u2014 monthly (est.)"}, {"date": "2023-08-01", "text": "$1,400 \u2014 monthly (est.)"}, {"date": "2023-09-01", "text": "$1,400 \u2014 monthly (est.)"}],archived:true,archived_date:"2023-09-30"},
  {id:1152,apt:"232",owner:"ERA LT",name:"Kenzhetaeva Asel",type:"long-term",rent:0.0,balance:0,due:"2023-10-04",note:"Tel: (267) 334-1292 | Email: esenbek18@gmail.com",history:[],archived:true,archived_date:"2023-10-04"},
  {id:1153,apt:"311",owner:"ERA LT",name:"Ayazbek Baktybayevy (paid $1000 at 09/21)",type:"long-term",rent:1850.0,balance:0,due:"2023-10-04",note:"Via: facebook | Tel: 917-930-0994 | Email: Raniyaarlan007@gmail.com",history:[{"date": "2022-11-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2022-12-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2023-01-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2023-02-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2023-03-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2023-04-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2023-05-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2023-06-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2023-07-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2023-08-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2023-09-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2023-10-01", "text": "$1,850 \u2014 monthly (est.)"}],archived:true,archived_date:"2023-10-04"},
  {id:1154,apt:"Melrose CH",owner:"Melrose Properties",name:"Cheikh",type:"short-stay",rent:2824.0,balance:0,due:"2023-10-15",note:"Via: abnb",history:[{"date": "2023-09-16", "text": "$2,824.00 \u2014 stay (2023-09-16 \u2192 2023-10-15)"}],archived:true,archived_date:"2023-10-15"},
  {id:1155,apt:"Montg #1A",owner:"Elkins LT",name:"Marian Howard/Shiverl Yongu",type:"long-term",rent:730.0,balance:0,due:"2023-10-16",note:"Tel: (215) 880-5309 | Email: yongushiverl2155@gmail.com",history:[{"date": "2023-10-01", "text": "$730 \u2014 monthly (est.)"}],archived:true,archived_date:"2023-10-16"},
  {id:1156,apt:"Montg 2",owner:"Elkins LT",name:"Craig Carracappa and Evan",type:"long-term",rent:1505.0,balance:0,due:"2023-10-18",note:"Tel: (484) 574-0698 | Email: cjcarracappa@gmail.com",history:[{"date": "2023-10-01", "text": "$1,505 \u2014 monthly (est.)"}],archived:true,archived_date:"2023-10-18"},
  {id:1157,apt:"232",owner:"ERA LT",name:"Daryl",type:"short-stay",rent:1249.36,balance:0,due:"2023-10-30",note:"Via: abnb | Tel: 267-290-9377",history:[{"date": "2023-10-16", "text": "$1,249.36 \u2014 stay (2023-10-16 \u2192 2023-10-30)"}],archived:true,archived_date:"2023-10-30"},
  {id:1158,apt:"320",owner:"ERA LT",name:"James Gasber",type:"short-stay",rent:2761.59,balance:0,due:"2023-10-31",note:"Via: abnb | Tel: 1 630-290-6529",history:[{"date": "2023-10-03", "text": "$2,761.59 \u2014 stay (2023-10-03 \u2192 2023-10-31)"}],archived:true,archived_date:"2023-10-31"},
  {id:1159,apt:"426-3",owner:"ERA LT",name:"Jonibek (3 guys are living there. waiting for 2br at 46 Township)",type:"long-term",rent:0.0,balance:0,due:"2023-10-31",note:"",history:[],archived:true,archived_date:"2023-10-31"},
  {id:1160,apt:"Montg 1",owner:"Elkins LT",name:"Shaun Till/Christine Halasz",type:"long-term",rent:1224.0,balance:0,due:"2023-10-31",note:"Tel: (484) 929-7019 | Email: shauntill94@gmail.com",history:[{"date": "2023-10-01", "text": "$1,224 \u2014 monthly (est.)"}],archived:true,archived_date:"2023-10-31"},
  {id:1161,apt:"Montg 4",owner:"Elkins LT",name:"Matthew Gormley/Rita Laychock",type:"long-term",rent:1169.0,balance:0,due:"2023-10-31",note:"Tel: (267) 994-9971 | Email: matthewg1481@gmail.com",history:[{"date": "2023-10-01", "text": "$1,169 \u2014 monthly (est.)"}],archived:true,archived_date:"2023-10-31"},
  {id:1162,apt:"Melrose C1",owner:"Melrose Properties",name:"Tyler Harrington",type:"long-term",rent:1500.0,balance:0,due:"2023-11-01",note:"Tel: 318) 560-816 | Email: tharrington0916@gmail.com",history:[{"date": "2023-07-01", "text": "$1,500 \u2014 monthly (est.)"}, {"date": "2023-08-01", "text": "$1,500 \u2014 monthly (est.)"}, {"date": "2023-09-01", "text": "$1,500 \u2014 monthly (est.)"}, {"date": "2023-10-01", "text": "$1,500 \u2014 monthly (est.)"}, {"date": "2023-11-01", "text": "$1,500 \u2014 monthly (est.)"}],archived:true,archived_date:"2023-11-01"},
  {id:1163,apt:"115",owner:"ERA LT",name:"Alyxe Fields",type:"short-stay",rent:2500.0,balance:0,due:"2023-11-04",note:"Via: abnb | Tel: 267-325-6837",history:[{"date": "2023-08-15", "text": "$2,500.00 \u2014 stay (2023-08-15 \u2192 2023-11-04)"}],archived:true,archived_date:"2023-11-04"},
  {id:1164,apt:"211",owner:"ERA LT",name:"Eric",type:"short-stay",rent:1385.16,balance:0,due:"2023-11-08",note:"Via: abnb | Tel: 203-368-8301",history:[{"date": "2023-10-22", "text": "$1,385.16 \u2014 stay (2023-10-22 \u2192 2023-11-08)"}],archived:true,archived_date:"2023-11-08"},
  {id:1165,apt:"426-4",owner:"ERA LT",name:"Alita",type:"short-stay",rent:785.7,balance:0,due:"2023-11-15",note:"Via: abnb | Tel: 267-231-0693",history:[{"date": "2023-11-01", "text": "$785.70 \u2014 stay (2023-11-01 \u2192 2023-11-15)"}],archived:true,archived_date:"2023-11-15"},
  {id:1166,apt:"Melrose CH",owner:"Melrose Properties",name:"Sviatlana Shyrokava",type:"short-stay",rent:2875.0,balance:0,due:"2023-11-16",note:"Via: abnb | Tel: 732-330-72-57",history:[{"date": "2023-10-18", "text": "$2,875.00 \u2014 stay (2023-10-18 \u2192 2023-11-16)"}],archived:true,archived_date:"2023-11-16"},
  {id:1167,apt:"232",owner:"ERA LT",name:"Charisma",type:"short-stay",rent:1297.86,balance:0,due:"2023-11-22",note:"Via: abnb | Tel: 910-849-9074",history:[{"date": "2023-11-08", "text": "$1,297.86 \u2014 stay (2023-11-08 \u2192 2023-11-22)"}],archived:true,archived_date:"2023-11-22"},
  {id:1168,apt:"318",owner:"ERA LT",name:"Daniel De Zutter",type:"short-stay",rent:1290.0,balance:0,due:"2023-11-22",note:"Via: abnb | Tel: 1 508-244-7708",history:[{"date": "2023-11-22", "text": "$1,290.00 \u2014 stay ( \u2192 2023-11-22)"}],archived:true,archived_date:"2023-11-22"},
  {id:1169,apt:"Melrose CH",owner:"Melrose Properties",name:"Angel",type:"short-stay",rent:669.3,balance:0,due:"2023-11-24",note:"Via: abnb | Tel: 267-667-1867",history:[{"date": "2023-11-18", "text": "$669.30 \u2014 stay (2023-11-18 \u2192 2023-11-24)"}],archived:true,archived_date:"2023-11-24"},
  {id:1170,apt:"Montg #1A",owner:"Elkins LT",name:"Marzia Hamidi",type:"short-stay",rent:1818.0,balance:0,due:"2023-11-24",note:"Via: abnb | Tel: 267-626-9952",history:[{"date": "2023-10-25", "text": "$1,818.00 \u2014 stay (2023-10-25 \u2192 2023-11-24)"}],archived:true,archived_date:"2023-11-24"},
  {id:1171,apt:"225",owner:"ERA LT",name:"Danilo Ratushnyi/Polina Kuptsova",type:"long-term",rent:1650.0,balance:0,due:"2023-10-31",note:"Via: Facabook | Tel: 4843506397 | Email: daniilratushnuy@gmail.com",history:[{"date": "2022-10-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2022-11-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2022-12-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2023-01-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2023-02-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2023-03-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2023-04-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2023-05-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2023-06-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2023-07-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2023-08-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2023-09-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2023-10-01", "text": "$1,650 \u2014 monthly (est.)"}],archived:true,archived_date:"2023-10-31"},
  {id:1172,apt:"202",owner:"ERA LT",name:"Andrew Freeman",type:"long-term",rent:970.0,balance:0,due:"2023-11-30",note:"Tel: 770-503-6851",history:[{"date": "2023-06-01", "text": "$970 \u2014 monthly (est.)"}, {"date": "2023-07-01", "text": "$970 \u2014 monthly (est.)"}, {"date": "2023-08-01", "text": "$970 \u2014 monthly (est.)"}, {"date": "2023-09-01", "text": "$970 \u2014 monthly (est.)"}, {"date": "2023-10-01", "text": "$970 \u2014 monthly (est.)"}, {"date": "2023-11-01", "text": "$970 \u2014 monthly (est.)"}],archived:true,archived_date:"2023-11-30"},
  {id:1173,apt:"Melrose B2",owner:"Melrose Properties",name:"Leona Hobbs",type:"long-term",rent:1450.0,balance:0,due:"2023-11-30",note:"Via: original | Tel: 267-241-8850 | Email: lnjoseph57@gmail.com",history:[{"date": "2023-01-01", "text": "$1,450 \u2014 monthly (est.)"}, {"date": "2023-02-01", "text": "$1,450 \u2014 monthly (est.)"}, {"date": "2023-03-01", "text": "$1,450 \u2014 monthly (est.)"}, {"date": "2023-04-01", "text": "$1,450 \u2014 monthly (est.)"}, {"date": "2023-05-01", "text": "$1,450 \u2014 monthly (est.)"}, {"date": "2023-06-01", "text": "$1,450 \u2014 monthly (est.)"}, {"date": "2023-07-01", "text": "$1,450 \u2014 monthly (est.)"}, {"date": "2023-08-01", "text": "$1,450 \u2014 monthly (est.)"}, {"date": "2023-09-01", "text": "$1,450 \u2014 monthly (est.)"}, {"date": "2023-10-01", "text": "$1,450 \u2014 monthly (est.)"}, {"date": "2023-11-01", "text": "$1,450 \u2014 monthly (est.)"}],archived:true,archived_date:"2023-11-30"},
  {id:1174,apt:"Montg 7",owner:"Elkins LT",name:"Currie Poore and Isaac La Vedrine",type:"long-term",rent:1034.0,balance:0,due:"2023-11-30",note:"Tel: (484) 756-9572 | Email: currielavedrine@gmail.com",history:[{"date": "2023-11-01", "text": "$1,034 \u2014 monthly (est.)"}],archived:true,archived_date:"2023-11-30"},
  {id:1175,apt:"426-1",owner:"ERA LT",name:"Chris Wyche",type:"long-term",rent:1470.0,balance:0,due:"2023-12-03",note:"Via: abnb | Tel: 2672409844",history:[{"date": "2022-11-01", "text": "$1,470 \u2014 monthly (est.)"}, {"date": "2022-12-01", "text": "$1,470 \u2014 monthly (est.)"}, {"date": "2023-01-01", "text": "$1,470 \u2014 monthly (est.)"}, {"date": "2023-02-01", "text": "$1,470 \u2014 monthly (est.)"}, {"date": "2023-03-01", "text": "$1,470 \u2014 monthly (est.)"}, {"date": "2023-04-01", "text": "$1,470 \u2014 monthly (est.)"}, {"date": "2023-05-01", "text": "$1,470 \u2014 monthly (est.)"}, {"date": "2023-06-01", "text": "$1,470 \u2014 monthly (est.)"}, {"date": "2023-07-01", "text": "$1,470 \u2014 monthly (est.)"}, {"date": "2023-08-01", "text": "$1,470 \u2014 monthly (est.)"}, {"date": "2023-09-01", "text": "$1,470 \u2014 monthly (est.)"}, {"date": "2023-10-01", "text": "$1,470 \u2014 monthly (est.)"}, {"date": "2023-11-01", "text": "$1,470 \u2014 monthly (est.)"}, {"date": "2023-12-01", "text": "$1,470 \u2014 monthly (est.)"}],archived:true,archived_date:"2023-12-03"},
  {id:1176,apt:"426-4",owner:"ERA LT",name:"Carina Hernandez",type:"short-stay",rent:663.48,balance:0,due:"2023-12-05",note:"Via: abnb | Tel: 718-501-0814",history:[{"date": "2023-11-23", "text": "$663.48 \u2014 stay (2023-11-23 \u2192 2023-12-05)"}],archived:true,archived_date:"2023-12-05"},
  {id:1177,apt:"232",owner:"ERA LT",name:"Henry Brackbill",type:"short-stay",rent:1285.25,balance:0,due:"2023-12-14",note:"Via: abnb | Tel: 206-696-2801",history:[{"date": "2023-11-30", "text": "$1,285.25 \u2014 stay (2023-11-30 \u2192 2023-12-14)"}],archived:true,archived_date:"2023-12-14"},
  {id:1178,apt:"Melrose CH",owner:"Melrose Properties",name:"Hasan Ali",type:"short-stay",rent:1076.7,balance:0,due:"2023-12-15",note:"Via: abnb | Tel: 267-562-1348",history:[{"date": "2023-12-05", "text": "$1,076.70 \u2014 stay (2023-12-05 \u2192 2023-12-15)"}],archived:true,archived_date:"2023-12-15"},
  {id:1179,apt:"320",owner:"ERA LT",name:"Kim/Sarah",type:"short-stay",rent:3737.41,balance:0,due:"2023-12-08",note:"Via: abnb | Tel: 678-548-2804",history:[{"date": "2023-10-31", "text": "$3,737.41 \u2014 stay (2023-10-31 \u2192 2023-12-08)"}],archived:true,archived_date:"2023-12-08"},
  {id:1180,apt:"205",owner:"ERA LT",name:"Melissa Winters",type:"short-stay",rent:1040.0,balance:0,due:"2023-12-16",note:"Via: abnb | Tel: 267-581-9865",history:[{"date": "2023-09-30", "text": "$1,040.00 \u2014 stay (2023-09-30 \u2192 2023-12-16)"}],archived:true,archived_date:"2023-12-16"},
  {id:1181,apt:"Montg  10",owner:"Elkins LT",name:"Pamela Fine Maman",type:"long-term",rent:1527.0,balance:0,due:"2022-06-30",note:"Tel: (215) 869-8528 | Email: pfmaman@aol.com",history:[{"date": "2022-06-01", "text": "$1,527 \u2014 monthly (est.)"}],archived:true,archived_date:"2022-06-30"},
  {id:1182,apt:"211",owner:"ERA LT",name:"Andrew",type:"short-stay",rent:672.21,balance:0,due:"2023-12-31",note:"Via: abnb | Tel: 480-498-0517",history:[{"date": "2023-12-22", "text": "$672.21 \u2014 stay (2023-12-22 \u2192 2023-12-31)"}],archived:true,archived_date:"2023-12-31"},
  {id:1183,apt:"314",owner:"ERA LT",name:"Brenda Palmore",type:"long-term",rent:1500.0,balance:0,due:"2023-12-31",note:"Via: Lindy | Tel: (215) 317-7881 | Email: brenda_palmore@yahoo.com",history:[{"date": "2022-06-01", "text": "$1,500 \u2014 monthly (est.)"}, {"date": "2022-07-01", "text": "$1,500 \u2014 monthly (est.)"}, {"date": "2022-08-01", "text": "$1,500 \u2014 monthly (est.)"}, {"date": "2022-09-01", "text": "$1,500 \u2014 monthly (est.)"}, {"date": "2022-10-01", "text": "$1,500 \u2014 monthly (est.)"}, {"date": "2022-11-01", "text": "$1,500 \u2014 monthly (est.)"}, {"date": "2022-12-01", "text": "$1,500 \u2014 monthly (est.)"}, {"date": "2023-01-01", "text": "$1,500 \u2014 monthly (est.)"}, {"date": "2023-02-01", "text": "$1,500 \u2014 monthly (est.)"}, {"date": "2023-03-01", "text": "$1,500 \u2014 monthly (est.)"}, {"date": "2023-04-01", "text": "$1,500 \u2014 monthly (est.)"}, {"date": "2023-05-01", "text": "$1,500 \u2014 monthly (est.)"}, {"date": "2023-06-01", "text": "$1,500 \u2014 monthly (est.)"}, {"date": "2023-07-01", "text": "$1,500 \u2014 monthly (est.)"}, {"date": "2023-08-01", "text": "$1,500 \u2014 monthly (est.)"}, {"date": "2023-09-01", "text": "$1,500 \u2014 monthly (est.)"}, {"date": "2023-10-01", "text": "$1,500 \u2014 monthly (est.)"}, {"date": "2023-11-01", "text": "$1,500 \u2014 monthly (est.)"}, {"date": "2023-12-01", "text": "$1,500 \u2014 monthly (est.)"}],archived:true,archived_date:"2023-12-31"},
  {id:1184,apt:"Montg 5",owner:"Elkins LT",name:"Hannah Guthy",type:"long-term",rent:1275.0,balance:0,due:"2022-12-31",note:"Tel: (215) 901-7166 | Email: hannahguthy@gmail.com",history:[{"date": "2022-12-01", "text": "$1,275 \u2014 monthly (est.)"}],archived:true,archived_date:"2022-12-31"},
  {id:1185,apt:"Montg 8",owner:"Elkins LT",name:"Lydia Kociuba",type:"long-term",rent:937.0,balance:0,due:"2022-12-31",note:"Tel: (215) 266-8565 | Email: ajentl@yahoo.com",history:[{"date": "2022-12-01", "text": "$937 \u2014 monthly (est.)"}],archived:true,archived_date:"2022-12-31"},
  {id:1186,apt:"212",owner:"ERA LT",name:"Renata Roundtree (United Corporate Housing)",type:"long-term",rent:2900.0,balance:0,due:"2024-01-02",note:"Via: zillow | Tel: 267-902-7219 | Email: renataroundtree@yahoo.com",history:[{"date": "2022-12-01", "text": "$2,900 \u2014 monthly (est.)"}, {"date": "2023-01-01", "text": "$2,900 \u2014 monthly (est.)"}, {"date": "2023-02-01", "text": "$2,900 \u2014 monthly (est.)"}, {"date": "2023-03-01", "text": "$2,900 \u2014 monthly (est.)"}, {"date": "2023-04-01", "text": "$2,900 \u2014 monthly (est.)"}, {"date": "2023-05-01", "text": "$2,900 \u2014 monthly (est.)"}, {"date": "2023-06-01", "text": "$2,900 \u2014 monthly (est.)"}, {"date": "2023-07-01", "text": "$2,900 \u2014 monthly (est.)"}, {"date": "2023-08-01", "text": "$2,900 \u2014 monthly (est.)"}, {"date": "2023-09-01", "text": "$2,900 \u2014 monthly (est.)"}, {"date": "2023-10-01", "text": "$2,900 \u2014 monthly (est.)"}, {"date": "2023-11-01", "text": "$2,900 \u2014 monthly (est.)"}, {"date": "2023-12-01", "text": "$2,900 \u2014 monthly (est.)"}, {"date": "2024-01-01", "text": "$2,900 \u2014 monthly (est.)"}],archived:true,archived_date:"2024-01-02"},
  {id:1187,apt:"219",owner:"ERA LT",name:"Aleksei O. Mutelika (moving out)",type:"long-term",rent:1800.0,balance:0,due:"2024-07-04",note:"Via: Dima | Tel: (215) 917-9828 | Email: alexm59512@gmail.com",history:[{"date": "203-07-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "203-08-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "203-09-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "203-10-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "203-11-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "203-12-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "204-01-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "204-02-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "204-03-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "204-04-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "204-05-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "204-06-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "204-07-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "204-08-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "204-09-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "204-10-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "204-11-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "204-12-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "205-01-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "205-02-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "205-03-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "205-04-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "205-05-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "205-06-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "205-07-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "205-08-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "205-09-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "205-10-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "205-11-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "205-12-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "206-01-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "206-02-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "206-03-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "206-04-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "206-05-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "206-06-01", "text": "$1,800 \u2014 monthly (est.)"}],archived:true,archived_date:"2024-07-04"},
  {id:1188,apt:"Montg 1",owner:"Elkins LT",name:"Abdukaium Adylov (can not pay, have to",type:"long-term",rent:1700.0,balance:0,due:"2024-11-09",note:"Via: Maksim | Tel: (646) 852-0709 | Email: adylov86@inbox.ru",history:[{"date": "2023-11-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2023-12-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2024-01-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2024-02-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2024-03-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2024-04-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2024-05-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2024-06-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2024-07-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2024-08-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2024-09-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2024-10-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2024-11-01", "text": "$1,700 \u2014 monthly (est.)"}],archived:true,archived_date:"2024-11-09"},
  {id:1189,apt:"232",owner:"ERA LT",name:"Megan",type:"short-stay",rent:1469.55,balance:0,due:"2024-01-03",note:"Via: abnb",history:[{"date": "2023-12-22", "text": "$1,469.55 \u2014 stay (2023-12-22 \u2192 2024-01-03)"}],archived:true,archived_date:"2024-01-03"},
  {id:1190,apt:"Melrose CH",owner:"Melrose Properties",name:"Nikita",type:"short-stay",rent:2037.0,balance:0,due:"2024-01-09",note:"Via: abnb | Tel: 312-774-4941",history:[{"date": "2023-12-20", "text": "$2,037.00 \u2014 stay (2023-12-20 \u2192 2024-01-09)"}],archived:true,archived_date:"2024-01-09"},
  {id:1191,apt:"426-4",owner:"ERA LT",name:"Serhat Azizagaoglu",type:"short-stay",rent:1794.5,balance:0,due:"2024-01-09",note:"Via: abnb | Tel: 610-809-2362",history:[{"date": "2023-12-09", "text": "$1,794.50 \u2014 stay (2023-12-09 \u2192 2024-01-09)"}],archived:true,archived_date:"2024-01-09"},
  {id:1192,apt:"Montg #1A",owner:"Elkins LT",name:"Lasha Tadumadze",type:"long-term",rent:1200.0,balance:0,due:"2024-01-11",note:"Tel: (347) 731-0009 | Email: tadunadzelasha@gmail.com",history:[{"date": "2023-12-01", "text": "$1,200 \u2014 monthly (est.)"}, {"date": "2024-01-01", "text": "$1,200 \u2014 monthly (est.)"}],archived:true,archived_date:"2024-01-11"},
  {id:1193,apt:"320",owner:"ERA LT",name:"Tray",type:"short-stay",rent:1252.91,balance:0,due:"2024-01-15",note:"Via: abnb | Tel: 609-276-2903",history:[{"date": "2023-12-28", "text": "$1,252.91 \u2014 stay (2023-12-28 \u2192 2024-01-15)"}],archived:true,archived_date:"2024-01-15"},
  {id:1194,apt:"232",owner:"ERA LT",name:"Donald Pelles",type:"long-term",rent:0.0,balance:0,due:"2024-01-24",note:"Tel: (301) 980-0897",history:[],archived:true,archived_date:"2024-01-24"},
  {id:1195,apt:"212",owner:"ERA LT",name:"Fatiah",type:"short-stay",rent:968.06,balance:0,due:"2024-01-22",note:"Via: abnb | Tel: 267-335-7387",history:[{"date": "2024-01-15", "text": "$968.06 \u2014 stay (2024-01-15 \u2192 2024-01-22)"}],archived:true,archived_date:"2024-01-22"},
  {id:1196,apt:"202",owner:"ERA LT",name:"Marcus Sharp",type:"short-stay",rent:5567.03,balance:0,due:"2024-01-31",note:"Via: abnb | Tel: 928-856-4052",history:[{"date": "2023-12-01", "text": "$5,567.03 \u2014 stay (2023-12-01 \u2192 2024-01-31)"}],archived:true,archived_date:"2024-01-31"},
  {id:1197,apt:"Montg 6",owner:"Elkins LT",name:"Linda Gross",type:"long-term",rent:711.0,balance:0,due:"2024-02-08",note:"Tel: (215) 808-9604 | Email: dammit144@gmail.com",history:[{"date": "2024-02-01", "text": "$711 \u2014 monthly (est.)"}],archived:true,archived_date:"2024-02-08"},
  {id:1198,apt:"223",owner:"ERA LT",name:"Alan Pliev, Aslan Baskaev",type:"long-term",rent:1650.0,balance:0,due:"2024-03-01",note:"Via: Tatyana from 230 | Tel: (619) 983-8516 | Email: alanpliev121626@gmail.com",history:[{"date": "2023-08-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2023-09-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2023-10-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2023-11-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2023-12-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2024-01-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2024-02-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2024-03-01", "text": "$1,650 \u2014 monthly (est.)"}],archived:true,archived_date:"2024-03-01"},
  {id:1199,apt:"330",owner:"ERA LT",name:"Aziret Sheraliev (wants studio,",type:"long-term",rent:1800.0,balance:0,due:"2024-03-01",note:"Via: facebook | Tel: (347) 712-5124 | Email: sheraliev.aziret@my.crctransport.us",history:[{"date": "2023-09-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2023-10-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2023-11-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2023-12-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2024-01-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2024-02-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2024-03-01", "text": "$1,800 \u2014 monthly (est.)"}],archived:true,archived_date:"2024-03-01"},
  {id:1200,apt:"Fox Chase  1",owner:"Fox Chase Properties",name:"Anthony (moving out on March 24th)",type:"long-term",rent:835.0,balance:0,due:"2024-04-13",note:"Tel: (267) 513-8385 | Email: capelleanthony@gmail.com",history:[{"date": "2023-04-01", "text": "$835 \u2014 monthly (est.)"}, {"date": "2023-05-01", "text": "$835 \u2014 monthly (est.)"}, {"date": "2023-06-01", "text": "$835 \u2014 monthly (est.)"}, {"date": "2023-07-01", "text": "$835 \u2014 monthly (est.)"}, {"date": "2023-08-01", "text": "$835 \u2014 monthly (est.)"}, {"date": "2023-09-01", "text": "$835 \u2014 monthly (est.)"}, {"date": "2023-10-01", "text": "$835 \u2014 monthly (est.)"}, {"date": "2023-11-01", "text": "$835 \u2014 monthly (est.)"}, {"date": "2023-12-01", "text": "$835 \u2014 monthly (est.)"}, {"date": "2024-01-01", "text": "$835 \u2014 monthly (est.)"}, {"date": "2024-02-01", "text": "$835 \u2014 monthly (est.)"}, {"date": "2024-03-01", "text": "$835 \u2014 monthly (est.)"}, {"date": "2024-04-01", "text": "$835 \u2014 monthly (est.)"}],archived:true,archived_date:"2024-04-13"},
  {id:1201,apt:"Montg 2",owner:"Elkins LT",name:"Munsif Rizoev",type:"long-term",rent:2250.0,balance:0,due:"2024-11-07",note:"Via: Maksim | Tel: (917) 815-3327 | Email: muhsin270821@gmail.com",history:[{"date": "2023-11-01", "text": "$2,250 \u2014 monthly (est.)"}, {"date": "2023-12-01", "text": "$2,250 \u2014 monthly (est.)"}, {"date": "2024-01-01", "text": "$2,250 \u2014 monthly (est.)"}, {"date": "2024-02-01", "text": "$2,250 \u2014 monthly (est.)"}, {"date": "2024-03-01", "text": "$2,250 \u2014 monthly (est.)"}, {"date": "2024-04-01", "text": "$2,250 \u2014 monthly (est.)"}, {"date": "2024-05-01", "text": "$2,250 \u2014 monthly (est.)"}, {"date": "2024-06-01", "text": "$2,250 \u2014 monthly (est.)"}, {"date": "2024-07-01", "text": "$2,250 \u2014 monthly (est.)"}, {"date": "2024-08-01", "text": "$2,250 \u2014 monthly (est.)"}, {"date": "2024-09-01", "text": "$2,250 \u2014 monthly (est.)"}, {"date": "2024-10-01", "text": "$2,250 \u2014 monthly (est.)"}, {"date": "2024-11-01", "text": "$2,250 \u2014 monthly (est.)"}],archived:true,archived_date:"2024-11-07"},
  {id:1202,apt:"Garage 2",owner:"Montgomery Garages",name:"John-Luc Zenou (paid Venmo annually) paid till 2/24 $450",type:"long-term",rent:75.0,balance:0,due:"2024-03-01",note:"Tel: 215-852-6733",history:[{"date": "2024-03-01", "text": "$75 \u2014 monthly (est.)"}],archived:true,archived_date:"2024-03-01"},
  {id:1203,apt:"318",owner:"ERA LT",name:"Sherzod",type:"short-stay",rent:1367.7,balance:0,due:"2024-01-27",note:"Via: abnb | Tel: 267-693-4342",history:[{"date": "2023-12-28", "text": "$1,367.70 \u2014 stay (2023-12-28 \u2192 2024-01-27)"}],archived:true,archived_date:"2024-01-27"},
  {id:1204,apt:"Fox Chase  2",owner:"Fox Chase Properties",name:"Lauren Horan, David Halgash",type:"long-term",rent:1000.0,balance:0,due:"2024-03-05",note:"Tel: (717) 725-7427 | Email: laurenhoran30@yahoo.com",history:[{"date": "2022-06-01", "text": "$1,000 \u2014 monthly (est.)"}, {"date": "2022-07-01", "text": "$1,000 \u2014 monthly (est.)"}, {"date": "2022-08-01", "text": "$1,000 \u2014 monthly (est.)"}, {"date": "2022-09-01", "text": "$1,000 \u2014 monthly (est.)"}, {"date": "2022-10-01", "text": "$1,000 \u2014 monthly (est.)"}, {"date": "2022-11-01", "text": "$1,000 \u2014 monthly (est.)"}, {"date": "2022-12-01", "text": "$1,000 \u2014 monthly (est.)"}, {"date": "2023-01-01", "text": "$1,000 \u2014 monthly (est.)"}, {"date": "2023-02-01", "text": "$1,000 \u2014 monthly (est.)"}, {"date": "2023-03-01", "text": "$1,000 \u2014 monthly (est.)"}, {"date": "2023-04-01", "text": "$1,000 \u2014 monthly (est.)"}, {"date": "2023-05-01", "text": "$1,000 \u2014 monthly (est.)"}, {"date": "2023-06-01", "text": "$1,000 \u2014 monthly (est.)"}, {"date": "2023-07-01", "text": "$1,000 \u2014 monthly (est.)"}, {"date": "2023-08-01", "text": "$1,000 \u2014 monthly (est.)"}, {"date": "2023-09-01", "text": "$1,000 \u2014 monthly (est.)"}, {"date": "2023-10-01", "text": "$1,000 \u2014 monthly (est.)"}, {"date": "2023-11-01", "text": "$1,000 \u2014 monthly (est.)"}, {"date": "2023-12-01", "text": "$1,000 \u2014 monthly (est.)"}, {"date": "2024-01-01", "text": "$1,000 \u2014 monthly (est.)"}, {"date": "2024-02-01", "text": "$1,000 \u2014 monthly (est.)"}, {"date": "2024-03-01", "text": "$1,000 \u2014 monthly (est.)"}],archived:true,archived_date:"2024-03-05"},
  {id:1205,apt:"Montg 2",owner:"Elkins LT",name:"Thomas El Saad",type:"short-stay",rent:2231.0,balance:0,due:"2024-02-12",note:"Via: abnb | Tel: 501-773-4151",history:[{"date": "2024-01-29", "text": "$2,231.00 \u2014 stay (2024-01-29 \u2192 2024-02-12)"}],archived:true,archived_date:"2024-02-12"},
  {id:1206,apt:"Melrose C1",owner:"Melrose Properties",name:"Gloria",type:"long-term",rent:877.56,balance:0,due:"2024-02-16",note:"Via: abnb | Tel: 215-237-0575",history:[{"date": "2023-11-01", "text": "$878 \u2014 monthly (est.)"}, {"date": "2023-12-01", "text": "$878 \u2014 monthly (est.)"}, {"date": "2024-01-01", "text": "$878 \u2014 monthly (est.)"}, {"date": "2024-02-01", "text": "$878 \u2014 monthly (est.)"}],archived:true,archived_date:"2024-02-16"},
  {id:1207,apt:"205",owner:"ERA LT",name:"Dayona Jones",type:"short-stay",rent:572.3,balance:0,due:"2024-02-20",note:"Via: abnb | Tel: 215-820-6433",history:[{"date": "2024-02-08", "text": "$572.30 \u2014 stay (2024-02-08 \u2192 2024-02-20)"}],archived:true,archived_date:"2024-02-20"},
  {id:1208,apt:"Melrose CH",owner:"Melrose Properties",name:"Crystal Hahaa",type:"short-stay",rent:1117.44,balance:0,due:"2024-02-19",note:"Via: abnb | Tel: 267-800-3242",history:[{"date": "2024-02-07", "text": "$1,117.44 \u2014 stay (2024-02-07 \u2192 2024-02-19)"}],archived:true,archived_date:"2024-02-19"},
  {id:1209,apt:"230",owner:"ERA LT",name:"Kennesha Warren",type:"long-term",rent:1700.0,balance:0,due:"2024-02-29",note:"Via: Zillow | Tel: 832-764-1324 | Email: kenneshawarren@gmail.com",history:[{"date": "2022-03-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2022-04-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2022-05-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2022-06-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2022-07-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2022-08-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2022-09-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2022-10-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2022-11-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2022-12-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2023-01-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2023-02-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2023-03-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2023-04-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2023-05-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2023-06-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2023-07-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2023-08-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2023-09-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2023-10-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2023-11-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2023-12-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2024-01-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2024-02-01", "text": "$1,700 \u2014 monthly (est.)"}],archived:true,archived_date:"2024-02-29"},
  {id:1210,apt:"331",owner:"ERA LT",name:"Carlos Alberto",type:"long-term",rent:1700.0,balance:0,due:"2024-03-12",note:"Via: facebook | Tel: 215-2402343 | Email: aline.miyoshi@gmail.com",history:[{"date": "2022-03-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2022-04-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2022-05-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2022-06-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2022-07-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2022-08-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2022-09-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2022-10-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2022-11-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2022-12-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2023-01-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2023-02-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2023-03-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2023-04-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2023-05-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2023-06-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2023-07-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2023-08-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2023-09-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2023-10-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2023-11-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2023-12-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2024-01-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2024-02-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2024-03-01", "text": "$1,700 \u2014 monthly (est.)"}],archived:true,archived_date:"2024-03-12"},
  {id:1211,apt:"225",owner:"ERA LT",name:"Latoya Martin",type:"long-term",rent:2050.0,balance:0,due:"2024-03-31",note:"Via: abnb | Tel: (267) 471-9354 | Email: toya4nic@gmail.com",history:[{"date": "2023-12-01", "text": "$2,050 \u2014 monthly (est.)"}, {"date": "2024-01-01", "text": "$2,050 \u2014 monthly (est.)"}, {"date": "2024-02-01", "text": "$2,050 \u2014 monthly (est.)"}, {"date": "2024-03-01", "text": "$2,050 \u2014 monthly (est.)"}],archived:true,archived_date:"2024-03-31"},
  {id:1212,apt:"202",owner:"ERA LT",name:"Ayanna Harrison",type:"short-stay",rent:935.12,balance:0,due:"2024-03-02",note:"Via: vrbo | Tel: 267-528-4814 | Email: yaneey2642@gmail.com",history:[{"date": "2024-02-19", "text": "$935.12 \u2014 stay (2024-02-19 \u2192 2024-03-02)"}],archived:true,archived_date:"2024-03-02"},
  {id:1213,apt:"232",owner:"ERA LT",name:"Khambrel Evans",type:"short-stay",rent:859.18,balance:0,due:"2024-03-03",note:"Via: abnb | Tel: 215-278-5213",history:[{"date": "2024-02-16", "text": "$859.18 \u2014 stay (2024-02-16 \u2192 2024-03-03)"}],archived:true,archived_date:"2024-03-03"},
  {id:1214,apt:"Montg 2",owner:"Elkins LT",name:"Nazarii Halaburda",type:"short-stay",rent:1338.0,balance:0,due:"2024-03-06",note:"Via: abnb | Tel: 314-789-0129",history:[{"date": "2024-02-23", "text": "$1,338.00 \u2014 stay (2024-02-23 \u2192 2024-03-06)"}],archived:true,archived_date:"2024-03-06"},
  {id:1215,apt:"318",owner:"ERA LT",name:"Jordan Duncan",type:"short-stay",rent:921.5,balance:0,due:"2024-03-08",note:"Via: abnb | Tel: 270-556-9505",history:[{"date": "2024-02-28", "text": "$921.50 \u2014 stay (2024-02-28 \u2192 2024-03-08)"}],archived:true,archived_date:"2024-03-08"},
  {id:1216,apt:"Melrose C1",owner:"Melrose Properties",name:"Mario Moreno",type:"short-stay",rent:756.6,balance:0,due:"2024-03-08",note:"Via: abnb | Tel: 469-537-8795",history:[{"date": "2024-02-25", "text": "$756.60 \u2014 stay (2024-02-25 \u2192 2024-03-08)"}],archived:true,archived_date:"2024-03-08"},
  {id:1217,apt:"Melrose CH",owner:"Melrose Properties",name:"Maurice Melvin",type:"short-stay",rent:533.5,balance:0,due:"2024-03-13",note:"Via: abnb | Tel: 910-885-8014",history:[{"date": "2024-03-07", "text": "$533.50 \u2014 stay (2024-03-07 \u2192 2024-03-13)"}],archived:true,archived_date:"2024-03-13"},
  {id:1218,apt:"Melrose CH",owner:"Melrose Properties",name:"Catrina Copley",type:"short-stay",rent:1474.5,balance:0,due:"2024-03-15",note:"Via: vrbo | Tel: (928) 300-4980 | Email: catrinacopley@gmail.com",history:[{"date": "2024-02-29", "text": "$1,474.50 \u2014 stay (2024-02-29 \u2192 2024-03-15)"}],archived:true,archived_date:"2024-03-15"},
  {id:1219,apt:"426-4",owner:"ERA LT",name:"Jennifer Turner",type:"month-to-month",rent:1950.0,balance:0,due:"",note:"Via: abnb | Tel: 859-595-77-87 | Email: jenniz.turner@gmail.com",history:[{"date": "2024-01-01", "text": "$1,950 \u2014 monthly (est.)"}, {"date": "2024-02-01", "text": "$1,950 \u2014 monthly (est.)"}, {"date": "2024-03-01", "text": "$1,950 \u2014 monthly (est.)"}, {"date": "2024-04-01", "text": "$1,950 \u2014 monthly (est.)"}, {"date": "2024-05-01", "text": "$1,950 \u2014 monthly (est.)"}, {"date": "2024-06-01", "text": "$1,950 \u2014 monthly (est.)"}, {"date": "2024-07-01", "text": "$1,950 \u2014 monthly (est.)"}, {"date": "2024-08-01", "text": "$1,950 \u2014 monthly (est.)"}, {"date": "2024-09-01", "text": "$1,950 \u2014 monthly (est.)"}, {"date": "2024-10-01", "text": "$1,950 \u2014 monthly (est.)"}, {"date": "2024-11-01", "text": "$1,950 \u2014 monthly (est.)"}, {"date": "2024-12-01", "text": "$1,950 \u2014 monthly (est.)"}, {"date": "2025-01-01", "text": "$1,950 \u2014 monthly (est.)"}, {"date": "2025-02-01", "text": "$1,950 \u2014 monthly (est.)"}, {"date": "2025-03-01", "text": "$1,950 \u2014 monthly (est.)"}, {"date": "2025-04-01", "text": "$1,950 \u2014 monthly (est.)"}, {"date": "2025-05-01", "text": "$1,950 \u2014 monthly (est.)"}, {"date": "2025-06-01", "text": "$1,950 \u2014 monthly (est.)"}, {"date": "2025-07-01", "text": "$1,950 \u2014 monthly (est.)"}, {"date": "2025-08-01", "text": "$1,950 \u2014 monthly (est.)"}, {"date": "2025-09-01", "text": "$1,950 \u2014 monthly (est.)"}, {"date": "2025-10-01", "text": "$1,950 \u2014 monthly (est.)"}, {"date": "2025-11-01", "text": "$1,950 \u2014 monthly (est.)"}, {"date": "2025-12-01", "text": "$1,950 \u2014 monthly (est.)"}, {"date": "2026-01-01", "text": "$1,950 \u2014 monthly (est.)"}, {"date": "2026-02-01", "text": "$1,950 \u2014 monthly (est.)"}, {"date": "2026-03-01", "text": "$1,950 \u2014 monthly (est.)"}],archived:true,archived_date:"2024-01-20"},
  {id:1220,apt:"232",owner:"ERA LT",name:"Thomas Bindell",type:"short-stay",rent:1066.03,balance:0,due:"2024-03-22",note:"Via: abnb | Tel: 928-499-9762",history:[{"date": "2024-03-04", "text": "$1,066.03 \u2014 stay (2024-03-04 \u2192 2024-03-22)"}],archived:true,archived_date:"2024-03-22"},
  {id:1221,apt:"Melrose CH",owner:"Melrose Properties",name:"Amy Yang Wong",type:"short-stay",rent:630.5,balance:0,due:"2024-03-25",note:"Via: abnb | Tel: 415-341-6844",history:[{"date": "2024-03-20", "text": "$630.50 \u2014 stay (2024-03-20 \u2192 2024-03-25)"}],archived:true,archived_date:"2024-03-25"},
  {id:1222,apt:"314",owner:"ERA LT",name:"Ruizdaeel Abreu",type:"long-term",rent:1396.56,balance:0,due:"2024-03-28",note:"Tel: 484 655 8849 | Email: rabreu.652882@guest.booking.com",history:[{"date": "2024-03-01", "text": "$1,397 \u2014 monthly (est.)"}],archived:true,archived_date:"2024-03-28"},
  {id:1223,apt:"115",owner:"ERA LT",name:"Mattie",type:"long-term",rent:2478.35,balance:0,due:"2024-03-23",note:"Via: abnb | Tel: 484-868-2543",history:[{"date": "2023-11-01", "text": "$2,478 \u2014 monthly (est.)"}, {"date": "2023-12-01", "text": "$2,478 \u2014 monthly (est.)"}, {"date": "2024-01-01", "text": "$2,478 \u2014 monthly (est.)"}, {"date": "2024-02-01", "text": "$2,478 \u2014 monthly (est.)"}, {"date": "2024-03-01", "text": "$2,478 \u2014 monthly (est.)"}],archived:true,archived_date:"2024-03-23"},
  {id:1224,apt:"323",owner:"ERA LT",name:"Margaret Plotkin (moving out end of March)",type:"long-term",rent:1650.0,balance:0,due:"2024-08-12",note:"Via: Facebook | Tel: 215-407-2460 | Email: margaret.plotkin@gmail.com",history:[{"date": "2022-08-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2022-09-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2022-10-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2022-11-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2022-12-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2023-01-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2023-02-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2023-03-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2023-04-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2023-05-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2023-06-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2023-07-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2023-08-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2023-09-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2023-10-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2023-11-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2023-12-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2024-01-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2024-02-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2024-03-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2024-04-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2024-05-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2024-06-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2024-07-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2024-08-01", "text": "$1,650 \u2014 monthly (est.)"}],archived:true,archived_date:"2024-08-12"},
  {id:1225,apt:"219",owner:"ERA LT",name:"Ulukbek Murzaev",type:"month-to-month",rent:2100.0,balance:0,due:"",note:"Via: facebook | Tel: (773) 682-8138 | Email: murzaevulugbek053@gmail.com",history:[{"date": "2024-02-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2024-03-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2024-04-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2024-05-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2024-06-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2024-07-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2024-08-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2024-09-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2024-10-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2024-11-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2024-12-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2025-01-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2025-02-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2025-03-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2025-04-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2025-05-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2025-06-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2025-07-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2025-08-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2025-09-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2025-10-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2025-11-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2025-12-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2026-01-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2026-02-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2026-03-01", "text": "$2,100 \u2014 monthly (est.)"}],archived:true,archived_date:"2024-02-13"},
  {id:1226,apt:"Melrose A1",owner:"Melrose Properties",name:"Lisa Bosack/Diane Walker (end of Lease 05/31)",type:"month-to-month",rent:2050.0,balance:0,due:"",note:"Via: facebook | Tel: 2673456511 | Email: mommy6219@gmail.com",history:[{"date": "2023-02-01", "text": "$2,050 \u2014 monthly (est.)"}, {"date": "2023-03-01", "text": "$2,050 \u2014 monthly (est.)"}, {"date": "2023-04-01", "text": "$2,050 \u2014 monthly (est.)"}, {"date": "2023-05-01", "text": "$2,050 \u2014 monthly (est.)"}, {"date": "2023-06-01", "text": "$2,050 \u2014 monthly (est.)"}, {"date": "2023-07-01", "text": "$2,050 \u2014 monthly (est.)"}, {"date": "2023-08-01", "text": "$2,050 \u2014 monthly (est.)"}, {"date": "2023-09-01", "text": "$2,050 \u2014 monthly (est.)"}, {"date": "2023-10-01", "text": "$2,050 \u2014 monthly (est.)"}, {"date": "2023-11-01", "text": "$2,050 \u2014 monthly (est.)"}, {"date": "2023-12-01", "text": "$2,050 \u2014 monthly (est.)"}, {"date": "2024-01-01", "text": "$2,050 \u2014 monthly (est.)"}, {"date": "2024-02-01", "text": "$2,050 \u2014 monthly (est.)"}, {"date": "2024-03-01", "text": "$2,050 \u2014 monthly (est.)"}, {"date": "2024-04-01", "text": "$2,050 \u2014 monthly (est.)"}, {"date": "2024-05-01", "text": "$2,050 \u2014 monthly (est.)"}, {"date": "2024-06-01", "text": "$2,050 \u2014 monthly (est.)"}, {"date": "2024-07-01", "text": "$2,050 \u2014 monthly (est.)"}, {"date": "2024-08-01", "text": "$2,050 \u2014 monthly (est.)"}, {"date": "2024-09-01", "text": "$2,050 \u2014 monthly (est.)"}, {"date": "2024-10-01", "text": "$2,050 \u2014 monthly (est.)"}, {"date": "2024-11-01", "text": "$2,050 \u2014 monthly (est.)"}, {"date": "2024-12-01", "text": "$2,050 \u2014 monthly (est.)"}, {"date": "2025-01-01", "text": "$2,050 \u2014 monthly (est.)"}, {"date": "2025-02-01", "text": "$2,050 \u2014 monthly (est.)"}, {"date": "2025-03-01", "text": "$2,050 \u2014 monthly (est.)"}, {"date": "2025-04-01", "text": "$2,050 \u2014 monthly (est.)"}, {"date": "2025-05-01", "text": "$2,050 \u2014 monthly (est.)"}, {"date": "2025-06-01", "text": "$2,050 \u2014 monthly (est.)"}, {"date": "2025-07-01", "text": "$2,050 \u2014 monthly (est.)"}, {"date": "2025-08-01", "text": "$2,050 \u2014 monthly (est.)"}, {"date": "2025-09-01", "text": "$2,050 \u2014 monthly (est.)"}, {"date": "2025-10-01", "text": "$2,050 \u2014 monthly (est.)"}, {"date": "2025-11-01", "text": "$2,050 \u2014 monthly (est.)"}, {"date": "2025-12-01", "text": "$2,050 \u2014 monthly (est.)"}, {"date": "2026-01-01", "text": "$2,050 \u2014 monthly (est.)"}],archived:true,archived_date:"2023-02-01"},
  {id:1227,apt:"Melrose B2",owner:"Melrose Properties",name:"Jhanea Brown",type:"short-stay",rent:832.26,balance:0,due:"2024-04-01",note:"Via: abnb | Tel: 1 267-248-9294",history:[{"date": "2024-03-23", "text": "$832.26 \u2014 stay (2024-03-23 \u2192 2024-04-01)"}],archived:true,archived_date:"2024-04-01"},
  {id:1228,apt:"Melrose CH",owner:"Melrose Properties",name:"Evan",type:"short-stay",rent:576.18,balance:0,due:"2024-04-01",note:"Via: abnb | Tel: 561-503-7535",history:[{"date": "2024-03-26", "text": "$576.18 \u2014 stay (2024-03-26 \u2192 2024-04-01)"}],archived:true,archived_date:"2024-04-01"},
  {id:1229,apt:"202",owner:"ERA LT",name:"Jasmine Carter",type:"short-stay",rent:1504.23,balance:0,due:"2024-04-04",note:"Via: abnb | Tel: 215-873-6573",history:[{"date": "2024-03-07", "text": "$1,504.23 \u2014 stay (2024-03-07 \u2192 2024-04-04)"}],archived:true,archived_date:"2024-04-04"},
  {id:1230,apt:"330",owner:"ERA LT",name:"Hamzah Alfahel",type:"short-stay",rent:1814.87,balance:0,due:"2024-04-05",note:"Via: abnb | Tel: 330-814-5509",history:[{"date": "2024-03-03", "text": "$1,814.87 \u2014 stay (2024-03-03 \u2192 2024-04-05)"}],archived:true,archived_date:"2024-04-05"},
  {id:1231,apt:"Melrose C1",owner:"Melrose Properties",name:"Melrose Espinal",type:"short-stay",rent:765.33,balance:0,due:"2024-04-08",note:"Via: abnb | Tel: 929-275-1293",history:[{"date": "2024-03-28", "text": "$765.33 \u2014 stay (2024-03-28 \u2192 2024-04-08)"}],archived:true,archived_date:"2024-04-08"},
  {id:1232,apt:"426-4",owner:"ERA LT",name:"Alia Abdullah",type:"short-stay",rent:1416.2,balance:0,due:"2024-04-09",note:"Via: abnb | Tel: 302-887-6194",history:[{"date": "2024-03-20", "text": "$1,416.20 \u2014 stay (2024-03-20 \u2192 2024-04-09)"}],archived:true,archived_date:"2024-04-09"},
  {id:1233,apt:"Melrose CH",owner:"Melrose Properties",name:"Brandon Cullen",type:"short-stay",rent:533.5,balance:0,due:"2024-04-09",note:"Via: abnb | Tel: 430-236-6174",history:[{"date": "2024-04-04", "text": "$533.50 \u2014 stay (2024-04-04 \u2192 2024-04-09)"}],archived:true,archived_date:"2024-04-09"},
  {id:1234,apt:"219",owner:"ERA LT",name:"Hannah Adeniran",type:"short-stay",rent:1047.99,balance:0,due:"2024-04-13",note:"Via: abnb | Tel: 267-463-3185",history:[{"date": "2024-04-02", "text": "$1,047.99 \u2014 stay (2024-04-02 \u2192 2024-04-13)"}],archived:true,archived_date:"2024-04-13"},
  {id:1235,apt:"232",owner:"ERA LT",name:"Radek Schwarz",type:"short-stay",rent:2665.56,balance:0,due:"2024-04-14",note:"Via: abnb | Tel: 420 731 078 088",history:[{"date": "2024-03-23", "text": "$2,665.56 \u2014 stay (2024-03-23 \u2192 2024-04-14)"}],archived:true,archived_date:"2024-04-14"},
  {id:1236,apt:"Melrose B2",owner:"Melrose Properties",name:"Ebony Brown",type:"short-stay",rent:652.81,balance:0,due:"2024-04-14",note:"Via: abnb | Tel: 445-444-2534",history:[{"date": "2024-04-05", "text": "$652.81 \u2014 stay (2024-04-05 \u2192 2024-04-14)"}],archived:true,archived_date:"2024-04-14"},
  {id:1237,apt:"318",owner:"ERA LT",name:"Andreas Malke",type:"short-stay",rent:1306.59,balance:0,due:"2024-04-15",note:"Via: abnb | Tel: 49 178 3444529",history:[{"date": "2024-04-03", "text": "$1,306.59 \u2014 stay (2024-04-03 \u2192 2024-04-15)"}],archived:true,archived_date:"2024-04-15"},
  {id:1238,apt:"Melrose C1",owner:"Melrose Properties",name:"Nikia Sanders",type:"long-term",rent:640.7,balance:0,due:"2024-04-16",note:"Via: Verbo | Tel: 2158009445 | Email: nikiamixson@gmail.com",history:[{"date": "2024-04-01", "text": "$641 \u2014 monthly (est.)"}],archived:true,archived_date:"2024-04-16"},
  {id:1239,apt:"Melrose CH",owner:"Melrose Properties",name:"Martin Hilson",type:"short-stay",rent:1125.2,balance:0,due:"2024-04-21",note:"Via: abnb | Tel: 506 7056 3100",history:[{"date": "2024-04-11", "text": "$1,125.20 \u2014 stay (2024-04-11 \u2192 2024-04-21)"}],archived:true,archived_date:"2024-04-21"},
  {id:1240,apt:"Montg 4",owner:"Elkins LT",name:"Zakiyyah Underwood",type:"long-term",rent:2000.0,balance:0,due:"2024-05-14",note:"Via: abnb | Tel: 215-868-6565",history:[{"date": "2023-11-01", "text": "$2,000 \u2014 monthly (est.)"}, {"date": "2023-12-01", "text": "$2,000 \u2014 monthly (est.)"}, {"date": "2024-01-01", "text": "$2,000 \u2014 monthly (est.)"}, {"date": "2024-02-01", "text": "$2,000 \u2014 monthly (est.)"}, {"date": "2024-03-01", "text": "$2,000 \u2014 monthly (est.)"}, {"date": "2024-04-01", "text": "$2,000 \u2014 monthly (est.)"}, {"date": "2024-05-01", "text": "$2,000 \u2014 monthly (est.)"}],archived:true,archived_date:"2024-05-14"},
  {id:1241,apt:"202",owner:"ERA LT",name:"Rosan",type:"short-stay",rent:1577.03,balance:0,due:"2024-04-27",note:"Via: abnb | Tel: 330-883-5511",history:[{"date": "2024-04-05", "text": "$1,577.03 \u2014 stay (2024-04-05 \u2192 2024-04-27)"}],archived:true,archived_date:"2024-04-27"},
  {id:1242,apt:"318",owner:"ERA LT",name:"Hiep",type:"short-stay",rent:817.71,balance:0,due:"2024-04-27",note:"Via: abnb | Tel: 206-771-7493",history:[{"date": "2024-04-20", "text": "$817.71 \u2014 stay (2024-04-20 \u2192 2024-04-27)"}],archived:true,archived_date:"2024-04-27"},
  {id:1243,apt:"Melrose C1",owner:"Melrose Properties",name:"Shatoina Miller",type:"short-stay",rent:595.58,balance:0,due:"2024-04-29",note:"Via: abnb | Tel: 267-392-9162",history:[{"date": "2024-04-21", "text": "$595.58 \u2014 stay (2024-04-21 \u2192 2024-04-29)"}],archived:true,archived_date:"2024-04-29"},
  {id:1244,apt:"208",owner:"ERA LT",name:"Lizanne Belmonte",type:"long-term",rent:500.0,balance:0,due:"2024-04-30",note:"Via: private | Tel: (215) 663-1443 | Email: lizannebelmonte@msn.com",history:[{"date": "2022-05-01", "text": "$500 \u2014 monthly (est.)"}, {"date": "2022-06-01", "text": "$500 \u2014 monthly (est.)"}, {"date": "2022-07-01", "text": "$500 \u2014 monthly (est.)"}, {"date": "2022-08-01", "text": "$500 \u2014 monthly (est.)"}, {"date": "2022-09-01", "text": "$500 \u2014 monthly (est.)"}, {"date": "2022-10-01", "text": "$500 \u2014 monthly (est.)"}, {"date": "2022-11-01", "text": "$500 \u2014 monthly (est.)"}, {"date": "2022-12-01", "text": "$500 \u2014 monthly (est.)"}, {"date": "2023-01-01", "text": "$500 \u2014 monthly (est.)"}, {"date": "2023-02-01", "text": "$500 \u2014 monthly (est.)"}, {"date": "2023-03-01", "text": "$500 \u2014 monthly (est.)"}, {"date": "2023-04-01", "text": "$500 \u2014 monthly (est.)"}, {"date": "2023-05-01", "text": "$500 \u2014 monthly (est.)"}, {"date": "2023-06-01", "text": "$500 \u2014 monthly (est.)"}, {"date": "2023-07-01", "text": "$500 \u2014 monthly (est.)"}, {"date": "2023-08-01", "text": "$500 \u2014 monthly (est.)"}, {"date": "2023-09-01", "text": "$500 \u2014 monthly (est.)"}, {"date": "2023-10-01", "text": "$500 \u2014 monthly (est.)"}, {"date": "2023-11-01", "text": "$500 \u2014 monthly (est.)"}, {"date": "2023-12-01", "text": "$500 \u2014 monthly (est.)"}, {"date": "2024-01-01", "text": "$500 \u2014 monthly (est.)"}, {"date": "2024-02-01", "text": "$500 \u2014 monthly (est.)"}, {"date": "2024-03-01", "text": "$500 \u2014 monthly (est.)"}, {"date": "2024-04-01", "text": "$500 \u2014 monthly (est.)"}],archived:true,archived_date:"2024-04-30"},
  {id:1245,apt:"331",owner:"ERA LT",name:"Michael Cericola",type:"long-term",rent:926.6,balance:0,due:"2024-04-30",note:"Via: Zillow | Tel: 7187024659 | Email: team.cericola@gmail.com",history:[{"date": "2024-03-01", "text": "$927 \u2014 monthly (est.)"}, {"date": "2024-04-01", "text": "$927 \u2014 monthly (est.)"}],archived:true,archived_date:"2024-04-30"},
  {id:1246,apt:"Montg #1B",owner:"Elkins LT",name:"Katie Marie Scott (moving out on April 30th)",type:"long-term",rent:737.0,balance:0,due:"2024-04-30",note:"Tel: (215) 779-6865 | Email: teachingintrees@gmail.com",history:[{"date": "2024-04-01", "text": "$737 \u2014 monthly (est.)"}],archived:true,archived_date:"2024-04-30"},
  {id:1247,apt:"232",owner:"ERA LT",name:"Yoel And Yipsy Saez",type:"short-stay",rent:1626.69,balance:0,due:"2024-05-05",note:"Via: abnb | Tel: 813-753-0918",history:[{"date": "2024-04-22", "text": "$1,626.69 \u2014 stay (2024-04-22 \u2192 2024-05-05)"}],archived:true,archived_date:"2024-05-05"},
  {id:1248,apt:"318",owner:"ERA LT",name:"Felipe Cavallini",type:"short-stay",rent:844.77,balance:0,due:"2024-05-06",note:"Via: abnb | Tel: 786-387-5174",history:[{"date": "2024-04-27", "text": "$844.77 \u2014 stay (2024-04-27 \u2192 2024-05-06)"}],archived:true,archived_date:"2024-05-06"},
  {id:1249,apt:"426-4",owner:"ERA LT",name:"Anri Abedini",type:"short-stay",rent:977.76,balance:0,due:"2024-05-06",note:"Via: abnb | Tel: 215-207-1386",history:[{"date": "2024-04-17", "text": "$977.76 \u2014 stay (2024-04-17 \u2192 2024-05-06)"}],archived:true,archived_date:"2024-05-06"},
  {id:1250,apt:"Melrose B2",owner:"Melrose Properties",name:"Emmanuella Jeannelas",type:"short-stay",rent:652.81,balance:0,due:"2024-05-07",note:"Via: abnb | Tel: 239-878-5092",history:[{"date": "2024-04-19", "text": "$652.81 \u2014 stay (2024-04-19 \u2192 2024-05-07)"}],archived:true,archived_date:"2024-05-07"},
  {id:1251,apt:"Melrose C1",owner:"Melrose Properties",name:"Moe Samir",type:"short-stay",rent:595.58,balance:0,due:"2024-05-07",note:"Via: abnb | Tel: 443-962-5401",history:[{"date": "2024-04-29", "text": "$595.58 \u2014 stay (2024-04-29 \u2192 2024-05-07)"}],archived:true,archived_date:"2024-05-07"},
  {id:1252,apt:"323",owner:"ERA LT",name:"Richard Bonica",type:"long-term",rent:0.0,balance:0,due:"2024-05-08",note:"Tel: 702-510-9126",history:[],archived:true,archived_date:"2024-05-08"},
  {id:1253,apt:"202",owner:"ERA LT",name:"Micayla Wiseman-Fisher",type:"short-stay",rent:1529.69,balance:0,due:"2024-05-10",note:"Via: abnb | Tel: 540-369-5459",history:[{"date": "2024-04-27", "text": "$1,529.69 \u2014 stay (2024-04-27 \u2192 2024-05-10)"}],archived:true,archived_date:"2024-05-10"},
  {id:1254,apt:"320",owner:"ERA LT",name:"Zina Clark",type:"long-term",rent:2033.12,balance:0,due:"2024-05-10",note:"Via: abnb | Tel: 407-690-3103",history:[{"date": "2024-02-01", "text": "$2,033 \u2014 monthly (est.)"}, {"date": "2024-03-01", "text": "$2,033 \u2014 monthly (est.)"}, {"date": "2024-04-01", "text": "$2,033 \u2014 monthly (est.)"}, {"date": "2024-05-01", "text": "$2,033 \u2014 monthly (est.)"}],archived:true,archived_date:"2024-05-10"},
  {id:1255,apt:"330",owner:"ERA LT",name:"Daryl Hill",type:"long-term",rent:732.6,balance:0,due:"2024-04-13",note:"Via: Verbo | Tel: 2154458542 | Email: hill21grams@gmail.com",history:[{"date": "2024-04-01", "text": "$733 \u2014 monthly (est.)"}],archived:true,archived_date:"2024-04-13"},
  {id:1256,apt:"Fox Chase  2",owner:"Fox Chase Properties",name:"Dylan Chess",type:"short-stay",rent:584.91,balance:0,due:"2024-05-12",note:"Via: abnb | Tel: 267-844-2839",history:[{"date": "2024-05-05", "text": "$584.91 \u2014 stay (2024-05-05 \u2192 2024-05-12)"}],archived:true,archived_date:"2024-05-12"},
  {id:1257,apt:"318",owner:"ERA LT",name:"Ilona Hnatkivska",type:"short-stay",rent:749.81,balance:0,due:"2024-05-09",note:"Via: abnb | Tel: 267-916-6810",history:[{"date": "2024-05-07", "text": "$749.81 \u2014 stay (2024-05-07 \u2192 2024-05-09)"}],archived:true,archived_date:"2024-05-09"},
  {id:1258,apt:"323",owner:"ERA LT",name:"Ilona Hnatkivska",type:"short-stay",rent:749.81,balance:0,due:"2024-05-14",note:"Via: abnb | Tel: 267-916-6810",history:[{"date": "2024-05-09", "text": "$749.81 \u2014 stay (2024-05-09 \u2192 2024-05-14)"}],archived:true,archived_date:"2024-05-14"},
  {id:1259,apt:"Melrose B2",owner:"Melrose Properties",name:"Lisa Winter",type:"short-stay",rent:720.71,balance:0,due:"2024-05-16",note:"Via: abnb | Tel: 816-588-7140",history:[{"date": "2024-05-09", "text": "$720.71 \u2014 stay (2024-05-09 \u2192 2024-05-16)"}],archived:true,archived_date:"2024-05-16"},
  {id:1260,apt:"318",owner:"ERA LT",name:"Zina Clark",type:"short-stay",rent:0.0,balance:0,due:"2024-05-17",note:"Via: abnb | Tel: 407-690-3103",history:[],archived:true,archived_date:"2024-05-17"},
  {id:1261,apt:"219",owner:"ERA LT",name:"Kevin Jiyan Sang",type:"long-term",rent:0.0,balance:0,due:"2024-05-18",note:"Tel: 1 484-588-9767",history:[],archived:true,archived_date:"2024-05-18"},
  {id:1262,apt:"314",owner:"ERA LT",name:"Aalyiah Franks",type:"short-stay",rent:1292.04,balance:0,due:"2024-05-18",note:"Via: abnb | Tel: 267-279-6053",history:[{"date": "2024-03-28", "text": "$1,292.04 \u2014 stay (2024-03-28 \u2192 2024-05-18)"}],archived:true,archived_date:"2024-05-18"},
  {id:1263,apt:"Fox Chase  2",owner:"Fox Chase Properties",name:"Achim Bostedt",type:"long-term",rent:992.1,balance:0,due:"2024-05-18",note:"Via: Google | Tel: 491732542282 | Email: kuducina@gmail.com",history:[{"date": "2024-05-01", "text": "$992 \u2014 monthly (est.)"}],archived:true,archived_date:"2024-05-18"},
  {id:1264,apt:"202",owner:"ERA LT",name:"Leslie Mora",type:"long-term",rent:0.0,balance:0,due:"2024-05-21",note:"Tel: 52 55 4740 4786",history:[],archived:true,archived_date:"2024-05-21"},
  {id:1265,apt:"232",owner:"ERA LT",name:"Chris Dodge",type:"short-stay",rent:1511.26,balance:0,due:"2024-05-24",note:"Via: abnb | Tel: 303-949-7691",history:[{"date": "2024-05-12", "text": "$1,511.26 \u2014 stay (2024-05-12 \u2192 2024-05-24)"}],archived:true,archived_date:"2024-05-24"},
  {id:1266,apt:"426-4",owner:"ERA LT",name:"Osama Saeed",type:"short-stay",rent:1290.1,balance:0,due:"2024-05-25",note:"Via: abnb | Tel: 416-268-4047",history:[{"date": "2024-05-06", "text": "$1,290.10 \u2014 stay (2024-05-06 \u2192 2024-05-25)"}],archived:true,archived_date:"2024-05-25"},
  {id:1267,apt:"323",owner:"ERA LT",name:"William Schippnick",type:"long-term",rent:727.4,balance:0,due:"2024-05-26",note:"Via: Verbo | Tel: 6105637922 | Email: bschippnick@gmail.com",history:[{"date": "2024-05-01", "text": "$727 \u2014 monthly (est.)"}],archived:true,archived_date:"2024-05-26"},
  {id:1268,apt:"Melrose B2",owner:"Melrose Properties",name:"Lateema Griffin",type:"long-term",rent:938.25,balance:0,due:"2024-05-27",note:"Via: Verbo | Tel: (215) 586-9880 | Email: lateemagriffin@gmail.com",history:[{"date": "2024-05-01", "text": "$938 \u2014 monthly (est.)"}],archived:true,archived_date:"2024-05-27"},
  {id:1269,apt:"202",owner:"ERA LT",name:"Jon Weiss Jr.",type:"short-stay",rent:1037.36,balance:0,due:"2024-05-29",note:"Via: abnb | Tel: 8433309898",history:[{"date": "2024-05-22", "text": "$1,037.36 \u2014 stay (2024-05-22 \u2192 2024-05-29)"}],archived:true,archived_date:"2024-05-29"},
  {id:1270,apt:"Melrose B1",owner:"Melrose Properties",name:"Nakia Henry (MTM till 06/01)",type:"long-term",rent:1525.0,balance:0,due:"2024-06-07",note:"Via: original | Tel: 267-339-8809 | Email: brand.nkhenry@gmail.com",history:[{"date": "2023-01-01", "text": "$1,525 \u2014 monthly (est.)"}, {"date": "2023-02-01", "text": "$1,525 \u2014 monthly (est.)"}, {"date": "2023-03-01", "text": "$1,525 \u2014 monthly (est.)"}, {"date": "2023-04-01", "text": "$1,525 \u2014 monthly (est.)"}, {"date": "2023-05-01", "text": "$1,525 \u2014 monthly (est.)"}, {"date": "2023-06-01", "text": "$1,525 \u2014 monthly (est.)"}, {"date": "2023-07-01", "text": "$1,525 \u2014 monthly (est.)"}, {"date": "2023-08-01", "text": "$1,525 \u2014 monthly (est.)"}, {"date": "2023-09-01", "text": "$1,525 \u2014 monthly (est.)"}, {"date": "2023-10-01", "text": "$1,525 \u2014 monthly (est.)"}, {"date": "2023-11-01", "text": "$1,525 \u2014 monthly (est.)"}, {"date": "2023-12-01", "text": "$1,525 \u2014 monthly (est.)"}, {"date": "2024-01-01", "text": "$1,525 \u2014 monthly (est.)"}, {"date": "2024-02-01", "text": "$1,525 \u2014 monthly (est.)"}, {"date": "2024-03-01", "text": "$1,525 \u2014 monthly (est.)"}, {"date": "2024-04-01", "text": "$1,525 \u2014 monthly (est.)"}, {"date": "2024-05-01", "text": "$1,525 \u2014 monthly (est.)"}, {"date": "2024-06-01", "text": "$1,525 \u2014 monthly (est.)"}],archived:true,archived_date:"2024-06-07"},
  {id:1271,apt:"219",owner:"ERA LT",name:"Mohamed Akli Bouharis",type:"long-term",rent:0.0,balance:0,due:"2024-06-01",note:"",history:[],archived:true,archived_date:"2024-06-01"},
  {id:1272,apt:"331",owner:"ERA LT",name:"Edwin Opher",type:"short-stay",rent:2539.46,balance:0,due:"2024-06-02",note:"Via: abnb | Tel: 215-499-9067",history:[{"date": "2024-05-04", "text": "$2,539.46 \u2014 stay (2024-05-04 \u2192 2024-06-02)"}],archived:true,archived_date:"2024-06-02"},
  {id:1273,apt:"314",owner:"ERA LT",name:"Rasheed O'Kelley",type:"long-term",rent:0.0,balance:0,due:"2024-06-03",note:"Tel: 267-269-4297",history:[],archived:true,archived_date:"2024-06-03"},
  {id:1274,apt:"Fox Chase  2",owner:"Fox Chase Properties",name:"Jasmine Thompson",type:"short-stay",rent:785.7,balance:0,due:"2024-06-03",note:"Via: abnb | Tel: 267-586-2975",history:[{"date": "2024-05-24", "text": "$785.70 \u2014 stay (2024-05-24 \u2192 2024-06-03)"}],archived:true,archived_date:"2024-06-03"},
  {id:1275,apt:"202",owner:"ERA LT",name:"Nia Munford",type:"short-stay",rent:654.75,balance:0,due:"2024-06-04",note:"Via: abnb | Tel: 216-772-6395",history:[{"date": "2024-05-30", "text": "$654.75 \u2014 stay (2024-05-30 \u2192 2024-06-04)"}],archived:true,archived_date:"2024-06-04"},
  {id:1276,apt:"426-4",owner:"ERA LT",name:"Michael Mccullough",type:"short-stay",rent:560.66,balance:0,due:"2024-06-01",note:"Via: abnb | Tel: 267-323-8148",history:[{"date": "2024-05-25", "text": "$560.66 \u2014 stay (2024-05-25 \u2192 2024-06-01)"}],archived:true,archived_date:"2024-06-01"},
  {id:1277,apt:"219",owner:"ERA LT",name:"Christopher",type:"short-stay",rent:759.24,balance:0,due:"2024-06-08",note:"Via: abnb | Tel: 9168336941",history:[{"date": "2024-06-01", "text": "$759.24 \u2014 stay (2024-06-01 \u2192 2024-06-08)"}],archived:true,archived_date:"2024-06-08"},
  {id:1278,apt:"Melrose C1",owner:"Melrose Properties",name:"Richard Bonica",type:"long-term",rent:0.0,balance:0,due:"2024-06-08",note:"Tel: 702-510-9126",history:[],archived:true,archived_date:"2024-06-08"},
  {id:1279,apt:"323",owner:"ERA LT",name:"Bryanna Shelton",type:"short-stay",rent:858.45,balance:0,due:"2024-06-08",note:"Via: abnb | Tel: 901-293-1888",history:[{"date": "2024-05-30", "text": "$858.45 \u2014 stay (2024-05-30 \u2192 2024-06-08)"}],archived:true,archived_date:"2024-06-08"},
  {id:1280,apt:"Melrose B2",owner:"Melrose Properties",name:"Lateema",type:"short-stay",rent:993.27,balance:0,due:"2024-06-10",note:"Via: abnb | Tel: 2155869880",history:[{"date": "2024-06-01", "text": "$993.27 \u2014 stay (2024-06-01 \u2192 2024-06-10)"}],archived:true,archived_date:"2024-06-10"},
  {id:1281,apt:"202",owner:"ERA LT",name:"Sukwon Lee",type:"long-term",rent:0.0,balance:0,due:"2024-06-11",note:"Tel: 706-908-1274",history:[],archived:true,archived_date:"2024-06-11"},
  {id:1282,apt:"331",owner:"ERA LT",name:"Makensie Andrews",type:"short-stay",rent:936.43,balance:0,due:"2024-06-14",note:"Via: abnb | Tel: 6147464029",history:[{"date": "2024-06-03", "text": "$936.43 \u2014 stay (2024-06-03 \u2192 2024-06-14)"}],archived:true,archived_date:"2024-06-14"},
  {id:1283,apt:"Montg 4",owner:"Elkins LT",name:"C Page",type:"short-stay",rent:884.64,balance:0,due:"2024-05-25",note:"Via: abnb | Tel: 267-992-7405",history:[{"date": "2024-05-16", "text": "$884.64 \u2014 stay (2024-05-16 \u2192 2024-05-25)"}],archived:true,archived_date:"2024-05-25"},
  {id:1284,apt:"208",owner:"ERA LT",name:"Geraldinne Acker",type:"long-term",rent:0.0,balance:0,due:"2024-06-15",note:"",history:[],archived:true,archived_date:"2024-06-15"},
  {id:1285,apt:"202",owner:"ERA LT",name:"Shelby Hughes",type:"short-stay",rent:796.85,balance:0,due:"2024-06-18",note:"Via: abnb | Tel: 808-783-7853",history:[{"date": "2024-06-11", "text": "$796.85 \u2014 stay (2024-06-11 \u2192 2024-06-18)"}],archived:true,archived_date:"2024-06-18"},
  {id:1286,apt:"426-4",owner:"ERA LT",name:"Jake Mcgoldrick",type:"short-stay",rent:628.56,balance:0,due:"2024-06-20",note:"Via: abnb | Tel: 267-774-6286",history:[{"date": "2024-06-13", "text": "$628.56 \u2014 stay (2024-06-13 \u2192 2024-06-20)"}],archived:true,archived_date:"2024-06-20"},
  {id:1287,apt:"Fox Chase  2",owner:"Fox Chase Properties",name:"Milan Lemon",type:"short-stay",rent:1154.93,balance:0,due:"2024-06-20",note:"Via: abnb | Tel: 954-243-8066",history:[{"date": "2024-06-07", "text": "$1,154.93 \u2014 stay (2024-06-07 \u2192 2024-06-20)"}],archived:true,archived_date:"2024-06-20"},
  {id:1288,apt:"208",owner:"ERA LT",name:"Zina Clark",type:"short-stay",rent:663.26,balance:0,due:"2024-06-21",note:"Via: abnb | Tel: 4076903103",history:[{"date": "2024-06-16", "text": "$663.26 \u2014 stay (2024-06-16 \u2192 2024-06-21)"}],archived:true,archived_date:"2024-06-21"},
  {id:1289,apt:"Melrose C1",owner:"Melrose Properties",name:"LaManda Davis",type:"short-stay",rent:584.71,balance:0,due:"2024-06-21",note:"Via: abnb | Tel: 484-300-7241",history:[{"date": "2024-06-14", "text": "$584.71 \u2014 stay (2024-06-14 \u2192 2024-06-21)"}],archived:true,archived_date:"2024-06-21"},
  {id:1290,apt:"Montg 6",owner:"Elkins LT",name:"DaJana Ford",type:"long-term",rent:0.0,balance:0,due:"2024-06-21",note:"Tel: 267-226-6290",history:[],archived:true,archived_date:"2024-06-21"},
  {id:1291,apt:"Montg #1B",owner:"Elkins LT",name:"Joseph Murphy",type:"long-term",rent:0.0,balance:0,due:"2024-06-22",note:"Tel: 484-557-0084",history:[],archived:true,archived_date:"2024-06-22"},
  {id:1292,apt:"202",owner:"ERA LT",name:"Kendra Hoffman",type:"short-stay",rent:807.77,balance:0,due:"2024-06-25",note:"Via: abnb | Tel: 2624122283",history:[{"date": "2024-06-19", "text": "$807.77 \u2014 stay (2024-06-19 \u2192 2024-06-25)"}],archived:true,archived_date:"2024-06-25"},
  {id:1293,apt:"318",owner:"ERA LT",name:"Robert & Donna Nat",type:"long-term",rent:0.0,balance:0,due:"2024-06-28",note:"",history:[],archived:true,archived_date:"2024-06-28"},
  {id:1294,apt:"331",owner:"ERA LT",name:"Yeniseik Cortes",type:"short-stay",rent:1064.29,balance:0,due:"2024-06-28",note:"Via: abnb | Tel: 5612133757",history:[{"date": "2024-06-16", "text": "$1,064.29 \u2014 stay (2024-06-16 \u2192 2024-06-28)"}],archived:true,archived_date:"2024-06-28"},
  {id:1295,apt:"219",owner:"ERA LT",name:"Berkeley Sirmans",type:"short-stay",rent:1341.13,balance:0,due:"2024-06-29",note:"Via: abnb | Tel: 8505089183",history:[{"date": "2024-06-16", "text": "$1,341.13 \u2014 stay (2024-06-16 \u2192 2024-06-29)"}],archived:true,archived_date:"2024-06-29"},
  {id:1296,apt:"232",owner:"ERA LT",name:"Alaina Santos",type:"short-stay",rent:727.5,balance:0,due:"2024-06-30",note:"Via: abnb | Tel: 215-779-3983",history:[{"date": "2024-05-27", "text": "$727.50 \u2014 stay (2024-05-27 \u2192 2024-06-30)"}],archived:true,archived_date:"2024-06-30"},
  {id:1297,apt:"Montg 3",owner:"Elkins LT",name:"Courtney Toomer/Myles Fuller (wanted to",type:"long-term",rent:1325.0,balance:0,due:"2024-06-30",note:"Tel: (267) 581-4932 | Email: courtney.reigns29@gmail.com",history:[{"date": "2024-06-01", "text": "$1,325 \u2014 monthly (est.)"}],archived:true,archived_date:"2024-06-30"},
  {id:1298,apt:"104",owner:"ERA LT",name:"Jarrett Shippen (checking out 7/31)",type:"long-term",rent:2300.0,balance:0,due:"2024-07-31",note:"Via: Zillow | Tel: 917-474-1143 | Email: bebacolon0917@gmail.com",history:[{"date": "2022-02-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2022-03-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2022-04-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2022-05-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2022-06-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2022-07-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2022-08-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2022-09-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2022-10-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2022-11-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2022-12-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2023-01-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2023-02-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2023-03-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2023-04-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2023-05-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2023-06-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2023-07-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2023-08-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2023-09-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2023-10-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2023-11-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2023-12-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2024-01-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2024-02-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2024-03-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2024-04-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2024-05-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2024-06-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2024-07-01", "text": "$2,300 \u2014 monthly (est.)"}],archived:true,archived_date:"2024-07-31"},
  {id:1299,apt:"230",owner:"ERA LT",name:"Artur and Natalia Belkina (checking out 6/30)",type:"long-term",rent:1500.0,balance:0,due:"2025-02-28",note:"Via: facebook | Tel: (267) 988-7520 | Email: pitbull0790@gmail.com",history:[{"date": "2024-03-01", "text": "$1,500 \u2014 monthly (est.)"}, {"date": "2024-04-01", "text": "$1,500 \u2014 monthly (est.)"}, {"date": "2024-05-01", "text": "$1,500 \u2014 monthly (est.)"}, {"date": "2024-06-01", "text": "$1,500 \u2014 monthly (est.)"}, {"date": "2024-07-01", "text": "$1,500 \u2014 monthly (est.)"}, {"date": "2024-08-01", "text": "$1,500 \u2014 monthly (est.)"}, {"date": "2024-09-01", "text": "$1,500 \u2014 monthly (est.)"}, {"date": "2024-10-01", "text": "$1,500 \u2014 monthly (est.)"}, {"date": "2024-11-01", "text": "$1,500 \u2014 monthly (est.)"}, {"date": "2024-12-01", "text": "$1,500 \u2014 monthly (est.)"}, {"date": "2025-01-01", "text": "$1,500 \u2014 monthly (est.)"}, {"date": "2025-02-01", "text": "$1,500 \u2014 monthly (est.)"}],archived:true,archived_date:"2025-02-28"},
  {id:1300,apt:"208",owner:"ERA LT",name:"John Schuler",type:"short-stay",rent:1970.31,balance:0,due:"2024-07-06",note:"Via: abnb | Tel: 7273892184",history:[{"date": "2024-06-23", "text": "$1,970.31 \u2014 stay (2024-06-23 \u2192 2024-07-06)"}],archived:true,archived_date:"2024-07-06"},
  {id:1301,apt:"323",owner:"ERA LT",name:"Alice De Castro",type:"short-stay",rent:1510.94,balance:0,due:"2024-07-07",note:"Via: abnb | Tel: 2673429115",history:[{"date": "2024-06-18", "text": "$1,510.94 \u2014 stay (2024-06-18 \u2192 2024-07-07)"}],archived:true,archived_date:"2024-07-07"},
  {id:1302,apt:"202",owner:"ERA LT",name:"Francisca Ronay",type:"short-stay",rent:1816.9,balance:0,due:"2024-07-09",note:"Via: abnb | Tel: 9545405855",history:[{"date": "2024-06-25", "text": "$1,816.90 \u2014 stay (2024-06-25 \u2192 2024-07-09)"}],archived:true,archived_date:"2024-07-09"},
  {id:1303,apt:"330",owner:"ERA LT",name:"Lamanda Davis",type:"short-stay",rent:767.16,balance:0,due:"2024-07-09",note:"Via: abnb | Tel: 4843007241",history:[{"date": "2024-06-21", "text": "$767.16 \u2014 stay (2024-06-21 \u2192 2024-07-09)"}],archived:true,archived_date:"2024-07-09"},
  {id:1304,apt:"314",owner:"ERA LT",name:"Joseph Dinkel",type:"short-stay",rent:2477.57,balance:0,due:"2024-07-10",note:"Via: abnb | Tel: 727-643-9982",history:[{"date": "2024-06-10", "text": "$2,477.57 \u2014 stay (2024-06-10 \u2192 2024-07-10)"}],archived:true,archived_date:"2024-07-10"},
  {id:1305,apt:"331",owner:"ERA LT",name:"Fatiha",type:"long-term",rent:1200,balance:0,due:"2024-07-13",note:"",history:[{"date": "2024-06-01", "text": "$1,200,628,180,705 \u2014 monthly (est.)"}, {"date": "2024-07-01", "text": "$1,200,628,180,705 \u2014 monthly (est.)"}],archived:true,archived_date:"2024-07-13"},
  {id:1306,apt:"Melrose B2",owner:"Melrose Properties",name:"Gustavo Gomez",type:"short-stay",rent:3425.6,balance:0,due:"2024-07-13",note:"Via: abnb | Tel: 7544572683",history:[{"date": "2024-06-16", "text": "$3,425.60 \u2014 stay (2024-06-16 \u2192 2024-07-13)"}],archived:true,archived_date:"2024-07-13"},
  {id:1307,apt:"426-4",owner:"ERA LT",name:"Nicole Gambone",type:"short-stay",rent:809.04,balance:0,due:"2024-07-14",note:"Via: abnb | Tel: 6098458895",history:[{"date": "2024-07-06", "text": "$809.04 \u2014 stay (2024-07-06 \u2192 2024-07-14)"}],archived:true,archived_date:"2024-07-14"},
  {id:1308,apt:"230",owner:"ERA LT",name:"Amnon Saad",type:"long-term",rent:900.0,balance:0,due:"2024-07-15",note:"",history:[{"date": "2024-07-01", "text": "$900 \u2014 monthly (est.)"}],archived:true,archived_date:"2024-07-15"},
  {id:1309,apt:"318",owner:"ERA LT",name:"Christopher Gibson",type:"short-stay",rent:1987.51,balance:0,due:"2024-07-18",note:"Via: abnb | Tel: 9162809328",history:[{"date": "2024-06-30", "text": "$1,987.51 \u2014 stay (2024-06-30 \u2192 2024-07-18)"}],archived:true,archived_date:"2024-07-18"},
  {id:1310,apt:"Melrose C1",owner:"Melrose Properties",name:"Dajana Ford",type:"short-stay",rent:1385.51,balance:0,due:"2024-07-18",note:"Via: abnb | Tel: 2672266290",history:[{"date": "2024-06-21", "text": "$1,385.51 \u2014 stay (2024-06-21 \u2192 2024-07-18)"}],archived:true,archived_date:"2024-07-18"},
  {id:1311,apt:"323",owner:"ERA LT",name:"Justin Agard",type:"short-stay",rent:928.35,balance:0,due:"2024-07-27",note:"Via: Hostfully | Tel: 2156673056 | Email: tua15955@yahoo.com",history:[{"date": "2024-07-16", "text": "$928.35 \u2014 stay (2024-07-16 \u2192 2024-07-27)"}],archived:true,archived_date:"2024-07-27"},
  {id:1312,apt:"331",owner:"ERA LT",name:"Rafa Gamero Contreras",type:"short-stay",rent:1025.21,balance:0,due:"2024-07-28",note:"Via: abnb | Tel: 693929882",history:[{"date": "2024-07-20", "text": "$1,025.21 \u2014 stay (2024-07-20 \u2192 2024-07-28)"}],archived:true,archived_date:"2024-07-28"},
  {id:1313,apt:"Montg 4",owner:"Elkins LT",name:"Ruth Macdonald",type:"short-stay",rent:2648.74,balance:0,due:"2024-07-28",note:"Via: abnb | Tel: 2152845371",history:[{"date": "2024-06-16", "text": "$2,648.74 \u2014 stay (2024-06-16 \u2192 2024-07-28)"}],archived:true,archived_date:"2024-07-28"},
  {id:1314,apt:"Melrose A1",owner:"Melrose Properties",name:"Ion Morari",type:"long-term",rent:2478.09,balance:0,due:"2024-07-31",note:"Via: Verbo | Tel: 3891495440",history:[{"date": "2024-07-01", "text": "$2,478 \u2014 monthly (est.)"}],archived:true,archived_date:"2024-07-31"},
  {id:1315,apt:"Montg 6",owner:"Elkins LT",name:"David Jackson",type:"short-stay",rent:3851.09,balance:0,due:"2024-07-31",note:"Via: abnb | Tel: 6308494162",history:[{"date": "2024-06-21", "text": "$3,851.09 \u2014 stay (2024-06-21 \u2192 2024-07-31)"}],archived:true,archived_date:"2024-07-31"},
  {id:1316,apt:"Melrose B1",owner:"Melrose Properties",name:"Giorgi Edzgveradze",type:"short-stay",rent:2500.0,balance:0,due:"2024-08-01",note:"Via: Hostfully | Tel: (267) 774-1505",history:[{"date": "2024-06-29", "text": "$2,500.00 \u2014 stay (2024-06-29 \u2192 2024-08-01)"}],archived:true,archived_date:"2024-08-01"},
  {id:1317,apt:"330",owner:"ERA LT",name:"Lee Rader",type:"short-stay",rent:774.34,balance:0,due:"2024-08-02",note:"Via: abnb | Tel: 2674324005",history:[{"date": "2024-07-21", "text": "$774.34 \u2014 stay (2024-07-21 \u2192 2024-08-02)"}],archived:true,archived_date:"2024-08-02"},
  {id:1318,apt:"Fox Chase  2",owner:"Fox Chase Properties",name:"Ryan Rahbar",type:"short-stay",rent:2366.8,balance:0,due:"2024-08-02",note:"Via: abnb | Tel: 6478327876",history:[{"date": "2024-06-28", "text": "$2,366.80 \u2014 stay (2024-06-28 \u2192 2024-08-02)"}],archived:true,archived_date:"2024-08-02"},
  {id:1319,apt:"210",owner:"ERA LT",name:"Muhammad",type:"long-term",rent:3600.0,balance:0,due:"2024-08-10",note:"Email: mnbt_99@yahoo.com",history:[{"date": "2024-07-01", "text": "$3,600 \u2014 monthly (est.)"}, {"date": "2024-08-01", "text": "$3,600 \u2014 monthly (est.)"}],archived:true,archived_date:"2024-08-10"},
  {id:1320,apt:"Montg 4",owner:"Elkins LT",name:"Aliyah Richardson",type:"short-stay",rent:805.3,balance:0,due:"2024-08-10",note:"Via: booking.com | Tel: 267 235 0656",history:[{"date": "2024-07-27", "text": "$805.30 \u2014 stay (2024-07-27 \u2192 2024-08-10)"}],archived:true,archived_date:"2024-08-10"},
  {id:1321,apt:"Montg 3",owner:"Elkins LT",name:"Morit Lee",type:"short-stay",rent:1872.22,balance:0,due:"2024-08-11",note:"Via: abnb | Tel: 528790539",history:[{"date": "2024-07-28", "text": "$1,872.22 \u2014 stay (2024-07-28 \u2192 2024-08-11)"}],archived:true,archived_date:"2024-08-11"},
  {id:1322,apt:"314",owner:"ERA LT",name:"Emmanuella Jeannelas",type:"short-stay",rent:724.42,balance:0,due:"2024-08-13",note:"Via: abnb | Tel: 2398785092",history:[{"date": "2024-07-26", "text": "$724.42 \u2014 stay (2024-07-26 \u2192 2024-08-13)"}],archived:true,archived_date:"2024-08-13"},
  {id:1323,apt:"323",owner:"ERA LT",name:"Chang Sik",type:"short-stay",rent:2027.93,balance:0,due:"2024-08-13",note:"Via: booking.com | Tel: 10 2965 1402 | Email: ckim.773515@guest.booking.com",history:[{"date": "2024-07-27", "text": "$2,027.93 \u2014 stay (2024-07-27 \u2192 2024-08-13)"}],archived:true,archived_date:"2024-08-13"},
  {id:1324,apt:"330",owner:"ERA LT",name:"Abdelouahed El",type:"short-stay",rent:1608.0,balance:0,due:"2024-08-17",note:"Via: booking.com | Tel: 267 471 1091",history:[{"date": "2024-08-03", "text": "$1,608.00 \u2014 stay (2024-08-03 \u2192 2024-08-17)"}],archived:true,archived_date:"2024-08-17"},
  {id:1325,apt:"Melrose B2",owner:"Melrose Properties",name:"Stephen Bradley",type:"short-stay",rent:1932.5,balance:0,due:"2024-08-17",note:"Via: Vrbo | Tel: 1 (215) 514-2245 | Email: bradsky@ptd.net",history:[{"date": "2024-07-24", "text": "$1,932.50 \u2014 stay (2024-07-24 \u2192 2024-08-17)"}],archived:true,archived_date:"2024-08-17"},
  {id:1326,apt:"208",owner:"ERA LT",name:"Gegababilodze",type:"long-term",rent:3600.0,balance:0,due:"2024-08-19",note:"Via: willowpa.com | Tel: 12159026424 | Email: gegababilodze6@gmail.com",history:[{"date": "2024-07-01", "text": "$3,600 \u2014 monthly (est.)"}, {"date": "2024-08-01", "text": "$3,600 \u2014 monthly (est.)"}],archived:true,archived_date:"2024-08-19"},
  {id:1327,apt:"318",owner:"ERA LT",name:"Dan Yu",type:"short-stay",rent:3938.55,balance:0,due:"2024-08-19",note:"Via: abnb | Tel: 13311335800",history:[{"date": "2024-07-21", "text": "$3,938.55 \u2014 stay (2024-07-21 \u2192 2024-08-19)"}],archived:true,archived_date:"2024-08-19"},
  {id:1328,apt:"314",owner:"ERA LT",name:"April Joy",type:"short-stay",rent:259.64,balance:0,due:"2024-08-20",note:"Via: abnb | Tel: 8182039507",history:[{"date": "2024-08-18", "text": "$259.64 \u2014 stay (2024-08-18 \u2192 2024-08-20)"}],archived:true,archived_date:"2024-08-20"},
  {id:1329,apt:"Melrose A1",owner:"Melrose Properties",name:"Paul Mcgranahan",type:"short-stay",rent:1949.61,balance:0,due:"2024-08-20",note:"Via: abnb | Tel: 7372303200",history:[{"date": "2024-07-30", "text": "$1,949.61 \u2014 stay (2024-07-30 \u2192 2024-08-20)"}],archived:true,archived_date:"2024-08-20"},
  {id:1330,apt:"Montg 3",owner:"Elkins LT",name:"Israel Zayas Jr.",type:"short-stay",rent:952.29,balance:0,due:"2024-08-20",note:"Via: abnb | Tel: 2154592957",history:[{"date": "2024-08-13", "text": "$952.29 \u2014 stay (2024-08-13 \u2192 2024-08-20)"}],archived:true,archived_date:"2024-08-20"},
  {id:1331,apt:"Montg 4",owner:"Elkins LT",name:"Emmanuel Houndo",type:"short-stay",rent:640.61,balance:0,due:"2024-08-21",note:"Via: abnb | Tel: 2159669076",history:[{"date": "2024-08-15", "text": "$640.61 \u2014 stay (2024-08-15 \u2192 2024-08-21)"}],archived:true,archived_date:"2024-08-21"},
  {id:1332,apt:"323",owner:"ERA LT",name:"Levi Hohman",type:"short-stay",rent:712.67,balance:0,due:"2024-08-23",note:"Via: abnb | Tel: 9048883240",history:[{"date": "2024-08-13", "text": "$712.67 \u2014 stay (2024-08-13 \u2192 2024-08-23)"}],archived:true,archived_date:"2024-08-23"},
  {id:1333,apt:"Fox Chase  2",owner:"Fox Chase Properties",name:"Alexander Carlin",type:"short-stay",rent:1754.35,balance:0,due:"2024-08-23",note:"Via: abnb | Tel: 6317073045",history:[{"date": "2024-08-04", "text": "$1,754.35 \u2014 stay (2024-08-04 \u2192 2024-08-23)"}],archived:true,archived_date:"2024-08-23"},
  {id:1334,apt:"Melrose B1",owner:"Melrose Properties",name:"Latacha Bethea",type:"short-stay",rent:1324.04,balance:0,due:"2024-08-24",note:"Via: abnb | Tel: 2674156980",history:[{"date": "2024-08-03", "text": "$1,324.04 \u2014 stay (2024-08-03 \u2192 2024-08-24)"}],archived:true,archived_date:"2024-08-24"},
  {id:1335,apt:"Montg #1B",owner:"Elkins LT",name:"Donna Myers",type:"short-stay",rent:3584.53,balance:0,due:"2024-08-24",note:"Via: abnb | Tel: 2159068364",history:[{"date": "2024-06-30", "text": "$3,584.53 \u2014 stay (2024-06-30 \u2192 2024-08-24)"}],archived:true,archived_date:"2024-08-24"},
  {id:1336,apt:"128",owner:"ERA LT",name:"Kiryl Sacheuka",type:"long-term",rent:1800.0,balance:0,due:"2024-08-31",note:"Via: facebook | Tel: (917) 698-3737 | Email: sachevkok@gmail.com",history:[{"date": "2022-11-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2022-12-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2023-01-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2023-02-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2023-03-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2023-04-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2023-05-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2023-06-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2023-07-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2023-08-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2023-09-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2023-10-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2023-11-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2023-12-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2024-01-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2024-02-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2024-03-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2024-04-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2024-05-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2024-06-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2024-07-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2024-08-01", "text": "$1,800 \u2014 monthly (est.)"}],archived:true,archived_date:"2024-08-31"},
  {id:1337,apt:"426-Office",owner:"ERA LT",name:"Liudmyla Kalandarova (moving out 8/31)",type:"long-term",rent:0.0,balance:0,due:"2024-08-31",note:"Tel: 445-900-8108 | Email: Lkalandarova3@gmail.com",history:[],archived:true,archived_date:"2024-08-31"},
  {id:1338,apt:"221",owner:"ERA LT",name:"Kostiantyn Blyskun (moving out 9/07)",type:"month-to-month",rent:1700.0,balance:0,due:"",note:"Via: facebook | Tel: (267) 342-6967 | Email: kblyskun@yahoo.com",history:[{"date": "2023-02-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2023-03-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2023-04-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2023-05-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2023-06-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2023-07-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2023-08-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2023-09-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2023-10-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2023-11-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2023-12-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2024-01-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2024-02-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2024-03-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2024-04-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2024-05-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2024-06-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2024-07-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2024-08-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2024-09-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2024-10-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2024-11-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2024-12-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2025-01-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2025-02-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2025-03-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2025-04-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2025-05-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2025-06-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2025-07-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2025-08-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2025-09-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2025-10-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2025-11-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2025-12-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2026-01-01", "text": "$1,700 \u2014 monthly (est.)"}],archived:true,archived_date:"2023-02-22"},
  {id:1339,apt:"317",owner:"ERA LT",name:"Teri King",type:"month-to-month",rent:3600.0,balance:0,due:"",note:"Via: Willowpa.com | Tel: (864) 373-5546 | Email: drtericolleen@gmail.com",history:[{"date": "2024-07-01", "text": "$3,600 \u2014 monthly (est.)"}, {"date": "2024-08-01", "text": "$3,600 \u2014 monthly (est.)"}, {"date": "2024-09-01", "text": "$3,600 \u2014 monthly (est.)"}, {"date": "2024-10-01", "text": "$3,600 \u2014 monthly (est.)"}, {"date": "2024-11-01", "text": "$3,600 \u2014 monthly (est.)"}, {"date": "2024-12-01", "text": "$3,600 \u2014 monthly (est.)"}, {"date": "2025-01-01", "text": "$3,600 \u2014 monthly (est.)"}, {"date": "2025-02-01", "text": "$3,600 \u2014 monthly (est.)"}, {"date": "2025-03-01", "text": "$3,600 \u2014 monthly (est.)"}, {"date": "2025-04-01", "text": "$3,600 \u2014 monthly (est.)"}, {"date": "2025-05-01", "text": "$3,600 \u2014 monthly (est.)"}, {"date": "2025-06-01", "text": "$3,600 \u2014 monthly (est.)"}, {"date": "2025-07-01", "text": "$3,600 \u2014 monthly (est.)"}, {"date": "2025-08-01", "text": "$3,600 \u2014 monthly (est.)"}, {"date": "2025-09-01", "text": "$3,600 \u2014 monthly (est.)"}, {"date": "2025-10-01", "text": "$3,600 \u2014 monthly (est.)"}, {"date": "2025-11-01", "text": "$3,600 \u2014 monthly (est.)"}, {"date": "2025-12-01", "text": "$3,600 \u2014 monthly (est.)"}, {"date": "2026-01-01", "text": "$3,600 \u2014 monthly (est.)"}, {"date": "2026-02-01", "text": "$3,600 \u2014 monthly (est.)"}, {"date": "2026-03-01", "text": "$3,600 \u2014 monthly (est.)"}],archived:true,archived_date:"2024-07-30"},
  {id:1340,apt:"202",owner:"ERA LT",name:"Feroz Syed",type:"short-stay",rent:4850.0,balance:0,due:"2024-09-05",note:"Via: abnb | Tel: 7034740743",history:[{"date": "2024-07-11", "text": "$4,850.00 \u2014 stay (2024-07-11 \u2192 2024-09-05)"}],archived:true,archived_date:"2024-09-05"},
  {id:1341,apt:"Montg #1B",owner:"Elkins LT",name:"Hong Minjae",type:"short-stay",rent:1200.2,balance:0,due:"2024-09-05",note:"Via: booking.com | Tel: 4849827077",history:[{"date": "2024-08-24", "text": "$1,200.20 \u2014 stay (2024-08-24 \u2192 2024-09-05)"}],archived:true,archived_date:"2024-09-05"},
  {id:1342,apt:"318",owner:"ERA LT",name:"Ruizdaeel Abreu",type:"short-stay",rent:795.91,balance:0,due:"2024-09-06",note:"Via: abnb | Tel: 4846558849",history:[{"date": "2024-08-30", "text": "$795.91 \u2014 stay (2024-08-30 \u2192 2024-09-06)"}],archived:true,archived_date:"2024-09-06"},
  {id:1343,apt:"426-4",owner:"ERA LT",name:"Dajana Ford",type:"short-stay",rent:1345.95,balance:0,due:"2024-09-08",note:"Via: abnb | Tel: 2672266290",history:[{"date": "2024-07-18", "text": "$1,345.95 \u2014 stay (2024-07-18 \u2192 2024-09-08)"}],archived:true,archived_date:"2024-09-08"},
  {id:1344,apt:"317",owner:"ERA LT",name:"James Lee",type:"short-stay",rent:1241.32,balance:0,due:"2024-09-16",note:"Via: abnb | Tel: 2152901525",history:[{"date": "2024-09-07", "text": "$1,241.32 \u2014 stay (2024-09-07 \u2192 2024-09-16)"}],archived:true,archived_date:"2024-09-16"},
  {id:1345,apt:"318",owner:"ERA LT",name:"Elizabeth Castellanos",type:"short-stay",rent:1108.67,balance:0,due:"2024-09-20",note:"Via: abnb | Tel: 8316739155",history:[{"date": "2024-09-09", "text": "$1,108.67 \u2014 stay (2024-09-09 \u2192 2024-09-20)"}],archived:true,archived_date:"2024-09-20"},
  {id:1346,apt:"Montg 4",owner:"Elkins LT",name:"Anna Vartapetova",type:"short-stay",rent:3220.4,balance:0,due:"2024-09-21",note:"Via: booking.com | Tel: 906 706 21 38",history:[{"date": "2024-08-23", "text": "$3,220.40 \u2014 stay (2024-08-23 \u2192 2024-09-21)"}],archived:true,archived_date:"2024-09-21"},
  {id:1347,apt:"314",owner:"ERA LT",name:"Matt Ferrante",type:"short-stay",rent:2454.2,balance:0,due:"2024-09-22",note:"Via: abnb | Tel: 6099035820",history:[{"date": "2024-08-22", "text": "$2,454.20 \u2014 stay (2024-08-22 \u2192 2024-09-22)"}],archived:true,archived_date:"2024-09-22"},
  {id:1348,apt:"Keswick 2B",owner:"Keswick Properties",name:"Steve Connell",type:"short-stay",rent:710.71,balance:0,due:"2024-09-23",note:"Via: abnb | Tel: 2677508564",history:[{"date": "2024-09-16", "text": "$710.71 \u2014 stay (2024-09-16 \u2192 2024-09-23)"}],archived:true,archived_date:"2024-09-23"},
  {id:1349,apt:"Montg 3",owner:"Elkins LT",name:"Abe Daphna Newman Daphna",type:"short-stay",rent:1898.38,balance:0,due:"2024-09-23",note:"Via: abnb | Tel: 9149541252",history:[{"date": "2024-09-01", "text": "$1,898.38 \u2014 stay (2024-09-01 \u2192 2024-09-23)"}],archived:true,archived_date:"2024-09-23"},
  {id:1350,apt:"Montg 9",owner:"Elkins LT",name:"Nico Trefry",type:"short-stay",rent:2478.49,balance:0,due:"2024-09-24",note:"Via: abnb | Tel: 8054798848",history:[{"date": "2024-09-01", "text": "$2,478.49 \u2014 stay (2024-09-01 \u2192 2024-09-24)"}],archived:true,archived_date:"2024-09-24"},
  {id:1351,apt:"210",owner:"ERA LT",name:"Iljaz Shehu",type:"short-stay",rent:849.84,balance:0,due:"2024-09-25",note:"Via: abnb | Tel: 3148987963",history:[{"date": "2024-08-11", "text": "$849.84 \u2014 stay (2024-08-11 \u2192 2024-09-25)"}],archived:true,archived_date:"2024-09-25"},
  {id:1352,apt:"111",owner:"ERA LT",name:"Daisey Wanko",type:"short-stay",rent:631.58,balance:0,due:"2024-09-26",note:"Via: abnb | Tel: 2674561506",history:[{"date": "2024-09-19", "text": "$631.58 \u2014 stay (2024-09-19 \u2192 2024-09-26)"}],archived:true,archived_date:"2024-09-26"},
  {id:1353,apt:"202",owner:"ERA LT",name:"Kenneth Pitt",type:"short-stay",rent:759.89,balance:0,due:"2024-09-26",note:"Via: abnb | Tel: 2154981391",history:[{"date": "2024-09-16", "text": "$759.89 \u2014 stay (2024-09-16 \u2192 2024-09-26)"}],archived:true,archived_date:"2024-09-26"},
  {id:1354,apt:"Keswick 3A",owner:"Keswick Properties",name:"Brent Woods",type:"short-stay",rent:3064.43,balance:0,due:"2024-09-28",note:"Via: abnb | Tel: 2153171242",history:[{"date": "2024-08-31", "text": "$3,064.43 \u2014 stay (2024-08-31 \u2192 2024-09-28)"}],archived:true,archived_date:"2024-09-28"},
  {id:1355,apt:"Montg #1B",owner:"Elkins LT",name:"Erkut Acar",type:"short-stay",rent:1381.9,balance:0,due:"2024-09-29",note:"Via: booking.com | Tel: 533 342 88 08",history:[{"date": "2024-09-15", "text": "$1,381.90 \u2014 stay (2024-09-15 \u2192 2024-09-29)"}],archived:true,archived_date:"2024-09-29"},
  {id:1356,apt:"Garage 5",owner:"Montgomery Garages",name:"Mark Levitt",type:"long-term",rent:80.0,balance:0,due:"2023-12-31",note:"Via: original | Tel: (267) 968-9968",history:[{"date": "2023-12-01", "text": "$80 \u2014 monthly (est.)"}],archived:true,archived_date:"2023-12-31"},
  {id:1357,apt:"225",owner:"ERA LT",name:"Raniya Amanova",type:"long-term",rent:1500.0,balance:0,due:"2024-09-25",note:"Via: facebook | Tel: (917) 930-0907 | Email: raniyaarlan007@gmail.com",history:[{"date": "2024-03-01", "text": "$1,500 \u2014 monthly (est.)"}, {"date": "2024-04-01", "text": "$1,500 \u2014 monthly (est.)"}, {"date": "2024-05-01", "text": "$1,500 \u2014 monthly (est.)"}, {"date": "2024-06-01", "text": "$1,500 \u2014 monthly (est.)"}, {"date": "2024-07-01", "text": "$1,500 \u2014 monthly (est.)"}, {"date": "2024-08-01", "text": "$1,500 \u2014 monthly (est.)"}, {"date": "2024-09-01", "text": "$1,500 \u2014 monthly (est.)"}],archived:true,archived_date:"2024-09-25"},
  {id:1358,apt:"215",owner:"ERA LT",name:"Vladimir Fominykh",type:"long-term",rent:2300.0,balance:0,due:"2024-09-30",note:"Via: facebook | Tel: 845-873-2725 | Email: vovowner@gmail.com",history:[{"date": "2022-08-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2022-09-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2022-10-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2022-11-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2022-12-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2023-01-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2023-02-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2023-03-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2023-04-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2023-05-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2023-06-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2023-07-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2023-08-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2023-09-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2023-10-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2023-11-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2023-12-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2024-01-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2024-02-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2024-03-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2024-04-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2024-05-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2024-06-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2024-07-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2024-08-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2024-09-01", "text": "$2,300 \u2014 monthly (est.)"}],archived:true,archived_date:"2024-09-30"},
  {id:1359,apt:"Melrose A2",owner:"Melrose Properties",name:"AIDARSHO MUSOEV",type:"long-term",rent:1750.0,balance:0,due:"2024-09-30",note:"Via: facebook | Tel: (267) 990-7129 | Email: aidarmusoev@gmail.com",history:[{"date": "2023-11-01", "text": "$1,750 \u2014 monthly (est.)"}, {"date": "2023-12-01", "text": "$1,750 \u2014 monthly (est.)"}, {"date": "2024-01-01", "text": "$1,750 \u2014 monthly (est.)"}, {"date": "2024-02-01", "text": "$1,750 \u2014 monthly (est.)"}, {"date": "2024-03-01", "text": "$1,750 \u2014 monthly (est.)"}, {"date": "2024-04-01", "text": "$1,750 \u2014 monthly (est.)"}, {"date": "2024-05-01", "text": "$1,750 \u2014 monthly (est.)"}, {"date": "2024-06-01", "text": "$1,750 \u2014 monthly (est.)"}, {"date": "2024-07-01", "text": "$1,750 \u2014 monthly (est.)"}, {"date": "2024-08-01", "text": "$1,750 \u2014 monthly (est.)"}, {"date": "2024-09-01", "text": "$1,750 \u2014 monthly (est.)"}],archived:true,archived_date:"2024-09-30"},
  {id:1360,apt:"Melrose B1",owner:"Melrose Properties",name:"Tasha O'neal",type:"short-stay",rent:1418.3,balance:0,due:"2024-09-30",note:"Via: abnb | Tel: 8439015171",history:[{"date": "2024-09-13", "text": "$1,418.30 \u2014 stay (2024-09-13 \u2192 2024-09-30)"}],archived:true,archived_date:"2024-09-30"},
  {id:1361,apt:"Montg 6",owner:"Elkins LT",name:"Rebecca Robbie",type:"short-stay",rent:2609.3,balance:0,due:"2024-09-30",note:"Via: abnb | Tel: 2012405106",history:[{"date": "2024-07-31", "text": "$2,609.30 \u2014 stay (2024-07-31 \u2192 2024-09-30)"}],archived:true,archived_date:"2024-09-30"},
  {id:1362,apt:"311",owner:"ERA LT",name:"Orozbek Saparbekov",type:"long-term",rent:1800.0,balance:0,due:"2024-10-01",note:"Via: facebook | Tel: (312) 723-6873 | Email: kgus312@gmail.com",history:[{"date": "2023-10-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2023-11-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2023-12-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2024-01-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2024-02-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2024-03-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2024-04-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2024-05-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2024-06-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2024-07-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2024-08-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2024-09-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2024-10-01", "text": "$1,800 \u2014 monthly (est.)"}],archived:true,archived_date:"2024-10-01"},
  {id:1363,apt:"323",owner:"ERA LT",name:"diana.stmarie",type:"long-term",rent:2952.0,balance:0,due:"2024-10-04",note:"Via: FF | Tel: 4438124737 | Email: dianaparr12@gmail.com",history:[{"date": "2024-09-01", "text": "$2,952 \u2014 monthly (est.)"}, {"date": "2024-10-01", "text": "$2,952 \u2014 monthly (est.)"}],archived:true,archived_date:"2024-10-04"},
  {id:1364,apt:"Keswick 2B",owner:"Keswick Properties",name:"Ellen Engroff Skoller",type:"short-stay",rent:743.7,balance:0,due:"2024-10-05",note:"Via: Vrbo | Tel: 1 267-944-6074",history:[{"date": "2024-09-21", "text": "$743.70 \u2014 stay (2024-09-21 \u2192 2024-10-05)"}],archived:true,archived_date:"2024-10-05"},
  {id:1365,apt:"212",owner:"ERA LT",name:"Venkata Giri Satya R S Akunuru",type:"long-term",rent:8996.78,balance:0,due:"2024-10-08",note:"Via: abnb | Tel: 732-501-5526 | Email: akunuru.rsekhar9@gmail.com",history:[{"date": "2024-02-01", "text": "$8,997 \u2014 monthly (est.)"}, {"date": "2024-03-01", "text": "$8,997 \u2014 monthly (est.)"}, {"date": "2024-04-01", "text": "$8,997 \u2014 monthly (est.)"}, {"date": "2024-05-01", "text": "$8,997 \u2014 monthly (est.)"}, {"date": "2024-06-01", "text": "$8,997 \u2014 monthly (est.)"}, {"date": "2024-07-01", "text": "$8,997 \u2014 monthly (est.)"}, {"date": "2024-08-01", "text": "$8,997 \u2014 monthly (est.)"}, {"date": "2024-09-01", "text": "$8,997 \u2014 monthly (est.)"}, {"date": "2024-10-01", "text": "$8,997 \u2014 monthly (est.)"}],archived:true,archived_date:"2024-10-08"},
  {id:1366,apt:"426-4",owner:"ERA LT",name:"Dajana Ford",type:"short-stay",rent:1240.17,balance:0,due:"2024-10-08",note:"Via: abnb | Tel: 2672266290",history:[{"date": "2024-09-11", "text": "$1,240.17 \u2014 stay (2024-09-11 \u2192 2024-10-08)"}],archived:true,archived_date:"2024-10-08"},
  {id:1367,apt:"Montg #1B",owner:"Elkins LT",name:"Tiffany Ongtowasruk",type:"short-stay",rent:631.64,balance:0,due:"2024-10-11",note:"Via: Vrbo | Tel: 9073041401",history:[{"date": "2024-10-04", "text": "$631.64 \u2014 stay (2024-10-04 \u2192 2024-10-11)"}],archived:true,archived_date:"2024-10-11"},
  {id:1368,apt:"210",owner:"ERA LT",name:"Karen Wirth",type:"short-stay",rent:3264.1,balance:0,due:"2024-10-19",note:"Via: airbnb | Tel: 3606243183",history:[{"date": "2024-09-22", "text": "$3,264.10 \u2014 stay (2024-09-22 \u2192 2024-10-19)"}],archived:true,archived_date:"2024-10-19"},
  {id:1369,apt:"225",owner:"ERA LT",name:"Adam Mulvaney",type:"short-stay",rent:2089.22,balance:0,due:"2024-10-19",note:"Via: airbnb | Tel: 7036228123",history:[{"date": "2024-09-26", "text": "$2,089.22 \u2014 stay (2024-09-26 \u2192 2024-10-19)"}],archived:true,archived_date:"2024-10-19"},
  {id:1370,apt:"323",owner:"ERA LT",name:"William Richardson",type:"short-stay",rent:1158.35,balance:0,due:"2024-10-19",note:"Via: airbnb | Tel: 8568409591",history:[{"date": "2024-10-05", "text": "$1,158.35 \u2014 stay (2024-10-05 \u2192 2024-10-19)"}],archived:true,archived_date:"2024-10-19"},
  {id:1371,apt:"Melrose B1",owner:"Melrose Properties",name:"Pam Clough",type:"short-stay",rent:703.16,balance:0,due:"2024-10-19",note:"Via: airbnb | Tel: 2154317104",history:[{"date": "2024-10-09", "text": "$703.16 \u2014 stay (2024-10-09 \u2192 2024-10-19)"}],archived:true,archived_date:"2024-10-19"},
  {id:1372,apt:"317",owner:"ERA LT",name:"Igor Tutelea",type:"short-stay",rent:2918.47,balance:0,due:"2024-10-21",note:"Via: airbnb | Tel: 3476340100",history:[{"date": "2024-09-19", "text": "$2,918.47 \u2014 stay (2024-09-19 \u2192 2024-10-21)"}],archived:true,archived_date:"2024-10-21"},
  {id:1373,apt:"Keswick 2A",owner:"Keswick Properties",name:"Hamzah Alfahel",type:"short-stay",rent:971.7,balance:0,due:"2024-10-22",note:"Via: airbnb | Tel: 3308145509",history:[{"date": "2024-10-11", "text": "$971.70 \u2014 stay (2024-10-11 \u2192 2024-10-22)"}],archived:true,archived_date:"2024-10-22"},
  {id:1374,apt:"Keswick 3A",owner:"Keswick Properties",name:"Quis Lucien",type:"short-stay",rent:708.56,balance:0,due:"2024-10-25",note:"Via: airbnb | Tel: 6263242261",history:[{"date": "2024-10-18", "text": "$708.56 \u2014 stay (2024-10-18 \u2192 2024-10-25)"}],archived:true,archived_date:"2024-10-25"},
  {id:1375,apt:"Montg 9",owner:"Elkins LT",name:"Rose Walker",type:"short-stay",rent:1017.0,balance:0,due:"2024-10-25",note:"Via: airbnb | Tel: 8382058269",history:[{"date": "2024-10-10", "text": "$1,017.00 \u2014 stay (2024-10-10 \u2192 2024-10-25)"}],archived:true,archived_date:"2024-10-25"},
  {id:1376,apt:"Montg 9",owner:"Elkins LT",name:"jlomastro (Montg CH-9)",type:"long-term",rent:4716.0,balance:0,due:"2024-10-25",note:"Via: Willowpa | Tel: 2679828044 | Email: jlomastro@hotmail.com",history:[{"date": "2024-10-01", "text": "$4,716 \u2014 monthly (est.)"}],archived:true,archived_date:"2024-10-25"},
  {id:1377,apt:"Montg 3",owner:"Elkins LT",name:"Chris Blackmon",type:"short-stay",rent:2466.17,balance:0,due:"2024-10-26",note:"Via: Vrbo | Tel: 8032389396",history:[{"date": "2024-09-26", "text": "$2,466.17 \u2014 stay (2024-09-26 \u2192 2024-10-26)"}],archived:true,archived_date:"2024-10-26"},
  {id:1378,apt:"318",owner:"ERA LT",name:"Stefano Garnier",type:"short-stay",rent:848.76,balance:0,due:"2024-10-27",note:"Via: Airbnb | Tel: 9297026738",history:[{"date": "2024-10-17", "text": "$848.76 \u2014 stay (2024-10-17 \u2192 2024-10-27)"}],archived:true,archived_date:"2024-10-27"},
  {id:1379,apt:"Montg #1B",owner:"Elkins LT",name:"Michael Cerone",type:"short-stay",rent:1094.65,balance:0,due:"2024-10-27",note:"Via: airbnb | Tel: 7812487611",history:[{"date": "2024-10-13", "text": "$1,094.65 \u2014 stay (2024-10-13 \u2192 2024-10-27)"}],archived:true,archived_date:"2024-10-27"},
  {id:1380,apt:"Melrose A1",owner:"Melrose Properties",name:"Mark Boguslawski",type:"short-stay",rent:3429.19,balance:0,due:"2024-10-31",note:"Via: booking | Tel: 503 504 3929",history:[{"date": "2024-10-05", "text": "$3,429.19 \u2014 stay (2024-10-05 \u2192 2024-10-31)"}],archived:true,archived_date:"2024-10-31"},
  {id:1381,apt:"Montg 1",owner:"Elkins LT",name:"Munsif Rizoev",type:"long-term",rent:1800.0,balance:0,due:"2024-10-31",note:"Via: Maksim | Tel: (917) 815-3327 | Email: muhsin270821@gmail.com",history:[{"date": "2024-02-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2024-03-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2024-04-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2024-05-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2024-06-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2024-07-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2024-08-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2024-09-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2024-10-01", "text": "$1,800 \u2014 monthly (est.)"}],archived:true,archived_date:"2024-10-31"},
  {id:1382,apt:"323",owner:"ERA LT",name:"Eris Naco",type:"short-stay",rent:685.96,balance:0,due:"2024-11-01",note:"Via: Airbnb | Tel: 9093484027",history:[{"date": "2024-10-25", "text": "$685.96 \u2014 stay (2024-10-25 \u2192 2024-11-01)"}],archived:true,archived_date:"2024-11-01"},
  {id:1383,apt:"314",owner:"ERA LT",name:"Mariah Griffin",type:"short-stay",rent:740.91,balance:0,due:"2024-11-02",note:"Via: Airbnb | Tel: 6072068036",history:[{"date": "2024-10-26", "text": "$740.91 \u2014 stay (2024-10-26 \u2192 2024-11-02)"}],archived:true,archived_date:"2024-11-02"},
  {id:1384,apt:"111",owner:"ERA LT",name:"William Richardson",type:"short-stay",rent:1333.01,balance:0,due:"2024-11-03",note:"Via: airbnb | Tel: 8568409591",history:[{"date": "2024-10-19", "text": "$1,333.01 \u2014 stay (2024-10-19 \u2192 2024-11-03)"}],archived:true,archived_date:"2024-11-03"},
  {id:1385,apt:"202",owner:"ERA LT",name:"Latoya Bartell",type:"short-stay",rent:3142.84,balance:0,due:"2024-11-03",note:"Via: airbnb | Tel: 2155195002",history:[{"date": "2024-10-10", "text": "$3,142.84 \u2014 stay (2024-10-10 \u2192 2024-11-03)"}],archived:true,archived_date:"2024-11-03"},
  {id:1386,apt:"210",owner:"ERA LT",name:"Mohammed Ahmed",type:"long-term",rent:1365.0,balance:0,due:"2024-11-03",note:"Via: Private | Tel: 2154590721",history:[{"date": "2024-10-01", "text": "$1,365 \u2014 monthly (est.)"}, {"date": "2024-11-01", "text": "$1,365 \u2014 monthly (est.)"}],archived:true,archived_date:"2024-11-03"},
  {id:1387,apt:"212",owner:"ERA LT",name:"Carlos Diaz",type:"short-stay",rent:1701.83,balance:0,due:"2024-11-04",note:"Via: Airbnb | Tel: 5613518412",history:[{"date": "2024-10-14", "text": "$1,701.83 \u2014 stay (2024-10-14 \u2192 2024-11-04)"}],archived:true,archived_date:"2024-11-04"},
  {id:1388,apt:"104",owner:"ERA LT",name:"Griffin Malloy",type:"long-term",rent:3222.4,balance:0,due:"2024-11-07",note:"Via: airbnb | Tel: 2076323208 (609-675-1263 Lina)",history:[{"date": "2024-08-01", "text": "$3,222 \u2014 monthly (est.)"}, {"date": "2024-09-01", "text": "$3,222 \u2014 monthly (est.)"}, {"date": "2024-10-01", "text": "$3,222 \u2014 monthly (est.)"}, {"date": "2024-11-01", "text": "$3,222 \u2014 monthly (est.)"}],archived:true,archived_date:"2024-11-07"},
  {id:1389,apt:"215",owner:"ERA LT",name:"Rainier Guzman",type:"short-stay",rent:2364.44,balance:0,due:"2024-11-09",note:"Via: airbnb | Tel: 8296599099",history:[{"date": "2024-10-11", "text": "$2,364.44 \u2014 stay (2024-10-11 \u2192 2024-11-09)"}],archived:true,archived_date:"2024-11-09"},
  {id:1390,apt:"320",owner:"ERA LT",name:"Thomas DeKemper",type:"long-term",rent:2134.0,balance:0,due:"2024-11-09",note:"Via: Airbnb | Tel: 603-361-4024",history:[{"date": "2024-05-01", "text": "$2,134 \u2014 monthly (est.)"}, {"date": "2024-06-01", "text": "$2,134 \u2014 monthly (est.)"}, {"date": "2024-07-01", "text": "$2,134 \u2014 monthly (est.)"}, {"date": "2024-08-01", "text": "$2,134 \u2014 monthly (est.)"}, {"date": "2024-09-01", "text": "$2,134 \u2014 monthly (est.)"}, {"date": "2024-10-01", "text": "$2,134 \u2014 monthly (est.)"}, {"date": "2024-11-01", "text": "$2,134 \u2014 monthly (est.)"}],archived:true,archived_date:"2024-11-09"},
  {id:1391,apt:"317",owner:"ERA LT",name:"Amirkhan Akhumbaev",type:"short-stay",rent:962.0,balance:0,due:"2024-11-11",note:"Via: Airbnb | Tel: 6267252974",history:[{"date": "2024-11-04", "text": "$962.00 \u2014 stay (2024-11-04 \u2192 2024-11-11)"}],archived:true,archived_date:"2024-11-11"},
  {id:1392,apt:"Keswick 2B",owner:"Keswick Properties",name:"Sofia Varyagina",type:"short-stay",rent:861.7,balance:0,due:"2024-11-14",note:"Via: Airbnb | Tel: 2672052816",history:[{"date": "2024-10-28", "text": "$861.70 \u2014 stay (2024-10-28 \u2192 2024-11-14)"}],archived:true,archived_date:"2024-11-14"},
  {id:1393,apt:"Keswick 2A",owner:"Keswick Properties",name:"Its Me",type:"short-stay",rent:512.27,balance:0,due:"2024-11-19",note:"Via: Airbnb | Tel: 4848601659",history:[{"date": "2024-11-14", "text": "$512.27 \u2014 stay (2024-11-14 \u2192 2024-11-19)"}],archived:true,archived_date:"2024-11-19"},
  {id:1394,apt:"232",owner:"ERA LT",name:"Max Shuster",type:"month-to-month",rent:3600.0,balance:0,due:"",note:"Via: airbnb | Tel: 2676321074",history:[{"date": "2024-07-01", "text": "$3,600 \u2014 monthly (est.)"}, {"date": "2024-08-01", "text": "$3,600 \u2014 monthly (est.)"}, {"date": "2024-09-01", "text": "$3,600 \u2014 monthly (est.)"}, {"date": "2024-10-01", "text": "$3,600 \u2014 monthly (est.)"}, {"date": "2024-11-01", "text": "$3,600 \u2014 monthly (est.)"}, {"date": "2024-12-01", "text": "$3,600 \u2014 monthly (est.)"}, {"date": "2025-01-01", "text": "$3,600 \u2014 monthly (est.)"}, {"date": "2025-02-01", "text": "$3,600 \u2014 monthly (est.)"}, {"date": "2025-03-01", "text": "$3,600 \u2014 monthly (est.)"}, {"date": "2025-04-01", "text": "$3,600 \u2014 monthly (est.)"}, {"date": "2025-05-01", "text": "$3,600 \u2014 monthly (est.)"}, {"date": "2025-06-01", "text": "$3,600 \u2014 monthly (est.)"}, {"date": "2025-07-01", "text": "$3,600 \u2014 monthly (est.)"}, {"date": "2025-08-01", "text": "$3,600 \u2014 monthly (est.)"}, {"date": "2025-09-01", "text": "$3,600 \u2014 monthly (est.)"}, {"date": "2025-10-01", "text": "$3,600 \u2014 monthly (est.)"}, {"date": "2025-11-01", "text": "$3,600 \u2014 monthly (est.)"}, {"date": "2025-12-01", "text": "$3,600 \u2014 monthly (est.)"}, {"date": "2026-01-01", "text": "$3,600 \u2014 monthly (est.)"}, {"date": "2026-02-01", "text": "$3,600 \u2014 monthly (est.)"}, {"date": "2026-03-01", "text": "$3,600 \u2014 monthly (est.)"}],archived:true,archived_date:"2024-07-12"},
  {id:1395,apt:"Montg 4",owner:"Elkins LT",name:"Brittany Robinson",type:"short-stay",rent:782.04,balance:0,due:"2024-11-22",note:"Via: airbnb | Tel: 267-624-9957 | Email: h3aven.sent92@gmail.com",history:[{"date": "2024-09-29", "text": "$782.04 \u2014 stay (2024-09-29 \u2192 2024-11-22)"}],archived:true,archived_date:"2024-11-22"},
  {id:1396,apt:"Montg 6",owner:"Elkins LT",name:"Nick Mcintyre",type:"short-stay",rent:555.41,balance:0,due:"2024-11-23",note:"Via: airbnb | Tel: 6107879868",history:[{"date": "2024-11-17", "text": "$555.41 \u2014 stay (2024-11-17 \u2192 2024-11-23)"}],archived:true,archived_date:"2024-11-23"},
  {id:1397,apt:"Montg 1",owner:"Elkins LT",name:"Mikhail Alsheuski",type:"short-stay",rent:436.78,balance:0,due:"2024-11-24",note:"Via: Airbnb | Tel: 2672135424",history:[{"date": "2024-11-19", "text": "$436.78 \u2014 stay (2024-11-19 \u2192 2024-11-24)"}],archived:true,archived_date:"2024-11-24"},
  {id:1398,apt:"104",owner:"ERA LT",name:"Carmen Bonifate",type:"short-stay",rent:749.54,balance:0,due:"2024-11-27",note:"Via: Airbnb | Tel: 4126059258",history:[{"date": "2024-11-22", "text": "$749.54 \u2014 stay (2024-11-22 \u2192 2024-11-27)"}],archived:true,archived_date:"2024-11-27"},
  {id:1399,apt:"202",owner:"ERA LT",name:"Camille Jones",type:"short-stay",rent:814.25,balance:0,due:"2024-11-30",note:"Via: Airbnb | Tel: 6143523854",history:[{"date": "2024-11-25", "text": "$814.25 \u2014 stay (2024-11-25 \u2192 2024-11-30)"}],archived:true,archived_date:"2024-11-30"},
  {id:1400,apt:"Melrose B1",owner:"Melrose Properties",name:"Sara Molina-Robinson",type:"short-stay",rent:3114.87,balance:0,due:"2024-11-30",note:"Via: Airbnb | Tel: 2673933115",history:[{"date": "2024-10-26", "text": "$3,114.87 \u2014 stay (2024-10-26 \u2192 2024-11-30)"}],archived:true,archived_date:"2024-11-30"},
  {id:1401,apt:"Montg 1B",owner:"Elkins LT",name:"Steve Mello",type:"short-stay",rent:679.44,balance:0,due:"2024-11-30",note:"Via: Airbnb | Tel: 2672284126",history:[{"date": "2024-11-08", "text": "$679.44 \u2014 stay (2024-11-08 \u2192 2024-11-30)"}],archived:true,archived_date:"2024-11-30"},
  {id:1402,apt:"331",owner:"ERA LT",name:"Tatsiana Masiuk",type:"month-to-month",rent:1920.0,balance:0,due:"",note:"Via: facebook | Tel: (215) 552-6968 | Email: tanyamasuk@gmail.com",history:[{"date": "2024-07-01", "text": "$1,920 \u2014 monthly (est.)"}, {"date": "2024-08-01", "text": "$1,920 \u2014 monthly (est.)"}, {"date": "2024-09-01", "text": "$1,920 \u2014 monthly (est.)"}, {"date": "2024-10-01", "text": "$1,920 \u2014 monthly (est.)"}, {"date": "2024-11-01", "text": "$1,920 \u2014 monthly (est.)"}, {"date": "2024-12-01", "text": "$1,920 \u2014 monthly (est.)"}, {"date": "2025-01-01", "text": "$1,920 \u2014 monthly (est.)"}, {"date": "2025-02-01", "text": "$1,920 \u2014 monthly (est.)"}, {"date": "2025-03-01", "text": "$1,920 \u2014 monthly (est.)"}, {"date": "2025-04-01", "text": "$1,920 \u2014 monthly (est.)"}, {"date": "2025-05-01", "text": "$1,920 \u2014 monthly (est.)"}, {"date": "2025-06-01", "text": "$1,920 \u2014 monthly (est.)"}, {"date": "2025-07-01", "text": "$1,920 \u2014 monthly (est.)"}, {"date": "2025-08-01", "text": "$1,920 \u2014 monthly (est.)"}, {"date": "2025-09-01", "text": "$1,920 \u2014 monthly (est.)"}, {"date": "2025-10-01", "text": "$1,920 \u2014 monthly (est.)"}, {"date": "2025-11-01", "text": "$1,920 \u2014 monthly (est.)"}, {"date": "2025-12-01", "text": "$1,920 \u2014 monthly (est.)"}, {"date": "2026-01-01", "text": "$1,920 \u2014 monthly (est.)"}, {"date": "2026-02-01", "text": "$1,920 \u2014 monthly (est.)"}, {"date": "2026-03-01", "text": "$1,920 \u2014 monthly (est.)"}],archived:true,archived_date:"2024-07-28"},
  {id:1403,apt:"320",owner:"ERA LT",name:"Jason Leonard",type:"short-stay",rent:1672.27,balance:0,due:"2024-12-01",note:"Via: Airbnb | Tel: 2674079267",history:[{"date": "2024-11-17", "text": "$1,672.27 \u2014 stay (2024-11-17 \u2192 2024-12-01)"}],archived:true,archived_date:"2024-12-01"},
  {id:1404,apt:"Montg 1",owner:"Elkins LT",name:"Thomas Switzer",type:"short-stay",rent:623.36,balance:0,due:"2024-12-02",note:"Via: Airbnb | Tel: 2164035779",history:[{"date": "2024-11-25", "text": "$623.36 \u2014 stay (2024-11-25 \u2192 2024-12-02)"}],archived:true,archived_date:"2024-12-02"},
  {id:1405,apt:"115",owner:"ERA LT",name:"Juan Vanegas",type:"long-term",rent:3663.69,balance:0,due:"2024-12-03",note:"Via: Airbnb | Tel: 703-539-9612",history:[{"date": "2024-04-01", "text": "$3,664 \u2014 monthly (est.)"}, {"date": "2024-05-01", "text": "$3,664 \u2014 monthly (est.)"}, {"date": "2024-06-01", "text": "$3,664 \u2014 monthly (est.)"}, {"date": "2024-07-01", "text": "$3,664 \u2014 monthly (est.)"}, {"date": "2024-08-01", "text": "$3,664 \u2014 monthly (est.)"}, {"date": "2024-09-01", "text": "$3,664 \u2014 monthly (est.)"}, {"date": "2024-10-01", "text": "$3,664 \u2014 monthly (est.)"}, {"date": "2024-11-01", "text": "$3,664 \u2014 monthly (est.)"}, {"date": "2024-12-01", "text": "$3,664 \u2014 monthly (est.)"}],archived:true,archived_date:"2024-12-03"},
  {id:1406,apt:"Montg 3",owner:"Elkins LT",name:"Britni' Choice-Cartwright",type:"short-stay",rent:831.5,balance:0,due:"2024-12-03",note:"Via: Airbnb | Tel: 2672505627",history:[{"date": "2024-11-27", "text": "$831.50 \u2014 stay (2024-11-27 \u2192 2024-12-03)"}],archived:true,archived_date:"2024-12-03"},
  {id:1407,apt:"Montg 4",owner:"Elkins LT",name:"Khairi Greene",type:"short-stay",rent:1002.98,balance:0,due:"2024-12-06",note:"Via: Airbnb | Tel: 2156515767",history:[{"date": "2024-11-26", "text": "$1,002.98 \u2014 stay (2024-11-26 \u2192 2024-12-06)"}],archived:true,archived_date:"2024-12-06"},
  {id:1408,apt:"Keswick 2A",owner:"Keswick Properties",name:"Arnold Grisson Jr",type:"short-stay",rent:733.36,balance:0,due:"2024-12-07",note:"Via: Airbnb | Tel: 2153564383",history:[{"date": "2024-11-22", "text": "$733.36 \u2014 stay (2024-11-22 \u2192 2024-12-07)"}],archived:true,archived_date:"2024-12-07"},
  {id:1409,apt:"225",owner:"ERA LT",name:"Sheri",type:"long-term",rent:2600.0,balance:0,due:"2024-12-08",note:"Via: FF | Tel: (954) 937-9749",history:[{"date": "2024-10-01", "text": "$2,600 \u2014 monthly (est.)"}, {"date": "2024-11-01", "text": "$2,600 \u2014 monthly (est.)"}, {"date": "2024-12-01", "text": "$2,600 \u2014 monthly (est.)"}],archived:true,archived_date:"2024-12-08"},
  {id:1410,apt:"210",owner:"ERA LT",name:"Lisa Lemoi",type:"short-stay",rent:2191.02,balance:0,due:"2024-12-13",note:"Via: Airbnb | Tel: 7812817957",history:[{"date": "2024-11-25", "text": "$2,191.02 \u2014 stay (2024-11-25 \u2192 2024-12-13)"}],archived:true,archived_date:"2024-12-13"},
  {id:1411,apt:"Fox Chase  2",owner:"Fox Chase Properties",name:"Brittany Drone (moving out Dec 7th)",type:"long-term",rent:2250.0,balance:0,due:"2024-12-13",note:"Via: FF | Tel: (601) 874-5693 | Email: bdrone@ymail.com",history:[{"date": "2024-08-01", "text": "$2,250 \u2014 monthly (est.)"}, {"date": "2024-09-01", "text": "$2,250 \u2014 monthly (est.)"}, {"date": "2024-10-01", "text": "$2,250 \u2014 monthly (est.)"}, {"date": "2024-11-01", "text": "$2,250 \u2014 monthly (est.)"}, {"date": "2024-12-01", "text": "$2,250 \u2014 monthly (est.)"}],archived:true,archived_date:"2024-12-13"},
  {id:1412,apt:"Keswick 2B",owner:"Keswick Properties",name:"Sofia Varyagina",type:"month-to-month",rent:2200.0,balance:0,due:"",note:"Via: Airbnb | Tel: 2672052816 | Email: apple11039@mail.ru",history:[{"date": "2024-11-01", "text": "$2,200 \u2014 monthly (est.)"}, {"date": "2024-12-01", "text": "$2,200 \u2014 monthly (est.)"}, {"date": "2025-01-01", "text": "$2,200 \u2014 monthly (est.)"}, {"date": "2025-02-01", "text": "$2,200 \u2014 monthly (est.)"}, {"date": "2025-03-01", "text": "$2,200 \u2014 monthly (est.)"}, {"date": "2025-04-01", "text": "$2,200 \u2014 monthly (est.)"}, {"date": "2025-05-01", "text": "$2,200 \u2014 monthly (est.)"}, {"date": "2025-06-01", "text": "$2,200 \u2014 monthly (est.)"}, {"date": "2025-07-01", "text": "$2,200 \u2014 monthly (est.)"}, {"date": "2025-08-01", "text": "$2,200 \u2014 monthly (est.)"}, {"date": "2025-09-01", "text": "$2,200 \u2014 monthly (est.)"}, {"date": "2025-10-01", "text": "$2,200 \u2014 monthly (est.)"}, {"date": "2025-11-01", "text": "$2,200 \u2014 monthly (est.)"}, {"date": "2025-12-01", "text": "$2,200 \u2014 monthly (est.)"}, {"date": "2026-01-01", "text": "$2,200 \u2014 monthly (est.)"}, {"date": "2026-02-01", "text": "$2,200 \u2014 monthly (est.)"}, {"date": "2026-03-01", "text": "$2,200 \u2014 monthly (est.)"}],archived:true,archived_date:"2024-11-14"},
  {id:1413,apt:"Montg 9",owner:"Elkins LT",name:"Lyqueena Deshazo",type:"short-stay",rent:3248.76,balance:0,due:"2024-12-19",note:"Via: Airbnb | Tel: 6098927788",history:[{"date": "2024-11-19", "text": "$3,248.76 \u2014 stay (2024-11-19 \u2192 2024-12-19)"}],archived:true,archived_date:"2024-12-19"},
  {id:1414,apt:"Keswick 3A",owner:"Keswick Properties",name:"Holly Delaney",type:"short-stay",rent:1615.42,balance:0,due:"2024-12-21",note:"Via: Airbnb | Tel: 2158280948",history:[{"date": "2024-12-01", "text": "$1,615.42 \u2014 stay (2024-12-01 \u2192 2024-12-21)"}],archived:true,archived_date:"2024-12-21"},
  {id:1415,apt:"212",owner:"ERA LT",name:"Sergio Dominguez Ramsden",type:"short-stay",rent:1655.24,balance:0,due:"2024-12-23",note:"Via: Airbnb | Tel: 8311169330",history:[{"date": "2024-12-06", "text": "$1,655.24 \u2014 stay (2024-12-06 \u2192 2024-12-23)"}],archived:true,archived_date:"2024-12-23"},
  {id:1416,apt:"225",owner:"ERA LT",name:"Rose Lewis-Daniel",type:"long-term",rent:1000.0,balance:0,due:"2024-12-25",note:"Via: Rose | Tel: 267-323-5428",history:[{"date": "2024-12-01", "text": "$1,000 \u2014 monthly (est.)"}],archived:true,archived_date:"2024-12-25"},
  {id:1417,apt:"Melrose B1",owner:"Melrose Properties",name:"Machaira Tran",type:"short-stay",rent:1179.98,balance:0,due:"2024-12-27",note:"Via: Airbnb | Tel: 2674028364",history:[{"date": "2024-12-24", "text": "$1,179.98 \u2014 stay (2024-12-24 \u2192 2024-12-27)"}],archived:true,archived_date:"2024-12-27"},
  {id:1418,apt:"Montg 1B",owner:"Elkins LT",name:"Solmaz Gasimova",type:"short-stay",rent:1269.4,balance:0,due:"2024-12-27",note:"Via: Airbnb",history:[{"date": "2024-12-12", "text": "$1,269.40 \u2014 stay (2024-12-12 \u2192 2024-12-27)"}],archived:true,archived_date:"2024-12-27"},
  {id:1419,apt:"Montg 6",owner:"Elkins LT",name:"Doriann Stewart",type:"short-stay",rent:534.0,balance:0,due:"2024-12-28",note:"Via: booking | Tel: 610 931 6981",history:[{"date": "2024-12-22", "text": "$534.00 \u2014 stay (2024-12-22 \u2192 2024-12-28)"}],archived:true,archived_date:"2024-12-28"},
  {id:1420,apt:"314",owner:"ERA LT",name:"Alisher Akhmetkanov",type:"short-stay",rent:638.02,balance:0,due:"2024-12-30",note:"Via: Airbnb | Tel: 2676266928",history:[{"date": "2024-12-23", "text": "$638.02 \u2014 stay (2024-12-23 \u2192 2024-12-30)"}],archived:true,archived_date:"2024-12-30"},
  {id:1421,apt:"Montg 3",owner:"Elkins LT",name:"Carl Williford",type:"long-term",rent:801.3,balance:0,due:"2024-12-30",note:"Tel: 2158370344",history:[{"date": "2024-12-01", "text": "$801 \u2014 monthly (est.)"}],archived:true,archived_date:"2024-12-30"},
  {id:1422,apt:"Retail Fox Chase",owner:"Fox Chase Properties",name:"Liudmila Khadaeva (moving out 12/31)",type:"long-term",rent:1100.0,balance:0,due:"2025-05-31",note:"Via: facebook | Tel: (267) 901-1685 | Email: khadaevaliudmila@gmail.com",history:[{"date": "2024-05-01", "text": "$1,100 \u2014 monthly (est.)"}, {"date": "2024-06-01", "text": "$1,100 \u2014 monthly (est.)"}, {"date": "2024-07-01", "text": "$1,100 \u2014 monthly (est.)"}, {"date": "2024-08-01", "text": "$1,100 \u2014 monthly (est.)"}, {"date": "2024-09-01", "text": "$1,100 \u2014 monthly (est.)"}, {"date": "2024-10-01", "text": "$1,100 \u2014 monthly (est.)"}, {"date": "2024-11-01", "text": "$1,100 \u2014 monthly (est.)"}, {"date": "2024-12-01", "text": "$1,100 \u2014 monthly (est.)"}, {"date": "2025-01-01", "text": "$1,100 \u2014 monthly (est.)"}, {"date": "2025-02-01", "text": "$1,100 \u2014 monthly (est.)"}, {"date": "2025-03-01", "text": "$1,100 \u2014 monthly (est.)"}, {"date": "2025-04-01", "text": "$1,100 \u2014 monthly (est.)"}, {"date": "2025-05-01", "text": "$1,100 \u2014 monthly (est.)"}],archived:true,archived_date:"2025-05-31"},
  {id:1423,apt:"Keswick 3B",owner:"Keswick Properties",name:"Harish Kallagunta",type:"short-stay",rent:620.12,balance:0,due:"2025-01-02",note:"Via: Airbnb | Tel: 2052535268",history:[{"date": "2024-12-26", "text": "$620.12 \u2014 stay (2024-12-26 \u2192 2025-01-02)"}],archived:true,archived_date:"2025-01-02"},
  {id:1424,apt:"Melrose B1",owner:"Melrose Properties",name:"Shaelyn Land",type:"short-stay",rent:588.84,balance:0,due:"2025-01-02",note:"Via: Airbnb | Tel: 2157208524",history:[{"date": "2024-12-27", "text": "$588.84 \u2014 stay (2024-12-27 \u2192 2025-01-02)"}],archived:true,archived_date:"2025-01-02"},
  {id:1425,apt:"Montg 1",owner:"Elkins LT",name:"Vitalii Kim Vitalii",type:"short-stay",rent:588.84,balance:0,due:"2025-01-02",note:"Via: Airbnb | Tel: 2676326518",history:[{"date": "2024-12-26", "text": "$588.84 \u2014 stay (2024-12-26 \u2192 2025-01-02)"}],archived:true,archived_date:"2025-01-02"},
  {id:1426,apt:"Montg 9",owner:"Elkins LT",name:"卓轩 吴 (till 27th)",type:"short-stay",rent:1641.09,balance:0,due:"2025-01-02",note:"Via: Airbnb | Tel: 19066507907",history:[{"date": "2024-12-19", "text": "$1,641.09 \u2014 stay (2024-12-19 \u2192 2025-01-02)"}],archived:true,archived_date:"2025-01-02"},
  {id:1427,apt:"207",owner:"ERA LT",name:"Terrell Bullock-Wallington",type:"short-stay",rent:239.01,balance:0,due:"2025-01-03",note:"Via: Airbnb | Tel: 469-740-3963",history:[{"date": "2025-01-01", "text": "$239.01 \u2014 stay (2025-01-01 \u2192 2025-01-03)"}],archived:true,archived_date:"2025-01-03"},
  {id:1428,apt:"331",owner:"ERA LT",name:"Amir",type:"short-stay",rent:390.0,balance:0,due:"2025-01-05",note:"Via: Airbnb | Tel: 626-725-29-74",history:[{"date": "2025-01-02", "text": "$390.00 \u2014 stay (2025-01-02 \u2192 2025-01-05)"}],archived:true,archived_date:"2025-01-05"},
  {id:1429,apt:"Fox Chase  2",owner:"Fox Chase Properties",name:"Michael Stern",type:"short-stay",rent:1061.28,balance:0,due:"2025-01-05",note:"Via: booking | Tel: 215 808 1423",history:[{"date": "2024-12-11", "text": "$1,061.28 \u2014 stay (2024-12-11 \u2192 2025-01-05)"}],archived:true,archived_date:"2025-01-05"},
  {id:1430,apt:"212",owner:"ERA LT",name:"Sergio Dominguez Ramsden",type:"short-stay",rent:821.79,balance:0,due:"2025-01-12",note:"Via: Airbnb | Tel: 8311169330",history:[{"date": "2024-12-27", "text": "$821.79 \u2014 stay (2024-12-27 \u2192 2025-01-12)"}],archived:true,archived_date:"2025-01-12"},
  {id:1431,apt:"317",owner:"ERA LT",name:"Bryan Howard",type:"short-stay",rent:855.72,balance:0,due:"2025-01-11",note:"Via: VRBO | Tel: 5613034915",history:[{"date": "2024-12-28", "text": "$855.72 \u2014 stay (2024-12-28 \u2192 2025-01-11)"}],archived:true,archived_date:"2025-01-11"},
  {id:1432,apt:"Montg 1B",owner:"Elkins LT",name:"Ryan Frederiks",type:"short-stay",rent:399.4,balance:0,due:"2025-01-17",note:"Via: Vrbo | Tel: 5188943708 | Email: rsfrederiks@gmail.com",history:[{"date": "2025-01-13", "text": "$399.40 \u2014 stay (2025-01-13 \u2192 2025-01-17)"}],archived:true,archived_date:"2025-01-17"},
  {id:1433,apt:"330",owner:"ERA LT",name:"Eric Molina",type:"long-term",rent:1368.26,balance:0,due:"2025-01-18",note:"Via: Airbnb | Tel: 2678502101",history:[{"date": "2024-08-01", "text": "$1,368 \u2014 monthly (est.)"}, {"date": "2024-09-01", "text": "$1,368 \u2014 monthly (est.)"}, {"date": "2024-10-01", "text": "$1,368 \u2014 monthly (est.)"}, {"date": "2024-11-01", "text": "$1,368 \u2014 monthly (est.)"}, {"date": "2024-12-01", "text": "$1,368 \u2014 monthly (est.)"}, {"date": "2025-01-01", "text": "$1,368 \u2014 monthly (est.)"}],archived:true,archived_date:"2025-01-18"},
  {id:1434,apt:"331",owner:"ERA LT",name:"Taleah Sanford",type:"short-stay",rent:512.06,balance:0,due:"2025-01-20",note:"Via: Airbnb | Tel: 2672536740",history:[{"date": "2025-01-14", "text": "$512.06 \u2014 stay (2025-01-14 \u2192 2025-01-20)"}],archived:true,archived_date:"2025-01-20"},
  {id:1435,apt:"Montg 6",owner:"Elkins LT",name:"Lee Shoshan",type:"long-term",rent:2000.0,balance:0,due:"2025-01-26",note:"Email: leeshoshan2002@gmail.com",history:[{"date": "2025-01-01", "text": "$2,000 \u2014 monthly (est.)"}],archived:true,archived_date:"2025-01-26"},
  {id:1436,apt:"210",owner:"ERA LT",name:"Thomas Delaney",type:"long-term",rent:3000.0,balance:0,due:"2025-01-28",note:"Via: FF | Tel: 6318291208 | Email: tommydelaney@icloud.com",history:[{"date": "2024-12-01", "text": "$3,000 \u2014 monthly (est.)"}, {"date": "2025-01-01", "text": "$3,000 \u2014 monthly (est.)"}],archived:true,archived_date:"2025-01-28"},
  {id:1437,apt:"215",owner:"ERA LT",name:"Fedor Mikheev",type:"short-stay",rent:5600.0,balance:0,due:"2025-01-29",note:"Via: VRBO | Tel: 61081324441 | Email: Fedosei@gmail.com",history:[{"date": "2024-12-16", "text": "$5,600.00 \u2014 stay (2024-12-16 \u2192 2025-01-29)"}],archived:true,archived_date:"2025-01-29"},
  {id:1438,apt:"Keswick 3B",owner:"Keswick Properties",name:"Yani Djennadi",type:"short-stay",rent:1473.19,balance:0,due:"2025-01-31",note:"Via: Airbnb | Tel: 6102832710",history:[{"date": "2025-01-12", "text": "$1,473.19 \u2014 stay (2025-01-12 \u2192 2025-01-31)"}],archived:true,archived_date:"2025-01-31"},
  {id:1439,apt:"Montg 5",owner:"Elkins LT",name:"Caron Dessoye",type:"long-term",rent:1650.0,balance:0,due:"2025-01-31",note:"Via: Zillow | Tel: 570-540-3832  old - (267) 625-9496 | Email: dessoyec@arcadia.edu",history:[{"date": "2024-01-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2024-02-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2024-03-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2024-04-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2024-05-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2024-06-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2024-07-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2024-08-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2024-09-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2024-10-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2024-11-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2024-12-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2025-01-01", "text": "$1,650 \u2014 monthly (est.)"}],archived:true,archived_date:"2025-01-31"},
  {id:1440,apt:"Keswick 2B",owner:"Keswick Properties",name:"Makedon Yunoev (moving out 01/31)",type:"long-term",rent:1550.0,balance:0,due:"2025-12-15",note:"Via: facebook | Tel: (856) 538-5155, 917-245-7984 | Email: yunoev2001@gmail.com",history:[{"date": "2024-12-01", "text": "$1,550 \u2014 monthly (est.)"}, {"date": "2025-01-01", "text": "$1,550 \u2014 monthly (est.)"}, {"date": "2025-02-01", "text": "$1,550 \u2014 monthly (est.)"}, {"date": "2025-03-01", "text": "$1,550 \u2014 monthly (est.)"}, {"date": "2025-04-01", "text": "$1,550 \u2014 monthly (est.)"}, {"date": "2025-05-01", "text": "$1,550 \u2014 monthly (est.)"}, {"date": "2025-06-01", "text": "$1,550 \u2014 monthly (est.)"}, {"date": "2025-07-01", "text": "$1,550 \u2014 monthly (est.)"}, {"date": "2025-08-01", "text": "$1,550 \u2014 monthly (est.)"}, {"date": "2025-09-01", "text": "$1,550 \u2014 monthly (est.)"}, {"date": "2025-10-01", "text": "$1,550 \u2014 monthly (est.)"}, {"date": "2025-11-01", "text": "$1,550 \u2014 monthly (est.)"}, {"date": "2025-12-01", "text": "$1,550 \u2014 monthly (est.)"}],archived:true,archived_date:"2025-12-15"},
  {id:1441,apt:"225",owner:"ERA LT",name:"Andy Marsh",type:"long-term",rent:2000.0,balance:0,due:"2025-02-03",note:"Via: FF | Tel: 2018562379 | Email: Andymarsh234@gmail.com",history:[{"date": "2025-01-01", "text": "$2,000 \u2014 monthly (est.)"}, {"date": "2025-02-01", "text": "$2,000 \u2014 monthly (est.)"}],archived:true,archived_date:"2025-02-03"},
  {id:1442,apt:"Keswick 2B",owner:"Keswick Properties",name:"Kara Carnegie",type:"short-stay",rent:612.57,balance:0,due:"2025-02-12",note:"Via: Airbnb | Tel: 8143126790",history:[{"date": "2025-02-05", "text": "$612.57 \u2014 stay (2025-02-05 \u2192 2025-02-12)"}],archived:true,archived_date:"2025-02-12"},
  {id:1443,apt:"207",owner:"ERA LT",name:"Joseph Dinkel",type:"short-stay",rent:607.61,balance:0,due:"2025-02-10",note:"Via: Airbnb | Tel: 727-643-9982",history:[{"date": "2025-01-13", "text": "$607.61 \u2014 stay (2025-01-13 \u2192 2025-02-10)"}],archived:true,archived_date:"2025-02-10"},
  {id:1444,apt:"331",owner:"ERA LT",name:"Vitalii Dovhyi",type:"short-stay",rent:431.39,balance:0,due:"2025-02-16",note:"Via: Airbnb | Tel: 633002310",history:[{"date": "2025-02-11", "text": "$431.39 \u2014 stay (2025-02-11 \u2192 2025-02-16)"}],archived:true,archived_date:"2025-02-16"},
  {id:1445,apt:"Montg 1B",owner:"Elkins LT",name:"Geriel Kessyler",type:"short-stay",rent:580.4,balance:0,due:"2025-02-12",note:"Via: Booking | Tel: 33 99930 7137",history:[{"date": "2025-02-05", "text": "$580.40 \u2014 stay (2025-02-05 \u2192 2025-02-12)"}],archived:true,archived_date:"2025-02-12"},
  {id:1446,apt:"Keswick 2A",owner:"Keswick Properties",name:"Sky Alexander",type:"short-stay",rent:427.07,balance:0,due:"2025-02-18",note:"Via: Airbnb | Tel: 2194876150",history:[{"date": "2025-02-13", "text": "$427.07 \u2014 stay (2025-02-13 \u2192 2025-02-18)"}],archived:true,archived_date:"2025-02-18"},
  {id:1447,apt:"Melrose B1",owner:"Melrose Properties",name:"Taj Mahamat",type:"short-stay",rent:496.1,balance:0,due:"2025-02-20",note:"Via: Airbnb | Tel: 2016166139",history:[{"date": "2025-02-13", "text": "$496.10 \u2014 stay (2025-02-13 \u2192 2025-02-20)"}],archived:true,archived_date:"2025-02-20"},
  {id:1448,apt:"Keswick 3B",owner:"Keswick Properties",name:"Kristina Thompson",type:"short-stay",rent:601.79,balance:0,due:"2025-02-21",note:"Via: Airbnb | Tel: 5164626093",history:[{"date": "2025-02-15", "text": "$601.79 \u2014 stay (2025-02-15 \u2192 2025-02-21)"}],archived:true,archived_date:"2025-02-21"},
  {id:1449,apt:"115",owner:"ERA LT",name:"Manuel Jerez",type:"short-stay",rent:1779.57,balance:0,due:"2025-02-26",note:"Via: Airbnb | Tel: 6108039993",history:[{"date": "2025-02-09", "text": "$1,779.57 \u2014 stay (2025-02-09 \u2192 2025-02-26)"}],archived:true,archived_date:"2025-02-26"},
  {id:1450,apt:"Fox Chase  2",owner:"Fox Chase Properties",name:"Rezephyr Fulton",type:"short-stay",rent:1522.8,balance:0,due:"2025-02-26",note:"Via: Airbnb | Tel: 4848302031",history:[{"date": "2025-02-06", "text": "$1,522.80 \u2014 stay (2025-02-06 \u2192 2025-02-26)"}],archived:true,archived_date:"2025-02-26"},
  {id:1451,apt:"104",owner:"ERA LT",name:"Connie Vales",type:"short-stay",rent:4449.25,balance:0,due:"2025-02-28",note:"Via: Airbnb | Tel: 2158527149 | Email: darkelf369@gmail.com",history:[{"date": "2025-01-20", "text": "$4,449.25 \u2014 stay (2025-01-20 \u2192 2025-02-28)"}],archived:true,archived_date:"2025-02-28"},
  {id:1452,apt:"Montg 5B",owner:"Elkins LT",name:"Mariami Metreveli",type:"long-term",rent:1250.0,balance:0,due:"2025-02-28",note:"Via: facebook | Tel: 9179402724 | Email: Marimetro1418@gmail.com",history:[{"date": "2024-03-01", "text": "$1,250 \u2014 monthly (est.)"}, {"date": "2024-04-01", "text": "$1,250 \u2014 monthly (est.)"}, {"date": "2024-05-01", "text": "$1,250 \u2014 monthly (est.)"}, {"date": "2024-06-01", "text": "$1,250 \u2014 monthly (est.)"}, {"date": "2024-07-01", "text": "$1,250 \u2014 monthly (est.)"}, {"date": "2024-08-01", "text": "$1,250 \u2014 monthly (est.)"}, {"date": "2024-09-01", "text": "$1,250 \u2014 monthly (est.)"}, {"date": "2024-10-01", "text": "$1,250 \u2014 monthly (est.)"}, {"date": "2024-11-01", "text": "$1,250 \u2014 monthly (est.)"}, {"date": "2024-12-01", "text": "$1,250 \u2014 monthly (est.)"}, {"date": "2025-01-01", "text": "$1,250 \u2014 monthly (est.)"}, {"date": "2025-02-01", "text": "$1,250 \u2014 monthly (est.)"}],archived:true,archived_date:"2025-02-28"},
  {id:1453,apt:"Melrose C1",owner:"Melrose Properties",name:"Lamanda Davis",type:"long-term",rent:1575.0,balance:0,due:"2025-07-31",note:"Via: airbnb | Tel: (484) 300-7241 | Email: davis.lamanda@yahoo.com",history:[{"date": "2024-07-01", "text": "$1,575 \u2014 monthly (est.)"}, {"date": "2024-08-01", "text": "$1,575 \u2014 monthly (est.)"}, {"date": "2024-09-01", "text": "$1,575 \u2014 monthly (est.)"}, {"date": "2024-10-01", "text": "$1,575 \u2014 monthly (est.)"}, {"date": "2024-11-01", "text": "$1,575 \u2014 monthly (est.)"}, {"date": "2024-12-01", "text": "$1,575 \u2014 monthly (est.)"}, {"date": "2025-01-01", "text": "$1,575 \u2014 monthly (est.)"}, {"date": "2025-02-01", "text": "$1,575 \u2014 monthly (est.)"}, {"date": "2025-03-01", "text": "$1,575 \u2014 monthly (est.)"}, {"date": "2025-04-01", "text": "$1,575 \u2014 monthly (est.)"}, {"date": "2025-05-01", "text": "$1,575 \u2014 monthly (est.)"}, {"date": "2025-06-01", "text": "$1,575 \u2014 monthly (est.)"}, {"date": "2025-07-01", "text": "$1,575 \u2014 monthly (est.)"}],archived:true,archived_date:"2025-07-31"},
  {id:1454,apt:"221",owner:"ERA LT",name:"Luka Gorelishvili",type:"long-term",rent:1700.0,balance:0,due:"2025-11-30",note:"Via: facebook | Tel: (215) 552-6647 | Email: lukksong@gmail.com",history:[{"date": "2024-12-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2025-01-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2025-02-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2025-03-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2025-04-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2025-05-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2025-06-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2025-07-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2025-08-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2025-09-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2025-10-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2025-11-01", "text": "$1,700 \u2014 monthly (est.)"}],archived:true,archived_date:"2025-11-30"},
  {id:1455,apt:"121",owner:"ERA LT",name:"Amnon Saad",type:"long-term",rent:1200.0,balance:0,due:"2025-03-31",note:"Via: Lindy",history:[{"date": "2022-06-01", "text": "$1,200 \u2014 monthly (est.)"}, {"date": "2022-07-01", "text": "$1,200 \u2014 monthly (est.)"}, {"date": "2022-08-01", "text": "$1,200 \u2014 monthly (est.)"}, {"date": "2022-09-01", "text": "$1,200 \u2014 monthly (est.)"}, {"date": "2022-10-01", "text": "$1,200 \u2014 monthly (est.)"}, {"date": "2022-11-01", "text": "$1,200 \u2014 monthly (est.)"}, {"date": "2022-12-01", "text": "$1,200 \u2014 monthly (est.)"}, {"date": "2023-01-01", "text": "$1,200 \u2014 monthly (est.)"}, {"date": "2023-02-01", "text": "$1,200 \u2014 monthly (est.)"}, {"date": "2023-03-01", "text": "$1,200 \u2014 monthly (est.)"}, {"date": "2023-04-01", "text": "$1,200 \u2014 monthly (est.)"}, {"date": "2023-05-01", "text": "$1,200 \u2014 monthly (est.)"}, {"date": "2023-06-01", "text": "$1,200 \u2014 monthly (est.)"}, {"date": "2023-07-01", "text": "$1,200 \u2014 monthly (est.)"}, {"date": "2023-08-01", "text": "$1,200 \u2014 monthly (est.)"}, {"date": "2023-09-01", "text": "$1,200 \u2014 monthly (est.)"}, {"date": "2023-10-01", "text": "$1,200 \u2014 monthly (est.)"}, {"date": "2023-11-01", "text": "$1,200 \u2014 monthly (est.)"}, {"date": "2023-12-01", "text": "$1,200 \u2014 monthly (est.)"}, {"date": "2024-01-01", "text": "$1,200 \u2014 monthly (est.)"}, {"date": "2024-02-01", "text": "$1,200 \u2014 monthly (est.)"}, {"date": "2024-03-01", "text": "$1,200 \u2014 monthly (est.)"}, {"date": "2024-04-01", "text": "$1,200 \u2014 monthly (est.)"}, {"date": "2024-05-01", "text": "$1,200 \u2014 monthly (est.)"}, {"date": "2024-06-01", "text": "$1,200 \u2014 monthly (est.)"}, {"date": "2024-07-01", "text": "$1,200 \u2014 monthly (est.)"}, {"date": "2024-08-01", "text": "$1,200 \u2014 monthly (est.)"}, {"date": "2024-09-01", "text": "$1,200 \u2014 monthly (est.)"}, {"date": "2024-10-01", "text": "$1,200 \u2014 monthly (est.)"}, {"date": "2024-11-01", "text": "$1,200 \u2014 monthly (est.)"}, {"date": "2024-12-01", "text": "$1,200 \u2014 monthly (est.)"}, {"date": "2025-01-01", "text": "$1,200 \u2014 monthly (est.)"}, {"date": "2025-02-01", "text": "$1,200 \u2014 monthly (est.)"}, {"date": "2025-03-01", "text": "$1,200 \u2014 monthly (est.)"}],archived:true,archived_date:"2025-03-31"},
  {id:1456,apt:"128",owner:"ERA LT",name:"franktorrisi1949@gmail.com",type:"long-term",rent:0.0,balance:0,due:"",note:"Tel: private",history:[],archived:true,archived_date:"2022-11-18"},
  {id:1457,apt:"223",owner:"ERA LT",name:"abigailemartiner@gmail.com",type:"long-term",rent:0.0,balance:0,due:"",note:"Via: 843 | Tel: vrbo",history:[],archived:true,archived_date:"2022-01-07"},
  {id:1458,apt:"212",owner:"ERA LT",name:"sbaby2185@gmail.com",type:"long-term",rent:0.0,balance:0,due:"",note:"Tel: private",history:[],archived:true,archived_date:"2022-01-02"},
  {id:1459,apt:"320",owner:"ERA LT",name:"alyshadecker@diamondcontractors.com",type:"long-term",rent:0.0,balance:0,due:"",note:"Tel: vrbo",history:[],archived:true,archived_date:"2022-11-12"},
  {id:1460,apt:"211",owner:"ERA LT",name:"Cash_lavelle@yahoo.com",type:"long-term",rent:0.0,balance:0,due:"",note:"Via: 2100 | Tel: Private",history:[],archived:true,archived_date:"2022-12-15"},
  {id:1461,apt:"127",owner:"ERA LT",name:"Nadine Maxwell - balance $1500 (08/04 paid 1000, will pay the rest by Sunday)",type:"long-term",rent:1650.0,balance:0,due:"2023-09-10",note:"Via: abnb | Tel: 5169721911 | Email: nsmaxwell69@gmail.com",history:[{"date": "2022-10-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2022-11-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2022-12-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2023-01-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2023-02-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2023-03-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2023-04-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2023-05-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2023-06-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2023-07-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2023-08-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2023-09-01", "text": "$1,650 \u2014 monthly (est.)"}],archived:true,archived_date:"2023-09-10"},
  {id:1462,apt:"Noble",owner:"Noble Properties",name:"Judy",type:"short-stay",rent:0.0,balance:0,due:"2023-05-28",note:"Via: abnb",history:[],archived:true,archived_date:"2023-05-28"},
  {id:1463,apt:"320",owner:"ERA LT",name:"Zina",type:"short-stay",rent:3300.0,balance:0,due:"2023-10-10",note:"Via: Vrbo | Tel: 267-499-6312",history:[{"date": "2023-09-11", "text": "$3,300.00 \u2014 stay (2023-09-11 \u2192 2023-10-10)"}],archived:true,archived_date:"2023-10-10"},
  {id:1464,apt:"426-3",owner:"ERA LT",name:"Osvaldo E. Carabajal",type:"long-term",rent:1600.0,balance:0,due:"2024-09-27",note:"Tel: (484) 522-9973 | Email: osvaldo.carabajal@gmail.com",history:[{"date": "2023-09-01", "text": "$1,600 \u2014 monthly (est.)"}, {"date": "2023-10-01", "text": "$1,600 \u2014 monthly (est.)"}, {"date": "2023-11-01", "text": "$1,600 \u2014 monthly (est.)"}, {"date": "2023-12-01", "text": "$1,600 \u2014 monthly (est.)"}, {"date": "2024-01-01", "text": "$1,600 \u2014 monthly (est.)"}, {"date": "2024-02-01", "text": "$1,600 \u2014 monthly (est.)"}, {"date": "2024-03-01", "text": "$1,600 \u2014 monthly (est.)"}, {"date": "2024-04-01", "text": "$1,600 \u2014 monthly (est.)"}, {"date": "2024-05-01", "text": "$1,600 \u2014 monthly (est.)"}, {"date": "2024-06-01", "text": "$1,600 \u2014 monthly (est.)"}, {"date": "2024-07-01", "text": "$1,600 \u2014 monthly (est.)"}, {"date": "2024-08-01", "text": "$1,600 \u2014 monthly (est.)"}, {"date": "2024-09-01", "text": "$1,600 \u2014 monthly (est.)"}],archived:true,archived_date:"2024-09-27"},
  {id:1465,apt:"Montg 3",owner:"Elkins LT",name:"Shokhrukh Urinov",type:"long-term",rent:1850.0,balance:0,due:"2026-01-31",note:"Via: facebook | Tel: (929) 675-1380 | Email: shoxruxurinoff@gmail.com",history:[{"date": "2025-01-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2025-02-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2025-03-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2025-04-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2025-05-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2025-06-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2025-07-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2025-08-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2025-09-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2025-10-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2025-11-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2025-12-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2026-01-01", "text": "$1,850 \u2014 monthly (est.)"}],archived:true,archived_date:"2026-01-31"},
  {id:1466,apt:"331",owner:"ERA LT",name:"Joseph Dinkel",type:"short-stay",rent:642.77,balance:0,due:"2025-03-10",note:"Via: Airbnb | Tel: 7276439982",history:[{"date": "2025-02-17", "text": "$642.77 \u2014 stay (2025-02-17 \u2192 2025-03-10)"}],archived:true,archived_date:"2025-03-10"},
  {id:1467,apt:"Keswick 2A",owner:"Keswick Properties",name:"Aaron Montfort",type:"short-stay",rent:624.0,balance:0,due:"2025-03-11",note:"Via: Booking com | Tel: 4702273379",history:[{"date": "2025-03-04", "text": "$624.00 \u2014 stay (2025-03-04 \u2192 2025-03-11)"}],archived:true,archived_date:"2025-03-11"},
  {id:1468,apt:"Fox Chase  2",owner:"Fox Chase Properties",name:"Dzhirgala Cooper",type:"short-stay",rent:458.35,balance:0,due:"2025-03-12",note:"Via: Airbnb | Tel: 2677690549",history:[{"date": "2025-03-07", "text": "$458.35 \u2014 stay (2025-03-07 \u2192 2025-03-12)"}],archived:true,archived_date:"2025-03-12"},
  {id:1469,apt:"Keswick 2B",owner:"Keswick Properties",name:"Sydney Moore",type:"short-stay",rent:1248.68,balance:0,due:"2025-03-13",note:"Via: Airbnb | Tel: 6187892843",history:[{"date": "2025-02-28", "text": "$1,248.68 \u2014 stay (2025-02-28 \u2192 2025-03-13)"}],archived:true,archived_date:"2025-03-13"},
  {id:1470,apt:"210",owner:"ERA LT",name:"Hailey Sobocinski",type:"short-stay",rent:1282.08,balance:0,due:"2025-03-13",note:"Via: Airbnb | Tel: 5704066704 | Email: hailey.sobo@gmail.com",history:[{"date": "2025-03-01", "text": "$1,282.08 \u2014 stay (2025-03-01 \u2192 2025-03-13)"}],archived:true,archived_date:"2025-03-13"},
  {id:1471,apt:"202",owner:"ERA LT",name:"Arturo Ramsden",type:"short-stay",rent:2833.67,balance:0,due:"2025-02-15",note:"Via: VRBO | Tel: 9564798548 | Email: arturodramsden@gmail.com",history:[{"date": "2025-01-12", "text": "$2,833.67 \u2014 stay (2025-01-12 \u2192 2025-02-15)"}],archived:true,archived_date:"2025-02-15"},
  {id:1472,apt:"Montg 1B",owner:"Elkins LT",name:"Darcy Mccaughan",type:"short-stay",rent:571.59,balance:0,due:"2025-03-16",note:"Via: Airbnb | Tel: 2673370603",history:[{"date": "2025-03-09", "text": "$571.59 \u2014 stay (2025-03-09 \u2192 2025-03-16)"}],archived:true,archived_date:"2025-03-16"},
  {id:1473,apt:"225",owner:"ERA LT",name:"Aubrey Paul",type:"short-stay",rent:636.3,balance:0,due:"2025-03-20",note:"Via: Airbnb | Tel: 6103162439",history:[{"date": "2025-03-03", "text": "$636.30 \u2014 stay (2025-03-03 \u2192 2025-03-20)"}],archived:true,archived_date:"2025-03-20"},
  {id:1474,apt:"Melrose B1",owner:"Melrose Properties",name:"Kevin Carter",type:"short-stay",rent:2303.65,balance:0,due:"2025-03-23",note:"Via: Vrbo | Tel: 4452759923",history:[{"date": "2025-02-23", "text": "$2,303.65 \u2014 stay (2025-02-23 \u2192 2025-03-23)"}],archived:true,archived_date:"2025-03-23"},
  {id:1475,apt:"215",owner:"ERA LT",name:"Paul Consigny",type:"short-stay",rent:2972.4,balance:0,due:"2025-03-23",note:"Via: Booking | Tel: 267 784 7738",history:[{"date": "2025-02-23", "text": "$2,972.40 \u2014 stay (2025-02-23 \u2192 2025-03-23)"}],archived:true,archived_date:"2025-03-23"},
  {id:1476,apt:"Montg 1B",owner:"Elkins LT",name:"Courtney Smith",type:"short-stay",rent:439.28,balance:0,due:"2025-03-25",note:"Via: Booking | Tel: 7175710794",history:[{"date": "2025-03-20", "text": "$439.28 \u2014 stay (2025-03-20 \u2192 2025-03-25)"}],archived:true,archived_date:"2025-03-25"},
  {id:1477,apt:"Fox Chase  2",owner:"Fox Chase Properties",name:"Megan Hintz",type:"short-stay",rent:657.58,balance:0,due:"2025-03-31",note:"Via: Booking | Tel: 5044609945",history:[{"date": "2025-03-25", "text": "$657.58 \u2014 stay (2025-03-25 \u2192 2025-03-31)"}],archived:true,archived_date:"2025-03-31"},
  {id:1478,apt:"112",owner:"ERA LT",name:"Lavelle Cash",type:"long-term",rent:2400.0,balance:0,due:"2025-09-30",note:"Via: personal contact | Tel: (267) 432-8996 | Email: lavellecash@gmail.com",history:[{"date": "2023-03-01", "text": "$2,400 \u2014 monthly (est.)"}, {"date": "2023-04-01", "text": "$2,400 \u2014 monthly (est.)"}, {"date": "2023-05-01", "text": "$2,400 \u2014 monthly (est.)"}, {"date": "2023-06-01", "text": "$2,400 \u2014 monthly (est.)"}, {"date": "2023-07-01", "text": "$2,400 \u2014 monthly (est.)"}, {"date": "2023-08-01", "text": "$2,400 \u2014 monthly (est.)"}, {"date": "2023-09-01", "text": "$2,400 \u2014 monthly (est.)"}, {"date": "2023-10-01", "text": "$2,400 \u2014 monthly (est.)"}, {"date": "2023-11-01", "text": "$2,400 \u2014 monthly (est.)"}, {"date": "2023-12-01", "text": "$2,400 \u2014 monthly (est.)"}, {"date": "2024-01-01", "text": "$2,400 \u2014 monthly (est.)"}, {"date": "2024-02-01", "text": "$2,400 \u2014 monthly (est.)"}, {"date": "2024-03-01", "text": "$2,400 \u2014 monthly (est.)"}, {"date": "2024-04-01", "text": "$2,400 \u2014 monthly (est.)"}, {"date": "2024-05-01", "text": "$2,400 \u2014 monthly (est.)"}, {"date": "2024-06-01", "text": "$2,400 \u2014 monthly (est.)"}, {"date": "2024-07-01", "text": "$2,400 \u2014 monthly (est.)"}, {"date": "2024-08-01", "text": "$2,400 \u2014 monthly (est.)"}, {"date": "2024-09-01", "text": "$2,400 \u2014 monthly (est.)"}, {"date": "2024-10-01", "text": "$2,400 \u2014 monthly (est.)"}, {"date": "2024-11-01", "text": "$2,400 \u2014 monthly (est.)"}, {"date": "2024-12-01", "text": "$2,400 \u2014 monthly (est.)"}, {"date": "2025-01-01", "text": "$2,400 \u2014 monthly (est.)"}, {"date": "2025-02-01", "text": "$2,400 \u2014 monthly (est.)"}, {"date": "2025-03-01", "text": "$2,400 \u2014 monthly (est.)"}, {"date": "2025-04-01", "text": "$2,400 \u2014 monthly (est.)"}, {"date": "2025-05-01", "text": "$2,400 \u2014 monthly (est.)"}, {"date": "2025-06-01", "text": "$2,400 \u2014 monthly (est.)"}, {"date": "2025-07-01", "text": "$2,400 \u2014 monthly (est.)"}, {"date": "2025-08-01", "text": "$2,400 \u2014 monthly (est.)"}, {"date": "2025-09-01", "text": "$2,400 \u2014 monthly (est.)"}],archived:true,archived_date:"2025-09-30"},
  {id:1479,apt:"223",owner:"ERA LT",name:"Kiya Cash",type:"long-term",rent:1800.0,balance:0,due:"2026-03-31",note:"Tel: (215) 303-4854 | Email: kiyacash721@gmail.com",history:[{"date": "2024-04-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2024-05-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2024-06-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2024-07-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2024-08-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2024-09-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2024-10-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2024-11-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2024-12-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2025-01-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2025-02-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2025-03-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2025-04-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2025-05-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2025-06-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2025-07-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2025-08-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2025-09-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2025-10-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2025-11-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2025-12-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2026-01-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2026-02-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2026-03-01", "text": "$1,800 \u2014 monthly (est.)"}],archived:true,archived_date:"2026-03-31"},
  {id:1480,apt:"Montg 1B",owner:"Elkins LT",name:"Kristin Kalopitas",type:"short-stay",rent:580.4,balance:0,due:"2025-04-02",note:"Via: Booking | Tel: 4847958182",history:[{"date": "2025-03-26", "text": "$580.40 \u2014 stay (2025-03-26 \u2192 2025-04-02)"}],archived:true,archived_date:"2025-04-02"},
  {id:1481,apt:"Melrose B1",owner:"Melrose Properties",name:"Nino Khutsishvili",type:"short-stay",rent:895.23,balance:0,due:"2025-04-03",note:"Via: Booking | Tel: 551022277",history:[{"date": "2025-03-23", "text": "$895.23 \u2014 stay (2025-03-23 \u2192 2025-04-03)"}],archived:true,archived_date:"2025-04-03"},
  {id:1482,apt:"Montg 3",owner:"Elkins LT",name:"Natalie Graf",type:"short-stay",rent:744.14,balance:0,due:"2025-04-04",note:"Via: Airbnb | Tel: 2158508431",history:[{"date": "2025-03-25", "text": "$744.14 \u2014 stay (2025-03-25 \u2192 2025-04-04)"}],archived:true,archived_date:"2025-04-04"},
  {id:1483,apt:"Fox Chase  1",owner:"Fox Chase Properties",name:"Jessica Lynn Sanfilippo",type:"long-term",rent:1780.0,balance:0,due:"2025-04-30",note:"Via: Zillow | Tel: (412) 553-9232 | Email: jessicasanfilippo@gmail.com",history:[{"date": "2024-04-01", "text": "$1,780 \u2014 monthly (est.)"}, {"date": "2024-05-01", "text": "$1,780 \u2014 monthly (est.)"}, {"date": "2024-06-01", "text": "$1,780 \u2014 monthly (est.)"}, {"date": "2024-07-01", "text": "$1,780 \u2014 monthly (est.)"}, {"date": "2024-08-01", "text": "$1,780 \u2014 monthly (est.)"}, {"date": "2024-09-01", "text": "$1,780 \u2014 monthly (est.)"}, {"date": "2024-10-01", "text": "$1,780 \u2014 monthly (est.)"}, {"date": "2024-11-01", "text": "$1,780 \u2014 monthly (est.)"}, {"date": "2024-12-01", "text": "$1,780 \u2014 monthly (est.)"}, {"date": "2025-01-01", "text": "$1,780 \u2014 monthly (est.)"}, {"date": "2025-02-01", "text": "$1,780 \u2014 monthly (est.)"}, {"date": "2025-03-01", "text": "$1,780 \u2014 monthly (est.)"}, {"date": "2025-04-01", "text": "$1,780 \u2014 monthly (est.)"}],archived:true,archived_date:"2025-04-30"},
  {id:1484,apt:"Montg 9",owner:"Elkins LT",name:"Daniel Blum",type:"short-stay",rent:1430.05,balance:0,due:"2025-04-09",note:"Via: Airbnb | Tel: 2679750227",history:[{"date": "2025-03-21", "text": "$1,430.05 \u2014 stay (2025-03-21 \u2192 2025-04-09)"}],archived:true,archived_date:"2025-04-09"},
  {id:1485,apt:"317",owner:"ERA LT",name:"Kit Brallier",type:"short-stay",rent:2037.77,balance:0,due:"2025-04-13",note:"Via: Airbnb | Tel: 6155095203",history:[{"date": "2025-03-30", "text": "$2,037.77 \u2014 stay (2025-03-30 \u2192 2025-04-13)"}],archived:true,archived_date:"2025-04-13"},
  {id:1486,apt:"Montg 1B",owner:"Elkins LT",name:"Jean Howe",type:"short-stay",rent:686.0,balance:0,due:"2025-04-12",note:"Via: Booking | Tel: 81338573870",history:[{"date": "2025-04-03", "text": "$686.00 \u2014 stay (2025-04-03 \u2192 2025-04-12)"}],archived:true,archived_date:"2025-04-12"},
  {id:1487,apt:"210",owner:"ERA LT",name:"Nikia Sanders",type:"short-stay",rent:729.64,balance:0,due:"2025-04-13",note:"Via: Vrbo | Tel: 2158009445",history:[{"date": "2025-04-03", "text": "$729.64 \u2014 stay (2025-04-03 \u2192 2025-04-13)"}],archived:true,archived_date:"2025-04-13"},
  {id:1488,apt:"215",owner:"ERA LT",name:"Kegnide Arouna",type:"short-stay",rent:848.75,balance:0,due:"2025-04-11",note:"Via: Airbnb | Tel: 1 267-353-7374",history:[{"date": "2025-04-04", "text": "$848.75 \u2014 stay (2025-04-04 \u2192 2025-04-11)"}],archived:true,archived_date:"2025-04-11"},
  {id:1489,apt:"202",owner:"ERA LT",name:"James Coleman",type:"short-stay",rent:2747.1,balance:0,due:"2025-04-14",note:"Via: Vrbo | Tel: 2155277511 | Email: jimandchris11@verizon.net",history:[{"date": "2025-03-15", "text": "$2,747.10 \u2014 stay (2025-03-15 \u2192 2025-04-14)"}],archived:true,archived_date:"2025-04-14"},
  {id:1490,apt:"Melrose C1",owner:"Melrose Properties",name:"Paris Myers",type:"short-stay",rent:317.0,balance:0,due:"2025-04-14",note:"Via: Vrbo | Tel: 4452036289",history:[{"date": "2025-04-11", "text": "$317.00 \u2014 stay (2025-04-11 \u2192 2025-04-14)"}],archived:true,archived_date:"2025-04-14"},
  {id:1491,apt:"205",owner:"ERA LT",name:"Chao Sun",type:"short-stay",rent:2572.0,balance:0,due:"2025-04-17",note:"Via: Airbnb | Tel: 6262321262",history:[{"date": "2025-03-18", "text": "$2,572.00 \u2014 stay (2025-03-18 \u2192 2025-04-17)"}],archived:true,archived_date:"2025-04-17"},
  {id:1492,apt:"104",owner:"ERA LT",name:"Helena Coleman",type:"short-stay",rent:964.15,balance:0,due:"2025-04-22",note:"Via: Airbnb | Tel: 2159086192",history:[{"date": "2025-04-14", "text": "$964.15 \u2014 stay (2025-04-14 \u2192 2025-04-22)"}],archived:true,archived_date:"2025-04-22"},
  {id:1493,apt:"212",owner:"ERA LT",name:"Alexandera &#47;andrew",type:"short-stay",rent:1424.86,balance:0,due:"2025-04-18",note:"Via: Booking | Tel: 845275481",history:[{"date": "2025-04-05", "text": "$1,424.86 \u2014 stay (2025-04-05 \u2192 2025-04-18)"}],archived:true,archived_date:"2025-04-18"},
  {id:1494,apt:"Fox Chase  2",owner:"Fox Chase Properties",name:"Kevin Gibbons",type:"short-stay",rent:924.25,balance:0,due:"2025-04-21",note:"Via: Airbnb | Tel: 6782152406",history:[{"date": "2025-04-07", "text": "$924.25 \u2014 stay (2025-04-07 \u2192 2025-04-21)"}],archived:true,archived_date:"2025-04-21"},
  {id:1495,apt:"Montg 6",owner:"Elkins LT",name:"Sharon Embery",type:"short-stay",rent:1876.02,balance:0,due:"2025-04-20",note:"Via: Booking | Tel: 2673808143",history:[{"date": "2025-03-28", "text": "$1,876.02 \u2014 stay (2025-03-28 \u2192 2025-04-20)"}],archived:true,archived_date:"2025-04-20"},
  {id:1496,apt:"Montg 3",owner:"Elkins LT",name:"Yevhenii Blank",type:"short-stay",rent:1099.01,balance:0,due:"2025-04-16",note:"Via: Airbnb | Tel: 7282124606",history:[{"date": "2025-04-04", "text": "$1,099.01 \u2014 stay (2025-04-04 \u2192 2025-04-16)"}],archived:true,archived_date:"2025-04-16"},
  {id:1497,apt:"331",owner:"ERA LT",name:"Oliver Deal",type:"short-stay",rent:3192.27,balance:0,due:"2025-04-25",note:"Via: Airbnb | Tel: 8176813123",history:[{"date": "2025-03-31", "text": "$3,192.27 \u2014 stay (2025-03-31 \u2192 2025-04-25)"}],archived:true,archived_date:"2025-04-25"},
  {id:1498,apt:"Montg 1B",owner:"Elkins LT",name:"Jessica Zirbes",type:"short-stay",rent:686.0,balance:0,due:"2025-04-24",note:"Via: Booking | Tel: 15115341289",history:[{"date": "2025-04-15", "text": "$686.00 \u2014 stay (2025-04-15 \u2192 2025-04-24)"}],archived:true,archived_date:"2025-04-24"},
  {id:1499,apt:"225",owner:"ERA LT",name:"Fernando Pontes",type:"short-stay",rent:2536.55,balance:0,due:"2025-04-26",note:"Via: Booking | Tel: 61992002223",history:[{"date": "2025-03-29", "text": "$2,536.55 \u2014 stay (2025-03-29 \u2192 2025-04-26)"}],archived:true,archived_date:"2025-04-26"},
  {id:1500,apt:"Fox Chase  2",owner:"Fox Chase Properties",name:"Gvantsa Tsiklauri",type:"short-stay",rent:518.61,balance:0,due:"2025-04-26",note:"Via: Booking | Tel: 2679029100",history:[{"date": "2025-04-21", "text": "$518.61 \u2014 stay (2025-04-21 \u2192 2025-04-26)"}],archived:true,archived_date:"2025-04-26"},
  {id:1501,apt:"332",owner:"ERA LT",name:"Mersak Demi - 30 days notice on 2/27",type:"long-term",rent:2500.0,balance:0,due:"2025-02-28",note:"Via: Private | Tel: 6173884174 | Email: mdemi101@gmail.com",history:[{"date": "2022-02-01", "text": "$2,500 \u2014 monthly (est.)"}, {"date": "2022-03-01", "text": "$2,500 \u2014 monthly (est.)"}, {"date": "2022-04-01", "text": "$2,500 \u2014 monthly (est.)"}, {"date": "2022-05-01", "text": "$2,500 \u2014 monthly (est.)"}, {"date": "2022-06-01", "text": "$2,500 \u2014 monthly (est.)"}, {"date": "2022-07-01", "text": "$2,500 \u2014 monthly (est.)"}, {"date": "2022-08-01", "text": "$2,500 \u2014 monthly (est.)"}, {"date": "2022-09-01", "text": "$2,500 \u2014 monthly (est.)"}, {"date": "2022-10-01", "text": "$2,500 \u2014 monthly (est.)"}, {"date": "2022-11-01", "text": "$2,500 \u2014 monthly (est.)"}, {"date": "2022-12-01", "text": "$2,500 \u2014 monthly (est.)"}, {"date": "2023-01-01", "text": "$2,500 \u2014 monthly (est.)"}, {"date": "2023-02-01", "text": "$2,500 \u2014 monthly (est.)"}, {"date": "2023-03-01", "text": "$2,500 \u2014 monthly (est.)"}, {"date": "2023-04-01", "text": "$2,500 \u2014 monthly (est.)"}, {"date": "2023-05-01", "text": "$2,500 \u2014 monthly (est.)"}, {"date": "2023-06-01", "text": "$2,500 \u2014 monthly (est.)"}, {"date": "2023-07-01", "text": "$2,500 \u2014 monthly (est.)"}, {"date": "2023-08-01", "text": "$2,500 \u2014 monthly (est.)"}, {"date": "2023-09-01", "text": "$2,500 \u2014 monthly (est.)"}, {"date": "2023-10-01", "text": "$2,500 \u2014 monthly (est.)"}, {"date": "2023-11-01", "text": "$2,500 \u2014 monthly (est.)"}, {"date": "2023-12-01", "text": "$2,500 \u2014 monthly (est.)"}, {"date": "2024-01-01", "text": "$2,500 \u2014 monthly (est.)"}, {"date": "2024-02-01", "text": "$2,500 \u2014 monthly (est.)"}, {"date": "2024-03-01", "text": "$2,500 \u2014 monthly (est.)"}, {"date": "2024-04-01", "text": "$2,500 \u2014 monthly (est.)"}, {"date": "2024-05-01", "text": "$2,500 \u2014 monthly (est.)"}, {"date": "2024-06-01", "text": "$2,500 \u2014 monthly (est.)"}, {"date": "2024-07-01", "text": "$2,500 \u2014 monthly (est.)"}, {"date": "2024-08-01", "text": "$2,500 \u2014 monthly (est.)"}, {"date": "2024-09-01", "text": "$2,500 \u2014 monthly (est.)"}, {"date": "2024-10-01", "text": "$2,500 \u2014 monthly (est.)"}, {"date": "2024-11-01", "text": "$2,500 \u2014 monthly (est.)"}, {"date": "2024-12-01", "text": "$2,500 \u2014 monthly (est.)"}, {"date": "2025-01-01", "text": "$2,500 \u2014 monthly (est.)"}],archived:true,archived_date:"2025-02-28"},
  {id:1502,apt:"Melrose B1",owner:"Melrose Properties",name:"Alison Duda",type:"short-stay",rent:1926.15,balance:0,due:"2025-04-30",note:"Via: Airbnb | Tel: 6032053164",history:[{"date": "2025-04-05", "text": "$1,926.15 \u2014 stay (2025-04-05 \u2192 2025-04-30)"}],archived:true,archived_date:"2025-04-30"},
  {id:1503,apt:"104",owner:"ERA LT",name:"Essence Boynes",type:"short-stay",rent:987.88,balance:0,due:"2025-05-02",note:"Via: Airbnb | Tel: 2672078515 | Email: Bynsjr@yahoo.com",history:[{"date": "2025-04-25", "text": "$987.88 \u2014 stay (2025-04-25 \u2192 2025-05-02)"}],archived:true,archived_date:"2025-05-02"},
  {id:1504,apt:"Keswick 3A",owner:"Keswick Properties",name:"Jacob Timothy",type:"long-term",rent:5695.06,balance:0,due:"2025-05-03",note:"Via: Airbnb | Tel: 8147226180",history:[{"date": "2025-02-01", "text": "$5,695 \u2014 monthly (est.)"}, {"date": "2025-03-01", "text": "$5,695 \u2014 monthly (est.)"}, {"date": "2025-04-01", "text": "$5,695 \u2014 monthly (est.)"}, {"date": "2025-05-01", "text": "$5,695 \u2014 monthly (est.)"}],archived:true,archived_date:"2025-05-03"},
  {id:1505,apt:"Montg 4",owner:"Elkins LT",name:"Skyler Fehnel",type:"long-term",rent:1900.0,balance:0,due:"2025-04-30",note:"Via: FF | Tel: (484) 695-9750 | Email: skyler.fehnel@gmail.com",history:[{"date": "2024-12-01", "text": "$1,900 \u2014 monthly (est.)"}, {"date": "2025-01-01", "text": "$1,900 \u2014 monthly (est.)"}, {"date": "2025-02-01", "text": "$1,900 \u2014 monthly (est.)"}, {"date": "2025-03-01", "text": "$1,900 \u2014 monthly (est.)"}, {"date": "2025-04-01", "text": "$1,900 \u2014 monthly (est.)"}],archived:true,archived_date:"2025-04-30"},
  {id:1506,apt:"202",owner:"ERA LT",name:"Charles Reed",type:"short-stay",rent:1102.41,balance:0,due:"2025-05-06",note:"Via: Airbnb | Tel: 8109190420",history:[{"date": "2025-04-27", "text": "$1,102.41 \u2014 stay (2025-04-27 \u2192 2025-05-06)"}],archived:true,archived_date:"2025-05-06"},
  {id:1507,apt:"317",owner:"ERA LT",name:"Willie Singletary",type:"short-stay",rent:2417.2,balance:0,due:"2025-05-07",note:"Via: Booking | Tel: 4458006266",history:[{"date": "2025-04-17", "text": "$2,417.20 \u2014 stay (2025-04-17 \u2192 2025-05-07)"}],archived:true,archived_date:"2025-05-07"},
  {id:1508,apt:"Montg 1",owner:"Elkins LT",name:"Charlene Tate",type:"short-stay",rent:1080.15,balance:0,due:"2025-04-30",note:"Via: Airbnb | Tel: (610) 620-0325",history:[{"date": "2025-02-11", "text": "$1,080.15 \u2014 stay (2025-02-11 \u2192 2025-04-30)"}],archived:true,archived_date:"2025-04-30"},
  {id:1509,apt:"221",owner:"ERA LT",name:"Medina Medina",type:"long-term",rent:1905.27,balance:0,due:"2025-05-08",note:"Tel: 3236375053",history:[{"date": "2025-04-01", "text": "$1,905 \u2014 monthly (est.)"}, {"date": "2025-05-01", "text": "$1,905 \u2014 monthly (est.)"}],archived:true,archived_date:"2025-05-08"},
  {id:1510,apt:"426-2",owner:"ERA LT",name:"Piper J. Metz",type:"long-term",rent:1350.0,balance:0,due:"2025-05-01",note:"Via: Zillow | Email: piperjacquelyn@gmail.com",history:[{"date": "2023-05-01", "text": "$1,350 \u2014 monthly (est.)"}, {"date": "2023-06-01", "text": "$1,350 \u2014 monthly (est.)"}, {"date": "2023-07-01", "text": "$1,350 \u2014 monthly (est.)"}, {"date": "2023-08-01", "text": "$1,350 \u2014 monthly (est.)"}, {"date": "2023-09-01", "text": "$1,350 \u2014 monthly (est.)"}, {"date": "2023-10-01", "text": "$1,350 \u2014 monthly (est.)"}, {"date": "2023-11-01", "text": "$1,350 \u2014 monthly (est.)"}, {"date": "2023-12-01", "text": "$1,350 \u2014 monthly (est.)"}, {"date": "2024-01-01", "text": "$1,350 \u2014 monthly (est.)"}, {"date": "2024-02-01", "text": "$1,350 \u2014 monthly (est.)"}, {"date": "2024-03-01", "text": "$1,350 \u2014 monthly (est.)"}, {"date": "2024-04-01", "text": "$1,350 \u2014 monthly (est.)"}, {"date": "2024-05-01", "text": "$1,350 \u2014 monthly (est.)"}, {"date": "2024-06-01", "text": "$1,350 \u2014 monthly (est.)"}, {"date": "2024-07-01", "text": "$1,350 \u2014 monthly (est.)"}, {"date": "2024-08-01", "text": "$1,350 \u2014 monthly (est.)"}, {"date": "2024-09-01", "text": "$1,350 \u2014 monthly (est.)"}, {"date": "2024-10-01", "text": "$1,350 \u2014 monthly (est.)"}, {"date": "2024-11-01", "text": "$1,350 \u2014 monthly (est.)"}, {"date": "2024-12-01", "text": "$1,350 \u2014 monthly (est.)"}, {"date": "2025-01-01", "text": "$1,350 \u2014 monthly (est.)"}, {"date": "2025-02-01", "text": "$1,350 \u2014 monthly (est.)"}, {"date": "2025-03-01", "text": "$1,350 \u2014 monthly (est.)"}, {"date": "2025-04-01", "text": "$1,350 \u2014 monthly (est.)"}, {"date": "2025-05-01", "text": "$1,350 \u2014 monthly (est.)"}],archived:true,archived_date:"2025-05-01"},
  {id:1511,apt:"Melrose A2",owner:"Melrose Properties",name:"Oleksandr Zozulia",type:"long-term",rent:1600.0,balance:0,due:"2025-05-09",note:"Via: facebook | Tel: (215) 986-7392 | Email: alex.zozulia009@gmail.com",history:[{"date": "2024-11-01", "text": "$1,600 \u2014 monthly (est.)"}, {"date": "2024-12-01", "text": "$1,600 \u2014 monthly (est.)"}, {"date": "2025-01-01", "text": "$1,600 \u2014 monthly (est.)"}, {"date": "2025-02-01", "text": "$1,600 \u2014 monthly (est.)"}, {"date": "2025-03-01", "text": "$1,600 \u2014 monthly (est.)"}, {"date": "2025-04-01", "text": "$1,600 \u2014 monthly (est.)"}, {"date": "2025-05-01", "text": "$1,600 \u2014 monthly (est.)"}],archived:true,archived_date:"2025-05-09"},
  {id:1512,apt:"Montg Studio B",owner:"Elkins LT",name:"Anastasiia Batiukina",type:"long-term",rent:1100.0,balance:0,due:"2025-11-30",note:"Via: facebook | Tel: (917) 907-1572 | Email: stacy07770@gmail.com",history:[{"date": "2024-12-01", "text": "$1,100 \u2014 monthly (est.)"}, {"date": "2025-01-01", "text": "$1,100 \u2014 monthly (est.)"}, {"date": "2025-02-01", "text": "$1,100 \u2014 monthly (est.)"}, {"date": "2025-03-01", "text": "$1,100 \u2014 monthly (est.)"}, {"date": "2025-04-01", "text": "$1,100 \u2014 monthly (est.)"}, {"date": "2025-05-01", "text": "$1,100 \u2014 monthly (est.)"}, {"date": "2025-06-01", "text": "$1,100 \u2014 monthly (est.)"}, {"date": "2025-07-01", "text": "$1,100 \u2014 monthly (est.)"}, {"date": "2025-08-01", "text": "$1,100 \u2014 monthly (est.)"}, {"date": "2025-09-01", "text": "$1,100 \u2014 monthly (est.)"}, {"date": "2025-10-01", "text": "$1,100 \u2014 monthly (est.)"}, {"date": "2025-11-01", "text": "$1,100 \u2014 monthly (est.)"}],archived:true,archived_date:"2025-11-30"},
  {id:1513,apt:"Keswick 2B",owner:"Keswick Properties",name:"Caitlin Teresa Mcnamee",type:"short-stay",rent:2460.23,balance:0,due:"2025-05-13",note:"Via: Airbnb | Tel: 2152600347",history:[{"date": "2025-03-13", "text": "$2,460.23 \u2014 stay (2025-03-13 \u2192 2025-05-13)"}],archived:true,archived_date:"2025-05-13"},
  {id:1514,apt:"Melrose B1",owner:"Melrose Properties",name:"Asia Henry",type:"short-stay",rent:888.66,balance:0,due:"2025-05-13",note:"Via: Airbnb | Tel: 2672682550",history:[{"date": "2025-05-02", "text": "$888.66 \u2014 stay (2025-05-02 \u2192 2025-05-13)"}],archived:true,archived_date:"2025-05-13"},
  {id:1515,apt:"Montg 4",owner:"Elkins LT",name:"Ketiri Yacine",type:"short-stay",rent:875.9,balance:0,due:"2025-05-14",note:"Via: Booking | Tel: 12153913437 | Email: Ketiriyacine7@gmail.com",history:[{"date": "2025-04-30", "text": "$875.90 \u2014 stay (2025-04-30 \u2192 2025-05-14)"}],archived:true,archived_date:"2025-05-14"},
  {id:1516,apt:"317",owner:"ERA LT",name:"Christopher Whiten",type:"short-stay",rent:1150.73,balance:0,due:"2025-05-15",note:"Via: Airbnb | Tel: 6026964545",history:[{"date": "2025-05-08", "text": "$1,150.73 \u2014 stay (2025-05-08 \u2192 2025-05-15)"}],archived:true,archived_date:"2025-05-15"},
  {id:1517,apt:"318",owner:"ERA LT",name:"Holly Solomon",type:"short-stay",rent:3105.95,balance:0,due:"2025-05-17",note:"Via: Airbnb | Tel: 2673577758",history:[{"date": "2025-04-19", "text": "$3,105.95 \u2014 stay (2025-04-19 \u2192 2025-05-17)"}],archived:true,archived_date:"2025-05-17"},
  {id:1518,apt:"208",owner:"ERA LT",name:"Syidah Singleton",type:"long-term",rent:878.95,balance:0,due:"2025-05-20",note:"Via: Airbnb | Tel: 4452956640",history:[{"date": "2024-09-01", "text": "$879 \u2014 monthly (est.)"}, {"date": "2024-10-01", "text": "$879 \u2014 monthly (est.)"}, {"date": "2024-11-01", "text": "$879 \u2014 monthly (est.)"}, {"date": "2024-12-01", "text": "$879 \u2014 monthly (est.)"}, {"date": "2025-01-01", "text": "$879 \u2014 monthly (est.)"}, {"date": "2025-02-01", "text": "$879 \u2014 monthly (est.)"}, {"date": "2025-03-01", "text": "$879 \u2014 monthly (est.)"}, {"date": "2025-04-01", "text": "$879 \u2014 monthly (est.)"}, {"date": "2025-05-01", "text": "$879 \u2014 monthly (est.)"}],archived:true,archived_date:"2025-05-20"},
  {id:1519,apt:"221",owner:"ERA LT",name:"Diya Viswanathan",type:"short-stay",rent:1272.77,balance:0,due:"2025-05-25",note:"Via: Airbnb | Tel: 8136132430 | Email: diyaviswanathan@gmail.com",history:[{"date": "2025-05-11", "text": "$1,272.77 \u2014 stay (2025-05-11 \u2192 2025-05-25)"}],archived:true,archived_date:"2025-05-25"},
  {id:1520,apt:"Montg 4",owner:"Elkins LT",name:"Gabriel López Alicea",type:"short-stay",rent:846.6,balance:0,due:"2025-05-22",note:"Via: Airbnb | Tel: 7872341002 | Email: cocotercel@gmail.com",history:[{"date": "2025-05-14", "text": "$846.60 \u2014 stay (2025-05-14 \u2192 2025-05-22)"}],archived:true,archived_date:"2025-05-22"},
  {id:1521,apt:"331",owner:"ERA LT",name:"Kegnide Arouna",type:"short-stay",rent:914.54,balance:0,due:"2025-05-23",note:"Via: Airbnb | Tel: 12673537374 | Email: Arounaosseni@yahoo.fr",history:[{"date": "2025-05-15", "text": "$914.54 \u2014 stay (2025-05-15 \u2192 2025-05-23)"}],archived:true,archived_date:"2025-05-23"},
  {id:1522,apt:"Montg 6",owner:"Elkins LT",name:"Terrence Bishop",type:"short-stay",rent:695.61,balance:0,due:"2025-05-23",note:"Via: Airbnb | Tel: 2156172287",history:[{"date": "2025-05-16", "text": "$695.61 \u2014 stay (2025-05-16 \u2192 2025-05-23)"}],archived:true,archived_date:"2025-05-23"},
  {id:1523,apt:"202",owner:"ERA LT",name:"Arline Sprau",type:"short-stay",rent:1014.84,balance:0,due:"2025-05-25",note:"Via: Airbnb | Tel: 17654126116 | Email: Jaelrox@yahoo.com",history:[{"date": "2025-05-18", "text": "$1,014.84 \u2014 stay (2025-05-18 \u2192 2025-05-25)"}],archived:true,archived_date:"2025-05-25"},
  {id:1524,apt:"Montg 1",owner:"Elkins LT",name:"Lisa Moss",type:"short-stay",rent:1439.76,balance:0,due:"2025-05-25",note:"Via: Airbnb | Tel: 12159906685 | Email: Mossquick@yahoo.com",history:[{"date": "2025-05-10", "text": "$1,439.76 \u2014 stay (2025-05-10 \u2192 2025-05-25)"}],archived:true,archived_date:"2025-05-25"},
  {id:1525,apt:"318",owner:"ERA LT",name:"Makeithia Daniels",type:"short-stay",rent:969.55,balance:0,due:"2025-05-25",note:"Via: Airbnb | Tel: 13347978464 | Email: gaponsite@focusjobs.com",history:[{"date": "2025-05-18", "text": "$969.55 \u2014 stay (2025-05-18 \u2192 2025-05-25)"}],archived:true,archived_date:"2025-05-25"},
  {id:1526,apt:"317",owner:"ERA LT",name:"Sixta Rubio",type:"short-stay",rent:1342.7,balance:0,due:"2025-05-25",note:"Via: Airbnb | Tel: 50761369122 | Email: andrearesposito@gmail.com",history:[{"date": "2025-05-15", "text": "$1,342.70 \u2014 stay (2025-05-15 \u2192 2025-05-25)"}],archived:true,archived_date:"2025-05-25"},
  {id:1527,apt:"Keswick 3A",owner:"Keswick Properties",name:"Mark Long",type:"short-stay",rent:1633.24,balance:0,due:"2025-05-25",note:"Via: Airbnb | Tel: 12159138771 | Email: djnaz2016@gmail.com",history:[{"date": "2025-05-04", "text": "$1,633.24 \u2014 stay (2025-05-04 \u2192 2025-05-25)"}],archived:true,archived_date:"2025-05-25"},
  {id:1528,apt:"Montg 4",owner:"Elkins LT",name:"Jessica Fleurimond",type:"short-stay",rent:809.24,balance:0,due:"2025-05-31",note:"Via: Airbnb | Tel: 12672167899 | Email: Jessica.Fleurimond@Gmail.com",history:[{"date": "2025-05-23", "text": "$809.24 \u2014 stay (2025-05-23 \u2192 2025-05-31)"}],archived:true,archived_date:"2025-05-31"},
  {id:1529,apt:"330",owner:"ERA LT",name:"Callum Martin",type:"short-stay",rent:2038.0,balance:0,due:"2025-05-31",note:"Via: Airbnb | Tel: 7425886225 | Email: marialochhead1@outlook.com",history:[{"date": "2025-04-27", "text": "$2,038.00 \u2014 stay (2025-04-27 \u2192 2025-05-31)"}],archived:true,archived_date:"2025-05-31"},
  {id:1530,apt:"Keswick 2B",owner:"Keswick Properties",name:"Billy Boylan",type:"short-stay",rent:1566.81,balance:0,due:"2025-05-31",note:"Via: Airbnb | Tel: 6098464603 | Email: billyboylan13@gmail.com",history:[{"date": "2025-05-14", "text": "$1,566.81 \u2014 stay (2025-05-14 \u2192 2025-05-31)"}],archived:true,archived_date:"2025-05-31"},
  {id:1531,apt:"221",owner:"ERA LT",name:"Gauthier David",type:"short-stay",rent:1218.96,balance:0,due:"2025-06-01",note:"Via: Booking | Tel: 4076396756 | Email: davidjamesdismas@gmail.com",history:[{"date": "2025-05-21", "text": "$1,218.96 \u2014 stay (2025-05-21 \u2192 2025-06-01)"}],archived:true,archived_date:"2025-06-01"},
  {id:1532,apt:"208",owner:"ERA LT",name:"Farid Salazar",type:"short-stay",rent:2300.59,balance:0,due:"2025-06-02",note:"Via: Airbnb | Tel: 3057263116 | Email: pamelarios139@gmail.com",history:[{"date": "2025-05-13", "text": "$2,300.59 \u2014 stay (2025-05-13 \u2192 2025-06-02)"}],archived:true,archived_date:"2025-06-02"},
  {id:1533,apt:"223",owner:"ERA LT",name:"Lashayna Taylor",type:"short-stay",rent:558.65,balance:0,due:"2025-06-02",note:"Via: Airbnb | Tel: 12672059122 | Email: Mslatee@yahoo.com",history:[{"date": "2025-05-05", "text": "$558.65 \u2014 stay (2025-05-05 \u2192 2025-06-02)"}],archived:true,archived_date:"2025-06-02"},
  {id:1534,apt:"Melrose B1",owner:"Melrose Properties",name:"Timothy Nguyen",type:"short-stay",rent:1207.45,balance:0,due:"2025-06-01",note:"Via: Airbnb | Tel: 2678369784 | Email: tensionmaru@gmail.com",history:[{"date": "2025-05-17", "text": "$1,207.45 \u2014 stay (2025-05-17 \u2192 2025-06-01)"}],archived:true,archived_date:"2025-06-01"},
  {id:1535,apt:"225",owner:"ERA LT",name:"Venkata Thota",type:"short-stay",rent:2762.49,balance:0,due:"2025-06-07",note:"Via: Airbnb | Tel: 4692032220",history:[{"date": "2025-05-04", "text": "$2,762.49 \u2014 stay (2025-05-04 \u2192 2025-06-07)"}],archived:true,archived_date:"2025-06-07"},
  {id:1536,apt:"Montg 3",owner:"Elkins LT",name:"Nicholas Solt",type:"short-stay",rent:2363.64,balance:0,due:"2025-06-06",note:"Via: Airbnb | Tel: 4129771507 | Email: solt24nick@yahoo.com",history:[{"date": "2025-04-21", "text": "$2,363.64 \u2014 stay (2025-04-21 \u2192 2025-06-06)"}],archived:true,archived_date:"2025-06-06"},
  {id:1537,apt:"318",owner:"ERA LT",name:"Stephen Langan",type:"short-stay",rent:1618.18,balance:0,due:"2025-06-09",note:"Via: Airbnb | Tel: 15204299043 | Email: cedric@dvlt.ai",history:[{"date": "2025-05-27", "text": "$1,618.18 \u2014 stay (2025-05-27 \u2192 2025-06-09)"}],archived:true,archived_date:"2025-06-09"},
  {id:1538,apt:"332",owner:"ERA LT",name:"David Balshukat",type:"short-stay",rent:3645.6,balance:0,due:"2025-06-08",note:"Via: Airbnb | Tel: 12156309724 | Email: mmerena94@gmail.com",history:[{"date": "2025-05-11", "text": "$3,645.60 \u2014 stay (2025-05-11 \u2192 2025-06-08)"}],archived:true,archived_date:"2025-06-08"},
  {id:1539,apt:"320",owner:"ERA LT",name:"Osama Elhassan",type:"month-to-month",rent:1800.0,balance:0,due:"",note:"Via: FF | Tel: (267) 279-8555 | Email: salahhashimfba@gmail.com",history:[{"date": "2025-01-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2025-02-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2025-03-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2025-04-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2025-05-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2025-06-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2025-07-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2025-08-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2025-09-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2025-10-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2025-11-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2025-12-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2026-01-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2026-02-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2026-03-01", "text": "$1,800 \u2014 monthly (est.)"}],archived:true,archived_date:"2025-01-06"},
  {id:1540,apt:"202",owner:"ERA LT",name:"Joshua Coates",type:"short-stay",rent:721.71,balance:0,due:"2025-06-10",note:"Via: Airbnb | Tel: 3232511069 | Email: Dave@davemanzo.com",history:[{"date": "2025-06-04", "text": "$721.71 \u2014 stay (2025-06-04 \u2192 2025-06-10)"}],archived:true,archived_date:"2025-06-10"},
  {id:1541,apt:"Fox Chase  1",owner:"Fox Chase Properties",name:"Alexa Henry",type:"short-stay",rent:5097.01,balance:0,due:"2025-06-09",note:"Via: Vrbo | Tel: 4847935604 | Email: ahenry970@gmail.com",history:[{"date": "2025-04-14", "text": "$5,097.01 \u2014 stay (2025-04-14 \u2192 2025-06-09)"}],archived:true,archived_date:"2025-06-09"},
  {id:1542,apt:"Keswick 3A",owner:"Keswick Properties",name:"Adrienne Branch",type:"short-stay",rent:1542.65,balance:0,due:"2025-06-15",note:"Via: Airbnb | Tel: 2152371293 | Email: Arbranch1978@gmail.com",history:[{"date": "2025-05-25", "text": "$1,542.65 \u2014 stay (2025-05-25 \u2192 2025-06-15)"}],archived:true,archived_date:"2025-06-15"},
  {id:1543,apt:"Keswick 2B",owner:"Keswick Properties",name:"John Cabrera",type:"short-stay",rent:642.77,balance:0,due:"2025-06-13",note:"Via: Airbnb | Tel: 4848383146",history:[{"date": "2025-05-31", "text": "$642.77 \u2014 stay (2025-05-31 \u2192 2025-06-13)"}],archived:true,archived_date:"2025-06-13"},
  {id:1544,apt:"Melrose A2",owner:"Melrose Properties",name:"Collette Grant",type:"short-stay",rent:533.65,balance:0,due:"2025-06-11",note:"Via: Booking | Tel: 12673239799 | Email: Aquam.919@gmail.com",history:[{"date": "2025-05-23", "text": "$533.65 \u2014 stay (2025-05-23 \u2192 2025-06-11)"}],archived:true,archived_date:"2025-06-11"},
  {id:1545,apt:"426-2",owner:"ERA LT",name:"Stephanie Banks",type:"short-stay",rent:2310.83,balance:0,due:"2025-07-01",note:"Via: Airbnb | Tel: 4103532106 | Email: Scbanks25@gmail.com",history:[{"date": "2025-06-02", "text": "$2,310.83 \u2014 stay (2025-06-02 \u2192 2025-07-01)"}],archived:true,archived_date:"2025-07-01"},
  {id:1546,apt:"212",owner:"ERA LT",name:"Ennis Avila",type:"short-stay",rent:3799.53,balance:0,due:"2025-06-14",note:"Via: Airbnb | Tel: 3238125171",history:[{"date": "2025-04-29", "text": "$3,799.53 \u2014 stay (2025-04-29 \u2192 2025-06-14)"}],archived:true,archived_date:"2025-06-14"},
  {id:1547,apt:"Melrose C1",owner:"Melrose Properties",name:"Aaron Maclennan",type:"short-stay",rent:2369.56,balance:0,due:"2025-06-12",note:"Via: Booking | Tel: 2157402194",history:[{"date": "2025-04-21", "text": "$2,369.56 \u2014 stay (2025-04-21 \u2192 2025-06-12)"}],archived:true,archived_date:"2025-06-12"},
  {id:1548,apt:"Keswick Store",owner:"Keswick Properties",name:"Hamid Rehman",type:"long-term",rent:1800.0,balance:0,due:"2026-01-02",note:"Via: facebook | Tel: (267) 315-8273 | Email: hamidreh@outlook.com",history:[{"date": "2025-01-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2025-02-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2025-03-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2025-04-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2025-05-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2025-06-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2025-07-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2025-08-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2025-09-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2025-10-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2025-11-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2025-12-01", "text": "$1,800 \u2014 monthly (est.)"}, {"date": "2026-01-01", "text": "$1,800 \u2014 monthly (est.)"}],archived:true,archived_date:"2026-01-02"},
  {id:1549,apt:"112",owner:"ERA LT",name:"Alejandro Hernandez",type:"short-stay",rent:3623.92,balance:0,due:"2025-06-15",note:"Via: Airbnb | Tel: 9562663165 | Email: Pkmtraineralex@hotmail.com",history:[{"date": "2025-05-15", "text": "$3,623.92 \u2014 stay (2025-05-15 \u2192 2025-06-15)"}],archived:true,archived_date:"2025-06-15"},
  {id:1550,apt:"Fox Chase  1",owner:"Fox Chase Properties",name:"Kathleen Mendez",type:"short-stay",rent:733.36,balance:0,due:"2025-06-19",note:"Via: Airbnb | Tel: 12673340948 | Email: Yelrahzenem@gmail.com",history:[{"date": "2025-06-12", "text": "$733.36 \u2014 stay (2025-06-12 \u2192 2025-06-19)"}],archived:true,archived_date:"2025-06-19"},
  {id:1551,apt:"223",owner:"ERA LT",name:"Richard Hogan",type:"short-stay",rent:857.88,balance:0,due:"2025-06-20",note:"Via: Booking | Tel: 6174702661",history:[{"date": "2025-06-01", "text": "$857.88 \u2014 stay (2025-06-01 \u2192 2025-06-20)"}],archived:true,archived_date:"2025-06-20"},
  {id:1552,apt:"202",owner:"ERA LT",name:"Myriam Robinson",type:"short-stay",rent:1217.0,balance:0,due:"2025-06-20",note:"Via: Vrbo | Tel: 2675289017 | Email: msrobsr@gmail.com",history:[{"date": "2025-06-10", "text": "$1,217.00 \u2014 stay (2025-06-10 \u2192 2025-06-20)"}],archived:true,archived_date:"2025-06-20"},
  {id:1553,apt:"205",owner:"ERA LT",name:"Decent Woodz",type:"short-stay",rent:1924.68,balance:0,due:"2025-06-21",note:"Via: Airbnb | Tel: 2672352137",history:[{"date": "2025-04-23", "text": "$1,924.68 \u2014 stay (2025-04-23 \u2192 2025-06-21)"}],archived:true,archived_date:"2025-06-21"},
  {id:1554,apt:"212",owner:"ERA LT",name:"Abdelmejid Saied",type:"short-stay",rent:1194.0,balance:0,due:"2025-06-23",note:"Via: Booking | Tel: 5145786042",history:[{"date": "2025-06-13", "text": "$1,194.00 \u2014 stay (2025-06-13 \u2192 2025-06-23)"}],archived:true,archived_date:"2025-06-23"},
  {id:1555,apt:"205",owner:"ERA LT",name:"Abdelmejid Saied",type:"short-stay",rent:1194.0,balance:0,due:"2025-06-25",note:"Via: Booking | Tel: 5145786042",history:[{"date": "2025-06-23", "text": "$1,194.00 \u2014 stay (2025-06-23 \u2192 2025-06-25)"}],archived:true,archived_date:"2025-06-25"},
  {id:1556,apt:"219",owner:"ERA LT",name:"Tornike Magradze",type:"long-term",rent:1750.0,balance:0,due:"2025-06-30",note:"Via: facebook | Tel: (330) 330-1553",history:[{"date": "2024-07-01", "text": "$1,750 \u2014 monthly (est.)"}, {"date": "2024-08-01", "text": "$1,750 \u2014 monthly (est.)"}, {"date": "2024-09-01", "text": "$1,750 \u2014 monthly (est.)"}, {"date": "2024-10-01", "text": "$1,750 \u2014 monthly (est.)"}, {"date": "2024-11-01", "text": "$1,750 \u2014 monthly (est.)"}, {"date": "2024-12-01", "text": "$1,750 \u2014 monthly (est.)"}, {"date": "2025-01-01", "text": "$1,750 \u2014 monthly (est.)"}, {"date": "2025-02-01", "text": "$1,750 \u2014 monthly (est.)"}, {"date": "2025-03-01", "text": "$1,750 \u2014 monthly (est.)"}, {"date": "2025-04-01", "text": "$1,750 \u2014 monthly (est.)"}, {"date": "2025-05-01", "text": "$1,750 \u2014 monthly (est.)"}, {"date": "2025-06-01", "text": "$1,750 \u2014 monthly (est.)"}],archived:true,archived_date:"2025-06-30"},
  {id:1557,apt:"Montg 1",owner:"Elkins LT",name:"Kimberly Blondo",type:"short-stay",rent:2670.41,balance:0,due:"2025-06-27",note:"Via: Airbnb | Tel: 15703697376 | Email: Brianblondo@yahoo.com",history:[{"date": "2025-05-27", "text": "$2,670.41 \u2014 stay (2025-05-27 \u2192 2025-06-27)"}],archived:true,archived_date:"2025-06-27"},
  {id:1558,apt:"Melrose B1",owner:"Melrose Properties",name:"Shira Gonen",type:"short-stay",rent:2439.22,balance:0,due:"2025-06-30",note:"Via: Airbnb | Tel: 16293177329 | Email: Gonen.s167@gmail.com",history:[{"date": "2025-06-04", "text": "$2,439.22 \u2014 stay (2025-06-04 \u2192 2025-06-30)"}],archived:true,archived_date:"2025-06-30"},
  {id:1559,apt:"223",owner:"ERA LT",name:"Vadim Chariev",type:"short-stay",rent:983.57,balance:0,due:"2025-06-30",note:"Via: Airbnb | Tel: 4159647297 | Email: vchariev@gmail.com",history:[{"date": "2025-06-21", "text": "$983.57 \u2014 stay (2025-06-21 \u2192 2025-06-30)"}],archived:true,archived_date:"2025-06-30"},
  {id:1560,apt:"320",owner:"ERA LT",name:"Hannah Mabey",type:"short-stay",rent:2379.97,balance:0,due:"2025-06-30",note:"Via: Airbnb | Tel: 9738201786 | Email: Hannahmabey01@gmail.com",history:[{"date": "2025-05-31", "text": "$2,379.97 \u2014 stay (2025-05-31 \u2192 2025-06-30)"}],archived:true,archived_date:"2025-06-30"},
  {id:1561,apt:"331",owner:"ERA LT",name:"Malika Lewis",type:"short-stay",rent:3065.31,balance:0,due:"2025-06-29",note:"Via: Booking | Tel: 19257309015",history:[{"date": "2025-05-23", "text": "$3,065.31 \u2014 stay (2025-05-23 \u2192 2025-06-29)"}],archived:true,archived_date:"2025-06-29"},
  {id:1562,apt:"230",owner:"ERA LT",name:"Olena Inshyna",type:"long-term",rent:1750.0,balance:0,due:"2025-08-31",note:"Via: facebook | Tel: (215) 939-4678 | Email: inshynaelena2406@gmail.com",history:[{"date": "2024-08-01", "text": "$1,750 \u2014 monthly (est.)"}, {"date": "2024-09-01", "text": "$1,750 \u2014 monthly (est.)"}, {"date": "2024-10-01", "text": "$1,750 \u2014 monthly (est.)"}, {"date": "2024-11-01", "text": "$1,750 \u2014 monthly (est.)"}, {"date": "2024-12-01", "text": "$1,750 \u2014 monthly (est.)"}, {"date": "2025-01-01", "text": "$1,750 \u2014 monthly (est.)"}, {"date": "2025-02-01", "text": "$1,750 \u2014 monthly (est.)"}, {"date": "2025-03-01", "text": "$1,750 \u2014 monthly (est.)"}, {"date": "2025-04-01", "text": "$1,750 \u2014 monthly (est.)"}, {"date": "2025-05-01", "text": "$1,750 \u2014 monthly (est.)"}, {"date": "2025-06-01", "text": "$1,750 \u2014 monthly (est.)"}, {"date": "2025-07-01", "text": "$1,750 \u2014 monthly (est.)"}, {"date": "2025-08-01", "text": "$1,750 \u2014 monthly (est.)"}],archived:true,archived_date:"2025-08-31"},
  {id:1563,apt:"Keswick 2B",owner:"Keswick Properties",name:"Sara S",type:"short-stay",rent:1322.27,balance:0,due:"2025-06-23",note:"Via: Booking | Tel: 4077760366 | Email: saleemkrichi@gmail.com",history:[{"date": "2025-06-16", "text": "$1,322.27 \u2014 stay (2025-06-16 \u2192 2025-06-23)"}],archived:true,archived_date:"2025-06-23"},
  {id:1564,apt:"Keswick 3A",owner:"Keswick Properties",name:"Audra Didzbalis",type:"short-stay",rent:718.26,balance:0,due:"1025-06-21",note:"Via: Airbnb | Tel: 7329666086 | Email: audra.didzbalis95@gmail.com",history:[{"date": "2025-06-14", "text": "$718.26 \u2014 stay (2025-06-14 \u2192 1025-06-21)"}],archived:true,archived_date:"1025-06-21"},
  {id:1565,apt:"212",owner:"ERA LT",name:"Charlotte Mcivor",type:"short-stay",rent:915.56,balance:0,due:"2025-06-30",note:"Via: Airbnb | Tel: 863496644 | Email: davecheung1@gmail.com",history:[{"date": "2025-06-25", "text": "$915.56 \u2014 stay (2025-06-25 \u2192 2025-06-30)"}],archived:true,archived_date:"2025-06-30"},
  {id:1566,apt:"Montg 7",owner:"Elkins LT",name:"Reilly Eamon Beauchamp",type:"long-term",rent:0.0,balance:0,due:"2026-01-31",note:"Tel: (267) 625-0565",history:[],archived:true,archived_date:"2026-01-31"},
  {id:1567,apt:"Keswick 2A",owner:"Keswick Properties",name:"Clifford Harris",type:"long-term",rent:1700.0,balance:0,due:"2026-03-31",note:"Via: Vrbo | Tel: 2156929088 | Email: bak2blk@msn.com",history:[{"date": "2025-03-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2025-04-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2025-05-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2025-06-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2025-07-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2025-08-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2025-09-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2025-10-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2025-11-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2025-12-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2026-01-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2026-02-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2026-03-01", "text": "$1,700 \u2014 monthly (est.)"}],archived:true,archived_date:"2026-03-31"},
  {id:1568,apt:"Keswick 3B",owner:"Keswick Properties",name:"Mariami Metreveli",type:"long-term",rent:1575.0,balance:0,due:"2026-02-28",note:"Via: facebook | Tel: 9179402724 | Email: Marimetro1418@gmail.com",history:[{"date": "2025-03-01", "text": "$1,575 \u2014 monthly (est.)"}, {"date": "2025-04-01", "text": "$1,575 \u2014 monthly (est.)"}, {"date": "2025-05-01", "text": "$1,575 \u2014 monthly (est.)"}, {"date": "2025-06-01", "text": "$1,575 \u2014 monthly (est.)"}, {"date": "2025-07-01", "text": "$1,575 \u2014 monthly (est.)"}, {"date": "2025-08-01", "text": "$1,575 \u2014 monthly (est.)"}, {"date": "2025-09-01", "text": "$1,575 \u2014 monthly (est.)"}, {"date": "2025-10-01", "text": "$1,575 \u2014 monthly (est.)"}, {"date": "2025-11-01", "text": "$1,575 \u2014 monthly (est.)"}, {"date": "2025-12-01", "text": "$1,575 \u2014 monthly (est.)"}, {"date": "2026-01-01", "text": "$1,575 \u2014 monthly (est.)"}, {"date": "2026-02-01", "text": "$1,575 \u2014 monthly (est.)"}],archived:true,archived_date:"2026-02-28"},
  {id:1569,apt:"Keswick Store",owner:"Keswick Properties",name:"Harnek Singh",type:"long-term",rent:0.0,balance:0,due:"2028-01-02",note:"Tel: (845) 464-1634 | Email: sunocogascarwash@gmail.com",history:[],archived:true,archived_date:"2028-01-02"},
  {id:1570,apt:"219",owner:"ERA LT",name:"Dumitru Gruia moved out from Fox Chase",type:"short-stay",rent:3001.09,balance:0,due:"2025-07-10",note:"Via: Hostfully | Tel: 7143433499/2675159383 | Email: anamariabadoi7@gmail.com",history:[{"date": "2025-06-20", "text": "$3,001.09 \u2014 stay (2025-06-20 \u2192 2025-07-10)"}],archived:true,archived_date:"2025-07-10"},
  {id:1571,apt:"Montg 5B",owner:"Elkins LT",name:"Kristina Newton",type:"long-term",rent:1450.0,balance:0,due:"2026-03-31",note:"Via: Airbnb | Tel: (267) 983-8094 | Email: knewton37@gmail.com",history:[{"date": "2025-04-01", "text": "$1,450 \u2014 monthly (est.)"}, {"date": "2025-05-01", "text": "$1,450 \u2014 monthly (est.)"}, {"date": "2025-06-01", "text": "$1,450 \u2014 monthly (est.)"}, {"date": "2025-07-01", "text": "$1,450 \u2014 monthly (est.)"}, {"date": "2025-08-01", "text": "$1,450 \u2014 monthly (est.)"}, {"date": "2025-09-01", "text": "$1,450 \u2014 monthly (est.)"}, {"date": "2025-10-01", "text": "$1,450 \u2014 monthly (est.)"}, {"date": "2025-11-01", "text": "$1,450 \u2014 monthly (est.)"}, {"date": "2025-12-01", "text": "$1,450 \u2014 monthly (est.)"}, {"date": "2026-01-01", "text": "$1,450 \u2014 monthly (est.)"}, {"date": "2026-02-01", "text": "$1,450 \u2014 monthly (est.)"}, {"date": "2026-03-01", "text": "$1,450 \u2014 monthly (est.)"}],archived:true,archived_date:"2026-03-31"},
  {id:1572,apt:"Melrose B1",owner:"Melrose Properties",name:"Grace Chow",type:"short-stay",rent:1054.74,balance:0,due:"2025-07-12",note:"Via: Airbnb | Tel: 16076586512 | Email: gracechow2011@gmail.com",history:[{"date": "2025-07-01", "text": "$1,054.74 \u2014 stay (2025-07-01 \u2192 2025-07-12)"}],archived:true,archived_date:"2025-07-12"},
  {id:1573,apt:"210",owner:"ERA LT",name:"Tara Bohanan",type:"short-stay",rent:8182.69,balance:0,due:"2025-07-12",note:"Via: Airbnb | Tel: 7279671074 | Email: mauricegillette@thebeamteam.com",history:[{"date": "2025-05-04", "text": "$8,182.69 \u2014 stay (2025-05-04 \u2192 2025-07-12)"}],archived:true,archived_date:"2025-07-12"},
  {id:1574,apt:"202",owner:"ERA LT",name:"Julie Garrett",type:"short-stay",rent:2040.47,balance:0,due:"2025-07-13",note:"Via: Airbnb | Tel: 2153178255",history:[{"date": "2025-06-21", "text": "$2,040.47 \u2014 stay (2025-06-21 \u2192 2025-07-13)"}],archived:true,archived_date:"2025-07-13"},
  {id:1575,apt:"330",owner:"ERA LT",name:"Mark Moniello",type:"short-stay",rent:4576.46,balance:0,due:"2025-07-19",note:"Via: Airbnb | Tel: 8505292683 | Email: Mfmonie@gmail.com",history:[{"date": "2025-06-01", "text": "$4,576.46 \u2014 stay (2025-06-01 \u2192 2025-07-19)"}],archived:true,archived_date:"2025-07-19"},
  {id:1576,apt:"Fox Chase  2",owner:"Fox Chase Properties",name:"Megan Hintz",type:"short-stay",rent:4485.19,balance:0,due:"2025-06-22",note:"Via: Booking | Tel: 5044609945",history:[{"date": "2025-04-30", "text": "$4,485.19 \u2014 stay (2025-04-30 \u2192 2025-06-22)"}],archived:true,archived_date:"2025-06-22"},
  {id:1577,apt:"208",owner:"ERA LT",name:"Nicholas Solt",type:"short-stay",rent:3162.52,balance:0,due:"2025-07-06",note:"Via: Airbnb | Tel: 4129771507 | Email: solt24nick@yahoo.com",history:[{"date": "2025-06-06", "text": "$3,162.52 \u2014 stay (2025-06-06 \u2192 2025-07-06)"}],archived:true,archived_date:"2025-07-06"},
  {id:1578,apt:"Montg 1",owner:"Elkins LT",name:"Seong Kim",type:"short-stay",rent:836.89,balance:0,due:"2025-07-21",note:"Via: Airbnb | Tel: 15106052715 | Email: trueseong@yahoo.com",history:[{"date": "2025-07-13", "text": "$836.89 \u2014 stay (2025-07-13 \u2192 2025-07-21)"}],archived:true,archived_date:"2025-07-21"},
  {id:1579,apt:"223",owner:"ERA LT",name:"Katie Krcmarik",type:"short-stay",rent:1222.99,balance:0,due:"2025-07-26",note:"Via: Airbnb | Tel: 12483213434 | Email: kkrcmarik@hotmail.com",history:[{"date": "2025-07-13", "text": "$1,222.99 \u2014 stay (2025-07-13 \u2192 2025-07-26)"}],archived:true,archived_date:"2025-07-26"},
  {id:1580,apt:"Montg 4",owner:"Elkins LT",name:"Derek Frickey",type:"long-term",rent:2100.0,balance:0,due:"2025-07-26",note:"Via: Zillow | Tel: (719) 439-5463, Audra 719-217-0912 | Email: derek.frickey@ritsemalaw.com",history:[{"date": "2025-06-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2025-07-01", "text": "$2,100 \u2014 monthly (est.)"}],archived:true,archived_date:"2025-07-26"},
  {id:1581,apt:"Melrose B1",owner:"Melrose Properties",name:"Margaret Lathrope",type:"short-stay",rent:717.18,balance:0,due:"2025-07-25",note:"Via: Airbnb | Tel: 18478991251 | Email: Joecollvins@gmail.com",history:[{"date": "2025-07-18", "text": "$717.18 \u2014 stay (2025-07-18 \u2192 2025-07-25)"}],archived:true,archived_date:"2025-07-25"},
  {id:1582,apt:"221",owner:"ERA LT",name:"Carmen White",type:"short-stay",rent:799.55,balance:0,due:"2025-07-30",note:"Via: Booking | Tel: 12675845554 | Email: Gripgvng@gmail.com",history:[{"date": "2025-07-09", "text": "$799.55 \u2014 stay (2025-07-09 \u2192 2025-07-30)"}],archived:true,archived_date:"2025-07-30"},
  {id:1583,apt:"318",owner:"ERA LT",name:"Alex Castelli",type:"short-stay",rent:2563.05,balance:0,due:"2025-06-30",note:"Via: Airbnb | Tel: 9802297975 | Email: Acastelli342@gmail.com",history:[{"date": "2025-06-09", "text": "$2,563.05 \u2014 stay (2025-06-09 \u2192 2025-06-30)"}],archived:true,archived_date:"2025-06-30"},
  {id:1584,apt:"426-2",owner:"ERA LT",name:"Adrienne Branch",type:"short-stay",rent:1197.76,balance:0,due:"2025-08-01",note:"Via: Airbnb | Tel: 2152371293",history:[{"date": "2025-06-11", "text": "$1,197.76 \u2014 stay (2025-06-11 \u2192 2025-08-01)"}],archived:true,archived_date:"2025-08-01"},
  {id:1585,apt:"Melrose C1",owner:"Melrose Properties",name:"Bobby.l Iii Jemerson",type:"short-stay",rent:2361.59,balance:0,due:"2025-08-01",note:"Via: Airbnb | Tel: 6072296647 | Email: bjemerson@blueteamcorp.com",history:[{"date": "2025-06-17", "text": "$2,361.59 \u2014 stay (2025-06-17 \u2192 2025-08-01)"}],archived:true,archived_date:"2025-08-01"},
  {id:1586,apt:"Montg 1B",owner:"Elkins LT",name:"Ashley Peavy",type:"long-term",rent:5846.62,balance:0,due:"2025-08-01",note:"Via: Airbnb | Tel: 2673399922 | Email: apeavy12@gmail.com",history:[{"date": "2025-05-01", "text": "$5,847 \u2014 monthly (est.)"}, {"date": "2025-06-01", "text": "$5,847 \u2014 monthly (est.)"}, {"date": "2025-07-01", "text": "$5,847 \u2014 monthly (est.)"}, {"date": "2025-08-01", "text": "$5,847 \u2014 monthly (est.)"}],archived:true,archived_date:"2025-08-01"},
  {id:1587,apt:"Fox Chase  1",owner:"Fox Chase Properties",name:"Noha Haggag",type:"short-stay",rent:1758.04,balance:0,due:"2025-08-01",note:"Via: Airbnb | Tel: 12014502322 | Email: kotsadam.katerina@gmail.com",history:[{"date": "2025-07-13", "text": "$1,758.04 \u2014 stay (2025-07-13 \u2192 2025-08-01)"}],archived:true,archived_date:"2025-08-01"},
  {id:1588,apt:"331",owner:"ERA LT",name:"Arturo Ramsden",type:"short-stay",rent:1136.99,balance:0,due:"2025-07-31",note:"Via: Hostfully",history:[{"date": "2025-07-20", "text": "$1,136.99 \u2014 stay (2025-07-20 \u2192 2025-07-31)"}],archived:true,archived_date:"2025-07-31"},
  {id:1589,apt:"320",owner:"ERA LT",name:"Vivian Pine-White",type:"short-stay",rent:3066.12,balance:0,due:"2025-07-31",note:"Via: Airbnb | Tel: 13109364761 | Email: vivian_pine@yahoo.com",history:[{"date": "2025-07-01", "text": "$3,066.12 \u2014 stay (2025-07-01 \u2192 2025-07-31)"}],archived:true,archived_date:"2025-07-31"},
  {id:1590,apt:"212",owner:"ERA LT",name:"Usman Mahmood",type:"short-stay",rent:4583.0,balance:0,due:"2025-07-31",note:"Via: Booking | Tel: 19198020057 | Email: shizakhan.pk8@gmail.com",history:[{"date": "2025-06-30", "text": "$4,583.00 \u2014 stay (2025-06-30 \u2192 2025-07-31)"}],archived:true,archived_date:"2025-07-31"},
  {id:1591,apt:"Melrose B2",owner:"Melrose Properties",name:"AIDARSHO MUSOEV",type:"long-term",rent:1900.0,balance:0,due:"2025-09-30",note:"Via: facebook | Tel: (267) 990-7129 | Email: aidarmusoev@gmail.com",history:[{"date": "2024-10-01", "text": "$1,900 \u2014 monthly (est.)"}, {"date": "2024-11-01", "text": "$1,900 \u2014 monthly (est.)"}, {"date": "2024-12-01", "text": "$1,900 \u2014 monthly (est.)"}, {"date": "2025-01-01", "text": "$1,900 \u2014 monthly (est.)"}, {"date": "2025-02-01", "text": "$1,900 \u2014 monthly (est.)"}, {"date": "2025-03-01", "text": "$1,900 \u2014 monthly (est.)"}, {"date": "2025-04-01", "text": "$1,900 \u2014 monthly (est.)"}, {"date": "2025-05-01", "text": "$1,900 \u2014 monthly (est.)"}, {"date": "2025-06-01", "text": "$1,900 \u2014 monthly (est.)"}, {"date": "2025-07-01", "text": "$1,900 \u2014 monthly (est.)"}, {"date": "2025-08-01", "text": "$1,900 \u2014 monthly (est.)"}, {"date": "2025-09-01", "text": "$1,900 \u2014 monthly (est.)"}],archived:true,archived_date:"2025-09-30"},
  {id:1592,apt:"207",owner:"ERA LT",name:"Adrian Dobrica",type:"long-term",rent:966.57,balance:0,due:"2025-07-03",note:"Via: Booking | Tel: 954 795 4370",history:[{"date": "2025-02-01", "text": "$967 \u2014 monthly (est.)"}, {"date": "2025-03-01", "text": "$967 \u2014 monthly (est.)"}, {"date": "2025-04-01", "text": "$967 \u2014 monthly (est.)"}, {"date": "2025-05-01", "text": "$967 \u2014 monthly (est.)"}, {"date": "2025-06-01", "text": "$967 \u2014 monthly (est.)"}, {"date": "2025-07-01", "text": "$967 \u2014 monthly (est.)"}],archived:true,archived_date:"2025-07-03"},
  {id:1593,apt:"112",owner:"ERA LT",name:"Ennis Avila",type:"short-stay",rent:3767.3,balance:0,due:"2025-08-06",note:"Via: Airbnb | Tel: 3238125171 | Email: ennisavila14@gmail.com",history:[{"date": "2025-06-18", "text": "$3,767.30 \u2014 stay (2025-06-18 \u2192 2025-08-06)"}],archived:true,archived_date:"2025-08-06"},
  {id:1594,apt:"111",owner:"ERA LT",name:"Dennis Elmer",type:"month-to-month",rent:2250.0,balance:0,due:"",note:"Tel: (267) 272-5794 | Email: delmer46@yahoo.com",history:[{"date": "2024-12-01", "text": "$2,250 \u2014 monthly (est.)"}, {"date": "2025-01-01", "text": "$2,250 \u2014 monthly (est.)"}, {"date": "2025-02-01", "text": "$2,250 \u2014 monthly (est.)"}, {"date": "2025-03-01", "text": "$2,250 \u2014 monthly (est.)"}, {"date": "2025-04-01", "text": "$2,250 \u2014 monthly (est.)"}, {"date": "2025-05-01", "text": "$2,250 \u2014 monthly (est.)"}, {"date": "2025-06-01", "text": "$2,250 \u2014 monthly (est.)"}, {"date": "2025-07-01", "text": "$2,250 \u2014 monthly (est.)"}, {"date": "2025-08-01", "text": "$2,250 \u2014 monthly (est.)"}, {"date": "2025-09-01", "text": "$2,250 \u2014 monthly (est.)"}, {"date": "2025-10-01", "text": "$2,250 \u2014 monthly (est.)"}, {"date": "2025-11-01", "text": "$2,250 \u2014 monthly (est.)"}, {"date": "2025-12-01", "text": "$2,250 \u2014 monthly (est.)"}, {"date": "2026-01-01", "text": "$2,250 \u2014 monthly (est.)"}, {"date": "2026-02-01", "text": "$2,250 \u2014 monthly (est.)"}, {"date": "2026-03-01", "text": "$2,250 \u2014 monthly (est.)"}],archived:true,archived_date:"2024-12-01"},
  {id:1595,apt:"Montg 1B",owner:"Elkins LT",name:"Mor Mendelson",type:"short-stay",rent:619.6,balance:0,due:"2025-08-11",note:"Via: Hostfully | Tel: 2155013848 | Email: mormendelson@gmail.com",history:[{"date": "2025-08-04", "text": "$619.60 \u2014 stay (2025-08-04 \u2192 2025-08-11)"}],archived:true,archived_date:"2025-08-11"},
  {id:1596,apt:"317",owner:"ERA LT",name:"Kaitlyn Alexis Tull",type:"short-stay",rent:8051.39,balance:0,due:"2025-08-09",note:"Via: Airbnb | Tel: 7327255494 | Email: kaitlynt2003@gmail.com",history:[{"date": "2025-06-01", "text": "$8,051.39 \u2014 stay (2025-06-01 \u2192 2025-08-09)"}],archived:true,archived_date:"2025-08-09"},
  {id:1597,apt:"Melrose A2",owner:"Melrose Properties",name:"Catherine Madagoni",type:"short-stay",rent:2059.88,balance:0,due:"2025-08-11",note:"Via: Airbnb | Tel: 16093060815 | Email: cathycorina@gmail.com",history:[{"date": "2025-06-12", "text": "$2,059.88 \u2014 stay (2025-06-12 \u2192 2025-08-11)"}],archived:true,archived_date:"2025-08-11"},
  {id:1598,apt:"Melrose C1",owner:"Melrose Properties",name:"Keirra Strayhorn",type:"short-stay",rent:1786.63,balance:0,due:"2025-09-02",note:"Via: Vrbo | Tel: 16463264940 | Email: keirrastrayhorn@yahoo.com",history:[{"date": "2025-08-11", "text": "$1,786.63 \u2014 stay (2025-08-11 \u2192 2025-09-02)"}],archived:true,archived_date:"2025-09-02"},
  {id:1599,apt:"Montg 5B",owner:"Elkins LT",name:"Adrian Schembri",type:"short-stay",rent:2076.18,balance:0,due:"2025-08-15",note:"Via: Airbnb | Tel: 12153955211 | Email: Adrianoschembri1@gmail.com",history:[{"date": "2025-07-18", "text": "$2,076.18 \u2014 stay (2025-07-18 \u2192 2025-08-15)"}],archived:true,archived_date:"2025-08-15"},
  {id:1600,apt:"210",owner:"ERA LT",name:"Jan Niklas Kloft",type:"short-stay",rent:2886.55,balance:0,due:"2025-08-15",note:"Via: Airbnb | Tel: 1704017704 | Email: Ja.niklas1@googlemail.com",history:[{"date": "2025-07-26", "text": "$2,886.55 \u2014 stay (2025-07-26 \u2192 2025-08-15)"}],archived:true,archived_date:"2025-08-15"},
  {id:1601,apt:"208",owner:"ERA LT",name:"David Balshukat",type:"short-stay",rent:2965.73,balance:0,due:"2025-08-17",note:"Via: Airbnb | Tel: 2156309724",history:[{"date": "2025-07-27", "text": "$2,965.73 \u2014 stay (2025-07-27 \u2192 2025-08-17)"}],archived:true,archived_date:"2025-08-17"},
  {id:1602,apt:"310",owner:"ERA LT",name:"Latoya Martin",type:"long-term",rent:2500.0,balance:0,due:"2026-02-28",note:"Via: abnb | Tel: (267) 471-9354 | Email: toya4nic@gmail.com",history:[{"date": "2024-03-01", "text": "$2,500 \u2014 monthly (est.)"}, {"date": "2024-04-01", "text": "$2,500 \u2014 monthly (est.)"}, {"date": "2024-05-01", "text": "$2,500 \u2014 monthly (est.)"}, {"date": "2024-06-01", "text": "$2,500 \u2014 monthly (est.)"}, {"date": "2024-07-01", "text": "$2,500 \u2014 monthly (est.)"}, {"date": "2024-08-01", "text": "$2,500 \u2014 monthly (est.)"}, {"date": "2024-09-01", "text": "$2,500 \u2014 monthly (est.)"}, {"date": "2024-10-01", "text": "$2,500 \u2014 monthly (est.)"}, {"date": "2024-11-01", "text": "$2,500 \u2014 monthly (est.)"}, {"date": "2024-12-01", "text": "$2,500 \u2014 monthly (est.)"}, {"date": "2025-01-01", "text": "$2,500 \u2014 monthly (est.)"}, {"date": "2025-02-01", "text": "$2,500 \u2014 monthly (est.)"}, {"date": "2025-03-01", "text": "$2,500 \u2014 monthly (est.)"}, {"date": "2025-04-01", "text": "$2,500 \u2014 monthly (est.)"}, {"date": "2025-05-01", "text": "$2,500 \u2014 monthly (est.)"}, {"date": "2025-06-01", "text": "$2,500 \u2014 monthly (est.)"}, {"date": "2025-07-01", "text": "$2,500 \u2014 monthly (est.)"}, {"date": "2025-08-01", "text": "$2,500 \u2014 monthly (est.)"}, {"date": "2025-09-01", "text": "$2,500 \u2014 monthly (est.)"}, {"date": "2025-10-01", "text": "$2,500 \u2014 monthly (est.)"}, {"date": "2025-11-01", "text": "$2,500 \u2014 monthly (est.)"}, {"date": "2025-12-01", "text": "$2,500 \u2014 monthly (est.)"}, {"date": "2026-01-01", "text": "$2,500 \u2014 monthly (est.)"}, {"date": "2026-02-01", "text": "$2,500 \u2014 monthly (est.)"}],archived:true,archived_date:"2026-02-28"},
  {id:1603,apt:"212",owner:"ERA LT",name:"Elliot Hagari",type:"short-stay",rent:969.55,balance:0,due:"2025-08-17",note:"Via: Airbnb | Tel: 18474948320 | Email: Fernando.paz@yahoo.com",history:[{"date": "2025-08-10", "text": "$969.55 \u2014 stay (2025-08-10 \u2192 2025-08-17)"}],archived:true,archived_date:"2025-08-17"},
  {id:1604,apt:"331",owner:"ERA LT",name:"Evan Benstead",type:"short-stay",rent:1201.26,balance:0,due:"2025-08-17",note:"Via: Vrbo | Tel: 13104379625 | Email: bensteadev@verizon.net",history:[{"date": "2025-08-08", "text": "$1,201.26 \u2014 stay (2025-08-08 \u2192 2025-08-17)"}],archived:true,archived_date:"2025-08-17"},
  {id:1605,apt:"Montg Studio B",owner:"Elkins LT",name:"Lorenzo",type:"short-stay",rent:1117.44,balance:0,due:"2025-08-29",note:"Via: Airbnb | Email: tanganellilory@gmail.com",history:[{"date": "2025-08-11", "text": "$1,117.44 \u2014 stay (2025-08-11 \u2192 2025-08-29)"}],archived:true,archived_date:"2025-08-29"},
  {id:1606,apt:"Montg 6",owner:"Elkins LT",name:"Kristin McPeake",type:"long-term",rent:1900.0,balance:0,due:"2025-08-28",note:"Via: Zillow | Tel: (317) 617-1806 | Email: knm5733@psu.edu",history:[{"date": "2025-05-01", "text": "$1,900 \u2014 monthly (est.)"}, {"date": "2025-06-01", "text": "$1,900 \u2014 monthly (est.)"}, {"date": "2025-07-01", "text": "$1,900 \u2014 monthly (est.)"}, {"date": "2025-08-01", "text": "$1,900 \u2014 monthly (est.)"}],archived:true,archived_date:"2025-08-28"},
  {id:1607,apt:"202",owner:"ERA LT",name:"Sofia Liao",type:"short-stay",rent:4488.62,balance:0,due:"2025-08-21",note:"Via: Airbnb | Tel: 13910420191 | Email: 47372630@qq.com",history:[{"date": "2025-07-13", "text": "$4,488.62 \u2014 stay (2025-07-13 \u2192 2025-08-21)"}],archived:true,archived_date:"2025-08-21"},
  {id:1608,apt:"104",owner:"ERA LT",name:"Yakatarina Barzilai",type:"long-term",rent:4303.38,balance:0,due:"2025-08-20",note:"Via: FF | Tel: 9294059271 | Email: katerinabarzilay@gmail.com",history:[{"date": "2025-05-01", "text": "$4,303 \u2014 monthly (est.)"}, {"date": "2025-06-01", "text": "$4,303 \u2014 monthly (est.)"}, {"date": "2025-07-01", "text": "$4,303 \u2014 monthly (est.)"}, {"date": "2025-08-01", "text": "$4,303 \u2014 monthly (est.)"}],archived:true,archived_date:"2025-08-20"},
  {id:1609,apt:"Montg 1B",owner:"Elkins LT",name:"Line Hasty",type:"short-stay",rent:631.98,balance:0,due:"2025-08-22",note:"Via: Airbnb | Tel: 16316449578 | Email: Honoreline@gmail.com",history:[{"date": "2025-08-15", "text": "$631.98 \u2014 stay (2025-08-15 \u2192 2025-08-22)"}],archived:true,archived_date:"2025-08-22"},
  {id:1610,apt:"221",owner:"ERA LT",name:"Devin Nadglowski",type:"short-stay",rent:1216.52,balance:0,due:"2025-08-25",note:"Via: Airbnb | Tel: 18134828336 | Email: Briannerodecap7@gmail.com",history:[{"date": "2025-08-11", "text": "$1,216.52 \u2014 stay (2025-08-11 \u2192 2025-08-25)"}],archived:true,archived_date:"2025-08-25"},
  {id:1611,apt:"Fox Chase  2",owner:"Fox Chase Properties",name:"Derrik Zamora",type:"short-stay",rent:1357.54,balance:0,due:"2025-08-24",note:"Via: Airbnb | Tel: 18014041905 | Email: Pantojadaniela5687@gmail.com",history:[{"date": "2025-08-10", "text": "$1,357.54 \u2014 stay (2025-08-10 \u2192 2025-08-24)"}],archived:true,archived_date:"2025-08-24"},
  {id:1612,apt:"320",owner:"ERA LT",name:"Shakim Blackwell",type:"short-stay",rent:1357.54,balance:0,due:"2025-08-28",note:"Via: Airbnb | Tel: 19074444295 | Email: blackwellsm24@gmail.com",history:[{"date": "2025-08-14", "text": "$1,357.54 \u2014 stay (2025-08-14 \u2192 2025-08-28)"}],archived:true,archived_date:"2025-08-28"},
  {id:1613,apt:"223",owner:"ERA LT",name:"Travis Meyer",type:"short-stay",rent:2348.86,balance:0,due:"2025-08-29",note:"Via: Booking | Tel: 16616189514 | Email: travisrmeyer@gmail.com",history:[{"date": "2025-08-03", "text": "$2,348.86 \u2014 stay (2025-08-03 \u2192 2025-08-29)"}],archived:true,archived_date:"2025-08-29"},
  {id:1614,apt:"Montg 5B",owner:"Elkins LT",name:"Lorenzo",type:"short-stay",rent:1117.44,balance:0,due:"2025-08-29",note:"Via: Airbnb | Email: tanganellilory@gmail.com",history:[{"date": "2025-08-15", "text": "$1,117.44 \u2014 stay (2025-08-15 \u2192 2025-08-29)"}],archived:true,archived_date:"2025-08-29"},
  {id:1615,apt:"Montg 1B",owner:"Elkins LT",name:"Mary Wilson",type:"short-stay",rent:631.98,balance:0,due:"2025-08-31",note:"Via: Airbnb | Tel: 6179097615 | Email: mamiewilsonnn@gmail.com",history:[{"date": "2025-08-24", "text": "$631.98 \u2014 stay (2025-08-24 \u2192 2025-08-31)"}],archived:true,archived_date:"2025-08-31"},
  {id:1616,apt:"Montg 1",owner:"Elkins LT",name:"Anthony Paciulete",type:"short-stay",rent:1950.15,balance:0,due:"2025-09-01",note:"Via: Vrbo | Tel: 6099971121 | Email: A.c.paciulete@gmail.com",history:[{"date": "2025-07-25", "text": "$1,950.15 \u2014 stay (2025-07-25 \u2192 2025-09-01)"}],archived:true,archived_date:"2025-09-01"},
  {id:1617,apt:"426-2",owner:"ERA LT",name:"Courtney Heinerici",type:"short-stay",rent:3033.19,balance:0,due:"2025-09-01",note:"Via: Airbnb | Tel: 16107319452 | Email: cheinerici@gmail.com",history:[{"date": "2025-08-01", "text": "$3,033.19 \u2014 stay (2025-08-01 \u2192 2025-09-01)"}],archived:true,archived_date:"2025-09-01"},
  {id:1618,apt:"208",owner:"ERA LT",name:"Paloma Esteban",type:"short-stay",rent:1498.0,balance:0,due:"2025-09-01",note:"Via: Booking | Tel: 34615614240 | Email: estefaniatoes20@gmail.com",history:[{"date": "2025-08-22", "text": "$1,498.00 \u2014 stay (2025-08-22 \u2192 2025-09-01)"}],archived:true,archived_date:"2025-09-01"},
  {id:1619,apt:"Montg 3",owner:"Elkins LT",name:"Paul Morgan Consigny",type:"short-stay",rent:8740.92,balance:0,due:"2025-08-31",note:"Via: Vrbo | Tel: 2677847738 | Email: mconsigny@gmail.com",history:[{"date": "2025-06-06", "text": "$8,740.92 \u2014 stay (2025-06-06 \u2192 2025-08-31)"}],archived:true,archived_date:"2025-08-31"},
  {id:1620,apt:"314",owner:"ERA LT",name:"Zoia Ladiuk",type:"long-term",rent:1850.0,balance:0,due:"2025-12-31",note:"Via: facebook | Tel: (267) 693-1923 | Email: zoaladuk89@gmail.com",history:[{"date": "2024-03-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2024-04-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2024-05-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2024-06-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2024-07-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2024-08-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2024-09-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2024-10-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2024-11-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2024-12-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2025-01-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2025-02-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2025-03-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2025-04-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2025-05-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2025-06-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2025-07-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2025-08-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2025-09-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2025-10-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2025-11-01", "text": "$1,850 \u2014 monthly (est.)"}, {"date": "2025-12-01", "text": "$1,850 \u2014 monthly (est.)"}],archived:true,archived_date:"2025-12-31"},
  {id:1621,apt:"Melrose C1",owner:"Melrose Properties",name:"Jadin Stoffel",type:"short-stay",rent:834.74,balance:0,due:"2025-09-08",note:"Via: Airbnb | Tel: 12623854966 | Email: zane.l.weltman@gmail.com",history:[{"date": "2025-08-31", "text": "$834.74 \u2014 stay (2025-08-31 \u2192 2025-09-08)"}],archived:true,archived_date:"2025-09-08"},
  {id:1622,apt:"215",owner:"ERA LT",name:"Melissa Weisman",type:"long-term",rent:2297.14,balance:0,due:"2025-09-06",note:"Via: Airbnb | Tel: 2673071783 | Email: mweisman2@yahoo.com",history:[{"date": "2025-05-01", "text": "$2,297 \u2014 monthly (est.)"}, {"date": "2025-06-01", "text": "$2,297 \u2014 monthly (est.)"}, {"date": "2025-07-01", "text": "$2,297 \u2014 monthly (est.)"}, {"date": "2025-08-01", "text": "$2,297 \u2014 monthly (est.)"}, {"date": "2025-09-01", "text": "$2,297 \u2014 monthly (est.)"}],archived:true,archived_date:"2025-09-06"},
  {id:1623,apt:"330",owner:"ERA LT",name:"Rafael Ali",type:"short-stay",rent:2316.44,balance:0,due:"2025-09-15",note:"Via: Airbnb | Tel: 12675154629 | Email: rahamin724@gmail.com",history:[{"date": "2025-08-15", "text": "$2,316.44 \u2014 stay (2025-08-15 \u2192 2025-09-15)"}],archived:true,archived_date:"2025-09-15"},
  {id:1624,apt:"317",owner:"ERA LT",name:"Akhila T",type:"short-stay",rent:918.72,balance:0,due:"2025-09-11",note:"Via: Hostfully | Tel: 16602383967 | Email: drchinnu2124@gmail.com",history:[{"date": "2025-09-04", "text": "$918.72 \u2014 stay (2025-09-04 \u2192 2025-09-11)"}],archived:true,archived_date:"2025-09-11"},
  {id:1625,apt:"Melrose C2",owner:"Melrose Properties",name:"Chelsea DeJesus/Magdalena Santiago Sep 10th",type:"month-to-month",rent:1620.0,balance:0,due:"",note:"Via: original | Tel: (267) 992-5440 | Email: cdejesus53@gmail.com",history:[{"date": "2023-01-01", "text": "$1,620 \u2014 monthly (est.)"}, {"date": "2023-02-01", "text": "$1,620 \u2014 monthly (est.)"}, {"date": "2023-03-01", "text": "$1,620 \u2014 monthly (est.)"}, {"date": "2023-04-01", "text": "$1,620 \u2014 monthly (est.)"}, {"date": "2023-05-01", "text": "$1,620 \u2014 monthly (est.)"}, {"date": "2023-06-01", "text": "$1,620 \u2014 monthly (est.)"}, {"date": "2023-07-01", "text": "$1,620 \u2014 monthly (est.)"}, {"date": "2023-08-01", "text": "$1,620 \u2014 monthly (est.)"}, {"date": "2023-09-01", "text": "$1,620 \u2014 monthly (est.)"}, {"date": "2023-10-01", "text": "$1,620 \u2014 monthly (est.)"}, {"date": "2023-11-01", "text": "$1,620 \u2014 monthly (est.)"}, {"date": "2023-12-01", "text": "$1,620 \u2014 monthly (est.)"}, {"date": "2024-01-01", "text": "$1,620 \u2014 monthly (est.)"}, {"date": "2024-02-01", "text": "$1,620 \u2014 monthly (est.)"}, {"date": "2024-03-01", "text": "$1,620 \u2014 monthly (est.)"}, {"date": "2024-04-01", "text": "$1,620 \u2014 monthly (est.)"}, {"date": "2024-05-01", "text": "$1,620 \u2014 monthly (est.)"}, {"date": "2024-06-01", "text": "$1,620 \u2014 monthly (est.)"}, {"date": "2024-07-01", "text": "$1,620 \u2014 monthly (est.)"}, {"date": "2024-08-01", "text": "$1,620 \u2014 monthly (est.)"}, {"date": "2024-09-01", "text": "$1,620 \u2014 monthly (est.)"}, {"date": "2024-10-01", "text": "$1,620 \u2014 monthly (est.)"}, {"date": "2024-11-01", "text": "$1,620 \u2014 monthly (est.)"}, {"date": "2024-12-01", "text": "$1,620 \u2014 monthly (est.)"}, {"date": "2025-01-01", "text": "$1,620 \u2014 monthly (est.)"}, {"date": "2025-02-01", "text": "$1,620 \u2014 monthly (est.)"}, {"date": "2025-03-01", "text": "$1,620 \u2014 monthly (est.)"}, {"date": "2025-04-01", "text": "$1,620 \u2014 monthly (est.)"}, {"date": "2025-05-01", "text": "$1,620 \u2014 monthly (est.)"}, {"date": "2025-06-01", "text": "$1,620 \u2014 monthly (est.)"}, {"date": "2025-07-01", "text": "$1,620 \u2014 monthly (est.)"}, {"date": "2025-08-01", "text": "$1,620 \u2014 monthly (est.)"}, {"date": "2025-09-01", "text": "$1,620 \u2014 monthly (est.)"}, {"date": "2025-10-01", "text": "$1,620 \u2014 monthly (est.)"}, {"date": "2025-11-01", "text": "$1,620 \u2014 monthly (est.)"}, {"date": "2025-12-01", "text": "$1,620 \u2014 monthly (est.)"}],archived:true,archived_date:"2023-01-01"},
  {id:1626,apt:"131",owner:"ERA LT",name:"Marina Brener",type:"long-term",rent:1650.0,balance:0,due:"2025-08-31",note:"Via: facebook | Tel: (267) 945-7889 | Email: marin90a@gmail.com",history:[{"date": "2023-09-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2023-10-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2023-11-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2023-12-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2024-01-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2024-02-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2024-03-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2024-04-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2024-05-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2024-06-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2024-07-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2024-08-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2024-09-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2024-10-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2024-11-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2024-12-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2025-01-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2025-02-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2025-03-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2025-04-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2025-05-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2025-06-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2025-07-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2025-08-01", "text": "$1,650 \u2014 monthly (est.)"}],archived:true,archived_date:"2025-08-31"},
  {id:1627,apt:"207",owner:"ERA LT",name:"Hugh Moore",type:"short-stay",rent:1509.51,balance:0,due:"2025-09-16",note:"Via: Airbnb | Tel: 2673574334",history:[{"date": "2025-08-22", "text": "$1,509.51 \u2014 stay (2025-08-22 \u2192 2025-09-16)"}],archived:true,archived_date:"2025-09-16"},
  {id:1628,apt:"207",owner:"ERA LT",name:"Carlo Arnone",type:"short-stay",rent:886.5,balance:0,due:"2025-09-24",note:"Via: Airbnb | Tel: 12152149296 | Email: carloarnone@aol.com",history:[{"date": "2025-09-16", "text": "$886.50 \u2014 stay (2025-09-16 \u2192 2025-09-24)"}],archived:true,archived_date:"2025-09-24"},
  {id:1629,apt:"318",owner:"ERA LT",name:"Barbara Malloy",type:"short-stay",rent:2930.84,balance:0,due:"2025-09-20",note:"Via: Vrbo | Tel: 2676219530 | Email: jmalloy17@comcast.net",history:[{"date": "2025-09-01", "text": "$2,930.84 \u2014 stay (2025-09-01 \u2192 2025-09-20)"}],archived:true,archived_date:"2025-09-20"},
  {id:1630,apt:"Montg 3",owner:"Elkins LT",name:"Wes Shukri",type:"short-stay",rent:856.31,balance:0,due:"2025-09-22",note:"Via: Airbnb | Tel: 8157936686 | Email: MomoShukri@gmail.com",history:[{"date": "2025-09-14", "text": "$856.31 \u2014 stay (2025-09-14 \u2192 2025-09-22)"}],archived:true,archived_date:"2025-09-22"},
  {id:1631,apt:"210",owner:"ERA LT",name:"Xinxin Zhang",type:"short-stay",rent:908.32,balance:0,due:"2025-09-24",note:"Via: Hostfully | Tel: 5714598530 | Email: 28838577@qq.com",history:[{"date": "2025-09-17", "text": "$908.32 \u2014 stay (2025-09-17 \u2192 2025-09-24)"}],archived:true,archived_date:"2025-09-24"},
  {id:1632,apt:"Montg 4",owner:"Elkins LT",name:"Susquehanna Ha",type:"short-stay",rent:974.94,balance:0,due:"2025-09-25",note:"Via: Airbnb | Tel: 1087653628",history:[{"date": "2025-09-17", "text": "$974.94 \u2014 stay (2025-09-17 \u2192 2025-09-25)"}],archived:true,archived_date:"2025-09-25"},
  {id:1633,apt:"Montg 3",owner:"Elkins LT",name:"Aliza Bernfeld",type:"short-stay",rent:494.36,balance:0,due:"2025-09-25",note:"Via: Hostfully | Tel: 7329306697 | Email: alizabernfeld1@gmail.com",history:[{"date": "2025-09-22", "text": "$494.36 \u2014 stay (2025-09-22 \u2192 2025-09-25)"}],archived:true,archived_date:"2025-09-25"},
  {id:1634,apt:"Melrose B1",owner:"Melrose Properties",name:"Emma Carney",type:"short-stay",rent:2120.75,balance:0,due:"2025-09-27",note:"Via: Vrbo | Tel: 15307618466 | Email: ahcollins17@gmail.com",history:[{"date": "2025-09-02", "text": "$2,120.75 \u2014 stay (2025-09-02 \u2192 2025-09-27)"}],archived:true,archived_date:"2025-09-27"},
  {id:1635,apt:"Montg 6",owner:"Elkins LT",name:"Elizabeth Mintz",type:"short-stay",rent:2009.8,balance:0,due:"2025-09-27",note:"Via: Airbnb | Tel: 609-477-6512‬",history:[{"date": "2025-09-01", "text": "$2,009.80 \u2014 stay (2025-09-01 \u2192 2025-09-27)"}],archived:true,archived_date:"2025-09-27"},
  {id:1636,apt:"320",owner:"ERA LT",name:"Mandy Wilson",type:"short-stay",rent:664.21,balance:0,due:"2025-09-28",note:"Via: Vrbo | Tel: rileysmom4life@aol.com",history:[{"date": "2025-09-22", "text": "$664.21 \u2014 stay (2025-09-22 \u2192 2025-09-28)"}],archived:true,archived_date:"2025-09-28"},
  {id:1637,apt:"Melrose C1",owner:"Melrose Properties",name:"Roselande Exume",type:"short-stay",rent:598.91,balance:0,due:"2025-09-29",note:"Via: Airbnb | Tel: 2676508775 | Email: roselandeexum26@gmail.com",history:[{"date": "2025-09-22", "text": "$598.91 \u2014 stay (2025-09-22 \u2192 2025-09-29)"}],archived:true,archived_date:"2025-09-29"},
  {id:1638,apt:"111",owner:"ERA LT",name:"Rebeccalynn Bishop",type:"short-stay",rent:1898.93,balance:0,due:"2025-09-30",note:"Via: Airbnb | Tel: 18565038876 | Email: Bemonet@icloud.com",history:[{"date": "2025-09-08", "text": "$1,898.93 \u2014 stay (2025-09-08 \u2192 2025-09-30)"}],archived:true,archived_date:"2025-09-30"},
  {id:1639,apt:"223",owner:"ERA LT",name:"John Siger",type:"short-stay",rent:725.7,balance:0,due:"2025-09-30",note:"Via: Booking | Tel: 4452130767 | Email: 2174730js@gmail.com",history:[{"date": "2025-09-23", "text": "$725.70 \u2014 stay (2025-09-23 \u2192 2025-09-30)"}],archived:true,archived_date:"2025-09-30"},
  {id:1640,apt:"Melrose A1",owner:"Melrose Properties",name:"Christyn Stanton",type:"long-term",rent:0.0,balance:0,due:"2025-12-31",note:"Tel: (267) 265-3340 | Email: amirahjay2@yahoo.com",history:[],archived:true,archived_date:"2025-12-31"},
  {id:1641,apt:"Montg 5",owner:"Elkins LT",name:"Farrukh Kurbanov",type:"long-term",rent:1625.0,balance:0,due:"2026-03-31",note:"Via: facebook | Tel: (445) 888-1315 | Email: kurbanovfarrukh662@gmail.com",history:[{"date": "2025-03-01", "text": "$1,625 \u2014 monthly (est.)"}, {"date": "2025-04-01", "text": "$1,625 \u2014 monthly (est.)"}, {"date": "2025-05-01", "text": "$1,625 \u2014 monthly (est.)"}, {"date": "2025-06-01", "text": "$1,625 \u2014 monthly (est.)"}, {"date": "2025-07-01", "text": "$1,625 \u2014 monthly (est.)"}, {"date": "2025-08-01", "text": "$1,625 \u2014 monthly (est.)"}, {"date": "2025-09-01", "text": "$1,625 \u2014 monthly (est.)"}, {"date": "2025-10-01", "text": "$1,625 \u2014 monthly (est.)"}, {"date": "2025-11-01", "text": "$1,625 \u2014 monthly (est.)"}, {"date": "2025-12-01", "text": "$1,625 \u2014 monthly (est.)"}, {"date": "2026-01-01", "text": "$1,625 \u2014 monthly (est.)"}, {"date": "2026-02-01", "text": "$1,625 \u2014 monthly (est.)"}, {"date": "2026-03-01", "text": "$1,625 \u2014 monthly (est.)"}],archived:true,archived_date:"2026-03-31"},
  {id:1642,apt:"Melrose C1",owner:"Melrose Properties",name:"Leland Lyle",type:"short-stay",rent:627.67,balance:0,due:"2025-10-09",note:"Via: Airbnb | Tel: 9124339063 | Email: llyle0728@gmail.com",history:[{"date": "2025-10-02", "text": "$627.67 \u2014 stay (2025-10-02 \u2192 2025-10-09)"}],archived:true,archived_date:"2025-10-09"},
  {id:1643,apt:"112",owner:"ERA LT",name:"Ryan Wilkinson",type:"short-stay",rent:1576.96,balance:0,due:"2025-10-10",note:"Via: Airbnb | Tel: 447984199374 | Email: zhammonds01@gmail.com",history:[{"date": "2025-09-27", "text": "$1,576.96 \u2014 stay (2025-09-27 \u2192 2025-10-10)"}],archived:true,archived_date:"2025-10-10"},
  {id:1644,apt:"115",owner:"ERA LT",name:"Chris Kennedy",type:"long-term",rent:3100.0,balance:0,due:"2025-10-10",note:"Via: Booking | Tel: 2134141259",history:[{"date": "2025-04-01", "text": "$3,100 \u2014 monthly (est.)"}, {"date": "2025-05-01", "text": "$3,100 \u2014 monthly (est.)"}, {"date": "2025-06-01", "text": "$3,100 \u2014 monthly (est.)"}, {"date": "2025-07-01", "text": "$3,100 \u2014 monthly (est.)"}, {"date": "2025-08-01", "text": "$3,100 \u2014 monthly (est.)"}, {"date": "2025-09-01", "text": "$3,100 \u2014 monthly (est.)"}, {"date": "2025-10-01", "text": "$3,100 \u2014 monthly (est.)"}],archived:true,archived_date:"2025-10-10"},
  {id:1645,apt:"Melrose B1",owner:"Melrose Properties",name:"William Ingram",type:"short-stay",rent:977.25,balance:0,due:"2025-10-12",note:"Via: Booking | Tel: 6281338573870 | Email: jean@threadsoflife.com",history:[{"date": "2025-10-03", "text": "$977.25 \u2014 stay (2025-10-03 \u2192 2025-10-12)"}],archived:true,archived_date:"2025-10-12"},
  {id:1646,apt:"Melrose B2",owner:"Melrose Properties",name:"Shportun Dmytro",type:"short-stay",rent:749.96,balance:0,due:"2025-10-14",note:"Via: Booking | Tel: 7867370784 | Email: sagis0021@gmail.com",history:[{"date": "2025-10-04", "text": "$749.96 \u2014 stay (2025-10-04 \u2192 2025-10-14)"}],archived:true,archived_date:"2025-10-14"},
  {id:1647,apt:"Montg 4",owner:"Elkins LT",name:"Hannah Lowry",type:"short-stay",rent:550.02,balance:0,due:"2025-10-15",note:"Via: Airbnb | Tel: 12674532023 | Email: hannahlowry@yahoo.com",history:[{"date": "2025-10-10", "text": "$550.02 \u2014 stay (2025-10-10 \u2192 2025-10-15)"}],archived:true,archived_date:"2025-10-15"},
  {id:1648,apt:"Montg 3",owner:"Elkins LT",name:"Mary Barnes",type:"short-stay",rent:1013.76,balance:0,due:"2025-10-17",note:"Via: Airbnb | Tel: 8148764288 | Email: Dymnos@yahoo.com",history:[{"date": "2025-10-06", "text": "$1,013.76 \u2014 stay (2025-10-06 \u2192 2025-10-17)"}],archived:true,archived_date:"2025-10-17"},
  {id:1649,apt:"221",owner:"ERA LT",name:"Christel Bullis",type:"short-stay",rent:2580.59,balance:0,due:"2025-10-20",note:"Via: Airbnb | Tel: 402-714-1131‬",history:[{"date": "2025-09-20", "text": "$2,580.59 \u2014 stay (2025-09-20 \u2192 2025-10-20)"}],archived:true,archived_date:"2025-10-20"},
  {id:1650,apt:"215",owner:"ERA LT",name:"Yuderka Rodriguez",type:"short-stay",rent:939.35,balance:0,due:"2025-10-18",note:"Via: Airbnb | Tel: 14845380642 | Email: rodriguezdjosiah@outlook.com",history:[{"date": "2025-10-11", "text": "$939.35 \u2014 stay (2025-10-11 \u2192 2025-10-18)"}],archived:true,archived_date:"2025-10-18"},
  {id:1651,apt:"Fox Chase  2",owner:"Fox Chase Properties",name:"James Barron",type:"short-stay",rent:703.16,balance:0,due:"2025-10-18",note:"Via: Airbnb | Tel: 13046291491 | Email: snowtrooper1966@hotmail.com",history:[{"date": "2025-10-04", "text": "$703.16 \u2014 stay (2025-10-04 \u2192 2025-10-18)"}],archived:true,archived_date:"2025-10-18"},
  {id:1652,apt:"210",owner:"ERA LT",name:"Margaret Poley",type:"short-stay",rent:1004.21,balance:0,due:"2025-10-21",note:"Via: Booking | Tel: 2673700806 | Email: margaret_poley@yahoo.com",history:[{"date": "2025-10-14", "text": "$1,004.21 \u2014 stay (2025-10-14 \u2192 2025-10-21)"}],archived:true,archived_date:"2025-10-21"},
  {id:1653,apt:"330",owner:"ERA LT",name:"Leon 赵",type:"short-stay",rent:1404.72,balance:0,due:"2025-10-21",note:"Via: Airbnb | Tel: 8613823744061 | Email: 496345096@qq.com",history:[{"date": "2025-10-05", "text": "$1,404.72 \u2014 stay (2025-10-05 \u2192 2025-10-21)"}],archived:true,archived_date:"2025-10-21"},
  {id:1654,apt:"Montg 4",owner:"Elkins LT",name:"Ruth Mcgaugh",type:"short-stay",rent:735.51,balance:0,due:"2025-10-22",note:"Via: Vrbo | Tel: 15185269632 | Email: ruthmcgaugh@gmail.com",history:[{"date": "2025-10-15", "text": "$735.51 \u2014 stay (2025-10-15 \u2192 2025-10-22)"}],archived:true,archived_date:"2025-10-22"},
  {id:1655,apt:"Montg 6",owner:"Elkins LT",name:"Gloria Brown",type:"short-stay",rent:1095.73,balance:0,due:"2025-10-22",note:"Via: Airbnb | Tel: 12152370575 | Email: browngloria1014@outlook.com",history:[{"date": "2025-10-08", "text": "$1,095.73 \u2014 stay (2025-10-08 \u2192 2025-10-22)"}],archived:true,archived_date:"2025-10-22"},
  {id:1656,apt:"208",owner:"ERA LT",name:"Sharif Ali",type:"short-stay",rent:826.11,balance:0,due:"2025-10-27",note:"Via: Airbnb | Tel: 12159831210 | Email: Sharonali7622@gmail.com",history:[{"date": "2025-10-20", "text": "$826.11 \u2014 stay (2025-10-20 \u2192 2025-10-27)"}],archived:true,archived_date:"2025-10-27"},
  {id:1657,apt:"Montg 6",owner:"Elkins LT",name:"Danny Davis",type:"short-stay",rent:620.12,balance:0,due:"2025-10-31",note:"Via: Airbnb | Tel: 12679746425 | Email: dannydavisjr44@gmail.com",history:[{"date": "2025-10-24", "text": "$620.12 \u2014 stay (2025-10-24 \u2192 2025-10-31)"}],archived:true,archived_date:"2025-10-31"},
  {id:1658,apt:"426-3",owner:"ERA LT",name:"Lashaie N. Lee Lewis",type:"long-term",rent:1720.0,balance:0,due:"2025-11-30",note:"Via: Zillow | Tel: (267) 824-0067 | Email: lashaielee@gmail.com",history:[{"date": "2023-11-01", "text": "$1,720 \u2014 monthly (est.)"}, {"date": "2023-12-01", "text": "$1,720 \u2014 monthly (est.)"}, {"date": "2024-01-01", "text": "$1,720 \u2014 monthly (est.)"}, {"date": "2024-02-01", "text": "$1,720 \u2014 monthly (est.)"}, {"date": "2024-03-01", "text": "$1,720 \u2014 monthly (est.)"}, {"date": "2024-04-01", "text": "$1,720 \u2014 monthly (est.)"}, {"date": "2024-05-01", "text": "$1,720 \u2014 monthly (est.)"}, {"date": "2024-06-01", "text": "$1,720 \u2014 monthly (est.)"}, {"date": "2024-07-01", "text": "$1,720 \u2014 monthly (est.)"}, {"date": "2024-08-01", "text": "$1,720 \u2014 monthly (est.)"}, {"date": "2024-09-01", "text": "$1,720 \u2014 monthly (est.)"}, {"date": "2024-10-01", "text": "$1,720 \u2014 monthly (est.)"}, {"date": "2024-11-01", "text": "$1,720 \u2014 monthly (est.)"}, {"date": "2024-12-01", "text": "$1,720 \u2014 monthly (est.)"}, {"date": "2025-01-01", "text": "$1,720 \u2014 monthly (est.)"}, {"date": "2025-02-01", "text": "$1,720 \u2014 monthly (est.)"}, {"date": "2025-03-01", "text": "$1,720 \u2014 monthly (est.)"}, {"date": "2025-04-01", "text": "$1,720 \u2014 monthly (est.)"}, {"date": "2025-05-01", "text": "$1,720 \u2014 monthly (est.)"}, {"date": "2025-06-01", "text": "$1,720 \u2014 monthly (est.)"}, {"date": "2025-07-01", "text": "$1,720 \u2014 monthly (est.)"}, {"date": "2025-08-01", "text": "$1,720 \u2014 monthly (est.)"}, {"date": "2025-09-01", "text": "$1,720 \u2014 monthly (est.)"}, {"date": "2025-10-01", "text": "$1,720 \u2014 monthly (est.)"}, {"date": "2025-11-01", "text": "$1,720 \u2014 monthly (est.)"}],archived:true,archived_date:"2025-11-30"},
  {id:1659,apt:"Montg Studio B",owner:"Elkins LT",name:"Michael Varf",type:"long-term",rent:800.0,balance:0,due:"2025-10-31",note:"Via: Facebook | Tel: 470-478-27-87 | Email: micvarf@gmail.com",history:[{"date": "2025-10-01", "text": "$800 \u2014 monthly (est.)"}],archived:true,archived_date:"2025-10-31"},
  {id:1660,apt:"Montg 3",owner:"Elkins LT",name:"Edgars Family",type:"short-stay",rent:670.81,balance:0,due:"2025-11-01",note:"Via: Airbnb | Tel: 17149866865 | Email: Mar.rmirz@gmail.com",history:[{"date": "2025-10-25", "text": "$670.81 \u2014 stay (2025-10-25 \u2192 2025-11-01)"}],archived:true,archived_date:"2025-11-01"},
  {id:1661,apt:"426-2",owner:"ERA LT",name:"Elston Whitney",type:"short-stay",rent:1713.12,balance:0,due:"2025-11-01",note:"Via: Airbnb | Tel: 2152606506 | Email: Elstonwhitney179@gmail.com",history:[{"date": "2025-10-01", "text": "$1,713.12 \u2014 stay (2025-10-01 \u2192 2025-11-01)"}],archived:true,archived_date:"2025-11-01"},
  {id:1662,apt:"112",owner:"ERA LT",name:"David Tioga Millwrights",type:"short-stay",rent:2757.78,balance:0,due:"2025-11-02",note:"Via: Hostfully | Tel: 5706735027 | Email: david@tiogamillwrights.com",history:[{"date": "2025-10-12", "text": "$2,757.78 \u2014 stay (2025-10-12 \u2192 2025-11-02)"}],archived:true,archived_date:"2025-11-02"},
  {id:1663,apt:"202",owner:"ERA LT",name:"Jennifer Levine",type:"short-stay",rent:2855.36,balance:0,due:"2025-11-02",note:"Via: Airbnb | Tel: 850-890-7513‬",history:[{"date": "2025-09-22", "text": "$2,855.36 \u2014 stay (2025-09-22 \u2192 2025-11-02)"}],archived:true,archived_date:"2025-11-02"},
  {id:1664,apt:"320",owner:"ERA LT",name:"Susan Smith",type:"short-stay",rent:2328.0,balance:0,due:"2025-11-02",note:"Via: Airbnb | Tel: 2675868149 | Email: susanlsmith76@gmail.com",history:[{"date": "2025-09-30", "text": "$2,328.00 \u2014 stay (2025-09-30 \u2192 2025-11-02)"}],archived:true,archived_date:"2025-11-02"},
  {id:1665,apt:"230",owner:"ERA LT",name:"Arturo Ramsden",type:"long-term",rent:1149.92,balance:0,due:"2025-11-03",note:"Via: Hostfully",history:[{"date": "2025-07-01", "text": "$1,150 \u2014 monthly (est.)"}, {"date": "2025-08-01", "text": "$1,150 \u2014 monthly (est.)"}, {"date": "2025-09-01", "text": "$1,150 \u2014 monthly (est.)"}, {"date": "2025-10-01", "text": "$1,150 \u2014 monthly (est.)"}, {"date": "2025-11-01", "text": "$1,150 \u2014 monthly (est.)"}],archived:true,archived_date:"2025-11-03"},
  {id:1666,apt:"301",owner:"ERA LT",name:"Pavel Leyzerzon",type:"long-term",rent:2300.0,balance:0,due:"2025-10-31",note:"Via: facebook | Tel: 215-730-1006 | Email: Pleyzerzon@gmail.com",history:[{"date": "2023-10-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2023-11-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2023-12-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2024-01-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2024-02-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2024-03-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2024-04-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2024-05-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2024-06-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2024-07-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2024-08-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2024-09-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2024-10-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2024-11-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2024-12-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2025-01-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2025-02-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2025-03-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2025-04-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2025-05-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2025-06-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2025-07-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2025-08-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2025-09-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2025-10-01", "text": "$2,300 \u2014 monthly (est.)"}],archived:true,archived_date:"2025-10-31"},
  {id:1667,apt:"302",owner:"ERA LT",name:"Aaron Palmer / Joyetta Palmer",type:"long-term",rent:2100.0,balance:0,due:"2026-03-31",note:"Via: airbnb | Tel: (215) 626-7295 | Email: jpalmer6768@gmail.com",history:[{"date": "2024-03-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2024-04-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2024-05-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2024-06-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2024-07-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2024-08-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2024-09-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2024-10-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2024-11-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2024-12-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2025-01-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2025-02-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2025-03-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2025-04-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2025-05-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2025-06-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2025-07-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2025-08-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2025-09-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2025-10-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2025-11-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2025-12-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2026-01-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2026-02-01", "text": "$2,100 \u2014 monthly (est.)"}, {"date": "2026-03-01", "text": "$2,100 \u2014 monthly (est.)"}],archived:true,archived_date:"2026-03-31"},
  {id:1668,apt:"128",owner:"ERA LT",name:"Raniya Amanova",type:"long-term",rent:1650.0,balance:0,due:"2026-02-28",note:"Via: facebook | Tel: (917) 930-0907 | Email: raniyaarlan007@gmail.com",history:[{"date": "2024-09-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2024-10-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2024-11-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2024-12-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2025-01-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2025-02-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2025-03-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2025-04-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2025-05-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2025-06-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2025-07-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2025-08-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2025-09-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2025-10-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2025-11-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2025-12-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2026-01-01", "text": "$1,650 \u2014 monthly (est.)"}, {"date": "2026-02-01", "text": "$1,650 \u2014 monthly (est.)"}],archived:true,archived_date:"2026-02-28"},
  {id:1669,apt:"210",owner:"ERA LT",name:"Stephen Jackson",type:"short-stay",rent:1292.84,balance:0,due:"2025-11-06",note:"Via: Airbnb | Tel: 447492589009 | Email: ss.jackson123@gmail.com",history:[{"date": "2025-10-29", "text": "$1,292.84 \u2014 stay (2025-10-29 \u2192 2025-11-06)"}],archived:true,archived_date:"2025-11-06"},
  {id:1670,apt:"208",owner:"ERA LT",name:"Jason Turpin",type:"short-stay",rent:1824.77,balance:0,due:"2025-11-08",note:"Via: Airbnb | Tel: 16106363999 | Email: Kyle@turpinlandscapedesign.com",history:[{"date": "2025-10-27", "text": "$1,824.77 \u2014 stay (2025-10-27 \u2192 2025-11-08)"}],archived:true,archived_date:"2025-11-08"},
  {id:1671,apt:"112",owner:"ERA LT",name:"Charmaine Griffin",type:"short-stay",rent:1107.54,balance:0,due:"2025-11-10",note:"Via: Airbnb | Tel: 2158080691",history:[{"date": "2025-11-03", "text": "$1,107.54 \u2014 stay (2025-11-03 \u2192 2025-11-10)"}],archived:true,archived_date:"2025-11-10"},
  {id:1672,apt:"426-2",owner:"ERA LT",name:"Ellie Seo",type:"short-stay",rent:725.56,balance:0,due:"2025-11-14",note:"Via: Airbnb | Tel: 821033580641 | Email: 4200718@naver.com",history:[{"date": "2025-11-06", "text": "$725.56 \u2014 stay (2025-11-06 \u2192 2025-11-14)"}],archived:true,archived_date:"2025-11-14"},
  {id:1673,apt:"Montg 3",owner:"Elkins LT",name:"Patrick Buckvold",type:"short-stay",rent:640.71,balance:0,due:"2025-11-16",note:"Via: Airbnb | Tel: 16124084710 | Email: Omarsabanovic1@gmail.com",history:[{"date": "2025-11-09", "text": "$640.71 \u2014 stay (2025-11-09 \u2192 2025-11-16)"}],archived:true,archived_date:"2025-11-16"},
  {id:1674,apt:"208",owner:"ERA LT",name:"Nicole Skala",type:"short-stay",rent:842.94,balance:0,due:"2025-11-18",note:"Via: Airbnb | Tel: 21553170932 | Email: Nikkis0891@gmail.com",history:[{"date": "2025-11-11", "text": "$842.94 \u2014 stay (2025-11-11 \u2192 2025-11-18)"}],archived:true,archived_date:"2025-11-18"},
  {id:1675,apt:"Montg 2",owner:"Elkins LT",name:"Nataliia Lobodina Nov 18th",type:"long-term",rent:1950.0,balance:0,due:"2026-03-31",note:"Via: facebook | Tel: (215) 872-8983 | Email: kachuyea@arcadia.edu",history:[{"date": "2024-03-01", "text": "$1,950 \u2014 monthly (est.)"}, {"date": "2024-04-01", "text": "$1,950 \u2014 monthly (est.)"}, {"date": "2024-05-01", "text": "$1,950 \u2014 monthly (est.)"}, {"date": "2024-06-01", "text": "$1,950 \u2014 monthly (est.)"}, {"date": "2024-07-01", "text": "$1,950 \u2014 monthly (est.)"}, {"date": "2024-08-01", "text": "$1,950 \u2014 monthly (est.)"}, {"date": "2024-09-01", "text": "$1,950 \u2014 monthly (est.)"}, {"date": "2024-10-01", "text": "$1,950 \u2014 monthly (est.)"}, {"date": "2024-11-01", "text": "$1,950 \u2014 monthly (est.)"}, {"date": "2024-12-01", "text": "$1,950 \u2014 monthly (est.)"}, {"date": "2025-01-01", "text": "$1,950 \u2014 monthly (est.)"}, {"date": "2025-02-01", "text": "$1,950 \u2014 monthly (est.)"}, {"date": "2025-03-01", "text": "$1,950 \u2014 monthly (est.)"}, {"date": "2025-04-01", "text": "$1,950 \u2014 monthly (est.)"}, {"date": "2025-05-01", "text": "$1,950 \u2014 monthly (est.)"}, {"date": "2025-06-01", "text": "$1,950 \u2014 monthly (est.)"}, {"date": "2025-07-01", "text": "$1,950 \u2014 monthly (est.)"}, {"date": "2025-08-01", "text": "$1,950 \u2014 monthly (est.)"}, {"date": "2025-09-01", "text": "$1,950 \u2014 monthly (est.)"}, {"date": "2025-10-01", "text": "$1,950 \u2014 monthly (est.)"}, {"date": "2025-11-01", "text": "$1,950 \u2014 monthly (est.)"}, {"date": "2025-12-01", "text": "$1,950 \u2014 monthly (est.)"}, {"date": "2026-01-01", "text": "$1,950 \u2014 monthly (est.)"}, {"date": "2026-02-01", "text": "$1,950 \u2014 monthly (est.)"}, {"date": "2026-03-01", "text": "$1,950 \u2014 monthly (est.)"}],archived:true,archived_date:"2026-03-31"},
  {id:1676,apt:"215",owner:"ERA LT",name:"Cedric Stone",type:"short-stay",rent:1617.13,balance:0,due:"2025-11-20",note:"Via: Airbnb | Tel: 15136290067 | Email: abblaikie@dvlt.ai",history:[{"date": "2025-10-28", "text": "$1,617.13 \u2014 stay (2025-10-28 \u2192 2025-11-20)"}],archived:true,archived_date:"2025-11-20"},
  {id:1677,apt:"317",owner:"ERA LT",name:"Joseph Taliaferro",type:"short-stay",rent:1179.36,balance:0,due:"2025-11-24",note:"Via: Airbnb | Tel: 12154529575 | Email: josephtaliaferro.it@gmail.com",history:[{"date": "2025-11-15", "text": "$1,179.36 \u2014 stay (2025-11-15 \u2192 2025-11-24)"}],archived:true,archived_date:"2025-11-24"},
  {id:1678,apt:"318",owner:"ERA LT",name:"Leonard Royal",type:"short-stay",rent:1200.34,balance:0,due:"2025-11-23",note:"Via: Airbnb | Tel: 6108005406 | Email: cmartin486@yahoo.com",history:[{"date": "2025-10-10", "text": "$1,200.34 \u2014 stay (2025-10-10 \u2192 2025-11-23)"}],archived:true,archived_date:"2025-11-23"},
  {id:1679,apt:"Montg 5",owner:"Elkins LT",name:"Anthony Huggins",type:"short-stay",rent:1056.51,balance:0,due:"2025-11-25",note:"Via: Airbnb | Tel: 12702563404 | Email: Hugginsateam34@gmail.com",history:[{"date": "2025-11-17", "text": "$1,056.51 \u2014 stay (2025-11-17 \u2192 2025-11-25)"}],archived:true,archived_date:"2025-11-25"},
  {id:1680,apt:"205",owner:"ERA LT",name:"Xinxin Zhang",type:"month-to-month",rent:2375.0,balance:0,due:"",note:"Via: Hostfully | Tel: 5714598530 | Email: 28838577@qq.com",history:[{"date": "2025-09-01", "text": "$2,375 \u2014 monthly (est.)"}, {"date": "2025-10-01", "text": "$2,375 \u2014 monthly (est.)"}, {"date": "2025-11-01", "text": "$2,375 \u2014 monthly (est.)"}, {"date": "2025-12-01", "text": "$2,375 \u2014 monthly (est.)"}, {"date": "2026-01-01", "text": "$2,375 \u2014 monthly (est.)"}, {"date": "2026-02-01", "text": "$2,375 \u2014 monthly (est.)"}, {"date": "2026-03-01", "text": "$2,375 \u2014 monthly (est.)"}],archived:true,archived_date:"2025-09-24"},
  {id:1681,apt:"Melrose C2",owner:"Melrose Properties",name:"Fakayatu Agboola",type:"short-stay",rent:1442.09,balance:0,due:"2025-11-25",note:"Via: Airbnb | Tel: 2154392391 | Email: Olajr11@gmail.com",history:[{"date": "2025-11-07", "text": "$1,442.09 \u2014 stay (2025-11-07 \u2192 2025-11-25)"}],archived:true,archived_date:"2025-11-25"},
  {id:1682,apt:"206",owner:"ERA LT",name:"Margo",type:"long-term",rent:7619.84,balance:0,due:"2025-11-26",note:"Tel: 5202404987 | Email: ronpsych@yahoo.com",history:[{"date": "2025-09-01", "text": "$7,620 \u2014 monthly (est.)"}, {"date": "2025-10-01", "text": "$7,620 \u2014 monthly (est.)"}, {"date": "2025-11-01", "text": "$7,620 \u2014 monthly (est.)"}],archived:true,archived_date:"2025-11-26"},
  {id:1683,apt:"Melrose A1",owner:"Melrose Properties",name:"Marlo Delsordo",type:"short-stay",rent:4098.24,balance:0,due:"2025-12-01",note:"Via: Hostfully | Tel: 2679701879 | Email: mzdcom1@gmail.com",history:[{"date": "2025-11-03", "text": "$4,098.24 \u2014 stay (2025-11-03 \u2192 2025-12-01)"}],archived:true,archived_date:"2025-12-01"},
  {id:1684,apt:"317",owner:"ERA LT",name:"Marty Manson",type:"short-stay",rent:1280.0,balance:0,due:"2025-12-01",note:"Via: Hostfully | Tel: 13237172876 | Email: liz.matusow@gmail.com",history:[{"date": "2025-11-24", "text": "$1,280.00 \u2014 stay (2025-11-24 \u2192 2025-12-01)"}],archived:true,archived_date:"2025-12-01"},
  {id:1685,apt:"215",owner:"ERA LT",name:"Bob Seltzer",type:"short-stay",rent:1172.78,balance:0,due:"2025-12-01",note:"Via: Vrbo | Tel: 908-963-7628 | Email: rkseltzer@comcast.net",history:[{"date": "2025-11-24", "text": "$1,172.78 \u2014 stay (2025-11-24 \u2192 2025-12-01)"}],archived:true,archived_date:"2025-12-01"},
  {id:1686,apt:"Fox Chase  1",owner:"Fox Chase Properties",name:"Adrienne Branch",type:"long-term",rent:2000.0,balance:0,due:"2025-11-30",note:"Via: Airbnb | Tel: 2152371293 her son 484-684-2107",history:[{"date": "2025-07-01", "text": "$2,000 \u2014 monthly (est.)"}, {"date": "2025-08-01", "text": "$2,000 \u2014 monthly (est.)"}, {"date": "2025-09-01", "text": "$2,000 \u2014 monthly (est.)"}, {"date": "2025-10-01", "text": "$2,000 \u2014 monthly (est.)"}, {"date": "2025-11-01", "text": "$2,000 \u2014 monthly (est.)"}],archived:true,archived_date:"2025-11-30"},
  {id:1687,apt:"115",owner:"ERA LT",name:"Shieba Johnson",type:"short-stay",rent:2175.47,balance:0,due:"2025-11-30",note:"Via: Airbnb | Tel: 12678195528 | Email: shieba.Johnson@gmail.com",history:[{"date": "2025-11-12", "text": "$2,175.47 \u2014 stay (2025-11-12 \u2192 2025-11-30)"}],archived:true,archived_date:"2025-11-30"},
  {id:1688,apt:"208",owner:"ERA LT",name:"Made Nugraha",type:"short-stay",rent:1398.6,balance:0,due:"2025-11-30",note:"Via: Airbnb | Tel: 15672840202 | Email: madenugraha99@gmail.com",history:[{"date": "2025-11-20", "text": "$1,398.60 \u2014 stay (2025-11-20 \u2192 2025-11-30)"}],archived:true,archived_date:"2025-11-30"},
  {id:1689,apt:"202",owner:"ERA LT",name:"Roslyn Smith",type:"short-stay",rent:2113.37,balance:0,due:"2025-11-30",note:"Via: Airbnb | Tel: 18453137455 | Email: roz.smith@sunyorange.edu",history:[{"date": "2025-11-15", "text": "$2,113.37 \u2014 stay (2025-11-15 \u2192 2025-11-30)"}],archived:true,archived_date:"2025-11-30"},
  {id:1690,apt:"112",owner:"ERA LT",name:"Jessica Cifaldi",type:"short-stay",rent:2288.45,balance:0,due:"2025-11-30",note:"Via: Airbnb | Tel: 215)554-8395 | Email: jessica.cifaldi@homevestors.com",history:[{"date": "2025-11-11", "text": "$2,288.45 \u2014 stay (2025-11-11 \u2192 2025-11-30)"}],archived:true,archived_date:"2025-11-30"},
  {id:1691,apt:"212",owner:"ERA LT",name:"Zachary Toal",type:"short-stay",rent:1283.31,balance:0,due:"2025-11-30",note:"Via: Airbnb | Tel: 16785917860 | Email: Zbtpost1@gmail.com",history:[{"date": "2025-11-22", "text": "$1,283.31 \u2014 stay (2025-11-22 \u2192 2025-11-30)"}],archived:true,archived_date:"2025-11-30"},
  {id:1692,apt:"301",owner:"ERA LT",name:"Angela Campbell",type:"short-stay",rent:959.84,balance:0,due:"2025-11-29",note:"Via: Airbnb | Tel: 2152648776 | Email: Drangelacampbell@gmail.com",history:[{"date": "2025-11-22", "text": "$959.84 \u2014 stay (2025-11-22 \u2192 2025-11-29)"}],archived:true,archived_date:"2025-11-29"},
  {id:1693,apt:"Montg 3",owner:"Elkins LT",name:"Pat Imms",type:"short-stay",rent:1100.6,balance:0,due:"2025-11-29",note:"Via: Vrbo | Tel: 12157047679 | Email: Immspitts@aol.com",history:[{"date": "2025-11-19", "text": "$1,100.60 \u2014 stay (2025-11-19 \u2192 2025-11-29)"}],archived:true,archived_date:"2025-11-29"},
  {id:1694,apt:"Montg 2",owner:"Elkins LT",name:"Tanika Duncan",type:"short-stay",rent:893.02,balance:0,due:"2025-11-29",note:"Via: Airbnb | Tel: 12159617698 | Email: Tandunnie@gmail.com",history:[{"date": "2025-11-20", "text": "$893.02 \u2014 stay (2025-11-20 \u2192 2025-11-29)"}],archived:true,archived_date:"2025-11-29"},
  {id:1695,apt:"132",owner:"ERA LT",name:"Ted L",type:"short-stay",rent:1869.05,balance:0,due:"2025-11-29",note:"Via: Airbnb | Tel: 17024155594 | Email: tedlewins@gmail.com",history:[{"date": "2025-11-15", "text": "$1,869.05 \u2014 stay (2025-11-15 \u2192 2025-11-29)"}],archived:true,archived_date:"2025-11-29"},
  {id:1696,apt:"128",owner:"ERA LT",name:"Olena Petriieva",type:"short-stay",rent:729.54,balance:0,due:"2025-11-28",note:"Via: Airbnb | Tel: 17737549745 | Email: Bosaley92@gmail.com",history:[{"date": "2025-11-21", "text": "$729.54 \u2014 stay (2025-11-21 \u2192 2025-11-28)"}],archived:true,archived_date:"2025-11-28"},
  {id:1697,apt:"221",owner:"ERA LT",name:"Xiomara Shrewsbury",type:"short-stay",rent:2343.44,balance:0,due:"2025-11-28",note:"Via: Airbnb | Tel: 6142093267 | Email: Xshrewsbury@gmail.com",history:[{"date": "2025-10-31", "text": "$2,343.44 \u2014 stay (2025-10-31 \u2192 2025-11-28)"}],archived:true,archived_date:"2025-11-28"},
  {id:1698,apt:"320",owner:"ERA LT",name:"Andrew Taylor",type:"short-stay",rent:94.5,balance:0,due:"2025-12-01",note:"Via: Airbnb | Tel: 2673221296",history:[{"date": "2025-11-25", "text": "$94.50 \u2014 stay (2025-11-25 \u2192 2025-12-01)"}],archived:true,archived_date:"2025-12-01"},
  {id:1699,apt:"426-3",owner:"ERA LT",name:"Yulianna Hukova",type:"short-stay",rent:1212.69,balance:0,due:"2025-12-04",note:"Via: Airbnb | Tel: 19369557343 | Email: Yuliannafuture21@gmail.com",history:[{"date": "2025-11-21", "text": "$1,212.69 \u2014 stay (2025-11-21 \u2192 2025-12-04)"}],archived:true,archived_date:"2025-12-04"},
  {id:1700,apt:"426-2",owner:"ERA LT",name:"Giorgi Mtchedlidze",type:"short-stay",rent:878.9,balance:0,due:"2025-12-04",note:"Via: Airbnb | Tel: 3322000155 | Email: m.mchedlidze.1997@gmail.com",history:[{"date": "2025-11-21", "text": "$878.90 \u2014 stay (2025-11-21 \u2192 2025-12-04)"}],archived:true,archived_date:"2025-12-04"},
  {id:1701,apt:"206",owner:"ERA LT",name:"Elizabeth Thomas",type:"short-stay",rent:527.28,balance:0,due:"2025-12-09",note:"Via: Airbnb | Tel: 14046640080 | Email: Fashionjinger@gmail.com",history:[{"date": "2025-12-02", "text": "$527.28 \u2014 stay (2025-12-02 \u2192 2025-12-09)"}],archived:true,archived_date:"2025-12-09"},
  {id:1702,apt:"210",owner:"ERA LT",name:"Hanae Belrhiti",type:"short-stay",rent:3852.6,balance:0,due:"2026-01-09",note:"Via: Hostfully | Tel: 2679451552 / his numbert 2156020072 | Email: HanaeBelrhiti@gmail.com",history:[{"date": "2025-11-07", "text": "$3,852.60 \u2014 stay (2025-11-07 \u2192 2026-01-09)"}],archived:true,archived_date:"2026-01-09"},
  {id:1703,apt:"Melrose C2",owner:"Melrose Properties",name:"Christopher Murray",type:"short-stay",rent:692.68,balance:0,due:"2025-12-08",note:"Via: Airbnb | Tel: 14436555352 | Email: cdmurray88@gmail.com",history:[{"date": "2025-12-01", "text": "$692.68 \u2014 stay (2025-12-01 \u2192 2025-12-08)"}],archived:true,archived_date:"2025-12-08"},
  {id:1704,apt:"Melrose B1",owner:"Melrose Properties",name:"Kimberly Allen",type:"short-stay",rent:1172.3,balance:0,due:"2025-12-08",note:"Via: Airbnb | Tel: 12678062427 | Email: K.allen@hallmoorecorp.com",history:[{"date": "2025-10-25", "text": "$1,172.30 \u2014 stay (2025-10-25 \u2192 2025-12-08)"}],archived:true,archived_date:"2025-12-08"},
  {id:1705,apt:"Melrose C1",owner:"Melrose Properties",name:"Mary Barnes",type:"short-stay",rent:850.22,balance:0,due:"2025-12-12",note:"Via: Airbnb | Tel: 18146731784",history:[{"date": "2025-10-20", "text": "$850.22 \u2014 stay (2025-10-20 \u2192 2025-12-12)"}],archived:true,archived_date:"2025-12-12"},
  {id:1706,apt:"314",owner:"ERA LT",name:"Arina Matysko",type:"month-to-month",rent:2000.0,balance:0,due:"",note:"Via: FB | Tel: (267) 243-5725 | Email: matiskoarina91@gmail.com",history:[{"date": "2025-09-01", "text": "$2,000 \u2014 monthly (est.)"}, {"date": "2025-10-01", "text": "$2,000 \u2014 monthly (est.)"}, {"date": "2025-11-01", "text": "$2,000 \u2014 monthly (est.)"}, {"date": "2025-12-01", "text": "$2,000 \u2014 monthly (est.)"}, {"date": "2026-01-01", "text": "$2,000 \u2014 monthly (est.)"}, {"date": "2026-02-01", "text": "$2,000 \u2014 monthly (est.)"}, {"date": "2026-03-01", "text": "$2,000 \u2014 monthly (est.)"}],archived:true,archived_date:"2025-09-19"},
  {id:1707,apt:"426-2",owner:"ERA LT",name:"Chris Murphy",type:"short-stay",rent:820.93,balance:0,due:"2025-12-22",note:"Via: Airbnb | Tel: 12153052720 | Email: Murphy.chris4505@gmail.com",history:[{"date": "2025-12-12", "text": "$820.93 \u2014 stay (2025-12-12 \u2192 2025-12-22)"}],archived:true,archived_date:"2025-12-22"},
  {id:1708,apt:"332",owner:"ERA LT",name:"Arturo Ramsden",type:"long-term",rent:3889.68,balance:0,due:"2025-12-22",note:"Via: Hostfully | Tel: 9564798548 | Email: arturodramsden@gmail.com",history:[{"date": "2025-06-01", "text": "$3,890 \u2014 monthly (est.)"}, {"date": "2025-07-01", "text": "$3,890 \u2014 monthly (est.)"}, {"date": "2025-08-01", "text": "$3,890 \u2014 monthly (est.)"}, {"date": "2025-09-01", "text": "$3,890 \u2014 monthly (est.)"}, {"date": "2025-10-01", "text": "$3,890 \u2014 monthly (est.)"}, {"date": "2025-11-01", "text": "$3,890 \u2014 monthly (est.)"}, {"date": "2025-12-01", "text": "$3,890 \u2014 monthly (est.)"}],archived:true,archived_date:"2025-12-22"},
  {id:1709,apt:"Montg 5",owner:"Elkins LT",name:"Defrim Imeri",type:"short-stay",rent:1625.1,balance:0,due:"2025-12-25",note:"Via: Hostfully | Tel: 12672960352 | Email: Defrimimeri@gmail.com",history:[{"date": "2025-12-16", "text": "$1,625.10 \u2014 stay (2025-12-16 \u2192 2025-12-25)"}],archived:true,archived_date:"2025-12-25"},
  {id:1710,apt:"Montg 3",owner:"Elkins LT",name:"Pete Estep",type:"short-stay",rent:1008.31,balance:0,due:"2025-12-28",note:"Via: Airbnb | Tel: 16175041672 | Email: pwestep@yahoo.com",history:[{"date": "2025-12-21", "text": "$1,008.31 \u2014 stay (2025-12-21 \u2192 2025-12-28)"}],archived:true,archived_date:"2025-12-28"},
  {id:1711,apt:"Melrose C1",owner:"Melrose Properties",name:"Alison Wynn",type:"short-stay",rent:688.18,balance:0,due:"2025-12-29",note:"Via: Airbnb | Tel: 17086536605 | Email: aliscwynn@gmail.com",history:[{"date": "2025-12-22", "text": "$688.18 \u2014 stay (2025-12-22 \u2192 2025-12-29)"}],archived:true,archived_date:"2025-12-29"},
  {id:1712,apt:"Melrose C2",owner:"Melrose Properties",name:"Timothy Kregiel",type:"short-stay",rent:533.92,balance:0,due:"2025-12-27",note:"Via: Airbnb | Tel: 14122657521 | Email: jusaylico24@gmail.com",history:[{"date": "2025-12-22", "text": "$533.92 \u2014 stay (2025-12-22 \u2192 2025-12-27)"}],archived:true,archived_date:"2025-12-27"},
  {id:1713,apt:"208",owner:"ERA LT",name:"Daina Gulbis",type:"long-term",rent:2325.0,balance:0,due:"2026-11-30",note:"Via: Zillow | Tel: (267) 345-3719 | Email: renday0919@gmail.com",history:[{"date": "2025-12-01", "text": "$2,325 \u2014 monthly (est.)"}, {"date": "2026-01-01", "text": "$2,325 \u2014 monthly (est.)"}, {"date": "2026-02-01", "text": "$2,325 \u2014 monthly (est.)"}, {"date": "2026-03-01", "text": "$2,325 \u2014 monthly (est.)"}],archived:true,archived_date:"2026-11-30"},
  {id:1714,apt:"325",owner:"ERA LT",name:"Donghyon Lee, Seong Moon",type:"month-to-month",rent:1700.0,balance:0,due:"",note:"Via: Lindy | Tel: 215-954-2732 | Email: tevinlee2871@gmail.com",history:[{"date": "2022-06-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2022-07-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2022-08-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2022-09-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2022-10-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2022-11-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2022-12-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2023-01-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2023-02-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2023-03-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2023-04-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2023-05-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2023-06-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2023-07-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2023-08-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2023-09-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2023-10-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2023-11-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2023-12-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2024-01-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2024-02-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2024-03-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2024-04-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2024-05-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2024-06-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2024-07-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2024-08-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2024-09-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2024-10-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2024-11-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2024-12-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2025-01-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2025-02-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2025-03-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2025-04-01", "text": "$1,700 \u2014 monthly (est.)"}, {"date": "2025-05-01", "text": "$1,700 \u2014 monthly (est.)"}],archived:true,archived_date:"2022-06-01"},
  {id:1715,apt:"Melrose A1",owner:"Melrose Properties",name:"Hannah Fried Petersen",type:"short-stay",rent:2258.76,balance:0,due:"2025-12-31",note:"Via: Hostfully | Tel: 4792270882 | Email: hannahfriedpetersen@gmail.com",history:[{"date": "2025-12-13", "text": "$2,258.76 \u2014 stay (2025-12-13 \u2192 2025-12-31)"}],archived:true,archived_date:"2025-12-31"},
  {id:1716,apt:"230",owner:"ERA LT",name:"Airion Seay",type:"short-stay",rent:4026.72,balance:0,due:"2025-12-31",note:"Via: Airbnb | Tel: 14048408758 | Email: Acseay@treaselectric.com",history:[{"date": "2025-11-10", "text": "$4,026.72 \u2014 stay (2025-11-10 \u2192 2025-12-31)"}],archived:true,archived_date:"2025-12-31"},
  {id:1717,apt:"314",owner:"ERA LT",name:"Katherine Tait",type:"short-stay",rent:965.79,balance:0,due:"2025-12-31",note:"Via: Airbnb | Tel: 17038689390 | Email: donleecontractor@gmail.com",history:[{"date": "2025-12-20", "text": "$965.79 \u2014 stay (2025-12-20 \u2192 2025-12-31)"}],archived:true,archived_date:"2025-12-31"},
  {id:1718,apt:"426-2",owner:"ERA LT",name:"Alton Clarke",type:"short-stay",rent:616.16,balance:0,due:"2026-01-01",note:"Via: Airbnb | Tel: 16026400735 | Email: netneb10x@gmail.com",history:[{"date": "2025-12-25", "text": "$616.16 \u2014 stay (2025-12-25 \u2192 2026-01-01)"}],archived:true,archived_date:"2026-01-01"},
  {id:1719,apt:"426-Studio",owner:"ERA LT",name:"Allen Carter moving",type:"long-term",rent:800.0,balance:0,due:"2026-01-31",note:"Via: Airbnb | Tel: (267) 441-6786",history:[{"date": "2024-12-01", "text": "$800 \u2014 monthly (est.)"}, {"date": "2025-01-01", "text": "$800 \u2014 monthly (est.)"}, {"date": "2025-02-01", "text": "$800 \u2014 monthly (est.)"}, {"date": "2025-03-01", "text": "$800 \u2014 monthly (est.)"}, {"date": "2025-04-01", "text": "$800 \u2014 monthly (est.)"}, {"date": "2025-05-01", "text": "$800 \u2014 monthly (est.)"}, {"date": "2025-06-01", "text": "$800 \u2014 monthly (est.)"}, {"date": "2025-07-01", "text": "$800 \u2014 monthly (est.)"}, {"date": "2025-08-01", "text": "$800 \u2014 monthly (est.)"}, {"date": "2025-09-01", "text": "$800 \u2014 monthly (est.)"}, {"date": "2025-10-01", "text": "$800 \u2014 monthly (est.)"}, {"date": "2025-11-01", "text": "$800 \u2014 monthly (est.)"}, {"date": "2025-12-01", "text": "$800 \u2014 monthly (est.)"}, {"date": "2026-01-01", "text": "$800 \u2014 monthly (est.)"}],archived:true,archived_date:"2026-01-31"},
  {id:1720,apt:"206",owner:"ERA LT",name:"Brooke Fuller",type:"short-stay",rent:1305.04,balance:0,due:"2026-01-03",note:"Via: Airbnb | Tel: 7202995822 | Email: cameronshiff@gmail.com",history:[{"date": "2025-12-21", "text": "$1,305.04 \u2014 stay (2025-12-21 \u2192 2026-01-03)"}],archived:true,archived_date:"2026-01-03"},
  {id:1721,apt:"Fox Chase  1",owner:"Fox Chase Properties",name:"Dwight Patton",type:"short-stay",rent:768.28,balance:0,due:"2026-01-04",note:"Via: Airbnb | Tel: 13043087514",history:[{"date": "2025-12-28", "text": "$768.28 \u2014 stay (2025-12-28 \u2192 2026-01-04)"}],archived:true,archived_date:"2026-01-04"},
  {id:1722,apt:"Montg 6",owner:"Elkins LT",name:"Adam Shane",type:"long-term",rent:7822.37,balance:0,due:"2026-02-03",note:"Via: Airbnb | Tel: 16104515069 | Email: adam.b.shane@gmail.com",history:[{"date": "2025-11-01", "text": "$7,822 \u2014 monthly (est.)"}, {"date": "2025-12-01", "text": "$7,822 \u2014 monthly (est.)"}, {"date": "2026-01-01", "text": "$7,822 \u2014 monthly (est.)"}, {"date": "2026-02-01", "text": "$7,822 \u2014 monthly (est.)"}],archived:true,archived_date:"2026-02-03"},
  {id:1723,apt:"221",owner:"ERA LT",name:"Raseta Cheeves",type:"short-stay",rent:749.38,balance:0,due:"2026-01-12",note:"Via: Airbnb | Tel: 12155719681 | Email: Montelubin37@gmail.com",history:[{"date": "2025-12-18", "text": "$749.38 \u2014 stay (2025-12-18 \u2192 2026-01-12)"}],archived:true,archived_date:"2026-01-12"},
  {id:1724,apt:"Melrose B2",owner:"Melrose Properties",name:"Precious Hicks",type:"short-stay",rent:1067.7,balance:0,due:"2026-01-09",note:"Via: Booking | Tel: 14452106367 | Email: Jessie1200999@gmail.com",history:[{"date": "2025-10-19", "text": "$1,067.70 \u2014 stay (2025-10-19 \u2192 2026-01-09)"}],archived:true,archived_date:"2026-01-09"},
  {id:1725,apt:"211",owner:"ERA LT",name:"Lasha Tadumadze",type:"long-term",rent:0.0,balance:0,due:"2026-01-31",note:"Tel: (347) 731-0009, 215-646-5900",history:[],archived:true,archived_date:"2026-01-31"},
  {id:1726,apt:"Montg 5B",owner:"Elkins LT",name:"Mary Wilson",type:"long-term",rent:1250.0,balance:0,due:"2026-08-31",note:"Via: Airbnb | Tel: 6179097615 | Email: mamiewilsonnn@gmail.com",history:[{"date": "2025-09-01", "text": "$1,250 \u2014 monthly (est.)"}, {"date": "2025-10-01", "text": "$1,250 \u2014 monthly (est.)"}, {"date": "2025-11-01", "text": "$1,250 \u2014 monthly (est.)"}, {"date": "2025-12-01", "text": "$1,250 \u2014 monthly (est.)"}, {"date": "2026-01-01", "text": "$1,250 \u2014 monthly (est.)"}, {"date": "2026-02-01", "text": "$1,250 \u2014 monthly (est.)"}, {"date": "2026-03-01", "text": "$1,250 \u2014 monthly (est.)"}],archived:true,archived_date:"2026-08-31"},
  {id:1727,apt:"Fox Chase  2",owner:"Fox Chase Properties",name:"Vitali Siamizhon",type:"short-stay",rent:1749.65,balance:0,due:"2025-12-20",note:"Via: Airbnb | Tel: 12674718202 | Email: Semvitali84@gmail.com",history:[{"date": "2025-10-18", "text": "$1,749.65 \u2014 stay (2025-10-18 \u2192 2025-12-20)"}],archived:true,archived_date:"2025-12-20"},
  {id:1728,apt:"Montg 5B",owner:"Elkins LT",name:"Leo Duross",type:"short-stay",rent:514.08,balance:0,due:"2026-01-23",note:"Via: Airbnb | Tel: 267-779-2059 | Email: leo32eagles@gmail.com",history:[{"date": "2026-01-16", "text": "$514.08 \u2014 stay (2026-01-16 \u2192 2026-01-23)"}],archived:true,archived_date:"2026-01-23"},
  {id:1729,apt:"128",owner:"ERA LT",name:"Tiffany Clanton",type:"short-stay",rent:1209.47,balance:0,due:"2026-01-29",note:"Via: Booking | Tel: 2159066510 | Email: tiffanyclanton2213@gmail.com",history:[{"date": "2026-01-15", "text": "$1,209.47 \u2014 stay (2026-01-15 \u2192 2026-01-29)"}],archived:true,archived_date:"2026-01-29"},
  {id:1730,apt:"202",owner:"ERA LT",name:"Max Minkoff",type:"short-stay",rent:1434.51,balance:0,due:"2026-01-30",note:"Via: Airbnb | Tel: 2153279447 | Email: max@planetminkoff.com",history:[{"date": "2026-01-19", "text": "$1,434.51 \u2014 stay (2026-01-19 \u2192 2026-01-30)"}],archived:true,archived_date:"2026-01-30"},
  {id:1731,apt:"210",owner:"ERA LT",name:"Luis Martinez",type:"short-stay",rent:1690.45,balance:0,due:"2026-02-04",note:"Via: Airbnb | Tel: 2312150595 | Email: Luismartinez127542@gmail.com",history:[{"date": "2026-01-21", "text": "$1,690.45 \u2014 stay (2026-01-21 \u2192 2026-02-04)"}],archived:true,archived_date:"2026-02-04"},
  {id:1732,apt:"208",owner:"ERA LT",name:"Shanna Caster",type:"short-stay",rent:1514.83,balance:0,due:"2026-01-31",note:"Via: Airbnb | Tel: 2672100652 | Email: Rossholmes91@gmail.com",history:[{"date": "2026-01-17", "text": "$1,514.83 \u2014 stay (2026-01-17 \u2192 2026-01-31)"}],archived:true,archived_date:"2026-01-31"},
  {id:1733,apt:"310",owner:"ERA LT",name:"Farrukh Kurbanov",type:"long-term",rent:2300.0,balance:0,due:"2026-09-30",note:"Via: facebook | Tel: (445) 888-1315 | Email: kurbanovfarrukh662@gmail.com",history:[{"date": "2025-10-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2025-11-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2025-12-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2026-01-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2026-02-01", "text": "$2,300 \u2014 monthly (est.)"}, {"date": "2026-03-01", "text": "$2,300 \u2014 monthly (est.)"}],archived:true,archived_date:"2026-09-30"},
  {id:1734,apt:"104",owner:"ERA LT",name:"Anna D'onofrio",type:"long-term",rent:11041.07,balance:0,due:"2026-02-07",note:"Via: Vrbo | Tel: 7247575692 | Email: donofrioa212@gmail.com",history:[{"date": "2025-11-01", "text": "$11,041 \u2014 monthly (est.)"}, {"date": "2025-12-01", "text": "$11,041 \u2014 monthly (est.)"}, {"date": "2026-01-01", "text": "$11,041 \u2014 monthly (est.)"}, {"date": "2026-02-01", "text": "$11,041 \u2014 monthly (est.)"}],archived:true,archived_date:"2026-02-07"},
  {id:1735,apt:"Montg 3",owner:"Elkins LT",name:"Serena May",type:"short-stay",rent:1373.2,balance:0,due:"2026-02-13",note:"Via: Airbnb | Tel: 12154162252 | Email: imani.jones.ij@gmail.com",history:[{"date": "2026-01-31", "text": "$1,373.20 \u2014 stay (2026-01-31 \u2192 2026-02-13)"}],archived:true,archived_date:"2026-02-13"},
  {id:1736,apt:"Fox Chase  2",owner:"Fox Chase Properties",name:"Dean Kraushaar",type:"short-stay",rent:524.47,balance:0,due:"2026-02-17",note:"Via: Airbnb | Tel: 13154404490 | Email: dmk1976@gmail.com",history:[{"date": "2026-02-12", "text": "$524.47 \u2014 stay (2026-02-12 \u2192 2026-02-17)"}],archived:true,archived_date:"2026-02-17"},
  {id:1737,apt:"330",owner:"ERA LT",name:"Katelyn Harrison",type:"month-to-month",rent:2250.0,balance:0,due:"",note:"Via: Hostfully | Tel: (814) 533-1130 | Email: kharrison123123@aol.com",history:[{"date": "2025-11-01", "text": "$2,250 \u2014 monthly (est.)"}, {"date": "2025-12-01", "text": "$2,250 \u2014 monthly (est.)"}, {"date": "2026-01-01", "text": "$2,250 \u2014 monthly (est.)"}, {"date": "2026-02-01", "text": "$2,250 \u2014 monthly (est.)"}, {"date": "2026-03-01", "text": "$2,250 \u2014 monthly (est.)"}],archived:true,archived_date:"2025-11-05"},
  {id:1738,apt:"215",owner:"ERA LT",name:"Nadav Zipory",type:"short-stay",rent:703.08,balance:0,due:"2026-02-18",note:"Via: Airbnb | Tel: 3642030741 | Email: Nadavzipori@gmail.com",history:[{"date": "2026-02-12", "text": "$703.08 \u2014 stay (2026-02-12 \u2192 2026-02-18)"}],archived:true,archived_date:"2026-02-18"},
  {id:1739,apt:"112",owner:"ERA LT",name:"Dylan Hightower",type:"short-stay",rent:1333.64,balance:0,due:"2026-02-19",note:"Via: Airbnb | Tel: 16787675013 | Email: Dylan.Hightower12@gmail.com",history:[{"date": "2026-01-11", "text": "$1,333.64 \u2014 stay (2026-01-11 \u2192 2026-02-19)"}],archived:true,archived_date:"2026-02-19"},
  {id:1740,apt:"206",owner:"ERA LT",name:"Mukhammad Bokiev",type:"short-stay",rent:589.68,balance:0,due:"2026-02-20",note:"Via: Airbnb | Tel: 16157881055 | Email: mukhammadbokiev55@gmail.com",history:[{"date": "2026-01-31", "text": "$589.68 \u2014 stay (2026-01-31 \u2192 2026-02-20)"}],archived:true,archived_date:"2026-02-20"},
  {id:1741,apt:"221",owner:"ERA LT",name:"Quinn Moss",type:"long-term",rent:801.44,balance:0,due:"2026-02-27",note:"Via: facebook | Tel: 8164097560 | Email: mossquinn888@gmail.com",history:[{"date": "2026-02-01", "text": "$801 \u2014 monthly (est.)"}],archived:true,archived_date:"2026-02-27"},
  {id:1742,apt:"Melrose B1",owner:"Melrose Properties",name:"Gurami Inadze",type:"long-term",rent:1799.28,balance:0,due:"2026-03-01",note:"Via: facebook | Tel: 12675826013 | Email: Alonatryzna@gmail.com",history:[{"date": "2026-02-01", "text": "$1,799 \u2014 monthly (est.)"}, {"date": "2026-03-01", "text": "$1,799 \u2014 monthly (est.)"}],archived:true,archived_date:"2026-03-01"},
  {id:1743,apt:"Montg 8",owner:"Elkins LT",name:"David Zarandia",type:"long-term",rent:1180.0,balance:0,due:"2026-02-28",note:"Via: facebook | Tel: (267) 979-4540 | Email: datazarandia@yahoo.com",history:[{"date": "2024-03-01", "text": "$1,180 \u2014 monthly (est.)"}, {"date": "2024-04-01", "text": "$1,180 \u2014 monthly (est.)"}, {"date": "2024-05-01", "text": "$1,180 \u2014 monthly (est.)"}, {"date": "2024-06-01", "text": "$1,180 \u2014 monthly (est.)"}, {"date": "2024-07-01", "text": "$1,180 \u2014 monthly (est.)"}, {"date": "2024-08-01", "text": "$1,180 \u2014 monthly (est.)"}, {"date": "2024-09-01", "text": "$1,180 \u2014 monthly (est.)"}, {"date": "2024-10-01", "text": "$1,180 \u2014 monthly (est.)"}, {"date": "2024-11-01", "text": "$1,180 \u2014 monthly (est.)"}, {"date": "2024-12-01", "text": "$1,180 \u2014 monthly (est.)"}, {"date": "2025-01-01", "text": "$1,180 \u2014 monthly (est.)"}, {"date": "2025-02-01", "text": "$1,180 \u2014 monthly (est.)"}, {"date": "2025-03-01", "text": "$1,180 \u2014 monthly (est.)"}, {"date": "2025-04-01", "text": "$1,180 \u2014 monthly (est.)"}, {"date": "2025-05-01", "text": "$1,180 \u2014 monthly (est.)"}, {"date": "2025-06-01", "text": "$1,180 \u2014 monthly (est.)"}, {"date": "2025-07-01", "text": "$1,180 \u2014 monthly (est.)"}, {"date": "2025-08-01", "text": "$1,180 \u2014 monthly (est.)"}, {"date": "2025-09-01", "text": "$1,180 \u2014 monthly (est.)"}, {"date": "2025-10-01", "text": "$1,180 \u2014 monthly (est.)"}, {"date": "2025-11-01", "text": "$1,180 \u2014 monthly (est.)"}, {"date": "2025-12-01", "text": "$1,180 \u2014 monthly (est.)"}, {"date": "2026-01-01", "text": "$1,180 \u2014 monthly (est.)"}, {"date": "2026-02-01", "text": "$1,180 \u2014 monthly (est.)"}],archived:true,archived_date:"2026-02-28"},
  {id:1744,apt:"207",owner:"ERA LT",name:"Liliia Pylypenko, Lats Honchar",type:"long-term",rent:1620.0,balance:0,due:"2026-09-30",note:"Via: FB | Tel: (929) 713-3433 | Email: lilypilipenko8990@gmail.com",history:[{"date": "2025-09-01", "text": "$1,620 \u2014 monthly (est.)"}, {"date": "2025-10-01", "text": "$1,620 \u2014 monthly (est.)"}, {"date": "2025-11-01", "text": "$1,620 \u2014 monthly (est.)"}, {"date": "2025-12-01", "text": "$1,620 \u2014 monthly (est.)"}, {"date": "2026-01-01", "text": "$1,620 \u2014 monthly (est.)"}, {"date": "2026-02-01", "text": "$1,620 \u2014 monthly (est.)"}, {"date": "2026-03-01", "text": "$1,620 \u2014 monthly (est.)"}],archived:true,archived_date:"2026-09-30"},
  {id:1745,apt:"Montg 5B",owner:"Elkins LT",name:"Ben Pepka",type:"short-stay",rent:1842.15,balance:0,due:"2026-03-08",note:"Via: Airbnb | Tel: 12158724507 | Email: jacobmk@verizon.net",history:[{"date": "2026-02-01", "text": "$1,842.15 \u2014 stay (2026-02-01 \u2192 2026-03-08)"}],archived:true,archived_date:"2026-03-08"},
  {id:1746,apt:"Fox Chase  2",owner:"Fox Chase Properties",name:"Darnell Myers",type:"short-stay",rent:747.78,balance:0,due:"2026-03-11",note:"Via: Booking | Tel: 12676089614 | Email: Kristi.garrison@yaoo.com",history:[{"date": "2026-03-04", "text": "$747.78 \u2014 stay (2026-03-04 \u2192 2026-03-11)"}],archived:true,archived_date:"2026-03-11"},
  {id:1747,apt:"Melrose C1",owner:"Melrose Properties",name:"Bodo Stein",type:"short-stay",rent:1420.66,balance:0,due:"2026-03-12",note:"Via: Booking | Tel: 4915222678848 | Email: Bodo.Stein@duecker.com",history:[{"date": "2026-02-25", "text": "$1,420.66 \u2014 stay (2026-02-25 \u2192 2026-03-12)"}],archived:true,archived_date:"2026-03-12"},
  {id:1748,apt:"331",owner:"ERA LT",name:"Jessica Zicherman",type:"month-to-month",rent:2320.0,balance:0,due:"",note:"Via: Vrbo | Tel: (484) 523-0864 | Email: zichermanjesse@gmail.com",history:[{"date": "2025-10-01", "text": "$2,320 \u2014 monthly (est.)"}, {"date": "2025-11-01", "text": "$2,320 \u2014 monthly (est.)"}, {"date": "2025-12-01", "text": "$2,320 \u2014 monthly (est.)"}, {"date": "2026-01-01", "text": "$2,320 \u2014 monthly (est.)"}, {"date": "2026-02-01", "text": "$2,320 \u2014 monthly (est.)"}, {"date": "2026-03-01", "text": "$2,320 \u2014 monthly (est.)"}],archived:true,archived_date:"2025-10-18"},
  {id:1749,apt:"318",owner:"ERA LT",name:"John Nelson",type:"short-stay",rent:1010.2,balance:0,due:"2026-03-18",note:"Via: Airbnb | Tel: 15853559077 | Email: none@example.com",history:[{"date": "2026-03-03", "text": "$1,010.20 \u2014 stay (2026-03-03 \u2192 2026-03-18)"}],archived:true,archived_date:"2026-03-18"},
  {id:1750,apt:"Melrose B1",owner:"Melrose Properties",name:"Brielle Julius",type:"short-stay",rent:606.69,balance:0,due:"2026-03-22",note:"Via: Airbnb | Tel: 12679341121 | Email: Briellesheed@gmail.com",history:[{"date": "2026-03-13", "text": "$606.69 \u2014 stay (2026-03-13 \u2192 2026-03-22)"}],archived:true,archived_date:"2026-03-22"}
];let data = [];
let archived = [];
let nextId = 80;
let currentStatFilter='all', currentTypeFilter='all', detailId=null, payType='full';
let reportMonth=new Date().getMonth(), reportYear=new Date().getFullYear();
let typeChartInst=null, collChartInst=null, trendChartInst=null;

// ── SUPABASE ───────────────────────────────────────
const SUPA_URL = CONFIG.SUPABASE_URL;
const SUPA_KEY = CONFIG.SUPABASE_KEY;
const sb = supabase.createClient(SUPA_URL, SUPA_KEY, {
  auth: { persistSession: false, autoRefreshToken: false }
});

function dbRow(r) {
  return {
    id: r.id,
    apt: r.apt || null,
    owner: r.owner || null,
    name: r.name || null,
    type: r.type || 'available',
    rent: r.rent || 0,
    balance: r.balance || 0,
    due: r.due || null,
    lease_end: r.lease_end || null,
    checkin: r.checkin || null,
    note: r.note || null,
    history: r.history || [],
    archived: r.archived || false,
    archived_date: r.archivedDate || r.archived_date || null
  };
}

function fromRow(r) {
  const hist = Array.isArray(r.history) ? r.history : [];
  const checkinDate = r.checkin || (hist.length ? hist[0].date : '');
  const sd = s => s ? s.substring(0,10) : ''; // strip time component
  return {
    id: r.id,
    apt: r.apt || '',
    owner: r.owner || '',
    name: r.name || '',
    type: r.type || 'available',
    rent: parseFloat(r.rent) || 0,
    balance: parseFloat(r.balance) || 0,
    due: sd(r.due),
    lease_end: sd(r.lease_end),
    checkin: sd(r.checkin),
    note: r.note || '',
    history: hist,
    archived: r.archived || false,
    archived_date: sd(r.archived_date),
    archivedDate: sd(r.archived_date || r.due),
    checkinDate: sd(checkinDate),
    booking_id: r.booking_id || null,
  };
}

// ── AUDIT LOG ──────────────────────────────────────
let lastUndo = null; // {action, record_id, old_data, new_data}

async function auditLog(action, apt, name, recordId, oldData, newData) {
  try {
    await sb.from('audit_log').insert({
      action, apt, name,
      record_id: recordId,
      old_data: oldData ? JSON.stringify(oldData) : null,
      new_data: newData ? JSON.stringify(newData) : null,
    });
    // Keep last undo in memory for instant undo
    lastUndo = { action, record_id: recordId, old_data: oldData, new_data: newData, apt, name };
    document.getElementById('undoBtn').style.display = '';
    document.getElementById('undoBtn').title = `Undo: ${action} — ${apt} ${name||''}`;
  } catch(e) {
    console.warn('Audit log failed:', e);
  }
}

async function performUndo() {
  if(!lastUndo) return;
  const u = lastUndo;
  if(!confirm(`Undo "${u.action}" for ${u.apt} ${u.name||''}?`)) return;
  try {
    if(u.action === 'delete') {
      // Restore deleted record
      if(u.old_data) {
        const rec = typeof u.old_data === 'string' ? JSON.parse(u.old_data) : u.old_data;
        await sb.from('units').insert(rec);
      }
    } else if(u.action === 'archive') {
      // Restore archived unit and delete archive copy
      if(u.old_data) {
        const rec = typeof u.old_data === 'string' ? JSON.parse(u.old_data) : u.old_data;
        await sb.from('units').upsert(rec, {onConflict:'id'});
      }
      if(u.new_data) {
        const newRec = typeof u.new_data === 'string' ? JSON.parse(u.new_data) : u.new_data;
        await sb.from('units').delete().eq('id', newRec.id);
      }
    } else {
      // Restore previous state of record
      if(u.old_data) {
        const rec = typeof u.old_data === 'string' ? JSON.parse(u.old_data) : u.old_data;
        await sb.from('units').upsert(rec, {onConflict:'id'});
      }
    }
    lastUndo = null;
    document.getElementById('undoBtn').style.display = 'none';
    await loadAll();
    renderTable();
    toast('↩ Undo successful', 'success');
  } catch(e) {
    console.error('Undo failed:', e);
    toast('Undo failed: ' + e.message, 'error');
  }
}

async function save(record) {
  // Get old state for audit
  const old = [...data, ...archived].find(x => x.id === record.id);
  const row = dbRow(record);
  const { error } = await sb.from('units').upsert(row, { onConflict: 'id' });
  if (error) { console.error('Save error:', error); toast('Sync error — check console','error'); return; }
  // Update last sync timestamp
  localStorage.setItem('lastSync', Date.now().toString());
  updateLastSynced();
  // Log to audit
  await auditLog('edit', record.apt||'', record.name||'', record.id,
    old ? dbRow(old) : null, row);
}

async function saveAll(records) {
  const rows = records.map(dbRow);
  const { error } = await sb.from('units').upsert(rows, { onConflict: 'id' });
  if (error) {
    console.error('SaveAll error:', error);
    toast('Sync error: ' + error.message, 'error');
  }
  // Log first record as representative (bulk operations)
  if(rows.length && rows[0]) {
    await auditLog('bulk-save', rows[0].apt||'', rows[0].name||'', rows[0].id, null, {count: rows.length});
  }
}

async function deleteRecord(id) {
  const old = [...data, ...archived].find(x => x.id === id);
  const { error } = await sb.from('units').delete().eq('id', id);
  if (error) { console.error('Delete error:', error); return; }
  if(old) await auditLog('delete', old.apt||'', old.name||'', id, dbRow(old), null);
}

async function loadAll() {
  let allRows = [];
  const pageSize = 500;
  let page = 0;
  while(true) {
    const from = page * pageSize;
    const to   = from + pageSize - 1;
    const { data: rows, error } = await sb
      .from('units').select('*').order('id').range(from, to);
    if (error) {
      console.error('Load error:', error);
      throw new Error(error.message || 'Failed to load from database');
    }
    if (!rows || rows.length === 0) break;
    allRows = allRows.concat(rows);
    console.log(`Page ${page}: loaded ${rows.length} rows (total so far: ${allRows.length})`);
    if (rows.length < pageSize) break;
    page++;
  }
  const all = allRows.map(fromRow);
  data     = all.filter(r => !r.archived);
  archived = all.filter(r =>  r.archived);
  nextId = all.length ? Math.max(...all.map(r => r.id)) + 1 : 81;
  console.log(`loadAll complete: ${data.length} active, ${archived.length} archived`);
  return true;
}

// Real-time subscription — refresh when any change comes in from another user
function subscribeRealtime() {
  sb.channel('units-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'units' }, async () => {
      await loadAll();
      window.DATA = data;
      renderTable();
      updateMTMStats();
      const page = document.querySelector('.page.active');
      if (page && page.id === 'page-dashboard') renderDashboard();
      if (page && page.id === 'page-reports') renderReports();
      if (page && page.id === 'page-calendar') renderCalendar();
    })
    .subscribe();
}

// ── DATE ───────────────────────────────────────────
function today(){const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
function daysUntil(s){if(!s)return null;const n=new Date();n.setHours(0,0,0,0);return Math.round((new Date(s+'T00:00:00')-n)/86400000);}
function dueStatus(r){if(r.type==='available')return'available';if(!r.due)return'none';const d=daysUntil(r.due);if(r.type==='short-stay'&&d<0)return'available';if(d<0)return'overdue';if(d<=7)return'soon';return'ok';}
function fmtDate(s){if(!s)return'—';return new Date(s+'T00:00:00').toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});}
function fmtMoney(n){return'$'+(Math.round(n||0)).toLocaleString();}
function nextMonth(s){if(!s)return'';const d=new Date(s+'T00:00:00');d.setMonth(d.getMonth()+1);return d.toISOString().split('T')[0];}
function daysInMonth(y,m){return new Date(y,m+1,0).getDate();}
function monthName(m,y){return new Date(y,m,1).toLocaleDateString('en-US',{month:'long',year:'numeric'});}

// ── STATS ──────────────────────────────────────────
function updateStats(){
  const a=data.filter(r=>!r.archived);
  // Deduplicate by apt for stats — same logic as table
  const aptSeen={};
  const deduped=[];
  a.forEach(r=>{
    if(!aptSeen[r.apt]){aptSeen[r.apt]=true;deduped.push(r);}
  });
  let ov=0,sn=0,ok=0,av=0;
  deduped.forEach(r=>{const s=dueStatus(r);if(s==='overdue')ov++;else if(s==='soon')sn++;else if(s==='ok')ok++;else if(s==='available')av++;});
  ['overdue','soon','ok','avail','total'].forEach((k,i)=>document.getElementById('st-'+k).textContent=[ov,sn,ok,av,deduped.length][i]);
  document.getElementById('archCount').textContent=archived.length;
}

function typeBadge(t){const m={'long-term':['badge-lt','Long Term'],'month-to-month':['badge-mtm','M-to-M'],'short-stay':['badge-short','Short Stay'],'available':['badge-avail','Available']};const[c,l]=m[t]||['badge-avail',t];return`<span class="badge ${c}">${l}</span>`;}
function dueCell(r){if(r.type==='available'||!r.due)return'<span class="due-none">—</span>';const s=dueStatus(r),d=daysUntil(r.due);const c=s==='overdue'?'due-overdue':s==='soon'?'due-soon':'due-ok';let l=fmtDate(r.due);if(s==='overdue')l+=` <small style="opacity:.8">(${Math.abs(d)}d late)</small>`;else if(s==='soon')l+=` <small style="opacity:.8">(${d}d)</small>`;return`<div class="due-cell ${c}"><div class="due-dot"></div>${l}</div>`;}

// ── RENDER TABLE ───────────────────────────────────
// ── EARLIEST BOOKING LOGIC ─────────────────────────────────────────
// For each active unit, find the earliest upcoming booking across
// the active record + any archived cal-bookings for the same apt.
// Returns a display record with the earliest guest/dates,
// but preserves the original active unit's id for all actions.
function getEarliestBooking(activeRecord) {
  const todayStr = today();
  const apt = activeRecord.apt;

  // Only consider calendar-added bookings:
  // Must have BOTH checkin AND archivedDate (checkout) set,
  // checkin must be >= today (truly future/upcoming),
  // and apt must match exactly.
  const upcomingArchived = archived.filter(r =>
    r.archived &&
    r.apt === apt &&
    r.name &&
    r.checkin &&
    (r.archivedDate || r.archived_date) &&
    r.checkin >= todayStr   // checkin itself must be in the future
  );

  if (!upcomingArchived.length) return activeRecord;

  // Find earliest checkin among cal-bookings
  let earliest = null;
  upcomingArchived.forEach(r => {
    if (!earliest || r.checkin < earliest.checkin) earliest = r;
  });

  if (!earliest) return activeRecord;

  // Only override if it's actually earlier than the active unit's checkin
  const activeCi = activeRecord.checkin || '9999';
  if (earliest.checkin >= activeCi) return activeRecord;

  return {
    ...activeRecord,
    name:      earliest.name,
    checkin:   earliest.checkin,
    due:       earliest.archivedDate || earliest.archived_date || earliest.due || '',
    lease_end: earliest.archivedDate || earliest.archived_date || earliest.due || '',
    rent:      earliest.rent || activeRecord.rent,
    note:      earliest.note || activeRecord.note,
    _displayOnly: true,
    _realRecord: activeRecord
  };
}

function getFiltered(){
  // Deduplicate by apt — keep only the most relevant booking per apt
  // Priority: 1) currently active (checkin <= today <= due), 2) next upcoming (checkin > today), 3) available
  const today = new Date(); today.setHours(0,0,0,0);
  const allActive = data.filter(r=>!r.archived);
  const aptMap = {};
  allActive.forEach(r => {
    const apt = r.apt;
    if (!aptMap[apt]) { aptMap[apt] = r; return; }
    const existing = aptMap[apt];
    // Score: current booking wins over future, future wins over available
    function score(x) {
      if (x.type === 'available' || !x.name) return 0;
      const ci = x.checkin ? new Date(x.checkin+'T00:00:00') : null;
      const due = x.due ? new Date(x.due+'T00:00:00') : null;
      if (ci && due && ci <= today && due >= today) return 3; // active now
      if (ci && ci > today) return 2; // upcoming
      if (due && due >= today) return 1; // due in future
      return 0;
    }
    if (score(r) > score(existing)) aptMap[apt] = r;
  });
  let rows = Object.values(aptMap);
  const q=document.getElementById('searchInput').value.toLowerCase();
  if(q)rows=rows.filter(r=>(r.apt||'').toLowerCase().includes(q)||(r.name||'').toLowerCase().includes(q)||(r.owner||'').toLowerCase().includes(q));
  if(currentStatFilter!=='all'){if(currentStatFilter==='overdue')rows=rows.filter(r=>dueStatus(r)==='overdue');else if(currentStatFilter==='soon')rows=rows.filter(r=>dueStatus(r)==='soon');else if(currentStatFilter==='ok')rows=rows.filter(r=>dueStatus(r)==='ok');else if(currentStatFilter==='available')rows=rows.filter(r=>r.type==='available');}
  if(currentTypeFilter!=='all'){
  if(currentTypeFilter==='available'){
    rows=rows.filter(r=>r.type==='available'||dueStatus(r)==='available');
  } else {
    rows=rows.filter(r=>r.type===currentTypeFilter);
  }
}
  const sel=document.getElementById('sortSel').value;
  rows.sort((a,b)=>{
    if(sel==='due'||sel==='due-desc'){const da=a.due||'9999',db=b.due||'9999';return sel==='due'?da.localeCompare(db):db.localeCompare(da);}
    if(sel==='lease_end'||sel==='lease_end-desc'){const da=a.lease_end||'9999',db=b.lease_end||'9999';return sel==='lease_end'?da.localeCompare(db):db.localeCompare(da);}
    if(sel==='checkin'||sel==='checkin-desc'){const da=a.checkin||'9999',db=b.checkin||'9999';return sel==='checkin'?da.localeCompare(db):db.localeCompare(da);}
    if(sel==='apt'||sel==='apt-desc'){const r=a.apt.localeCompare(b.apt,undefined,{numeric:true});return sel==='apt'?r:-r;}
    if(sel==='name'||sel==='name-desc'){const r=(a.name||'zzz').localeCompare(b.name||'zzz');return sel==='name'?r:-r;}
    if(sel==='amount'||sel==='amount-desc'){return sel==='amount'?(b.rent||0)-(a.rent||0):(a.rent||0)-(b.rent||0);}
    return 0;
  });
  return rows;
}
function renderTable(){
  updateStats();const rows=getFiltered();
  document.getElementById('emptyState').style.display=rows.length?'none':'';
  document.getElementById('tableBody').innerHTML=rows.map(r=>{
    const s=dueStatus(r),rc=r.type==='available'?'row-available':s==='overdue'?'row-overdue':s==='soon'?'row-soon':'';
    const bc=r.type==='available'?'<span class="amount-none">—</span>':r.balance>0?`<span style="color:var(--red);font-weight:500">$${r.balance.toLocaleString()}</span>`:'<span style="color:var(--green)">✓ Paid</span>';
    // For short-stay: if unit has a booking_id with archive records, rent is already the current period amount
    // Don't re-prorate it — just show it directly
    const hasArchiveRecords = r.booking_id && archived.some(a => a.booking_id === r.booking_id && a.archived_date);
    const proration = (!hasArchiveRecords) ? currentMonthProration(r) : null;
    const rentCell = r.type==='short-stay' && proration
      ? `<span class="amount-cell" title="Full stay: $${r.rent.toLocaleString()} — ${proration.days} days this month" style="cursor:help">$${proration.portion.toLocaleString()}<small style="color:var(--text3);font-size:9px;margin-left:2px">/${proration.days}d</small></span>`
      : r.rent ? `<span class="amount-cell">$${r.rent.toLocaleString()}</span>` : '<span class="amount-none">—</span>';
    // Get property data for this apt
    const propRec = (propertiesData && propertiesData.length > 0)
      ? propertiesData.find(p => p.internal_apt === r.apt || p.apt === r.apt)
      : null;
    const brCell = propRec && propRec.bedrooms != null ? propRec.bedrooms : '<span style="color:var(--text3)">—</span>';
    const bathCell = propRec && propRec.bathrooms != null ? propRec.bathrooms : '<span style="color:var(--text3)">—</span>';
    const accessCell = propRec && propRec.door_code ? `<span style="font-size:11px;font-family:'DM Mono',monospace;">${propRec.door_code}</span>` : '<span style="color:var(--text3)">—</span>';
    return`<tr class="apt-row ${rc}" onclick="openDetail(${r.id})"><td class="apt-num">${r.apt}</td><td style="font-size:12px;text-align:center;">${brCell}</td><td style="font-size:12px;text-align:center;">${bathCell}</td><td style="font-size:11px;">${accessCell}</td><td style="font-size:12px;color:var(--text2);white-space:nowrap">${r.checkin?fmtDate(r.checkin):'<span style="color:var(--text3)">—</span>'}</td><td>${typeBadge(r.type)}</td><td onclick="event.stopPropagation()">${clickablePersonName(r.name, r, 'tenant-name')}</td><td>${dueCell(r)}</td><td style="font-size:12px;color:var(--blue);white-space:nowrap">${r.type!=='short-stay'&&r.lease_end?fmtDate(r.lease_end):'<span style="color:var(--text3)">—</span>'}</td><td>${rentCell}</td><td>${bc}</td><td><div class="note-preview">${r.note||''}</div></td><td class="owner-cell">${r.owner||'—'}</td><td class="actions-cell" onclick="event.stopPropagation()">${r.type!=='available'?`<button class="icon-btn ib-pay" title="Payment" onclick="openPayModal(${r.id})">💰</button>`:''}<button class="icon-btn ib-edit" title="Edit" onclick="openEditModal(${r.id})">✏️</button><button class="icon-btn ib-arch" title="Archive" onclick="archiveTenant(${r.id})">📦</button></td></tr>`;
  }).join('');
  document.getElementById('archiveBody').innerHTML=archived.filter(r=>r.archived).map(r=>`<tr style="opacity:.75"><td class="apt-num" style="font-size:15px">${r.apt}</td><td class="tenant-name">${r.name||'—'}</td><td class="owner-cell">${r.owner||'—'}</td><td>${typeBadge(r.type)}</td><td style="color:var(--text3);font-size:12px">${fmtDate(r.checkin||r.checkinDate||'')}</td><td style="color:var(--blue);font-size:12px">${fmtDate(r.lease_end||r.archivedDate||r.due||'')}</td><td><div class="note-preview">${r.note||''}</div></td><td class="actions-cell"><button class="icon-btn ib-restore" title="Restore" onclick="restoreTenant(${r.id})">↩️</button><button class="icon-btn ib-del" title="Delete" onclick="deletePermanent(${r.id})">🗑️</button></td></tr>`).join('')||'<tr><td colspan="8" style="text-align:center;color:var(--text3);padding:20px">No archived tenants</td></tr>';
}

function filterStat(el,f){document.querySelectorAll('.stat-card').forEach(c=>c.classList.remove('active'));currentStatFilter=currentStatFilter===f?'all':f;if(currentStatFilter==='all')document.querySelector('.s-total').classList.add('active');else el.classList.add('active');renderTable();}
function filterType(el){document.querySelectorAll('.pill').forEach(p=>p.classList.remove('active'));el.classList.add('active');currentTypeFilter=el.dataset.type;renderTable();}
function setSortSel(v){
  const sel = document.getElementById('sortSel');
  // Toggle desc if clicking same column
  if(sel.value === v) sel.value = v+'-desc';
  else if(sel.value === v+'-desc') sel.value = v;
  else sel.value = v;
  // Highlight active header
  document.querySelectorAll('thead th[onclick]').forEach(th => {
    const col = th.getAttribute('onclick').match(/'([^']+)'/)?.[1];
    const isActive = sel.value === col || sel.value === col+'-desc';
    th.style.color = isActive ? 'var(--accent2)' : '';
  });
  renderTable();
}
function toggleArchive(){const w=document.getElementById('archiveTableWrap'),ch=document.getElementById('archChevron');const o=w.style.display!=='none';w.style.display=o?'none':'';ch.classList.toggle('open',!o);}

// ── ADD/EDIT ───────────────────────────────────────
function openAddModal(){
  document.getElementById('editId').value='';
  document.getElementById('modalTitle').textContent='Add Unit / Tenant';
  document.getElementById('modalAptLabel').textContent='—';
  ['fApt','fOwner','fName','fRent','fBalance','fNote','fCheckin','fPhone','fEmail','fChannelOther'].forEach(i=>document.getElementById(i).value='');
  document.getElementById('fType').value='available';
  document.getElementById('fDue').value='';
  document.getElementById('fLeaseEnd').value='';
  document.getElementById('fChannel').value='';
  document.getElementById('fChannelOtherRow').style.display='none';
  openModal('editModal');
}
function openEditModal(id){
  const r=data.find(x=>x.id===id);if(!r)return;
  document.getElementById('editId').value=id;
  document.getElementById('modalTitle').textContent='Edit Unit / Tenant';
  document.getElementById('modalAptLabel').textContent=r.apt;
  document.getElementById('fApt').value=r.apt;
  document.getElementById('fOwner').value=r.owner||'';
  document.getElementById('fName').value=r.name||'';
  document.getElementById('fType').value=r.type||'available';
  document.getElementById('fRent').value=r.rent||'';
  document.getElementById('fDue').value=r.due||'';
  document.getElementById('fLeaseEnd').value=r.lease_end||'';
  document.getElementById('fCheckin').value=r.checkin||'';
  document.getElementById('fBalance').value=r.balance||'';
  // Parse existing note into structured fields
  const parsed = parseNoteFields(r.note||'');
  document.getElementById('fChannel').value = parsed.channel;
  document.getElementById('fChannelOther').value = parsed.channelOther;
  document.getElementById('fChannelOtherRow').style.display = parsed.channel==='Other' ? '' : 'none';
  document.getElementById('fPhone').value = parsed.phone;
  document.getElementById('fEmail').value = parsed.email;
  document.getElementById('fNote').value = parsed.extra;
  openModal('editModal');
}
async function saveTenant(){
  const id=document.getElementById('editId').value;
  const apt=document.getElementById('fApt').value.trim();
  if(!apt){toast('Apartment # required','error');return;}
  const rec={
    apt, owner:document.getElementById('fOwner').value.trim(),
    name:document.getElementById('fName').value.trim(),
    type:document.getElementById('fType').value,
    rent:parseFloat(document.getElementById('fRent').value)||0,
    due:document.getElementById('fDue').value,
    lease_end:document.getElementById('fLeaseEnd').value,
    checkin:document.getElementById('fCheckin').value,
    balance:parseFloat(document.getElementById('fBalance').value)||0,
    note:buildNoteField('fChannel','fChannelOther','fPhone','fEmail','fNote')
  };
  if(id){const i=data.findIndex(x=>x.id==id);data[i]={...data[i],...rec};await save(data[i]);toast(`Apt ${apt} updated ✓`,'success');}
  else{const newId=nextId++;const newRec={id:newId,...rec,history:[],archived:false,booking_id:'BK-'+newId};data.push(newRec);await save(newRec);toast(`Apt ${apt} added ✓`,'success');}

  // Keep properties table in sync — upsert a property record for this apt
  try{
    const existing = propertiesData.find(p => p.internal_apt === apt || p.apt === apt);
    if(!existing){
      // New property record
      const {data:maxRow} = await sb.from('properties').select('property_uid').order('property_uid',{ascending:false}).limit(1);
      const nextUid = (maxRow&&maxRow.length ? maxRow[0].property_uid : 10100) + 1;
      await sb.from('properties').insert({
        apt, name: apt, internal_apt: apt,
        owner: rec.owner || null,
        status: rec.type === 'available' ? 'Inactive' : 'Active',
        property_uid: nextUid,
        updated_at: new Date().toISOString()
      });
      await loadProperties();
    } else {
      // Update status/owner on existing record
      await sb.from('properties').update({
        owner: rec.owner || null,
        status: rec.type === 'available' ? 'Inactive' : 'Active',
        updated_at: new Date().toISOString()
      }).eq('apt', existing.apt);
      await loadProperties();
    }
  } catch(e){ console.warn('properties sync:', e.message); }

  closeModal('editModal');renderTable();
}

// ── PAYMENT ────────────────────────────────────────
function openPayModal(id){
  const r=data.find(x=>x.id===id);if(!r)return;
  payType='full';
  ['full','partial','extend'].forEach(t=>document.getElementById('rb-'+t).classList.toggle('selected',t==='full'));
  document.getElementById('extendDateRow').style.display='none';
  document.getElementById('payPreviewRow').style.display='none';
  document.getElementById('payId').value=id;
  document.getElementById('payAptLabel').textContent=r.apt;
  document.getElementById('payAmount').value=r.balance>0?r.balance:r.rent;
  document.getElementById('payDate').value=today();
  document.getElementById('payNote').value='';
  document.getElementById('payNewDate').value=r.due||'';
  document.getElementById('prorateCheck').checked=false;
  document.getElementById('prorateBreakdown').innerHTML='';
  // Show prorate option for short stays with checkin+lease_end
  const showProrate = r.checkin && (r.lease_end||r.due);
  document.getElementById('prorateRow').style.display = showProrate ? '' : 'none';
  const s=dueStatus(r);
  document.getElementById('payInfoBox').innerHTML=`
    <div class="pay-info-item"><div class="pi-label">Tenant</div><div class="pi-value">${r.name||'—'}</div></div>
    <div class="pay-info-item"><div class="pi-label">Amount</div><div class="pi-value">$${(r.rent||0).toLocaleString()}</div></div>
    <div class="pay-info-item"><div class="pi-label">Balance Owed</div><div class="pi-value ${r.balance>0?'overdue':'ok'}">${r.balance>0?'$'+r.balance.toLocaleString():'✓ Paid'}</div></div>
    <div class="pay-info-item"><div class="pi-label">Check-in → Checkout</div><div class="pi-value" style="font-size:12px">${fmtDate(r.checkin||r.due)} → ${fmtDate(r.lease_end||r.due)}</div></div>`;
  updatePayPreview();
  openModal('payModal');
}
function selectPayType(t){payType=t;['full','partial','extend'].forEach(x=>document.getElementById('rb-'+x).classList.toggle('selected',x===t));document.getElementById('extendDateRow').style.display=t==='extend'?'':'none';updatePayPreview();}
function calcProration(checkin, checkout, totalAmt) {
  // Split totalAmt across calendar months proportionally by days
  if(!checkin || !checkout) return [];
  const ci = new Date(checkin+'T00:00:00');
  const co = new Date(checkout+'T00:00:00');
  const totalDays = Math.round((co - ci) / 86400000);
  if(totalDays <= 0) return [];
  const MONTHS=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const result = [];
  let cur = new Date(ci);
  while(cur < co) {
    const y = cur.getFullYear(), m = cur.getMonth();
    const monthEnd = new Date(y, m+1, 0);
    const periodEnd = co < monthEnd ? co : monthEnd;
    const days = Math.round((periodEnd - cur) / 86400000);
    const portion = Math.round(totalAmt * days / totalDays * 100) / 100;
    result.push({ month:`${MONTHS[m]} ${y}`, monthStr:`${y}-${String(m+1).padStart(2,'0')}`, days, portion });
    cur = new Date(y, m+1, 1);
  }
  return result;
}

function currentMonthProration(r) {
  if(r.type !== 'short-stay') return null;
  const ci = r.checkin;
  const co = r.lease_end || r.due;  // use lease_end or fall back to due
  if(!ci || !co) return null;
  const ciD = new Date(ci+'T00:00:00');
  const coD = new Date(co+'T00:00:00');
  if(coD <= ciD) return null;  // same day or invalid
  const now = new Date();
  const curMonthStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;
  const splits = calcProration(ci, co, r.rent);
  const thisMonth = splits.find(s => s.monthStr === curMonthStr);
  return thisMonth || null;
}

function updatePayPreview(){
  const id=document.getElementById('payId').value;
  const r=data.find(x=>x.id==id);if(!r)return;
  const amt=parseFloat(document.getElementById('payAmount').value)||0;
  const isProrate = document.getElementById('prorateCheck')?.checked;
  let msg='';

  if(isProrate && r.checkin && (r.lease_end || r.due)){
    const ci = r.checkin || r.due;
    const co = r.lease_end || r.due;
    const splits = calcProration(ci, co, amt);
    if(splits.length){
      const breakdown = splits.map(s=>`${s.month}: <strong>$${s.portion.toLocaleString()}</strong> (${s.days} days)`).join('<br>');
      document.getElementById('prorateBreakdown').innerHTML = breakdown;
      msg = `✓ Total $${amt.toLocaleString()} split across ${splits.length} month${splits.length>1?'s':''} — archive lines created per month.`;
    }
  } else if(payType==='full'){
    const nd=nextMonth(r.due);
    msg=amt>=r.rent?`✓ Full payment. Due → <strong>${fmtDate(nd)}</strong>`:`⚠ $${amt} < rent $${r.rent}. Balance: <strong>$${(r.rent-amt).toFixed(2)}</strong>`;
  } else if(payType==='partial'){
    msg=`Partial. New balance: <strong>$${Math.max(0,(r.balance||r.rent)-amt).toFixed(2)}</strong>`;
  } else if(payType==='extend'){
    const nd=document.getElementById('payNewDate').value;
    msg=nd?`Extended to <strong>${fmtDate(nd)}</strong>`:'Select new checkout date.';
  }
  document.getElementById('payPreview').innerHTML=msg;
  document.getElementById('payPreviewRow').style.display=msg?'':'none';
}
async function confirmPayment(){
  const id = document.getElementById('payId').value;
  const idx = data.findIndex(x => x.id == id);
  if(idx < 0) return;
  const r = data[idx];
  const amt = parseFloat(document.getElementById('payAmount').value) || 0;
  const note = document.getElementById('payNote').value.trim();
  const dateStr = document.getElementById('payDate').value || today();
  const newCheckout = payType === 'extend' ? document.getElementById('payNewDate').value : r.lease_end;
  const isProrate = document.getElementById('prorateCheck')?.checked && r.checkin && (r.lease_end || r.due);

  r.history = r.history || [];

  if(r.type === 'short-stay' && !isProrate) {
    // ── SHORT STAY (non-prorated) ──────────────────────────────
    const ci           = r.checkin || r.due || '';
    const origCheckout = r.lease_end || r.due || '';
    const newCO        = (payType === 'extend' && newCheckout) ? newCheckout : origCheckout;
    const now          = new Date();
    const curMonthStr  = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;

    // Add this payment to live history
    r.history.unshift({ date: dateStr, amt, text: `$${amt.toLocaleString()} — payment${note ? ' | ' + note : ''}` });

    if(payType === 'extend' && newCheckout) {
      // ── EXTENSION PAYMENT ──────────────────────────────────────
      // Only prorate the NEW payment across the new portion of the stay
      // Previous months are already archived — don't recalculate them
      const extSplits = calcProration(origCheckout, newCO, amt);
      const pastExt   = extSplits.filter(s => s.monthStr < curMonthStr);
      const currExt   = extSplits.filter(s => s.monthStr >= curMonthStr);
      const currTotal = Math.round(currExt.reduce((s,x)=>s+x.portion,0)*100)/100;

      // Archive any past-month portions of the extension
      for(const s of pastExt) {
        await upsertArchiveMonth(r, s.monthStr, s.portion, dateStr, note,
          [{ date: dateStr, amt: s.portion, text: `$${s.portion.toLocaleString()} — extension ${s.month} (${s.days}d)` }]);
      }

      // Also archive the month BEFORE the extension if it's now past
      // (e.g. March portion of original stay → archive)
      const origSplits = calcProration(ci, origCheckout, r.rent);
      for(const s of origSplits) {
        if(s.monthStr < curMonthStr) {
          await upsertArchiveMonth(r, s.monthStr, s.portion, dateStr, note,
            [{ date: dateStr, amt: s.portion, text: `$${s.portion.toLocaleString()} — ${s.month} (${s.days}d of original stay)` }]);
        }
      }

      r.lease_end = newCO;
      r.due       = newCO;
      // Live rent = current month portion of extension (the new days only)
      r.rent      = currTotal > 0 ? currTotal : amt;
      r.balance   = Math.max(0, (r.balance || 0) - amt);
      await save(r);

    } else {
      // ── REGULAR PAYMENT (no extension) ──────────────────────
      const totalPaid    = Math.round(r.history.reduce((s,h)=>s+(typeof h.amt==='number'?h.amt:0),0)*100)/100;
      const crossesMonth = ci.substring(0,7) < newCO.substring(0,7);

      if(!crossesMonth) {
        r.rent    = totalPaid;
        r.balance = Math.max(0, (r.balance || 0) - amt);
        await save(r);
      } else {
        const splits      = calcProration(ci, newCO, totalPaid);
        const pastSplits  = splits.filter(s => s.monthStr < curMonthStr);
        const currSplits  = splits.filter(s => s.monthStr >= curMonthStr);
        const currTotal   = Math.round(currSplits.reduce((s,x)=>s+x.portion,0)*100)/100;
        for(const s of pastSplits) {
          await upsertArchiveMonth(r, s.monthStr, s.portion, dateStr, note,
            [{ date: dateStr, amt: s.portion, text: `$${s.portion.toLocaleString()} — ${s.month} (${s.days}d)` }]);
        }
        r.rent    = currTotal;
        r.balance = Math.max(0, currTotal - (totalPaid - pastSplits.reduce((s,x)=>s+x.portion,0)));
        r.balance = Math.max(0, r.balance);
        await save(r);
      }
    }

  } else if(isProrate) {
    // ── PRORATED FULL STAY — works for any lease type ──────────
    const ci = r.checkin || r.due;
    const co = r.lease_end || r.due;
    const splits = calcProration(ci, co, amt);
    const now = new Date();
    const curMonthStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;
    const pastSplits    = splits.filter(s => s.monthStr <  curMonthStr);
    const futureSplits  = splits.filter(s => s.monthStr >= curMonthStr);
    const curSplit      = splits.find(s => s.monthStr === curMonthStr);

    // Live history stores only THIS month's portion (so collectedInMonth doesn't double-count)
    r.balance = 0;
    r.history = r.history || [];
    r.history.unshift({
      date: dateStr,
      amt: curSplit ? curSplit.portion : amt,
      text: `$${amt.toLocaleString()} — full stay paid, this month: $${(curSplit ? curSplit.portion : amt).toLocaleString()}${note ? ' | ' + note : ''}`
    });
    await save(r);

    // All months get archive records (including current month for reporting)
    for(const s of splits) {
      await upsertArchiveMonth(r, s.monthStr, s.portion, dateStr, note,
        [{ date: dateStr, amt: s.portion, text: `$${s.portion.toLocaleString()} — ${s.month} (${s.days}d)` }]);
    }

  } else {
    // ── LONG TERM / MONTH-TO-MONTH ─────────────────────────────
    if(payType === 'full') {
      r.balance = amt >= r.rent ? 0 : Math.max(0, r.rent - amt);
      if(amt >= r.rent) r.due = nextMonth(r.due);
    } else if(payType === 'partial') {
      r.balance = Math.max(0, (r.balance > 0 ? r.balance : r.rent) - amt);
    } else if(payType === 'extend') {
      if(newCheckout) r.due = newCheckout;
      r.balance = Math.max(0, (r.balance || 0) - amt);
    }
    r.history.unshift({ date: dateStr, amt, text: `$${amt.toLocaleString()} — ${payType}${note ? ' | ' + note : ''}` });
    await save(r);
    const monthStr = dateStr.substring(0, 7);
    await upsertArchiveMonth(r, monthStr, amt, dateStr, note,
      [{ date: dateStr, amt, text: `$${amt.toLocaleString()} — payment received${note ? ' | ' + note : ''}` }]);
  }

  await loadAll();
  closeModal('payModal');
  renderTable();
  toast(`Payment recorded for Apt ${r.apt} ✓`, 'success');
  if(detailId === r.id) openDetail(r.id);

}


// ── Shared archive upsert ──────────────────────────────────
async function upsertArchiveMonth(r, monthStr, monthAmt, dateStr, note, historyEntries) {
  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const [yr, mo] = monthStr.split('-');
  const mIdx = parseInt(mo) - 1;
  const monthLabel = `${MONTHS[mIdx]} ${yr}`;
  const nextMonthStr = `${yr}-${String(mIdx + 2).padStart(2,'0')}-01`;

  // Always check Supabase for existing row
  const { data: sbRows } = await sb.from('units').select('*')
    .eq('apt', r.apt).eq('archived', true).eq('name', r.name)
    .gte('archived_date', `${monthStr}-01`)
    .lt('archived_date', nextMonthStr);

  const existing = sbRows && sbRows.length > 0 ? sbRows[0] : null;

  if(existing) {
    existing.history = existing.history || [];
    // Append new entries
    historyEntries.forEach(h => existing.history.unshift(h));
    // Recalc total from all history
    const totalPaid = Math.round(existing.history.reduce((s, h) => s + (typeof h.amt === 'number' ? h.amt : 0), 0) * 100) / 100;
    existing.rent = totalPaid;
    existing.note = `${r.name} — ${monthLabel} — ${existing.history.length} payment(s) — $${totalPaid.toLocaleString()}${note ? ' | ' + note : ''}`;
    await save(existing);
    const mi = archived.findIndex(a => a.id === existing.id);
    if(mi >= 0) archived[mi] = existing; else archived.unshift(existing);
  } else {
    const { data: maxRow } = await sb.from('units').select('id').order('id', { ascending: false }).limit(1);
    const newId = (maxRow && maxRow.length ? maxRow[0].id : 2000) + 1;
    const archRec = {
      id: newId, apt: r.apt, owner: r.owner || null, name: r.name,
      type: r.type, rent: Math.round(monthAmt * 100) / 100, balance: 0,
      due: `${monthStr}-01`,
      lease_end: new Date(parseInt(yr), mIdx + 1, 0).toISOString().split('T')[0],
      checkin: r.checkin || '',
      note: `${r.name} — ${monthLabel} — $${monthAmt.toLocaleString()}${note ? ' | ' + note : ''}`,
      history: historyEntries,
      archived: true, archived_date: `${monthStr}-01`,
      booking_id: r.booking_id || ('BK-' + r.id)
    };
    await save(archRec);
    archived.unshift({ ...archRec, archivedDate: `${monthStr}-01`, checkinDate: r.checkin || '' });
  }
}



// ── CLEAR HISTORY ──────────────────────────────────

let _clearHistoryId = null;

function openClearHistoryModal(id) {
  const r = data.find(x => x.id === id);
  if(!r) return;
  _clearHistoryId = id;
  const hist = r.history || [];
  document.getElementById('clearHistoryPreview').innerHTML = `
    <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
      <span style="color:var(--text3);font-size:10px;text-transform:uppercase;letter-spacing:1px;">Unit</span>
      <span style="font-weight:500;">Apt ${r.apt} — ${r.name}</span>
    </div>
    <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
      <span style="color:var(--text3);font-size:10px;text-transform:uppercase;letter-spacing:1px;">Current Rent</span>
      <span style="color:var(--green);font-weight:500;">$${(r.rent||0).toLocaleString()}</span>
    </div>
    <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
      <span style="color:var(--text3);font-size:10px;text-transform:uppercase;letter-spacing:1px;">Current Balance</span>
      <span style="color:${r.balance>0?'var(--red)':'var(--green)'};font-weight:500;">${r.balance>0?'$'+r.balance.toLocaleString():'✓ Paid'}</span>
    </div>
    <div style="display:flex;justify-content:space-between;">
      <span style="color:var(--text3);font-size:10px;text-transform:uppercase;letter-spacing:1px;">History Entries</span>
      <span style="color:var(--red);font-weight:500;">${hist.length} entries will be cleared</span>
    </div>`;
  // Pre-fill reset values with current
  document.getElementById('resetRentVal').value = r.rent || '';
  document.getElementById('resetBalanceVal').value = r.balance || '';
  document.getElementById('chkResetRent').checked = false;
  document.getElementById('chkResetBalance').checked = false;
  document.getElementById('clearHistoryModal').classList.add('open');
}

async function confirmClearHistory() {
  if(!_clearHistoryId) return;
  const btn = document.getElementById('confirmClearHistoryBtn');
  btn.textContent = '⏳ Clearing…';
  btn.disabled = true;

  try {
    const idx = data.findIndex(x => x.id === _clearHistoryId);
    if(idx < 0) throw new Error('Record not found');
    const r = data[idx];

    r.history = [];
    if(document.getElementById('chkResetRent').checked) {
      const v = parseFloat(document.getElementById('resetRentVal').value);
      if(!isNaN(v)) r.rent = Math.round(v * 100) / 100;
    }
    if(document.getElementById('chkResetBalance').checked) {
      const v = parseFloat(document.getElementById('resetBalanceVal').value);
      if(!isNaN(v)) r.balance = Math.round(v * 100) / 100;
    }

    await save(r);
    await loadAll();
    closeModal('clearHistoryModal');
    renderTable();
    if(detailId === _clearHistoryId) openDetail(_clearHistoryId);
    toast(`History cleared for Apt ${r.apt} ✓`, 'success');
  } catch(e) {
    toast('Failed: ' + e.message, 'error');
    btn.textContent = '🗑 Clear History';
    btn.disabled = false;
  }
}

// ── ARCHIVE DETAIL PANEL ───────────────────────────

let currentArchiveDetailId = null;

function openArchiveDetail(id) {
  const r = archived.find(x => x.id === id);
  if (!r) return;
  currentArchiveDetailId = id;

  document.getElementById('adApt').textContent  = r.apt || '—';
  document.getElementById('adName').textContent = r.name || '—';
  document.getElementById('adOwner').textContent = r.owner || '';

  // Info rows
  const ci = r.checkin || r.checkinDate || '';
  const co = r.lease_end || r.archivedDate || r.archived_date || r.due || '';
  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const monthStr = (r.archived_date||r.archivedDate||r.due||'').substring(0,7);
  let monthLabel = '';
  if (monthStr) {
    const [yr, mo] = monthStr.split('-');
    monthLabel = `${MONTHS[parseInt(mo)-1]} ${yr}`;
  }

  document.getElementById('adRows').innerHTML = [
    ['Period',     monthLabel || '—'],
    ['Type',       typeBadge(r.type)],
    ['Check-in',   ci ? fmtDate(ci) : '—'],
    ['Lease End',  co ? `<span style="color:var(--blue)">${fmtDate(co)}</span>` : '—'],
  ].map(([l,v]) => `
    <div class="detail-row">
      <span class="dr-label">${l}</span>
      <span class="dr-val">${v}</span>
    </div>`).join('');

  // Payment breakdown
  const history = (r.history || []).slice().sort((a,b) => new Date(a.date) - new Date(b.date));
  let total = 0;

  if (history.length === 0) {
    document.getElementById('adPayments').innerHTML = '<div style="color:var(--text3);font-size:11px;padding:8px 0;">No payment records.</div>';
    document.getElementById('adTotalAmt').textContent = fmtMoney(r.rent || 0);
  } else {
    document.getElementById('adPayments').innerHTML = history.map(h => {
      const m = h.text.match(/^\$([0-9,]+(\.[0-9]+)?)/);
      const amt = m ? parseFloat(m[1].replace(/,/g,'')) : 0;
      total += amt;
      return `<div style="display:flex;justify-content:space-between;align-items:baseline;padding:7px 0;border-bottom:1px solid var(--border);font-size:12px;">
        <div>
          <span style="color:var(--text3);font-size:11px;margin-right:10px;">${fmtDate(h.date)}</span>
          <span style="color:var(--text2);">${h.text.replace(/^\$[0-9,.]+ — /,'')}</span>
        </div>
        <span style="color:var(--green);font-weight:500;flex-shrink:0;margin-left:12px;">${m ? fmtMoney(amt) : ''}</span>
      </div>`;
    }).join('');
    document.getElementById('adTotalAmt').textContent = fmtMoney(total);
  }

  document.getElementById('archiveDetailOverlay').classList.add('open');
}

function closeArchiveDetail() {
  document.getElementById('archiveDetailOverlay').classList.remove('open');
  currentArchiveDetailId = null;
}

// ── ARCHIVE ────────────────────────────────────────
async function archiveTenant(id){
  if(!confirm('Move to archive? Apartment will be marked available.'))return;
  const idx=data.findIndex(x=>x.id===id);
  const r=data[idx];
  const todayStr=today();

  // Get a safe new ID — query Supabase for actual max
  const {data:maxRow} = await sb.from('units').select('id').order('id',{ascending:false}).limit(1);
  const safeNewId = maxRow && maxRow.length ? maxRow[0].id + 1 : nextId;
  nextId = safeNewId + 1;

  // Determine lease_end
  let archLeaseEnd = r.lease_end || r.due || todayStr;
  if((r.type==='long-term'||r.type==='month-to-month')&&!r.lease_end){
    const now=new Date();
    archLeaseEnd=new Date(now.getFullYear(),now.getMonth()+1,0).toISOString().split('T')[0];
  }

  const archRow = {
    id: safeNewId,
    apt: r.apt,
    owner: r.owner||null,
    name: r.name,
    type: r.type,
    rent: r.rent||0,
    balance: r.balance||0,
    due: archLeaseEnd||null,
    lease_end: archLeaseEnd||null,
    checkin: r.checkin||null,
    note: r.note||null,
    history: r.history||[],
    archived: true,
    archived_date: todayStr
  };

  const blankRow = {
    id: r.id,
    apt: r.apt,
    owner: r.owner||null,
    name: null,
    type: 'available',
    rent: r.rent||0,
    balance: 0,
    due: null,
    lease_end: null,
    checkin: null,
    note: null,
    history: [],
    archived: false,
    archived_date: null
  };

  // Save archive record first
  const {error:e1} = await sb.from('units').insert(archRow);
  if(e1){ console.error('Archive INSERT error:', e1); toast('Error saving archive: '+e1.message,'error'); return; }

  // Update existing unit to available
  const {error:e2} = await sb.from('units').update(blankRow).eq('id', r.id);
  if(e2){ console.error('Blank update error:', e2); toast('Error clearing unit: '+e2.message,'error'); return; }

  // Audit log — store old state for undo
  await auditLog('archive', r.apt, r.name, r.id, dbRow(r), {...archRow});

  await loadAll();
  renderTable();
  const histPage = document.getElementById('page-history');
  if(histPage && histPage.classList.contains('active')) renderHistory();
  toast(`${r.name||'Tenant'} archived ✓ — find in 🗄 Archive tab`,'success');
  if(detailId===id)closeDetail();
}
async function restoreTenant(id){
  const idx=archived.findIndex(x=>x.id===id);if(idx<0)return;
  const r=archived[idx];
  const slot=data.findIndex(x=>x.apt===r.apt&&x.type==='available');
  const res={...r,archived:false,archived_date:null,archivedDate:'',lease_end:r.lease_end||''};
  if(slot>=0)data[slot]=res;else data.push(res);
  archived.splice(idx,1);
  await save(res);
  await deleteRecord(id);
  await loadAll();
  renderTable();
  toast(`${r.name||'Tenant'} restored to Apt ${r.apt}`,'success');
}
async function deletePermanent(id){if(!confirm('Permanently delete? Cannot be undone.'))return;archived=archived.filter(x=>x.id!==id);await deleteRecord(id);renderTable();toast('Record deleted.','error');}

// ── DETAIL ─────────────────────────────────────────
function openDetail(id){const r=data.find(x=>x.id===id);if(!r)return;detailId=id;document.getElementById('dApt').textContent=r.apt;document.getElementById('dName').textContent=r.name||'Vacant';document.getElementById('dOwner').textContent='Owner: '+(r.owner||'—');document.getElementById('dNote').value=r.note||'';const s=dueStatus(r);
  // Rent display — for short stays, read from actual archive records
  let rentDisplay = r.rent ? `$${r.rent.toLocaleString()}` : '—';
  if(r.type === 'short-stay' && r.checkin && (r.lease_end || r.due)){
    // Find all archive records using booking_id (reliable) or fallback to apt+name
    let archRecords = [];
    if(r.booking_id){
      archRecords = archived.filter(a =>
        a.booking_id === r.booking_id && a.archived_date
      ).sort((a,b) => (a.archived_date||'').localeCompare(b.archived_date||''));
    }
    if(!archRecords.length){
      const checkinYM = (r.checkin||'').substring(0,7);
      archRecords = archived.filter(a =>
        a.apt === r.apt &&
        (a.name||'').trim().toLowerCase() === (r.name||'').trim().toLowerCase() &&
        a.archived_date && a.archived_date.substring(0,7) >= checkinYM
      ).sort((a,b) => (a.archived_date||'').localeCompare(b.archived_date||''));
    }
    // Also include current live month
    const liveTotal = r.rent || 0;
    const grandTotal = Math.round((archRecords.reduce((s,a)=>s+(a.rent||0),0) + liveTotal)*100)/100;

    if(archRecords.length > 0){
      const MONTHS=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      const archBreakdown = archRecords.map(a => {
        const d = new Date((a.archived_date||a.due||'')+'T00:00:00');
        const label = MONTHS[d.getMonth()] + ' ' + d.getFullYear();
        return `${label}: <strong>$${(a.rent||0).toLocaleString()}</strong>`;
      }).join(' &middot; ');
      // Current month
      const now = new Date();
      const curLabel = MONTHS[now.getMonth()] + ' ' + now.getFullYear();
      const fullBreakdown = archBreakdown + ` &middot; ${curLabel}: <strong>$${liveTotal.toLocaleString()}</strong>`;
      rentDisplay = `$${grandTotal.toLocaleString()} total<br><small style="color:var(--text3);font-size:10px;line-height:1.8">${fullBreakdown}</small>`;
    } else {
      // No archive records — fall back to proration calc
      const totalPaidAll = Math.round((r.history||[]).reduce((s,h)=>s+(typeof h.amt==='number'?h.amt:0),0)*100)/100;
      const displayRent = totalPaidAll > r.rent ? totalPaidAll : r.rent;
      const splits = calcProration(r.checkin, r.lease_end||r.due, displayRent);
      if(splits.length > 1){
        const breakdown = splits.map(s=>`${s.month}: <strong>$${s.portion.toLocaleString()}</strong> (${s.days}d)`).join(' &middot; ');
        rentDisplay = `$${displayRent.toLocaleString()} total<br><small style="color:var(--text3);font-size:10px;line-height:1.8">${breakdown}</small>`;
      }
    }
  }
  document.getElementById('dRows').innerHTML=[['Lease Type',typeBadge(r.type)],['Check-in',r.checkin?fmtDate(r.checkin):'—'],['Total Stay',rentDisplay],['Balance Owed',r.balance>0?`<span style="color:var(--red)">$${r.balance.toLocaleString()}</span>`:'<span style="color:var(--green)">✓ Paid</span>'],['Next Due',r.due?`<span class="${s==='overdue'?'due-overdue':s==='soon'?'due-soon':''}">${fmtDate(r.due)}</span>`:'—'],['Lease End',r.type!=='short-stay'&&r.lease_end?`<span style="color:var(--blue)">${fmtDate(r.lease_end)}</span>`:'—']].map(([l,v])=>`<div class="detail-row"><span class="dr-label">${l}</span><span class="dr-val">${v}</span></div>`).join('');const hist=r.history||[];document.getElementById('dHistory').innerHTML=hist.length?hist.map(h=>`<div class="history-item"><span class="hi-date">${fmtDate(h.date)}</span><span class="hi-text">${h.text}</span></div>`).join(''):'<div style="color:var(--text3);font-size:11px;padding:8px 0">No payments recorded yet.</div>';const btns=[];if(r.type!=='available')btns.push(`<button class="btn btn-primary btn-sm" onclick="openPayModal(${id})">💰 Payment</button>`);btns.push(`<button class="btn btn-secondary btn-sm" onclick="openEditModal(${id})">✏️ Edit</button>`);if(r.type!=='available')btns.push(`<button class="btn btn-ghost btn-sm" onclick="archiveTenant(${id})">📦 Archive</button>`);if(r.name)btns.push(`<button class="btn btn-secondary btn-sm" onclick="if(typeof openInboxThread==='function'){openInboxThread('${(r.name||'').replace(/'/g,"\\'")}')}else{openMsgModal('${(r.name||'').replace(/'/g,"\\'")}','${(r.email||parseNoteField(r.note,'Email')||'').replace(/'/g,"\\'")}','${(r.phone||parseNoteField(r.note,'Phone')||'').replace(/'/g,"\\'")}','${id}','${r.type==='short-stay'?'short-term':'mtm'}')}">💬 Message</button>`);btns.push(`<button class="btn btn-ghost btn-sm" onclick="openClearHistoryModal(${id})" style="color:var(--red);border-color:var(--red-border);" title="Clear payment history">🗑 History</button>`);
  // Delete button — available for any booking (not permanent long-term leases)
  btns.push(`<button class="btn btn-ghost btn-sm" onclick="deleteUnitRecord(${id})" style="color:var(--red);border-color:var(--red-border);">🗑 Delete</button>`);
  // Service / Appliances link to TechTrack
  btns.push(`<button class="btn btn-secondary btn-sm" onclick="goToFTPropertyDetail('${(r.apt||'').replace(/'/g,"\\'")}')" style="width:100%;margin-top:4px;justify-content:center;font-weight:600;background:linear-gradient(135deg,rgba(79,196,207,.12),rgba(124,58,237,.08));border-color:rgba(79,196,207,.3)">🔧 Service History &amp; Appliances</button>`);
  document.getElementById('dActions').innerHTML=btns.join('');document.getElementById('detailOverlay').classList.add('open');}
function closeDetail(){document.getElementById('detailOverlay').classList.remove('open');detailId=null;}
async function saveDetailNote(){if(!detailId)return;const idx=data.findIndex(x=>x.id===detailId);if(idx>=0){data[idx].note=document.getElementById('dNote').value;await save(data[idx]);renderTable();}}
function openModal(id){document.getElementById(id).classList.add('open');}
function closeModal(id){document.getElementById(id).classList.remove('open');}
document.addEventListener('click',e=>{['editModal','payModal','histGraphModal','unitsGraphModal','archEditModal','auditModal','calActionModal','blockModal','calBookingModal','rDrillModal'].forEach(id=>{if(e.target===document.getElementById(id))closeModal(id);});});
function toast(msg,type=''){const t=document.createElement('div');t.className='toast '+type;t.textContent=msg;document.getElementById('toastWrap').appendChild(t);setTimeout(()=>t.remove(),4000);}

// ═══════════════════════════════════════════════════════════════
// WPA UNIFIED MESSAGING — SMS / WhatsApp / Email
// Uses tech.willowpa.com/messages.php backend
// Available to ALL PropDesk modules (bookings, rent, tenants, etc.)
// ═══════════════════════════════════════════════════════════════

const WPA_MSG_URL = 'https://tech.willowpa.com/messages.php';

// Core send function — returns Promise
function WPA_sendMessage(opts){
  const to = opts.to || '';
  const msg = opts.msg || '';
  const channel = opts.channel || 'sms';
  if(!to || !msg) return Promise.resolve({ok:false,error:'Missing to or msg'});
  const payload = {action:'send', to, body:msg, channel};
  if(opts.toEmail) payload.toEmail = opts.toEmail;
  if(opts.subject) payload.subject = opts.subject;
  return fetch(WPA_MSG_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)})
    .then(r => r.json())
    .then(d => {
      if(!d.ok) console.warn('WPA_msg('+channel+') failed:',d.error||d);
      if(!opts.silent) toast(d.ok ? channel.toUpperCase()+' sent' : 'Send failed: '+(d.error||''), d.ok?'':'error');
      return d;
    })
    .catch(e => { console.warn('WPA_msg error:',e); return {ok:false,error:e.message}; });
}

// Send via best channel for a contact object {phone,email,preferredComm}
function WPA_notify(contact, msg, extraOpts){
  const pref = (contact.preferredComm||contact.clientPreferredComm||'sms').toLowerCase();
  const channel = ['sms','whatsapp','email'].includes(pref) ? pref : 'sms';
  const to = channel==='email' ? (contact.email||contact.clientEmail||'') : (contact.phone||contact.clientPhone||'');
  if(!to) return Promise.resolve({ok:false,error:'No '+channel+' contact'});
  const opts = {to, msg, channel, ...(extraOpts||{})};
  if(channel==='email'){
    opts.toEmail = contact.email||contact.clientEmail;
    opts.subject = opts.subject || 'WillowPA Update';
  }
  return WPA_sendMessage(opts);
}

// Convenience wrappers
function WPA_sms(to,msg){ return WPA_sendMessage({to,msg,channel:'sms',silent:true}); }
function WPA_whatsapp(to,msg){ return WPA_sendMessage({to,msg,channel:'whatsapp',silent:true}); }
function WPA_email(toEmail,subject,body){ return WPA_sendMessage({to:toEmail,msg:body,channel:'email',toEmail,subject,silent:true}); }

// ── Booking Notifications ──
function WPA_notifyBookingConfirm(booking){
  if(!booking||(!booking.phone&&!booking.email)) return;
  const apt = booking.apt || booking.unit || '';
  const checkin = booking.checkin || '';
  const msg = 'WillowPA: Your booking for '+apt+' is confirmed! Check-in: '+checkin+'. We will send details closer to your arrival date.';
  WPA_notify(booking, msg, {subject:'Booking Confirmed — WillowPA'});
}

function WPA_notifyBookingCheckin(booking){
  if(!booking||(!booking.phone&&!booking.email)) return;
  const apt = booking.apt || booking.unit || '';
  const msg = 'WillowPA: Welcome! Your unit '+apt+' is ready for check-in. Please let us know if you need anything during your stay.';
  WPA_notify(booking, msg, {subject:'Check-in Ready — WillowPA'});
}

function WPA_notifyBookingCheckout(booking){
  if(!booking||(!booking.phone&&!booking.email)) return;
  const apt = booking.apt || booking.unit || '';
  const msg = 'WillowPA: Checkout reminder for '+apt+'. Please ensure all keys are returned and the unit is in good condition. Thank you for staying with us!';
  WPA_notify(booking, msg, {subject:'Checkout Reminder — WillowPA'});
}

// ── Rent Reminders ──
function WPA_sendRentReminder(tenant, amount, dueDate){
  if(!tenant||(!tenant.phone&&!tenant.email)) return;
  const unit = tenant.unit || '';
  const msg = 'WillowPA: Rent reminder for Unit '+unit+'. Amount due: $'+(amount||0).toFixed(2)+' by '+(dueDate||'the 1st')+'. Please contact us if you have questions.';
  WPA_notify(tenant, msg, {subject:'Rent Reminder — WillowPA'});
}

function WPA_sendRentOverdue(tenant, amount, daysPast){
  if(!tenant||(!tenant.phone&&!tenant.email)) return;
  const unit = tenant.unit || '';
  const msg = 'WillowPA: OVERDUE — Rent for Unit '+unit+' is '+(daysPast||0)+' day(s) past due. Balance: $'+(amount||0).toFixed(2)+'. Late fees may apply. Please remit payment immediately or contact us.';
  WPA_notify(tenant, msg, {subject:'Rent Overdue Notice — WillowPA'});
}

// ── Tenant Notifications ──
function WPA_notifyTenant(tenant, msg, subject){
  if(!tenant||(!tenant.phone&&!tenant.email)) return;
  WPA_notify(tenant, 'WillowPA: '+msg, {subject:subject||'Notice from WillowPA'});
}

// ── Maintenance Notifications ──
function WPA_notifyMaintenanceScheduled(tenant, issueDesc, scheduledDate){
  if(!tenant||(!tenant.phone&&!tenant.email)) return;
  const msg = 'WillowPA Maintenance: Your request "'+issueDesc+'" has been scheduled for '+(scheduledDate||'soon')+'. A technician will contact you before arrival.';
  WPA_notify(tenant, msg, {subject:'Maintenance Scheduled — WillowPA'});
}

function WPA_notifyMaintenanceComplete(tenant, issueDesc){
  if(!tenant||(!tenant.phone&&!tenant.email)) return;
  const msg = 'WillowPA Maintenance: Your request "'+issueDesc+'" has been completed. Please let us know if there are any issues.';
  WPA_notify(tenant, msg, {subject:'Maintenance Complete — WillowPA'});
}
// ═══════════════════════════════════════════════════════════════
// MAIN SETTINGS — Section Toggle, API Keys, Messaging Config
// ═══════════════════════════════════════════════════════════════

function showSettingsSection(secId) {
  // Hide all settings sections
  document.querySelectorAll('.settings-sec').forEach(s => s.style.display = 'none');
  // Show target
  const target = document.getElementById('settings-sec-' + secId);
  if (target) target.style.display = '';
  // Populate fields when opening
  if (secId === 'api-keys') WPA_renderApiKeyStatus();
  if (secId === 'messaging') WPA_renderMsgStatus();
}

// API Keys — These write to FT_state (shared server-side state)
function WPA_saveApiKey() {
  const k = (document.getElementById('main-api-key') || {}).value || '';
  if (typeof setApiKey === 'function') setApiKey(k);
  WPA_renderApiKeyStatus();
  toast(k ? 'API key saved' : 'API key cleared', k ? 'success' : '');
}
function WPA_saveStripeKey() {
  const k = (document.getElementById('main-stripe-key') || {}).value || '';
  if (typeof setStripeKey === 'function') setStripeKey(k);
  WPA_renderApiKeyStatus();
  toast(k ? 'Stripe key saved' : 'Stripe key cleared', k ? 'success' : '');
}
function WPA_renderApiKeyStatus() {
  // Anthropic
  const key = typeof getApiKey === 'function' ? getApiKey() : '';
  const inp = document.getElementById('main-api-key');
  const st = document.getElementById('main-api-status');
  if (inp) inp.value = key;
  if (st) {
    if (key) { st.textContent = 'Configured (' + key.length + ' chars)'; st.style.color = 'var(--success)'; }
    else { st.textContent = 'Not configured — AI features disabled'; st.style.color = 'var(--accent3)'; }
  }
  // Also update old FT settings page if it exists
  if (typeof renderSettingsPage === 'function') renderSettingsPage();
  // Stripe
  const sk = typeof getStripeKey === 'function' ? getStripeKey() : '';
  const sInp = document.getElementById('main-stripe-key');
  const sSt = document.getElementById('main-stripe-status');
  if (sInp) sInp.value = sk;
  if (sSt) {
    if (sk) { sSt.textContent = 'Configured (' + (sk.startsWith('sk_test') ? 'TEST' : 'LIVE') + ')'; sSt.style.color = sk.startsWith('sk_test') ? 'var(--accent)' : 'var(--success)'; }
    else { sSt.textContent = 'Not configured — manual payment links only'; sSt.style.color = 'var(--accent3)'; }
  }
}

// Messaging settings — stored in FT_state._msgConfig
function WPA_getMsgConfig() {
  if (typeof FT_state !== 'undefined' && FT_state) return FT_state._msgConfig || {};
  return {};
}
function WPA_setMsgConfig(cfg) {
  if (typeof FT_state !== 'undefined' && FT_state) {
    FT_state._msgConfig = Object.assign(FT_state._msgConfig || {}, cfg);
    if (typeof FT_save === 'function') FT_save();
  }
}
function WPA_saveMsgSettings(channel) {
  if (channel === 'sms') {
    WPA_setMsgConfig({
      flowrouteAccess: (document.getElementById('main-flowroute-access') || {}).value || '',
      flowrouteSecret: (document.getElementById('main-flowroute-secret') || {}).value || '',
      flowrouteFrom: (document.getElementById('main-flowroute-from') || {}).value || '',
      flowrouteAdmin: (document.getElementById('main-flowroute-admin') || {}).value || ''
    });
    toast('SMS settings saved', 'success');
  } else if (channel === 'whatsapp') {
    WPA_setMsgConfig({
      waPhoneId: (document.getElementById('main-wa-phone-id') || {}).value || '',
      waToken: (document.getElementById('main-wa-token') || {}).value || ''
    });
    toast('WhatsApp settings saved', 'success');
  } else if (channel === 'email') {
    WPA_setMsgConfig({
      smtpHost: (document.getElementById('main-smtp-host') || {}).value || '',
      smtpPort: (document.getElementById('main-smtp-port') || {}).value || '',
      smtpUser: (document.getElementById('main-smtp-user') || {}).value || '',
      smtpPass: (document.getElementById('main-smtp-pass') || {}).value || '',
      smtpFrom: (document.getElementById('main-smtp-from') || {}).value || '',
      smtpName: (document.getElementById('main-smtp-name') || {}).value || ''
    });
    toast('Email settings saved', 'success');
  }
  WPA_renderMsgStatus();
}
function WPA_renderMsgStatus() {
  const cfg = WPA_getMsgConfig();
  // SMS
  const smsEl = document.getElementById('main-sms-status');
  if (smsEl) {
    if (cfg.flowrouteAccess && cfg.flowrouteFrom) { smsEl.textContent = 'Configured — FROM: ' + cfg.flowrouteFrom; smsEl.style.color = 'var(--success)'; }
    else { smsEl.textContent = 'Not configured — using server config.php defaults'; smsEl.style.color = 'var(--accent)'; }
  }
  // Fill fields
  if (cfg.flowrouteAccess) { const el = document.getElementById('main-flowroute-access'); if (el) el.value = cfg.flowrouteAccess; }
  if (cfg.flowrouteSecret) { const el = document.getElementById('main-flowroute-secret'); if (el) el.value = cfg.flowrouteSecret; }
  if (cfg.flowrouteFrom)   { const el = document.getElementById('main-flowroute-from'); if (el) el.value = cfg.flowrouteFrom; }
  if (cfg.flowrouteAdmin)  { const el = document.getElementById('main-flowroute-admin'); if (el) el.value = cfg.flowrouteAdmin; }
  // WhatsApp
  const waEl = document.getElementById('main-wa-status');
  if (waEl) {
    if (cfg.waPhoneId && cfg.waToken) { waEl.textContent = 'Configured — Phone ID: ' + cfg.waPhoneId; waEl.style.color = 'var(--success)'; }
    else { waEl.textContent = 'Not configured — using server config.php defaults'; waEl.style.color = 'var(--accent)'; }
  }
  if (cfg.waPhoneId) { const el = document.getElementById('main-wa-phone-id'); if (el) el.value = cfg.waPhoneId; }
  if (cfg.waToken)   { const el = document.getElementById('main-wa-token'); if (el) el.value = cfg.waToken; }
  // Email
  const emEl = document.getElementById('main-email-status');
  if (emEl) {
    if (cfg.smtpHost && cfg.smtpFrom) { emEl.textContent = 'Configured — FROM: ' + cfg.smtpFrom; emEl.style.color = 'var(--success)'; }
    else { emEl.textContent = 'Not configured — using server config.php defaults'; emEl.style.color = 'var(--accent)'; }
  }
  if (cfg.smtpHost) { const el = document.getElementById('main-smtp-host'); if (el) el.value = cfg.smtpHost; }
  if (cfg.smtpPort) { const el = document.getElementById('main-smtp-port'); if (el) el.value = cfg.smtpPort; }
  if (cfg.smtpUser) { const el = document.getElementById('main-smtp-user'); if (el) el.value = cfg.smtpUser; }
  if (cfg.smtpPass) { const el = document.getElementById('main-smtp-pass'); if (el) el.value = cfg.smtpPass; }
  if (cfg.smtpFrom) { const el = document.getElementById('main-smtp-from'); if (el) el.value = cfg.smtpFrom; }
  if (cfg.smtpName) { const el = document.getElementById('main-smtp-name'); if (el) el.value = cfg.smtpName; }
}
function WPA_testSend(channel) {
  const cfg = WPA_getMsgConfig();
  if (channel === 'sms') {
    const to = cfg.flowrouteAdmin || prompt('Enter phone number to test (+1XXXXXXXXXX):');
    if (!to) return;
    WPA_sms(to, 'PropDesk test SMS — if you received this, SMS is working!');
  } else if (channel === 'whatsapp') {
    const to = prompt('Enter WhatsApp number to test (+1XXXXXXXXXX):');
    if (!to) return;
    WPA_whatsapp(to, 'PropDesk test WhatsApp — if you received this, WhatsApp is working!');
  } else if (channel === 'email') {
    const to = prompt('Enter email address to test:');
    if (!to) return;
    WPA_email(to, 'PropDesk Test Email', 'This is a test email from PropDesk. If you received this, email is configured correctly.');
  }
}

// Update automation badge with pending reminders count
function updateAutomationBadge(){const pending=data.filter(r=>!r.archived&&r.due&&new Date(r.due)<=new Date()).length;const badge=document.getElementById('automationBadge');if(!badge)return;if(pending>0){badge.textContent=pending;badge.classList.remove('hidden');}else{badge.classList.add('hidden');}}
// Update last synced timestamp on dashboard
function updateLastSynced(){const ts=localStorage.getItem('lastSync');if(ts){const d=new Date(parseInt(ts));const now=new Date();const diff=Math.floor((now-d)/1000);let text='';if(diff<60){text='Just now';}else if(diff<3600){text=Math.floor(diff/60)+'m ago';}else if(diff<86400){text=Math.floor(diff/3600)+'h ago';}else{text=Math.floor(diff/86400)+'d ago';}const el=document.getElementById('lastSynced');if(el){el.textContent='Last synced '+text;}}else{const el=document.getElementById('lastSynced');if(el){el.textContent='Never synced';}}}
// Call updateLastSynced periodically
setInterval(updateLastSynced,30000);
function exportCSV(){const h=['Apt','Owner','Tenant','Type','Rent','Balance','Due Date','Note'];const rows=data.filter(r=>!r.archived).map(r=>[r.apt,r.owner,r.name,r.type,r.rent,r.balance,r.due,`"${(r.note||'').replace(/"/g,'""')}"`]);const a=document.createElement('a');a.href='data:text/csv;charset=utf-8,'+encodeURIComponent([h,...rows].map(r=>r.join(',')).join('\n'));a.download='propdesk-export.csv';a.click();toast('CSV exported ✓','success');}

// ── PAGE NAV ───────────────────────────────────────
// Auto-open tab from sessionStorage (e.g. coming back from property-settings)
window.addEventListener('DOMContentLoaded', function(){
  const openTab = sessionStorage.getItem('openTab');
  if(openTab){
    sessionStorage.removeItem('openTab');
    // Try module tab first, fall back to legacy nav-tab
    const modTab = document.querySelector(`#moduleBar [data-module="${openTab}"]`);
    if(modTab) { setTimeout(()=>modTab.click(), 800); }
    else {
      const tab = document.querySelector(`.nav-tab[onclick*="'${openTab}'"]`);
      if(tab) setTimeout(()=>tab.click(), 800);
    }
  }
});

// ══════════════════════════════════════════════════════
//  MODULE NAVIGATION SYSTEM (Layout C: Hybrid)
// ══════════════════════════════════════════════════════

// Sub-tab configs per module
const MODULE_SUB_TABS = {
  'dashboard':   [{label:'Overview',    page:'dashboard'},  {label:'Units', page:'units'}, {label:'Properties', page:'properties'}, {label:'Reports', page:'reports'}],
  'short-term':  [{label:'Dashboard',   page:'st-dashboard'},  {label:'Pipeline', page:'pipeline'}, {label:'Calendar', page:'calendar'}, {label:'Units', page:'units'}, {label:'Messages', page:'messages'}, {label:'Archive', page:'history'}],
  'mtm-lt':      [{label:'Dashboard',   page:'mtm-lt'},     {label:'Tenants', page:'mtm-lt-tenants'}, {label:'Leases', page:'mtm-lt-leases'}, {label:'Rent', page:'mtm-lt-rent'}, {label:'Applications', page:'mtm-lt-applications'}, {label:'Messages', page:'mtm-lt-messages'}],
  'expenses':    [{label:'All',         page:'expenses'},   {label:'By Property', page:'expenses', expView:'property'}, {label:'By Category', page:'expenses', expView:'category'}],
  'techtrack':   [{label:'Dashboard',   page:'techtrack', ftPage:'dashboard'},  {label:'Work Orders', page:'techtrack', ftPage:'jobs'}, {label:'Incoming', page:'techtrack', ftPage:'incoming'}, {label:'Completed', page:'techtrack', ftPage:'completed'}, {label:'Properties', page:'techtrack', ftPage:'properties'}, {label:'Owners', page:'techtrack', ftPage:'owners'}, {label:'Technicians', page:'techtrack', ftPage:'technicians'}, {label:'Availability', page:'techtrack', ftPage:'availability'}, {label:'Reports', page:'techtrack', ftPage:'reports'}],
  'parking':     [{label:'Bookings',   page:'parking', pkSec:'bookings'},    {label:'Buildings', page:'parking', pkSec:'buildings'}, {label:'Coupons', page:'parking', pkSec:'coupons'}, {label:'Receipts', page:'parking', pkSec:'receipts'}],
  'messages':    [{label:'All',         page:'msg-center', msgFilter:'all'}, {label:'Short-Term', page:'msg-center', msgFilter:'short-term'}, {label:'Long-Term', page:'msg-center', msgFilter:'long-term'}, {label:'Client App', page:'msg-center', msgFilter:'client'}],
  'mailroom':    [{label:'Packages',   page:'mailroom', dlSec:'packages'}, {label:'Tenants', page:'mailroom', dlSec:'tenants'}, {label:'Reports', page:'mailroom', dlSec:'reports'}, {label:'Kiosk', page:'mailroom', dlSec:'kiosk'}],
  'settings':    [{label:'General',     page:'settings', settingsSec:'accounts'},   {label:'API Keys', page:'settings', settingsSec:'api-keys'}, {label:'Messaging', page:'settings', settingsSec:'messaging'}, {label:'Theme', page:'settings', settingsSec:'theme'}],
};

let currentModule = 'dashboard';
let currentPropertyFilter = 'all';

function switchModule(moduleId, tabEl) {
  currentModule = moduleId;
  // Update module tabs
  document.querySelectorAll('#moduleBar .module-tab').forEach(t => t.classList.remove('active'));
  if (tabEl) tabEl.classList.add('active');
  else {
    const tab = document.querySelector(`#moduleBar [data-module="${moduleId}"]`);
    if (tab) tab.classList.add('active');
  }
  // Build sub-nav
  const subNav = document.getElementById('subNav');
  const tabs = MODULE_SUB_TABS[moduleId] || [];
  subNav.innerHTML = tabs.map((t, i) => {
    let args = "'" + t.page + "',this";
    if (t.ftPage) args += ",'" + t.ftPage + "'";
    else if (t.settingsSec) args += ",null,'" + t.settingsSec + "'";
    else if (t.expView) args += ",null,null,'" + t.expView + "'";
    else if (t.pkSec) args += ",null,null,null,'" + t.pkSec + "'";
    else if (t.dlSec) args += ",null,null,null,null,'" + t.dlSec + "'";
    else if (t.msgFilter) args += ",null,null,null,null,null,'" + t.msgFilter + "'";
    const badgeId = t.ftPage ? 'ft-sub-badge-' + t.ftPage : (t.page ? 'sub-badge-' + t.page : '');
    const badgeHtml = badgeId ? ` <span class="mod-badge" id="${badgeId}" style="display:none">0</span>` : '';
    return `<div class="sub-tab${i === 0 ? ' active' : ''}" onclick="showSubPage(${args})">${t.label}${badgeHtml}</div>`;
  }).join('');
  // Show default page for this module
  if (tabs.length > 0) {
    const t0 = tabs[0];
    showSubPage(t0.page, subNav.querySelector('.sub-tab'), t0.ftPage, t0.settingsSec, t0.expView, t0.pkSec, t0.dlSec, t0.msgFilter);
  }
}

let _ftInitialized = false;
function showSubPage(pageId, tabEl, ftPage, settingsSec, expView, pkSec, dlSec, msgFilter) {
  // Update sub-tab active state
  if (tabEl) {
    tabEl.parentElement.querySelectorAll('.sub-tab').forEach(t => t.classList.remove('active'));
    tabEl.classList.add('active');
  }

  // ── Settings section routing ──
  if (settingsSec) {
    showSettingsSection(settingsSec);
  }

  // ── Parking section routing ──
  if (pkSec) {
    showParkingSection(pkSec);
  }

  // ── Delivery section routing ──
  if (dlSec) {
    showDeliverySection(dlSec);
  }

  // ── Message Center routing ──
  if (pageId === 'msg-center') {
    _currentMsgCenterFilter = msgFilter || 'all';
    renderMessageCenter();
  }

  // ── Expenses view routing ──
  if (pageId === 'expenses') {
    _currentExpView = expView || 'all';
    renderExpensesPage();
  }

  // ── FieldTrack / TechTrack routing ──
  if (ftPage && typeof FT_showPage === 'function') {
    // Show the techtrack container page
    document.querySelectorAll('.page').forEach(x => x.classList.remove('active'));
    const ttPage = document.getElementById('page-techtrack');
    if (ttPage) ttPage.classList.add('active');
    // Initialize FT on first use (pass target page so it renders after data loads)
    if (!_ftInitialized && typeof FT_init === 'function') {
      FT_init(ftPage);
      _ftInitialized = true;
      return;
    }
    // Already initialized — just navigate
    FT_showPage(ftPage);
    return;
  }

  // For pages that don't exist yet (future sub-pages), show the module's main placeholder
  const pageEl = document.getElementById('page-' + pageId);
  if (!pageEl) {
    // Show the module's main page as fallback
    const fallback = document.getElementById('page-' + currentModule);
    if (fallback) {
      document.querySelectorAll('.page').forEach(x => x.classList.remove('active'));
      fallback.classList.add('active');
    }
    return;
  }
  // Show the page
  document.querySelectorAll('.page').forEach(x => x.classList.remove('active'));
  pageEl.classList.add('active');
  // Trigger render functions
  if(pageId === 'dashboard'){renderDashboard().catch(e=>console.error('Dashboard render error:',e));checkBackupStatus();}
  if(pageId === 'st-dashboard'){renderSTDashboard().catch(e=>console.error('ST Dashboard render error:',e));}
  if(pageId === 'reports') renderReports();
  if(pageId === 'history') renderHistory();
  if(pageId === 'calendar') renderCalendar();
  if(pageId === 'messages'){renderInbox();startPlatformAutoSync();}
  if(pageId === 'pipeline') renderPipeline();
  if(pageId === 'properties') renderProperties();
  if(pageId === 'units') renderTable();
  if(pageId === 'mtm-lt') { renderMTMDashboard(); setTimeout(() => renderMTMDashboardInteractive(), 50); }
  if(pageId === 'mtm-lt-tenants') renderMTMTenants();
  if(pageId === 'mtm-lt-leases') renderMTMLeases();
  if(pageId === 'mtm-lt-rent') renderMTMRent();
  if(pageId === 'mtm-lt-messages') renderMTMMessages();
  if(pageId === 'mtm-lt-applications') renderMTMApps();
  if(pageId === 'mtm-lt-expenses') renderExpensesPage();
  if(pageId === 'expenses') renderExpensesPage();
  if(pageId === 'mtm-lt-maintenance') loadMaintenanceFromSupabase();
}

// ── Property Selector ──
function togglePropertyDropdown(e) {
  const sel = document.getElementById('propertySelector');
  const dd = document.getElementById('propDropdown');
  sel.classList.toggle('open');
  dd.classList.toggle('open');
  if (e) e.stopPropagation();
  else if (typeof event !== 'undefined') event.stopPropagation();
}
document.addEventListener('click', () => {
  document.getElementById('propertySelector')?.classList.remove('open');
  document.getElementById('propDropdown')?.classList.remove('open');
});
function selectProperty(e, owner, label) {
  if (e) e.stopPropagation();
  currentPropertyFilter = owner;
  document.getElementById('propSelectorName').textContent = label;
  document.getElementById('propertySelector').classList.remove('open');
  document.getElementById('propDropdown').classList.remove('open');
  // Update active states
  document.querySelectorAll('#propDropdown .prop-dd-item').forEach(i => i.classList.remove('active'));
  if (e && e.target) {
    const item = e.target.closest('.prop-dd-item');
    if (item) item.classList.add('active');
  }
  // Re-render current view with filter
  renderTable();
}
function populatePropertyDropdown() {
  const dd = document.getElementById('propDropdown');
  if (!dd) return;
  // Get unique owners from data
  const owners = {};
  (window.DATA || []).forEach(u => {
    if (!u.archived && u.owner) {
      if (!owners[u.owner]) owners[u.owner] = 0;
      owners[u.owner]++;
    }
  });
  const total = Object.values(owners).reduce((a,b)=>a+b, 0);
  // Build dropdown
  let html = `<div class="prop-dd-item prop-dd-all active" data-owner="all" onclick="selectProperty(event,'all','All Properties')">
    <span>🌐</span><div><div class="prop-dd-name">All Properties</div><div class="prop-dd-units">${total} units</div></div>
  </div>`;
  Object.entries(owners).sort((a,b)=>b[1]-a[1]).forEach(([owner, count]) => {
    html += `<div class="prop-dd-item" data-owner="${owner}" onclick="selectProperty(event,'${owner.replace(/'/g,"\\'")}','${owner.replace(/'/g,"\\'")}')">
      <span>🏢</span><div><div class="prop-dd-name">${owner}</div><div class="prop-dd-units">${count} units</div></div>
    </div>`;
  });
  dd.innerHTML = html;
}

// ── Initialize module nav on load ──
function initModuleNav() {
  populatePropertyDropdown();
  switchModule('dashboard', document.querySelector('#moduleBar [data-module="dashboard"]'));
  // Update MTM stats from current data
  updateMTMStats();
}
function updateMTMStats() {
  const data = window.DATA || [];
  const lt = data.filter(u => !u.archived && u.type === 'long-term');
  const mtm = data.filter(u => !u.archived && u.type === 'month-to-month');
  const all = [...lt, ...mtm];
  const el = (id, val) => { const e = document.getElementById(id); if(e) e.textContent = val; };
  el('mtm-tenants', all.filter(u => u.name).length);
  el('mtm-leases', all.length);
  // Count expiring within 90 days
  const now = new Date();
  const d90 = new Date(now.getTime() + 90*24*60*60*1000);
  const expiring = all.filter(u => u.lease_end && new Date(u.lease_end) <= d90 && new Date(u.lease_end) >= now);
  el('mtm-expiring', expiring.length);
  const overdue = all.reduce((s,u) => s + (u.balance || 0), 0);
  el('mtm-overdue', '$' + overdue.toLocaleString());
}

// ══════════════════════════════════════════════════════
//  MTM / LONG-TERM MODULE — REAL INNAGO DATA
// ══════════════════════════════════════════════════════

const INNAGO_TENANTS = [
  {name:"Alena Larina",unit:"46 Township Line Road | 311",property:"46 Township Line Road",unitNum:"311",status:"Active",rent:915,roommates:1,email:"alena62022@gmail.com",phone:"(267) 504-6551",since:"Aug 19, 2023"},
  {name:"Anna Chubatiuk",unit:"46 Township Line Road | 232",property:"46 Township Line Road",unitNum:"232",status:"Active",rent:1150,roommates:1},
  {name:"Bhargavkumar Chaudhary",unit:"7845 Montgomery Avenue | Unit 1B",property:"7845 Montgomery Avenue",unitNum:"Unit 1B",status:"Active",rent:425,roommates:2},
  {name:"Carol Tyndale",unit:"46 Township Line Road | 317",property:"46 Township Line Road",unitNum:"317",status:"Active",rent:2700,roommates:0},
  {name:"Clamira Smith",unit:"426 Central | Office",property:"426 Central",unitNum:"Office",status:"Active",rent:1450,roommates:0},
  {name:"DaJana Ford",unit:"426 Central | Unit 4",property:"426 Central",unitNum:"Unit 4",status:"Active",rent:1830,roommates:0},
  {name:"Danielle Corrado",unit:"7845 Montgomery Avenue | Unit 10 - CH",property:"7845 Montgomery Avenue",unitNum:"Unit 10-CH",status:"Active",rent:1075,roommates:1},
  {name:"David Brooker",unit:"46 Township Line Road | 111",property:"46 Township Line Road",unitNum:"111",status:"Active",rent:0,roommates:1},
  {name:"Deborah Massaud",unit:"7845 Montgomery Avenue | Unit 1",property:"7845 Montgomery Avenue",unitNum:"Unit 1",status:"Active",rent:1650,roommates:1},
  {name:"Ekaterina Shakhova",unit:"46 Township Line Road | 122",property:"46 Township Line Road",unitNum:"122",status:"Active",rent:2060,roommates:0},
  {name:"Farrukh Kurbanov",unit:"46 Township Line Road | 230",property:"46 Township Line Road",unitNum:"230",status:"Active",rent:900,roommates:1},
  {name:"Feruz Safarov",unit:"46 Township Line Road | 230",property:"46 Township Line Road",unitNum:"230",status:"Active",rent:900,roommates:1},
  {name:"FRANTZ NOEL",unit:"46 Township Line Road | 203",property:"46 Township Line Road",unitNum:"203",status:"Active",rent:2450,roommates:0},
  {name:"Gina Krier",unit:"7845 Montgomery Avenue | Unit 2",property:"7845 Montgomery Avenue",unitNum:"Unit 2",status:"Active",rent:2850,roommates:1},
  {name:"Giorgi Devnosadze",unit:"46 Township Line Road | 211",property:"46 Township Line Road",unitNum:"211",status:"Active",rent:1600,roommates:0},
  {name:"Gurkaran Badh",unit:"46 Township Line Road | 301",property:"46 Township Line Road",unitNum:"301",status:"Future",rent:1200,roommates:1},
  {name:"Hanna Savonenko",unit:"46 Township Line Road | 329",property:"46 Township Line Road",unitNum:"329",status:"Active",rent:900,roommates:1},
  {name:"Jashan Hansra",unit:"46 Township Line Road | 301",property:"46 Township Line Road",unitNum:"301",status:"Future",rent:1200,roommates:1},
  {name:"Jeffrey Sharman",unit:"7845 Montgomery Avenue | Unit 10 - CH",property:"7845 Montgomery Avenue",unitNum:"Unit 10-CH",status:"Active",rent:1075,roommates:1},
  {name:"Joshua Bluestine",unit:"7845 Montgomery Avenue | Unit 1A",property:"7845 Montgomery Avenue",unitNum:"Unit 1A",status:"Active",rent:550,roommates:1},
  {name:"Justin Krebs",unit:"7845 Montgomery Avenue | Unit 8",property:"7845 Montgomery Avenue",unitNum:"Unit 8",status:"Active",rent:1100,roommates:0},
  {name:"Kate Bergan",unit:"46 Township Line Road | 205",property:"46 Township Line Road",unitNum:"205",status:"Future",rent:1650,roommates:0},
  {name:"Kristen Brooker",unit:"46 Township Line Road | 111",property:"46 Township Line Road",unitNum:"111",status:"Active",rent:2500,roommates:1},
  {name:"Kristina Newton",unit:"7845 Montgomery Avenue | Unit 7",property:"7845 Montgomery Avenue",unitNum:"Unit 7",status:"Active",rent:1820,roommates:0},
  {name:"Lashaie N. Lee Lewis",unit:"7845 Montgomery Avenue | Unit 4",property:"7845 Montgomery Avenue",unitNum:"Unit 4",status:"Active",rent:1930,roommates:0},
  {name:"Lesia Riabkova",unit:"46 Township Line Road | 323",property:"46 Township Line Road",unitNum:"323",status:"Active",rent:900,roommates:1},
  {name:"Liana Mratkhuzina",unit:"426 Central | Unit 1",property:"426 Central",unitNum:"Unit 1",status:"Active",rent:0,roommates:1},
  {name:"Maksim Fursov",unit:"46 Township Line Road | 127",property:"46 Township Line Road",unitNum:"127",status:"Active",rent:925,roommates:1},
  {name:"Marissa Bluestine",unit:"7845 Montgomery Avenue | Unit 1A",property:"7845 Montgomery Avenue",unitNum:"Unit 1A",status:"Active",rent:550,roommates:1},
  {name:"Maryam Gurbandurdyyeva",unit:"926 Fox Chase Rd | Retail",property:"926 Fox Chase Rd",unitNum:"Retail",status:"Active",rent:1175,roommates:0},
  {name:"Michael Krier",unit:"7845 Montgomery Avenue | Unit 2",property:"7845 Montgomery Avenue",unitNum:"Unit 2",status:"Active",rent:0,roommates:1},
  {name:"Miesha Sassone",unit:"46 Township Line Road | 221",property:"46 Township Line Road",unitNum:"221",status:"Active",rent:1750,roommates:0},
  {name:"Naijeya Shykye Lyons",unit:"46 Township Line Road | 325",property:"46 Township Line Road",unitNum:"325",status:"Active",rent:1450,roommates:0},
  {name:"New Healthworks, Inc",unit:"46 Township Line Road | 331",property:"46 Township Line Road",unitNum:"331",status:"Future",rent:1900,roommates:0},
  {name:"Noridden Massaud",unit:"7845 Montgomery Avenue | Unit 1",property:"7845 Montgomery Avenue",unitNum:"Unit 1",status:"Active",rent:0,roommates:1},
  {name:"Oleh Chubatiuk",unit:"46 Township Line Road | 232",property:"46 Township Line Road",unitNum:"232",status:"Active",rent:1150,roommates:1},
  {name:"Oleh Riabkov",unit:"46 Township Line Road | 323",property:"46 Township Line Road",unitNum:"323",status:"Active",rent:900,roommates:1},
  {name:"Otar Khaniashvili",unit:"431 Valley Rd | Unit CH",property:"431 Valley Rd",unitNum:"Unit CH",status:"Active",rent:2350,roommates:0},
  {name:"Pavel Artyshevskii",unit:"426 Central | Unit 1",property:"426 Central",unitNum:"Unit 1",status:"Active",rent:2070,roommates:1},
  {name:"Polina Fursova",unit:"46 Township Line Road | 127",property:"46 Township Line Road",unitNum:"127",status:"Active",rent:925,roommates:1},
  {name:"Renat Sakiev",unit:"431 Valley Rd | Unit A2",property:"431 Valley Rd",unitNum:"Unit A2",status:"Active",rent:1600,roommates:0},
  {name:"Ritu Chotaliya",unit:"7845 Montgomery Avenue | Unit 1B",property:"7845 Montgomery Avenue",unitNum:"Unit 1B",status:"Active",rent:425,roommates:2},
  {name:"Robert Keppler",unit:"46 Township Line Road | 233",property:"46 Township Line Road",unitNum:"233",status:"Active",rent:2500,roommates:0},
  {name:"Serhii Lobodin",unit:"7845 Montgomery Avenue | Studio B",property:"7845 Montgomery Avenue",unitNum:"Studio B",status:"Active",rent:1000,roommates:0},
  {name:"SiNing Wang",unit:"46 Township Line Road | 219",property:"46 Township Line Road",unitNum:"219",status:"Active",rent:1675,roommates:0},
  {name:"Sunil Jayantibhai Patel",unit:"7845 Montgomery Avenue | Unit 1B",property:"7845 Montgomery Avenue",unitNum:"Unit 1B",status:"Active",rent:425,roommates:2},
  {name:"Taron Stokes",unit:"46 Township Line Road | 320",property:"46 Township Line Road",unitNum:"320",status:"Active",rent:1920,roommates:0},
  {name:"Tarsha R. Scovens",unit:"1614 Valley Glen Rd | 1",property:"1614 Valley Glen Rd",unitNum:"1",status:"Active",rent:2255,roommates:0},
  {name:"Victoria Deans",unit:"7845 Montgomery Avenue | Unit 6",property:"7845 Montgomery Avenue",unitNum:"Unit 6",status:"Active",rent:1550,roommates:0},
  {name:"Vitalii Savonenko",unit:"46 Township Line Road | 329",property:"46 Township Line Road",unitNum:"329",status:"Active",rent:900,roommates:1},
  {name:"Vladimir Fominykh",unit:"46 Township Line Road | 311",property:"46 Township Line Road",unitNum:"311",status:"Active",rent:915,roommates:1},
  {name:"Whitney Diane Rustin",unit:"7845 Montgomery Avenue | Unit 9 - CH",property:"7845 Montgomery Avenue",unitNum:"Unit 9-CH",status:"Active",rent:27000,roommates:0}
];

const INNAGO_LEASES = [
  {status:"Active",property:"46 Township Line Road",unit:"320",tenants:"Taron Stokes",start:"Apr 01, 2026",end:"M to M",type:"mtm"},
  {status:"Active",property:"46 Township Line Road",unit:"221",tenants:"Miesha Sassone",start:"Mar 21, 2026",end:"M to M",type:"mtm"},
  {status:"Active",property:"7845 Montgomery Avenue",unit:"Unit 8",tenants:"Justin Krebs",start:"Mar 09, 2026",end:"M to M",type:"mtm"},
  {status:"Active",property:"46 Township Line Road",unit:"317",tenants:"Carol Tyndale",start:"Feb 27, 2026",end:"M to M",type:"mtm"},
  {status:"Active",property:"46 Township Line Road",unit:"325",tenants:"Naijeya Shykye Lyons",start:"Feb 08, 2026",end:"Jan 31, 2027",type:"fixed"},
  {status:"Active",property:"46 Township Line Road",unit:"211",tenants:"Giorgi Devnosadze",start:"Feb 06, 2026",end:"Jan 31, 2027",type:"fixed"},
  {status:"Active",property:"7845 Montgomery Avenue",unit:"Unit 10-CH",tenants:"Danielle Corrado, Jeffrey Sharman",start:"Apr 01, 2026",end:"Mar 31, 2027",type:"fixed"},
  {status:"Active",property:"7845 Montgomery Avenue",unit:"Unit 2",tenants:"Gina Krier, Michael Krier",start:"Feb 04, 2026",end:"M to M",type:"mtm"},
  {status:"Active",property:"46 Township Line Road",unit:"230",tenants:"Farrukh Kurbanov, Feruz Safarov",start:"Feb 01, 2026",end:"Jan 31, 2027",type:"fixed"},
  {status:"Active",property:"7845 Montgomery Avenue",unit:"Unit 6",tenants:"Victoria Deans",start:"Jan 23, 2026",end:"Jan 31, 2027",type:"fixed"},
  {status:"Active",property:"46 Township Line Road",unit:"323",tenants:"Lesia Riabkova, Oleh Riabkov",start:"Feb 01, 2026",end:"Jan 31, 2027",type:"fixed"},
  {status:"Active",property:"426 Central",unit:"Unit 1",tenants:"Liana Mratkhuzina, Pavel Artyshevskii",start:"Dec 15, 2025",end:"Dec 14, 2026",type:"fixed"},
  {status:"Active",property:"7845 Montgomery Avenue",unit:"Studio B",tenants:"Serhii Lobodin",start:"Dec 01, 2025",end:"Nov 30, 2026",type:"fixed"},
  {status:"Active",property:"46 Township Line Road",unit:"232",tenants:"Anna Chubatiuk, Oleh Chubatiuk",start:"Dec 01, 2025",end:"M to M",type:"mtm"},
  {status:"Active",property:"926 Fox Chase Rd",unit:"Retail",tenants:"Maryam Gurbandurdyyeva",start:"Jan 12, 2026",end:"Jan 11, 2027",type:"fixed"},
  {status:"Active",property:"7845 Montgomery Avenue",unit:"Unit 4",tenants:"Lashaie N. Lee Lewis",start:"Nov 01, 2025",end:"Sep 30, 2026",type:"fixed"},
  {status:"Active",property:"46 Township Line Road",unit:"111",tenants:"David Brooker, Kristen Brooker",start:"Oct 02, 2025",end:"M to M",type:"mtm"},
  {status:"Active",property:"431 Valley Rd",unit:"Unit A2",tenants:"Renat Sakiev",start:"Sep 01, 2025",end:"Jul 31, 2026",type:"fixed"},
  {status:"Active",property:"7845 Montgomery Avenue",unit:"Unit 1B",tenants:"Bhargavkumar Chaudhary, Ritu Chotaliya, Sunil Jayantibhai Patel",start:"Sep 01, 2025",end:"Aug 31, 2026",type:"fixed"},
  {status:"Active",property:"46 Township Line Road",unit:"311",tenants:"Alena Larina, Vladimir Fominykh",start:"Oct 01, 2025",end:"Sep 30, 2026",type:"fixed"},
  {status:"Active",property:"7845 Montgomery Avenue",unit:"Unit 1",tenants:"Deborah Massaud, Noridden Massaud",start:"Sep 15, 2025",end:"Sep 30, 2026",type:"fixed"},
  {status:"Active",property:"46 Township Line Road",unit:"219",tenants:"Sining Wang",start:"Aug 23, 2025",end:"Aug 31, 2026",type:"fixed"},
  {status:"Active",property:"426 Central",unit:"Unit 4",tenants:"Dajana Ford",start:"Oct 01, 2025",end:"Sep 30, 2026",type:"fixed"},
  {status:"Active",property:"46 Township Line Road",unit:"127",tenants:"Maksim Fursov, Polina Fursova",start:"Sep 01, 2025",end:"Aug 31, 2026",type:"fixed"},
  {status:"Active",property:"1614 Valley Glen Rd",unit:"1",tenants:"Tarsha R. Scovens",start:"Aug 01, 2025",end:"Jul 31, 2027",type:"fixed"},
  {status:"Active",property:"46 Township Line Road",unit:"233",tenants:"Robert Keppler",start:"Aug 01, 2025",end:"Jul 31, 2026",type:"fixed"},
  {status:"Active",property:"46 Township Line Road",unit:"329",tenants:"Hanna Savonenko, Vitalii Savonenko",start:"Sep 18, 2024",end:"M to M",type:"mtm"},
  {status:"Active",property:"7845 Montgomery Avenue",unit:"Unit 1A",tenants:"Joshua Bluestine, Marissa Bluestine",start:"Feb 01, 2024",end:"M to M",type:"mtm"}
];

const INNAGO_RENT = [
  {property:"426 Central",unit:"Office",tenants:"Clamira Smith",amount:1450,paid:0,processing:0,balance:1450,status:"pending"},
  {property:"426 Central",unit:"Unit 1",tenants:"Liana Mratkhuzina, Pavel Artyshevskii",amount:2070,paid:0,processing:2070,balance:0,status:"processing"},
  {property:"431 Valley Rd",unit:"Unit CH",tenants:"Otar Khaniashvili",amount:2750,paid:2750,processing:0,balance:0,status:"paid"},
  {property:"431 Valley Rd",unit:"Unit A2",tenants:"Renat Sakiev",amount:1600,paid:0,processing:0,balance:1600,status:"overdue"},
  {property:"46 Township Line Road",unit:"311",tenants:"Alena Larina, Vladimir Fominykh",amount:1830,paid:1830,processing:0,balance:0,status:"paid"},
  {property:"46 Township Line Road",unit:"111",tenants:"David Brooker, Kristen Brooker",amount:2500,paid:2500,processing:0,balance:0,status:"paid"},
  {property:"46 Township Line Road",unit:"232",tenants:"Anna Chubatiuk, Oleh Chubatiuk",amount:2300,paid:2000,processing:0,balance:300,status:"partial"},
  {property:"46 Township Line Road",unit:"323",tenants:"Lesia Riabkova, Oleh Riabkov",amount:1800,paid:1200,processing:600,balance:0,status:"processing"},
  {property:"46 Township Line Road",unit:"230",tenants:"Farrukh Kurbanov, Feruz Safarov",amount:1800,paid:0,processing:1800,balance:0,status:"processing"},
  {property:"46 Township Line Road",unit:"211",tenants:"Giorgi Devnosadze",amount:1650,paid:1650,processing:0,balance:0,status:"paid"},
  {property:"46 Township Line Road",unit:"325",tenants:"Naijeya Shykye Lyons",amount:1450,paid:1447.50,processing:2.50,balance:0,status:"paid"},
  {property:"46 Township Line Road",unit:"317",tenants:"Carol Tyndale",amount:2700,paid:0,processing:0,balance:2700,status:"overdue"},
  {property:"46 Township Line Road",unit:"221",tenants:"Miesha Sassone",amount:1750,paid:0,processing:0,balance:1750,status:"pending"},
  {property:"46 Township Line Road",unit:"203",tenants:"FRANTZ NOEL",amount:2450,paid:2450,processing:0,balance:0,status:"paid"},
  {property:"46 Township Line Road",unit:"122",tenants:"Ekaterina Shakhova",amount:2060,paid:2060,processing:0,balance:0,status:"paid"},
  {property:"46 Township Line Road",unit:"320",tenants:"Taron Stokes",amount:1920,paid:1920,processing:0,balance:0,status:"paid"},
  {property:"46 Township Line Road",unit:"219",tenants:"SiNing Wang",amount:1675,paid:1675,processing:0,balance:0,status:"paid"},
  {property:"46 Township Line Road",unit:"329",tenants:"Hanna Savonenko, Vitalii Savonenko",amount:1800,paid:1800,processing:0,balance:0,status:"paid"},
  {property:"46 Township Line Road",unit:"127",tenants:"Maksim Fursov, Polina Fursova",amount:1850,paid:1850,processing:0,balance:0,status:"paid"},
  {property:"46 Township Line Road",unit:"233",tenants:"Robert Keppler",amount:2500,paid:2500,processing:0,balance:0,status:"paid"},
  {property:"7845 Montgomery Avenue",unit:"Unit 2",tenants:"Gina Krier, Michael Krier",amount:2850,paid:2850,processing:0,balance:0,status:"paid"},
  {property:"7845 Montgomery Avenue",unit:"Unit 1B",tenants:"Bhargavkumar Chaudhary, Ritu Chotaliya",amount:1275,paid:1275,processing:0,balance:0,status:"paid"},
  {property:"7845 Montgomery Avenue",unit:"Unit 1",tenants:"Deborah Massaud, Noridden Massaud",amount:1650,paid:1650,processing:0,balance:0,status:"paid"},
  {property:"7845 Montgomery Avenue",unit:"Unit 4",tenants:"Lashaie N. Lee Lewis",amount:1930,paid:1930,processing:0,balance:0,status:"paid"},
  {property:"7845 Montgomery Avenue",unit:"Unit 6",tenants:"Victoria Deans",amount:1550,paid:1550,processing:0,balance:0,status:"paid"},
  {property:"7845 Montgomery Avenue",unit:"Unit 7",tenants:"Kristina Newton",amount:1820,paid:1820,processing:0,balance:0,status:"paid"},
  {property:"7845 Montgomery Avenue",unit:"Unit 8",tenants:"Justin Krebs",amount:1100,paid:1100,processing:0,balance:0,status:"paid"},
  {property:"7845 Montgomery Avenue",unit:"Studio B",tenants:"Serhii Lobodin",amount:1000,paid:1000,processing:0,balance:0,status:"paid"},
  {property:"7845 Montgomery Avenue",unit:"Unit 10-CH",tenants:"Danielle Corrado, Jeffrey Sharman",amount:2150,paid:2150,processing:0,balance:0,status:"paid"},
  {property:"926 Fox Chase Rd",unit:"Retail",tenants:"Maryam Gurbandurdyyeva",amount:1175,paid:1175,processing:0,balance:0,status:"paid"},
  {property:"1614 Valley Glen Rd",unit:"1",tenants:"Tarsha R. Scovens",amount:2255,paid:2255,processing:0,balance:0,status:"paid"},
  {property:"7845 Montgomery Avenue",unit:"Unit 9-CH",tenants:"Whitney Diane Rustin",amount:27000,paid:27000,processing:0,balance:0,status:"paid"}
];

// ── Render MTM Dashboard ──
function renderMTMDashboard() {
  // Draw donut chart
  const canvas = document.getElementById('mtmDonutCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const total = INNAGO_RENT.reduce((s,r) => s + r.amount, 0);
  const collected = INNAGO_RENT.reduce((s,r) => s + r.paid, 0);
  const processing = INNAGO_RENT.reduce((s,r) => s + r.processing, 0);
  const overdue = INNAGO_RENT.filter(r => r.status === 'overdue').reduce((s,r) => s + r.balance, 0);
  const comingDue = INNAGO_RENT.filter(r => r.status === 'pending').reduce((s,r) => s + r.balance, 0);
  const remaining = total - collected - processing - overdue - comingDue;

  const fmt = n => '$' + n.toLocaleString(undefined, {minimumFractionDigits:0, maximumFractionDigits:0});
  const pct = n => (n/total*100).toFixed(1) + '%';
  const el = (id, v) => { const e = document.getElementById(id); if(e) e.textContent = v; };

  el('mtmDonutTotal', fmt(total));
  el('mtmDashCollected', fmt(collected)); el('mtmDashCollectedPct', pct(collected));
  el('mtmDashProcessing', fmt(processing)); el('mtmDashProcessingPct', pct(processing));
  el('mtmDashOverdue', fmt(overdue)); el('mtmDashOverduePct', pct(overdue));
  el('mtmDashComingDue', fmt(comingDue)); el('mtmDashComingDuePct', pct(comingDue));

  // Draw donut
  const cx = 90, cy = 90, r = 70, lw = 28;
  ctx.clearRect(0, 0, 180, 180);
  const slices = [
    {val: collected, color: '#256645'},
    {val: processing, color: '#b86818'},
    {val: overdue, color: '#b83228'},
    {val: comingDue, color: '#1e5799'},
    {val: remaining > 0 ? remaining : 0, color: '#ede9e2'}
  ];
  let angle = -Math.PI / 2;
  slices.forEach(s => {
    if (s.val <= 0) return;
    const sweep = (s.val / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(cx, cy, r, angle, angle + sweep);
    ctx.lineWidth = lw;
    ctx.strokeStyle = s.color;
    ctx.stroke();
    angle += sweep;
  });

  // Occupancy stats
  const occupied = INNAGO_TENANTS.filter(t => t.status === 'Active').length;
  const totalUnits = 80; // from Innago dashboard
  const vacant = totalUnits - occupied;
  const occPct = Math.round(occupied / totalUnits * 100);
  el('mtmDashOccupied', occupied);
  el('mtmDashVacant', vacant);
  el('mtmDashOccPct', occPct + '%');
  const fill = document.getElementById('mtmDashOccFill');
  if (fill) fill.style.width = occPct + '%';

  // Lease stats
  const activeL = INNAGO_LEASES.filter(l => l.status === 'Active').length;
  const futureL = INNAGO_LEASES.filter(l => l.status === 'Future' || INNAGO_TENANTS.some(t => t.name.includes(l.tenants.split(',')[0].trim()) && t.status === 'Future')).length;
  const mtmL = INNAGO_LEASES.filter(l => l.type === 'mtm').length;
  const now = new Date();
  const d90 = new Date(now.getTime() + 90*24*60*60*1000);
  const expiringL = INNAGO_LEASES.filter(l => l.type === 'fixed' && new Date(l.end) <= d90 && new Date(l.end) >= now).length;
  el('mtmDashActiveL', activeL);
  el('mtmDashFutureL', futureL);
  el('mtmDashExpiringL', expiringL);
  el('mtmDashMTML', mtmL);

  // Overdue units count
  const overdueUnits = INNAGO_RENT.filter(r => r.balance > 0).length;
  const totalRentUnits = INNAGO_RENT.length;
  el('mtmDashOverdueUnits', overdueUnits);
  document.querySelector('.mtm-dash-overdue-of').textContent = '/ ' + totalRentUnits;

  // Expiring leases list
  const expiringList = document.getElementById('mtmDashExpiring');
  if (expiringList) {
    const expLeases = INNAGO_LEASES.filter(l => l.type === 'fixed').sort((a,b) => new Date(a.end) - new Date(b.end)).slice(0, 6);
    expiringList.innerHTML = expLeases.map(l => {
      const tName = l.tenants.split(',')[0].trim();
      const tIdx = INNAGO_TENANTS.findIndex(t => t.name.includes(tName.split(' ')[0]));
      const clickAction = tIdx >= 0 ? `openTenantCardFromLease(${tIdx})` : `openLeaseDetail(${INNAGO_LEASES.indexOf(l)})`;
      return `<div class="mtm-dash-list-item" onclick="${clickAction}" title="Click to view tenant details">
      <div><span class="mtm-li-name">${tName}</span><br><span class="mtm-li-detail">${l.property} | ${l.unit}</span></div>
      <div style="text-align:right"><span class="mtm-li-val" style="color:var(--orange)">${l.end}</span></div>
    </div>`;
    }).join('');
  }

  // Overdue balances list
  const overdueList = document.getElementById('mtmDashOverdueList');
  if (overdueList) {
    const overdueItems = INNAGO_RENT.filter(r => r.balance > 0).sort((a,b) => b.balance - a.balance);
    overdueList.innerHTML = overdueItems.map(r => {
      const origIdx = INNAGO_RENT.indexOf(r);
      return `<div class="mtm-dash-list-item" onclick="openInvoiceEditor(${origIdx})" title="Click to view/edit invoice">
      <div><span class="mtm-li-name">${r.tenants.split(',')[0]}</span><br><span class="mtm-li-detail">${r.property} | ${r.unit}</span></div>
      <div style="text-align:right"><span class="mtm-li-val" style="color:var(--red)">${fmt(r.balance)}</span></div>
    </div>`;
    }).join('');
  }
}

// ── Render Tenants Table ──
let tntSortField = 'name';
let tntSortAsc = true;
let currentTenantIdx = null;

// Tenant notes storage
const TENANT_NOTES = {};

function renderMTMTenants() {
  // Populate property filter dropdown
  const propFilter = document.getElementById('tntPropFilter');
  if (propFilter && propFilter.options.length <= 1) {
    const props = [...new Set(INNAGO_TENANTS.map(t => t.property))].sort();
    props.forEach(p => { const o = document.createElement('option'); o.value = p; o.text = p; propFilter.add(o); });
  }
  filterTenantList();
}

function filterMTMTenants() { filterTenantList(); }

function sortTenants(field) {
  if (tntSortField === field) { tntSortAsc = !tntSortAsc; }
  else { tntSortField = field; tntSortAsc = true; }
  document.querySelectorAll('.tnt-sort-btn').forEach(b => b.classList.remove('active'));
  const btnId = field === 'name' ? 'tntSortName' : 'tntSortAddr';
  const btn = document.getElementById(btnId);
  if (btn) { btn.classList.add('active'); btn.innerHTML = (field === 'name' ? 'Name' : 'Address') + (tntSortAsc ? ' &#9650;' : ' &#9660;'); }
  filterTenantList();
}

function filterTenantList() {
  const listEl = document.getElementById('tntList');
  if (!listEl) return;
  const search = (document.getElementById('tntSearch')?.value || '').toLowerCase();
  const statusF = document.getElementById('tntStatusFilter')?.value || 'all';
  const propF = document.getElementById('tntPropFilter')?.value || 'all';

  let filtered = INNAGO_TENANTS.filter(t => {
    if (statusF !== 'all' && t.status !== statusF) return false;
    if (propF !== 'all' && t.property !== propF) return false;
    if (search && !t.name.toLowerCase().includes(search) && !t.unit.toLowerCase().includes(search)) return false;
    return true;
  });

  // Sort
  filtered.sort((a, b) => {
    let va, vb;
    if (tntSortField === 'name') { va = a.name.toLowerCase(); vb = b.name.toLowerCase(); }
    else { va = a.property.toLowerCase() + a.unitNum.toLowerCase(); vb = b.property.toLowerCase() + b.unitNum.toLowerCase(); }
    return tntSortAsc ? va.localeCompare(vb) : vb.localeCompare(va);
  });

  if (filtered.length === 0) {
    listEl.innerHTML = '<div style="padding:24px;text-align:center;color:var(--text3);font-style:italic;">No tenants match your filters</div>';
    return;
  }

  listEl.innerHTML = filtered.map(t => {
    const origIdx = INNAGO_TENANTS.indexOf(t);
    const initials = t.name.split(' ').map(w => w[0]).join('').substring(0,2).toUpperCase();
    const isActive = origIdx === currentTenantIdx;
    return `<div class="tnt-list-item${isActive ? ' active' : ''}" onclick="openTenantDetail(${origIdx})" title="${t.name}">
      <div class="tnt-li-avatar">${initials}</div>
      <div class="tnt-li-info">
        <div class="tnt-li-name">${t.name}</div>
        <div class="tnt-li-addr">${t.property} | ${t.unitNum}</div>
      </div>
    </div>`;
  }).join('');
}

function openTenantDetail(idx) {
  const t = INNAGO_TENANTS[idx];
  if (!t) return;
  currentTenantIdx = idx;

  // Highlight active in sidebar
  document.querySelectorAll('.tnt-list-item').forEach((el, i) => {
    el.classList.toggle('active', el.getAttribute('onclick')?.includes(`(${idx})`));
  });
  filterTenantList(); // re-render sidebar with active highlight

  // Show detail
  document.getElementById('tntDetailEmpty').style.display = 'none';
  document.getElementById('tntDetailContent').style.display = 'block';

  // Avatar
  const initials = t.name.split(' ').map(w => w[0]).join('').substring(0,2).toUpperCase();
  document.getElementById('tntAvatar').textContent = initials;

  // Name, contact
  document.getElementById('tntName').textContent = t.name;
  document.getElementById('tntPhone').textContent = t.phone || '(not set)';
  const emailEl = document.getElementById('tntEmail');
  emailEl.textContent = t.email || '(not set)';
  emailEl.href = t.email ? 'mailto:' + t.email : '#';
  document.getElementById('tntSince').textContent = t.since || 'N/A';
  document.getElementById('tntAcctStatus').innerHTML = t.email ? '&#x2705;' : '&#x274C;';

  // Notes count
  const notes = TENANT_NOTES[t.name] || [];
  document.getElementById('tntNoteCount').textContent = notes.length;

  // Current Lease info
  const lease = INNAGO_LEASES.find(l => l.tenants.includes(t.name.split(' ')[0]));
  if (lease) {
    document.getElementById('tntLeaseProp').textContent = lease.property + ' | ' + lease.unit;
    document.getElementById('tntLeaseRent').textContent = '$' + t.rent.toLocaleString() + '.00';
    document.getElementById('tntLeaseRentOf').textContent = 'of $' + t.rent.toLocaleString() + '.00';
    document.getElementById('tntLeaseStart').textContent = lease.start;
    document.getElementById('tntLeaseEnd').textContent = lease.end === 'M to M' ? 'M to M' : lease.end;
  } else {
    document.getElementById('tntLeaseProp').textContent = t.property + ' | ' + t.unitNum;
    document.getElementById('tntLeaseRent').textContent = '$' + t.rent.toLocaleString() + '.00';
    document.getElementById('tntLeaseRentOf').textContent = 'of $' + t.rent.toLocaleString() + '.00';
    document.getElementById('tntLeaseStart').textContent = '—';
    document.getElementById('tntLeaseEnd').textContent = '—';
  }

  // Collection data
  const rentRecords = INNAGO_RENT.filter(r => r.tenant.includes(t.name.split(' ')[0]));
  const totalCollected = rentRecords.reduce((s, r) => s + r.paid, 0);
  const pastDue = rentRecords.filter(r => r.status === 'Late' || r.status === 'Overdue');
  const currentInvoices = rentRecords.length;
  document.getElementById('tntCurrInvoices').textContent = currentInvoices;
  document.getElementById('tntTotalCollected').textContent = '$' + totalCollected.toLocaleString() + '.00';
  document.getElementById('tntPastDue').textContent = pastDue.length > 0 ? pastDue.length + ' invoice(s)' : 'No Record found.';
  document.getElementById('tntOtherCollected').textContent = '$0';
  document.getElementById('tntCollTotal').textContent = '$' + totalCollected.toLocaleString() + '.00';

  // Message history
  const msgBody = document.getElementById('tntMsgHistory');
  // Generate sample messages based on tenant data
  const msgs = [];
  if (lease) {
    msgs.push({ to: t.name.split(' ')[0], from: 'Willow Partnership LLC', subject: t.property + ' Lease Notification', date: lease.start });
  }
  if (rentRecords.length > 0) {
    msgs.push({ to: t.name.split(' ')[0], from: 'Innago', subject: 'Payment Confirmation', date: 'Mar 15, 2026' });
  }
  if (msgs.length === 0) {
    msgBody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--text3);font-style:italic;padding:16px;">No messages</td></tr>';
  } else {
    msgBody.innerHTML = msgs.map(m => `<tr>
      <td>${m.to}</td>
      <td>${m.from}</td>
      <td>${m.subject}</td>
      <td>${m.date}</td>
      <td><a href="#" class="tnt-msg-view-link" onclick="event.preventDefault();alert('Message viewer coming soon')">View</a></td>
    </tr>`).join('');
  }
}

function closeTenantDetail() {
  currentTenantIdx = null;
  document.getElementById('tntDetailEmpty').style.display = '';
  document.getElementById('tntDetailContent').style.display = 'none';
  filterTenantList();
}

function toggleTenantMenu(e) {
  e.stopPropagation();
  const menu = document.getElementById('tntActionsMenu');
  menu.classList.toggle('open');
  // Close on outside click
  const closeMenu = (ev) => { if (!menu.contains(ev.target)) { menu.classList.remove('open'); document.removeEventListener('click', closeMenu); } };
  setTimeout(() => document.addEventListener('click', closeMenu), 10);
}

function tenantAction(action) {
  const t = currentTenantIdx !== null ? INNAGO_TENANTS[currentTenantIdx] : null;
  if (!t) return;
  document.getElementById('tntActionsMenu')?.classList.remove('open');
  switch(action) {
    case 'edit': alert(`Edit Tenant\n\nName: ${t.name}\nUnit: ${t.unitNum}\nRent: $${t.rent}\n\nThis would open the tenant editor form.`); break;
    case 'addNote': {
      const note = prompt('Add a note for ' + t.name + ':');
      if (note && note.trim()) {
        if (!TENANT_NOTES[t.name]) TENANT_NOTES[t.name] = [];
        TENANT_NOTES[t.name].unshift({ date: new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}), author:'Gil B.', text: note.trim() });
        document.getElementById('tntNoteCount').textContent = TENANT_NOTES[t.name].length;
      }
      break;
    }
    case 'resendVerification': alert(`Verification link would be resent to ${t.email || '(no email on file)'}`); break;
    case 'requestInsurance': alert(`Renter's insurance request would be sent to ${t.name}`); break;
    case 'viewInvoices': case 'viewAllInvoices': alert(`This would open the invoice list filtered for ${t.name}`); break;
  }
}

function viewTenantLease() {
  if (currentTenantIdx === null) return;
  const t = INNAGO_TENANTS[currentTenantIdx];
  const leaseIdx = INNAGO_LEASES.findIndex(l => l.tenants.includes(t.name.split(' ')[0]));
  if (leaseIdx >= 0) {
    showSubPage('mtm-lt-leases');
    setTimeout(() => openLeaseDetailNew(leaseIdx), 100);
  }
}

// ── Render Leases Table ──
function renderMTMLeases() {
  const tbody = document.getElementById('mtmLeasesBody');
  if (!tbody) return;
  // Populate property filter
  const propFilter = document.getElementById('mtmLeasePropFilter');
  if (propFilter && propFilter.options.length <= 1) {
    const props = [...new Set(INNAGO_LEASES.map(l => l.property))].sort();
    props.forEach(p => { const o = document.createElement('option'); o.value = p; o.text = p; propFilter.add(o); });
  }
  // Update stats
  const now = new Date();
  const d90 = new Date(now.getTime() + 90*24*60*60*1000);
  const active = INNAGO_LEASES.filter(l => l.status === 'Active');
  const expiring = active.filter(l => l.type === 'fixed' && new Date(l.end) <= d90);
  const el = (id, v) => { const e = document.getElementById(id); if(e) e.textContent = v; };
  el('mtmLSActive', active.length);
  el('mtmLSExpiring', expiring.length);
  filterMTMLeases();
}

function filterMTMLeases() {
  const tbody = document.getElementById('mtmLeasesBody');
  if (!tbody) return;
  const search = (document.getElementById('mtmLeaseSearch')?.value || '').toLowerCase();
  const typeF = document.getElementById('mtmLeaseTypeFilter')?.value || 'all';
  const propF = document.getElementById('mtmLeasePropFilter')?.value || 'all';

  const filtered = INNAGO_LEASES.filter(l => {
    if (typeF !== 'all' && l.type !== typeF) return false;
    if (propF !== 'all' && l.property !== propF) return false;
    if (search && !l.tenants.toLowerCase().includes(search) && !l.property.toLowerCase().includes(search) && !l.unit.toLowerCase().includes(search)) return false;
    return true;
  });

  document.getElementById('mtmLeaseCount').textContent = filtered.length + ' lease' + (filtered.length !== 1 ? 's' : '');

  if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="mtm-empty">No leases match your filters</td></tr>';
    return;
  }
  tbody.innerHTML = filtered.map(l => {
    const endDisplay = l.end === 'M to M' ? '<span class="mtm-badge mtm">M-to-M</span>' : l.end;
    const typeDisplay = l.type === 'mtm' ? '<span class="mtm-badge mtm">Month-to-Month</span>' : '<span class="mtm-badge fixed">Fixed Term</span>';
    // Check if expiring within 90 days
    let statusBadge = `<span class="mtm-badge active">${l.status}</span>`;
    if (l.type === 'fixed') {
      const endDate = new Date(l.end);
      const now = new Date();
      const d90 = new Date(now.getTime() + 90*24*60*60*1000);
      if (endDate <= d90 && endDate >= now) statusBadge = '<span class="mtm-badge expiring">Expiring</span>';
      if (endDate < now) statusBadge = '<span class="mtm-badge expired">Expired</span>';
    }
    const origIdx = INNAGO_LEASES.indexOf(l);
    return `<tr onclick="openLeaseDetail(${origIdx})" title="Click to view lease details">
      <td>${statusBadge}</td>
      <td><span class="mtm-prop-unit">${l.unit}</span><span class="mtm-prop-addr">${l.property}</span></td>
      <td>${l.tenants}</td>
      <td>${l.start}</td>
      <td>${endDisplay}</td>
      <td>${typeDisplay}</td>
    </tr>`;
  }).join('');
}

// ── Lease Detail Panel ──
// Simulated documents per lease (keyed by property+unit)
const LEASE_DOCUMENTS = {};
function getLeaseKey(l) { return l.property + '|' + l.unit; }

// Pre-populate some completed docs for demo realism
(function seedDocs() {
  INNAGO_LEASES.forEach(l => {
    const key = getLeaseKey(l);
    const tenantFirst = l.tenants.split(',')[0].trim().split(' ').pop();
    LEASE_DOCUMENTS[key] = {
      open: [],
      completed: [
        { name: `Lease_${l.unit.replace(/\s/g,'')}_${tenantFirst}.pdf`, date: l.start, type: 'lease' },
        { name: `ID_${tenantFirst}.pdf`, date: l.start, type: 'id' }
      ],
      notes: []
    };
    // Add credit check for fixed-term leases
    if (l.type === 'fixed') {
      LEASE_DOCUMENTS[key].completed.push({ name: `CreditCheck_${tenantFirst}.pdf`, date: l.start, type: 'credit' });
    }
  });
})();

let currentLeaseDetail = null;

function openLeaseDetail(idx) {
  const l = INNAGO_LEASES[idx];
  if (!l) return;
  currentLeaseDetail = { idx, lease: l };
  const key = getLeaseKey(l);
  const docs = LEASE_DOCUMENTS[key] || { open: [], completed: [], notes: [] };

  // Fill header
  const statusEl = document.getElementById('ldStatus');
  let statusClass = 'active', statusText = l.status;
  if (l.type === 'fixed') {
    const endDate = new Date(l.end);
    const now = new Date();
    const d90 = new Date(now.getTime() + 90*24*60*60*1000);
    if (endDate <= d90 && endDate >= now) { statusClass = 'expiring'; statusText = 'Expiring'; }
    if (endDate < now) { statusClass = 'expired'; statusText = 'Expired'; }
  }
  statusEl.className = 'mtm-badge ' + statusClass;
  statusEl.textContent = statusText;

  // Fill info
  document.getElementById('ldProperty').textContent = l.property;
  document.getElementById('ldUnit').textContent = l.unit;
  document.getElementById('ldTenants').textContent = l.tenants;
  document.getElementById('ldStart').textContent = l.start;
  document.getElementById('ldEnd').textContent = l.end === 'M to M' ? 'Month-to-Month' : l.end;
  document.getElementById('ldType').textContent = l.type === 'mtm' ? 'Month-to-Month' : 'Fixed Term';

  // Get rent from tenant data
  const tenantName = l.tenants.split(',')[0].trim();
  const tenantData = INNAGO_TENANTS.find(t => t.name === tenantName);
  const rentData = INNAGO_RENT.find(r => r.property === l.property && r.unit === l.unit);
  const rent = rentData ? '$' + rentData.amount.toLocaleString() : (tenantData ? '$' + tenantData.rent.toLocaleString() : '-');
  document.getElementById('ldRent').textContent = rent;

  // Render documents
  renderLeaseDocuments(docs);

  // Show panel
  document.getElementById('leaseDetailOverlay').classList.add('open');
  document.getElementById('leaseDetailPanel').classList.add('open');
}

function renderLeaseDocuments(docs) {
  const openList = document.getElementById('ldOpenDocs');
  const compList = document.getElementById('ldCompDocs');
  document.getElementById('ldOpenDocCount').textContent = docs.open.length;
  document.getElementById('ldCompDocCount').textContent = docs.completed.length;

  if (docs.open.length === 0) {
    openList.innerHTML = '<div class="ld-doc-empty">No open documents</div>';
  } else {
    openList.innerHTML = docs.open.map((d, i) => `
      <div class="ld-doc-item">
        <span class="ld-doc-name">${docIcon(d.type)} ${d.name}</span>
        <span class="ld-doc-date">${d.date}</span>
      </div>
    `).join('');
  }

  if (docs.completed.length === 0) {
    compList.innerHTML = '<div class="ld-doc-empty">No completed documents</div>';
  } else {
    compList.innerHTML = docs.completed.map((d, i) => `
      <div class="ld-doc-item">
        <span class="ld-doc-name">${docIcon(d.type)} ${d.name}</span>
        <div style="display:flex;align-items:center;gap:8px;">
          <span class="ld-doc-date">${d.date}</span>
          <button class="ld-doc-dl" onclick="event.stopPropagation();leaseAction('downloadDoc',${i})">&#x2913;</button>
        </div>
      </div>
    `).join('');
  }

  // Render notes
  const notesList = document.getElementById('ldNotes');
  if (docs.notes.length === 0) {
    notesList.innerHTML = '<div class="ld-doc-empty">No notes yet</div>';
  } else {
    notesList.innerHTML = docs.notes.map(n => `
      <div class="ld-note-item">
        <div class="ld-note-meta">${n.date} &mdash; ${n.author}</div>
        <div class="ld-note-text">${n.text}</div>
      </div>
    `).join('');
  }
}

function docIcon(type) {
  const icons = { lease: '&#x1F4C4;', id: '&#x1F4CB;', credit: '&#x1F4CA;', other: '&#x1F4CE;' };
  return `<span style="font-size:14px">${icons[type] || icons.other}</span>`;
}

function closeLeaseDetail() {
  document.getElementById('leaseDetailOverlay').classList.remove('open');
  document.getElementById('leaseDetailPanel').classList.remove('open');
  currentLeaseDetail = null;
}

function leaseAction(action, docIdx) {
  if (!currentLeaseDetail) return;
  const l = currentLeaseDetail.lease;
  const key = getLeaseKey(l);
  const docs = LEASE_DOCUMENTS[key];

  switch(action) {
    case 'renew':
      alert(`Renew Lease\n\nUnit: ${l.unit} at ${l.property}\nTenant(s): ${l.tenants}\n\nThis would open the lease renewal workflow.`);
      break;
    case 'edit':
      alert(`Edit Lease\n\nUnit: ${l.unit}\nYou could modify rent amount, dates, and terms here.`);
      break;
    case 'editTenants':
      alert(`Edit Tenants\n\nCurrent: ${l.tenants}\nYou could add/remove tenants from this lease.`);
      break;
    case 'download':
      alert(`Download Lease\n\nLease document for ${l.unit} would be downloaded as PDF.`);
      break;
    case 'addNote': {
      const note = prompt('Add a note to this lease:');
      if (note && note.trim()) {
        docs.notes.unshift({
          date: new Date().toLocaleDateString('en-US', {month:'short', day:'numeric', year:'numeric'}),
          author: 'Gil B.',
          text: note.trim()
        });
        renderLeaseDocuments(docs);
      }
      break;
    }
    case 'cancel':
      if (confirm(`Cancel lease for ${l.tenants} at ${l.unit}?\n\nThis action would initiate the lease cancellation process.`)) {
        alert('Lease cancellation process initiated.');
      }
      break;
    case 'signDoc':
      alert('Sign a Document\n\nThis would open the document signing workflow where you can send lease documents for e-signature.');
      break;
    case 'uploadFile': {
      const fileName = prompt('Enter file name to upload (e.g., CreditCheck_Smith.pdf):');
      if (fileName && fileName.trim()) {
        docs.completed.push({
          name: fileName.trim(),
          date: new Date().toLocaleDateString('en-US', {month:'short', day:'numeric', year:'numeric'}),
          type: fileName.toLowerCase().includes('credit') ? 'credit' : fileName.toLowerCase().includes('id') ? 'id' : 'other'
        });
        renderLeaseDocuments(docs);
      }
      break;
    }
    case 'downloadDoc':
      if (docs && docs.completed[docIdx]) {
        alert(`Downloading: ${docs.completed[docIdx].name}`);
      }
      break;
  }
}

// ── Render Rent Table ──
function renderMTMRent() {
  const tbody = document.getElementById('mtmRentBody');
  if (!tbody) return;
  const totalDue = INNAGO_RENT.reduce((s,r) => s + r.amount, 0);
  const totalPaid = INNAGO_RENT.reduce((s,r) => s + r.paid, 0);
  const totalProcessing = INNAGO_RENT.reduce((s,r) => s + r.processing, 0);
  const totalOverdue = INNAGO_RENT.filter(r => r.status === 'overdue').reduce((s,r) => s + r.balance, 0);
  const totalPending = INNAGO_RENT.filter(r => r.status === 'pending' || r.status === 'overdue').reduce((s,r) => s + r.balance, 0);
  // Update summary
  const el = (sel, val) => { const e = document.querySelector(sel); if(e) e.textContent = val; };
  const fmt = n => '$' + n.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0});
  document.querySelectorAll('#mtmRentSummary .mtm-rs-num')[0].textContent = fmt(totalDue);
  document.querySelectorAll('#mtmRentSummary .mtm-rs-num')[1].textContent = fmt(totalPaid);
  document.querySelectorAll('#mtmRentSummary .mtm-rs-num')[2].textContent = fmt(totalProcessing);
  document.querySelectorAll('#mtmRentSummary .mtm-rs-num')[3].textContent = fmt(totalOverdue);
  const comingDue = INNAGO_RENT.filter(r => r.status === 'pending').reduce((s,r) => s + r.balance, 0);
  document.querySelectorAll('#mtmRentSummary .mtm-rs-num')[4].textContent = fmt(comingDue);

  document.getElementById('mtmRentCount').textContent = INNAGO_RENT.length + ' invoices';

  tbody.innerHTML = INNAGO_RENT.map(r => {
    const statusClass = r.status;
    const statusLabel = r.status.charAt(0).toUpperCase() + r.status.slice(1);
    return `<tr>
      <td><span class="mtm-prop-unit">${r.unit}</span><span class="mtm-prop-addr">${r.property}</span></td>
      <td>${r.tenants}</td>
      <td>$${r.amount.toLocaleString()}</td>
      <td>$${r.paid.toLocaleString()}</td>
      <td style="font-weight:${r.balance > 0 ? '700' : '400'};color:${r.balance > 0 ? 'var(--red)' : 'var(--green)'}">$${r.balance.toLocaleString()}</td>
      <td><span class="mtm-badge ${statusClass}">${statusLabel}</span></td>
    </tr>`;
  }).join('');
}

// ── Messages Data & Render ──
const INNAGO_MESSAGES = [
  {id:1,from:"Carol Tyndale",unit:"317",property:"46 Township Line Road",date:"Apr 03, 2026",time:"2:14 PM",subject:"Rent Payment",body:"Hi, I wanted to let you know my rent payment will be a few days late this month. I had an unexpected expense. I'll have it in by the 10th. Thank you for understanding.",unread:true,sent:false},
  {id:2,from:"David Brooker",unit:"111",property:"46 Township Line Road",date:"Apr 02, 2026",time:"9:30 AM",subject:"Parking Spot",body:"Can we get an additional parking spot? My wife started a new job and we now have two cars. Please let me know the availability and cost.",unread:true,sent:false},
  {id:3,from:"Justin Krebs",unit:"Unit 8",property:"7845 Montgomery Avenue",date:"Apr 01, 2026",time:"4:45 PM",subject:"Maintenance Request",body:"The kitchen faucet has been dripping steadily for the past week. It's getting worse. Can someone come take a look? I'm available most mornings.",unread:false,sent:false},
  {id:4,from:"Gil Barzeski",unit:"",property:"",date:"Apr 01, 2026",time:"11:00 AM",subject:"April Rent Reminder",body:"Hi everyone, just a friendly reminder that April rent is now due. Please submit your payment through the Innago portal at your earliest convenience. Thank you!",unread:false,sent:true},
  {id:5,from:"Victoria Deans",unit:"Unit 6",property:"7845 Montgomery Avenue",date:"Mar 30, 2026",time:"6:20 PM",subject:"Lease Renewal",body:"Hi Gil, my lease is coming up in January. I'd like to discuss renewal options. Are there any changes to the terms? I'd like to stay if possible.",unread:false,sent:false},
  {id:6,from:"Gina Krier",unit:"Unit 2",property:"7845 Montgomery Avenue",date:"Mar 28, 2026",time:"1:15 PM",subject:"Noise Complaint",body:"We've been hearing loud music from the unit above us (Unit 4) late at night, almost every weekend. Could you please address this? It's affecting our sleep.",unread:false,sent:false},
  {id:7,from:"Renat Sakiev",unit:"Unit A2",property:"431 Valley Rd",date:"Mar 25, 2026",time:"10:00 AM",subject:"Payment Issue",body:"I tried to submit my rent payment through the portal but got an error. Can you check if there's an issue with my account? I don't want it to be marked as late.",unread:false,sent:false},
  {id:8,from:"Robert Keppler",unit:"233",property:"46 Township Line Road",date:"Mar 22, 2026",time:"3:30 PM",subject:"Move-out Notice",body:"I'm writing to give you my 60-day notice. I'll be moving out at the end of July when my lease expires. Please let me know about the move-out inspection process.",unread:false,sent:false},
  {id:9,from:"Gil Barzeski",unit:"",property:"",date:"Mar 20, 2026",time:"9:00 AM",subject:"Spring Maintenance Schedule",body:"Hi all, we'll be conducting exterior inspections and landscaping updates at all properties over the next two weeks. Please keep walkways clear. Thank you!",unread:false,sent:true},
  {id:10,from:"Tarsha R. Scovens",unit:"1",property:"1614 Valley Glen Rd",date:"Mar 18, 2026",time:"7:45 PM",subject:"Water Heater",body:"The hot water has been lukewarm at best for the past few days. I think the water heater might need to be looked at or replaced. Can you send someone?",unread:false,sent:false}
];

function renderMTMMessages() {
  const list = document.getElementById('mtmMsgList');
  if (!list) return;
  filterMTMMessages();
}

function filterMTMMessages() {
  const list = document.getElementById('mtmMsgList');
  if (!list) return;
  const search = (document.getElementById('mtmMsgSearch')?.value || '').toLowerCase();
  const filter = document.getElementById('mtmMsgFilter')?.value || 'all';

  const filtered = INNAGO_MESSAGES.filter(m => {
    if (filter === 'unread' && !m.unread) return false;
    if (filter === 'sent' && !m.sent) return false;
    if (search && !m.from.toLowerCase().includes(search) && !m.subject.toLowerCase().includes(search) && !m.body.toLowerCase().includes(search)) return false;
    return true;
  });

  document.getElementById('mtmMsgCount').textContent = filtered.length + ' message' + (filtered.length !== 1 ? 's' : '');

  list.innerHTML = filtered.map(m => `
    <div class="mtm-msg-item ${m.unread ? 'unread' : ''}" onclick="showMTMMessage(${m.id})">
      <div class="mtm-msg-from">${m.unread ? '<span class="mtm-msg-dot"></span>' : ''}${m.sent ? '➤ ' : ''}${m.from}<span class="mtm-msg-time">${m.date}</span></div>
      <div class="mtm-msg-preview"><strong>${m.subject}</strong> — ${m.body.substring(0, 60)}...</div>
    </div>
  `).join('');
}

function showMTMMessage(id) {
  const m = INNAGO_MESSAGES.find(msg => msg.id === id);
  if (!m) return;
  m.unread = false;
  // Re-render list to update unread state
  filterMTMMessages();
  const detail = document.getElementById('mtmMsgDetail');
  const loc = m.unit ? `${m.unit} at ${m.property}` : 'All Properties';
  detail.innerHTML = `
    <div class="mtm-msg-detail-header">
      <div class="mtm-msg-detail-from">${m.subject}</div>
      <div class="mtm-msg-detail-meta">${m.sent ? 'Sent by' : 'From'} <strong>${m.from}</strong> ${m.unit ? '(' + loc + ')' : ''} &mdash; ${m.date} at ${m.time}</div>
    </div>
    <div class="mtm-msg-detail-body">${m.body}</div>
    ${!m.sent ? `<div class="mtm-msg-reply-box">
      <textarea class="mtm-msg-reply-input" placeholder="Type your reply..."></textarea>
      <button class="mtm-msg-reply-btn" onclick="alert('Reply sent!')">Send Reply</button>
    </div>` : ''}
  `;
}

function composeMTMMessage() {
  const detail = document.getElementById('mtmMsgDetail');
  const tenantOpts = INNAGO_TENANTS.map(t => `<option value="${t.name}">${t.name} (${t.unitNum})</option>`).join('');
  detail.innerHTML = `
    <div class="mtm-msg-detail-header">
      <div class="mtm-msg-detail-from">New Message</div>
    </div>
    <div style="display:flex;flex-direction:column;gap:10px;">
      <select id="mtm-compose-to" class="mtm-filter" style="width:100%;padding:8px 10px;">
        <option value="">Select Tenant...</option>
        <option value="all">All Tenants</option>
        ${tenantOpts}
      </select>
      <input type="text" id="mtm-compose-subject" class="mtm-search" style="width:100%;" placeholder="Subject...">
      <textarea id="mtm-compose-body" class="mtm-msg-reply-input" placeholder="Message body..." style="min-height:120px;"></textarea>
      <div style="display:flex;gap:6px;align-items:center;">
        <select id="mtm-msg-channel" style="width:auto;font-size:12px;padding:6px 8px;">
          <option value="sms">SMS</option>
          <option value="whatsapp">WhatsApp</option>
          <option value="email">Email</option>
        </select>
        <button class="mtm-msg-reply-btn" onclick="sendMTMCompose()" style="flex:1">Send Message</button>
      </div>
    </div>
  `;
}
function sendMTMCompose(){
  const toVal = (document.getElementById('mtm-compose-to')||{}).value||'';
  const subject = (document.getElementById('mtm-compose-subject')||{}).value||'';
  const body = (document.getElementById('mtm-compose-body')||{}).value||'';
  const channel = (document.getElementById('mtm-msg-channel')||{}).value||'sms';
  if(!toVal){ alert('Select a tenant.'); return; }
  if(!body.trim()){ alert('Enter a message.'); return; }
  const tenants = toVal==='all' ? INNAGO_TENANTS : INNAGO_TENANTS.filter(t=>t.name===toVal);
  let sent=0;
  tenants.forEach(t => {
    const to = channel==='email' ? (t.email||'') : (t.phone||'');
    if(!to) return;
    WPA_sendMessage({to, msg:'WillowPA: '+body, channel, toEmail:channel==='email'?to:undefined, subject:subject||'Message from WillowPA', silent:sent>0});
    sent++;
  });
  if(sent===0) alert('No contact info found for selected tenant(s) on channel: '+channel);
  else toast(sent+' message(s) sent via '+channel.toUpperCase());
}

// ══════════════════════════════════════════════════════════════
//  UNIFIED MESSAGE CENTER
//  Merges Short-Term (Airbnb/VRBO), Long-Term (Innago), and Client App messages
// ══════════════════════════════════════════════════════════════

let _currentMsgCenterFilter = 'all';
let _msgCenterSearch = '';

const CLIENT_APP_MESSAGES = [
  {id:'ca-1',from:'Maria Gonzalez',unit:'46-210',property:'46 Township Line',date:'2026-04-06T09:15:00',subject:'Lockout Request',body:'Hi, I accidentally locked myself out. Can someone let me in?',unread:true,source:'client'},
  {id:'ca-2',from:'James Whitfield',unit:'46-331',property:'46 Township Line',date:'2026-04-05T17:30:00',subject:'AC Not Working',body:'The air conditioning in my unit stopped blowing cold air yesterday evening.',unread:true,source:'client'},
  {id:'ca-3',from:'Emily Chen',unit:'Unit 4',property:'7845 Montgomery Ave',date:'2026-04-04T11:00:00',subject:'Package Pickup',body:'I got a notification about a package. Where can I pick it up?',unread:false,source:'client'},
  {id:'ca-4',from:'Devon Williams',unit:'A1',property:'431 Valley Rd',date:'2026-04-03T14:20:00',subject:'Lease Question',body:'When does my renewal option become available? I want to plan ahead.',unread:false,source:'client'},
  {id:'ca-5',from:'Priya Patel',unit:'46-128',property:'46 Township Line',date:'2026-04-02T08:45:00',subject:'Guest Parking',body:'I have family visiting this weekend. Is guest parking available?',unread:false,source:'client'}
];

const MSG_SOURCE_STYLES = {
  'short-term': { bg: '#e3f2fd', text: '#1565c0', label: 'Short-Term' },
  'long-term':  { bg: '#e8f5e9', text: '#2e7d32', label: 'Long-Term' },
  'client':     { bg: '#f3e5f5', text: '#7b1fa2', label: 'Client App' }
};

function _getAllCenterMessages() {
  const msgs = [];
  // Short-term: from AIRBNB_BOOKINGS_SEED (inbox.js)
  if (typeof AIRBNB_BOOKINGS_SEED !== 'undefined') {
    AIRBNB_BOOKINGS_SEED.forEach(b => {
      if (!b.lastMsg && !b.lastMsgAt) return; // skip bookings with no messages
      msgs.push({
        id: 'st-' + b.threadId,
        from: b.guest,
        unit: b.unit,
        property: b.listing ? b.listing.substring(0, 40) : '',
        date: b.lastMsgAt || b.bookedAt,
        subject: b.status === 'inquiry' ? 'Inquiry' : (b.status === 'change_requested' ? 'Change Request' : 'Booking Message'),
        body: b.lastMsg || 'No messages yet',
        unread: b.unread > 0,
        source: 'short-term',
        platform: 'airbnb',
        threadId: b.threadId
      });
    });
  }
  // Long-term: from INNAGO_MESSAGES
  if (typeof INNAGO_MESSAGES !== 'undefined') {
    INNAGO_MESSAGES.forEach(m => {
      msgs.push({
        id: 'lt-' + m.id,
        from: m.from,
        unit: m.unit,
        property: m.property,
        date: m.date + ' ' + m.time,
        subject: m.subject,
        body: m.body,
        unread: m.unread,
        source: 'long-term',
        sent: m.sent
      });
    });
  }
  // Client App
  CLIENT_APP_MESSAGES.forEach(m => msgs.push({...m}));

  // Sort by date descending
  msgs.sort((a, b) => new Date(b.date) - new Date(a.date));
  return msgs;
}

function _countUnreadMessages() {
  return _getAllCenterMessages().filter(m => m.unread).length;
}

function updateMsgCenterBadge() {
  const count = _countUnreadMessages();
  const badge = document.getElementById('msgCenterBadge');
  if (badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'inline-block' : 'none';
  }
}

function renderMessageCenter() {
  const el = document.getElementById('page-msg-center');
  if (!el) return;

  const filter = _currentMsgCenterFilter;
  const search = _msgCenterSearch.toLowerCase();
  let msgs = _getAllCenterMessages();

  // Apply source filter
  if (filter !== 'all') {
    msgs = msgs.filter(m => m.source === filter);
  }
  // Apply search
  if (search) {
    msgs = msgs.filter(m =>
      (m.from||'').toLowerCase().includes(search) ||
      (m.subject||'').toLowerCase().includes(search) ||
      (m.body||'').toLowerCase().includes(search) ||
      (m.unit||'').toLowerCase().includes(search)
    );
  }

  const totalUnread = msgs.filter(m => m.unread).length;

  el.innerHTML = `
    <div style="padding:16px 20px 0;">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px;flex-wrap:wrap;">
        <h2 style="margin:0;font-size:20px;font-weight:600;color:var(--text);">Message Center</h2>
        ${totalUnread > 0 ? `<span style="background:#d32f2f;color:#fff;font-size:11px;font-weight:700;padding:2px 8px;border-radius:10px;">${totalUnread} unread</span>` : ''}
        <div style="flex:1"></div>
        <input type="text" id="msgCenterSearch" placeholder="Search messages..." value="${_msgCenterSearch}"
          oninput="_msgCenterSearch=this.value;renderMessageCenter()"
          style="padding:7px 12px;border:1px solid var(--border);border-radius:6px;font-size:12px;font-family:inherit;width:220px;background:var(--surface);color:var(--text);">
      </div>
    </div>
    <div style="padding:0 20px 20px;display:flex;flex-direction:column;gap:1px;background:var(--border);border-radius:8px;margin:0 20px;">
      ${msgs.length === 0 ? '<div style="padding:40px;text-align:center;color:var(--text3);background:var(--surface);border-radius:8px;">No messages found</div>' :
        msgs.map(m => {
          const src = MSG_SOURCE_STYLES[m.source] || MSG_SOURCE_STYLES['short-term'];
          const dateStr = _msgCenterTimeAgo(m.date);
          const unitStr = m.unit ? m.unit : '';
          return `<div class="msg-center-row ${m.unread ? 'unread' : ''}" onclick="openMsgCenterDetail('${m.id}')">
            <div class="msg-center-left">
              <span class="msg-src-badge" style="background:${src.bg};color:${src.text};">${src.label}</span>
              <span class="msg-center-from">${m.sent ? '<span style="color:var(--text3);font-weight:400;">➤ Sent</span> ' : ''}${m.from}</span>
              ${unitStr ? `<span class="msg-center-unit">${unitStr}</span>` : ''}
            </div>
            <div class="msg-center-right">
              <span class="msg-center-time">${dateStr}</span>
            </div>
            <div class="msg-center-preview">
              <strong>${m.subject}</strong> — ${(m.body||'').substring(0, 90)}${(m.body||'').length > 90 ? '...' : ''}
            </div>
          </div>`;
        }).join('')
      }
    </div>
  `;
  updateMsgCenterBadge();
}

function _msgCenterTimeAgo(d) {
  if (!d) return '';
  const now = Date.now();
  const then = new Date(d).getTime();
  if (isNaN(then)) return d; // fallback to raw string
  const diff = now - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'now';
  if (mins < 60) return mins + 'm ago';
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return hrs + 'h ago';
  const days = Math.floor(hrs / 24);
  if (days < 7) return days + 'd ago';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function openMsgCenterDetail(id) {
  // Mark as read
  const msgs = _getAllCenterMessages();
  const m = msgs.find(x => x.id === id);
  if (!m) return;

  // Mark the source message as read
  if (m.source === 'long-term' && typeof INNAGO_MESSAGES !== 'undefined') {
    const origId = parseInt(id.replace('lt-', ''));
    const orig = INNAGO_MESSAGES.find(x => x.id === origId);
    if (orig) orig.unread = false;
  } else if (m.source === 'short-term' && typeof AIRBNB_BOOKINGS_SEED !== 'undefined') {
    const tid = id.replace('st-', '');
    const orig = AIRBNB_BOOKINGS_SEED.find(x => x.threadId === tid);
    if (orig) orig.unread = 0;
  } else if (m.source === 'client') {
    const orig = CLIENT_APP_MESSAGES.find(x => x.id === id);
    if (orig) orig.unread = false;
  }

  const src = MSG_SOURCE_STYLES[m.source] || {};
  const el = document.getElementById('page-msg-center');
  const unitStr = m.unit ? (m.property ? m.unit + ' at ' + m.property : m.unit) : (m.property || '');

  el.innerHTML = `
    <div style="padding:16px 20px 0;">
      <button onclick="renderMessageCenter()" style="background:none;border:1px solid var(--border);padding:6px 14px;border-radius:6px;cursor:pointer;font-family:inherit;font-size:12px;color:var(--text2);margin-bottom:12px;">← Back to Messages</button>
    </div>
    <div style="margin:0 20px 20px;background:var(--surface);border-radius:8px;border:1px solid var(--border);overflow:hidden;">
      <div style="padding:16px 20px;border-bottom:1px solid var(--border);background:var(--surface2);">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
          <span class="msg-src-badge" style="background:${src.bg};color:${src.text};">${src.label}</span>
          <span style="font-size:11px;color:var(--text3);">${_msgCenterTimeAgo(m.date)}</span>
        </div>
        <div style="font-size:16px;font-weight:600;color:var(--text);margin-bottom:4px;">${m.subject}</div>
        <div style="font-size:12px;color:var(--text2);">${m.sent ? 'Sent by' : 'From'} <strong>${m.from}</strong>${unitStr ? ' — ' + unitStr : ''}</div>
      </div>
      <div style="padding:20px;font-size:13px;line-height:1.6;color:var(--text);">${m.body}</div>
      ${!m.sent ? `<div style="padding:12px 20px 16px;border-top:1px solid var(--border);" id="msgCenterReplyArea">
        ${typeof buildChannelSelector === 'function' ? buildChannelSelector('app') : ''}
        <textarea id="msgCenterReply" placeholder="Type your reply..." style="width:100%;min-height:60px;padding:10px;border:1px solid var(--border);border-radius:6px;font-family:var(--font);font-size:12px;background:var(--surface);color:var(--text);resize:vertical;box-sizing:border-box;"></textarea>
        <div style="display:flex;gap:8px;margin-top:8px;">
          <button onclick="(function(){var b=document.getElementById('msgCenterReply').value.trim();if(!b){alert('Please type a message.');return;}var ch=getSelectedChannel(document.getElementById('msgCenterReplyArea'));sendViaChannel(ch,'${m.from.replace(/'/g,"\\'")}','${(m._email||'').replace(/'/g,"\\'")}','${(m._phone||'').replace(/'/g,"\\'")}',b,{subject:'${(m.subject||'').replace(/'/g,"\\'")}',threadId:'${(m._threadId||'').replace(/'/g,"\\'")}'});document.getElementById('msgCenterReply').value='';toast('Reply sent!');})();" style="padding:8px 20px;background:var(--accent);color:#fff;border:none;border-radius:6px;cursor:pointer;font-family:inherit;font-size:12px;font-weight:500;">Send Reply</button>
        </div>
      </div>` : ''}
    </div>
  `;
  updateMsgCenterBadge();
}

// ── Applications Data & Render ──
const INNAGO_APPLICATIONS = [
  {name:"Marcus Johnson",email:"marcus.j@email.com",property:"46 Township Line Road",unit:"215",applied:"Apr 02, 2026",status:"pending",screening:"not started"},
  {name:"Sarah Mitchell",email:"s.mitchell@email.com",property:"46 Township Line Road",unit:"215",applied:"Apr 01, 2026",status:"pending",screening:"in progress"},
  {name:"James Park",email:"jpark22@email.com",property:"7845 Montgomery Avenue",unit:"Unit 3",applied:"Mar 30, 2026",status:"screening",screening:"in progress"},
  {name:"Emily Rodriguez",email:"emily.r@email.com",property:"46 Township Line Road",unit:"128",applied:"Mar 28, 2026",status:"approved",screening:"passed"},
  {name:"Ahmed Hassan",email:"a.hassan@email.com",property:"431 Valley Rd",unit:"Unit B1",applied:"Mar 27, 2026",status:"approved",screening:"passed"},
  {name:"Lisa Chen",email:"lisachen@email.com",property:"7845 Montgomery Avenue",unit:"Unit 5",applied:"Mar 25, 2026",status:"denied",screening:"failed"},
  {name:"Brian Williams",email:"bwilliams@email.com",property:"46 Township Line Road",unit:"215",applied:"Mar 24, 2026",status:"withdrawn",screening:"not started"},
  {name:"Natalia Petrova",email:"npetrova@email.com",property:"46 Township Line Road",unit:"128",applied:"Mar 22, 2026",status:"denied",screening:"failed"},
  {name:"Kevin O'Brien",email:"kobrien@email.com",property:"926 Fox Chase Rd",unit:"Apt 2",applied:"Mar 20, 2026",status:"approved",screening:"passed"},
  {name:"Diana Torres",email:"dtorres@email.com",property:"7845 Montgomery Avenue",unit:"Unit 3",applied:"Mar 18, 2026",status:"withdrawn",screening:"not started"},
  {name:"Michael Chang",email:"mchang@email.com",property:"46 Township Line Road",unit:"215",applied:"Mar 15, 2026",status:"denied",screening:"failed"},
  {name:"Rachel Adams",email:"radams@email.com",property:"431 Valley Rd",unit:"Unit B1",applied:"Mar 12, 2026",status:"approved",screening:"passed"},
];

function renderMTMApps() {
  const tbody = document.getElementById('mtmAppsBody');
  if (!tbody) return;
  const propFilter = document.getElementById('mtmAppPropFilter');
  if (propFilter && propFilter.options.length <= 1) {
    const props = [...new Set(INNAGO_APPLICATIONS.map(a => a.property))].sort();
    props.forEach(p => { const o = document.createElement('option'); o.value = p; o.text = p; propFilter.add(o); });
  }
  const el = (id, v) => { const e = document.getElementById(id); if(e) e.textContent = v; };
  el('mtmAppPending', INNAGO_APPLICATIONS.filter(a => a.status === 'pending').length);
  el('mtmAppApproved', INNAGO_APPLICATIONS.filter(a => a.status === 'approved').length);
  el('mtmAppScreening', INNAGO_APPLICATIONS.filter(a => a.status === 'screening').length);
  el('mtmAppDenied', INNAGO_APPLICATIONS.filter(a => a.status === 'denied').length);
  filterMTMApps();
}

function filterMTMApps() {
  const tbody = document.getElementById('mtmAppsBody');
  if (!tbody) return;
  const search = (document.getElementById('mtmAppSearch')?.value || '').toLowerCase();
  const statusF = document.getElementById('mtmAppStatusFilter')?.value || 'all';
  const propF = document.getElementById('mtmAppPropFilter')?.value || 'all';

  const filtered = INNAGO_APPLICATIONS.filter(a => {
    if (statusF !== 'all' && a.status !== statusF) return false;
    if (propF !== 'all' && a.property !== propF) return false;
    if (search && !a.name.toLowerCase().includes(search) && !a.email.toLowerCase().includes(search) && !a.property.toLowerCase().includes(search)) return false;
    return true;
  });

  document.getElementById('mtmAppCount').textContent = filtered.length + ' application' + (filtered.length !== 1 ? 's' : '');

  if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="mtm-empty">No applications match your filters</td></tr>';
    return;
  }
  tbody.innerHTML = filtered.map(a => {
    const statusBadge = `<span class="mtm-badge ${a.status}">${a.status.charAt(0).toUpperCase() + a.status.slice(1)}</span>`;
    const screenBadge = a.screening === 'passed' ? '<span class="mtm-badge active">Passed</span>' :
      a.screening === 'failed' ? '<span class="mtm-badge expired">Failed</span>' :
      a.screening === 'in progress' ? '<span class="mtm-badge screening">In Progress</span>' :
      '<span class="mtm-badge" style="background:var(--surface2);color:var(--text3);border:1px solid var(--border)">Not Started</span>';
    return `<tr>
      <td><span class="mtm-tenant-name">${a.name}</span><span class="mtm-tenant-email">${a.email}</span></td>
      <td><span class="mtm-prop-unit">${a.unit}</span><span class="mtm-prop-addr">${a.property}</span></td>
      <td>${a.applied}</td>
      <td>${statusBadge}</td>
      <td>${screenBadge}</td>
      <td><button class="mtm-btn" onclick="alert('Review application for ${a.name}')">Review</button></td>
    </tr>`;
  }).join('');
}

// ── Expenses Data & Render ──
// ═══════════════════════════════════════════════════════════════
// EXPENSES MODULE — top-level, cross-module expense tracking
// ═══════════════════════════════════════════════════════════════

const EXP_CATEGORIES = ['plumbing','electric','decor','furnishing','maintenance','utilities','insurance','taxes','management','general'];
const EXP_CAT_COLORS = {plumbing:'#2196F3',electric:'#FF9800',decor:'#E91E63',furnishing:'#9C27B0',maintenance:'#F44336',utilities:'#00BCD4',insurance:'#4CAF50',taxes:'#795548',management:'#607D8B',general:'#9E9E9E'};

// Seed data (will be replaced by Supabase later)
let WPA_EXPENSES = [
  {id:1,date:"2026-04-02",property:"46 Township Line Road",unit:"317",rentalType:"long-term",category:"plumbing",desc:"Kitchen faucet repair",amount:450,vendor:"ABC Plumbing"},
  {id:2,date:"2026-04-01",property:"7845 Montgomery Avenue",unit:"",rentalType:"long-term",category:"utilities",desc:"Water bill - March",amount:680,vendor:"Philadelphia Water"},
  {id:3,date:"2026-03-28",property:"46 Township Line Road",unit:"",rentalType:"long-term",category:"maintenance",desc:"HVAC filter replacement - building-wide",amount:1200,vendor:"Cool Air HVAC"},
  {id:4,date:"2026-03-25",property:"431 Valley Rd",unit:"",rentalType:"long-term",category:"insurance",desc:"Property insurance - Q2",amount:2800,vendor:"State Farm"},
  {id:5,date:"2026-03-22",property:"46 Township Line Road",unit:"",rentalType:"long-term",category:"electric",desc:"Common area electrical - March",amount:890,vendor:"PECO Energy"},
  {id:6,date:"2026-03-20",property:"7845 Montgomery Avenue",unit:"Unit 4",rentalType:"long-term",category:"decor",desc:"Exterior painting touch-up",amount:1650,vendor:"ProCoat Painters"},
  {id:7,date:"2026-03-18",property:"926 Fox Chase Rd",unit:"",rentalType:"short-term",category:"taxes",desc:"Property tax installment",amount:3200,vendor:"Montgomery County"},
  {id:8,date:"2026-03-15",property:"46 Township Line Road",unit:"",rentalType:"long-term",category:"management",desc:"Property management fee - March",amount:2400,vendor:"Elkins Park LLC"},
  {id:9,date:"2026-03-12",property:"1614 Valley Glen Rd",unit:"",rentalType:"short-term",category:"maintenance",desc:"Gutter cleaning and repair",amount:375,vendor:"CleanGutter Co"},
  {id:10,date:"2026-03-10",property:"46 Township Line Road",unit:"232",rentalType:"long-term",category:"plumbing",desc:"Bathroom pipe leak fix",amount:320,vendor:"ABC Plumbing"},
  {id:11,date:"2026-03-08",property:"7845 Montgomery Avenue",unit:"Unit 4",rentalType:"long-term",category:"general",desc:"Locksmith - rekey",amount:185,vendor:"QuickLock"},
  {id:12,date:"2026-03-05",property:"426 Central",unit:"",rentalType:"short-term",category:"insurance",desc:"Liability insurance - monthly",amount:450,vendor:"Nationwide"},
  {id:13,date:"2026-03-02",property:"46 Township Line Road",unit:"",rentalType:"long-term",category:"general",desc:"Snow removal - February storms",amount:950,vendor:"LandCare Services"},
  {id:14,date:"2026-03-01",property:"431 Valley Rd",unit:"",rentalType:"long-term",category:"utilities",desc:"Trash collection - Q1",amount:540,vendor:"Republic Services"},
  {id:15,date:"2026-02-28",property:"46 Township Line Road",unit:"325",rentalType:"long-term",category:"furnishing",desc:"Replaced kitchen table set",amount:680,vendor:"IKEA"},
  {id:16,date:"2026-02-25",property:"926 Fox Chase Rd",unit:"",rentalType:"short-term",category:"decor",desc:"New curtains and throw pillows",amount:290,vendor:"HomeGoods"},
];
let _expNextId = 17;
let _currentExpView = 'all';

function getExpProperties() {
  const props = [...new Set(WPA_EXPENSES.map(e => e.property))].sort();
  return props;
}

function getUnitsForProperty(propName) {
  // Pull from main data array (units)
  const units = data.filter(r => {
    const propMatch = propertiesData.find(p => p.name === propName || p.apt === propName);
    if (propMatch) return r.apt === propMatch.apt || r.owner === propName;
    return false;
  });
  const unitNames = [...new Set(units.map(r => r.apt))].sort();
  // Also pull from expenses that have units for this property
  WPA_EXPENSES.filter(e => e.property === propName && e.unit).forEach(e => {
    if (!unitNames.includes(e.unit)) unitNames.push(e.unit);
  });
  return unitNames;
}

function populateExpPropFilter() {
  const sel = document.getElementById('expPropFilter');
  if (!sel) return;
  const props = getExpProperties();
  sel.innerHTML = '<option value="all">All Properties</option>' + props.map(p => `<option value="${p}">${p}</option>`).join('');
}

function populateExpFormProps() {
  const sel = document.getElementById('expFormProp');
  if (!sel) return;
  const allProps = [...new Set([...getExpProperties(), ...propertiesData.map(p => p.name)])].sort();
  sel.innerHTML = '<option value="">Select property...</option>' + allProps.map(p => `<option value="${p}">${p}</option>`).join('');
}

function updateExpUnitOptions() {
  const propName = document.getElementById('expFormProp')?.value || '';
  const unitSel = document.getElementById('expFormUnit');
  if (!unitSel) return;
  if (!propName) { unitSel.innerHTML = '<option value="">Property-wide</option>'; return; }
  const units = getUnitsForProperty(propName);
  unitSel.innerHTML = '<option value="">Property-wide</option>' + units.map(u => `<option value="${u}">${u}</option>`).join('');
}

function toggleExpenseForm() {
  const wrap = document.getElementById('expFormWrap');
  if (!wrap) return;
  const open = wrap.style.display !== 'none';
  wrap.style.display = open ? 'none' : '';
  if (!open) {
    document.getElementById('expFormDate').value = new Date().toISOString().slice(0,10);
    populateExpFormProps();
    document.getElementById('expFormAmt').value = '';
    document.getElementById('expFormVendor').value = '';
    document.getElementById('expFormDesc').value = '';
    document.getElementById('expFormCat').value = 'general';
    document.getElementById('expFormUnit').innerHTML = '<option value="">Property-wide</option>';
    document.getElementById('expFormProp').focus();
  }
}

function submitExpense() {
  const prop = document.getElementById('expFormProp')?.value;
  const amt = parseFloat(document.getElementById('expFormAmt')?.value);
  if (!prop) { toast('Select a property', 'error'); return; }
  if (!amt || amt <= 0) { toast('Enter an amount', 'error'); return; }
  const unit = document.getElementById('expFormUnit')?.value || '';
  const cat = document.getElementById('expFormCat')?.value || 'general';
  const vendor = document.getElementById('expFormVendor')?.value || '';
  const desc = document.getElementById('expFormDesc')?.value || '';
  const date = document.getElementById('expFormDate')?.value || new Date().toISOString().slice(0,10);
  // Determine rental type from property
  const propData = propertiesData.find(p => p.name === prop);
  const rentalType = propData?.type === 'short-stay' ? 'short-term' : 'long-term';
  WPA_EXPENSES.unshift({ id: _expNextId++, date, property: prop, unit, rentalType, category: cat, desc, amount: amt, vendor });
  document.getElementById('expFormWrap').style.display = 'none';
  toast('Expense added', 'success');
  renderExpensesPage();
}

function deleteExpense_main(id) {
  WPA_EXPENSES = WPA_EXPENSES.filter(e => e.id !== id);
  renderExpensesPage();
}

function renderExpensesPage() {
  const tbody = document.getElementById('expBody');
  if (!tbody) return;

  populateExpPropFilter();

  const search = (document.getElementById('expSearch')?.value || '').toLowerCase();
  const propF = document.getElementById('expPropFilter')?.value || 'all';
  const typeF = document.getElementById('expTypeFilter')?.value || 'all';
  const catF = document.getElementById('expCatFilter')?.value || 'all';

  let filtered = WPA_EXPENSES.filter(e => {
    if (propF !== 'all' && e.property !== propF) return false;
    if (typeF !== 'all' && e.rentalType !== typeF) return false;
    if (catF !== 'all' && e.category !== catF) return false;
    if (search && !e.desc.toLowerCase().includes(search) && !e.property.toLowerCase().includes(search) && !e.vendor.toLowerCase().includes(search) && !(e.unit||'').toLowerCase().includes(search)) return false;
    return true;
  });

  const fmt = n => '$' + n.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2});
  const total = filtered.reduce((s,e) => s + e.amount, 0);
  const maint = filtered.filter(e => ['maintenance','plumbing','electric'].includes(e.category)).reduce((s,e) => s + e.amount, 0);
  const util = filtered.filter(e => e.category === 'utilities').reduce((s,e) => s + e.amount, 0);
  const income = (typeof INNAGO_RENT !== 'undefined' ? INNAGO_RENT : []).reduce((s,r) => s + (r.paid||0), 0);

  const el = (id, v) => { const e = document.getElementById(id); if(e) e.textContent = v; };
  el('expTotal', fmt(total));
  el('expMaint', fmt(maint));
  el('expUtil', fmt(util));
  el('expNet', fmt(income - total));
  el('expCount', filtered.length + ' expense' + (filtered.length !== 1 ? 's' : ''));

  // Grouped views
  const groupedDiv = document.getElementById('expGroupedView');
  const tableWrap = document.getElementById('expTableWrap');

  if (_currentExpView === 'property') {
    if(groupedDiv) groupedDiv.style.display = '';
    if(tableWrap) tableWrap.style.display = 'none';
    renderExpGrouped(filtered, 'property', groupedDiv, fmt);
    return;
  } else if (_currentExpView === 'category') {
    if(groupedDiv) groupedDiv.style.display = '';
    if(tableWrap) tableWrap.style.display = 'none';
    renderExpGrouped(filtered, 'category', groupedDiv, fmt);
    return;
  }

  if(groupedDiv) groupedDiv.style.display = 'none';
  if(tableWrap) tableWrap.style.display = '';

  // Flat table view
  if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" class="mtm-empty">No expenses match your filters</td></tr>';
    return;
  }

  tbody.innerHTML = filtered.sort((a,b) => b.date.localeCompare(a.date)).map(e => {
    const catColor = EXP_CAT_COLORS[e.category] || '#9E9E9E';
    const catLabel = e.category.charAt(0).toUpperCase() + e.category.slice(1);
    const typeTag = e.rentalType === 'short-term' ? '<span style="background:#e8f5e9;color:#2e7d32;font-size:9px;padding:1px 5px;border-radius:3px;margin-left:4px">ST</span>' : '<span style="background:#e3f2fd;color:#1565c0;font-size:9px;padding:1px 5px;border-radius:3px;margin-left:4px">LT</span>';
    return `<tr>
      <td style="font-family:var(--fm);font-size:12px;color:var(--muted);white-space:nowrap">${e.date}</td>
      <td><span style="font-size:12px">${e.property}</span>${typeTag}</td>
      <td style="font-family:var(--fm);font-size:12px;color:${e.unit ? 'var(--text)' : 'var(--muted)'}">${e.unit || '—'}</td>
      <td><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${catColor};margin-right:6px"></span><span style="font-size:12px">${catLabel}</span></td>
      <td style="font-size:12px">${e.desc}</td>
      <td style="font-weight:600;color:var(--red);font-family:var(--fm);white-space:nowrap">${fmt(e.amount)}</td>
      <td style="color:var(--muted);font-size:12px">${e.vendor}</td>
      <td><button class="jc-row-del" onclick="deleteExpense_main(${e.id})" style="opacity:.4">&#x2715;</button></td>
    </tr>`;
  }).join('');
}

function renderExpGrouped(expenses, groupBy, container, fmt) {
  if (!container) return;
  const groups = {};
  expenses.forEach(e => {
    const key = groupBy === 'property' ? e.property : e.category;
    if (!groups[key]) groups[key] = [];
    groups[key].push(e);
  });
  const sortedKeys = Object.keys(groups).sort((a,b) => {
    const totA = groups[a].reduce((s,e) => s+e.amount, 0);
    const totB = groups[b].reduce((s,e) => s+e.amount, 0);
    return totB - totA;
  });

  let html = '';
  sortedKeys.forEach(key => {
    const items = groups[key].sort((a,b) => b.date.localeCompare(a.date));
    const groupTotal = items.reduce((s,e) => s+e.amount, 0);
    const label = groupBy === 'category' ? key.charAt(0).toUpperCase() + key.slice(1) : key;
    const color = groupBy === 'category' ? (EXP_CAT_COLORS[key] || '#9E9E9E') : 'var(--accent)';

    html += `<div style="margin-bottom:16px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;box-shadow:var(--shadow)">`;
    html += `<div style="display:flex;justify-content:space-between;align-items:center;padding:12px 16px;border-bottom:1px solid var(--border);background:var(--surface2)">`;
    html += `<div style="display:flex;align-items:center;gap:8px">`;
    if (groupBy === 'category') html += `<span style="width:10px;height:10px;border-radius:50%;background:${color}"></span>`;
    html += `<strong style="font-size:14px">${label}</strong><span style="font-size:11px;color:var(--muted)">${items.length} item${items.length!==1?'s':''}</span></div>`;
    html += `<span style="font-weight:700;font-family:var(--fm);color:var(--red)">${fmt(groupTotal)}</span></div>`;

    items.forEach(e => {
      const unitStr = e.unit ? '<span style="font-family:var(--fm);font-size:11px;background:var(--surface2);padding:1px 6px;border-radius:3px;margin-left:6px">' + e.unit + '</span>' : '';
      const catDot = groupBy === 'property' ? '<span style="width:6px;height:6px;border-radius:50%;background:' + (EXP_CAT_COLORS[e.category]||'#9E9E9E') + ';margin-right:4px;display:inline-block"></span>' : '';
      html += `<div style="display:flex;align-items:center;padding:8px 16px;border-bottom:1px solid var(--border);font-size:12px;gap:10px">`;
      html += `<span style="width:80px;flex-shrink:0;font-family:var(--fm);color:var(--muted)">${e.date}</span>`;
      if (groupBy === 'category') html += `<span style="flex:1">${e.property}${unitStr}</span>`;
      else html += `<span style="flex:1">${catDot}${e.desc}${unitStr}</span>`;
      html += `<span style="font-weight:600;font-family:var(--fm);color:var(--red);white-space:nowrap">${fmt(e.amount)}</span>`;
      html += `<span style="color:var(--muted);width:100px;flex-shrink:0;text-align:right">${e.vendor}</span></div>`;
    });
    html += '</div>';
  });
  container.innerHTML = html || '<div class="mtm-empty" style="padding:40px;text-align:center">No expenses to group</div>';
}

// Legacy backward compat
function renderMTMExpenses() { renderExpensesPage(); }
function addMTMExpense() { toggleExpenseForm(); }

// ── Maintenance Data & Render ──
let MAINTENANCE_REQUESTS = [];

async function loadMaintenanceFromSupabase() {
  try {
    const { data, error } = await sb.from('maintenance_requests')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) { console.error('Maint load error:', error); return; }
    MAINTENANCE_REQUESTS = (data || []).map(r => ({
      id: r.id,
      property: r.property || r.address || '',
      unit: r.unit || '',
      tenant: r.name || '',
      phone: r.phone || '',
      email: r.email || '',
      issue: r.description || '',
      category: r.category || 'General',
      priority: r.priority || 'normal',
      status: mapMaintStatus(r.status),
      urgency: r.urgency || 'normal',
      created: fmtMaintDate(r.created_at),
      created_at: r.created_at,
      user_type: r.user_type || 'guest',
      preferred_block: r.preferred_block || '',
      preferred_date: r.preferred_date || '',
      preferred_slot: r.preferred_slot || '',
      preferred_comm: r.preferred_comm || 'sms',
      no_access_needed: r.no_access_needed || false,
      permission_to_enter: r.permission_to_enter || false,
      waiver_agreed: r.waiver_agreed || false,
      sms_consent: r.sms_consent || false,
      photo: r.photo || null,
      admin_notes: r.admin_notes || '',
      assigned_to: r.assigned_to || '',
      address: r.address || '',
      owner: r.owner || '',
      _raw: r
    }));
    renderMTMMaint();
  } catch (e) { console.error('Maint load exception:', e); }
}

function mapMaintStatus(s) {
  const map = { submitted:'open', assigned:'scheduled', scheduled:'scheduled', 'in-progress':'in-progress', completed:'resolved', cancelled:'resolved' };
  return map[s] || s || 'open';
}

function fmtMaintDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return months[d.getMonth()] + ' ' + String(d.getDate()).padStart(2,'0') + ', ' + d.getFullYear();
}

function renderMTMMaint() {
  const tbody = document.getElementById('mtmMaintBody');
  if (!tbody) return;
  const el = (id, v) => { const e = document.getElementById(id); if(e) e.textContent = v; };
  el('mtmMaintOpen', MAINTENANCE_REQUESTS.filter(m => m.status === 'open').length);
  el('mtmMaintProgress', MAINTENANCE_REQUESTS.filter(m => m.status === 'in-progress').length);
  el('mtmMaintScheduled', MAINTENANCE_REQUESTS.filter(m => m.status === 'scheduled').length);
  el('mtmMaintResolved', MAINTENANCE_REQUESTS.filter(m => m.status === 'resolved').length);
  filterMTMMaint();
}

function filterMTMMaint() {
  const tbody = document.getElementById('mtmMaintBody');
  if (!tbody) return;
  const search = (document.getElementById('mtmMaintSearch')?.value || '').toLowerCase();
  const statusF = document.getElementById('mtmMaintStatusFilter')?.value || 'all';

  const filtered = MAINTENANCE_REQUESTS.filter(m => {
    if (statusF !== 'all' && m.status !== statusF) return false;
    if (search && !m.tenant.toLowerCase().includes(search) && !m.issue.toLowerCase().includes(search) && !m.property.toLowerCase().includes(search)) return false;
    return true;
  });

  document.getElementById('mtmMaintCount').textContent = filtered.length + ' ticket' + (filtered.length !== 1 ? 's' : '');

  if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" class="mtm-empty">No maintenance tickets match your filters</td></tr>';
    return;
  }
  tbody.innerHTML = filtered.map(m => {
    const statusBadge = `<span class="mtm-badge ${m.status}">${m.status === 'in-progress' ? 'In Progress' : m.status.charAt(0).toUpperCase() + m.status.slice(1)}</span>`;
    const priBadge = `<span class="mtm-badge ${m.priority}">${m.priority.charAt(0).toUpperCase() + m.priority.slice(1)}</span>`;
    const catIcon = {Plumbing:'🚰',Electrical:'⚡','HVAC / Heating':'🌡',Appliance:'🏠','Lock / Key':'🔑','Pest Control':'🐛','Water Damage':'💧',General:'🔧'}[m.category] || '🔧';
    return `<tr onclick="openMaintTicket('${m.id}')" style="cursor:pointer">
      <td style="font-weight:600;color:var(--accent2)">${m.id.substring(0,10)}</td>
      <td><span class="mtm-prop-unit">${m.unit || '-'}</span><span class="mtm-prop-addr">${m.property || m.address || '-'}</span></td>
      <td>${m.tenant}${m.user_type === 'guest' ? ' <span style="font-size:10px;color:#9ca3af">(guest)</span>' : ''}</td>
      <td>${catIcon} ${m.issue.length > 60 ? m.issue.substring(0,60) + '...' : m.issue}</td>
      <td>${priBadge}</td>
      <td>${statusBadge}</td>
      <td>${m.created}</td>
    </tr>`;
  }).join('');
}

function openMaintTicket(id) {
  const m = MAINTENANCE_REQUESTS.find(r => r.id === id);
  if (!m) return;
  const catIcon = {Plumbing:'🚰',Electrical:'⚡','HVAC / Heating':'🌡',Appliance:'🏠','Lock / Key':'🔑','Pest Control':'🐛','Water Damage':'💧',General:'🔧'}[m.category] || '🔧';
  const statusOpts = ['submitted','assigned','scheduled','in-progress','completed','cancelled'];
  const priorityOpts = ['low','normal','high','urgent'];

  let html = `<div style="padding:20px">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px">
      <div>
        <h3 style="margin:0;font-size:18px">${catIcon} ${m.category}</h3>
        <span style="font-size:12px;color:#6b7280">${m.id} &bull; ${m.created} &bull; ${m.user_type === 'guest' ? 'Guest' : 'Resident'}</span>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px">
      <div><span style="font-size:11px;color:#6b7280;text-transform:uppercase">Tenant</span><div style="font-weight:600">${m.tenant}</div></div>
      <div><span style="font-size:11px;color:#6b7280;text-transform:uppercase">Phone</span><div>${m.phone || '-'}</div></div>
      <div><span style="font-size:11px;color:#6b7280;text-transform:uppercase">Email</span><div>${m.email || '-'}</div></div>
      <div><span style="font-size:11px;color:#6b7280;text-transform:uppercase">Unit</span><div>${m.unit || '-'}</div></div>
      <div><span style="font-size:11px;color:#6b7280;text-transform:uppercase">Property/Address</span><div>${m.property || m.address || '-'}</div></div>
      <div><span style="font-size:11px;color:#6b7280;text-transform:uppercase">Preferred Comm</span><div>${m.preferred_comm}</div></div>
    </div>
    <div style="background:#f9fafb;border-radius:8px;padding:14px;margin-bottom:16px">
      <div style="font-size:11px;color:#6b7280;text-transform:uppercase;margin-bottom:6px">Description</div>
      <div style="white-space:pre-wrap">${m.issue}</div>
    </div>`;

  if (m.preferred_block) {
    html += `<div style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:12px;margin-bottom:12px">
      <strong>📅 Preferred Time:</strong> ${m.preferred_block}
    </div>`;
  }

  let flags = [];
  if (m.no_access_needed) flags.push('🔑 No access needed');
  if (m.permission_to_enter) flags.push('🚪 Permission to enter');
  if (m.waiver_agreed) flags.push('✅ Waiver signed');
  if (m.sms_consent) flags.push('📱 SMS consent');
  if (flags.length) {
    html += `<div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px">
      ${flags.map(f => `<span style="background:#f0fdf4;border:1px solid #a7f3d0;border-radius:6px;padding:4px 10px;font-size:12px">${f}</span>`).join('')}
    </div>`;
  }

  if (m.photo) {
    html += `<div style="margin-bottom:16px"><img src="${m.photo}" style="max-width:100%;max-height:300px;border-radius:8px;border:1px solid #e5e7eb" onerror="this.style.display='none'"></div>`;
  }

  html += `<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px">
    <div>
      <label style="font-size:11px;color:#6b7280;text-transform:uppercase;display:block;margin-bottom:4px">Status</label>
      <select id="maintTicketStatus" style="width:100%;padding:8px;border:1px solid #e5e7eb;border-radius:6px">
        ${statusOpts.map(s => `<option value="${s}" ${(m._raw.status || 'submitted') === s ? 'selected' : ''}>${s.charAt(0).toUpperCase() + s.slice(1)}</option>`).join('')}
      </select>
    </div>
    <div>
      <label style="font-size:11px;color:#6b7280;text-transform:uppercase;display:block;margin-bottom:4px">Priority</label>
      <select id="maintTicketPriority" style="width:100%;padding:8px;border:1px solid #e5e7eb;border-radius:6px">
        ${priorityOpts.map(p => `<option value="${p}" ${m.priority === p ? 'selected' : ''}>${p.charAt(0).toUpperCase() + p.slice(1)}</option>`).join('')}
      </select>
    </div>
  </div>
  <div style="margin-bottom:16px">
    <label style="font-size:11px;color:#6b7280;text-transform:uppercase;display:block;margin-bottom:4px">Admin Notes</label>
    <textarea id="maintTicketNotes" rows="3" style="width:100%;padding:8px;border:1px solid #e5e7eb;border-radius:6px;font-family:inherit;resize:vertical">${m.admin_notes || ''}</textarea>
  </div>
  <div style="display:flex;gap:10px">
    <button onclick="saveMaintTicket('${m.id}')" style="flex:1;padding:10px;background:var(--accent2,#c47f00);color:#fff;border:none;border-radius:8px;font-weight:600;cursor:pointer">Save Changes</button>
  </div>
  </div>`;

  // Use a modal/overlay approach
  let overlay = document.getElementById('maintTicketOverlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'maintTicketOverlay';
    overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.5);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px';
    document.body.appendChild(overlay);
  }
  overlay.style.display = 'flex';
  overlay.innerHTML = `<div style="background:#fff;border-radius:12px;max-width:600px;width:100%;max-height:90vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <div style="display:flex;justify-content:space-between;align-items:center;padding:16px 20px;border-bottom:1px solid #e5e7eb">
      <h3 style="margin:0;font-size:16px">Maintenance Ticket</h3>
      <button onclick="document.getElementById('maintTicketOverlay').style.display='none'" style="background:none;border:none;font-size:20px;cursor:pointer;color:#6b7280">&times;</button>
    </div>
    ${html}
  </div>`;
}

async function saveMaintTicket(id) {
  const status = document.getElementById('maintTicketStatus')?.value;
  const priority = document.getElementById('maintTicketPriority')?.value;
  const notes = document.getElementById('maintTicketNotes')?.value || '';

  try {
    const { error } = await sb.from('maintenance_requests')
      .update({ status, priority, admin_notes: notes, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) { alert('Error saving: ' + error.message); return; }
    document.getElementById('maintTicketOverlay').style.display = 'none';
    await loadMaintenanceFromSupabase();
  } catch (e) { alert('Error: ' + e.message); }
}

function addMTMMaintTicket() {
  alert('New Maintenance Ticket\n\nTenants submit requests via the Willow Resident App.\nVisit app.willowpa.com to submit a request.');
}

// ══════════════════════════════════════════════════════
//  DASHBOARD DRILL-DOWN SYSTEM
// ══════════════════════════════════════════════════════

// Store donut slice angles for click detection
let donutSlices = [];

// ═══ PANEL NAVIGATION STACK (Breadcrumbs) ═══
const panelStack = [];
let currentDDFilter = '';

function panelPush(entry) {
  // entry = { type: 'drilldown'|'invoice'|'lease', label, icon, data }
  panelStack.push(entry);
  renderBreadcrumbs();
}

function panelBack() {
  if (panelStack.length <= 1) {
    panelCloseAll();
    return;
  }
  const closing = panelStack.pop();
  const prev = panelStack[panelStack.length - 1];

  // Always close invoice panel when going back from invoice
  if (closing.type === 'invoice') {
    document.getElementById('invOverlay').classList.remove('open');
    document.getElementById('invPanel').classList.remove('open');
    const modeBar = document.getElementById('invModeBar');
    if (modeBar) modeBar.style.display = 'none';
    currentInvoiceMode = 'view';
  }

  // Re-render the previous level
  if (prev.type === 'drilldown') {
    _renderDrillDownContent(prev.data.category, false);
    // Ensure drill-down panel stays open
    document.getElementById('ddOverlay').classList.add('open');
    document.getElementById('ddPanel').classList.add('open');
  } else if (prev.type === 'invoice') {
    _renderInvoiceContent(prev.data.rentIdx, false);
    document.getElementById('invOverlay').classList.add('open');
    document.getElementById('invPanel').classList.add('open');
  }
  renderBreadcrumbs();
}

function panelCloseAll() {
  panelStack.length = 0;
  currentDDFilter = '';
  document.getElementById('ddOverlay').classList.remove('open');
  document.getElementById('ddPanel').classList.remove('open');
  document.getElementById('invOverlay').classList.remove('open');
  document.getElementById('invPanel').classList.remove('open');
  document.getElementById('ddFilterBar').style.display = 'none';
  const modeBar = document.getElementById('invModeBar');
  if (modeBar) modeBar.style.display = 'none';
}

function panelGoTo(index) {
  // Navigate to a specific breadcrumb level
  while (panelStack.length > index + 1) panelStack.pop();
  const target = panelStack[index];

  // Close invoice panel when navigating to a non-invoice level
  if (target.type !== 'invoice') {
    document.getElementById('invOverlay').classList.remove('open');
    document.getElementById('invPanel').classList.remove('open');
    const modeBar = document.getElementById('invModeBar');
    if (modeBar) modeBar.style.display = 'none';
    currentInvoiceMode = 'view';
  }

  if (target.type === 'drilldown') {
    _renderDrillDownContent(target.data.category, false);
    document.getElementById('ddOverlay').classList.add('open');
    document.getElementById('ddPanel').classList.add('open');
  } else if (target.type === 'invoice') {
    _renderInvoiceContent(target.data.rentIdx, false);
    document.getElementById('invOverlay').classList.add('open');
    document.getElementById('invPanel').classList.add('open');
  }
  renderBreadcrumbs();
}

function renderBreadcrumbs() {
  const ddBC = document.getElementById('ddBreadcrumb');
  const invBC = document.getElementById('invBreadcrumb');
  if (!ddBC) return;

  const html = panelStack.map((entry, i) => {
    const isLast = i === panelStack.length - 1;
    const sep = i > 0 ? '<span class="dd-crumb-sep">›</span>' : '';
    const icon = entry.icon || '';
    const cls = isLast ? 'dd-crumb active' : 'dd-crumb';
    const click = isLast ? '' : ` onclick="panelGoTo(${i})"`;
    return `${sep}<span class="${cls}"${click}>${icon ? '<span class="dd-crumb-icon">'+icon+'</span>' : ''}${entry.label}</span>`;
  }).join('');

  ddBC.innerHTML = html;
  if (invBC) invBC.innerHTML = html;
}

function filterDrillDownList() {
  const q = (document.getElementById('ddSearchInput')?.value || '').toLowerCase();
  currentDDFilter = q;
  const items = document.querySelectorAll('#ddBody .dd-unit-item, #ddBody .dd-lease-item');
  let count = 0;
  items.forEach(item => {
    const text = item.textContent.toLowerCase();
    const show = !q || text.includes(q);
    item.style.display = show ? '' : 'none';
    if (show) count++;
  });
  const countEl = document.getElementById('ddResultCount');
  if (countEl) countEl.textContent = q ? count + ' result' + (count !== 1 ? 's' : '') : '';
}

function renderMTMDashboardInteractive() {
  // Re-draw donut but save slice data for click detection
  const canvas = document.getElementById('mtmDonutCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const total = INNAGO_RENT.reduce((s,r) => s + r.amount, 0);
  const collected = INNAGO_RENT.reduce((s,r) => s + r.paid, 0);
  const processing = INNAGO_RENT.reduce((s,r) => s + r.processing, 0);
  const overdue = INNAGO_RENT.filter(r => r.status === 'overdue').reduce((s,r) => s + r.balance, 0);
  const comingDue = INNAGO_RENT.filter(r => r.status === 'pending').reduce((s,r) => s + r.balance, 0);
  const remaining = total - collected - processing - overdue - comingDue;

  const cx = 90, cy = 90, r = 70, lw = 28;
  const slices = [
    {val: collected, color: '#256645', cat: 'collected', label: 'Collected'},
    {val: processing, color: '#b86818', cat: 'processing', label: 'Processing'},
    {val: overdue, color: '#b83228', cat: 'overdue', label: 'Overdue'},
    {val: comingDue, color: '#1e5799', cat: 'coming_due', label: 'Coming Due'},
    {val: remaining > 0 ? remaining : 0, color: '#ede9e2', cat: 'remaining', label: 'Remaining'}
  ];

  donutSlices = [];
  let angle = -Math.PI / 2;
  slices.forEach(s => {
    if (s.val <= 0) return;
    const startAngle = angle;
    const sweep = (s.val / total) * Math.PI * 2;
    donutSlices.push({ startAngle, endAngle: angle + sweep, cat: s.cat, label: s.label, color: s.color });
    angle += sweep;
  });

  // Attach click handler to canvas
  canvas.onclick = handleDonutClick;
  canvas.style.cursor = 'pointer';

  // Make collection grid items clickable
  document.querySelectorAll('.mtm-dash-cg-item').forEach(item => {
    const label = item.querySelector('.mtm-cg-label');
    if (!label) return;
    const text = label.textContent.trim().toLowerCase();
    let cat = null;
    if (text.includes('collected')) cat = 'collected';
    else if (text.includes('processing')) cat = 'processing';
    else if (text.includes('overdue')) cat = 'overdue';
    else if (text.includes('coming')) cat = 'coming_due';
    if (cat) {
      item.onclick = () => openDrillDown(cat);
      item.title = 'Click to drill down';
    }
  });

  // Make lease status grid items clickable
  document.querySelectorAll('.mtm-dash-lg-item').forEach(item => {
    const label = item.querySelector('.mtm-dash-lg-label');
    if (!label) return;
    const text = label.textContent.trim().toLowerCase();
    let cat = null;
    if (text.includes('active')) cat = 'lease_active';
    else if (text.includes('future')) cat = 'lease_future';
    else if (text.includes('expiring')) cat = 'lease_expiring';
    else if (text.includes('month')) cat = 'lease_mtm';
    if (cat) {
      item.onclick = () => openDrillDown(cat);
      item.title = 'Click to drill down';
    }
  });

  // Make occupancy card clickable
  const occCard = document.querySelector('.mtm-dash-occ-row')?.closest('.mtm-dash-card');
  if (occCard) {
    occCard.onclick = () => openDrillDown('occupancy');
    occCard.title = 'Click to view occupancy details';
  }

  // Make overdue units card clickable
  const overdueCard = document.querySelector('.mtm-dash-overdue-row')?.closest('.mtm-dash-card');
  if (overdueCard) {
    overdueCard.onclick = () => openDrillDown('overdue_units');
    overdueCard.title = 'Click to view overdue units';
  }

  // Make expiring leases list items clickable — open tenant card
  document.querySelectorAll('#mtmDashExpiring .mtm-dash-list-item').forEach((item, idx) => {
    const expLeases = INNAGO_LEASES.filter(l => l.type === 'fixed').sort((a,b) => new Date(a.end) - new Date(b.end)).slice(0, 6);
    if (expLeases[idx]) {
      const tName = expLeases[idx].tenants.split(',')[0].trim();
      const tIdx = INNAGO_TENANTS.findIndex(t => t.name.includes(tName.split(' ')[0]));
      if (tIdx >= 0) {
        item.onclick = () => openTenantCardFromLease(tIdx);
      } else {
        const origIdx = INNAGO_LEASES.indexOf(expLeases[idx]);
        item.onclick = () => openLeaseDetail(origIdx);
      }
      item.title = 'Click to view tenant details';
    }
  });

  // Make overdue balances list items clickable
  document.querySelectorAll('#mtmDashOverdueList .mtm-dash-list-item').forEach((item, idx) => {
    const overdueItems = INNAGO_RENT.filter(r => r.balance > 0).sort((a,b) => b.balance - a.balance);
    if (overdueItems[idx]) {
      const origIdx = INNAGO_RENT.indexOf(overdueItems[idx]);
      item.onclick = () => openInvoiceEditor(origIdx);
      item.title = 'Click to view/edit invoice';
    }
  });
}

function handleDonutClick(e) {
  const canvas = e.target;
  const rect = canvas.getBoundingClientRect();
  const x = (e.clientX - rect.left) * (canvas.width / rect.width);
  const y = (e.clientY - rect.top) * (canvas.height / rect.height);
  const cx = 90, cy = 90, r = 70, lw = 28;

  // Check if click is within the donut ring
  const dx = x - cx, dy = y - cy;
  const dist = Math.sqrt(dx*dx + dy*dy);
  if (dist < r - lw/2 || dist > r + lw/2) return; // outside donut ring

  // Determine angle
  let clickAngle = Math.atan2(dy, dx);
  // Normalize to match our starting angle (-PI/2)
  // atan2 returns -PI to PI, we need to check against our slice angles

  for (const slice of donutSlices) {
    let start = slice.startAngle, end = slice.endAngle;
    // Normalize click angle relative to slice
    let a = clickAngle;
    // Handle wrap-around
    if (end > Math.PI) {
      if (a < start) a += Math.PI * 2;
      if (a >= start && a <= end) {
        if (slice.cat !== 'remaining') openDrillDown(slice.cat);
        return;
      }
    } else {
      if (a >= start && a <= end) {
        if (slice.cat !== 'remaining') openDrillDown(slice.cat);
        return;
      }
    }
  }
}

function openDrillDown(category, source) {
  // Clear stack and start fresh drill-down
  panelStack.length = 0;
  currentDDFilter = '';
  const searchInput = document.getElementById('ddSearchInput');
  if (searchInput) searchInput.value = '';

  const catLabels = {
    collected: 'Collected', processing: 'Processing', overdue: 'Overdue',
    coming_due: 'Coming Due', overdue_units: 'Outstanding Balances',
    occupancy: 'Occupancy', lease_active: 'Active Leases',
    lease_future: 'Future Leases', lease_expiring: 'Expiring Leases',
    lease_mtm: 'Month-to-Month',
    // Main dashboard categories
    dash_occupancy: 'Occupancy', dash_revenue: 'Revenue',
    dash_outstanding: 'Outstanding', dash_collected: 'Collection',
    dash_available: 'Available', dash_lease_type: 'Lease Types',
    dash_owner: 'By Owner', dash_urgency: 'Needs Attention'
  };
  const catIcons = {
    collected: '✓', processing: '⏳', overdue: '!', coming_due: '◎',
    overdue_units: '⚠', occupancy: '🏠', lease_active: '📋',
    lease_future: '📅', lease_expiring: '⏰', lease_mtm: '↔',
    dash_occupancy: '🏠', dash_revenue: '💰', dash_outstanding: '⚠',
    dash_collected: '📊', dash_available: '🔑', dash_lease_type: '📋',
    dash_owner: '🏘', dash_urgency: '🚨'
  };

  const src = source || 'Dashboard';
  panelPush({
    type: 'drilldown',
    label: catLabels[category] || category,
    icon: catIcons[category] || '',
    data: { category, source: src }
  });

  _renderDrillDownContent(category, true);
}

function _renderDrillDownContent(category, openPanel) {
  const overlay = document.getElementById('ddOverlay');
  const panel = document.getElementById('ddPanel');
  const title = document.getElementById('ddTitle');
  const body = document.getElementById('ddBody');
  const filterBar = document.getElementById('ddFilterBar');

  const fmt = n => '$' + n.toLocaleString(undefined, {minimumFractionDigits:0, maximumFractionDigits:0});

  let html = '';
  let showSearch = true;

  switch(category) {
    case 'collected': {
      const items = INNAGO_RENT.filter(r => r.paid > 0 && r.status === 'paid');
      title.textContent = 'Collected — ' + items.length + ' Units';
      const totalAmt = items.reduce((s,r) => s + r.paid, 0);
      html = `<div class="dd-summary">
        <div class="dd-summary-item"><div class="dd-summary-val" style="color:var(--green)">${fmt(totalAmt)}</div><div class="dd-summary-label">Total Collected</div></div>
        <div class="dd-summary-item"><div class="dd-summary-val">${items.length}</div><div class="dd-summary-label">Units</div></div>
      </div><div id="ddResultCount" class="dd-result-count"></div><div class="dd-unit-list">`;
      html += _renderRentItems(items, 'paid', 'var(--green)', 'Paid');
      html += '</div>';
      break;
    }
    case 'processing': {
      const items = INNAGO_RENT.filter(r => r.processing > 0);
      title.textContent = 'Processing — ' + items.length + ' Units';
      const totalAmt = items.reduce((s,r) => s + r.processing, 0);
      html = `<div class="dd-summary">
        <div class="dd-summary-item"><div class="dd-summary-val" style="color:var(--orange)">${fmt(totalAmt)}</div><div class="dd-summary-label">Processing</div></div>
        <div class="dd-summary-item"><div class="dd-summary-val">${items.length}</div><div class="dd-summary-label">Units</div></div>
      </div><div id="ddResultCount" class="dd-result-count"></div><div class="dd-unit-list">`;
      html += items.map(r => {
        const idx = INNAGO_RENT.indexOf(r);
        return `<div class="dd-unit-item" onclick="openInvoiceEditor(${idx})" title="View invoice">
          <div class="dd-unit-left"><div class="dd-unit-tenant">${r.tenants.split(',')[0]}</div><div class="dd-unit-prop">${r.property} | ${r.unit}</div></div>
          <div class="dd-unit-right"><div class="dd-unit-amount" style="color:var(--orange)">${fmt(r.processing)}</div><div class="dd-unit-status"><span class="mtm-badge processing" style="font-size:9px">Processing</span></div></div>
        </div>`;
      }).join('');
      html += '</div>';
      break;
    }
    case 'overdue': {
      const items = INNAGO_RENT.filter(r => r.status === 'overdue');
      title.textContent = 'Overdue — ' + items.length + ' Units';
      const totalAmt = items.reduce((s,r) => s + r.balance, 0);
      html = `<div class="dd-summary">
        <div class="dd-summary-item"><div class="dd-summary-val" style="color:var(--red)">${fmt(totalAmt)}</div><div class="dd-summary-label">Overdue Total</div></div>
        <div class="dd-summary-item"><div class="dd-summary-val">${items.length}</div><div class="dd-summary-label">Units</div></div>
      </div><div id="ddResultCount" class="dd-result-count"></div><div class="dd-unit-list">`;
      html += items.map(r => {
        const idx = INNAGO_RENT.indexOf(r);
        return `<div class="dd-unit-item" onclick="openInvoiceEditor(${idx})" title="View/edit invoice">
          <div class="dd-unit-left"><div class="dd-unit-tenant">${r.tenants.split(',')[0]}</div><div class="dd-unit-prop">${r.property} | ${r.unit}</div></div>
          <div class="dd-unit-right"><div class="dd-unit-amount" style="color:var(--red)">${fmt(r.balance)}</div><div class="dd-unit-status"><span class="mtm-badge overdue" style="font-size:9px">Overdue</span></div></div>
        </div>`;
      }).join('');
      html += '</div>';
      break;
    }
    case 'coming_due': {
      const items = INNAGO_RENT.filter(r => r.status === 'pending');
      title.textContent = 'Coming Due — ' + items.length + ' Units';
      const totalAmt = items.reduce((s,r) => s + r.balance, 0);
      html = `<div class="dd-summary">
        <div class="dd-summary-item"><div class="dd-summary-val" style="color:var(--blue)">${fmt(totalAmt)}</div><div class="dd-summary-label">Coming Due</div></div>
        <div class="dd-summary-item"><div class="dd-summary-val">${items.length}</div><div class="dd-summary-label">Units</div></div>
      </div><div id="ddResultCount" class="dd-result-count"></div><div class="dd-unit-list">`;
      html += items.map(r => {
        const idx = INNAGO_RENT.indexOf(r);
        return `<div class="dd-unit-item" onclick="openInvoiceEditor(${idx})" title="View invoice">
          <div class="dd-unit-left"><div class="dd-unit-tenant">${r.tenants.split(',')[0]}</div><div class="dd-unit-prop">${r.property} | ${r.unit}</div></div>
          <div class="dd-unit-right"><div class="dd-unit-amount" style="color:var(--blue)">${fmt(r.balance)}</div><div class="dd-unit-status"><span class="mtm-badge pending" style="font-size:9px">Pending</span></div></div>
        </div>`;
      }).join('');
      html += '</div>';
      break;
    }
    case 'overdue_units': {
      const items = INNAGO_RENT.filter(r => r.balance > 0).sort((a,b) => b.balance - a.balance);
      title.textContent = 'Units with Balance — ' + items.length;
      const totalBal = items.reduce((s,r) => s + r.balance, 0);
      html = `<div class="dd-summary">
        <div class="dd-summary-item"><div class="dd-summary-val" style="color:var(--red)">${fmt(totalBal)}</div><div class="dd-summary-label">Total Outstanding</div></div>
        <div class="dd-summary-item"><div class="dd-summary-val">${items.length}</div><div class="dd-summary-label">Units</div></div>
      </div><div id="ddResultCount" class="dd-result-count"></div><div class="dd-unit-list">`;
      html += items.map(r => {
        const idx = INNAGO_RENT.indexOf(r);
        const statusClass = r.status === 'overdue' ? 'overdue' : r.status === 'partial' ? 'processing' : 'pending';
        return `<div class="dd-unit-item" onclick="openInvoiceEditor(${idx})" title="View/edit invoice">
          <div class="dd-unit-left"><div class="dd-unit-tenant">${r.tenants.split(',')[0]}</div><div class="dd-unit-prop">${r.property} | ${r.unit}</div></div>
          <div class="dd-unit-right"><div class="dd-unit-amount" style="color:var(--red)">${fmt(r.balance)}</div><div class="dd-unit-status"><span class="mtm-badge ${statusClass}" style="font-size:9px">${r.status}</span></div></div>
        </div>`;
      }).join('');
      html += '</div>';
      break;
    }
    case 'occupancy': {
      const occupied = INNAGO_TENANTS.filter(t => t.status === 'Active');
      const totalUnits = 80;
      const vacant = totalUnits - occupied.length;
      title.textContent = 'Occupancy — ' + occupied.length + '/' + totalUnits + ' Occupied';
      html = `<div class="dd-summary">
        <div class="dd-summary-item"><div class="dd-summary-val" style="color:var(--green)">${occupied.length}</div><div class="dd-summary-label">Occupied</div></div>
        <div class="dd-summary-item"><div class="dd-summary-val" style="color:var(--text3)">${vacant}</div><div class="dd-summary-label">Vacant</div></div>
        <div class="dd-summary-item"><div class="dd-summary-val">${Math.round(occupied.length/totalUnits*100)}%</div><div class="dd-summary-label">Occupancy Rate</div></div>
      </div><div id="ddResultCount" class="dd-result-count"></div>`;
      const byProp = {};
      occupied.forEach(t => { if(!byProp[t.property]) byProp[t.property] = []; byProp[t.property].push(t); });
      html += '<div class="dd-unit-list">';
      Object.keys(byProp).sort().forEach(prop => {
        html += `<div class="dd-group-header">${prop} <span class="dd-group-count">${byProp[prop].length} units</span></div>`;
        byProp[prop].forEach(t => {
          // Try to find matching rent record for this tenant
          const rentIdx = INNAGO_RENT.findIndex(r => r.tenants.includes(t.name.split(',')[0].trim().split(' ')[0]) && r.property === t.property);
          const clickAction = rentIdx >= 0 ? `openInvoiceEditor(${rentIdx})` : `openTenantFromDD('${t.name.replace(/'/g,"\\'")}','${t.property.replace(/'/g,"\\'")}','${t.unitNum}',${t.rent},'${t.since}')`;
          html += `<div class="dd-unit-item" onclick="${clickAction}" title="Click to view details">
            <div class="dd-unit-left"><div class="dd-unit-tenant">${t.name}</div><div class="dd-unit-prop">${t.unitNum} — Since ${t.since}</div></div>
            <div class="dd-unit-right"><div class="dd-unit-amount" style="color:var(--green)">${t.rent > 0 ? '$'+t.rent.toLocaleString() : '—'}</div></div>
          </div>`;
        });
      });
      html += '</div>';
      break;
    }
    case 'lease_active': {
      const items = INNAGO_LEASES.filter(l => l.status === 'Active');
      title.textContent = 'Active Leases — ' + items.length;
      html = renderLeaseDrillDown(items);
      break;
    }
    case 'lease_future': {
      const items = INNAGO_LEASES.filter(l => l.status === 'Future' || INNAGO_TENANTS.some(t => t.name.includes(l.tenants.split(',')[0].trim()) && t.status === 'Future'));
      title.textContent = 'Future Leases — ' + items.length;
      html = items.length ? renderLeaseDrillDown(items) : '<div class="dd-empty">No future leases found</div>';
      break;
    }
    case 'lease_expiring': {
      const now = new Date();
      const d90 = new Date(now.getTime() + 90*24*60*60*1000);
      const items = INNAGO_LEASES.filter(l => l.type === 'fixed' && new Date(l.end) <= d90 && new Date(l.end) >= now);
      title.textContent = 'Expiring in 90 Days — ' + items.length;
      html = items.length ? renderLeaseDrillDown(items) : '<div class="dd-empty">No leases expiring within 90 days</div>';
      break;
    }
    case 'lease_mtm': {
      const items = INNAGO_LEASES.filter(l => l.type === 'mtm');
      title.textContent = 'Month-to-Month — ' + items.length;
      html = renderLeaseDrillDown(items);
      break;
    }
    // ── Main Dashboard Drill-Downs ──
    case 'dash_occupancy': {
      const active = dedupActive();
      const occ = active.filter(r => r.type !== 'available' && r.name);
      const avail = active.filter(r => r.type === 'available' || !r.name);
      const occPct = active.length ? Math.round(occ.length / active.length * 100) : 0;
      title.textContent = 'Occupancy — ' + occPct + '%';
      html = `<div class="dd-summary">
        <div class="dd-summary-item"><div class="dd-summary-val" style="color:var(--green)">${occ.length}</div><div class="dd-summary-label">Occupied</div></div>
        <div class="dd-summary-item"><div class="dd-summary-val" style="color:var(--text3)">${avail.length}</div><div class="dd-summary-label">Available</div></div>
        <div class="dd-summary-item"><div class="dd-summary-val">${occPct}%</div><div class="dd-summary-label">Rate</div></div>
      </div><div id="ddResultCount" class="dd-result-count"></div>`;
      // Group by type
      const byType = {};
      occ.forEach(r => { const t = r.type || 'other'; if (!byType[t]) byType[t] = []; byType[t].push(r); });
      html += '<div class="dd-unit-list">';
      Object.keys(byType).sort().forEach(type => {
        html += `<div class="dd-group-header">${type.replace(/-/g,' ').replace(/\b\w/g,c=>c.toUpperCase())} <span class="dd-group-count">${byType[type].length} units</span></div>`;
        byType[type].forEach(r => {
          html += `<div class="dd-unit-item" onclick="openDashUnitDetail('${r.apt.replace(/'/g,"\\'")}')">
            <div class="dd-unit-left"><div class="dd-unit-tenant">${r.name || 'Vacant'}</div><div class="dd-unit-prop">${r.apt}${r.owner ? ' — ' + r.owner : ''}</div></div>
            <div class="dd-unit-right"><div class="dd-unit-amount" style="color:var(--green)">${r.rent ? fmtMoney(r.rent) : '—'}</div><div class="dd-unit-status">${typeBadge(r.type)}</div></div>
          </div>`;
        });
      });
      if (avail.length > 0) {
        html += `<div class="dd-group-header" style="color:var(--text3)">Available <span class="dd-group-count">${avail.length} units</span></div>`;
        avail.forEach(r => {
          html += `<div class="dd-unit-item" onclick="openDashUnitDetail('${r.apt.replace(/'/g,"\\'")}')">
            <div class="dd-unit-left"><div class="dd-unit-tenant" style="color:var(--text3)">Vacant</div><div class="dd-unit-prop">${r.apt}${r.owner ? ' — ' + r.owner : ''}</div></div>
            <div class="dd-unit-right"><div class="dd-unit-amount" style="color:var(--text3)">—</div></div>
          </div>`;
        });
      }
      html += '</div>';
      break;
    }
    case 'dash_revenue': case 'dash_collected': {
      const active = dedupActive();
      const occ = active.filter(r => r.type !== 'available' && r.name);
      const now = new Date(), ty = now.getFullYear(), tm = now.getMonth();
      let coll = 0, exp = 0;
      occ.forEach(r => { coll += collectedInMonth(r, ty, tm); exp += expectedInMonth(r, ty, tm); });
      title.textContent = category === 'dash_revenue' ? 'Revenue Detail' : 'Collection Detail';
      html = `<div class="dd-summary">
        <div class="dd-summary-item"><div class="dd-summary-val" style="color:var(--green)">${fmtMoney(coll)}</div><div class="dd-summary-label">Collected</div></div>
        <div class="dd-summary-item"><div class="dd-summary-val" style="color:var(--red)">${fmtMoney(Math.max(0, exp - coll))}</div><div class="dd-summary-label">Outstanding</div></div>
        <div class="dd-summary-item"><div class="dd-summary-val">${exp > 0 ? Math.round(coll/exp*100) : 0}%</div><div class="dd-summary-label">Rate</div></div>
      </div><div id="ddResultCount" class="dd-result-count"></div><div class="dd-unit-list">`;
      // Show units sorted by rent
      occ.sort((a, b) => b.rent - a.rent).forEach(r => {
        const collected = collectedInMonth(r, ty, tm);
        const expected = expectedInMonth(r, ty, tm);
        const pctPaid = expected > 0 ? Math.round(collected / expected * 100) : 0;
        const color = pctPaid >= 100 ? 'var(--green)' : pctPaid > 0 ? 'var(--orange)' : 'var(--red)';
        html += `<div class="dd-unit-item" onclick="openDashUnitDetail('${r.apt.replace(/'/g,"\\'")}')">
          <div class="dd-unit-left"><div class="dd-unit-tenant">${r.name}</div><div class="dd-unit-prop">${r.apt} — ${r.owner || ''}</div></div>
          <div class="dd-unit-right"><div class="dd-unit-amount" style="color:${color}">${fmtMoney(collected)} / ${fmtMoney(expected)}</div><div class="dd-unit-status" style="font-size:10px;color:${color}">${pctPaid}% paid</div></div>
        </div>`;
      });
      html += '</div>';
      break;
    }
    case 'dash_outstanding': {
      const active = dedupActive();
      const occ = active.filter(r => r.type !== 'available' && r.name && r.balance > 0).sort((a,b) => b.balance - a.balance);
      const totalBal = occ.reduce((s, r) => s + r.balance, 0);
      title.textContent = 'Outstanding — ' + occ.length + ' Units';
      html = `<div class="dd-summary">
        <div class="dd-summary-item"><div class="dd-summary-val" style="color:var(--red)">${fmtMoney(totalBal)}</div><div class="dd-summary-label">Total Outstanding</div></div>
        <div class="dd-summary-item"><div class="dd-summary-val">${occ.length}</div><div class="dd-summary-label">Units</div></div>
      </div><div id="ddResultCount" class="dd-result-count"></div><div class="dd-unit-list">`;
      occ.forEach(r => {
        const ds = dueStatus(r);
        const color = ds === 'overdue' ? 'var(--red)' : 'var(--orange)';
        html += `<div class="dd-unit-item" onclick="openDashUnitDetail('${r.apt.replace(/'/g,"\\'")}')">
          <div class="dd-unit-left"><div class="dd-unit-tenant">${r.name}</div><div class="dd-unit-prop">${r.apt}</div></div>
          <div class="dd-unit-right"><div class="dd-unit-amount" style="color:${color}">${fmtMoney(r.balance)}</div><div class="dd-unit-status"><span class="mtm-badge ${ds === 'overdue' ? 'overdue' : 'pending'}" style="font-size:9px">${ds}</span></div></div>
        </div>`;
      });
      html += '</div>';
      break;
    }
    case 'dash_available': {
      const active = dedupActive();
      const avail = active.filter(r => r.type === 'available' || !r.name);
      title.textContent = 'Available Units — ' + avail.length;
      html = `<div class="dd-summary">
        <div class="dd-summary-item"><div class="dd-summary-val" style="color:var(--blue)">${avail.length}</div><div class="dd-summary-label">Available</div></div>
      </div><div id="ddResultCount" class="dd-result-count"></div><div class="dd-unit-list">`;
      avail.forEach(r => {
        html += `<div class="dd-unit-item" onclick="openDashUnitDetail('${r.apt.replace(/'/g,"\\'")}')">
          <div class="dd-unit-left"><div class="dd-unit-tenant" style="color:var(--text3)">Vacant</div><div class="dd-unit-prop">${r.apt}${r.owner ? ' — ' + r.owner : ''}</div></div>
          <div class="dd-unit-right">${typeBadge(r.type)}</div>
        </div>`;
      });
      html += '</div>';
      break;
    }
    case 'dash_lease_type': {
      const active = dedupActive();
      const tc = {lt:[], mtm:[], sh:[], av:[]};
      active.forEach(r => {
        if (r.type === 'long-term') tc.lt.push(r);
        else if (r.type === 'month-to-month') tc.mtm.push(r);
        else if (r.type === 'short-stay') tc.sh.push(r);
        else tc.av.push(r);
      });
      title.textContent = 'Lease Type Breakdown';
      html = `<div class="dd-summary">
        <div class="dd-summary-item"><div class="dd-summary-val" style="color:#2563a8">${tc.lt.length}</div><div class="dd-summary-label">Long Term</div></div>
        <div class="dd-summary-item"><div class="dd-summary-val" style="color:#6b4ca8">${tc.mtm.length}</div><div class="dd-summary-label">Month-to-Month</div></div>
        <div class="dd-summary-item"><div class="dd-summary-val" style="color:#c0711a">${tc.sh.length}</div><div class="dd-summary-label">Short Stay</div></div>
        <div class="dd-summary-item"><div class="dd-summary-val" style="color:#2e7d52">${tc.av.length}</div><div class="dd-summary-label">Available</div></div>
      </div><div id="ddResultCount" class="dd-result-count"></div><div class="dd-unit-list">`;
      [['Long Term', tc.lt, '#2563a8'], ['Month-to-Month', tc.mtm, '#6b4ca8'], ['Short Stay', tc.sh, '#c0711a'], ['Available', tc.av, '#2e7d52']].forEach(([label, items, color]) => {
        if (items.length === 0) return;
        html += `<div class="dd-group-header" style="color:${color};border-bottom-color:${color}">${label} <span class="dd-group-count">${items.length}</span></div>`;
        items.forEach(r => {
          html += `<div class="dd-unit-item" onclick="openDashUnitDetail('${r.apt.replace(/'/g,"\\'")}')">
            <div class="dd-unit-left"><div class="dd-unit-tenant">${r.name || 'Vacant'}</div><div class="dd-unit-prop">${r.apt}</div></div>
            <div class="dd-unit-right"><div class="dd-unit-amount">${r.rent ? fmtMoney(r.rent) : '—'}</div></div>
          </div>`;
        });
      });
      html += '</div>';
      break;
    }
    case 'dash_owner': {
      const active = dedupActive();
      const occ = active.filter(r => r.type !== 'available' && r.name);
      const ownerMap = {};
      occ.forEach(r => { const o = r.owner || 'Unknown'; if (!ownerMap[o]) ownerMap[o] = []; ownerMap[o].push(r); });
      title.textContent = 'Portfolio by Owner';
      const owners = Object.entries(ownerMap).sort((a,b) => b[1].reduce((s,r)=>s+r.rent,0) - a[1].reduce((s,r)=>s+r.rent,0));
      html = `<div class="dd-summary">
        <div class="dd-summary-item"><div class="dd-summary-val">${owners.length}</div><div class="dd-summary-label">Owners</div></div>
        <div class="dd-summary-item"><div class="dd-summary-val">${occ.length}</div><div class="dd-summary-label">Units</div></div>
        <div class="dd-summary-item"><div class="dd-summary-val">${fmtMoney(occ.reduce((s,r)=>s+r.rent,0))}</div><div class="dd-summary-label">Total Rent</div></div>
      </div><div id="ddResultCount" class="dd-result-count"></div><div class="dd-unit-list">`;
      owners.forEach(([owner, units]) => {
        const totalRent = units.reduce((s,r) => s + r.rent, 0);
        html += `<div class="dd-group-header">${owner} <span class="dd-group-count">${units.length} units — ${fmtMoney(totalRent)}</span></div>`;
        units.forEach(r => {
          html += `<div class="dd-unit-item" onclick="openDashUnitDetail('${r.apt.replace(/'/g,"\\'")}')">
            <div class="dd-unit-left"><div class="dd-unit-tenant">${r.name}</div><div class="dd-unit-prop">${r.apt}</div></div>
            <div class="dd-unit-right"><div class="dd-unit-amount">${fmtMoney(r.rent)}</div><div class="dd-unit-status">${typeBadge(r.type)}</div></div>
          </div>`;
        });
      });
      html += '</div>';
      break;
    }
    case 'dash_urgency': {
      const active = dedupActive();
      const urgent = active.filter(r => dueStatus(r) === 'overdue' || dueStatus(r) === 'soon').sort((a,b) => (daysUntil(a.due)||0) - (daysUntil(b.due)||0));
      title.textContent = 'Needs Attention — ' + urgent.length;
      html = `<div class="dd-summary">
        <div class="dd-summary-item"><div class="dd-summary-val" style="color:var(--red)">${urgent.filter(r=>dueStatus(r)==='overdue').length}</div><div class="dd-summary-label">Overdue</div></div>
        <div class="dd-summary-item"><div class="dd-summary-val" style="color:var(--orange)">${urgent.filter(r=>dueStatus(r)==='soon').length}</div><div class="dd-summary-label">Due Soon</div></div>
      </div><div id="ddResultCount" class="dd-result-count"></div><div class="dd-unit-list">`;
      urgent.forEach(r => {
        const d = daysUntil(r.due);
        const ds = dueStatus(r);
        const color = ds === 'overdue' ? 'var(--red)' : 'var(--orange)';
        html += `<div class="dd-unit-item" onclick="openDashUnitDetail('${r.apt.replace(/'/g,"\\'")}')">
          <div class="dd-unit-left"><div class="dd-unit-tenant">${r.name}</div><div class="dd-unit-prop">${r.apt} — Due: ${fmtDate(r.due)}</div></div>
          <div class="dd-unit-right"><div class="dd-unit-amount" style="color:${color}">${d < 0 ? Math.abs(d) + 'd late' : 'in ' + d + 'd'}</div><div class="dd-unit-status"><span class="mtm-badge ${ds === 'overdue' ? 'overdue' : 'pending'}" style="font-size:9px">${ds}</span></div></div>
        </div>`;
      });
      html += '</div>';
      break;
    }
    default:
      title.textContent = 'Drill Down';
      html = '<div class="dd-empty">No data available</div>';
      showSearch = false;
  }

  body.innerHTML = html;
  filterBar.style.display = showSearch ? 'flex' : 'none';

  if (openPanel) {
    overlay.classList.add('open');
    panel.classList.add('open');
  }
}

// Helper: render rent items grouped by property
function _renderRentItems(items, amtField, color, badge) {
  const fmt = n => '$' + n.toLocaleString(undefined, {minimumFractionDigits:0, maximumFractionDigits:0});
  // Group by property
  const byProp = {};
  items.forEach(r => { if (!byProp[r.property]) byProp[r.property] = []; byProp[r.property].push(r); });
  let html = '';
  Object.keys(byProp).sort().forEach(prop => {
    html += `<div class="dd-group-header">${prop} <span class="dd-group-count">${byProp[prop].length}</span></div>`;
    byProp[prop].forEach(r => {
      const idx = INNAGO_RENT.indexOf(r);
      const amt = amtField === 'paid' ? r.paid : amtField === 'processing' ? r.processing : r.balance;
      html += `<div class="dd-unit-item" onclick="openInvoiceEditor(${idx})" title="View invoice">
        <div class="dd-unit-left"><div class="dd-unit-tenant">${r.tenants.split(',')[0]}</div><div class="dd-unit-prop">${r.unit}</div></div>
        <div class="dd-unit-right"><div class="dd-unit-amount" style="color:${color}">${fmt(amt)}</div><div class="dd-unit-status"><span class="mtm-badge ${r.status}" style="font-size:9px">${badge}</span></div></div>
      </div>`;
    });
  });
  return html;
}

// Helper for main dashboard unit detail (opens as a mini panel in the drill-down)
function openDashUnitDetail(apt) {
  const active = dedupActive();
  const unit = active.find(r => r.apt === apt);
  if (!unit) return;

  // Try to find matching INNAGO_RENT record
  const rentIdx = INNAGO_RENT.findIndex(r =>
    r.property.includes(apt.split(' ')[0]) || apt.includes(r.unit)
  );
  if (rentIdx >= 0) {
    openInvoiceEditor(rentIdx);
    return;
  }

  // Show unit detail in drill-down body
  const fmt = n => '$' + n.toLocaleString(undefined, {minimumFractionDigits:0, maximumFractionDigits:0});
  const body = document.getElementById('ddBody');
  panelPush({ type: 'drilldown', label: unit.apt, icon: '🏠', data: { category: 'unit_detail_' + apt } });

  body.innerHTML = `
    <div class="inv-header-block">
      <div class="inv-header-left">
        <div class="inv-header-label">Unit</div>
        <div class="inv-header-num">${unit.apt}</div>
        <div class="inv-header-prop">${unit.owner || ''}</div>
      </div>
      <div class="inv-header-right">
        ${typeBadge(unit.type)}
        <div class="inv-header-dates" style="margin-top:6px">Rent: <span>${unit.rent ? fmtMoney(unit.rent) : '—'}</span></div>
      </div>
    </div>
    <div class="inv-tenant-section">
      <div class="inv-tenant-row"><span class="inv-tenant-label">Tenant</span><span class="inv-tenant-val">${unit.name || 'Vacant'}</span></div>
      <div class="inv-tenant-row"><span class="inv-tenant-label">Type</span><span class="inv-tenant-val">${unit.type || '—'}</span></div>
      <div class="inv-tenant-row"><span class="inv-tenant-label">Balance</span><span class="inv-tenant-val" style="color:${unit.balance > 0 ? 'var(--red)' : 'var(--green)'}">${unit.balance > 0 ? fmtMoney(unit.balance) : '$0'}</span></div>
      ${unit.due ? `<div class="inv-tenant-row"><span class="inv-tenant-label">Due</span><span class="inv-tenant-val">${fmtDate(unit.due)}</span></div>` : ''}
      ${unit.lease_end ? `<div class="inv-tenant-row"><span class="inv-tenant-label">Lease End</span><span class="inv-tenant-val">${fmtDate(unit.lease_end)}</span></div>` : ''}
    </div>
    <div style="margin-top:16px;padding-top:16px;border-top:1px solid var(--border-color,#ddd8ce)">
      <button class="action-btn" style="width:100%;justify-content:center;padding:10px;font-weight:600" onclick="goToFTPropertyDetail('${unit.apt.replace(/'/g,"\\'")}')">🔧 Service History & Appliances</button>
    </div>
  `;
  renderBreadcrumbs();
}

// Navigate to FieldTrack property detail from PropDesk unit view
function goToFTPropertyDetail(apt) {
  // Close any open detail overlays
  var overlay = document.getElementById('detailOverlay');
  if (overlay) overlay.classList.remove('open');

  function _navigateAfterInit(targetPage, propId) {
    // If FT_init is still loading, wait for it; otherwise go directly
    var p = (typeof FT_initPromise !== 'undefined' && FT_initPromise) ? FT_initPromise : Promise.resolve();
    p.then(function(){
      if (propId && typeof openPropDetail === 'function') {
        openPropDetail(propId);
      } else if (typeof FT_showPage === 'function') {
        FT_showPage(targetPage);
      }
    });
  }

  // Switch to techtrack module first (this triggers FT_init on first visit)
  switchModule('techtrack');

  // FT_state may not be loaded yet if this is the first visit — wait for init
  if (typeof FT_initPromise !== 'undefined' && FT_initPromise) {
    FT_initPromise.then(function(){
      var ftProp = FT_state.properties.find(function(p){ return p.pdApt === apt; });
      if (!ftProp) ftProp = FT_state.properties.find(function(p){ return p.unit === apt || p.name.indexOf(apt) !== -1; });
      if (ftProp) {
        openPropDetail(ftProp.id);
      } else {
        if (confirm('No linked service property found for unit ' + apt + '. Go to TechTrack Properties to create one?')) {
          FT_showPage('properties');
        }
      }
    });
  } else {
    // FT was already loaded — find and navigate
    if (typeof FT_state !== 'undefined' && FT_state.properties) {
      var ftProp = FT_state.properties.find(function(p){ return p.pdApt === apt; });
      if (!ftProp) ftProp = FT_state.properties.find(function(p){ return p.unit === apt || p.name.indexOf(apt) !== -1; });
      if (ftProp) {
        setTimeout(function(){ openPropDetail(ftProp.id); }, 100);
      } else {
        if (confirm('No linked service property found for unit ' + apt + '. Go to TechTrack Properties to create one?')) {
          FT_showPage('properties');
        }
      }
    }
  }
}

// Helper for tenant detail from MTM drill-down occupancy
function openTenantFromDD(name, property, unit, rent, since) {
  const body = document.getElementById('ddBody');
  panelPush({ type: 'drilldown', label: name.split(',')[0], icon: '👤', data: { category: 'tenant_detail' } });
  const fmt = n => '$' + n.toLocaleString(undefined, {minimumFractionDigits:0, maximumFractionDigits:0});

  body.innerHTML = `
    <div class="inv-header-block">
      <div class="inv-header-left">
        <div class="inv-header-label">Tenant</div>
        <div class="inv-header-num">${name}</div>
        <div class="inv-header-prop">${property} | ${unit}</div>
      </div>
      <div class="inv-header-right">
        <span class="inv-status-badge paid">Active</span>
      </div>
    </div>
    <div class="inv-tenant-section">
      <div class="inv-tenant-row"><span class="inv-tenant-label">Rent</span><span class="inv-tenant-val" style="color:var(--green)">${fmt(rent)}</span></div>
      <div class="inv-tenant-row"><span class="inv-tenant-label">Since</span><span class="inv-tenant-val">${since}</span></div>
      <div class="inv-tenant-row"><span class="inv-tenant-label">Property</span><span class="inv-tenant-val">${property}</span></div>
      <div class="inv-tenant-row"><span class="inv-tenant-label">Unit</span><span class="inv-tenant-val">${unit}</span></div>
    </div>
  `;
  renderBreadcrumbs();
}

function renderLeaseDrillDown(leases) {
  let html = `<div class="dd-summary">
    <div class="dd-summary-item"><div class="dd-summary-val">${leases.length}</div><div class="dd-summary-label">Leases</div></div>
    <div class="dd-summary-item"><div class="dd-summary-val">${leases.filter(l=>l.type==='fixed').length}</div><div class="dd-summary-label">Fixed Term</div></div>
    <div class="dd-summary-item"><div class="dd-summary-val">${leases.filter(l=>l.type==='mtm').length}</div><div class="dd-summary-label">Month-to-Month</div></div>
  </div><div class="dd-unit-list">`;
  html += leases.map(l => {
    const origIdx = INNAGO_LEASES.indexOf(l);
    const typeBadge = l.type === 'mtm' ? '<span class="mtm-badge mtm" style="font-size:9px">M-to-M</span>' : '<span class="mtm-badge fixed" style="font-size:9px">Fixed</span>';
    return `<div class="dd-lease-item" onclick="closeDrillDown();openLeaseDetail(${origIdx})" title="View lease details">
      <div class="dd-lease-left"><div class="dd-lease-tenant">${l.tenants}</div><div class="dd-lease-prop">${l.property} | ${l.unit}</div></div>
      <div class="dd-lease-right"><div class="dd-lease-dates">${l.start} — ${l.end}</div><div class="dd-lease-type">${typeBadge}</div></div>
    </div>`;
  }).join('');
  html += '</div>';
  return html;
}

function closeDrillDown() {
  panelCloseAll();
}

// ── Invoice Editor (Enhanced with Full Inline Editing) ──
let currentInvoiceMode = 'view';
let currentInvoiceIdx = null;
// Line items stored per invoice for editing
const invoiceLineItems = {};

function openInvoiceEditor(rentIdx) {
  const r = INNAGO_RENT[rentIdx];
  if (!r) return;

  currentInvoiceIdx = rentIdx;
  currentInvoiceMode = 'view';

  // Initialize line items if not exist
  if (!invoiceLineItems[rentIdx]) {
    invoiceLineItems[rentIdx] = [
      { item: 'Rent', description: 'Monthly rent', qty: 1, rate: r.amount, amount: r.amount }
    ];
  }

  // Push to breadcrumb stack
  panelPush({
    type: 'invoice',
    label: r.unit + ' — ' + r.tenants.split(',')[0].trim().split(' ')[0],
    icon: '📄',
    data: { rentIdx }
  });

  _renderInvoiceContent(rentIdx, true);
}

function _renderInvoiceContent(rentIdx, openPanel) {
  const r = INNAGO_RENT[rentIdx];
  if (!r) return;

  const overlay = document.getElementById('invOverlay');
  const panel = document.getElementById('invPanel');
  const title = document.getElementById('invTitle');
  const body = document.getElementById('invBody');
  const modeBar = document.getElementById('invModeBar');
  const fmt = n => '$' + n.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2});

  title.textContent = 'Invoice';
  if (modeBar) modeBar.style.display = 'flex';

  const statusMap = {
    paid: 'paid', overdue: 'late', processing: 'processing', pending: 'pending', partial: 'partial'
  };
  const statusClass = statusMap[r.status] || 'pending';
  const statusLabel = r.status === 'overdue' ? 'Late' : r.status.charAt(0).toUpperCase() + r.status.slice(1);

  const now = new Date();
  const dueDate = new Date(now.getFullYear(), now.getMonth(), 1);
  const dueDateStr = dueDate.toLocaleDateString('en-US', {month:'short', day:'numeric', year:'numeric'});
  const dueDateInput = dueDate.toISOString().split('T')[0];
  const invNum = String(10905800 + rentIdx);
  const daysLate = r.status === 'overdue' ? Math.ceil((now - dueDate) / (1000*60*60*24)) : 0;

  const tenant = INNAGO_TENANTS.find(t => r.tenants.includes(t.name.split(',')[0].trim().split(' ')[0]));
  const tenantEmail = tenant ? tenant.email || '' : '';
  const tenantPhone = tenant ? tenant.phone || '' : '';

  const lines = invoiceLineItems[rentIdx] || [{ item: 'Rent', description: 'Monthly rent', qty: 1, rate: r.amount, amount: r.amount }];

  body.innerHTML = `
    <!-- Invoice Header -->
    <div class="inv-header-block">
      <div class="inv-header-left">
        <div class="inv-header-label">Invoice</div>
        <div class="inv-header-num" id="invNumDisplay">${invNum}</div>
        <div class="inv-header-prop" id="invPropDisplay">${r.property} | ${r.unit}</div>
      </div>
      <div class="inv-header-right">
        <span class="inv-status-badge ${statusClass}" id="invStatusBadge">${statusLabel}</span>
        <div class="inv-header-dates">Due: <span id="invDueDateDisplay">${dueDateStr}</span></div>
        ${daysLate > 0 ? `<div class="inv-header-dates" style="color:var(--red)">${daysLate} day${daysLate > 1 ? 's' : ''} late</div>` : ''}
        <div class="inv-header-reminders">0 reminder(s) sent</div>
      </div>
    </div>

    <!-- Action Buttons Row -->
    <div class="inv-actions-row">
      <button class="inv-action-btn" onclick="invoiceAction('download',${rentIdx})">Download</button>
      <button class="inv-action-btn" onclick="invoiceAction('send_reminder',${rentIdx})">Remind</button>
      <button class="inv-action-btn primary" onclick="invoiceAction('record_payment',${rentIdx})">Record Payment</button>
      <button class="inv-action-btn danger" onclick="invoiceAction('void',${rentIdx})">Delete</button>
    </div>

    <!-- Tenant Info Section (editable in edit mode) -->
    <div class="inv-tenant-section" id="invTenantSection">
      <div class="inv-tenant-row">
        <span class="inv-tenant-label">Tenant</span>
        <span class="inv-tenant-val inv-field-display">${r.tenants}</span>
        <input class="inv-field-edit" style="flex:1;padding:6px 10px;border:1px solid var(--border);border-radius:4px;font-family:'DM Mono',monospace;font-size:12px;" id="invEditTenant" value="${r.tenants}">
      </div>
      <div class="inv-tenant-row">
        <span class="inv-tenant-label">Property</span>
        <span class="inv-tenant-val inv-field-display">${r.property}</span>
        <input class="inv-field-edit" style="flex:1;padding:6px 10px;border:1px solid var(--border);border-radius:4px;font-family:'DM Mono',monospace;font-size:12px;" id="invEditProperty" value="${r.property}">
      </div>
      <div class="inv-tenant-row">
        <span class="inv-tenant-label">Unit</span>
        <span class="inv-tenant-val inv-field-display">${r.unit}</span>
        <input class="inv-field-edit" style="flex:1;padding:6px 10px;border:1px solid var(--border);border-radius:4px;font-family:'DM Mono',monospace;font-size:12px;" id="invEditUnit" value="${r.unit}">
      </div>
      ${tenantEmail ? `<div class="inv-tenant-row">
        <span class="inv-tenant-label">Email</span>
        <span class="inv-tenant-val inv-field-display">${tenantEmail}</span>
        <input class="inv-field-edit" style="flex:1;padding:6px 10px;border:1px solid var(--border);border-radius:4px;font-family:'DM Mono',monospace;font-size:12px;" id="invEditEmail" value="${tenantEmail}">
      </div>` : ''}
      ${tenantPhone ? `<div class="inv-tenant-row">
        <span class="inv-tenant-label">Phone</span>
        <span class="inv-tenant-val inv-field-display">${tenantPhone}</span>
        <input class="inv-field-edit" style="flex:1;padding:6px 10px;border:1px solid var(--border);border-radius:4px;font-family:'DM Mono',monospace;font-size:12px;" id="invEditPhone" value="${tenantPhone}">
      </div>` : ''}
    </div>

    <!-- Info Row: Subject / Due / Status -->
    <div class="inv-info-row">
      <div class="inv-info-col">
        <div class="inv-info-label">Subject</div>
        <div class="inv-info-val inv-field-display">Rent due on ${dueDateStr}</div>
        <input class="inv-field-edit" style="padding:6px 10px;border:1px solid var(--border);border-radius:4px;font-family:'DM Mono',monospace;font-size:12px;" id="invEditSubject" value="Rent due on ${dueDateStr}">
      </div>
      <div class="inv-info-col">
        <div class="inv-info-label">Due Date</div>
        <div class="inv-info-val inv-field-display">${dueDateStr}</div>
        <input class="inv-field-edit" type="date" style="padding:6px 10px;border:1px solid var(--border);border-radius:4px;font-family:'DM Mono',monospace;font-size:12px;" id="invEditDue" value="${dueDateInput}">
      </div>
      <div class="inv-info-col">
        <div class="inv-info-label">Status</div>
        <div class="inv-info-val inv-field-display"><span class="inv-status-badge ${statusClass}" style="font-size:10px;padding:3px 10px;">${statusLabel}</span></div>
        <select class="inv-field-edit" style="padding:6px 10px;border:1px solid var(--border);border-radius:4px;font-family:'DM Mono',monospace;font-size:12px;" id="invEditStatus">
          <option value="paid" ${r.status==='paid'?'selected':''}>Paid</option>
          <option value="pending" ${r.status==='pending'?'selected':''}>Pending</option>
          <option value="processing" ${r.status==='processing'?'selected':''}>Processing</option>
          <option value="overdue" ${r.status==='overdue'?'selected':''}>Overdue</option>
          <option value="partial" ${r.status==='partial'?'selected':''}>Partial</option>
        </select>
      </div>
    </div>

    <!-- Line Items Table (editable) -->
    <div class="inv-table-wrap">
      <table class="inv-table" id="invLineTable">
        <thead>
          <tr>
            <th>Item</th>
            <th>Description</th>
            <th style="width:50px">Qty</th>
            <th style="width:90px">Rate</th>
            <th style="width:90px;text-align:right">Amount</th>
            <th class="inv-field-edit" style="width:30px"></th>
          </tr>
        </thead>
        <tbody id="invLineBody">
          ${lines.map((line, li) => `<tr data-line="${li}">
            <td><span class="inv-field-display">${line.item}</span><input class="inv-field-edit inv-cell-edit" value="${line.item}" oninput="updateLineItem(${rentIdx},${li},'item',this.value)"></td>
            <td><span class="inv-field-display">${line.description}</span><input class="inv-field-edit inv-cell-edit" value="${line.description}" oninput="updateLineItem(${rentIdx},${li},'description',this.value)"></td>
            <td><span class="inv-field-display">${line.qty}</span><input class="inv-field-edit inv-cell-edit" type="number" min="1" value="${line.qty}" style="width:50px" oninput="updateLineItem(${rentIdx},${li},'qty',this.value)"></td>
            <td><span class="inv-field-display">${fmt(line.rate)}</span><input class="inv-field-edit inv-cell-edit" type="number" step="0.01" value="${line.rate}" style="width:80px" oninput="updateLineItem(${rentIdx},${li},'rate',this.value)"></td>
            <td style="text-align:right"><span id="lineAmt${li}">${fmt(line.qty * line.rate)}</span></td>
            <td class="inv-field-edit"><button class="inv-remove-line" onclick="removeLine(${rentIdx},${li})">×</button></td>
          </tr>`).join('')}
        </tbody>
      </table>
      <button class="inv-add-line-btn inv-field-edit" onclick="addLineItem(${rentIdx})">+ Add Line Item</button>
    </div>

    <!-- Totals -->
    <div class="inv-totals">
      <div class="inv-total-row"><span class="inv-total-label">Total Due:</span><span class="inv-total-val" id="invTotalDue">${fmt(r.amount)}</span></div>
      <div class="inv-total-row"><span class="inv-total-label">Total Paid:</span><span class="inv-total-val" style="color:var(--green)">${fmt(r.paid)}</span></div>
      ${r.processing > 0 ? `<div class="inv-total-row"><span class="inv-total-label">Processing:</span><span class="inv-total-val" style="color:var(--orange)">${fmt(r.processing)}</span></div>` : ''}
      <div class="inv-total-row balance ${r.balance <= 0 ? 'paid' : ''}"><span class="inv-total-label">Balance:</span><span class="inv-total-val" id="invBalanceVal">${fmt(r.balance)}</span></div>
    </div>

    <!-- Payments Received -->
    <div class="inv-payments-section">
      <div class="inv-section-title">Payments Received <span class="inv-section-count">${r.paid > 0 || r.processing > 0 ? (r.paid > 0 ? 1 : 0) + (r.processing > 0 ? 1 : 0) : 0}</span></div>
      ${r.paid <= 0 && r.processing <= 0 ? `<div class="inv-payments-empty">No Payments Received</div>` : ''}
      ${r.paid > 0 ? `<div class="inv-payment-item">
        <div class="inv-payment-left">
          <div class="inv-payment-method">ACH Transfer</div>
          <div class="inv-payment-date">Submitted Apr 1, 2026 &middot; Deposited Apr 2, 2026</div>
        </div>
        <div class="inv-payment-amt">${fmt(r.paid)}</div>
      </div>` : ''}
      ${r.processing > 0 ? `<div class="inv-payment-item">
        <div class="inv-payment-left">
          <div class="inv-payment-method">ACH Transfer <span class="mtm-badge processing" style="font-size:9px;margin-left:6px">Processing</span></div>
          <div class="inv-payment-date">Submitted Apr 2, 2026</div>
        </div>
        <div class="inv-payment-amt" style="color:var(--orange)">${fmt(r.processing)}</div>
      </div>` : ''}
    </div>

    <!-- Bank Account -->
    <div class="inv-bank-row">
      Bank Account: <span class="inv-bank-name">Elkins Park LLC</span>
    </div>

    <!-- Notes Section -->
    <div class="inv-edit-section">
      <div class="inv-section-title">Notes / Memo</div>
      <textarea id="invEditNotes" style="width:100%;min-height:60px;padding:10px;border:1px solid var(--border);border-radius:var(--radius);font-family:'DM Mono',monospace;font-size:12px;resize:vertical;background:white;color:var(--text);" placeholder="Add a note to this invoice..."></textarea>
    </div>

    <!-- Service / Maintenance Link -->
    <div style="margin-top:16px;padding-top:16px;border-top:1px solid var(--border-color,#ddd8ce)">
      <button class="action-btn" style="width:100%;justify-content:center;padding:12px;font-weight:600;font-size:14px;border-radius:10px;background:linear-gradient(135deg,rgba(79,196,207,.1),rgba(124,58,237,.08));border:1px solid rgba(79,196,207,.25)" onclick="goToFTPropertyDetail('${(r.unit||r.apt||'').replace(/'/g,"\\'")}')">🔧 Service History & Appliances</button>
    </div>
  `;

  // Apply current mode
  setInvoiceMode(currentInvoiceMode);

  if (openPanel) {
    overlay.classList.add('open');
    panel.classList.add('open');
  }
  renderBreadcrumbs();
}

function setInvoiceMode(mode) {
  currentInvoiceMode = mode;
  const panel = document.getElementById('invPanel');
  const viewBtn = document.getElementById('invViewBtn');
  const editBtn = document.getElementById('invEditBtn');
  const saveBar = document.getElementById('invSaveBar');

  if (!panel) return;

  if (mode === 'edit') {
    panel.classList.add('inv-edit-mode');
    if (viewBtn) viewBtn.classList.remove('active');
    if (editBtn) editBtn.classList.add('active');
    if (saveBar) saveBar.style.display = 'flex';
    // Show table edit controls
    const table = document.getElementById('invLineTable');
    if (table) table.classList.add('editing');
  } else {
    panel.classList.remove('inv-edit-mode');
    if (viewBtn) viewBtn.classList.add('active');
    if (editBtn) editBtn.classList.remove('active');
    if (saveBar) saveBar.style.display = 'none';
    const table = document.getElementById('invLineTable');
    if (table) table.classList.remove('editing');
  }
}

function updateLineItem(rentIdx, lineIdx, field, value) {
  const lines = invoiceLineItems[rentIdx];
  if (!lines || !lines[lineIdx]) return;
  if (field === 'qty' || field === 'rate') {
    lines[lineIdx][field] = parseFloat(value) || 0;
    lines[lineIdx].amount = lines[lineIdx].qty * lines[lineIdx].rate;
    // Update amount display
    const amtEl = document.getElementById('lineAmt' + lineIdx);
    if (amtEl) amtEl.textContent = '$' + lines[lineIdx].amount.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2});
    // Update total
    const total = lines.reduce((s, l) => s + (l.qty * l.rate), 0);
    const totalEl = document.getElementById('invTotalDue');
    if (totalEl) totalEl.textContent = '$' + total.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2});
  } else {
    lines[lineIdx][field] = value;
  }
}

function addLineItem(rentIdx) {
  if (!invoiceLineItems[rentIdx]) invoiceLineItems[rentIdx] = [];
  invoiceLineItems[rentIdx].push({ item: '', description: '', qty: 1, rate: 0, amount: 0 });
  _renderInvoiceContent(rentIdx, false);
  setInvoiceMode('edit');
}

function removeLine(rentIdx, lineIdx) {
  const lines = invoiceLineItems[rentIdx];
  if (!lines || lines.length <= 1) return; // Keep at least one line
  lines.splice(lineIdx, 1);
  _renderInvoiceContent(rentIdx, false);
  setInvoiceMode('edit');
}

function saveInvoiceChanges() {
  const rentIdx = currentInvoiceIdx;
  if (rentIdx === null) return;
  const r = INNAGO_RENT[rentIdx];
  if (!r) return;

  // Save all editable fields
  const tenantVal = document.getElementById('invEditTenant')?.value;
  const propVal = document.getElementById('invEditProperty')?.value;
  const unitVal = document.getElementById('invEditUnit')?.value;
  const statusVal = document.getElementById('invEditStatus')?.value;
  const dueVal = document.getElementById('invEditDue')?.value;

  if (tenantVal) r.tenants = tenantVal;
  if (propVal) r.property = propVal;
  if (unitVal) r.unit = unitVal;
  if (statusVal) r.status = statusVal;

  // Recalculate amount from line items
  const lines = invoiceLineItems[rentIdx];
  if (lines) {
    r.amount = lines.reduce((s, l) => s + (l.qty * l.rate), 0);
  }
  r.balance = Math.max(0, r.amount - r.paid - r.processing);
  if (r.balance <= 0 && r.processing <= 0) r.status = 'paid';

  // Refresh everything
  setInvoiceMode('view');
  _renderInvoiceContent(rentIdx, false);
  renderMTMDashboard();
  setTimeout(() => renderMTMDashboardInteractive(), 50);

  alert('Invoice updated successfully.');
}

function invoiceAction(action, rentIdx) {
  const r = INNAGO_RENT[rentIdx];
  if (!r) return;
  const fmt = n => '$' + n.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2});

  switch(action) {
    case 'record_payment': {
      const amt = prompt('Record Payment\n\nUnit: ' + r.unit + ' at ' + r.property + '\nBalance: ' + fmt(r.balance) + '\n\nEnter payment amount:', r.balance.toFixed(2));
      if (amt && !isNaN(parseFloat(amt))) {
        const payment = parseFloat(amt);
        r.paid += payment;
        r.balance = Math.max(0, r.amount - r.paid - r.processing);
        if (r.balance <= 0 && r.processing <= 0) r.status = 'paid';
        else if (r.balance <= 0) r.status = 'processing';
        else r.status = 'partial';
        _renderInvoiceContent(rentIdx, false);
        renderMTMDashboard();
        setTimeout(() => renderMTMDashboardInteractive(), 50);
        alert('Payment of ' + fmt(payment) + ' recorded successfully.');
      }
      break;
    }
    case 'send_reminder': {
      // Find tenant contact info from INNAGO_TENANTS if available
      const tName = (r.tenants||'').split(',')[0].trim();
      const tenant = (typeof INNAGO_TENANTS!=='undefined' ? INNAGO_TENANTS : []).find(t => t.name === tName);
      if(tenant && (tenant.phone || tenant.email)){
        if(confirm('Send rent reminder to '+r.tenants+'?\nUnit: '+r.unit+'\nBalance: '+fmt(r.balance))){
          WPA_sendRentReminder({phone:tenant.phone,email:tenant.email,preferredComm:tenant.preferredComm||'sms',unit:r.unit}, r.balance, r.dueDate||'the 1st');
        }
      } else {
        alert('Send Payment Reminder\n\nTo: ' + r.tenants + '\nUnit: ' + r.unit + '\nBalance: ' + fmt(r.balance) + '\n\nNo contact info found for this tenant. Add phone/email to tenant profile to enable automatic reminders.');
      }
      break;
    }
    case 'save': {
      saveInvoiceChanges();
      break;
    }
    case 'download':
      alert('Download Invoice PDF\n\nInvoice for ' + r.unit + ' at ' + r.property + ' would be downloaded as a PDF.');
      break;
    case 'void':
      if (confirm('Void this invoice?\n\nThis will zero out all amounts for ' + r.unit + ' at ' + r.property + '.')) {
        r.paid = 0; r.processing = 0; r.balance = 0; r.amount = 0; r.status = 'paid';
        _renderInvoiceContent(rentIdx, false);
        renderMTMDashboard();
        setTimeout(() => renderMTMDashboardInteractive(), 50);
      }
      break;
    case 'add_late_fee': {
      const fee = prompt('Add Late Fee\n\nCurrent balance: ' + fmt(r.balance) + '\n\nEnter late fee amount:', '50.00');
      if (fee && !isNaN(parseFloat(fee))) {
        const feeAmt = parseFloat(fee);
        r.amount += feeAmt;
        r.balance += feeAmt;
        if (r.status === 'paid') r.status = 'pending';
        // Also add a line item for the fee
        if (invoiceLineItems[rentIdx]) {
          invoiceLineItems[rentIdx].push({ item: 'Late Fee', description: 'Late payment fee', qty: 1, rate: feeAmt, amount: feeAmt });
        }
        _renderInvoiceContent(rentIdx, false);
        renderMTMDashboard();
        setTimeout(() => renderMTMDashboardInteractive(), 50);
        alert('Late fee of ' + fmt(feeAmt) + ' added.');
      }
      break;
    }
  }
}

function closeInvoiceEditor() {
  panelBack();
}

// Legacy showPage function (kept for any direct calls)
function showPage(p,el){
  document.querySelectorAll('.page').forEach(x=>x.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(x=>x.classList.remove('active'));
  document.getElementById('page-'+p).classList.add('active');
  if(el) el.classList.add('active');
  if(p==='dashboard'){renderDashboard().catch(e=>console.error('Dashboard render error:',e));checkBackupStatus();}
  if(p==='reports')renderReports();
  if(p==='history')renderHistory();
  if(p==='calendar')renderCalendar();
  if(p==='messages'){renderInbox();startPlatformAutoSync();}
  if(p==='pipeline')renderPipeline();
  if(p==='settings'){}
  if(p==='properties')renderProperties();
}

// ══════════════════════════════════════════════════════
//  PROPERTIES PAGE
// ══════════════════════════════════════════════════════

let propertiesData = [];  // cached from Supabase

async function loadProperties() {
  try {
    const { data: rows, error } = await sb
      .from('properties')
      .select('*')
      .order('name', { ascending: true });
    if (error) throw error;

    // Also load public names and photos from property_settings
    const { data: settings } = await sb
      .from('property_settings')
      .select('apt, descriptions, photos');
    const settingsMap = {};
    const photosMap = {};
    (settings||[]).forEach(s => {
      if(s.descriptions?.name) settingsMap[s.apt] = s.descriptions.name;
      if(s.photos?.length) photosMap[s.apt] = s.photos[0].url;
    });

    propertiesData = (rows || []).map(p => ({
      ...p,
      public_name: settingsMap[p.apt] || null,
      photo_url:   photosMap[p.apt]   || p.photo_url || null
    }));
  } catch(e) {
    console.error('loadProperties error:', e.message, e);
    // Fallback: derive property list from the units table (active, unique apts)
    propertiesData = data
      .filter(r => !r.archived)
      .map(r => ({
        apt: r.apt,
        name: r.apt,
        address: '',
        city: '',
        owner: r.owner || '',
        bedrooms: null,
        bathrooms: null,
        max_guests: null,
        status: r.type === 'available' ? 'Inactive' : 'Active',
        photo_url: null,
        hostfully_uid: null,
        tags: []
      }));
  }
  // Enrich with unit type from units data
  propertiesData = propertiesData.map(p => {
    const linkedUnit = data.find(u => !u.archived && u.apt === p.internal_apt);
    return { ...p, unit_type: linkedUnit ? linkedUnit.type : null };
  });
  populatePropOwnerFilter();
}

function populatePropOwnerFilter() {
  const sel = document.getElementById('propOwnerFilter');
  if (!sel) return; // safe to call during boot before Properties tab is rendered
  const owners = [...new Set(propertiesData.map(p => p.owner).filter(Boolean))].sort();
  // keep first "All Owners" option
  sel.innerHTML = '<option value="">All Owners</option>' +
    owners.map(o => `<option value="${o}">${o}</option>`).join('');
}

function filterProperties() {
  const search  = (document.getElementById('propSearch')?.value || '').toLowerCase();
  const status  = document.getElementById('propStatusFilter')?.value || '';
  const owner   = document.getElementById('propOwnerFilter')?.value || '';
  const typeFilter = document.getElementById('propTypeFilter')?.value || '';

  const filtered = propertiesData.filter(p => {
    const matchSearch = !search ||
      (p.name||'').toLowerCase().includes(search) ||
      (p.address||'').toLowerCase().includes(search) ||
      (p.apt||'').toLowerCase().includes(search) ||
      (p.hostfully_uid||'').toLowerCase().includes(search);
    const matchStatus = !status || p.status === status;
    const matchOwner  = !owner  || p.owner === owner;

    // Type filter: match against units table type via internal_apt
    let matchType = true;
    if (typeFilter === 'short-stay') {
      // Only show properties that have a hostfully_uid (short-stay) OR are linked to a short-stay unit
      const linkedUnit = data.find(u => !u.archived && u.apt === p.internal_apt);
      matchType = p.hostfully_uid || (linkedUnit && linkedUnit.type === 'short-stay');
    } else if (typeFilter === 'long-term') {
      const linkedUnit = data.find(u => !u.archived && u.apt === p.internal_apt);
      matchType = linkedUnit && linkedUnit.type === 'long-term';
    } else if (typeFilter === 'month-to-month') {
      const linkedUnit = data.find(u => !u.archived && u.apt === p.internal_apt);
      matchType = linkedUnit && linkedUnit.type === 'month-to-month';
    }

    return matchSearch && matchStatus && matchOwner && matchType;
  });

  renderPropertyList(filtered);
}

function renderProperties() {
  if (propertiesData.length === 0) {
    loadProperties().then(() => filterProperties());
  } else {
    filterProperties();
  }
}

function renderPropertyList(props) {
  const list    = document.getElementById('propList');
  const empty   = document.getElementById('propEmpty');
  const showing = document.getElementById('propShowing');
  const badge   = document.getElementById('propCountBadge');

  badge.textContent = propertiesData.length + ' properties';
  showing.textContent = `Showing ${props.length} out of ${propertiesData.length} properties`;

  if (props.length === 0) {
    list.innerHTML = '';
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  list.innerHTML = props.map(p => {
    const statusCls = p.status === 'Active' ? 'prop-status-active' : 'prop-status-inactive';
    const beds  = p.bedrooms  != null ? p.bedrooms  + ' bedroom'  + (p.bedrooms  !== 1 ? 's' : '') : null;
    const baths = p.bathrooms != null ? p.bathrooms + ' bathroom' + (p.bathrooms !== 1 ? 's' : '') : null;
    const guests= p.max_guests!= null ? p.max_guests + ' guest'   + (p.max_guests !== 1 ? 's' : '') : null;
    const metaParts = [guests, beds, baths].filter(Boolean);
    const publicName = p.public_name || null;
    const thumbHtml = p.photo_url
      ? `<img src="${p.photo_url}" alt="${p.name}" loading="lazy" onerror="this.style.display='none';this.parentNode.innerHTML='<span class=\"prop-thumb-icon\">🏠</span>'">`
      : `<span class="prop-thumb-icon">🏠</span>`;
    const rawAddr = typeof p.address === 'object' && p.address
      ? (p.address.street || p.address.address1 || p.address.line1 || '')
      : (p.address || '');
    const addrLine = [rawAddr, p.city, p.state].filter(Boolean).join(', ');
    const settingsHref = p.property_uid ? `property-settings.html?uid=${p.property_uid}` : `property-settings.html?apt=${encodeURIComponent(p.apt || p.name)}`;

    return `<div class="prop-row" onclick="window.location='${settingsHref}'">
      <div class="prop-thumb">${thumbHtml}</div>
      <div class="prop-info">
        <div class="prop-name">${p.name || p.apt || '—'}</div>
        ${publicName ? `<div style="font-size:12px;color:var(--accent2);font-weight:500;margin-bottom:3px;">${publicName}</div>` : `${addrLine ? `<div class="prop-address">${addrLine}</div>` : ''}`}
        ${publicName && addrLine ? `<div class="prop-address">${addrLine}</div>` : ''}
        ${metaParts.length ? `<div class="prop-meta">${metaParts.map(m=>`<span class="prop-meta-item">⬩ ${m}</span>`).join('')}</div>` : ''}
        <div class="prop-tags">
          ${(p.tags||[]).map(t=>`<span class="prop-tag">${t}</span>`).join('')}
          <span class="prop-tag prop-tag-add">Add tag…</span>
        </div>
      </div>
      <div class="prop-mid">
        ${p.owner ? `<span class="prop-owner-badge">${p.owner}</span>` : ''}
      </div>
      <div class="prop-actions" onclick="event.stopPropagation()">
        <span class="prop-status-badge ${statusCls}">${p.status || 'Active'}</span>
        <a href="${settingsHref}" class="prop-gear" title="Property Settings">⚙</a>
        <button class="prop-gear" title="Edit" onclick="openEditPropertyModal('${p.apt || p.name}')">✏</button>
      </div>
    </div>`;
  }).join('');
}

function openAddPropertyModal() {
  document.getElementById('addPropModalTitle').textContent = '＋ Add Property';
  document.getElementById('propEditApt').value = '';
  ['propFormName','propFormAddress','propFormCity','propFormHostfullyUid','propFormApt'].forEach(id => {
    document.getElementById(id).value = '';
  });
  document.getElementById('propFormBeds').value = '';
  document.getElementById('propFormBaths').value = '';
  document.getElementById('propFormGuests').value = '';
  document.getElementById('propFormOwner').value = '';
  document.getElementById('propFormStatus').value = 'Active';
  openModal('addPropertyModal');
}

function openEditPropertyModal(apt) {
  const p = propertiesData.find(x => (x.apt||x.name) === apt);
  if (!p) return;
  document.getElementById('addPropModalTitle').textContent = '✏ Edit Property';
  document.getElementById('propEditApt').value = p.apt || p.name;
  document.getElementById('propFormName').value = p.name || '';
  document.getElementById('propFormAddress').value = p.address || '';
  document.getElementById('propFormCity').value = p.city || '';
  document.getElementById('propFormOwner').value = p.owner || '';
  document.getElementById('propFormBeds').value = p.bedrooms ?? '';
  document.getElementById('propFormBaths').value = p.bathrooms ?? '';
  document.getElementById('propFormGuests').value = p.max_guests ?? '';
  document.getElementById('propFormStatus').value = p.status || 'Active';
  document.getElementById('propFormHostfullyUid').value = p.hostfully_uid || '';
  document.getElementById('propFormApt').value = p.apt || '';
  openModal('addPropertyModal');
}

async function saveProperty() {
  const name = document.getElementById('propFormName').value.trim();
  if (!name) { toast('Property name is required', 'error'); return; }

  const apt = document.getElementById('propFormApt').value.trim() || name;
  const row = {
    apt,
    name,
    address:      document.getElementById('propFormAddress').value.trim(),
    city:         document.getElementById('propFormCity').value.trim(),
    owner:        document.getElementById('propFormOwner').value,
    bedrooms:     parseFloat(document.getElementById('propFormBeds').value) || null,
    bathrooms:    parseFloat(document.getElementById('propFormBaths').value) || null,
    max_guests:   parseInt(document.getElementById('propFormGuests').value) || null,
    status:       document.getElementById('propFormStatus').value,
    hostfully_uid:document.getElementById('propFormHostfullyUid').value.trim() || null,
    tags: [],
    updated_at: new Date().toISOString()
  };

  try {
    const { error } = await sb.from('properties').upsert(row, { onConflict: 'apt' });
    if (error) throw error;
    toast('Property saved ✓', 'success');
    closeModal('addPropertyModal');
    await loadProperties();
    filterProperties();
  } catch(e) {
    toast('Save failed: ' + (e.message || e), 'error');
  }
}

async function syncPropertiesFromHostfully() {
  toast('To sync: enter your Hostfully API key in Settings → Integrations (coming soon)', 'info');
  // Future: GET https://platform.hostfully.com/api/v3/properties with X-HOSTFULLY-APIKEY header
  // then upsert each property into Supabase `properties` table
}


// ── BACKUP ─────────────────────────────────────────
const BACKUP_KEY = 'propdesk_last_backup';

async function checkBackupStatus() {
  const btns = [document.getElementById('backupBtn'), document.getElementById('headerBackupBtn')];
  const status = document.getElementById('backupStatus');

  // Try to get last backup from Supabase backups table
  let lastDt = null;
  try {
    const { data, error } = await sb.from('backups').select('created_at').order('created_at', { ascending: false }).limit(1);
    if (!error && data && data.length > 0) {
      lastDt = new Date(data[0].created_at);
      // Sync to localStorage so offline mode still works
      localStorage.setItem(BACKUP_KEY, lastDt.getTime().toString());
    }
  } catch(e) { /* offline or table missing — fall back to localStorage */ }

  // Fall back to localStorage if Supabase didn't return anything
  if (!lastDt) {
    const local = localStorage.getItem(BACKUP_KEY);
    if (local) lastDt = new Date(parseInt(local));
  }

  const headerTs = document.getElementById('headerBackupTimestamp');
  if (!lastDt) {
    btns.forEach(b => { if(b){ b.style.background='var(--red)'; b.innerHTML='⚠ Backup Now'; b.title='Never backed up!'; } });
    if(status){ status.textContent='Never backed up!'; status.style.color='var(--red)'; }
    if(headerTs){ headerTs.textContent='No backup yet'; headerTs.style.color='var(--red)'; }
    return;
  }
  const hoursAgo = (Date.now() - lastDt) / 3600000;
  const timeStr = lastDt.toLocaleDateString('en-US',{month:'short',day:'numeric'}) + ' ' + lastDt.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'});
  const agoStr = hoursAgo >= 24 ? Math.floor(hoursAgo/24)+'d ago' : Math.floor(hoursAgo)+'h ago';
  if (hoursAgo >= 6) {
    btns.forEach(b => { if(b){ b.style.background='var(--red)'; b.innerHTML='⚠ Backup Now'; b.title=`Last backup: ${timeStr}`; } });
    if(status){ status.textContent=`Last backup: ${timeStr} (${agoStr})`; status.style.color='var(--red)'; }
    if(headerTs){ headerTs.textContent=`Last backup: ${timeStr}`; headerTs.style.color='var(--red)'; }
  } else {
    btns.forEach(b => { if(b){ b.style.background='var(--green)'; b.innerHTML='💾 Backup Now'; b.title=`Last backup: ${timeStr}`; } });
    if(status){ status.textContent=`Last backup: ${timeStr}`; status.style.color='var(--green)'; }
    if(headerTs){ headerTs.textContent=`Last backup: ${timeStr}`; headerTs.style.color='#9e9485'; }
  }
}

async function runBackup() {
  const btns = [document.getElementById('backupBtn'), document.getElementById('headerBackupBtn')];
  btns.forEach(b => { if(b){ b.innerHTML='⏳ Backing up…'; b.disabled=true; b.style.opacity='0.7'; } });

  try {
    // ── Fetch ALL tables ──
    // 1. units (paginated)
    let unitsRows = [];
    const pageSize = 500;
    let page = 0;
    while(true) {
      const from = page * pageSize, to = from + pageSize - 1;
      const {data:rows, error} = await sb.from('units').select('*').order('id').range(from, to);
      if(error) throw new Error('units: ' + error.message);
      if(!rows || rows.length === 0) break;
      unitsRows = unitsRows.concat(rows);
      if(rows.length < pageSize) break;
      page++;
    }

    // 2. properties
    const {data:propertiesRows, error:pErr} = await sb.from('properties').select('*').order('property_uid');
    if(pErr) console.warn('properties backup skipped:', pErr.message);

    // 3. property_settings
    const {data:settingsRows, error:sErr} = await sb.from('property_settings').select('*').order('apt');
    if(sErr) console.warn('property_settings backup skipped:', sErr.message);

    // 4. audit_log (last 500)
    const {data:auditRows, error:aErr} = await sb.from('audit_log').select('*').order('created_at', {ascending:false}).limit(500);
    if(aErr) console.warn('audit_log backup skipped:', aErr.message);

    const snapshot = {
      backed_up_at: new Date().toISOString(),
      units:             unitsRows,
      properties:        propertiesRows || [],
      property_settings: settingsRows  || [],
      audit_log:         auditRows     || []
    };

    const totalRecords = unitsRows.length + (propertiesRows||[]).length + (settingsRows||[]).length;

    // ── Save snapshot to Supabase backups table ──
    const { error: bErr } = await sb.from('backups').insert({
      record_count: totalRecords,
      snapshot: snapshot
    });
    if (bErr) throw new Error('Supabase save failed: ' + bErr.message);

    // ── Enforce 10-backup cap ──
    const { data: allBackups, error: listErr } = await sb
      .from('backups').select('id').order('created_at', { ascending: true });
    if (!listErr && allBackups && allBackups.length > 10) {
      const toDelete = allBackups.slice(0, allBackups.length - 10).map(b => b.id);
      await sb.from('backups').delete().in('id', toDelete);
    }

    localStorage.setItem(BACKUP_KEY, Date.now().toString());
    await checkBackupStatus();
    toast(`✓ Backup complete — ${unitsRows.length} units, ${(propertiesRows||[]).length} properties, ${(settingsRows||[]).length} settings`, 'success');

  } catch(e) {
    console.error('Backup failed:', e);
    const msg = e.message || '';
    const hint = msg.includes('row-level security') || msg.includes('policy')
      ? ' — run: ALTER TABLE backups DISABLE ROW LEVEL SECURITY; in Supabase SQL editor'
      : '';
    toast('⚠ Backup failed: ' + msg + hint, 'error');
  } finally {
    btns.forEach(b => { if(b){ b.disabled=false; b.style.opacity='1'; } });
    await checkBackupStatus();
  }
}



// ── IMPORT JSON ─────────────────────────────────────

let _importSnapshot = null;

function handleImportJson(input) {
  const file = input.files[0];
  if (!file) return;
  input.value = ''; // reset so same file can be re-picked

  const reader = new FileReader();
  reader.onload = e => {
    try {
      const parsed = JSON.parse(e.target.result);
      if (!Array.isArray(parsed)) throw new Error('JSON must be an array of unit records');
      if (parsed.length === 0) throw new Error('File contains no records');

      _importSnapshot = parsed;
      const active = parsed.filter(r => !r.archived).length;
      const arch = parsed.filter(r => r.archived).length;
      const owners = [...new Set(parsed.map(r => r.owner).filter(Boolean))];

      document.getElementById('importPreview').innerHTML = `
        <div style="font-size:11px;color:var(--text3);margin-bottom:10px;text-transform:uppercase;letter-spacing:1px;">File Preview — ${file.name}</div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:12px;">
          <div style="background:var(--surface);border:1px solid var(--border);border-radius:6px;padding:10px;">
            <div style="font-size:10px;color:var(--text3);margin-bottom:2px;">Total Records</div>
            <div style="font-family:'Playfair Display',serif;font-size:22px;font-weight:700;color:var(--accent2);">${parsed.length}</div>
          </div>
          <div style="background:var(--surface);border:1px solid var(--border);border-radius:6px;padding:10px;">
            <div style="font-size:10px;color:var(--text3);margin-bottom:2px;">Active Units</div>
            <div style="font-family:'Playfair Display',serif;font-size:22px;font-weight:700;color:var(--green);">${active}</div>
          </div>
          <div style="background:var(--surface);border:1px solid var(--border);border-radius:6px;padding:10px;">
            <div style="font-size:10px;color:var(--text3);margin-bottom:2px;">Archived</div>
            <div style="font-family:'Playfair Display',serif;font-size:22px;font-weight:700;color:var(--text2);">${arch}</div>
          </div>
        </div>
        <div style="font-size:11px;color:var(--text2);"><strong>Owners:</strong> ${owners.join(', ') || '—'}</div>`;

      document.getElementById('backupImportModal').classList.add('open');
    } catch(err) {
      toast('Invalid JSON file: ' + err.message, 'error');
    }
  };
  reader.readAsText(file);
}

async function confirmImport() {
  if (!_importSnapshot) return;
  const btn = document.getElementById('confirmImportBtn');
  btn.textContent = '⏳ Importing…';
  btn.disabled = true;

  try {
    const activeSnap = _importSnapshot.filter(r => !r.archived);

    // Delete all current active units
    const { error: delErr } = await sb.from('units').delete().eq('archived', false);
    if (delErr) throw new Error('Delete failed: ' + delErr.message);

    // Insert in batches of 100, dropping old IDs
    const batchSize = 100;
    for (let i = 0; i < activeSnap.length; i += batchSize) {
      const chunk = activeSnap.slice(i, i + batchSize).map(r => {
        const { id, ...rest } = r;
        return rest;
      });
      const { error: insErr } = await sb.from('units').insert(chunk);
      if (insErr) throw new Error('Insert failed: ' + insErr.message);
    }

    closeModal('backupImportModal');
    closeModal('backupHistoryModal');
    await loadAll();
    renderTable();
    toast(`✓ Imported ${activeSnap.length} active units from JSON`, 'success');
  } catch(e) {
    toast('Import failed: ' + e.message, 'error');
    btn.textContent = 'Import & Restore';
    btn.disabled = false;
  }
}

// ── BACKUP HISTORY ─────────────────────────────────

let _restoreSnapshot = null;
let _restoreBackupId = null;

async function openBackupHistory() {
  document.getElementById('backupHistoryModal').classList.add('open');
  document.getElementById('backupHistoryLoading').style.display = 'block';
  document.getElementById('backupHistoryEmpty').style.display = 'none';
  document.getElementById('backupHistoryTable').style.display = 'none';

  try {
    const { data, error } = await sb
      .from('backups')
      .select('id, created_at, record_count')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw new Error(error.message);

    document.getElementById('backupHistoryLoading').style.display = 'none';

    if (!data || data.length === 0) {
      document.getElementById('backupHistoryEmpty').style.display = 'block';
      return;
    }

    const now = Date.now();
    const tbody = document.getElementById('backupHistoryBody');
    tbody.innerHTML = data.map((b, i) => {
      const dt = new Date(b.created_at);
      const dateStr = dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      const timeStr = dt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      const hoursAgo = (now - dt) / 3600000;
      let age, ageColor;
      if (hoursAgo < 1) { age = `${Math.round(hoursAgo * 60)}m ago`; ageColor = 'var(--green)'; }
      else if (hoursAgo < 24) { age = `${Math.floor(hoursAgo)}h ago`; ageColor = hoursAgo < 6 ? 'var(--green)' : 'var(--orange)'; }
      else { const days = Math.floor(hoursAgo / 24); age = `${days}d ago`; ageColor = 'var(--red)'; }

      const isLatest = i === 0;
      return `<tr style="border-bottom:1px solid var(--border);${isLatest ? 'background:var(--green-bg);' : ''}">
        <td style="padding:11px 14px;">
          ${isLatest ? '<span style="font-size:9px;background:var(--green);color:#fff;border-radius:10px;padding:1px 7px;margin-right:6px;text-transform:uppercase;letter-spacing:.5px;">Latest</span>' : ''}
          <span style="font-weight:500;">${dateStr}</span>
          <span style="color:var(--text3);margin-left:6px;">${timeStr}</span>
        </td>
        <td style="padding:11px 14px;color:var(--text2);">${b.record_count ?? '—'} records</td>
        <td style="padding:11px 14px;color:${ageColor};font-weight:500;">${age}</td>
        <td style="padding:11px 14px;text-align:right;">
          <div style="display:flex;gap:6px;justify-content:flex-end;">
            <button onclick="previewRestore(${b.id})" data-id="${b.id}"
              style="padding:5px 12px;font-size:11px;background:var(--blue-bg);color:var(--blue);border:1px solid var(--blue-border);border-radius:6px;cursor:pointer;font-family:inherit;font-weight:500;">
              ↩ Restore
            </button>
            <button onclick="deleteBackup(${b.id}, this)"
              style="padding:5px 10px;font-size:11px;background:var(--red-bg);color:var(--red);border:1px solid var(--red-border);border-radius:6px;cursor:pointer;font-family:inherit;">
              🗑
            </button>
          </div>
        </td>
      </tr>`;
    }).join('');

    document.getElementById('backupHistoryTable').style.display = 'table';
  } catch(e) {
    document.getElementById('backupHistoryLoading').style.display = 'none';
    document.getElementById('backupHistoryBody').innerHTML =
      `<tr><td colspan="4" style="padding:24px;text-align:center;color:var(--red);">Failed to load backups: ${e.message}</td></tr>`;
    document.getElementById('backupHistoryTable').style.display = 'table';
  }
}

async function previewRestore(backupId) {
  _restoreBackupId = backupId;
  _restoreSnapshot = null;

  document.getElementById('restorePreview').innerHTML = '<div style="color:var(--text3);text-align:center;padding:16px;">Loading snapshot…</div>';
  document.getElementById('backupRestoreModal').classList.add('open');

  try {
    const { data, error } = await sb.from('backups').select('snapshot, record_count, created_at').eq('id', backupId).single();
    if (error) throw new Error(error.message);
    _restoreSnapshot = data.snapshot;

    const active = data.snapshot.filter(r => !r.archived).length;
    const arch = data.snapshot.filter(r => r.archived).length;
    const owners = [...new Set(data.snapshot.map(r => r.owner).filter(Boolean))];
    const dt = new Date(data.created_at);
    const label = dt.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}) + ' ' + dt.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'});

    document.getElementById('restorePreview').innerHTML = `
      <div style="font-size:11px;color:var(--text3);margin-bottom:10px;text-transform:uppercase;letter-spacing:1px;">Snapshot Preview</div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:12px;">
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:6px;padding:10px;">
          <div style="font-size:10px;color:var(--text3);margin-bottom:2px;">Total Records</div>
          <div style="font-family:'Playfair Display',serif;font-size:22px;font-weight:700;color:var(--accent2);">${data.record_count ?? data.snapshot.length}</div>
        </div>
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:6px;padding:10px;">
          <div style="font-size:10px;color:var(--text3);margin-bottom:2px;">Active Units</div>
          <div style="font-family:'Playfair Display',serif;font-size:22px;font-weight:700;color:var(--green);">${active}</div>
        </div>
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:6px;padding:10px;">
          <div style="font-size:10px;color:var(--text3);margin-bottom:2px;">Archived</div>
          <div style="font-family:'Playfair Display',serif;font-size:22px;font-weight:700;color:var(--text2);">${arch}</div>
        </div>
      </div>
      <div style="font-size:11px;color:var(--text2);margin-bottom:4px;"><strong>Owners:</strong> ${owners.join(', ') || '—'}</div>
      <div style="font-size:11px;color:var(--text3);">Backup from: ${label}</div>`;
  } catch(e) {
    document.getElementById('restorePreview').innerHTML = `<div style="color:var(--red);padding:12px;">Failed to load snapshot: ${e.message}</div>`;
  }
}

async function confirmRestore() {
  if (!_restoreSnapshot || !_restoreBackupId) return;

  const btn = document.getElementById('confirmRestoreBtn');
  btn.textContent = '⏳ Restoring…';
  btn.disabled = true;

  try {
    // Only restore active (non-archived) units — leave archive untouched
    const activeSnap = _restoreSnapshot.filter(r => !r.archived);

    // Delete all current active units
    const { error: delErr } = await sb.from('units').delete().eq('archived', false);
    if (delErr) throw new Error('Delete failed: ' + delErr.message);

    // Re-insert in batches of 100
    const batchSize = 100;
    for (let i = 0; i < activeSnap.length; i += batchSize) {
      const chunk = activeSnap.slice(i, i + batchSize).map(r => {
        const { id, ...rest } = r; // drop old id — let Supabase assign new ones
        return rest;
      });
      const { error: insErr } = await sb.from('units').insert(chunk);
      if (insErr) throw new Error('Insert failed: ' + insErr.message);
    }

    closeModal('backupRestoreModal');
    closeModal('backupHistoryModal');

    // Reload live data
    await loadAll();
    renderTable();
    toast(`✓ Restored ${activeSnap.length} active units from backup`, 'success');
  } catch(e) {
    toast('Restore failed: ' + e.message, 'error');
    btn.textContent = 'Restore This Backup';
    btn.disabled = false;
  }
}

async function deleteBackup(backupId, btnEl) {
  if (!confirm('Delete this backup? This cannot be undone.')) return;
  btnEl.textContent = '…';
  btnEl.disabled = true;
  try {
    const { error } = await sb.from('backups').delete().eq('id', backupId);
    if (error) throw new Error(error.message);
    toast('Backup deleted', 'success');
    await openBackupHistory(); // refresh list
    await checkBackupStatus();
  } catch(e) {
    toast('Delete failed: ' + e.message, 'error');
    btnEl.textContent = '🗑';
    btnEl.disabled = false;
  }
}

// Check backup status every 30 minutes
setInterval(checkBackupStatus, 30 * 60 * 1000);

// ── AUDIT LOG UI ───────────────────────────────────
async function showAuditLog() {
  openModal('auditModal');
  document.getElementById('auditBody').innerHTML = '<tr><td colspan="5" style="padding:20px;text-align:center;color:var(--text3);">Loading…</td></tr>';
  const {data:rows, error} = await sb.from('audit_log')
    .select('*').order('created_at', {ascending:false}).limit(50);
  if(error || !rows){ document.getElementById('auditBody').innerHTML=''; document.getElementById('auditEmpty').style.display=''; return; }
  document.getElementById('auditEmpty').style.display = rows.length ? 'none' : '';
  const actionColor = a => a==='delete'?'var(--red)':a==='archive'?'var(--orange)':a==='edit'?'var(--blue)':'var(--text2)';
  document.getElementById('auditBody').innerHTML = rows.map(r => {
    const dt = new Date(r.created_at);
    const timeStr = dt.toLocaleDateString('en-US',{month:'short',day:'numeric'}) + ' ' + dt.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'});
    const canUndo = r.old_data && ['edit','archive','delete'].includes(r.action);
    return `<tr style="border-bottom:1px solid var(--border);" onmouseover="this.style.background='var(--surface2)'" onmouseout="this.style.background=''">
      <td style="padding:10px 12px;color:var(--text3);white-space:nowrap;">${timeStr}</td>
      <td style="padding:10px 12px;font-weight:500;color:${actionColor(r.action)}">${r.action}</td>
      <td style="padding:10px 12px;font-family:'Playfair Display',serif;color:var(--accent2)">${r.apt||'—'}</td>
      <td style="padding:10px 12px;max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${r.name||'—'}</td>
      <td style="padding:10px 12px;">${canUndo?`<button onclick="undoFromLog(${r.id})" style="font-size:11px;padding:3px 8px;border:1px solid var(--border);border-radius:4px;background:var(--surface);cursor:pointer;color:var(--text2);">↩ Undo</button>`:'—'}</td>
    </tr>`;
  }).join('');
}

async function undoFromLog(logId) {
  const {data:rows} = await sb.from('audit_log').select('*').eq('id', logId).limit(1);
  if(!rows || !rows.length) return;
  const u = rows[0];
  if(!confirm(`Undo "${u.action}" for ${u.apt} ${u.name||''}?`)) return;
  lastUndo = {
    action: u.action, record_id: u.record_id,
    old_data: u.old_data ? JSON.parse(u.old_data) : null,
    new_data: u.new_data ? JSON.parse(u.new_data) : null,
    apt: u.apt, name: u.name
  };
  closeModal('auditModal');
  await performUndo();
}

// ── ARCHIVE HISTORY ────────────────────────────────
let histSortCol = 'checkout';
let histSortDir = -1;

function histSort(col) {
  if (histSortCol === col) histSortDir *= -1;
  else { histSortCol = col; histSortDir = col === 'checkin' || col === 'checkout' ? -1 : 1; }
  // update header indicators
  document.querySelectorAll('[id^="hth-"]').forEach(th => {
    const c = th.id.replace('hth-','');
    th.style.color = c === histSortCol ? 'var(--accent2)' : 'var(--text3)';
    th.textContent = th.textContent.replace(/ [↑↓↕]$/,'') + (c === histSortCol ? (histSortDir === 1 ? ' ↑' : ' ↓') : ' ↕');
  });
  renderHistory();
}

function renderHistory(){
  const q  = (document.getElementById('histSearch').value||'').toLowerCase();
  const yr = document.getElementById('histYear').value;
  const mo = document.getElementById('histMonth').value;
  const tp = document.getElementById('histType').value;
  const ow = document.getElementById('histOwner').value;

  let rows = [...archived];

  if(q) rows = rows.filter(r =>
    (r.name||'').toLowerCase().includes(q) ||
    (r.apt||'').toLowerCase().includes(q) ||
    (r.owner||'').toLowerCase().includes(q) ||
    (r.note||'').toLowerCase().includes(q));

  const getCheckin  = r => r.checkin || r.checkinDate || r.archivedDate || '';
  const getCheckout = r => r.lease_end || r.archivedDate || r.due || '';

  if(yr !== 'all') {
    rows = rows.filter(r => {
      const ci = getCheckin(r); const co = getCheckout(r);
      return ci.startsWith(yr) || co.startsWith(yr);
    });
  }
  if(mo !== 'all') {
    const pad = mo.padStart(2,'0');
    rows = rows.filter(r => {
      const ci = getCheckin(r); const co = getCheckout(r);
      return (ci.length>=7 && ci.substring(5,7)===pad) ||
             (co.length>=7 && co.substring(5,7)===pad);
    });
  }
  if(tp !== 'all') rows = rows.filter(r => r.type === tp);
  if(ow !== 'all') rows = rows.filter(r => r.owner === ow);

  // Sort
  rows.sort((a,b) => {
    let va, vb;
    if(histSortCol==='apt')    { va=a.apt||''; vb=b.apt||''; return histSortDir*va.localeCompare(vb,undefined,{numeric:true}); }
    if(histSortCol==='name')   { va=a.name||''; vb=b.name||''; return histSortDir*va.localeCompare(vb); }
    if(histSortCol==='owner')  { va=a.owner||''; vb=b.owner||''; return histSortDir*va.localeCompare(vb); }
    if(histSortCol==='type')   { va=a.type||''; vb=b.type||''; return histSortDir*va.localeCompare(vb); }
    if(histSortCol==='rent')   { return histSortDir*((a.rent||0)-(b.rent||0)); }
    if(histSortCol==='checkin'){ va=getCheckin(a); vb=getCheckin(b); return histSortDir*va.localeCompare(vb); }
    if(histSortCol==='checkout'){ va=getCheckout(a); vb=getCheckout(b); return histSortDir*va.localeCompare(vb); }
    return 0;
  });

  const totalRev = rows.reduce((s,r) => s + (r.rent||0), 0);

  document.getElementById('histKpis').innerHTML=`
    <div class="kpi-card kv-accent"><div class="kpi-label">Filtered Records</div><div class="kpi-value">${rows.length}</div><div class="kpi-sub">past stays / tenants</div></div>
    <div class="kpi-card kv-green"><div class="kpi-label">Total Revenue</div><div class="kpi-value">${fmtMoney(totalRev)}</div><div class="kpi-sub">sum of rent amounts</div></div>
    <div class="kpi-card kv-blue"><div class="kpi-label">Short Stays</div><div class="kpi-value">${rows.filter(r=>r.type==='short-stay').length}</div><div class="kpi-sub">in filtered set</div></div>
    <div class="kpi-card kv-orange"><div class="kpi-label">Long / M-to-M</div><div class="kpi-value">${rows.filter(r=>r.type!=='short-stay').length}</div><div class="kpi-sub">in filtered set</div></div>`;

  document.getElementById('histEmpty').style.display = rows.length ? 'none' : '';
  document.getElementById('histBody').innerHTML = rows.map(r => {
    const ci = getCheckin(r);
    const co = getCheckout(r);
    const pmtCount = (r.history||[]).length;
    const multiPmt = pmtCount > 1 ? `<span style="font-size:10px;background:var(--accent-bg);color:var(--accent2);border:1px solid var(--orange-border);border-radius:10px;padding:1px 7px;margin-left:6px;">${pmtCount} pmts</span>` : '';
    return `<tr style="border-bottom:1px solid var(--border);transition:background .1s;cursor:pointer;" onclick="openArchiveDetail(${r.id})" onmouseover="this.style.background='var(--surface2)'" onmouseout="this.style.background=''">
      <td style="padding:10px 12px;font-family:'Playfair Display',serif;font-size:16px;font-weight:700;color:var(--accent2)">${r.apt}</td>
      <td style="padding:10px 12px;font-size:12px;font-weight:500;max-width:150px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${r.name}${multiPmt}</td>
      <td style="padding:10px 12px;font-size:11px;color:var(--text2);max-width:110px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${r.owner||'—'}</td>
      <td style="padding:10px 12px">${typeBadge(r.type)}</td>
      <td style="padding:10px 12px;text-align:right;color:var(--green);font-weight:500;font-size:12px">${r.rent?fmtMoney(r.rent):'—'}</td>
      <td style="padding:10px 12px;font-size:12px;color:var(--text3)">${fmtDate(ci)}</td>
      <td style="padding:10px 12px;font-size:12px;color:${r.lease_end?'var(--blue)':'var(--text3)'}">${fmtDate(r.lease_end||co)}</td>
      <td style="padding:10px 12px;font-size:11px;color:var(--text3);max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-style:italic">${r.note||''}</td>
      <td style="padding:10px 12px" onclick="event.stopPropagation()">
        <button class="icon-btn ib-edit" title="Edit" onclick="openArchiveEdit(${r.id})" style="width:26px;height:26px;border-radius:5px;border:1px solid var(--border);background:var(--surface);color:var(--text3);cursor:pointer;display:inline-flex;align-items:center;justify-content:center;font-size:12px;">✏️</button>
      </td>
    </tr>`;
  }).join('');

  document.getElementById('histFooter').textContent = `Showing ${rows.length} records · Total: ${fmtMoney(totalRev)}`;
}

function openArchiveEdit(id) {
  const r = archived.find(x => x.id === id); if(!r) return;
  document.getElementById('archEditId').value = id;
  document.getElementById('archEditAptLabel').textContent = r.apt;
  document.getElementById('aeFApt').value     = r.apt||'';
  document.getElementById('aeFOwner').value   = r.owner||'';
  document.getElementById('aeFName').value    = r.name||'';
  document.getElementById('aeFType').value    = r.type||'short-stay';
  document.getElementById('aeFRent').value    = r.rent||'';
  document.getElementById('aeFNote').value    = r.note||'';
  // checkin from history last entry, checkout from archivedDate
  const hist = r.history||[];
  const ci = hist.length ? hist[hist.length-1].date : '';
  document.getElementById('aeFCheckin').value  = ci||'';
  document.getElementById('aeFCheckout').value = r.lease_end || r.archivedDate || r.due || '';
  openModal('archEditModal');
}

async function saveArchiveRecord() {
  const id  = document.getElementById('archEditId').value;
  const idx = archived.findIndex(x=>x.id==id); if(idx<0) return;
  const r   = archived[idx];
  const checkout = document.getElementById('aeFCheckout').value;
  const checkin  = document.getElementById('aeFCheckin').value;
  const rent     = parseFloat(document.getElementById('aeFRent').value)||0;
  archived[idx] = {
    ...r,
    apt:          document.getElementById('aeFApt').value.trim(),
    owner:        document.getElementById('aeFOwner').value.trim(),
    name:         document.getElementById('aeFName').value.trim(),
    type:         document.getElementById('aeFType').value,
    rent,
    note:         document.getElementById('aeFNote').value.trim(),
    archivedDate: checkout,
    archived_date: checkout,
    lease_end:    checkout,
    due:          checkout,
    history:      checkin ? [{date:checkin, text:`$${rent.toLocaleString()} — stay`}] : r.history,
  };
  await save(archived[idx]);
  closeModal('archEditModal');
  renderHistory();
  toast('Archive record updated ✓','success');
}

async function deleteArchiveRecord() {
  const id = document.getElementById('archEditId').value;
  if(!confirm('Permanently delete this archive record?')) return;
  archived = archived.filter(x=>x.id!=id);
  await deleteRecord(parseInt(id));
  closeModal('archEditModal');
  renderHistory();
  toast('Record deleted.','error');
}

// ══════════════════════════════════════════════════════
//  GRAPHS
// ══════════════════════════════════════════════════════
let gCharts = {};

function destroyChart(id) { if(gCharts[id]){gCharts[id].destroy();delete gCharts[id];} }

function mkChart(id, type, labels, datasets, opts={}) {
  destroyChart(id);
  const ctx = document.getElementById(id);
  if(!ctx) return;
  const isBar = type === 'bar' || type === 'line';
  const baseOpts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { labels: { font: { family:'DM Mono', size:10 }, boxWidth:10 } } },
  };
  if (isBar) {
    baseOpts.scales = {
      y: { ticks: { callback: v => '$'+Math.round(v).toLocaleString(), font:{family:'DM Mono',size:9} }, grid:{color:'#f0ede8'} },
      x: { ticks: { font:{family:'DM Mono',size:9} }, grid:{display:false} }
    };
  }
  // Deep merge opts
  const merged = { ...baseOpts };
  if (opts.plugins) merged.plugins = { ...baseOpts.plugins, ...opts.plugins };
  if (opts.scales)  merged.scales  = opts.scales;
  if (opts.indexAxis) merged.indexAxis = opts.indexAxis;
  gCharts[id] = new Chart(ctx, { type, data:{ labels, datasets }, options: merged });
}

function openHistGraphs() {
  // Get currently filtered rows
  const q   = (document.getElementById('histSearch').value||'').toLowerCase();
  const yr  = document.getElementById('histYear').value;
  const mo  = document.getElementById('histMonth').value;
  const tp  = document.getElementById('histType').value;
  const ow  = document.getElementById('histOwner').value;
  const getCheckin  = r => r.checkin || r.checkinDate || r.archivedDate || '';
  const getCheckout = r => r.lease_end || r.archivedDate || r.due || '';

  let rows = [...archived];
  if(q) rows = rows.filter(r=>(r.name||'').toLowerCase().includes(q)||(r.apt||'').toLowerCase().includes(q)||(r.owner||'').toLowerCase().includes(q));
  if(yr!=='all') rows = rows.filter(r=>getCheckin(r).startsWith(yr)||getCheckout(r).startsWith(yr));
  if(mo!=='all') { const p=mo.padStart(2,'0'); rows=rows.filter(r=>(getCheckin(r).substring(5,7)===p)||(getCheckout(r).substring(5,7)===p)); }
  if(tp!=='all') rows = rows.filter(r=>r.type===tp);
  if(ow!=='all') rows = rows.filter(r=>r.owner===ow);

  const title = yr==='all' ? 'All Years' : (mo==='all' ? yr : `${mo}/${yr}`);
  document.getElementById('histGraphTitle').textContent = `📊 Archive Charts — ${title} (${rows.length} records)`;

  openModal('histGraphModal');
  setTimeout(() => {
    // 1. Revenue by Month
    const byMonth = {};
    rows.forEach(r => {
      const d = getCheckin(r) || getCheckout(r);
      const key = d ? d.substring(0,7) : 'unknown';
      byMonth[key] = (byMonth[key]||0) + (r.rent||0);
    });
    const mKeys = Object.keys(byMonth).filter(k=>k!=='unknown').sort();
    mkChart('gByMonth','bar',
      mKeys.map(k=>{ const [y,m]=k.split('-'); return new Date(y,m-1,1).toLocaleDateString('en-US',{month:'short',year:'2-digit'}); }),
      [{ label:'Revenue', data:mKeys.map(k=>byMonth[k]), backgroundColor:'#2e7d52', borderRadius:4 }]
    );

    // 2. Revenue by Owner
    const byOwner = {};
    rows.forEach(r => { byOwner[r.owner||'Unknown'] = (byOwner[r.owner||'Unknown']||0) + (r.rent||0); });
    const oKeys = Object.keys(byOwner).sort((a,b)=>byOwner[b]-byOwner[a]);
    mkChart('gByOwner','bar', oKeys,
      [{ label:'Revenue', data:oKeys.map(k=>byOwner[k]), backgroundColor:['#2563a8','#6b4ca8','#c0711a','#2e7d52','#b5814a'], borderRadius:4 }],
      { plugins:{ legend:{display:false} } }
    );

    // 3. By Type (doughnut)
    const byType = {'short-stay':0,'long-term':0,'month-to-month':0};
    rows.forEach(r => { if(byType[r.type]!==undefined) byType[r.type]++; else byType['long-term']++; });
    mkChart('gByType','doughnut',
      ['Short Stay','Long Term','M-to-M'],
      [{ data:[byType['short-stay'],byType['long-term'],byType['month-to-month']], backgroundColor:['#c0711a','#2563a8','#6b4ca8'], borderWidth:2, borderColor:'#fff' }],
      { plugins:{ legend:{ position:'bottom', labels:{font:{family:'DM Mono',size:10},boxWidth:10} } }, scales:{} }
    );

    // 4. Top apts by revenue
    const byApt = {};
    rows.forEach(r => { byApt[r.apt] = (byApt[r.apt]||0) + (r.rent||0); });
    const aKeys = Object.keys(byApt).sort((a,b)=>byApt[b]-byApt[a]).slice(0,10);
    mkChart('gByApt','bar', aKeys,
      [{ label:'Revenue', data:aKeys.map(k=>byApt[k]), backgroundColor:'#b5814a', borderRadius:4 }],
      { plugins:{legend:{display:false}}, indexAxis:'y',
        scales:{ x:{ ticks:{callback:v=>'$'+Math.round(v).toLocaleString(),font:{family:'DM Mono',size:9}}, grid:{color:'#f0ede8'} }, y:{ticks:{font:{family:'DM Mono',size:9}},grid:{display:false}} } }
    );
  }, 100);
}

function openUnitsGraph() {
  openModal('unitsGraphModal');
  const active = data.filter(r=>!r.archived);
  const occ    = active.filter(r=>r.type!=='available'&&r.name);
  const avail  = active.filter(r=>r.type==='available'||!r.name);

  setTimeout(() => {
    // 1. Rent by Owner
    const byOwner = {};
    occ.forEach(r => { byOwner[r.owner||'Unknown'] = (byOwner[r.owner||'Unknown']||0) + (r.rent||0); });
    const oKeys = Object.keys(byOwner).sort((a,b)=>byOwner[b]-byOwner[a]);
    mkChart('ugByOwner','bar', oKeys,
      [{ label:'Monthly Rent', data:oKeys.map(k=>byOwner[k]), backgroundColor:['#2563a8','#6b4ca8','#c0711a','#2e7d52','#b5814a'], borderRadius:4 }],
      { plugins:{legend:{display:false}} }
    );

    // 2. Units by type (doughnut)
    const tc={'long-term':0,'month-to-month':0,'short-stay':0,'available':0};
    active.forEach(r=>{ if(tc[r.type]!==undefined)tc[r.type]++; });
    mkChart('ugByType','doughnut',
      ['Long Term','M-to-M','Short Stay','Available'],
      [{ data:[tc['long-term'],tc['month-to-month'],tc['short-stay'],tc['available']], backgroundColor:['#2563a8','#6b4ca8','#c0711a','#2e7d52'], borderWidth:2, borderColor:'#fff' }],
      { plugins:{legend:{position:'bottom',labels:{font:{family:'DM Mono',size:10},boxWidth:10}}}, scales:{} }
    );

    // 3. Balance by apt (top 10 with balance)
    const withBal = occ.filter(r=>r.balance>0).sort((a,b)=>b.balance-a.balance).slice(0,10);
    mkChart('ugByBalance','bar', withBal.map(r=>r.apt),
      [{ label:'Balance Owed', data:withBal.map(r=>r.balance), backgroundColor:'#c0392b', borderRadius:4 }],
      { plugins:{legend:{display:false}}, indexAxis:'y',
        scales:{ x:{ticks:{callback:v=>'$'+Math.round(v).toLocaleString(),font:{family:'DM Mono',size:9}},grid:{color:'#f0ede8'}}, y:{ticks:{font:{family:'DM Mono',size:9}},grid:{display:false}} } }
    );

    // 4. Occupancy doughnut
    mkChart('ugOccupancy','doughnut',
      ['Occupied','Available'],
      [{ data:[occ.length,avail.length], backgroundColor:['#2e7d52','#e0dbd2'], borderWidth:2, borderColor:'#fff' }],
      { plugins:{ legend:{position:'bottom',labels:{font:{family:'DM Mono',size:10},boxWidth:10}},
          tooltip:{callbacks:{label:c=>`${c.label}: ${c.raw} units (${Math.round(c.raw/active.length*100)}%)`}} }, scales:{} }
    );
  }, 100);
}

// ══════════════════════════════════════════════════════
//  LT MONTHLY ARCHIVE RECORDS (2025)
// ══════════════════════════════════════════════════════
async function seedLTYear(year) {
  const MONTHS=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const now = new Date();
  // For current year, only go up to current month; for past years go to Dec
  const maxMonth = (year === now.getFullYear()) ? now.getMonth() : 11; // 0-indexed

  const active = data.filter(r =>
    !r.archived && r.name &&
    (r.type==='long-term' || r.type==='month-to-month') &&
    r.type !== 'short-stay' &&  // explicit safety guard
    r.rent > 0
  );

  if(!confirm(`This creates one archive line per month for every active LT/MTM tenant for ${year}.\n\n${active.length} active tenants × up to ${maxMonth+1} months.\n\nFor example:\n  Apt 232 — Oleh Chubatiuk — Jan ${year} — $2,300\n  Apt 232 — Oleh Chubatiuk — Feb ${year} — $2,300\n  ...\n\nExisting records are skipped. Continue?`)) return;

  toast(`Generating ${year} monthly records…`);

  // Move-in lookup from SEED_DATA history
  const moveInLookup = {};
  for (const r of SEED_DATA) {
    if (r.history && r.history.length) moveInLookup[r.id] = r.history[0].date;
  }

  const existingKeys = new Set(
    archived.map(r => `${r.apt}||${(r.name||'').toLowerCase()}||${(r.archived_date||r.archivedDate||'').substring(0,7)}`)
  );

  let uid = Math.max(2000, ...archived.map(r=>r.id).concat(data.map(r=>r.id))) + 1;
  const toInsert = [];
  let skipped = 0;

  for (const r of active) {
    // Get move-in date
    let moveInStr = moveInLookup[r.id] || '';
    if (!moveInStr && r.history && r.history.length)
      moveInStr = r.history[r.history.length-1].date || '';
    let moveIn = moveInStr ? new Date(moveInStr+'T00:00:00') : null;
    if (!moveIn || isNaN(moveIn.getTime())) moveIn = new Date(`${year}-01-01`);

    // Start from Jan of target year or move-in month if in target year
    const yearStart = new Date(`${year}-01-01`);
    const effectiveStart = moveIn > yearStart ? moveIn : yearStart;

    // Only generate months within the target year up to maxMonth
    if (effectiveStart.getFullYear() > year) continue; // moved in after this year

    let m = (effectiveStart.getFullYear() === year) ? effectiveStart.getMonth() : 0;

    while (m <= maxMonth) {
      const monthStr  = `${year}-${String(m+1).padStart(2,'0')}`;
      const dateStr   = `${monthStr}-01`;
      const mName     = MONTHS[m];
      const key = `${r.apt}||${r.name.toLowerCase()}||${monthStr}`;

      if (!existingKeys.has(key)) {
        toInsert.push({
          id: uid++,
          apt: r.apt, owner: r.owner||null, name: r.name,
          type: r.type, rent: r.rent, balance: 0,
          due: dateStr,
          lease_end: new Date(year, m+1, 0).toISOString().split('T')[0],
          note: `${r.name} — ${mName} ${year} — $${r.rent.toLocaleString()}`,
          history: [{date:dateStr, text:`$${r.rent.toLocaleString()} — ${mName} ${year} monthly`}],
          archived: true,
          archived_date: dateStr,
        });
        existingKeys.add(key);
      } else {
        skipped++;
      }
      m++;
    }
  }

  if (toInsert.length === 0) {
    toast(`All ${year} LT records already exist (${skipped} skipped)`, 'success');
    return;
  }

  const batchSize = 50;
  for (let i = 0; i < toInsert.length; i += batchSize) {
    await saveAll(toInsert.slice(i, i+batchSize));
    toast(`Inserting… ${Math.min(i+batchSize, toInsert.length)} / ${toInsert.length}`);
  }

  await loadAll();
  renderHistory();
  toast(`✓ Created ${toInsert.length} monthly LT records for ${year}${skipped?' ('+skipped+' already existed)':''}`, 'success');
}

async function seedLT2025(){ await seedLTYear(2025); }
async function seedLT2026(){ await seedLTYear(2026); }

// ══════════════════════════════════════════════════════
//  ANALYTICS HELPERS
// ══════════════════════════════════════════════════════
function rentedDaysInMonth(r,y,m){
  if(!r.name||r.type==='available')return 0;
  const dim=daysInMonth(y,m);
  if(r.type==='long-term')return r.due?(new Date(r.due+'T00:00:00')>=new Date(y,m,1)?dim:0):dim;
  if(r.type==='month-to-month')return r.due?(new Date(r.due+'T00:00:00')>=new Date(y,m,1)?dim:0):dim;
  if(r.type==='short-stay'){
    if(!r.due)return dim;
    const co=new Date(r.due+'T00:00:00'),ms=new Date(y,m,1),me=new Date(y,m+1,0);
    if(co<ms)return 0;
    if(co<=me)return co.getDate();
    return dim;
  }
  return 0;
}
// Helper: sum payments from a history array for a given month string
function sumHistoryForMonth(history, mStr){
  return (history||[]).filter(h=>h.date&&h.date.startsWith(mStr)).reduce((s,h)=>{
    if(typeof h.amt==='number') return s+h.amt;
    const match=h.text.match(/\$([\d,]+(\.\d+)?)/);
    return s+(match?parseFloat(match[1].replace(/,/g,'')):0);
  },0);
}

function expectedInMonth(r,y,m){
  if(!r.name||r.type==='available')return 0;
  const now=new Date();
  const mStr=`${y}-${String(m+1).padStart(2,'0')}`;
  const isCurrent=(y===now.getFullYear()&&m===now.getMonth());

  if(isCurrent){
    if(rentedDaysInMonth(r,y,m)===0) return 0;
    // For short-stay spanning multiple months, return only this month's prorated portion
    if(r.type==='short-stay' && r.checkin && (r.lease_end||r.due)){
      const co = r.lease_end||r.due;
      const splits = calcProration(r.checkin, co, r.rent);
      const thisMonth = splits.find(s=>s.monthStr===mStr);
      return thisMonth ? thisMonth.portion : r.rent;
    }
    return r.rent;
  }

  // Past: check archive rows whose archived_date falls IN this month (short-stay style rows)
  const monthArchive=archived.filter(a=>
    a.apt===r.apt &&
    (a.name||'').toLowerCase()===(r.name||'').toLowerCase() &&
    (a.archived_date||a.archivedDate||'').startsWith(mStr)
  );
  if(monthArchive.length) return monthArchive.reduce((s,a)=>s+(a.rent||0),0);

  // Fall back: scan ALL archive rows for this tenant and sum history entries for this month
  const tenantArchive=archived.filter(a=>
    a.apt===r.apt &&
    (a.name||'').toLowerCase()===(r.name||'').toLowerCase()
  );
  const fromHistory=tenantArchive.reduce((s,a)=>s+sumHistoryForMonth(a.history,mStr),0);
  if(fromHistory>0) return fromHistory;

  return 0;
}

function collectedInMonth(r,y,m){
  if(!r.name||r.type==='available')return 0;
  const mStr=`${y}-${String(m+1).padStart(2,'0')}`;
  const now=new Date();
  const isCurrent=(y===now.getFullYear()&&m===now.getMonth());

  if(isCurrent){
    // Current month: check live history first
    const fromLive=sumHistoryForMonth(r.history,mStr);
    if(fromLive>0) return fromLive;
    // For short-stay spanning multiple months, return prorated portion
    if(r.type==='short-stay' && r.checkin && (r.lease_end||r.due)){
      const co = r.lease_end||r.due;
      const splits = calcProration(r.checkin, co, r.rent);
      const thisMonth = splits.find(s=>s.monthStr===mStr);
      if(thisMonth){
        // If balance=0, fully paid; otherwise prorate the collected portion
        if(r.balance===0) return thisMonth.portion;
        const totalPaid = Math.max(0, r.rent - r.balance);
        return Math.min(thisMonth.portion, totalPaid);
      }
    }
    return r.balance>0?Math.max(0,r.rent-r.balance):r.rent;
  }

  // Past months: check archive rows whose archived_date is in this month
  const monthArchive=archived.filter(a=>
    a.apt===r.apt &&
    (a.name||'').toLowerCase()===(r.name||'').toLowerCase() &&
    (a.archived_date||a.archivedDate||'').startsWith(mStr)
  );
  if(monthArchive.length) return monthArchive.reduce((s,a)=>s+(a.rent||0),0);

  // Fall back: scan ALL archive rows for this tenant and sum history entries for this month
  const tenantArchive=archived.filter(a=>
    a.apt===r.apt &&
    (a.name||'').toLowerCase()===(r.name||'').toLowerCase()
  );
  return tenantArchive.reduce((s,a)=>s+sumHistoryForMonth(a.history,mStr),0);
}

// ══════════════════════════════════════════════════════
//  DASHBOARD
// ══════════════════════════════════════════════════════
// ── Deduplicated active units (one row per apt, best booking) ──
function dedupActive(){
  const all = data.filter(r=>!r.archived);
  const today = new Date(); today.setHours(0,0,0,0);
  const aptMap = {};
  all.forEach(r=>{
    if(!aptMap[r.apt]){aptMap[r.apt]=r;return;}
    const ex=aptMap[r.apt];
    function score(x){
      if(x.type==='available'||!x.name) return 0;
      const ci=x.checkin?new Date(x.checkin+'T00:00:00'):null;
      const due=x.due?new Date(x.due+'T00:00:00'):null;
      if(ci&&due&&ci<=today&&due>=today) return 3;
      if(ci&&ci>today) return 2;
      if(due&&due>=today) return 1;
      return 0;
    }
    if(score(r)>score(ex)) aptMap[r.apt]=r;
  });
  return Object.values(aptMap);
}

// ══════════════════════════════════════════════════════
//  SHORT-TERM DASHBOARD (ST-only data)
// ══════════════════════════════════════════════════════
async function renderSTDashboard(){
  const active=dedupActive();
  const stAll=active.filter(r=>r.type==='short-stay');
  const stOcc=stAll.filter(r=>r.name);
  const stAvail=active.filter(r=>r.type==='available'||(!r.name&&r.type==='short-stay'));
  const stPool=[...stAll,...active.filter(r=>r.type==='available')];
  const totalRent=stOcc.reduce((s,r)=>s+r.rent,0);
  const totalBal=stOcc.reduce((s,r)=>s+r.balance,0);
  const occ_pct=stPool.length?Math.round(stOcc.length/stPool.length*100):0;

  // Collection data
  const now=new Date(),ty=now.getFullYear(),tm=now.getMonth();
  let coll=0,exp=0;stOcc.forEach(r=>{coll+=collectedInMonth(r,ty,tm);exp+=expectedInMonth(r,ty,tm);});
  const collPct=exp>0?Math.round(coll/exp*100):0;
  const dim=daysInMonth(ty,tm);

  // ── Hero KPI Cards ──
  document.getElementById('stDashKpis').innerHTML=`
    <div class="kpi-card kpi-hero kv-accent"><div class="kpi-label">ST Occupancy</div><div class="kpi-value">${occ_pct}%</div><div class="kpi-sub">${stOcc.length} of ${stPool.length} units</div></div>
    <div class="kpi-card kpi-hero kv-green"><div class="kpi-label">ST Revenue</div><div class="kpi-value">${fmtMoney(totalRent)}</div><div class="kpi-sub">expected this month</div></div>
    <div class="kpi-card kpi-hero kv-red"><div class="kpi-label">Outstanding</div><div class="kpi-value">${fmtMoney(totalBal)}</div><div class="kpi-sub">unpaid balance</div></div>
    <div class="kpi-card kpi-hero kv-blue"><div class="kpi-label">Collected</div><div class="kpi-value">${collPct}%</div><div class="kpi-sub">${fmtMoney(coll)} of ${fmtMoney(exp)}</div></div>
    <div class="kpi-card kpi-hero kv-orange"><div class="kpi-label">Available</div><div class="kpi-value">${stAvail.length}</div><div class="kpi-sub">ST units ready to rent</div></div>`;

  // ── Fetch automation data ──
  let bookingAlerts={checkIns:[],checkOuts:[]};
  try { bookingAlerts = await checkBookingAlerts(); } catch(e){ console.error('ST alerts error:',e); }

  // ── ST Check-ins only ──
  const stCI=bookingAlerts.checkIns.filter(ci=>{const u=data.find(x=>x.apt===ci.apt);return u&&u.type==='short-stay';});
  const ciEl=document.getElementById('stDashCheckIns');
  if(ciEl){
    if(stCI.length===0){ciEl.innerHTML='<div class="dash-empty-state">✓ No ST check-ins in the next 3 days</div>';}
    else{ciEl.innerHTML=stCI.map(ci=>{const u=data.find(x=>x.apt===ci.apt);return`<div class="dash-move-item" style="cursor:pointer" onclick="drillDownToTenant('${ci.apt}','${(ci.name||'').replace(/'/g,"\\'")}')"><span class="dash-move-apt">${ci.apt}</span><span class="dash-move-name">${clickablePersonName(ci.name,u,'')}</span><span class="dash-move-when ci">${ci.daysAway===0?'Today':ci.daysAway===1?'Tomorrow':'In '+ci.daysAway+'d'}</span></div>`;}).join('');}
  }

  // ── ST Check-outs only ──
  const stCO=bookingAlerts.checkOuts.filter(co=>{const u=data.find(x=>x.apt===co.apt);return u&&u.type==='short-stay';});
  const coEl=document.getElementById('stDashCheckOuts');
  if(coEl){
    if(stCO.length===0){coEl.innerHTML='<div class="dash-empty-state">✓ No ST check-outs in the next 3 days</div>';}
    else{coEl.innerHTML=stCO.map(co=>{const u=data.find(x=>x.apt===co.apt);return`<div class="dash-move-item" style="cursor:pointer" onclick="drillDownToTenant('${co.apt}','${(co.name||'').replace(/'/g,"\\'")}')"><span class="dash-move-apt">${co.apt}</span><span class="dash-move-name">${clickablePersonName(co.name,u,'')}</span><span class="dash-move-when co">${co.daysAway===0?'Today':co.daysAway===1?'Tomorrow':'In '+co.daysAway+'d'}</span></div>`;}).join('');}
  }

  // ── ST Badge: same-day check-ins + check-outs ──
  const todayCI = stCI.filter(ci => ci.daysAway === 0).length;
  const todayCO = stCO.filter(co => co.daysAway === 0).length;
  const stTotal = todayCI + todayCO;
  const stBadge = document.getElementById('stBadge');
  if (stBadge) { stBadge.textContent = stTotal; stBadge.style.display = stTotal > 0 ? 'inline' : 'none'; }

  // ── Message Center Badge ──
  if (typeof updateMsgCenterBadge === 'function') updateMsgCenterBadge();

  // ── ST Revenue Summary ──
  const paidST=stOcc.filter(r=>r.balance<=0).length;
  const avgRent=stOcc.length?Math.round(totalRent/stOcc.length):0;
  document.getElementById('stDashRevenue').innerHTML=`
    <div class="dash-revenue-grid">
      <div class="dash-rev-item"><div class="dash-rev-label">Collected</div><div class="dash-rev-value green">${fmtMoney(coll)}</div></div>
      <div class="dash-rev-item"><div class="dash-rev-label">Outstanding</div><div class="dash-rev-value red">${fmtMoney(Math.max(0,exp-coll))}</div></div>
      <div class="dash-rev-item"><div class="dash-rev-label">Paid Units</div><div class="dash-rev-value">${paidST} of ${stOcc.length}</div></div>
      <div class="dash-rev-item"><div class="dash-rev-label">Avg Rent</div><div class="dash-rev-value">${fmtMoney(avgRent)}</div></div>
    </div>`;

  // ── ST Needs Attention ──
  const urgent=stOcc.filter(r=>dueStatus(r)==='overdue'||dueStatus(r)==='soon').sort((a,b)=>(daysUntil(a.due)||0)-(daysUntil(b.due)||0)).slice(0,7);
  document.getElementById('stDashUrgency').innerHTML=urgent.length
    ?urgent.map(r=>{const d=daysUntil(r.due);const c=d<0?'overdue':'soon';return`<div class="urgency-item"><span class="urgency-apt">${r.apt}</span><span class="urgency-name">${r.name}</span><span class="urgency-days ${c}">${d<0?Math.abs(d)+'d late':'in '+d+'d'}</span></div>`;}).join('')
    :'<div class="dash-empty-state">✓ No urgent ST items</div>';

  // ── ST Performance ──
  const ssNights=stOcc.reduce((s,r)=>s+rentedDaysInMonth(r,ty,tm),0);
  const ssMaxNights=dim*stPool.length;
  const ssOccRate=ssMaxNights>0?(ssNights/ssMaxNights*100):0;
  const ssADR=ssNights>0?coll/ssNights:0;
  const ssRevPAR=ssMaxNights>0?coll/ssMaxNights:0;
  document.getElementById('stDashPerformance').innerHTML=`
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:14px;">
      <div class="r-kpi" style="border-top:3px solid #c0711a;"><div class="r-kpi-label">Rental Revenue</div><div class="r-kpi-value" style="color:#c0711a;">${fmtMoney(coll)}</div><div class="r-kpi-sub">${stOcc.length} occupied units</div></div>
      <div class="r-kpi" style="border-top:3px solid #c0711a;"><div class="r-kpi-label">Nights Booked</div><div class="r-kpi-value" style="color:#c0711a;">${ssNights}</div><div class="r-kpi-sub">of ${ssMaxNights} possible</div></div>
      <div class="r-kpi" style="border-top:3px solid #c0711a;"><div class="r-kpi-label">Occupancy Rate</div><div class="r-kpi-value" style="color:#c0711a;">${ssOccRate.toFixed(1)}%</div><div class="r-kpi-sub">${stPool.length} units × ${dim} days</div></div>
      <div class="r-kpi" style="border-top:3px solid #c0711a;"><div class="r-kpi-label">Avg Daily Rate</div><div class="r-kpi-value" style="color:#c0711a;">${fmtMoney(ssADR)}</div><div class="r-kpi-sub">revenue ÷ occupied nights</div></div>
      <div class="r-kpi" style="border-top:3px solid #c0711a;"><div class="r-kpi-label">RevPAR</div><div class="r-kpi-value" style="color:#c0711a;">${fmtMoney(ssRevPAR)}</div><div class="r-kpi-sub">revenue ÷ all possible nights</div></div>
    </div>
    <div style="font-size:10px;color:var(--text3);margin-top:8px;">Based on ${stPool.length} units (${stOcc.length} short-stay + ${stPool.length-stOcc.length} available) · ${dim}-day month</div>`;

  // ── ST Upcoming Checkouts — 30 days (short-stay only) ──
  const upcoming=active.filter(r=>r.type==='short-stay'&&r.name&&(r.lease_end||r.due)).map(r=>{const endDate=r.lease_end||r.due;return{...r,_endDate:endDate,d:daysUntil(endDate)};}).filter(r=>r.d>=0&&r.d<=30).sort((a,b)=>a.d-b.d);
  document.getElementById('stDashUpcoming').innerHTML=upcoming.length
    ?`<table style="width:100%;border-collapse:collapse">${upcoming.map(r=>`<tr style="border-bottom:1px solid var(--border);"><td style="padding:8px 0;font-family:'Playfair Display',serif;font-size:16px;font-weight:700;color:var(--accent2);width:48px">${r.apt}</td><td style="padding:8px;font-size:12px;color:var(--text2)">${r.name||'—'}</td><td>${typeBadge(r.type)}</td><td style="padding:8px;font-size:12px;color:var(--text3)">${fmtDate(r._endDate)}</td><td style="padding:8px;font-size:11px;color:var(--orange);font-weight:500;text-align:right">in ${r.d}d</td></tr>`).join('')}</table>`
    :'<div style="color:var(--text3);font-size:12px;padding:8px 0">No ST checkouts in the next 30 days.</div>';
}

// ══════════════════════════════════════════════════════
//  PARKING ADMIN MODULE
// ══════════════════════════════════════════════════════
var PK_API = 'https://parking.willowpa.com/api.php';
var PK_ADMIN_TOKEN = (typeof CONFIG !== 'undefined' && CONFIG.ADMIN_TOKEN) || '';
var _pkBookings = [];
var _pkBuildings = [];
var _pkCoupons = [];

function showParkingSection(sec) {
  ['pkBookingsSection','pkBuildingsSection','pkCouponsSection','pkReceiptsSection'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
  var target = document.getElementById('pk' + sec.charAt(0).toUpperCase() + sec.slice(1) + 'Section');
  if (target) target.style.display = 'block';

  // Load data for the section
  if (sec === 'bookings') WPA_pkLoadBookings();
  if (sec === 'buildings') WPA_pkLoadBuildings();
  if (sec === 'coupons') WPA_pkLoadCoupons();
}

function pkFetch(action, method, body) {
  var opts = {
    method: method || 'GET',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + PK_ADMIN_TOKEN }
  };
  if (body) opts.body = JSON.stringify(body);
  return fetch(PK_API + '?action=' + action, opts).then(function(r) { return r.json(); });
}

function WPA_pkRefresh() {
  WPA_pkLoadStats();
  // Refresh whichever section is visible
  if (document.getElementById('pkBookingsSection').style.display !== 'none') WPA_pkLoadBookings();
  if (document.getElementById('pkBuildingsSection').style.display !== 'none') WPA_pkLoadBuildings();
  if (document.getElementById('pkCouponsSection').style.display !== 'none') WPA_pkLoadCoupons();
}

// ── Stats ──
function WPA_pkLoadStats() {
  pkFetch('admin-stats').then(function(d) {
    if (!d.ok) return;
    var s = d.stats;
    document.getElementById('pk-stat-active').textContent = s.active || 0;
    document.getElementById('pk-stat-revenue').textContent = '$' + (s.month_revenue || 0).toLocaleString();
    document.getElementById('pk-stat-total').textContent = s.total_bookings || 0;
    // Update dashboard cards too
    var el = document.getElementById('dash-pk-assigned');
    if (el) el.textContent = s.active || 0;
    var el2 = document.getElementById('dash-pk-available');
    if (el2) el2.textContent = s.total_bookings || 0;
  }).catch(function() {});
}

// ── Bookings ──
function WPA_pkLoadBookings() {
  pkFetch('admin-bookings').then(function(d) {
    if (!d.ok) return;
    _pkBookings = d.bookings || [];
    WPA_pkFilterBookings();
    // Count expiring in next 3 days
    var today = new Date().toISOString().split('T')[0];
    var in3 = new Date(Date.now() + 3*86400000).toISOString().split('T')[0];
    var expiring = _pkBookings.filter(function(b) { return b.end_date >= today && b.end_date <= in3 && b.status === 'active'; });
    document.getElementById('pk-stat-expiring').textContent = expiring.length;
  });
}

function WPA_pkFilterBookings() {
  var search = (document.getElementById('pkSearchBooking').value || '').toLowerCase();
  var status = document.getElementById('pkFilterStatus').value;
  var today = new Date().toISOString().split('T')[0];

  var filtered = _pkBookings.filter(function(b) {
    var isActive = b.end_date >= today && b.status === 'active';
    if (status === 'active' && !isActive) return false;
    if (status === 'expired' && isActive) return false;
    if (search) {
      var hay = (b.license_plate + ' ' + b.unit_number + ' ' + b.guest_name + ' ' + b.building_name + ' ' + b.car_make + ' ' + b.car_color).toLowerCase();
      if (hay.indexOf(search) === -1) return false;
    }
    return true;
  });

  var tbody = document.getElementById('pkBookingsBody');
  if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;color:var(--text3);padding:20px">No bookings found</td></tr>';
    return;
  }
  tbody.innerHTML = filtered.map(function(b) {
    var isExpired = b.end_date < today;
    return '<tr' + (isExpired ? ' style="opacity:.6"' : '') + '>' +
      '<td>' + esc(b.building_name) + '</td>' +
      '<td><strong>' + esc(b.unit_number) + '</strong></td>' +
      '<td>' + esc(b.guest_name || '—') + '</td>' +
      '<td>' + esc(b.car_make) + ' ' + esc(b.car_color) + '</td>' +
      '<td><strong>' + esc(b.license_plate) + '</strong></td>' +
      '<td>' + esc(b.plan_label) + '</td>' +
      '<td style="font-size:11px">' + b.start_date + '<br>to ' + b.end_date + '</td>' +
      '<td>$' + parseFloat(b.amount).toFixed(2) + (b.coupon_code ? '<br><span style="font-size:10px;color:var(--green)">🏷 ' + esc(b.coupon_code) + '</span>' : '') + '</td>' +
      '<td><a href="https://parking.willowpa.com/receipt.php?id=' + b.id + '" target="_blank" style="color:var(--accent);font-size:11px">🧾 Receipt</a></td>' +
      '</tr>';
  }).join('');
}

// ── Buildings ──
function WPA_pkLoadBuildings() {
  pkFetch('admin-buildings').then(function(d) {
    if (!d.ok) return;
    _pkBuildings = d.buildings || [];
    WPA_pkRenderBuildings();
  });
}

function WPA_pkRenderBuildings() {
  var el = document.getElementById('pkBuildingsList');
  if (_pkBuildings.length === 0) {
    el.innerHTML = '<div style="color:var(--text3);font-size:13px;padding:20px;text-align:center">No buildings configured yet. Add one above.</div>';
    return;
  }
  el.innerHTML = _pkBuildings.map(function(b) {
    var plans = (b.plans || []).map(function(p) {
      return '<span style="display:inline-block;background:var(--surface2);border:1px solid var(--border);border-radius:6px;padding:4px 8px;font-size:11px;margin:2px">' + p.days + 'd — $' + parseFloat(p.price).toFixed(2) + (p.label ? ' (' + esc(p.label) + ')' : '') + '</span>';
    }).join(' ');
    return '<div class="dash-panel" style="margin-bottom:12px;border-left:4px solid ' + (b.active ? 'var(--purple)' : 'var(--text3)') + '">' +
      '<div style="display:flex;justify-content:space-between;align-items:start">' +
        '<div><h3 style="border:none;padding:0;margin:0 0 4px">🏢 ' + esc(b.name) + '</h3>' +
          (b.address ? '<div style="font-size:12px;color:var(--text3);margin-bottom:8px">' + esc(b.address) + '</div>' : '') +
          '<div>' + (plans || '<span style="font-size:11px;color:var(--text3)">No plans</span>') + '</div>' +
        '</div>' +
        '<div style="display:flex;gap:6px">' +
          '<button onclick="WPA_pkEditBuilding(\'' + b.id + '\')" class="btn-subtle" style="padding:4px 10px;font-size:11px">✏ Edit</button>' +
          '<button onclick="WPA_pkDeleteBuilding(\'' + b.id + '\')" class="btn-subtle" style="padding:4px 10px;font-size:11px;color:var(--red)">✕</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  }).join('');
}

function WPA_pkShowBuildingForm(id) {
  document.getElementById('pkBuildingForm').style.display = 'block';
  document.getElementById('pkBldId').value = '';
  document.getElementById('pkBldName').value = '';
  document.getElementById('pkBldAddr').value = '';
  document.getElementById('pkBldPlans').innerHTML = '';
  document.getElementById('pkBldFormTitle').textContent = 'Add Building';
  WPA_pkAddPlanRow(); // Start with one empty plan row
}

function WPA_pkEditBuilding(id) {
  var b = _pkBuildings.find(function(x) { return x.id === id; });
  if (!b) return;
  document.getElementById('pkBuildingForm').style.display = 'block';
  document.getElementById('pkBldId').value = b.id;
  document.getElementById('pkBldName').value = b.name;
  document.getElementById('pkBldAddr').value = b.address || '';
  document.getElementById('pkBldFormTitle').textContent = 'Edit Building';
  document.getElementById('pkBldPlans').innerHTML = '';
  (b.plans || []).forEach(function(p) { WPA_pkAddPlanRow(p.days, p.price, p.label); });
  if ((b.plans || []).length === 0) WPA_pkAddPlanRow();
}

var _pkPlanRowId = 0;
function WPA_pkAddPlanRow(days, price, label) {
  var rid = _pkPlanRowId++;
  var el = document.getElementById('pkBldPlans');
  var row = document.createElement('div');
  row.id = 'pk-plan-row-' + rid;
  row.style.cssText = 'display:flex;gap:8px;align-items:center;margin-bottom:6px';
  row.innerHTML =
    '<input type="number" placeholder="Days" value="' + (days || '') + '" class="pk-admin-input" style="width:70px" data-field="days">' +
    '<input type="number" step="0.01" placeholder="Price $" value="' + (price || '') + '" class="pk-admin-input" style="width:90px" data-field="price">' +
    '<input type="text" placeholder="Label (e.g. 1 Month)" value="' + (label || '') + '" class="pk-admin-input" style="flex:1" data-field="label">' +
    '<button onclick="this.parentElement.remove()" style="background:none;border:none;color:var(--red);font-size:16px;cursor:pointer;padding:4px">✕</button>';
  el.appendChild(row);
}

function WPA_pkSaveBuilding() {
  var name = document.getElementById('pkBldName').value.trim();
  if (!name) { alert('Building name is required'); return; }
  var plans = [];
  document.querySelectorAll('#pkBldPlans > div').forEach(function(row) {
    var d = row.querySelector('[data-field=days]').value;
    var p = row.querySelector('[data-field=price]').value;
    var l = row.querySelector('[data-field=label]').value;
    if (d && p) plans.push({ days: parseInt(d), price: parseFloat(p), label: l || '' });
  });
  var id = document.getElementById('pkBldId').value;
  var method = id ? 'PUT' : 'POST';
  var body = { id: id, name: name, address: document.getElementById('pkBldAddr').value.trim(), plans: plans, active: true };
  pkFetch('admin-buildings', method, body).then(function(d) {
    if (d.ok) {
      document.getElementById('pkBuildingForm').style.display = 'none';
      WPA_pkLoadBuildings();
    } else {
      alert('Error: ' + (d.error || 'Unknown'));
    }
  });
}

function WPA_pkDeleteBuilding(id) {
  if (!confirm('Delete this building? This cannot be undone.')) return;
  pkFetch('admin-buildings&id=' + id, 'DELETE').then(function() { WPA_pkLoadBuildings(); });
}

// ── Coupons ──
function WPA_pkLoadCoupons() {
  pkFetch('admin-coupons').then(function(d) {
    if (!d.ok) return;
    _pkCoupons = d.coupons || [];
    WPA_pkRenderCoupons();
  });
}

function WPA_pkRenderCoupons() {
  var el = document.getElementById('pkCouponsList');
  if (_pkCoupons.length === 0) {
    el.innerHTML = '<div style="color:var(--text3);font-size:13px;padding:20px;text-align:center">No coupons created yet.</div>';
    return;
  }
  el.innerHTML = _pkCoupons.map(function(c) {
    var typeLabel = c.type === 'percent' ? c.value + '% off' : c.type === 'fixed' ? '$' + c.value + ' off' : c.value + ' free days';
    var statusBg = c.active ? 'var(--green-bg)' : 'var(--surface2)';
    var statusColor = c.active ? 'var(--green)' : 'var(--text3)';
    return '<div class="dash-panel" style="margin-bottom:10px;border-left:4px solid ' + (c.active ? 'var(--green)' : 'var(--text3)') + '">' +
      '<div style="display:flex;justify-content:space-between;align-items:center">' +
        '<div>' +
          '<span style="font-family:monospace;font-size:16px;font-weight:700;color:var(--accent2)">' + esc(c.code) + '</span>' +
          '<span style="margin-left:10px;font-size:12px;color:var(--text2)">' + typeLabel + '</span>' +
          (c.description ? '<span style="margin-left:10px;font-size:11px;color:var(--text3)">— ' + esc(c.description) + '</span>' : '') +
          '<div style="font-size:11px;color:var(--text3);margin-top:4px">' +
            'Used: ' + (c.used || 0) + (c.max_uses ? '/' + c.max_uses : ' (unlimited)') +
            (c.expires ? ' · Expires: ' + c.expires : '') +
          '</div>' +
        '</div>' +
        '<div style="display:flex;gap:6px;align-items:center">' +
          '<span style="padding:3px 8px;border-radius:4px;font-size:10px;font-weight:600;background:' + statusBg + ';color:' + statusColor + '">' + (c.active ? 'Active' : 'Disabled') + '</span>' +
          '<button onclick="WPA_pkToggleCoupon(\'' + c.id + '\',' + !c.active + ')" class="btn-subtle" style="padding:4px 8px;font-size:10px">' + (c.active ? 'Disable' : 'Enable') + '</button>' +
          '<button onclick="WPA_pkDeleteCoupon(\'' + c.id + '\')" class="btn-subtle" style="padding:4px 8px;font-size:10px;color:var(--red)">✕</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  }).join('');
}

function WPA_pkShowCouponForm() {
  document.getElementById('pkCouponForm').style.display = 'block';
  document.getElementById('pkCpnId').value = '';
  document.getElementById('pkCpnCode').value = '';
  document.getElementById('pkCpnType').value = 'percent';
  document.getElementById('pkCpnValue').value = '';
  document.getElementById('pkCpnDesc').value = '';
  document.getElementById('pkCpnMaxUses').value = '0';
  document.getElementById('pkCpnExpires').value = '';
}

function WPA_pkSaveCoupon() {
  var code = document.getElementById('pkCpnCode').value.trim();
  var value = document.getElementById('pkCpnValue').value;
  if (!code || !value) { alert('Code and value are required'); return; }
  pkFetch('admin-coupons', 'POST', {
    code: code,
    type: document.getElementById('pkCpnType').value,
    value: parseFloat(value),
    description: document.getElementById('pkCpnDesc').value.trim(),
    max_uses: parseInt(document.getElementById('pkCpnMaxUses').value) || 0,
    expires: document.getElementById('pkCpnExpires').value || ''
  }).then(function(d) {
    if (d.ok) {
      document.getElementById('pkCouponForm').style.display = 'none';
      WPA_pkLoadCoupons();
    }
  });
}

function WPA_pkToggleCoupon(id, active) {
  pkFetch('admin-coupons', 'PUT', { id: id, active: active }).then(function() { WPA_pkLoadCoupons(); });
}

function WPA_pkDeleteCoupon(id) {
  if (!confirm('Delete this coupon?')) return;
  pkFetch('admin-coupons&id=' + id, 'DELETE').then(function() { WPA_pkLoadCoupons(); });
}

// ── Receipt Lookup ──
function WPA_pkSearchReceipt() {
  var q = (document.getElementById('pkReceiptSearch').value || '').trim().toLowerCase();
  if (!q) return;
  var el = document.getElementById('pkReceiptResult');
  el.innerHTML = '<div style="color:var(--text3);padding:10px;font-size:12px">Searching...</div>';

  pkFetch('admin-bookings').then(function(d) {
    if (!d.ok) { el.innerHTML = '<div style="color:var(--red)">Error loading bookings</div>'; return; }
    var results = (d.bookings || []).filter(function(b) {
      return b.id.toLowerCase().indexOf(q) >= 0 ||
             b.license_plate.toLowerCase().indexOf(q) >= 0 ||
             b.unit_number.toLowerCase().indexOf(q) >= 0 ||
             (b.guest_name || '').toLowerCase().indexOf(q) >= 0;
    }).slice(0, 10);

    if (results.length === 0) {
      el.innerHTML = '<div style="color:var(--text3);padding:10px;font-size:12px">No results found.</div>';
      return;
    }
    el.innerHTML = results.map(function(b) {
      return '<div style="border:1px solid var(--border);border-radius:10px;padding:14px;margin-bottom:10px;background:var(--surface2)">' +
        '<div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:8px">' +
          '<div><strong>' + esc(b.building_name) + ' #' + esc(b.unit_number) + '</strong>' +
            (b.guest_name ? ' — ' + esc(b.guest_name) : '') +
          '</div>' +
          '<a href="https://parking.willowpa.com/receipt.php?id=' + b.id + '" target="_blank" class="btn-backup" style="padding:6px 12px;font-size:11px;text-decoration:none">🧾 View & Print Receipt</a>' +
        '</div>' +
        '<div style="font-size:12px;color:var(--text2)">' +
          '<span style="margin-right:12px">🚗 ' + esc(b.car_make) + ' ' + esc(b.car_color) + ' <strong>' + esc(b.license_plate) + '</strong></span>' +
          '<span style="margin-right:12px">📅 ' + b.start_date + ' → ' + b.end_date + '</span>' +
          '<span>💰 $' + parseFloat(b.amount).toFixed(2) + '</span>' +
        '</div>' +
        '<div style="font-size:10px;color:var(--text3);margin-top:4px">ID: ' + b.id + '</div>' +
      '</div>';
    }).join('');
  });
}

// Load parking stats when module loads
function initParkingModule() {
  WPA_pkLoadStats();
}

// ══════════════════════════════════════════════════════
//  DASHBOARD TASKS SYSTEM
// ══════════════════════════════════════════════════════
var WPA_TASKS = JSON.parse(localStorage.getItem('wpa_tasks')||'[]');
var _taskNextId = WPA_TASKS.length ? Math.max(...WPA_TASKS.map(t=>t.id))+1 : 1;

function toggleDashTaskForm(){
  const f=document.getElementById('dashTaskForm');
  if(!f) return;
  const vis=f.style.display!=='none';
  f.style.display=vis?'none':'block';
  if(!vis){
    document.getElementById('dashTaskTitle').value='';
    document.getElementById('dashTaskDate').value=today();
    document.getElementById('dashTaskPriority').value='medium';
    document.getElementById('dashTaskTitle').focus();
  }
}

function addDashTask(){
  const title=document.getElementById('dashTaskTitle').value.trim();
  if(!title){ alert('Enter a task description'); return; }
  const dt=document.getElementById('dashTaskDate').value||today();
  const pri=document.getElementById('dashTaskPriority').value||'medium';
  WPA_TASKS.push({id:_taskNextId++, title:title, date:dt, priority:pri, done:false, created:today()});
  saveDashTasks();
  document.getElementById('dashTaskForm').style.display='none';
  renderDashTasks();
}

function toggleTaskDone(id){
  const t=WPA_TASKS.find(x=>x.id===id);
  if(t){ t.done=!t.done; t.completedAt=t.done?today():null; saveDashTasks(); renderDashTasks(); }
}

function deleteDashTask(id){
  WPA_TASKS=WPA_TASKS.filter(x=>x.id!==id);
  saveDashTasks();
  renderDashTasks();
}

function saveDashTasks(){
  localStorage.setItem('wpa_tasks',JSON.stringify(WPA_TASKS));
}

function renderDashTasks(){
  const el=document.getElementById('dashTasks');
  if(!el) return;
  const priOrder={urgent:0,high:1,medium:2,low:3};
  const pending=WPA_TASKS.filter(t=>!t.done).sort((a,b)=>(priOrder[a.priority]||2)-(priOrder[b.priority]||2));
  const done=WPA_TASKS.filter(t=>t.done).sort((a,b)=>(b.completedAt||'').localeCompare(a.completedAt||''));
  const td=today();
  if(pending.length===0 && done.length===0){
    el.innerHTML='<div class="dash-empty-state">No tasks yet — click + Add to create one</div>';
    return;
  }
  let h='';
  const renderTask=(t)=>{
    const isOverdue=!t.done && t.date && t.date<td;
    const isToday=!t.done && t.date===td;
    const dueCls=isOverdue?'overdue':isToday?'today':'';
    const dueLabel=t.date?(isToday?'Today':isOverdue?fmtDateShort(t.date)+' !':fmtDateShort(t.date)):'';
    return `<div class="dash-task-item">
      <div class="dash-task-check ${t.done?'done':''}" onclick="toggleTaskDone(${t.id})">${t.done?'✓':''}</div>
      <span class="dash-task-text ${t.done?'done':''}">${t.title}</span>
      <div class="dash-task-meta">
        ${dueLabel?`<span class="dash-task-due ${dueCls}">${dueLabel}</span>`:''}
        ${!t.done?`<span class="dash-task-pri ${t.priority}">${t.priority}</span>`:''}
      </div>
      <span class="dash-task-del" onclick="deleteDashTask(${t.id})" title="Delete">✕</span>
    </div>`;
  };
  pending.forEach(t=>{ h+=renderTask(t); });
  if(done.length>0){
    h+=`<div style="font-size:10px;color:var(--text3);padding:6px 0 2px;margin-top:4px;border-top:1px solid var(--border);">Completed (${done.length})</div>`;
    done.slice(0,3).forEach(t=>{ h+=renderTask(t); });
    if(done.length>3) h+=`<div style="text-align:center;font-size:10px;color:var(--text3);padding:4px 0;">+${done.length-3} more done</div>`;
  }
  el.innerHTML=h;
}

function fmtDateShort(d){
  if(!d) return '';
  const parts=d.split('-');
  if(parts.length!==3) return d;
  return parseInt(parts[1])+'/'+parseInt(parts[2]);
}

async function renderDashboard(){
  updateLastSynced();
  const active=dedupActive();
  const occ=active.filter(r=>r.type!=='available'&&r.name);
  const totalRent=occ.reduce((s,r)=>s+r.rent,0);
  const totalBal=occ.reduce((s,r)=>s+r.balance,0);
  const avail=active.filter(r=>r.type==='available'||!r.name);
  const occ_pct=active.length?Math.round(occ.length/active.length*100):0;

  // Collection data
  const now=new Date(),ty=now.getFullYear(),tm=now.getMonth();
  let coll=0,exp=0;occ.forEach(r=>{coll+=collectedInMonth(r,ty,tm);exp+=expectedInMonth(r,ty,tm);});
  const collPct=exp>0?Math.round(coll/exp*100):0;

  // ── Hero KPI Cards (large, bold numbers) ──
  document.getElementById('dashKpis').innerHTML=`
    <div class="kpi-card kpi-hero kv-accent"><div class="kpi-label">Occupancy</div><div class="kpi-value">${occ_pct}%</div><div class="kpi-sub">${occ.length} of ${active.length} units</div></div>
    <div class="kpi-card kpi-hero kv-green"><div class="kpi-label">Revenue</div><div class="kpi-value">${fmtMoney(totalRent)}</div><div class="kpi-sub">expected this month</div></div>
    <div class="kpi-card kpi-hero kv-red"><div class="kpi-label">Outstanding</div><div class="kpi-value">${fmtMoney(totalBal)}</div><div class="kpi-sub">unpaid balance</div></div>
    <div class="kpi-card kpi-hero kv-blue"><div class="kpi-label">Collected</div><div class="kpi-value">${collPct}%</div><div class="kpi-sub">${fmtMoney(coll)} of ${fmtMoney(exp)}</div></div>
    <div class="kpi-card kpi-hero kv-orange"><div class="kpi-label">Available</div><div class="kpi-value">${avail.length}</div><div class="kpi-sub">units ready to rent</div></div>`;

  // ── Fetch automation data in parallel ──
  let bookingAlerts={checkIns:[],checkOuts:[]}, remindersNeeded=[], monthlyReport={}, recentReminders=[];
  try {
    [bookingAlerts, remindersNeeded, monthlyReport, recentReminders] = await Promise.all([
      checkBookingAlerts(),
      getTenantsNeedingReminders(),
      generateMonthlyReport(),
      getRecentReminders(10)
    ]);
  } catch(e){ console.error('Dashboard automation data error:',e); }

  // ── Work Orders Due Today + Past Due + Waiting Parts ──
  const woTodayEl=document.getElementById('dashWOToday');
  if(woTodayEl){
    const todayStr=today();
    const ftJobs=(typeof FT_state!=='undefined'&&FT_state.jobs)?FT_state.jobs:[];
    const activeJobs=ftJobs.filter(j=>j.status!=='complete'&&j.status!=='closed');
    const woPastDue=activeJobs.filter(j=>j.date && j.date<todayStr).sort((a,b)=>a.date.localeCompare(b.date));
    const woToday=activeJobs.filter(j=>j.date===todayStr);
    const woWaiting=activeJobs.filter(j=>j.status==='waiting_parts'&&j.date!==todayStr&&!(j.date&&j.date<todayStr));
    const allWO=[...woPastDue,...woToday,...woWaiting];
    if(allWO.length===0){
      woTodayEl.innerHTML='<div class="dash-empty-state">✓ No work orders need attention</div>';
    } else {
      let woH='';
      const renderWoGroup=(label,color,list)=>{
        if(list.length===0) return '';
        let g=`<div class="dash-wo-group-label" style="color:${color}">${label} (${list.length})</div>`;
        g+=list.map(j=>{
          const prop=(typeof getProp==='function')?getProp(j.propId):null;
          const sClass=j.status==='open'?'open':j.status==='in_progress'?'in_progress':'waiting_parts';
          const sLabel={'open':'Open','in_progress':'In Progress','waiting_parts':'Parts','pending_approval':'Pending'}[j.status]||j.status;
          return `<div class="dash-wo-item" style="cursor:pointer" onclick="switchModule('techtrack')">
            <span class="dash-wo-num">${j.woNum||'#'+j.id}</span>
            <span class="dash-wo-title">${j.title||(prop?prop.name:'Work Order')}</span>
            <span class="dash-wo-status ${sClass}">${sLabel}</span>
          </div>`;
        }).join('');
        return g;
      };
      woH+=renderWoGroup('⚠ Past Due','var(--red)',woPastDue);
      woH+=renderWoGroup('📅 Today','var(--orange)',woToday);
      woH+=renderWoGroup('⏳ Waiting for Parts','var(--purple)',woWaiting);
      woTodayEl.innerHTML=woH;
    }
  }

  // ── Tasks ──
  renderDashTasks();

  // ── Check-ins ──
  const ciEl=document.getElementById('dashCheckIns');
  if(ciEl){
    if(bookingAlerts.checkIns.length === 0){
      ciEl.innerHTML='<div class="dash-empty-state">✓ No check-ins in the next 3 days</div>';
    } else {
      ciEl.innerHTML=bookingAlerts.checkIns.map(ci=>{
        const unitRec = data.find(u=>u.apt===ci.apt);
        return `<div class="dash-move-item">
          <span class="dash-move-apt">${ci.apt}</span>
          <span class="dash-move-name">${clickablePersonName(ci.name, unitRec, '')}</span>
          <span class="dash-move-when ci">${ci.daysAway===0?'Today':ci.daysAway===1?'Tomorrow':'In '+ci.daysAway+'d'}</span>
        </div>`;
      }).join('');
    }
  }

  // ── Check-outs ──
  const coEl=document.getElementById('dashCheckOuts');
  if(coEl){
    if(bookingAlerts.checkOuts.length === 0){
      coEl.innerHTML='<div class="dash-empty-state">✓ No check-outs in the next 3 days</div>';
    } else {
      coEl.innerHTML=bookingAlerts.checkOuts.map(co=>{
        const unitRec = data.find(u=>u.apt===co.apt);
        return `<div class="dash-move-item">
          <span class="dash-move-apt">${co.apt}</span>
          <span class="dash-move-name">${clickablePersonName(co.name, unitRec, '')}</span>
          <span class="dash-move-when co">${co.daysAway===0?'Today':co.daysAway===1?'Tomorrow':'In '+co.daysAway+'d'}</span>
        </div>`;
      }).join('');
    }
  }

  // ── Reminders Due ──
  let remHtml = '';
  if(remindersNeeded.length === 0){
    remHtml = '<div class="dash-empty-state">✓ All caught up — no reminders needed</div>';
  } else {
    remHtml = `<button onclick="runRemindersClick()" class="dash-action-btn">✉ Send All (${remindersNeeded.length})</button>`;
    remHtml += '<div class="dash-reminder-list">';
    remHtml += remindersNeeded.slice(0,8).map(r=>{
      const typeColor = r.reminderType.startsWith('overdue')?'var(--red)':r.reminderType==='due'?'var(--orange)':'var(--accent)';
      const typeLabel = r.reminderType==='pre-3'?'3d before':r.reminderType==='pre-1'?'1d before':r.reminderType==='due'?'Due today':r.reminderType.replace('overdue-','')+'d late';
      return `<div class="dash-reminder-item">
        <div class="dash-reminder-info">
          <span class="dash-reminder-apt">${r.unit.apt}</span>
          <span class="dash-reminder-name">${clickablePersonName(r.unit.name, r.unit, '')}</span>
          <span class="dash-reminder-type" style="color:${typeColor}">${typeLabel}</span>
        </div>
        <div class="dash-reminder-actions">
          <button onclick="sendSingleReminder('${r.unit.apt}','${r.reminderType}')" class="btn-send-sm">Send</button>
          <button onclick="skipReminder('${r.unit.apt}','${r.reminderType}')" class="btn-skip-sm">Skip</button>
        </div>
      </div>`;
    }).join('');
    if(remindersNeeded.length > 8) remHtml += `<div style="text-align:center;padding:8px;font-size:11px;color:var(--text3);">+${remindersNeeded.length-8} more</div>`;
    remHtml += '</div>';
  }
  document.getElementById('dashReminders').innerHTML=remHtml;

  // ── Revenue Summary (replacing the old monthly report panel) ──
  document.getElementById('dashRevenue').innerHTML=`
    <div class="dash-revenue-grid">
      <div class="dash-rev-item"><div class="dash-rev-label">Collected</div><div class="dash-rev-value green">${fmtMoney(monthlyReport.totalCollected||coll)}</div></div>
      <div class="dash-rev-item"><div class="dash-rev-label">Outstanding</div><div class="dash-rev-value red">${fmtMoney(monthlyReport.totalOutstanding||Math.max(0,exp-coll))}</div></div>
      <div class="dash-rev-item"><div class="dash-rev-label">Paid Units</div><div class="dash-rev-value">${monthlyReport.paidCount||0} of ${monthlyReport.totalUnits||active.length}</div></div>
      <div class="dash-rev-item"><div class="dash-rev-label">Avg Rent</div><div class="dash-rev-value">${fmtMoney(occ.length?Math.round(totalRent/occ.length):0)}</div></div>
    </div>
    <button onclick="emailMonthlyReport()" class="dash-email-btn">📧 Email Monthly Report</button>`;

  // ── Needs Attention ──
  const urgent=active.filter(r=>dueStatus(r)==='overdue'||dueStatus(r)==='soon').sort((a,b)=>(daysUntil(a.due)||0)-(daysUntil(b.due)||0)).slice(0,7);
  document.getElementById('dashUrgency').innerHTML=urgent.length
    ?urgent.map(r=>{const d=daysUntil(r.due);const c=d<0?'overdue':'soon';return`<div class="urgency-item"><span class="urgency-apt">${r.apt}</span><span class="urgency-name">${r.name}</span><span class="urgency-days ${c}">${d<0?Math.abs(d)+'d late':'in '+d+'d'}</span></div>`;}).join('')
    :'<div class="dash-empty-state">✓ No urgent items</div>';

  // ── Portfolio by Owner ──
  const ownerMap={};occ.forEach(r=>{if(!ownerMap[r.owner])ownerMap[r.owner]={rent:0,n:0};ownerMap[r.owner].rent+=r.rent;ownerMap[r.owner].n++;});
  const maxR=Math.max(...Object.values(ownerMap).map(o=>o.rent),1);
  document.getElementById('dashOwners').innerHTML=Object.entries(ownerMap).sort((a,b)=>b[1].rent-a[1].rent).map(([n,o])=>`<div class="obar-row"><div class="obar-label" title="${n}">${n}</div><div class="obar-track"><div class="obar-fill" style="width:${Math.round(o.rent/maxR*100)}%"></div></div><div class="obar-val">${fmtMoney(o.rent)} (${o.n})</div></div>`).join('');

  // ── Lease Type Chart ──
  const tc={lt:0,mtm:0,sh:0,av:0};active.forEach(r=>{if(r.type==='long-term')tc.lt++;else if(r.type==='month-to-month')tc.mtm++;else if(r.type==='short-stay')tc.sh++;else tc.av++;});
  if(typeChartInst)typeChartInst.destroy();
  typeChartInst=new Chart(document.getElementById('typeChart'),{type:'doughnut',data:{labels:['Long Term','M-to-M','Short Stay','Available'],datasets:[{data:[tc.lt,tc.mtm,tc.sh,tc.av],backgroundColor:['#2563a8','#6b4ca8','#c0711a','#2e7d52'],borderWidth:2,borderColor:'#fff'}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}}}});
  document.getElementById('typeLegend').innerHTML=[['#2563a8','Long Term'],['#6b4ca8','M-to-M'],['#c0711a','Short Stay'],['#2e7d52','Available']].map(([c,l])=>`<div class="legend-item"><div class="legend-dot" style="background:${c}"></div>${l}</div>`).join('');

  // ── Collection Rate Chart ──
  if(collChartInst)collChartInst.destroy();
  collChartInst=new Chart(document.getElementById('collChart'),{type:'doughnut',data:{labels:['Collected','Remaining'],datasets:[{data:[coll,Math.max(0,exp-coll)],backgroundColor:['#2e7d52','#f0ede8'],borderWidth:2,borderColor:'#fff'}]},options:{responsive:true,maintainAspectRatio:false,cutout:'68%',plugins:{legend:{display:false},tooltip:{callbacks:{label:c=>`${c.label}: $${c.raw.toLocaleString()}`}}}}});
  document.getElementById('collChartNote').textContent=`${collPct}% collected — ${fmtMoney(coll)} of ${fmtMoney(exp)}`;

  // ── Recent Reminders ──
  if(recentReminders.length === 0){
    document.getElementById('dashRecentReminders').innerHTML='<div class="dash-empty-state">No reminders sent yet</div>';
  } else {
    document.getElementById('dashRecentReminders').innerHTML=`
      <div class="dash-recent-list">
        ${recentReminders.map(r=>`
          <div class="dash-recent-item">
            <span class="dash-recent-apt">${r.apt}</span>
            <span class="dash-recent-type">${r.reminder_type}</span>
            <span class="dash-recent-status ${r.status}">${r.status==='sent'?'✓ Sent':r.status==='skipped'?'⊘ Skip':'Pending'}</span>
            <span class="dash-recent-date">${new Date(r.sent_at).toLocaleDateString('en-US',{month:'short',day:'numeric'})}</span>
          </div>`).join('')}
      </div>`;
  }

  // ── Upcoming 30-day ──
  const upcoming=active.filter(r=>r.type!=='available'&&(r.lease_end||r.due)).map(r=>{const endDate=r.lease_end||r.due;return{...r,_endDate:endDate,d:daysUntil(endDate)};}).filter(r=>r.d>=0&&r.d<=30).sort((a,b)=>a.d-b.d);
  document.getElementById('dashUpcoming').innerHTML=upcoming.length
    ?`<table style="width:100%;border-collapse:collapse">${upcoming.map(r=>`<tr style="border-bottom:1px solid var(--border);cursor:pointer" onclick="openDrillDown('dash_urgency','Overview')"><td style="padding:8px 0;font-family:'Playfair Display',serif;font-size:16px;font-weight:700;color:var(--accent2);width:48px">${r.apt}</td><td style="padding:8px;font-size:12px;color:var(--text2)">${r.name||'—'}</td><td>${typeBadge(r.type)}</td><td style="padding:8px;font-size:12px;color:var(--text3)">${fmtDate(r._endDate)}</td><td style="padding:8px;font-size:11px;color:var(--orange);font-weight:500;text-align:right">in ${r.d}d</td></tr>`).join('')}</table>`
    :'<div style="color:var(--text3);font-size:12px;padding:8px 0">No checkouts or renewals in the next 30 days.</div>';

  // ── Make KPI Hero cards clickable ──
  setTimeout(()=>{
    const kpiCards = document.querySelectorAll('#dashKpis .kpi-card.kpi-hero');
    const kpiActions = ['dash_occupancy','dash_revenue','dash_outstanding','dash_collected','dash_available'];
    kpiCards.forEach((card, i) => {
      if (kpiActions[i]) {
        card.onclick = () => openDrillDown(kpiActions[i], 'Overview');
        card.title = 'Click to drill down';
      }
    });

    // Make chart wraps clickable
    const typeChartWrap = document.getElementById('typeChart')?.closest('.chart-wrap');
    if (typeChartWrap) {
      typeChartWrap.onclick = () => openDrillDown('dash_lease_type', 'Overview');
      typeChartWrap.title = 'Click to see lease type breakdown';
    }
    const collChartWrap = document.getElementById('collChart')?.closest('.chart-wrap');
    if (collChartWrap) {
      collChartWrap.onclick = () => openDrillDown('dash_collected', 'Overview');
      collChartWrap.title = 'Click to see collection details';
    }

    // Make owner bars clickable
    document.querySelectorAll('#dashOwners .obar-row').forEach(row => {
      row.onclick = () => openDrillDown('dash_owner', 'Overview');
      row.title = 'Click to see portfolio details';
    });

    // Make urgency items clickable
    document.querySelectorAll('#dashUrgency .urgency-item').forEach(item => {
      item.onclick = () => openDrillDown('dash_urgency', 'Overview');
      item.title = 'Click to see all items needing attention';
    });

    // Make revenue grid clickable
    document.querySelectorAll('#dashRevenue .dash-rev-item').forEach(item => {
      item.onclick = () => openDrillDown('dash_revenue', 'Overview');
      item.title = 'Click for revenue details';
    });
  }, 100);

  // ── Render centralized messages (load Supabase channels first, then render) ──
  loadSbChannelMessages().then(function(){ renderDashMessages('all'); }).catch(function(){ renderDashMessages('all'); });
}

// ══════════════════════════════════════════════════════
//  REPORTS
// ══════════════════════════════════════════════════════
function changeReportMonth(dir){reportMonth+=dir;if(reportMonth>11){reportMonth=0;reportYear++;}if(reportMonth<0){reportMonth=11;reportYear--;}renderReports();}


// ── Report drill-down ──
function openArchiveDrill() {
  const d = window._archDrillData;
  if(!d) return;
  document.getElementById('rDrillTitle').textContent = '📦 Archive — Detail';
  document.getElementById('rDrillSub').textContent = `${monthName(d.m, d.y)} · ${d.items.length} stays from archived units`;

  const rows = d.items.sort((a,b) => (b.portion - a.portion)).map(r => `
    <tr>
      <td style="font-family:'Playfair Display',serif;font-size:14px;font-weight:700;color:var(--accent2);">${r.apt}</td>
      <td style="font-size:12px;">${r.name}</td>
      <td style="font-size:11px;color:var(--text3);">${r.owner}</td>
      <td style="text-align:right;font-size:11px;color:var(--text3);">${fmtDate(r.checkin)} → ${fmtDate(r.checkout)}</td>
      <td style="text-align:right;">${fmtMoney(r.totalRent)}</td>
      <td style="text-align:right;color:var(--green);">${fmtMoney(r.portion)}</td>
      <td style="text-align:right;color:var(--text3);">${r.days}d</td>
    </tr>`).join('');

  const total = d.items.reduce((s,r) => s+r.portion, 0);

  // Override the standard drill modal headers for archive
  document.getElementById('rDrillBody').innerHTML = rows || '<tr><td colspan="7" style="text-align:center;color:var(--text3);padding:20px;">No archived stays found</td></tr>';
  document.getElementById('rDrillFoot').innerHTML = `<tr>
    <td colspan="4" style="padding:10px 14px;">Total (${d.items.length} stays)</td>
    <td style="text-align:right;padding:10px 14px;">—</td>
    <td style="text-align:right;padding:10px 14px;color:var(--green);">${fmtMoney(total)}</td>
    <td style="text-align:right;padding:10px 14px;color:var(--text3);">—</td>
  </tr>`;

  // Update drill modal headers for archive columns
  document.querySelector('#rDrillModal thead tr').innerHTML = `
    <th style="padding:10px 14px;">Apt</th>
    <th style="padding:10px 14px;">Tenant</th>
    <th style="padding:10px 14px;">Owner</th>
    <th style="padding:10px 14px;text-align:right;">Stay Period</th>
    <th style="padding:10px 14px;text-align:right;">Total Rent</th>
    <th style="padding:10px 14px;text-align:right;">Month Portion</th>
    <th style="padding:10px 14px;text-align:right;">Days</th>`;

  openModal('rDrillModal');
}

function openRDrill(typeKey, typeLabel, y, m) {
  const mStr = `${y}-${String(m+1).padStart(2,'0')}`;
  const active = data.filter(r=>!r.archived);
  const occ = active.filter(r=>r.type===typeKey && r.name);

  // For short stay also include available units with archive activity this month
  let rows = [...occ];
  if(typeKey==='short-stay') {
    const availWithActivity = active.filter(r=>(r.type==='available'||!r.name)).filter(r=>
      archived.some(a=>a.apt===r.apt && a.type==='short-stay' &&
        (a.archived_date||a.archivedDate||'').startsWith(mStr))
    );
    rows = [...rows, ...availWithActivity];
  }

  // For short stay: count = all active short-stay + all available units
  const totalUnits = typeKey==='short-stay'
    ? data.filter(r=>!r.archived && (r.type==='short-stay' || r.type==='available')).length
    : occ.length;

  document.getElementById('rDrillTitle').textContent = `${typeLabel} — Detail`;
  document.getElementById('rDrillSub').textContent = `${monthName(m,y)} · ${rows.length} units`;

  let totalE=0, totalC=0;
  const bodyRows = rows.map(r=>{
    let e=expectedInMonth(r,y,m), c=collectedInMonth(r,y,m);
    // For available units, pull from archive
    if(!r.name || r.type==='available') {
      const archRows=archived.filter(a=>a.apt===r.apt&&a.type==='short-stay'&&(a.archived_date||a.archivedDate||'').startsWith(mStr));
      e=archRows.reduce((s,a)=>s+(a.rent||0),0);
      c=archRows.reduce((s,a)=>s+(a.rent||0),0);
    }
    totalE+=e; totalC+=c;
    const out=Math.max(0,e-c);
    const tenantName = r.name || `<span style="color:var(--text3);font-style:italic">Available (was occupied)</span>`;
    return `<tr style="cursor:pointer;" onclick="closeModal('rDrillModal');openDetail(${r.id})">
      <td style="font-family:'Playfair Display',serif;font-size:14px;font-weight:700;color:var(--accent2);">${r.apt}</td>
      <td style="font-size:12px;">${tenantName}</td>
      <td style="font-size:11px;color:var(--text3);">${r.owner||'—'}</td>
      <td style="text-align:right;">${fmtMoney(e)}</td>
      <td style="text-align:right;color:var(--green);">${fmtMoney(c)}</td>
      <td style="text-align:right;color:${out>0?'var(--red)':'var(--text3)'};">${fmtMoney(out)}</td>
      <td style="text-align:right;color:var(--blue);">${fmtMoney(e)}</td>
    </tr>`;
  }).join('');

  document.getElementById('rDrillBody').innerHTML = bodyRows || '<tr><td colspan="7" style="text-align:center;color:var(--text3);padding:20px;">No data for this period</td></tr>';

  const avg = totalUnits>0 ? totalC/totalUnits : 0;
  document.getElementById('rDrillFoot').innerHTML = `<tr>
    <td colspan="3" style="padding:10px 14px;">Total (${totalUnits} units for avg)</td>
    <td style="text-align:right;padding:10px 14px;">${fmtMoney(totalE)}</td>
    <td style="text-align:right;padding:10px 14px;color:var(--green);">${fmtMoney(totalC)}</td>
    <td style="text-align:right;padding:10px 14px;color:${totalE-totalC>0?'var(--red)':'var(--text3)'};">${fmtMoney(Math.max(0,totalE-totalC))}</td>
    <td style="text-align:right;padding:10px 14px;color:var(--blue);">${fmtMoney(avg)}</td>
  </tr>`;

  openModal('rDrillModal');
}

function renderReports(){
  const y=reportYear,m=reportMonth;
  document.getElementById('reportMonthLabel').textContent=monthName(m,y);
  const active=dedupActive();
  const occ=active.filter(r=>r.type!=='available'&&r.name);
  const dim=daysInMonth(y,m);

  // Days rented — max based on deduplicated units
  const totalActiveUnits = active.length; // deduplicated unit count
  let ltD=0,mtmD=0,shD=0;
  occ.forEach(r=>{const d=rentedDaysInMonth(r,y,m);if(r.type==='long-term')ltD+=d;else if(r.type==='month-to-month')mtmD+=d;else if(r.type==='short-stay')shD+=d;});
  const totD=ltD+mtmD+shD,maxD=Math.max(ltD,mtmD,shD,1);
  document.getElementById('rDaysContent').innerHTML=`
    ${[['Long Term',ltD,'#2563a8'],['Month-to-Month',mtmD,'#6b4ca8'],['Short Stay',shD,'#c0711a']].map(([l,d,c])=>`<div class="dbar-row"><div class="dbar-label">${l}</div><div class="dbar-track"><div class="dbar-fill" style="width:${Math.round(d/maxD*100)}%;background:${c}"></div></div><div class="dbar-val">${d} days</div></div>`).join('')}
    <div style="border-top:2px solid var(--border);margin-top:10px;padding-top:10px;display:flex;justify-content:space-between;font-size:12px;font-weight:500"><span style="color:var(--text2)">Total rented unit-days</span><span style="color:var(--accent2)">${totD} days <span style="color:var(--text3);font-weight:400">(${dim}-day month × ${totalActiveUnits} units = ${dim*totalActiveUnits} max)</span></span></div>`;

  // ── Short Stay Performance KPIs ──
  // Pool = all short-stay + all available units (33 total)
  const ssPool = active.filter(r=>r.type==='short-stay' || r.type==='available');
  const ssOcc  = occ.filter(r=>r.type==='short-stay'); // currently occupied short-stays
  const ssRevenue = ssOcc.reduce((s,r)=>s+collectedInMonth(r,y,m),0);
  const ssNights  = shD; // nights booked from above
  const ssMaxNights = dim * ssPool.length; // dim × 33
  const ssOccRate = ssMaxNights > 0 ? (ssNights / ssMaxNights * 100) : 0;
  const ssADR    = ssNights > 0 ? ssRevenue / ssNights : 0;           // revenue ÷ occupied nights only
  const ssRevPAR = ssMaxNights > 0 ? ssRevenue / ssMaxNights : 0;     // revenue ÷ ALL possible nights (pool × days)
  document.getElementById('rShortStayKpis').innerHTML=`
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:14px;margin-bottom:8px;">
      <div class="r-kpi" style="border-top:3px solid #c0711a;">
        <div class="r-kpi-label">Rental Revenue</div>
        <div class="r-kpi-value" style="color:#c0711a;">${fmtMoney(ssRevenue)}</div>
        <div class="r-kpi-sub">${ssOcc.length} occupied units</div>
      </div>
      <div class="r-kpi" style="border-top:3px solid #c0711a;">
        <div class="r-kpi-label">Nights Booked</div>
        <div class="r-kpi-value" style="color:#c0711a;">${ssNights}</div>
        <div class="r-kpi-sub">of ${ssMaxNights} possible</div>
      </div>
      <div class="r-kpi" style="border-top:3px solid #c0711a;">
        <div class="r-kpi-label">Occupancy Rate</div>
        <div class="r-kpi-value" style="color:#c0711a;">${ssOccRate.toFixed(1)}%</div>
        <div class="r-kpi-sub">${ssPool.length} units × ${dim} days</div>
      </div>
      <div class="r-kpi" style="border-top:3px solid #c0711a;">
        <div class="r-kpi-label">Avg Daily Rate (ADR)</div>
        <div class="r-kpi-value" style="color:#c0711a;">${fmtMoney(ssADR)}</div>
        <div class="r-kpi-sub">revenue ÷ occupied nights</div>
      </div>
      <div class="r-kpi" style="border-top:3px solid #c0711a;">
        <div class="r-kpi-label">RevPAR</div>
        <div class="r-kpi-value" style="color:#c0711a;">${fmtMoney(ssRevPAR)}</div>
        <div class="r-kpi-sub">revenue ÷ all ${ssMaxNights} possible nights</div>
      </div>
    </div>
    <div style="font-size:10px;color:var(--text3);">Based on ${ssPool.length} units (${ssOcc.length} short-stay occupied + ${ssPool.length-ssOcc.length} available) · ${dim}-day month</div>`;

  // Collection — short stay counts available units that had archive activity this month
  // For short stay avg: count all active short-stay + all available units (19 + 14 = 33)
  const shortStayUnitCount = data.filter(r=>!r.archived && (r.type==='short-stay' || r.type==='available')).length;

  const types=[{k:'long-term',l:'Long Term'},{k:'month-to-month',l:'Month-to-Month'},{k:'short-stay',l:'Short Stay'}];
  // Catch units with unexpected/blank type
  const classifiedUnits = new Set([...occ.map(r=>r.id), ...ssPool.map(r=>r.id)]);
  const unclassified = active.filter(r=>!classifiedUnits.has(r.id) && r.type!=='available');
  let gE=0,gC=0,gUnits=0;
  document.getElementById('rCollHead').innerHTML=`<tr><th>Type</th><th style="text-align:right">Units</th><th style="text-align:right">Expected</th><th style="text-align:right">Collected</th><th style="text-align:right">Outstanding</th><th style="text-align:right">Avg / Unit</th></tr>`;
  document.getElementById('rCollBody').innerHTML=types.map(({k,l})=>{
    const us=occ.filter(r=>r.type===k);
    const totalUnitsForAvg = k==='short-stay' ? shortStayUnitCount : us.length;
    const e=us.reduce((s,r)=>s+expectedInMonth(r,y,m),0);
    const c=us.reduce((s,r)=>s+collectedInMonth(r,y,m),0);
    const avg = totalUnitsForAvg > 0 ? c/totalUnitsForAvg : 0;
    gE+=e; gC+=c; gUnits+=us.length;
    const linkStyle='cursor:pointer;text-decoration:underline;text-underline-offset:2px;color:var(--accent2);';
    return`<tr style="cursor:pointer;" onclick="openRDrill('${k}','${l}',${y},${m})">
      <td style="${linkStyle}">${l} ↗</td>
      <td style="text-align:right">${totalUnitsForAvg}</td>
      <td style="text-align:right">${fmtMoney(e)}</td>
      <td style="text-align:right;color:var(--green)">${fmtMoney(c)}</td>
      <td style="text-align:right;color:${e-c>0?'var(--red)':'var(--text3)'}">${fmtMoney(Math.max(0,e-c))}</td>
      <td style="text-align:right;color:var(--blue)">${fmtMoney(avg)}</td>
    </tr>`;
  }).join('');
  const totalAvg=gUnits>0?gC/gUnits:0;
  // Add unclassified row if there are units with unexpected types
  if(unclassified.length>0){
    document.getElementById('rCollBody').innerHTML+=`<tr style="opacity:.7"><td style="color:var(--text3);font-style:italic">Other/Unclassified</td><td style="text-align:right;color:var(--text3)">${unclassified.length}</td><td colspan="4" style="text-align:right;font-size:11px;color:var(--text3)">${unclassified.map(r=>r.apt).join(', ')}</td></tr>`;
  }
  // ── Archive row: short-stay records that overlapped this month ──
  // EXCLUDE any apt already counted in live rows (occ) to avoid double-counting
  const liveApts = new Set(occ.map(r => r.apt));
  const mStart = new Date(y, m, 1);
  const mEnd   = new Date(y, m+1, 0);
  const mStr3  = `${y}-${String(m+1).padStart(2,'0')}`;

  let archTotal = 0;
  const archUnits = new Set();
  // Track apt+name combos already counted to avoid double-counting same stay
  const counted = new Set();

  archived.forEach(a => {
    if(!a.archived) return;
    // Only short-stay (skip LT monthly archive lines)
    if(a.type !== 'short-stay') return;
    // Skip if this apt is already counted in live rows
    if(liveApts.has(a.apt)) return;
    const ci = a.checkin || a.checkinDate || '';
    const co = a.archivedDate || a.archived_date || a.lease_end || a.due || '';
    if(!ci || !co) return;
    const ciD = new Date(ci+'T00:00:00');
    const coD = new Date(co+'T00:00:00');
    // Must overlap with this month
    if(ciD > mEnd || coD < mStart) return;
    // Deduplicate same apt+checkin combo (avoid counting same stay twice)
    const key = `${a.apt}|${ci}|${co}`;
    if(counted.has(key)) return;
    counted.add(key);
    // Use calcProration for consistent math
    const splits = calcProration(ci, co, a.rent||0);
    const thisMonth = splits.find(s => s.monthStr === mStr3);
    if(thisMonth && thisMonth.portion > 0) {
      archTotal += thisMonth.portion;
      archUnits.add(a.apt);
    }
  });

  if(archTotal > 0) {
    // Store archive details for drill-down
    window._archDrillData = { units: archUnits, items: [], mStr: mStr3, y, m };
    archived.forEach(a => {
      if(!a.archived || a.type !== 'short-stay') return;
      if(liveApts.has(a.apt)) return;
      const ci = a.checkin || a.checkinDate || '';
      const co = a.archivedDate || a.archived_date || a.lease_end || a.due || '';
      if(!ci || !co) return;
      const ciD = new Date(ci+'T00:00:00');
      const coD = new Date(co+'T00:00:00');
      if(ciD > mEnd || coD < mStart) return;
      const key = `${a.apt}|${ci}|${co}`;
      const splits = calcProration(ci, co, a.rent||0);
      const thisMonth = splits.find(s => s.monthStr === mStr3);
      if(thisMonth && thisMonth.portion > 0) {
        window._archDrillData.items.push({
          apt: a.apt, name: a.name||'—', owner: a.owner||'—',
          checkin: ci, checkout: co, totalRent: a.rent||0,
          portion: thisMonth.portion, days: thisMonth.days
        });
      }
    });

    document.getElementById('rCollBody').innerHTML += `<tr style="background:var(--surface2);cursor:pointer;" onclick="openArchiveDrill()">
      <td style="color:var(--accent2);text-decoration:underline;text-underline-offset:2px;">📦 Archive (stayed in month) ↗</td>
      <td style="text-align:right;color:var(--text3);">${archUnits.size}</td>
      <td style="text-align:right;color:var(--text3);">${fmtMoney(archTotal)}</td>
      <td style="text-align:right;color:var(--green);">${fmtMoney(archTotal)}</td>
      <td style="text-align:right;color:var(--text3);">$0</td>
      <td style="text-align:right;color:var(--text3);">—</td>
    </tr>`;
    gE += archTotal; gC += archTotal;
  }

  const totalUnitsDisplay = active.length;
  document.getElementById('rCollBody').innerHTML+=`<tr class="total-row"><td>Total</td><td style="text-align:right">${totalUnitsDisplay}</td><td style="text-align:right">${fmtMoney(gE)}</td><td style="text-align:right;color:var(--green)">${fmtMoney(gC)}</td><td style="text-align:right;color:${gE-gC>0?'var(--red)':'var(--text3)'}">${fmtMoney(Math.max(0,gE-gC))}</td><td style="text-align:right;color:var(--blue)">${fmtMoney(totalAvg)}</td></tr>`;

  const rate=gE>0?Math.round(gC/gE*100):0;
  document.getElementById('reportKpis').innerHTML=`
    <div class="r-kpi"><div class="r-kpi-label">Expected</div><div class="r-kpi-value">${fmtMoney(gE)}</div><div class="r-kpi-sub">${occ.length} occupied units</div></div>
    <div class="r-kpi"><div class="r-kpi-label">Collected</div><div class="r-kpi-value" style="color:var(--green)">${fmtMoney(gC)}</div><div class="r-kpi-sub">${rate}% collection rate</div></div>
    <div class="r-kpi"><div class="r-kpi-label">Outstanding</div><div class="r-kpi-value" style="color:${gE-gC>0?'var(--red)':'var(--green)'}">${fmtMoney(Math.max(0,gE-gC))}</div><div class="r-kpi-sub">to be collected</div></div>
    <div class="r-kpi"><div class="r-kpi-label">Total Days Rented</div><div class="r-kpi-value" style="color:var(--accent2)">${totD}</div><div class="r-kpi-sub">of ${dim} days in month</div></div>`;

  // By owner
  const om={};occ.forEach(r=>{const o=r.owner||'Unknown';if(!om[o])om[o]={apts:[],e:0,c:0};om[o].apts.push(r.apt);om[o].e+=expectedInMonth(r,y,m);om[o].c+=collectedInMonth(r,y,m);});
  document.getElementById('rOwnerContent').innerHTML=Object.entries(om).sort((a,b)=>b[1].e-a[1].e).map(([n,o])=>`
    <div class="owner-report-row">
      <div class="or-name">${n}</div>
      <div class="or-apts">${o.apts.join(', ')}</div>
      <div class="or-col"><div style="font-size:10px;color:var(--text3)">Expected</div><div style="color:var(--text2)">${fmtMoney(o.e)}</div></div>
      <div class="or-col"><div style="font-size:10px;color:var(--text3)">Collected</div><div style="color:var(--green);font-weight:500">${fmtMoney(o.c)}</div></div>
      <div class="or-col"><div style="font-size:10px;color:var(--text3)">Outstanding</div><div style="color:${o.e-o.c>0?'var(--red)':'var(--text3)'}">${fmtMoney(Math.max(0,o.e-o.c))}</div></div>
    </div>`).join('')||'<div style="color:var(--text3);font-size:12px">No data</div>';

  // Prediction next month
  let nm=m+1,ny=y;if(nm>11){nm=0;ny++;}
  let pLT=0,pMTM=0,pSH=0;
  const willRent=active.filter(r=>{
    if(!r.name||r.type==='available')return false;
    if(r.type==='long-term'||r.type==='month-to-month')return true;
    if(r.type==='short-stay'&&r.due)return new Date(r.due+'T00:00:00')>=new Date(ny,nm,1);
    return false;
  });
  willRent.forEach(r=>{if(r.type==='long-term')pLT+=r.rent;else if(r.type==='month-to-month')pMTM+=r.rent;else pSH+=r.rent;});
  const pTotal=pLT+pMTM+pSH;
  const availPot=active.filter(r=>(r.type==='available'||!r.name)&&r.rent>0).length;
  document.getElementById('rPrediction').innerHTML=`
    <div class="pred-box">
      <div class="pred-title">Predicted for ${monthName(nm,ny)}</div>
      <div class="pred-amount">${fmtMoney(pTotal)}</div>
      <div class="pred-note">Based on ${willRent.length} units expected active${availPot?` · ${availPot} available units could add more`:''}</div>
    </div>
    <div class="pred-type-grid">
      <div class="pred-type-card" style="background:var(--blue-bg);border:1px solid var(--blue-border)"><div style="font-size:10px;color:var(--blue);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px">Long Term</div><div style="font-family:'Playfair Display',serif;font-size:20px;font-weight:700;color:var(--blue)">${fmtMoney(pLT)}</div></div>
      <div class="pred-type-card" style="background:var(--purple-bg);border:1px solid var(--purple-border)"><div style="font-size:10px;color:var(--purple);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px">Month-to-Month</div><div style="font-family:'Playfair Display',serif;font-size:20px;font-weight:700;color:var(--purple)">${fmtMoney(pMTM)}</div></div>
      <div class="pred-type-card" style="background:var(--orange-bg);border:1px solid var(--orange-border)"><div style="font-size:10px;color:var(--orange);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px">Short Stay</div><div style="font-family:'Playfair Display',serif;font-size:20px;font-weight:700;color:var(--orange)">${fmtMoney(pSH)}</div></div>
    </div>`;

  // Trend chart
  const labels=[],expArr=[],collArr=[];
  for(let i=5;i>=0;i--){let tm2=m-i,ty2=y;if(tm2<0){tm2+=12;ty2--;}labels.push(new Date(ty2,tm2,1).toLocaleDateString('en-US',{month:'short',year:'2-digit'}));let e2=0,c2=0;occ.forEach(r=>{e2+=expectedInMonth(r,ty2,tm2);c2+=collectedInMonth(r,ty2,tm2);});expArr.push(e2);collArr.push(c2);}
  if(trendChartInst)trendChartInst.destroy();
  trendChartInst=new Chart(document.getElementById('trendChart'),{type:'bar',data:{labels,datasets:[{label:'Expected',data:expArr,backgroundColor:'#e0dbd2',borderRadius:4},{label:'Collected',data:collArr,backgroundColor:'#2e7d52',borderRadius:4}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{labels:{font:{family:'DM Mono',size:11},boxWidth:12}}},scales:{y:{ticks:{callback:v=>'$'+v.toLocaleString(),font:{family:'DM Mono',size:10}},grid:{color:'#f4f2ee'}},x:{ticks:{font:{family:'DM Mono',size:10}},grid:{display:false}}}}});
}

// ── DEBUG ──────────────────────────────────────────
// ── INIT ───────────────────────────────────────────
document.getElementById('sortSel').value='due';

// ═══════════════════════════════════════════════
// CALENDAR
// ═══════════════════════════════════════════════

let calYear       = new Date().getFullYear();
let calMonth      = new Date().getMonth();
let calTypeFilter = 'all';
let _calUnitId    = null;   // active unit id for action modals
let _calApt       = null;   // active apt string
let _calDate      = null;   // clicked date
let _editingBlock = null;   // existing block being edited {from,to,reason}

// ── localStorage blocks store ──
function getBlocks() {
  try { return JSON.parse(localStorage.getItem('propdesk_blocks') || '{}'); }
  catch(e) { return {}; }
}
function setBlocks(b) { localStorage.setItem('propdesk_blocks', JSON.stringify(b)); }

// ── Filter pills ──
function calFilterType(el) {
  document.querySelectorAll('[data-caltype]').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  calTypeFilter = el.dataset.caltype;
  renderCalendar();
}

// ── Navigation ──
function calPrevMonth() { calMonth--; if(calMonth<0){calMonth=11;calYear--;} renderCalendar(); }
function calNextMonth() { calMonth++; if(calMonth>11){calMonth=0;calYear++;} renderCalendar(); }
function calGoToday() {
  const n=new Date(); calYear=n.getFullYear(); calMonth=n.getMonth();
  renderCalendar();
  setTimeout(()=>{
    const outer=document.getElementById('calGridOuter');
    const t=document.querySelector('.cal-day-hdr.today');
    if(t&&outer) outer.scrollLeft=t.offsetLeft-120;
  },80);
}

// ── Main render ──
function renderCalendar() {
  const MONTH_NAMES=['January','February','March','April','May','June','July','August','September','October','November','December'];
  const DAY_ABBR=['SU','MO','TU','WE','TH','FR','SA'];
  const _tn=new Date();
  const todayStr=_tn.getFullYear()+'-'+String(_tn.getMonth()+1).padStart(2,'0')+'-'+String(_tn.getDate()).padStart(2,'0');
  // curMonthStr not needed — 270-day window has no dim logic

  // Build date range: 150 days back from today → 60 days forward
  const dates=[];
  const _today=new Date();
  const winFrom=new Date(_today); winFrom.setDate(_today.getDate()-90);
  const winTo  =new Date(_today); winTo.setDate(_today.getDate()+150);
  for(let d=new Date(winFrom); d<=winTo; d.setDate(d.getDate()+1)){
    dates.push(d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'));
  }

  const COL_W=36;
  const winStart=dates[0], winEnd=dates[dates.length-1];

  // ── Filter units ──
  const q=(document.getElementById('calSearch')?.value||'').toLowerCase();
  let units=data.filter(r=>!r.archived);

  // Build set of apts that are currently occupied (have an active short-stay with current dates)
  const currentlyBookedApts=new Set();
  data.filter(r=>!r.archived&&r.type==='short-stay'&&r.name&&r.checkin&&r.due&&
    r.checkin<=todayStr&&r.due>=todayStr).forEach(r=>currentlyBookedApts.add(r.apt));

  if(calTypeFilter!=='all'){
    if(calTypeFilter==='available'){
      // Show apts that are NOT currently occupied by a short-stay booking
      const futureOnlyApts=new Set();
      data.filter(r=>!r.archived&&r.name&&r.checkin&&r.checkin>todayStr).forEach(r=>futureOnlyApts.add(r.apt));
      units=units.filter(r=>{
        if(currentlyBookedApts.has(r.apt)) return false; // has active short-stay booking
        return r.type==='available'||dueStatus(r)==='available'||
          (futureOnlyApts.has(r.apt)&&(!r.checkin||r.checkin>todayStr));
      });
    } else {
      units=units.filter(r=>r.type===calTypeFilter);
    }
  }
  if(q) units=units.filter(r=>(r.apt||'').toLowerCase().includes(q)||(r.name||'').toLowerCase().includes(q)||(r.owner||'').toLowerCase().includes(q));
  units.sort((a,b)=>(a.apt||'').localeCompare(b.apt||'',undefined,{numeric:true}));

  // Smart dedupe: one display row per apt, with priority:
  // 1. available type row
  // 2. current (non-future) active row
  // 3. future booking row
  const unitsByApt=new Map();
  for(const r of units){
    const prev=unitsByApt.get(r.apt);
    if(!prev){ unitsByApt.set(r.apt,r); continue; }
    const rFuture=!!(r.checkin&&r.checkin>todayStr);
    const prevFuture=!!(prev.checkin&&prev.checkin>todayStr);
    const rAvail=(r.type==='available');
    const prevAvail=(prev.type==='available');
    if(rAvail&&!prevAvail){ unitsByApt.set(r.apt,r); continue; }
    if(prevAvail&&!rAvail){ continue; }
    if(!rFuture&&prevFuture){ unitsByApt.set(r.apt,r); continue; }
    if(!prevFuture&&rFuture){ continue; }
    if((r.id||0)<(prev.id||0)) unitsByApt.set(r.apt,r);
  }
  units=[...unitsByApt.values()].sort((a,b)=>(a.apt||'').localeCompare(b.apt||'',undefined,{numeric:true}));
  document.getElementById('calUnitCount').textContent=`Units (${units.length})`;
  const mlEl=document.getElementById('calMonthLabel');
  if(mlEl) mlEl.textContent=MONTH_NAMES[calMonth]+' '+calYear;

  // ── Future bookings: additional active records with future checkin ──
  // Build a map of which id was chosen as display unit per apt
  const displayUnitId={};
  units.forEach(u=>{ displayUnitId[u.apt]=u.id; });

  const futureBookings={};
  // Check both active data (excluding display row) AND archived records with future checkin
  const _addFutureBooking=(r,ci,co)=>{
    if(!co||co<todayStr||co<winStart) return; // must have future checkout
    if(ci && ci>winEnd) return;
    if(ci && ci<todayStr) return; // checkin already past — not a future booking
    const from = (ci && ci>=todayStr) ? ci : todayStr;
    if(!futureBookings[r.apt]) futureBookings[r.apt]=[];
    futureBookings[r.apt].push({id:r.id,name:r.name,from:from,to:co,type:r.type,note:r.note||'',rent:r.rent||0,owner:r.owner||''});
  };
  // Active records (skip display row)
  data.filter(r=>!r.archived&&r.name&&r.checkin&&r.checkin>=todayStr).forEach(r=>{
    if(displayUnitId[r.apt]===r.id) return;
    _addFutureBooking(r, r.checkin, r.due||r.lease_end||'');
  });
  // Archived records with future checkin (cal-bookings saved with old code)
  // Also handle records where checkin is missing but archivedDate is future
  archived.filter(r=>r.archived&&r.name).forEach(r=>{
    const ci = r.checkin || '';
    const co = r.archivedDate||r.archived_date||r.lease_end||r.due||'';
    if(!co||co<todayStr) return; // checkout already past
    if(ci && ci<todayStr) return; // checkin already past
    const from = ci || co; // if no checkin use checkout date as single-day marker
    if(from>=todayStr) _addFutureBooking(r, from, co);
  });

  // ── Past stays — normal bars, fully clickable with all details ──
  const pastStays={};
  archived.filter(r=>r.archived&&r.name&&(r.archivedDate||r.due)).forEach(r=>{
    const ci=r.checkin||r.checkinDate||'';
    const co=r.archivedDate||r.due||'';
    if(!co||co<winStart||(!ci&&co<winStart)) return;
    if(ci&&ci>winEnd) return;
    if(!pastStays[r.apt]) pastStays[r.apt]=[];
    pastStays[r.apt].push({id:r.id,name:r.name,from:ci||co,to:co,type:r.type,note:r.note||'',rent:r.rent||0,owner:r.owner||'',archived:true});
  });

  const blocks=getBlocks();

  // ── Units list ──
  const calMeta = getCalUnitMeta();
  document.getElementById('calUnitsList').innerHTML=units.map(r=>{
    const meta = calMeta[r.apt] || {};
    const sub = meta.brBath || '';
    // Unit is currently available if:
    // - type is available, OR
    // - short-stay with past due, OR  
    // - display row's own checkin is in the future (no current tenant)
    const displayRowFuture = !!(r.checkin && r.checkin > todayStr);
    const unitAvailNow = r.type==='available' || dueStatus(r)==='available' || displayRowFuture;

    // Collect ALL future bookings for this apt including the display row itself if future
    const allFuture = [...(futureBookings[r.apt]||[])];
    if(displayRowFuture) allFuture.push({from:r.checkin, to:r.due||r.lease_end||''});
    allFuture.sort((a,b)=>a.from.localeCompare(b.from));
    const nextBooking = allFuture[0];

    let availText = '';
    if(unitAvailNow && nextBooking && nextBooking.from > todayStr){
      const d=new Date(nextBooking.from+'T00:00:00');
      d.setDate(d.getDate()-1);
      if(d>=new Date(todayStr)){
        availText='until '+d.toLocaleDateString('en-US',{month:'short',day:'numeric'});
      }
    }
    return `<div class="cal-unit-row" title="Click to view unit details" onclick="openCalUnitPanel(${r.id})">
      <div class="cal-unit-cell">
        <div class="cal-unit-name">${r.apt}</div>
        ${availText
          ? `<div class="cal-unit-sub" style="color:var(--green);font-weight:500;">✓ avail ${availText}</div>`
          : sub ? `<div class="cal-unit-sub">${sub}</div>` : ''}
      </div>
    </div>`;
  }).join('');

  // ── Day headers ──
  // Day headers — one cell per date, perfectly aligned with grid rows
  // Month labels as a separate row above, using colspan-equivalent flex spans
  const MONTH_SHORT2=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  let lastMo=-1, monthGroups=[];
  dates.forEach(d=>{
    const mo=parseInt(d.substring(5,7))-1, yr=parseInt(d.substring(0,4));
    if(mo!==lastMo){monthGroups.push({mo,yr,count:1});lastMo=mo;}
    else monthGroups[monthGroups.length-1].count++;
  });
  const monthRowHtml = monthGroups.map(g=>
    `<div style="width:${g.count*COL_W}px;flex-shrink:0;display:flex;align-items:center;padding:0 8px;font-family:'Playfair Display',serif;font-size:12px;font-weight:700;color:var(--accent2);border-right:2px solid var(--border2);box-sizing:border-box;background:var(--surface2);">${MONTH_SHORT2[g.mo]} ${g.yr}</div>`
  ).join('');
  document.getElementById('calMonthRow').innerHTML = monthRowHtml;

  const dayHdrHtml = dates.map(d => {
    const dt=new Date(d+'T00:00:00'),dow=dt.getDay();
    const isWE=dow===0||dow===6,isToday=d===todayStr;
    return `<div class="cal-day-hdr${isWE?' weekend':''}${isToday?' today':''}">
      <div class="day-name">${DAY_ABBR[dow]}</div>
      <div class="day-num">${dt.getDate()}</div>
    </div>`;
  }).join('');
  document.getElementById('calDaysHeader').innerHTML = dayHdrHtml;

  // ── Rows ──
  const rowsEl=document.getElementById('calRows');
  rowsEl.innerHTML='';

  units.forEach(r=>{
    const rowDiv=document.createElement('div');
    rowDiv.className='cal-row';
    rowDiv.style.width=(dates.length*COL_W)+'px';

    const aptBlocks=blocks[r.apt]||[];
    // Build occupied date ranges for this unit
    const occupiedRanges=[];
    // Active tenant
    if(r.type!=='available'&&r.name){
      const stripDate=s=>s?String(s).substring(0,10):'';
      const bf=stripDate(r.checkin||winStart);
      const endCandidates=[stripDate(r.due),stripDate(r.lease_end)].filter(Boolean).sort();
      const bt=endCandidates.length?endCandidates[endCandidates.length-1]:'';
      if(bt) occupiedRanges.push({from:bf,to:bt});
    }
    // Future bookings for this apt
    (futureBookings[r.apt]||[]).forEach(b=>occupiedRanges.push({from:b.from,to:b.to}));
    // Past stays visible in window
    (pastStays[r.apt]||[]).forEach(b=>occupiedRanges.push({from:b.from,to:b.to}));

    let cellsHtml='';
    dates.forEach(d=>{
      const dt=new Date(d+'T00:00:00'),dow=dt.getDay();
      const isWE=dow===0||dow===6,isToday=d===todayStr;
      const isBlocked=aptBlocks.some(b=>d>=b.from&&d<=b.to);
      const isOccupied=occupiedRanges.some(b=>d>=b.from&&d<=b.to);
      let cls='cal-cell';
      if(isWE) cls+=' weekend';
      if(isToday) cls+=' today-col';
      if(isBlocked) cls+=' blocked';
      cellsHtml+=`<div class="${cls}" onclick="onCalCellClick(${r.id},'${r.apt}','${d}',${isOccupied})"></div>`;
    });
    rowDiv.innerHTML=cellsHtml;

    // ── Bars ──
    const bars=[];

    // 1. Active tenant bar — uses live unit data only, no archive
    if(r.type!=='available'&&r.name){
      const stripDate = s => s ? String(s).substring(0,10) : '';
      const bf = stripDate(r.checkin && r.checkin >= winStart ? r.checkin : winStart);
      const endCandidates = [stripDate(r.due), stripDate(r.lease_end)].filter(Boolean).sort();
      const bt = endCandidates.length ? endCandidates[endCandidates.length-1] : '';
      if(bt) bars.push({
        name:r.name, from:bf, to:bt,
        type:r.type, note:r.note||'',
        active:true, unitId:r.id, rent:r.rent, owner:r.owner
      });
    }

    // 2. Past stays — full normal bars
    (pastStays[r.apt]||[]).forEach(s=>bars.push({...s}));
    // 3. Future bookings — calendar-added upcoming stays
    (futureBookings[r.apt]||[]).forEach(s=>bars.push({...s}));

    // 3. Blocks
    aptBlocks.forEach(b=>bars.push({
      name:b.reason||'Blocked', from:b.from, to:b.to,
      type:'__block__', blockData:b
    }));

    // Find index of date in sorted dates array using binary search
    const dateIdx=(d)=>{
      if(!d) return -1;
      if(d <= dates[0]) return 0;
      if(d >= dates[dates.length-1]) return dates.length-1;
      let lo=0, hi=dates.length-1;
      while(lo<=hi){
        const mid=(lo+hi)>>1;
        if(dates[mid]===d) return mid;
        if(dates[mid]<d) lo=mid+1; else hi=mid-1;
      }
      return lo;
    };



    // Build set of dates that are same-day turnovers for this apt
    // (a date where one bar ends AND another begins)
    const turnoverDates = new Set();
    for(let i=0;i<bars.length;i++){
      for(let j=0;j<bars.length;j++){
        if(i===j) continue;
        if(bars[i].to && bars[j].from && bars[i].to === bars[j].from){
          turnoverDates.add(bars[i].to);
        }
      }
    }

    bars.forEach(bar=>{
      if(!bar.from&&!bar.to) return;
      const cf=bar.from<winStart?winStart:bar.from;
      const ct=bar.to>winEnd?winEnd:bar.to;
      if(cf>winEnd||ct<winStart) return;
      const s=dateIdx(cf), e=dateIdx(ct);
      if(s<0||e<0) return;
      const span=e-s+1; if(span<1) return;

      // Same-day turnover adjustments
      // If this bar's END date is a turnover date → shrink right half of last cell
      const endIsTurnover = turnoverDates.has(bar.to) && bar.to >= winStart && bar.to <= winEnd;
      // If this bar's START date is a turnover date → push into right half of first cell
      const startIsTurnover = turnoverDates.has(bar.from) && bar.from >= winStart && bar.from <= winEnd;

      const HALF = COL_W / 2;
      let leftPx  = s * COL_W + 2;
      let widthPx = span * COL_W - 4;

      if(startIsTurnover){
        // Start at right half of first cell
        leftPx  += HALF;
        widthPx -= HALF;
      }
      if(endIsTurnover){
        // End at left half of last cell
        widthPx -= HALF;
      }
      if(widthPx < 4) widthPx = 4;

      let barCls='cal-bar ';
      let icon='🏠';
      if(bar.type==='long-term')        {barCls+='bar-lt';    icon='🏠';}
      else if(bar.type==='month-to-month'){barCls+='bar-mtm'; icon='📋';}
      else if(bar.type==='short-stay')    {barCls+='bar-ss';  icon='✈️';}
      else if(bar.type==='__block__')     {barCls+='bar-block';icon='🚫';}
      else if(bar.type==='available-gap') {barCls+='bar-avail';icon='✓';}

      const note=bar.note||'';
      const badge = bar.type==='__block__' ? '🚫' : getChannelBadge(note);

      const barEl=document.createElement('div');
      barEl.className=barCls;
      barEl.style.cssText='left:'+leftPx+'px;width:'+widthPx+'px;overflow:hidden;z-index:5;';
      barEl.title=`${bar.name} · ${bar.from} → ${bar.to}`;

      // Sticky label: floats within the visible portion of the bar
      // Delete X button for blocks only
      const xBtn = bar.type==='__block__'
        ? `<span class="cal-bar-x" onclick="event.stopPropagation();deleteBlock('${r.apt}','${bar.from}','${bar.to}')">&#x2715;</span>`
        : '';
      // Inner sticky wrapper keeps name visible as bar scrolls
      // Inherit background color from bar class for the bg pill
      const bgColor = bar.type==='long-term'      ? 'linear-gradient(90deg,#2563a8,#1e5799)'
        : bar.type==='month-to-month'  ? 'linear-gradient(90deg,#7c4fbe,#5e3f9e)'
        : bar.type==='short-stay'      ? 'linear-gradient(90deg,#e07818,#b86818)'
        : bar.type==='__block__'       ? 'linear-gradient(90deg,#c0392b,#962d22)'
        : bar.type==='available-gap'   ? 'linear-gradient(90deg,#3a9e5f,#256645)'
        : 'linear-gradient(90deg,#2563a8,#1e5799)';

      barEl.innerHTML=`<div class="cal-bar-bg" style="background:${bgColor}"></div>${xBtn}`;
      // Store data for floating label
      barEl.dataset.barLeft = s * COL_W + 2;
      barEl.dataset.barRight = (s + span) * COL_W - 4;
      barEl.dataset.barName = bar.name;
      barEl.dataset.barBadge = badge.replace(/"/g,"'");
      barEl.dataset.barColor = '#fff';

      barEl.addEventListener('click',e=>{
        e.stopPropagation();
        if(bar.type==='__block__'){
          _calUnitId=r.id; _calApt=r.apt; _editingBlock=bar.blockData;
          openBlockModal();
        } else if(bar.active){
          // Main active tenant bar → full detail panel
          openDetail(r.id);
        } else if(bar.id){
          const activeRec = data.find(x=>x.id===bar.id);
          if(activeRec){
            // Future booking in data → full detail panel
            openDetail(activeRec.id);
          } else {
            // Archived record → calendar detail panel with delete
            openCalBookingDetail(bar, r, false);
          }
        }
      });
      rowDiv.appendChild(barEl);
    });

    // Add a floating label overlay for this row
    const labelsDiv = document.createElement('div');
    labelsDiv.className = 'cal-row-labels';
    rowDiv.appendChild(labelsDiv);

    rowsEl.appendChild(rowDiv);
  });

  // After rows are in DOM, set up floating label updates on scroll
  _setupCalFloatingLabels();

  // Set explicit width on grid containers so horizontal scroll works
  const totalW = dates.length * COL_W;
  document.getElementById('calGrid').style.width = totalW + 'px';
  document.getElementById('calRows').style.width = totalW + 'px';
  document.getElementById('calDaysHeader').style.width = totalW + 'px';

  // Scroll to today on very first render only
  const outer=document.getElementById('calGridOuter');
  if(!outer._calScrolled){
    outer._calScrolled=true;
    const todayIdx=dates.indexOf(todayStr);
    if(todayIdx>=0) outer.scrollLeft=Math.max(0,todayIdx*COL_W-120);
  }
}

// ── Cell click: show action picker ──
function onCalCellClick(unitId, apt, dateStr, isOccupied) {
  _calUnitId=unitId; _calApt=apt; _calDate=dateStr; _editingBlock=null;

  // Blank date — go straight to Add Booking
  if (!isOccupied) {
    openCalBookingModal();
    return;
  }

  // Occupied date — show action menu
  const r=data.find(x=>x.id===unitId);
  document.getElementById('calActionApt').textContent=apt;
  document.getElementById('calActionDate').textContent=
    (r&&r.name?r.name+' · ':'')+fmtDate(dateStr);
  openModal('calActionModal');
}

// ── Block modal ──
function openBlockModal() {
  const r=data.find(x=>x.id===_calUnitId);
  document.getElementById('blockModalApt').textContent=_calApt||'';
  const eb=_editingBlock;
  document.getElementById('blockFrom').value=eb?eb.from:(_calDate||today());
  document.getElementById('blockTo').value=eb?eb.to:(_calDate||today());
  document.getElementById('blockReason').value=eb?(eb.reason||''):'';
  document.getElementById('blockModalInfo').innerHTML=
    `Unit <strong>${_calApt}</strong>${r&&r.name?' — '+r.name:''}<br>
     <span style="font-size:11px;color:var(--text3)">${eb?'Edit or delete this block:':'Set the date range to block:'}</span>`;
  // Show delete button only when editing existing block
  document.getElementById('deleteBlockRow').style.display=eb?'':'none';
  openModal('blockModal');
}

function saveBlock() {
  const from=document.getElementById('blockFrom').value;
  const to=document.getElementById('blockTo').value;
  const reason=document.getElementById('blockReason').value.trim();
  if(!from||!to){toast('Please set both From and To dates','error');return;}
  if(from>to){toast('From date must be before To date','error');return;}
  if(!_calApt){toast('No unit selected','error');return;}
  const blocks=getBlocks();
  if(!blocks[_calApt]) blocks[_calApt]=[];
  // Remove overlapping blocks (or the one being edited)
  if(_editingBlock) {
    blocks[_calApt]=blocks[_calApt].filter(b=>!(b.from===_editingBlock.from&&b.to===_editingBlock.to));
  } else {
    blocks[_calApt]=blocks[_calApt].filter(b=>b.to<from||b.from>to);
  }
  blocks[_calApt].push({from,to,reason});
  setBlocks(blocks);
  closeModal('blockModal');
  toast(`Dates blocked for ${_calApt} ✓`,'success');
  renderCalendar();
}

function deleteCurrentBlock() {
  if(!_editingBlock||!_calApt)return;
  deleteBlock(_calApt,_editingBlock.from,_editingBlock.to);
  closeModal('blockModal');
}

function deleteBlock(apt,from,to) {
  if(!confirm(`Remove block (${from} → ${to}) for ${apt}?`))return;
  const blocks=getBlocks();
  if(!blocks[apt])return;
  blocks[apt]=blocks[apt].filter(b=>!(b.from===from&&b.to===to));
  setBlocks(blocks);
  toast(`Block removed for ${apt}`,'success');
  renderCalendar();
}

// ── Calendar Add Booking modal ──
function openCalBookingModal() {
  // Clear all fields for a fresh booking
  ['cbName','cbPhone','cbEmail','cbNote','cbRent','cbBalance','cbOwner','cbPayAmount','cbPayNote'].forEach(id => {
    const el = document.getElementById(id); if(el) el.value = '';
  });
  const cbChannel = document.getElementById('cbChannel');
  if(cbChannel) cbChannel.value = cbChannel.options[0]?.value || '';
  document.getElementById('cbType').value = 'short-stay';
  document.getElementById('cbCheckin').value = _calDate || today();
  document.getElementById('cbCheckout').value = '';
  document.getElementById('cbPayDate').value = today();
  document.getElementById('cbPayPreviewRow').style.display = 'none';
  document.getElementById('cbPayPreview').innerHTML = '';
  document.getElementById('cbProrateRow').style.display = 'none';
  document.getElementById('cbProrateCheck').checked = false;
  document.getElementById('cbProrateBreakdown').innerHTML = '';
  const aptLabel = document.getElementById('calBookingApt');
  if(aptLabel) aptLabel.textContent = _calApt || '';
  openModal('calBookingModal');
  // Show prorate row when dates/rent change
  ['cbCheckin','cbCheckout','cbRent'].forEach(id => {
    const el = document.getElementById(id);
    if(el) el.addEventListener('change', updateCbPayPreview);
  });
}

function updateCbPayPreview() {
  const amt      = parseFloat(document.getElementById('cbPayAmount').value) || 0;
  const rent     = parseFloat(document.getElementById('cbRent').value) || 0;
  const checkin  = document.getElementById('cbCheckin').value;
  const checkout = document.getElementById('cbCheckout').value;
  const isProrate = document.getElementById('cbProrateCheck').checked;
  const previewRow = document.getElementById('cbPayPreviewRow');
  const preview    = document.getElementById('cbPayPreview');
  const prorateRow = document.getElementById('cbProrateRow');
  const breakdown  = document.getElementById('cbProrateBreakdown');

  // Show prorate option only for short stays with both dates
  const showProrate = checkin && checkout && checkin < checkout;
  prorateRow.style.display = showProrate ? '' : 'none';

  if (!amt) { previewRow.style.display = 'none'; return; }

  let msg = '';
  if (isProrate && showProrate) {
    const splits = calcProration(checkin, checkout, amt);
    if (splits.length) {
      breakdown.innerHTML = splits.map(s => `${s.month}: <strong>$${s.portion.toLocaleString()}</strong> (${s.days}d)`).join('<br>');
      msg = `✓ $${amt.toLocaleString()} split across ${splits.length} month${splits.length>1?'s':''}.`;
    }
  } else {
    if (rent && amt >= rent) {
      msg = `✓ Full payment of $${amt.toLocaleString()} recorded.`;
    } else if (rent && amt < rent) {
      msg = `⚠ Partial — $${amt.toLocaleString()} of $${rent.toLocaleString()}. Balance: $${(rent - amt).toFixed(2)}`;
    } else {
      msg = `✓ $${amt.toLocaleString()} will be recorded as payment.`;
    }
    breakdown.innerHTML = '';
  }

  preview.innerHTML = msg;
  previewRow.style.display = msg ? '' : 'none';
}

async function saveCalBooking() {
  const name    = document.getElementById('cbName').value.trim();
  const type    = document.getElementById('cbType').value;
  const owner   = document.getElementById('cbOwner').value.trim();
  const checkin = document.getElementById('cbCheckin').value;
  const checkout= document.getElementById('cbCheckout').value;
  const rent    = parseFloat(document.getElementById('cbRent').value)||0;
  const balance = parseFloat(document.getElementById('cbBalance').value)||0;
  const note    = buildNoteField('cbChannel','cbChannelOther','cbPhone','cbEmail','cbNote');
  const payAmt  = parseFloat(document.getElementById('cbPayAmount').value)||0;
  const payDate = document.getElementById('cbPayDate').value || today();
  const payNote = document.getElementById('cbPayNote').value.trim();
  const isProrate = document.getElementById('cbProrateCheck').checked;

  if(!name)   { toast('Tenant name required','error'); return; }
  if(!checkin){ toast('Check-in date required','error'); return; }
  if(!checkout){ toast('Checkout date required','error'); return; }
  if(!_calApt){ toast('No unit selected','error'); return; }

  const btn = document.querySelector('#calBookingModal .btn-primary');
  btn.textContent = 'Saving…'; btn.disabled = true;

  try {
    const bookingNote = note ? note + ' | cal-booking' : 'cal-booking';
    const calBookingId = 'BK-cal-' + Date.now();

    // Build history — include payment entry if amount entered
    const history = [];
    if (payAmt > 0) {
      const histLabel = payNote ? `$${payAmt.toLocaleString()} — payment | ${payNote}` : `$${payAmt.toLocaleString()} — payment`;
      history.push({ date: payDate, amt: payAmt, text: histLabel });
    }
    const finalBalance = payAmt > 0 ? Math.max(0, rent - payAmt) : (balance || rent);

    // Check if the unit already has an available/vacant active record for this apt
    const existingAvail = data.find(r =>
      !r.archived && r.apt === _calApt &&
      (r.type === 'available' || !r.name || dueStatus(r) === 'available')
    );

    if(existingAvail) {
      const updated = {
        ...existingAvail,
        name, type, owner, rent, balance: finalBalance,
        checkin, due: checkout, lease_end: checkout,
        note: bookingNote, history
      };
      await save(updated);
      await auditLog('cal-booking', _calApt, name, existingAvail.id, dbRow(existingAvail), dbRow(updated));
    } else {
      const {data:maxRow} = await sb.from('units').select('id').order('id',{ascending:false}).limit(1);
      const newId = (maxRow&&maxRow.length ? maxRow[0].id : nextId) + 1;
      nextId = newId + 1;
      const newRec = {
        id: newId, apt: _calApt, owner, name, type,
        rent, balance: finalBalance, checkin, due: checkout, lease_end: checkout,
        note: bookingNote, history, archived: false, archived_date: null,
        booking_id: 'BK-' + newId
      };
      const {error} = await sb.from('units').insert(dbRow(newRec));
      if(error) throw new Error(error.message);
      await auditLog('cal-booking', _calApt, name, newId, null, dbRow(newRec));
    }

    await loadAll();
    closeModal('calBookingModal');
    renderCalendar();
    renderTable();
    const payMsg = payAmt > 0 ? ` · $${payAmt.toLocaleString()} recorded` : '';
    toast(`Booking added: ${name} @ ${_calApt}${payMsg} ✓`, 'success');
  } catch(e) {
    toast('Error: ' + e.message, 'error');
  } finally {
    btn.textContent = '+ Save Booking'; btn.disabled = false;
  }
}


// ── One-time calendar scroll setup (called once after boot) ──
function initCalScroll() {
  const outer = document.getElementById('calGridOuter');
  const uCol  = document.getElementById('calUnitsCol');
  if (!outer || outer._bound) return;
  outer._bound = true;

  // Sync vertical scroll: grid ↔ units sidebar
  let _syncing = false;
  outer.addEventListener('scroll', () => {
    if (_syncing) return;
    _syncing = true;
    uCol.scrollTop = outer.scrollTop;
    _syncing = false;
    _updateCalFloatingLabels();
  }, { passive: true });
  uCol.addEventListener('scroll', () => {
    if (_syncing) return;
    _syncing = true;
    outer.scrollTop = uCol.scrollTop;
    _syncing = false;
  }, { passive: true });
}

function _setupCalFloatingLabels() {
  _updateCalFloatingLabels();
}

function _updateCalFloatingLabels() {
  const outer = document.getElementById('calGridOuter');
  if (!outer) return;
  const scrollLeft = outer.scrollLeft;
  const viewWidth  = outer.clientWidth;
  const PADDING    = 8;

  document.querySelectorAll('.cal-row-labels').forEach(labelsDiv => {
    labelsDiv.innerHTML = '';
    const rowDiv = labelsDiv.parentElement;
    if (!rowDiv) return;

    rowDiv.querySelectorAll('.cal-bar').forEach(barEl => {
      const barLeft  = parseFloat(barEl.dataset.barLeft  || 0);
      const barRight = parseFloat(barEl.dataset.barRight || 0);
      const name     = barEl.dataset.barName  || '';
      const badge    = (barEl.dataset.barBadge || '').replace(/'/g, '"');
      if (!name) return;

      // Visible left edge clamped inside bar
      const visLeft  = Math.max(barLeft,  scrollLeft + PADDING);
      const visRight = Math.min(barRight, scrollLeft + viewWidth - PADDING);
      if (visRight <= visLeft + 20) return;

      const labelW   = 24 + name.length * 7;
      const labelLeft = Math.min(visLeft, barRight - labelW - PADDING);
      if (labelLeft < barLeft - 2) return;

      const label = document.createElement('div');
      label.className = 'cal-float-label';
      label.style.left = labelLeft + 'px';
      label.innerHTML  = badge + '<span style="margin-left:3px">' + name + '</span>';
      labelsDiv.appendChild(label);
    });
  });
}


// ── CAL BOOKING DETAIL PANEL ───────────────────────────

function openCalBookingDetail(bar, unit, isActive) {
  const apt = unit.apt;
  document.getElementById('cbpApt').textContent   = apt;
  document.getElementById('cbpName').textContent  = bar.name || '—';
  document.getElementById('cbpDates').textContent = `${fmtDate(bar.from)} → ${fmtDate(bar.to)}`;
  document.getElementById('cbpOwner').textContent = bar.owner || unit.owner || '—';
  document.getElementById('cbpRent').textContent  = bar.rent ? fmtMoney(bar.rent) : '—';

  const parsed = parseNoteFields(bar.note || '');
  document.getElementById('cbpChannel').textContent = getChannelName(bar.note||'');
  document.getElementById('cbpPhone').textContent   = parsed.phone || '—';
  document.getElementById('cbpEmail').textContent   = parsed.email || '—';
  document.getElementById('cbpNote').textContent    = parsed.extra || '—';
  document.getElementById('cbpType').textContent    = bar.type || '—';

  // Only show delete for archived bookings, not the active unit bar
  // Show delete for any bar that has an id (active tenant bar has isActive=true)
  _calBookingPanelId = bar.id && !isActive ? bar.id : null;
  document.getElementById('cbpDeleteRow').style.display = _calBookingPanelId ? '' : 'none';

  document.getElementById('calBookingPanel').classList.add('open');
}

function closeCalBookingPanel() {
  document.getElementById('calBookingPanel').classList.remove('open');
}

async function deleteCalBooking() {
  if (!_calBookingPanelId) return;
  const rec = [...data, ...archived].find(x => x.id === _calBookingPanelId);
  if (!confirm(`Delete booking "${rec ? rec.name : ''}"? This cannot be undone.`)) return;
  try {
    const { error } = await sb.from('units').delete().eq('id', _calBookingPanelId);
    if (error) throw new Error(error.message);
    closeCalBookingPanel();
    await loadAll();
    renderCalendar();
    renderTable();
    toast('Booking deleted ✓', 'success');
  } catch(e) {
    toast('Error: ' + e.message, 'error');
  }
}


// ── CAL UNIT META (localStorage: BR/Bath + internal note per apt) ──
function getCalUnitMeta() {
  try { return JSON.parse(localStorage.getItem('propdesk_unit_meta') || '{}'); }
  catch(e) { return {}; }
}
function setCalUnitMeta(m) { localStorage.setItem('propdesk_unit_meta', JSON.stringify(m)); }

function openCalUnitPanel(unitId) {
  const r = data.find(x => x.id === unitId);
  if (!r) return;
  _calUnitId = unitId;
  _calApt    = r.apt;
  document.getElementById('cupApt').textContent    = r.apt;
  document.getElementById('cupTenant').textContent  = r.name || 'Vacant';
  document.getElementById('cupOwner').textContent   = r.owner || '';
  const meta = getCalUnitMeta()[r.apt] || {};
  document.getElementById('cupBrBath').value = meta.brBath || '';
  document.getElementById('cupNote').value   = meta.note   || '';
  document.getElementById('calUnitPanel').classList.add('open');
}

function closeCalUnitPanel() {
  document.getElementById('calUnitPanel').classList.remove('open');
}

function saveCalUnitMeta() {
  if (!_calApt) return;
  const meta = getCalUnitMeta();
  meta[_calApt] = {
    brBath: document.getElementById('cupBrBath').value.trim(),
    note:   document.getElementById('cupNote').value.trim()
  };
  setCalUnitMeta(meta);
  renderCalendar(); // refresh sub-line live
}

async function deleteCalUnit() {
  const r = data.find(x => x.id === _calUnitId);
  if (!r) return;
  if (!confirm(`Delete unit "${r.apt}" from active list?\nAll archive records for this unit will be kept.`)) return;
  try {
    // Only delete the active unit record, not archived ones
    const { error } = await sb.from('units').delete().eq('id', r.id).eq('archived', false);
    if (error) throw new Error(error.message);
    await auditLog('delete-unit', r.apt, r.name || '', r.id, dbRow(r), null);
    closeCalUnitPanel();
    await loadAll();
    renderCalendar();
    renderTable();
    toast(`Unit ${r.apt} deleted. Archive records kept. ✓`, 'success');
  } catch(e) {
    toast('Error: ' + e.message, 'error');
  }
}


// ── CHANNEL / NOTE HELPERS ──────────────────────────────

// Known channels and their icons (SVG emoji fallback letters)
const CHANNELS = {
  'Airbnb':      { letter: 'A', bg: '#FF5A5F', fg: '#fff' },
  'Vrbo':        { letter: 'V', bg: '#1DA462', fg: '#fff' },
  'Booking.com': { letter: 'B', bg: '#003580', fg: '#fff' },
  'Booking':     { letter: 'B', bg: '#003580', fg: '#fff' },
  'Direct':      { letter: 'D', bg: '#8a5f32', fg: '#fff' },
  'Hostfully':   { letter: 'H', bg: '#7B4FBE', fg: '#fff' },
};

function getChannelBadge(note) {
  if (!note) return _chBadge('D','#8a5f32');
  for (const [name, ch] of Object.entries(CHANNELS)) {
    if (note.toLowerCase().includes(name.toLowerCase()))
      return _chBadge(ch.letter, ch.bg, ch.fg);
  }
  const m = note.match(/Via:\s*([^|\n]+)/i);
  if (m) {
    const letter = m[1].trim().charAt(0).toUpperCase();
    return _chBadge(letter, 'rgba(255,255,255,.35)', '#fff');
  }
  return _chBadge('D','#8a5f32');
}

function _chBadge(letter, bg, fg='#fff') {
  return `<span class="cal-ch-badge" style="background:${bg};color:${fg}">${letter}</span>`;
}

// Keep getChannelIcon as alias for cbpChannel display (text version)
function getChannelName(note) {
  if (!note) return 'Direct';
  for (const name of Object.keys(CHANNELS)) {
    if (note.toLowerCase().includes(name.toLowerCase())) return name;
  }
  const m = note.match(/Via:\s*([^|\n]+)/i);
  return m ? m[1].trim() : 'Direct';
}

function parseNoteFields(note) {
  // Extract structured parts from "Via: X | Tel: X | Email: X" format
  const result = { channel: '', channelOther: '', phone: '', email: '', extra: note };
  if (!note) return result;

  const viaM   = note.match(/Via:\s*([^|\n]+)/i);
  const telM   = note.match(/Tel:\s*([^|\n]+)/i);
  const emailM = note.match(/Email:\s*([^|\n]+)/i);

  if (viaM) {
    const via = viaM[1].trim();
    const known = ['Airbnb','Vrbo','Booking.com','Booking','Direct','Hostfully'];
    const match = known.find(k => via.toLowerCase().includes(k.toLowerCase()));
    if (match) {
      result.channel = match === 'Booking' ? 'Booking.com' : match;
    } else {
      result.channel = 'Other';
      result.channelOther = via;
    }
  }
  if (telM)   result.phone = telM[1].trim();
  if (emailM) result.email = emailM[1].trim();

  // Extra = note minus the parsed parts
  result.extra = note
    .replace(/Via:\s*[^|\n]+\|?/i, '')
    .replace(/Tel:\s*[^|\n]+\|?/i, '')
    .replace(/Email:\s*[^|\n]+\|?/i, '')
    .replace(/^\s*\|\s*/, '')
    .trim();

  return result;
}

function buildNoteField(chId, chOtherId, telId, emailId, noteId) {
  const chEl    = document.getElementById(chId);
  const ch      = chEl ? chEl.value : '';
  const chOther = document.getElementById(chOtherId)?.value.trim() || '';
  const phone   = document.getElementById(telId)?.value.trim() || '';
  const email   = document.getElementById(emailId)?.value.trim() || '';
  const extra   = document.getElementById(noteId)?.value.trim() || '';

  const via = ch === 'Other' ? chOther : ch;
  const parts = [];
  if (via)   parts.push(`Via: ${via}`);
  if (phone) parts.push(`Tel: ${phone}`);
  if (email) parts.push(`Email: ${email}`);
  if (extra) parts.push(extra);
  return parts.join(' | ');
}

function toggleFChannelOther() {
  const v = document.getElementById('fChannel').value;
  document.getElementById('fChannelOtherRow').style.display = v === 'Other' ? '' : 'none';
}
function toggleCbChannelOther() {
  const v = document.getElementById('cbChannel').value;
  document.getElementById('cbChannelOtherRow').style.display = v === 'Other' ? '' : 'none';
}


// ══════════════════════════════════════════════════════
//  PERSON BADGES & CLICKABLE NAME POPUP
// ══════════════════════════════════════════════════════

/**
 * Get booking badges (Pre-Arrival, Agreement/ID) for a unit or booking.
 * Checks pipeline data for pre-arrival form status and booking stage.
 * Returns HTML string of badge spans.
 */
function getPersonBadges(unitOrBooking) {
  if (!unitOrBooking) return '';
  let badges = '';

  // Try to find a matching pipeline booking
  let booking = null;
  if (typeof window.pipelineState !== 'undefined' && window.pipelineState && window.pipelineState.bookings) {
    const name = unitOrBooking.guest_name || unitOrBooking.name;
    const apt = unitOrBooking.unit_name || unitOrBooking.apt;
    if (name) {
      booking = window.pipelineState.bookings.find(b =>
        (b.guest_name === name) ||
        (apt && (b.unit_name === apt || b.listing_name === apt))
      );
    }
    // If the item IS a booking
    if (unitOrBooking.booking_status || unitOrBooking.guest_name) {
      booking = unitOrBooking;
    }
  }

  if (!booking) return '';

  const stage = booking.booking_status || '';
  const isUpcoming = ['inquiry','pending','pre_approved','confirmed','booked'].includes(stage);
  const isHosting = (stage === 'currently_hosting');

  // Pre-Arrival badge: show for upcoming bookings
  // Check if pre-arrival form was submitted
  let preArrivalDone = false;
  if (typeof window.pipelineState !== 'undefined' && window.pipelineState.preArrivalForms) {
    preArrivalDone = window.pipelineState.preArrivalForms.some(f =>
      f.booking_id === booking.id || f.guest_email === booking.guest_email
    );
  }
  if (isUpcoming || isHosting) {
    if (preArrivalDone) {
      badges += '<span class="person-badge badge-done" title="Pre-arrival form completed">✓ Pre-Arrival</span>';
    } else {
      badges += '<span class="person-badge badge-pending" title="Pre-arrival form not yet submitted">⏳ Pre-Arrival</span>';
    }
  }

  // Agreement / ID badge: check if guest has agreement signed
  // For now, mark as done for currently_hosting (they must have agreed), pending for upcoming
  if (isHosting) {
    badges += '<span class="person-badge badge-done" title="Agreement signed, ID verified">✓ Agreement/ID</span>';
  } else if (isUpcoming) {
    badges += '<span class="person-badge badge-pending" title="Agreement/ID pending">⏳ Agreement/ID</span>';
  }

  return badges;
}

/**
 * Build a clickable person name HTML with badges.
 * Works for both unit records (from data[]) and pipeline bookings.
 */
function clickablePersonName(nameText, unitOrBooking, extraClass) {
  if (!nameText) return '<div class="tenant-empty">Vacant</div>';
  const safeId = unitOrBooking ? (unitOrBooking.id || '') : '';
  const isBooking = unitOrBooking && (unitOrBooking.guest_name || unitOrBooking.booking_status);
  const dataAttr = isBooking ? `data-booking-id="${safeId}"` : `data-unit-id="${safeId}"`;
  const badges = getPersonBadges(unitOrBooking);
  return `<div class="person-name-wrap ${extraClass||''}" ${dataAttr} onclick="showPersonSummary(this, event)" style="cursor:pointer;">
    <span class="person-name-text">${nameText}</span>${badges ? '<span class="person-badges">'+badges+'</span>' : ''}
  </div>`;
}

/**
 * Show a popup summary for a person when their name is clicked.
 * Displays: contact info, stay details, payment details, message link.
 */
function showPersonSummary(el, evt) {
  evt.stopPropagation();

  // Remove any existing popup
  const old = document.getElementById('personSummaryPopup');
  if (old) old.remove();

  const bookingId = el.dataset.bookingId;
  const unitId = el.dataset.unitId;

  let info = {};

  if (bookingId && typeof window.pipelineState !== 'undefined') {
    // Pipeline booking
    const b = window.pipelineState.bookings.find(x => x.id == bookingId);
    if (b) {
      info = {
        name: b.guest_name,
        email: b.guest_email || '',
        phone: b.guest_phone || '',
        unit: b.unit_name || b.listing_name || '',
        checkIn: b.check_in || '',
        checkOut: b.check_out || '',
        nights: b.nights || '',
        status: b.booking_status || '',
        platform: b.platform || '',
        totalPayout: b.total_payout || b.host_payout || 0,
        currency: b.currency || 'USD',
        confirmCode: b.confirm_code || '',
        notes: b.notes || ''
      };
    }
  } else if (unitId) {
    // Unit record
    const u = data.find(x => x.id == unitId);
    if (u) {
      const parsed = parseNoteFields(u.note || '');
      info = {
        name: u.name,
        email: parsed.email || '',
        phone: parsed.phone || '',
        unit: u.apt || '',
        checkIn: u.checkin || '',
        checkOut: u.lease_end || '',
        nights: '',
        status: u.type || '',
        platform: parsed.channel || '',
        totalPayout: u.rent || 0,
        currency: 'USD',
        balance: u.balance || 0,
        due: u.due || '',
        notes: parsed.extra || ''
      };
    }
  }

  if (!info.name) return;

  // Build popup HTML
  const rect = el.getBoundingClientRect();
  const popupLeft = Math.min(rect.left, window.innerWidth - 340);
  const popupTop = rect.bottom + 6;

  const statusColors = {
    'inquiry': '#e67e22', 'booked': '#27ae60', 'confirmed': '#27ae60',
    'currently_hosting': '#2980b9', 'completed': '#7d5228', 'canceled': '#c0392b',
    'short-stay': 'var(--accent)', 'long-term': 'var(--green)', 'month-to-month': 'var(--blue)',
    'available': 'var(--text3)'
  };
  const sColor = statusColors[info.status] || 'var(--text2)';

  const emailLink = info.email ? `<a href="mailto:${info.email}" style="color:var(--blue);text-decoration:none;font-size:12px;" title="Email ${info.name}">${info.email}</a>` : '<span style="color:var(--text3);font-size:12px;">No email</span>';
  const phoneLink = info.phone ? `<a href="tel:${info.phone}" style="color:var(--blue);text-decoration:none;font-size:12px;">${info.phone}</a>` : '';

  const popup = document.createElement('div');
  popup.id = 'personSummaryPopup';
  popup.innerHTML = `
    <div style="
      position:fixed;left:${popupLeft}px;top:${popupTop}px;width:320px;
      background:var(--surface);border:1px solid var(--border);border-radius:10px;
      box-shadow:0 8px 32px rgba(0,0,0,.15);z-index:9999;padding:16px;
      font-family:'DM Mono',monospace;animation:fadeIn .15s ease;
    ">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
        <div style="font-weight:700;font-size:15px;color:var(--text);">${info.name}</div>
        <span onclick="document.getElementById('personSummaryPopup').remove()" style="cursor:pointer;color:var(--text3);font-size:16px;line-height:1;">&times;</span>
      </div>
      <div style="display:flex;gap:6px;margin-bottom:10px;">
        <span style="background:${sColor};color:#fff;font-size:10px;padding:2px 8px;border-radius:8px;font-weight:600;">${info.status.replace(/_/g,' ')}</span>
        ${info.platform ? `<span style="background:var(--surface2);font-size:10px;padding:2px 8px;border-radius:8px;color:var(--text2);">${info.platform}</span>` : ''}
        ${info.confirmCode ? `<span style="background:var(--surface2);font-size:10px;padding:2px 8px;border-radius:8px;color:var(--text2);">${info.confirmCode}</span>` : ''}
      </div>

      <div style="font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px;">Contact</div>
      <div style="margin-bottom:10px;">
        ${emailLink}${phoneLink ? ' · '+phoneLink : ''}
      </div>

      <div style="font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px;">Stay Details</div>
      <div style="font-size:12px;color:var(--text);margin-bottom:10px;">
        <div><strong>Unit:</strong> ${info.unit}</div>
        ${info.checkIn ? `<div><strong>Check-in:</strong> ${info.checkIn}</div>` : ''}
        ${info.checkOut ? `<div><strong>Check-out:</strong> ${info.checkOut}</div>` : ''}
        ${info.nights ? `<div><strong>Nights:</strong> ${info.nights}</div>` : ''}
      </div>

      <div style="font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px;">Payment</div>
      <div style="font-size:12px;color:var(--text);margin-bottom:10px;">
        <div><strong>Total:</strong> $${(info.totalPayout||0).toLocaleString()}</div>
        ${info.balance !== undefined ? `<div><strong>Balance:</strong> <span style="color:${info.balance > 0 ? 'var(--red)' : 'var(--green)'}">${info.balance > 0 ? '$'+info.balance.toLocaleString()+' due' : '✓ Paid'}</span></div>` : ''}
        ${info.due ? `<div><strong>Due date:</strong> ${info.due}</div>` : ''}
      </div>

      ${info.email ? `<button onclick="window.open('mailto:${info.email}','_blank');document.getElementById('personSummaryPopup').remove();" style="
        width:100%;padding:8px;background:var(--accent);color:#fff;border:none;border-radius:6px;
        cursor:pointer;font-family:inherit;font-size:12px;font-weight:600;
      ">✉ Message ${info.name.split(' ')[0]}</button>` : ''}
    </div>
  `;

  document.body.appendChild(popup);

  // Close on outside click
  setTimeout(() => {
    document.addEventListener('click', function _closePopup(e) {
      const pop = document.getElementById('personSummaryPopup');
      if (pop && !pop.contains(e.target) && !el.contains(e.target)) {
        pop.remove();
        document.removeEventListener('click', _closePopup);
      }
    });
  }, 50);
}

async function deleteUnitRecord(id) {
  const r = data.find(x=>x.id===id);
  if(!r) return;
  if(!confirm(`Delete booking for "${r.name}" @ ${r.apt}?\nThis cannot be undone.`)) return;
  try {
    const {error} = await sb.from('units').delete().eq('id', id);
    if(error) throw new Error(error.message);
    closeDetail();
    await loadAll();
    renderTable();
    renderCalendar();
    toast(`Booking deleted ✓`, 'success');
  } catch(e) {
    toast('Error: '+e.message, 'error');
  }
}


async function boot() {
  const overlay = document.getElementById('loadingOverlay');
  const msg = overlay.querySelector('p');

  // Check Supabase library loaded
  if (window._supaFailed || typeof supabase === 'undefined') {
    msg.innerHTML = '❌ Supabase library failed to load.<br><small>Check your internet connection.</small><br><br><button onclick="bootOffline()" style="margin-top:8px;padding:8px 20px;background:var(--accent);color:#fff;border:none;border-radius:6px;cursor:pointer;font-family:inherit">Use Offline Mode</button>';
    return;
  }

  try {
    msg.textContent = 'Connecting to database…';

    // Test connection with a simple count first
    const { count, error: testErr } = await sb.from('units').select('*', { count: 'exact', head: true });
    if (testErr) throw new Error('DB connection failed: ' + testErr.message);

    msg.textContent = `Connected! Loading data (${count} records)…`;
    const ok = await loadAll();
    if (!ok) throw new Error('Failed to load records');

    // Fix any bad records (rent > 50000 = phone number was grabbed instead)
    const badRecs = archived.filter(r => r.rent > 50000);
    if (badRecs.length > 0) {
      for (const r of badRecs) {
        await sb.from('units').update({ rent: 0 }).eq('id', r.id);
      }
      await loadAll();
    }

    // Seeding disabled — Supabase is source of truth
    // if (data.length < 10) {
    //   msg.textContent = 'Seeding 79 active units…';
    //   await saveAll(SEED_DATA);
    //   await loadAll();
    // }

    // Archive seeding disabled — Supabase is source of truth
    // if (archived.length === 0 && ARCHIVED_SEED.length > 0) { ... }

    overlay.style.display = 'none';
    // Set build stamp dynamically from title
    const titleMatch = document.title.match(/v(\d{4}-\d{2}-\d{2} \d{2}:\d{2})/);
    const stamp = document.getElementById('buildStamp');
    if (stamp && titleMatch) stamp.textContent = 'updated ' + titleMatch[1].replace('-','').replace('-','').replace(' ',', ').replace(/^(\d{4})(\d{2})(\d{2})/, (_,y,m,d)=>{ const mn=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']; return mn[parseInt(m)-1]+' '+parseInt(d)+' '+y; });
    // Load properties table so BR/Bath/Access show in Units tab
    try {
      await loadProperties();
      console.log('propertiesData loaded:', propertiesData.length);
    } catch(propErr) {
      console.warn('loadProperties failed during boot:', propErr.message);
    }
    window.DATA = data; // expose for module nav
    subscribeRealtime();
    setTimeout(checkBackupStatus, 500);
    // On mobile: skip heavy desktop rendering, go straight to mobile UI
    var _isMob = window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|webOS/i.test(navigator.userAgent);
    if(_isMob && typeof WILLOW_MOBILE !== 'undefined' && typeof WILLOW_MOBILE.init === 'function'){
      WILLOW_MOBILE.init();
    } else if(_isMob){
      // mobile.js hasn't loaded yet — wait for it instead of rendering desktop
      var _mobPoll = setInterval(function(){
        if(typeof WILLOW_MOBILE !== 'undefined' && typeof WILLOW_MOBILE.init === 'function'){
          clearInterval(_mobPoll);
          WILLOW_MOBILE.init();
        }
      }, 100);
      setTimeout(function(){ clearInterval(_mobPoll); }, 5000);
    } else {
      renderTable();
      initModuleNav(); // Initialize Layout C navigation
      initCalScroll();
      if (typeof updateMsgCenterBadge === 'function') updateMsgCenterBadge();
    }

  } catch(e) {
    console.error('Boot error:', e);
    msg.innerHTML = `❌ ${e.message}<br><small>URL: ${SUPA_URL}</small><br><br>
      <button onclick="boot()" style="margin-top:8px;padding:8px 20px;background:var(--accent);color:#fff;border:none;border-radius:6px;cursor:pointer;font-family:inherit;margin-right:8px">Retry</button>
      <button onclick="bootOffline()" style="margin-top:8px;padding:8px 20px;background:var(--surface);border:1px solid var(--border);color:var(--text2);border-radius:6px;cursor:pointer;font-family:inherit">Offline Mode</button>`;
  }
}

function bootOffline() {
  // Fall back to seed data locally without Supabase
  data = [...SEED_DATA];
  archived = [...ARCHIVED_SEED].map(r => ({...r, archivedDate: r.archived_date || ''}));
  document.getElementById('loadingOverlay').style.display = 'none';
  document.getElementById('syncStatus').textContent = '⚠ offline';
  document.getElementById('syncStatus').style.color = 'var(--orange)';
  window.DATA = data;
  // On mobile: skip heavy desktop rendering, go straight to mobile UI
  var _isMob = window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|webOS/i.test(navigator.userAgent);
  if(_isMob && typeof WILLOW_MOBILE !== 'undefined' && typeof WILLOW_MOBILE.init === 'function'){
    WILLOW_MOBILE.init();
  } else if(_isMob){
    var _mobPoll2 = setInterval(function(){
      if(typeof WILLOW_MOBILE !== 'undefined' && typeof WILLOW_MOBILE.init === 'function'){
        clearInterval(_mobPoll2);
        WILLOW_MOBILE.init();
      }
    }, 100);
    setTimeout(function(){ clearInterval(_mobPoll2); }, 5000);
  } else {
    renderTable();
    initModuleNav();
    initCalScroll();
  }
}

// boot() is now called by authGate() after session check


// ══════════════════════════════════════════════════════
//  AUTH + CLOCK
// ══════════════════════════════════════════════════════
const REMEMBER_KEY   = 'chelbourne_admin_token';   // localStorage — permanent "remember me" for admin
const SESSION_KEY    = 'chelbourne_session';          // sessionStorage — survives refresh, gone on tab close
const INACTIVITY_MS  = 30 * 60 * 1000;               // 30 min inactivity timeout for everyone
let _authRole = null, _authLoginRole = 'admin';
let _inactivityTimer = null, _countdownTimer = null;
let _passwords = { admin: 'GB8700', user: 'WP0001' };

async function loadPasswordsFromSupabase() {
  try {
    const res = await fetch(CONFIG.SUPABASE_URL + '/rest/v1/app_config?key=in.(admin_password,user_password)&select=key,value', {
      headers: { 'apikey': CONFIG.SUPABASE_KEY, 'Authorization': 'Bearer ' + CONFIG.SUPABASE_KEY }
    });
    if (!res.ok) return;
    const rows = await res.json();
    if (Array.isArray(rows)) rows.forEach(r => {
      if (r.key === 'admin_password') _passwords.admin = r.value;
      if (r.key === 'user_password')  _passwords.user  = r.value;
    });
  } catch(e) {}
}

async function savePasswordToSupabase(role, newPw) {
  try {
    const key = role === 'admin' ? 'admin_password' : 'user_password';
    await fetch(CONFIG.SUPABASE_URL + '/rest/v1/app_config', {
      method: 'POST',
      headers: { 'apikey': CONFIG.SUPABASE_KEY, 'Authorization': 'Bearer ' + CONFIG.SUPABASE_KEY, 'Content-Type': 'application/json', 'Prefer': 'resolution=merge-duplicates' },
      body: JSON.stringify([{ key, value: newPw }])
    });
  } catch(e) {}
}

function authSelectRole(role) {
  _authLoginRole = role;
  document.getElementById('tabAdmin').classList.toggle('active', role === 'admin');
  document.getElementById('tabUser').classList.toggle('active', role === 'user');
  document.getElementById('authRememberRow').style.display = role === 'admin' ? 'flex' : 'none';
  document.getElementById('authUser').value = '';
  document.getElementById('authPass').value = '';
  document.getElementById('authErr').style.display = 'none';
}

async function authLogin() {
  const u = document.getElementById('authUser').value.trim().toLowerCase();
  const p = document.getElementById('authPass').value;
  const errEl = document.getElementById('authErr');
  errEl.style.display = 'none';
  if (u !== {admin:'admin',user:'willow'}[_authLoginRole] || p !== _passwords[_authLoginRole]) {
    errEl.style.display = 'block';
    document.getElementById('authPass').value = '';
    return;
  }
  _authRole = _authLoginRole;
  // Save session so refresh keeps user logged in
  sessionStorage.setItem(SESSION_KEY, _authRole);
  // Admin also gets localStorage so it persists across browser sessions
  if (_authRole === 'admin' && document.getElementById('authRemember').checked) localStorage.setItem(REMEMBER_KEY, 'admin');
  document.getElementById('authScreen').style.display = 'none';
  startInactivityTimer();
  boot();
}

function authSignOut() {
  stopInactivityTimer();
  _authRole = null;
  sessionStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(REMEMBER_KEY);
  document.getElementById('inactivityBanner').style.display = 'none';
  location.reload();
}

function startInactivityTimer() {
  resetInactivityTimer();
  ['mousemove','keydown','click','touchstart','scroll'].forEach(ev =>
    document.addEventListener(ev, resetInactivityTimer, { passive: true }));
}
function resetInactivityTimer() {
  if (_inactivityTimer) clearTimeout(_inactivityTimer);
  if (_countdownTimer) clearInterval(_countdownTimer);
  document.getElementById('inactivityBanner').style.display = 'none';
  _inactivityTimer = setTimeout(showInactivityWarning, INACTIVITY_MS - 60000);
}
function showInactivityWarning() {
  document.getElementById('inactivityBanner').style.display = 'block';
  let secs = 60;
  document.getElementById('inactivityCountdown').textContent = secs;
  _countdownTimer = setInterval(() => {
    secs--;
    document.getElementById('inactivityCountdown').textContent = secs;
    if (secs <= 0) { clearInterval(_countdownTimer); authSignOut(); }
  }, 1000);
}
function stopInactivityTimer() {
  if (_inactivityTimer) clearTimeout(_inactivityTimer);
  if (_countdownTimer) clearInterval(_countdownTimer);
  ['mousemove','keydown','click','touchstart','scroll'].forEach(ev =>
    document.removeEventListener(ev, resetInactivityTimer));
}

function openChpw() {
  document.getElementById('chpwErr').style.display = 'none';
  document.getElementById('chpwOk').style.display = 'none';
  ['chpwMaster','chpwNew','chpwConfirm'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('chpwOverlay').classList.add('open');
}
function openChpwFor(role) { document.getElementById('chpwAccount').value = role; openChpw(); }
function closeChpw() { document.getElementById('chpwOverlay').classList.remove('open'); }

async function saveChpw() {
  const account = document.getElementById('chpwAccount').value;
  const master  = document.getElementById('chpwMaster').value;
  const newPw   = document.getElementById('chpwNew').value.trim();
  const confirm = document.getElementById('chpwConfirm').value.trim();
  const errEl = document.getElementById('chpwErr'), okEl = document.getElementById('chpwOk');
  errEl.style.display = 'none'; okEl.style.display = 'none';
  if (master !== _passwords.admin) { errEl.textContent = 'Master password is incorrect.'; errEl.style.display = 'block'; return; }
  if (!newPw) { errEl.textContent = 'Password cannot be empty.'; errEl.style.display = 'block'; return; }
  if (newPw !== confirm) { errEl.textContent = 'Passwords do not match.'; errEl.style.display = 'block'; return; }
  await savePasswordToSupabase(account, newPw);
  _passwords[account] = newPw;
  okEl.textContent = `✓ Password for ${account === 'admin' ? 'Admin' : 'Willow'} updated.`;
  okEl.style.display = 'block';
  setTimeout(closeChpw, 2000);
  if (typeof toast === 'function') toast('Password changed ✓', 'success');
}

async function authInit() {
  // Show remember me row since Admin is default tab
  const remRow = document.getElementById('authRememberRow');
  if (remRow) remRow.style.display = 'flex';
  await loadPasswordsFromSupabase();
  // Check sessionStorage first (survives refresh, cleared on tab/browser close)
  const session = sessionStorage.getItem(SESSION_KEY);
  if (session) {
    _authRole = session;
    startInactivityTimer();
    boot();
    return;
  }
  // Check localStorage for admin persistent login
  const stored = localStorage.getItem(REMEMBER_KEY);
  if (stored === 'admin') {
    _authRole = 'admin';
    sessionStorage.setItem(SESSION_KEY, 'admin');
    startInactivityTimer();
    boot();
    return;
  }
  // No session — show login
  document.getElementById('authScreen').style.display = 'flex';
}

function updateHeaderClock() {
  const el = document.getElementById('headerClock');
  if (!el) return;
  const now = new Date();
  el.textContent = '📅 ' +
    now.toLocaleDateString('en-US', {weekday:'short',month:'short',day:'numeric',year:'numeric'}) +
    '  🕒 ' + now.toLocaleTimeString('en-US', {hour:'2-digit',minute:'2-digit'});
}
updateHeaderClock();
setInterval(updateHeaderClock, 1000);

// Run auth gate immediately — session check then boot
(async () => {
  await authInit();
  try { await checkBackupStatus(); setInterval(checkBackupStatus, 60000); } catch(e) {}
})();

// ═══════════════════════════════════════
// PRICING VIEW — standalone, additive
// ═══════════════════════════════════════
const PXW = 68;
let _pxPer = [], _pxUnits = [], _pxDts = [];
let _pxDrag = false, _pxDragD = null;
let _pxSelA = new Set(), _pxSelS = null, _pxSelE = null;

// Toggle
function pxSetView(mode) {
  const ip = mode === 'pricing';
  document.getElementById('pxBtnBook').classList.toggle('active', !ip);
  document.getElementById('pxBtnPrice').classList.toggle('active', ip);
  document.getElementById('calWrap').style.display  = ip ? 'none' : '';
  document.getElementById('pxLayer').style.display  = ip ? 'flex' : 'none';  document.getElementById('pxLegBook').style.display   = ip ? 'none' : 'flex';
  document.getElementById('pxLegPrice').style.display  = ip ? 'flex' : 'none';
  if (ip) pxRender(); else { _pxSelA=new Set(); _pxSelS=null; _pxSelE=null; }
}

// Load pricing periods
async function pxLoad() {
  try {
    const {data:r,error} = await sb.from('pricing_periods').select('*');
    if (!error && r) _pxPer = r;
  } catch(e) {}
}
function pxGet(apt, d) {
  const h = _pxPer.filter(p => p.apt===apt && p.start_date<=d && p.end_date>=d);
  return h.length ? h.sort((a,b)=>b.id-a.id)[0] : null;
}

// Main render
function pxRender() {
  const DA=['SU','MO','TU','WE','TH','FR','SA'];
  const MO=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const tod = new Date().toISOString().split('T')[0];

  // Build dates: 90 back, 150 forward
  _pxDts=[];
  const t=new Date();
  for(let i=-90;i<=150;i++){const d=new Date(t);d.setDate(t.getDate()+i);_pxDts.push(d.toISOString().split('T')[0]);}
  const wS=_pxDts[0], wE=_pxDts[_pxDts.length-1];

  // Units: short-stay + available only, deduped by apt
  const q=(document.getElementById('calSearch')?.value||'').toLowerCase();
  // Get all unique apts that have short-stay or available units
  let us=data.filter(r=>!r.archived&&(r.type==='short-stay'||r.type==='available'));
  if(q) us=us.filter(r=>(r.apt||'').toLowerCase().includes(q)||(r.name||'').toLowerCase().includes(q));
  // Dedup: IDENTICAL logic to booking calendar
  // Priority: 1. available type row  2. current row  3. future row  4. lowest id
  const bA=new Map();
  for(const r of us){
    const prev=bA.get(r.apt);
    if(!prev){bA.set(r.apt,r);continue;}
    const rFuture=!!(r.checkin&&r.checkin>tod);
    const prevFuture=!!(prev.checkin&&prev.checkin>tod);
    const rAvail=(r.type==='available');
    const prevAvail=(prev.type==='available');
    if(rAvail&&!prevAvail){bA.set(r.apt,r);continue;}
    if(prevAvail&&!rAvail){continue;}
    if(!rFuture&&prevFuture){bA.set(r.apt,r);continue;}
    if(!prevFuture&&rFuture){continue;}
    if((r.id||0)<(prev.id||0)) bA.set(r.apt,r);
  }
  _pxUnits=[...bA.values()].sort((a,b)=>(a.apt||'').localeCompare(b.apt||'',undefined,{numeric:true}));
  document.getElementById('pxUcount').textContent=`Units (${_pxUnits.length})`;

  // Units col
  const meta=typeof getCalUnitMeta==='function'?getCalUnitMeta():{};
  document.getElementById('pxUlist').innerHTML=_pxUnits.map(r=>{
    const m=meta[r.apt]||{};
    return `<div class="urow"><div style="flex:1;overflow:hidden;"><div class="uname">${r.apt}</div>${m.brBath?`<div class="usub">${m.brBath}</div>`:''}</div></div>`;
  }).join('');

  // Month row
  let lM=-1,mG=[];
  _pxDts.forEach(d=>{const mo=parseInt(d.substring(5,7))-1,yr=parseInt(d.substring(0,4));if(mo!==lM){mG.push({mo,yr,c:1});lM=mo;}else mG[mG.length-1].c++;});
  document.getElementById('pxMrow').innerHTML=mG.map(g=>`<div style="width:${g.c*PXW}px;flex-shrink:0;display:flex;align-items:center;padding:0 8px;font-family:'Playfair Display',serif;font-size:12px;font-weight:700;color:var(--accent2);border-right:2px solid var(--border2);box-sizing:border-box;">${MO[g.mo]} ${g.yr}</div>`).join('');

  // Day headers
  document.getElementById('pxDhdr').innerHTML=_pxDts.map(d=>{
    const dt=new Date(d+'T00:00:00'),dw=dt.getDay();
    return `<div class="dcell${dw===0||dw===6?' we':''}${d===tod?' td':''}"><div class="dn">${dt.getDate()}</div><span style="font-size:8px;">${DA[dw]}</span></div>`;
  }).join('');

  // Rows
  const rowsEl=document.getElementById('pxRowsEl');
  rowsEl.innerHTML='';

  _pxUnits.forEach(r=>{
    const rowDiv=document.createElement('div');
    rowDiv.className='prow';
    rowDiv.style.width=(_pxDts.length*PXW)+'px';

    // Collect all bookings for this apt — active AND archived — for bar rendering
    const bars=[];
    // Active records — same logic as booking calendar: type != available AND has name
    data.filter(x=>!x.archived&&x.apt===r.apt&&x.type!=='available'&&x.name).forEach(x=>{
      const from=x.checkin||wS, to=x.due||x.lease_end||'';
      if(from&&to&&from<=wE) bars.push({name:x.name,from,to,type:x.type,note:x.note||''});
    });
    // Archive past stays — only show if within visible window AND not ended before today
    archived.filter(x=>x.apt===r.apt&&x.name).forEach(x=>{
      const from=x.checkin||x.archivedDate||x.due||'';
      const to=x.archivedDate||x.due||'';
      if(from&&to&&to>=wS&&from<=wE) bars.push({name:x.name,from,to,type:x.type,note:x.note||''});
    });
    // Blocks
    const blks=typeof getBlocks==='function'?(getBlocks()[r.apt]||[]):[];
    blks.forEach(b=>bars.push({name:b.reason||'Blocked',from:b.from,to:b.to,type:'__block__'}));

    // Build occupied date set — only from bars with valid date ranges
    const occ=new Set();
    bars.forEach(b=>{
      if(!b.from||!b.to) return;
      _pxDts.forEach(d=>{if(d>=b.from&&d<=b.to)occ.add(d);});
    });

    // Build cells HTML
    let html='';
    _pxDts.forEach(d=>{
      const dt=new Date(d+'T00:00:00'),dw=dt.getDay();
      const isWE=dw===0||dw===6, isT=d===tod, isO=occ.has(d);
      const isSel=_pxSelA.has(r.apt)&&_pxSelS&&_pxSelE&&d>=_pxSelS&&d<=_pxSelE;
      let cls='pcell'+(isWE?' we':'')+(isT?' td':'')+(isSel?' sl':'');
      if(isO){
        html+=`<div class="${cls}" data-a="${r.apt}" data-d="${d}"></div>`;
      } else {
        cls+=' av';
        const per=pxGet(r.apt,d);
        const prop=Array.isArray(propertiesData)?propertiesData.find(p=>p.internal_apt===r.apt||p.apt===r.apt):null;
        const rate=per?.nightly_rate!=null?per.nightly_rate:(prop?.base_price!=null?prop.base_price:null);
        const mins=per?.min_stay!=null?per.min_stay:(prop?.min_stay!=null?prop.min_stay:null);
        const ov=!!per;
        const rh=rate!=null?`<span class="prate${ov?' ov':''}">$${Math.round(rate)}</span>`:'<span class="prate" style="color:var(--border2);">—</span>';
        const mh=mins!=null?`<span class="pmin" style="display:flex;align-items:center;gap:1px;"><svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor" style="flex-shrink:0;"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>${mins}nt</span>`:'';
        html+=`<div class="${cls}" data-a="${r.apt}" data-d="${d}"
          onmousedown="pxDn(event,'${r.apt}','${d}')"
          onmousemove="pxMv(event,'${r.apt}','${d}')"
          onmouseup="pxUp()"
          title="${r.apt} ${d}${rate!=null?' $'+Math.round(rate)+'/nt':''}${mins!=null?' min '+mins+'nts':''}">
          ${mh}${rh}</div>`;
      }
    });
    rowDiv.innerHTML=html;

    // Overlay booking bars — same colors as booking view, slightly faded
    bars.forEach(b=>{
      const cf=b.from<wS?wS:b.from, ct=b.to>wE?wE:b.to;
      if(cf>wE||ct<wS) return;
      // Find indices
      const si=_pxDts.indexOf(cf), ei=_pxDts.indexOf(ct);
      if(si<0||ei<0) return;
      const span=ei-si+1; if(span<1) return;
      const lx=si*PXW+2, wx=span*PXW-4;
      const bg=b.type==='long-term'      ?'linear-gradient(90deg,#2563a8,#1e5799)'
              :b.type==='month-to-month' ?'linear-gradient(90deg,#7c4fbe,#5e3f9e)'
              :b.type==='short-stay'     ?'linear-gradient(90deg,#e07818,#b86818)'
              :b.type==='__block__'      ?'linear-gradient(90deg,#c0392b,#962d22)'
              :                           'linear-gradient(90deg,#888,#666)';
      const badge=typeof getChannelBadge==='function'?getChannelBadge(b.note||''):'';
      const el=document.createElement('div');
      el.className='cal-bar';
      el.style.cssText=`left:${lx}px;width:${wx}px;opacity:0.55;z-index:5;overflow:hidden;`;
      el.title=`${b.name} (${b.from} \u2192 ${b.to})`;
      el.dataset.bL=lx; el.dataset.bR=lx+wx;
      el.dataset.bN=b.name; el.dataset.bB=badge.replace(/"/g,"'");
      el.innerHTML=`<div class="cal-bar-bg" style="background:${bg}"></div>`;
      rowDiv.appendChild(el);
    });

    // Floating label overlay
    const ld=document.createElement('div');
    ld.className='cal-row-labels';
    rowDiv.appendChild(ld);
    rowsEl.appendChild(rowDiv);
  });

  // Set widths
  const tw=_pxDts.length*PXW;
  ['pxGrid','pxRowsEl','pxDhdr','pxMrow'].forEach(id=>{document.getElementById(id).style.width=tw+'px';});

  // Floating labels on scroll
  const go=document.getElementById('pxGouter');
  const uc=document.getElementById('pxUcol');
  function pxLabels(){
    const sl=go.scrollLeft, vw=go.clientWidth;
    uc.scrollTop=go.scrollTop;
    document.querySelectorAll('#pxRowsEl .cal-row-labels').forEach(ld=>{
      ld.innerHTML='';
      // Position the labels overlay to match scroll position
      ld.style.left = sl+'px';
      ld.style.width = vw+'px';
      ld.parentElement.querySelectorAll('.cal-bar').forEach(b=>{
        const bL=parseFloat(b.dataset.bL||0), bR=parseFloat(b.dataset.bR||0);
        const nm=b.dataset.bN||'', bg=b.dataset.bB||'';
        if(!nm) return;
        // Visible portion in scroll coords
        const vL=Math.max(bL,sl), vR=Math.min(bR,sl+vw);
        if(vR<=vL+20) return; // not enough room
        const e=document.createElement('div');
        e.className='cal-float-label';
        // left is relative to the labels div which is now offset by sl
        e.style.cssText=`left:${vL-sl+6}px;max-width:${vR-vL-12}px;color:#fff;`;
        e.innerHTML=`${bg}<span class="cal-bar-label">${nm}</span>`;
        ld.appendChild(e);
      });
    });
  }
  go.onscroll=pxLabels;
  uc.onscroll=()=>{go.scrollTop=uc.scrollTop;};
  // Scroll to today on first render only
  if(!go._sc){
    go._sc=true;
    const ti=_pxDts.indexOf(tod);
    if(ti>=0) go.scrollLeft=Math.max(0,ti*PXW-150);
  }
  // Draw labels after scroll and layout settle
  setTimeout(()=>requestAnimationFrame(()=>requestAnimationFrame(pxLabels)),100);
}

// Mouse selection
function pxDn(e,apt,d){e.preventDefault();_pxDrag=true;_pxDragD=d;if(!e.shiftKey){_pxSelA=new Set();_pxSelS=d;_pxSelE=d;}_pxSelA.add(apt);_pxSelS=(!e.shiftKey||!_pxSelS)?d:(_pxSelS<d?_pxSelS:d);_pxSelE=d;pxHL();}
function pxMv(e,apt,d){if(!_pxDrag)return;_pxSelS=_pxDragD<d?_pxDragD:d;_pxSelE=_pxDragD>d?_pxDragD:d;_pxSelA.add(apt);pxHL();}
function pxUp(){if(!_pxDrag)return;_pxDrag=false;if(_pxSelA.size&&_pxSelS)pxOpenM();}
document.addEventListener('mouseup',()=>{if(_pxDrag){_pxDrag=false;if(_pxSelA.size&&_pxSelS)pxOpenM();}});
function pxHL(){document.querySelectorAll('#pxRowsEl .pcell').forEach(c=>{c.classList.toggle('sl',_pxSelA.has(c.dataset.a)&&c.dataset.d>=_pxSelS&&c.dataset.d<=_pxSelE);});}

// Modal
function pxOpenM(){
  const apts=[..._pxSelA];
  document.getElementById('pxMcount').textContent=`${apts.length} unit${apts.length===1?'':'s'}`;
  document.getElementById('pxMapts').textContent=apts.join(', ');
  document.getElementById('pxS').value=_pxSelS||'';
  document.getElementById('pxE').value=_pxSelE||'';
  document.getElementById('pxRT').value='fixed';
  document.getElementById('pxRU').textContent='$';
  document.getElementById('pxRV').value='';
  document.getElementById('pxMS').value='';
  if(apts.length===1&&_pxSelS){
    const p=pxGet(apts[0],_pxSelS);
    const pr=propertiesData?.find(x=>x.internal_apt===apts[0]||x.apt===apts[0]);
    const rv=p?.nightly_rate??pr?.base_price??null;
    const mv=p?.min_stay??pr?.min_stay??null;
    if(rv!=null)document.getElementById('pxRV').value=Math.round(rv);
    if(mv!=null)document.getElementById('pxMS').value=mv;
  }
  const DAYS=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
  ['pxCI','pxCO'].forEach(id=>{document.getElementById(id).innerHTML=DAYS.map(d=>`<label style="display:flex;align-items:center;gap:6px;font-size:11px;color:var(--text2);padding:2px 0;cursor:pointer;"><input type="checkbox" checked style="accent-color:var(--accent);"> ${d}</label>`).join('');});
  document.getElementById('pxRB').style.display='none';
  document.getElementById('pxRA').textContent='▼';
  openModal('pxModalEl');
}
function pxResetSel(){_pxSelA=new Set();_pxSelS=null;_pxSelE=null;document.querySelectorAll('#pxRowsEl .sl').forEach(c=>c.classList.remove('sl'));closeModal('pxModalEl');}
async function pxSave(){
  const s=document.getElementById('pxS').value,e=document.getElementById('pxE').value;
  if(!s||!e){toast('Set start and end dates','error');return;}
  if(e<s){toast('End must be after start','error');return;}
  const rt=document.getElementById('pxRT').value,rv=parseFloat(document.getElementById('pxRV').value);
  const ms=parseInt(document.getElementById('pxMS').value)||null;
  const apts=[..._pxSelA];
  if(isNaN(rv)&&!ms){toast('Enter a rate or min stay','error');return;}
  const btn=document.getElementById('pxSvBtn');btn.textContent='Saving...';btn.disabled=true;
  try{
    const recs=apts.map(apt=>{
      let nr=null;
      if(!isNaN(rv)){
        if(rt==='fixed'){nr=rv;}
        else{const p=pxGet(apt,s);const pr=propertiesData?.find(x=>x.internal_apt===apt||x.apt===apt);const base=p?.nightly_rate??pr?.base_price??0;
          if(rt==='inc_pct')nr=Math.round(base*(1+rv/100));else if(rt==='dec_pct')nr=Math.max(0,Math.round(base*(1-rv/100)));
          else if(rt==='inc_amt')nr=base+rv;else if(rt==='dec_amt')nr=Math.max(0,base-rv);}
      }
      return{apt,start_date:s,end_date:e,nightly_rate:nr,min_stay:ms};
    });
    const{error}=await sb.from('pricing_periods').insert(recs);
    if(error)throw new Error(error.message);
    await pxLoad();closeModal('pxModalEl');_pxSelA=new Set();_pxSelS=null;_pxSelE=null;
    pxRender();toast(`Saved for ${apts.length} unit${apts.length===1?'':'s'} \u2713`,'success');
  }catch(err){toast('Save failed: '+err.message,'error');}
  finally{btn.textContent='\uD83D\uDCBE Save';btn.disabled=false;}
}
pxLoad().catch(()=>{});

// ═══ FIELDTRACK / TECHTRACK — Dashboard Work Orders Card ═══
function updateDashWorkOrders() {
  if (typeof FT_state === 'undefined' || !FT_state.jobs) return;
  const jobs = FT_state.jobs;
  const open = jobs.filter(j => j.status === 'open' || j.status === 'waiting_parts').length;
  const progress = jobs.filter(j => j.status === 'in_progress' || j.status === 'pending_approval').length;
  const closed = jobs.filter(j => j.status === 'complete').length;
  const el = id => document.getElementById(id);
  if (el('wo-open')) el('wo-open').textContent = open;
  if (el('wo-progress')) el('wo-progress').textContent = progress;
  if (el('wo-closed')) el('wo-closed').textContent = closed;
  const label = el('wo-status-label');
  if (label) label.textContent = jobs.length > 0 ? `${jobs.length} total work orders` : 'No work orders yet';
}

// Fetch FT data for dashboard card on page load
(function initFTDashData() {
  fetch('https://tech.willowpa.com/state.php')
    .then(r => r.json())
    .then(d => {
      // state.php returns {ok:true, state:{...}} wrapper
      const s = (d && d.state) ? d.state : d;
      if (s && s.jobs) {
        // Temporarily set FT_state if not yet loaded
        if (typeof FT_state !== 'undefined') {
          if (!FT_state._initialized || FT_state.jobs.length === 0) {
            ['owners','technicians','properties','jobs','users','_nextId','_initialized'].forEach(k => {
              if (s[k] !== undefined) FT_state[k] = s[k];
            });
          }
        }
        // Update dashboard card
        const jobs = s.jobs || [];
        const open = jobs.filter(j => j.status === 'open' || j.status === 'waiting_parts').length;
        const progress = jobs.filter(j => j.status === 'in_progress' || j.status === 'pending_approval').length;
        const closed = jobs.filter(j => j.status === 'complete').length;
        const el = id => document.getElementById(id);
        if (el('wo-open')) el('wo-open').textContent = open;
        if (el('wo-progress')) el('wo-progress').textContent = progress;
        if (el('wo-closed')) el('wo-closed').textContent = closed;
        const label = el('wo-status-label');
        if (label) label.textContent = `${jobs.length} total work orders`;
      }
    })
    .catch(e => {
      console.warn('FT dashboard data fetch error:', e);
      const label = document.getElementById('wo-status-label');
      if (label) label.textContent = 'Could not load FieldTrack data';
    });
})();

// ══════════════════════════════════════════════════════
//  DELIVERY / MAILROOM ADMIN MODULE
// ══════════════════════════════════════════════════════
var DL_API = 'https://delivery.willowpa.com/api.php';
var DL_ADMIN_TOKEN = (typeof CONFIG !== 'undefined' && CONFIG.ADMIN_TOKEN) || '';
var _dlPackages = [];
var _dlTenants = [];
var _dlSelectedCourier = '';

function showDeliverySection(sec) {
  ['dlPackagesSection','dlTenantsSection','dlReportsSection','dlKioskSection'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
  var target = document.getElementById('dl' + sec.charAt(0).toUpperCase() + sec.slice(1) + 'Section');
  if (target) target.style.display = 'block';

  WPA_dlLoadStats();
  if (sec === 'packages') WPA_dlLoadPackages();
  if (sec === 'tenants') WPA_dlLoadTenants();
  if (sec === 'reports') WPA_dlInitReports();
  if (sec === 'kiosk') { WPA_dlLoadUpdates(); WPA_dlLoadImages(); }
}

function dlFetch(action, method, body) {
  var opts = {
    method: method || 'GET',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + DL_ADMIN_TOKEN }
  };
  if (body) opts.body = JSON.stringify(body);
  return fetch(DL_API + '?action=' + action, opts).then(function(r) { return r.json(); });
}

function WPA_dlRefresh() {
  WPA_dlLoadStats();
  if (document.getElementById('dlPackagesSection').style.display !== 'none') WPA_dlLoadPackages();
  if (document.getElementById('dlTenantsSection').style.display !== 'none') WPA_dlLoadTenants();
  if (document.getElementById('dlReportsSection').style.display !== 'none') WPA_dlLoadReports();
  if (document.getElementById('dlKioskSection').style.display !== 'none') { WPA_dlLoadUpdates(); WPA_dlLoadImages(); }
}

function DL_selectCourier(btn, courier) {
  document.querySelectorAll('.dl-courier-btn').forEach(function(b) { b.classList.remove('dl-courier-active'); });
  btn.classList.add('dl-courier-active');
  _dlSelectedCourier = courier;
}

// ── Stats ──
function WPA_dlLoadStats() {
  dlFetch('admin-stats').then(function(d) {
    if (!d.ok) return;
    var s = d.stats;
    var el = function(id) { return document.getElementById(id); };
    if (el('dl-stat-pending')) el('dl-stat-pending').textContent = s.pending || 0;
    if (el('dl-stat-collected')) el('dl-stat-collected').textContent = s.collected_today || 0;
    if (el('dl-stat-month')) el('dl-stat-month').textContent = s.total_month || 0;
    if (el('dl-stat-units')) el('dl-stat-units').textContent = s.units_waiting || 0;
    if (el('dashMailroom')) el('dashMailroom').innerHTML = '<div style="font-size:20px;font-weight:700;color:var(--red)">' + (s.pending || 0) + '</div><div style="font-size:11px;color:var(--text-dim)">packages waiting · ' + (s.units_waiting || 0) + ' units</div>';
  }).catch(function(e) { console.warn('DL stats error:', e); });
}

// ── Packages ──
function WPA_dlLoadPackages() {
  var status = document.getElementById('dlFilterStatus').value;
  var qs = status !== 'all' ? '&status=' + status : '';
  dlFetch('admin-packages' + qs).then(function(d) {
    if (!d.ok) return;
    _dlPackages = d.packages || [];
    WPA_dlRenderPackages(_dlPackages);
  });
}

function WPA_dlFilterPackages() {
  var q = (document.getElementById('dlSearchPkg').value || '').toLowerCase();
  var status = document.getElementById('dlFilterStatus').value;
  var filtered = _dlPackages.filter(function(p) {
    var matchQ = !q || p.unit.toLowerCase().indexOf(q) >= 0;
    var matchS = status === 'all' || p.status === status;
    return matchQ && matchS;
  });
  WPA_dlRenderPackages(filtered);
}

function WPA_dlRenderPackages(list) {
  var tbody = document.getElementById('dlPackagesTbody');
  if (!tbody) return;
  if (list.length === 0) {
    tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;color:var(--text-dim);padding:20px">No packages found</td></tr>';
    return;
  }
  tbody.innerHTML = list.map(function(p) {
    var statusClass = p.status === 'Pending' ? 'dl-status-pending' : 'dl-status-collected';
    return '<tr>' +
      '<td><input type="checkbox" class="dl-pkg-check" value="' + p.unit + '"></td>' +
      '<td><strong>' + p.unit + '</strong></td>' +
      '<td>' + p.count + '</td>' +
      '<td>' + (p.courier || '—') + '</td>' +
      '<td>' + (p.has_phone ? '<span style="color:var(--green)">Y</span>' : '<span style="color:var(--text-dim)">N</span>') + '</td>' +
      '<td><span class="' + statusClass + '">' + p.status + '</span></td>' +
      '<td style="font-size:11px;color:var(--text-dim)">' + DL_fmtTime(p.created) + '</td>' +
      '<td style="font-size:11px;color:var(--text-dim)">' + (p.collected ? DL_fmtTime(p.collected) : '—') + '</td>' +
      '<td>' + (p.status === 'Pending' ? '<a href="javascript:;" onclick="WPA_dlConfirmPickup(\'' + p.unit + '\')" style="color:var(--green);font-size:11px">✓ Collect</a>' : '') + '</td>' +
    '</tr>';
  }).join('');
}

function WPA_dlLogPackage() {
  var unit = document.getElementById('dlAddUnit').value.trim();
  var count = parseInt(document.getElementById('dlAddCount').value) || 1;
  if (!unit) { alert('Enter unit #'); return; }
  dlFetch('log-package', 'POST', { unit: unit, count: count, courier: _dlSelectedCourier }).then(function(d) {
    if (d.error) { alert(d.error); return; }
    document.getElementById('dlAddUnit').value = '';
    document.getElementById('dlAddCount').value = '1';
    _dlSelectedCourier = '';
    document.querySelectorAll('.dl-courier-btn').forEach(function(b) { b.classList.remove('dl-courier-active'); });
    WPA_dlLoadPackages();
    WPA_dlLoadStats();
  });
}

function WPA_dlConfirmPickup(unit) {
  dlFetch('confirm-pickup', 'POST', { unit: unit }).then(function(d) {
    if (d.ok) { WPA_dlLoadPackages(); WPA_dlLoadStats(); }
  });
}

function DL_toggleAllPkg(cb) {
  document.querySelectorAll('.dl-pkg-check').forEach(function(c) { c.checked = cb.checked; });
}

function WPA_dlBulkDeletePkg() {
  var units = [];
  document.querySelectorAll('.dl-pkg-check:checked').forEach(function(c) { units.push(c.value); });
  if (units.length === 0) { alert('Select packages first'); return; }
  if (!confirm('Delete ' + units.length + ' package record(s)?')) return;
  dlFetch('admin-delete-packages', 'POST', { units: units }).then(function(d) {
    if (d.ok) { WPA_dlLoadPackages(); WPA_dlLoadStats(); }
  });
}

// ── Tenants ──
function WPA_dlLoadTenants() {
  dlFetch('admin-tenants').then(function(d) {
    if (!d.ok) return;
    _dlTenants = d.tenants || [];
    WPA_dlRenderTenants(_dlTenants);
  });
}

function WPA_dlShowAllTenants() { WPA_dlLoadTenants(); }

function WPA_dlRenderTenants(list) {
  var tbody = document.getElementById('dlTenantsTbody');
  if (!tbody) return;
  if (list.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:var(--text-dim);padding:20px">No tenants registered</td></tr>';
    return;
  }
  tbody.innerHTML = list.map(function(t) {
    return '<tr>' +
      '<td><input type="checkbox" class="dl-tenant-check" value="' + t.unit + '"></td>' +
      '<td><strong>' + t.unit + '</strong></td>' +
      '<td><input type="text" class="pk-admin-input dl-tenant-phone" data-unit="' + t.unit + '" value="' + (t.phone || '') + '" style="width:120px"></td>' +
      '<td>' + (t.sms_opt ? '<span style="color:var(--green)">Y</span>' : '<span style="color:var(--red)">N</span>') + '</td>' +
      '<td style="font-size:11px;color:var(--text-dim)">' + DL_fmtTime(t.created) + '</td>' +
      '<td>' +
        '<a href="javascript:;" onclick="WPA_dlUpdateTenant(\'' + t.unit + '\')" style="color:var(--accent);font-size:11px">Save</a> ' +
        '<a href="javascript:;" onclick="WPA_dlDeleteTenant(\'' + t.unit + '\')" style="color:var(--red);font-size:11px;margin-left:6px">Del</a>' +
      '</td>' +
    '</tr>';
  }).join('');
}

function WPA_dlSaveTenant() {
  var unit = document.getElementById('dlAddTenantUnit').value.trim();
  var phone = document.getElementById('dlAddTenantPhone').value.trim();
  if (!unit || !phone) { alert('Enter unit and phone'); return; }
  dlFetch('admin-update-tenant', 'POST', { unit: unit, phone: phone }).then(function(d) {
    if (d.error) { alert(d.error); return; }
    document.getElementById('dlAddTenantUnit').value = '';
    document.getElementById('dlAddTenantPhone').value = '';
    WPA_dlLoadTenants();
  });
}

function WPA_dlUpdateTenant(unit) {
  var input = document.querySelector('.dl-tenant-phone[data-unit="' + unit + '"]');
  if (!input) return;
  dlFetch('admin-update-tenant', 'POST', { unit: unit, phone: input.value }).then(function(d) {
    if (d.error) { alert(d.error); return; }
    WPA_dlLoadTenants();
  });
}

function WPA_dlDeleteTenant(unit) {
  if (!confirm('Delete tenant for unit ' + unit + '?')) return;
  dlFetch('admin-delete-tenant', 'POST', { unit: unit }).then(function(d) {
    if (d.ok) WPA_dlLoadTenants();
  });
}

function DL_toggleAllTenants(cb) {
  document.querySelectorAll('.dl-tenant-check').forEach(function(c) { c.checked = cb.checked; });
}

function WPA_dlBulkDeleteTenants() {
  var units = [];
  document.querySelectorAll('.dl-tenant-check:checked').forEach(function(c) { units.push(c.value); });
  if (units.length === 0) { alert('Select tenants first'); return; }
  if (!confirm('Delete ' + units.length + ' tenant(s)?')) return;
  dlFetch('admin-bulk-delete-tenants', 'POST', { units: units }).then(function(d) {
    if (d.ok) WPA_dlLoadTenants();
  });
}

// ── Reports ──
function WPA_dlInitReports() {
  var today = new Date().toISOString().split('T')[0];
  document.getElementById('dlReportFrom').value = today;
  document.getElementById('dlReportTo').value = today;
  WPA_dlLoadReports();
}

function WPA_dlLoadReports() {
  var type = document.getElementById('dlReportType').value;
  var from = document.getElementById('dlReportFrom').value;
  var to = document.getElementById('dlReportTo').value;
  var thead = document.getElementById('dlReportThead');
  if (type === 'signup') {
    thead.innerHTML = '<tr><th>Unit</th><th>Phone</th><th>Modified</th></tr>';
  } else {
    thead.innerHTML = '<tr><th>Unit</th><th>Date Time</th><th>Log</th></tr>';
  }
  dlFetch('admin-reports&date_from=' + from + '&date_to=' + to + '&type=' + type).then(function(d) {
    if (!d.ok) return;
    var tbody = document.getElementById('dlReportsTbody');
    var data = d.data || [];
    if (data.length === 0) {
      tbody.innerHTML = '<tr><td colspan="3" style="text-align:center;color:var(--text-dim);padding:20px">No records</td></tr>';
      return;
    }
    if (type === 'signup') {
      tbody.innerHTML = data.map(function(r) {
        return '<tr><td>' + r.unit + '</td><td>' + (r.phone || '') + '</td><td style="font-size:11px;color:var(--text-dim)">' + DL_fmtTime(r.modified) + '</td></tr>';
      }).join('');
    } else {
      tbody.innerHTML = data.map(function(r) {
        return '<tr><td>' + r.unit + '</td><td style="font-size:11px;color:var(--text-dim)">' + DL_fmtTime(r.timestamp) + '</td><td>' + r.log + '</td></tr>';
      }).join('');
    }
  });
}

// ── Community Updates ──
function WPA_dlLoadUpdates() {
  dlFetch('admin-community-updates').then(function(d) {
    if (!d.ok) return;
    var list = d.updates || [];
    var el = document.getElementById('dlUpdatesList');
    if (!el) return;
    if (list.length === 0) { el.innerHTML = '<div style="color:var(--text-dim);font-size:12px;padding:10px">No community updates</div>'; return; }
    el.innerHTML = list.map(function(u) {
      return '<div style="padding:10px;border:1px solid var(--border);border-radius:8px;margin-bottom:8px;font-size:12px">' +
        '<div style="display:flex;justify-content:space-between;align-items:center">' +
          '<strong>' + u.title + '</strong>' +
          '<div>' +
            '<a href="javascript:;" onclick="WPA_dlToggleUpdate(\'' + u.id + '\',' + !u.active + ')" style="font-size:11px;color:' + (u.active ? 'var(--green)' : 'var(--text-dim)') + '">' + (u.active ? 'Active' : 'Inactive') + '</a> ' +
            '<a href="javascript:;" onclick="WPA_dlDeleteUpdate(\'' + u.id + '\')" style="font-size:11px;color:var(--red);margin-left:8px">Delete</a>' +
          '</div>' +
        '</div>' +
        '<div style="color:var(--text-dim);margin-top:4px;white-space:pre-line">' + u.body + '</div>' +
      '</div>';
    }).join('');
  });
}

function WPA_dlSaveUpdate() {
  var title = document.getElementById('dlUpdateTitle').value.trim();
  var body = document.getElementById('dlUpdateBody').value.trim();
  if (!title) { alert('Enter a title'); return; }
  dlFetch('admin-community-updates', 'POST', { title: title, body: body }).then(function(d) {
    if (d.ok) { document.getElementById('dlUpdateTitle').value = ''; document.getElementById('dlUpdateBody').value = ''; WPA_dlLoadUpdates(); }
  });
}

function WPA_dlToggleUpdate(id, active) {
  dlFetch('admin-community-updates', 'POST', { id: id, active: active }).then(function(d) { if (d.ok) WPA_dlLoadUpdates(); });
}

function WPA_dlDeleteUpdate(id) {
  if (!confirm('Delete this update?')) return;
  dlFetch('admin-community-updates', 'DELETE', { id: id }).then(function(d) { if (d.ok) WPA_dlLoadUpdates(); });
}

// ── Kiosk Images ──
function WPA_dlLoadImages() {
  dlFetch('kiosk-images').then(function(d) {
    if (!d.ok) return;
    var images = d.images || [];
    var el = document.getElementById('dlImagesList');
    if (!el) return;
    if (images.length === 0) { el.innerHTML = '<div style="color:var(--text-dim);font-size:12px">No images uploaded</div>'; return; }
    el.innerHTML = images.map(function(img) {
      var url = DL_API.replace('api.php', 'uploads/' + img.filename);
      return '<div style="border:1px solid var(--border);border-radius:8px;padding:8px;width:180px">' +
        (img.ext === 'pdf' ? '<div style="font-size:11px;padding:20px 0;text-align:center">PDF: ' + img.filename + '</div>' : '<img src="' + url + '" style="width:100%;border-radius:4px;margin-bottom:4px">') +
        '<a href="javascript:;" onclick="WPA_dlDeleteImage(\'' + img.filename + '\')" style="font-size:11px;color:var(--red)">Delete</a>' +
      '</div>';
    }).join('');
  });
}

function WPA_dlUploadImage() {
  var input = document.getElementById('dlImageUpload');
  if (!input.files || !input.files[0]) return;
  var fd = new FormData();
  fd.append('file', input.files[0]);
  fetch(DL_API + '?action=admin-upload-image', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + DL_ADMIN_TOKEN },
    body: fd
  }).then(function(r) { return r.json(); }).then(function(d) {
    if (d.error) { alert(d.error); return; }
    input.value = '';
    WPA_dlLoadImages();
  });
}

function WPA_dlDeleteImage(filename) {
  if (!confirm('Delete this image?')) return;
  dlFetch('admin-delete-image', 'POST', { filename: filename }).then(function(d) { if (d.ok) WPA_dlLoadImages(); });
}

// ── Send Reminders ──
function WPA_dlSendReminder() {
  if (!confirm('Send SMS reminder to ALL pending packages?')) return;
  dlFetch('admin-send-reminder', 'POST', {}).then(function(d) {
    if (d.ok) alert('Sent ' + d.sent + ' reminder(s)');
  });
}

// ── Helpers ──
function DL_fmtTime(ts) {
  if (!ts) return '—';
  var d = new Date(ts);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var h = d.getHours(); var ampm = h >= 12 ? 'PM' : 'AM'; h = h % 12 || 12;
  var m = ('0' + d.getMinutes()).slice(-2);
  return months[d.getMonth()] + ' ' + d.getDate() + ' ' + d.getFullYear() + ', ' + h + ':' + m + ' ' + ampm;
}

function initDeliveryModule() { WPA_dlLoadStats(); }

function openTenantCardFromLease(tenantIdx) {
  // Switch to MTM Tenants sub-tab and open tenant detail
  switchModule('mtm-lt');
  setTimeout(function() {
    var subTabs = document.querySelectorAll('#subNav .sub-tab');
    subTabs.forEach(function(t) {
      t.classList.remove('active');
      if (t.textContent.trim() === 'Tenants') t.classList.add('active');
    });
    showSubPage('mtm-lt-tenants', null);
    setTimeout(function() {
      openTenantDetail(tenantIdx);
    }, 200);
  }, 150);
}

function parseNoteField(note, field) {
  if (!note) return '';
  var m = note.match(new RegExp(field + ':\\s*([^|\\n]+)', 'i'));
  return m ? m[1].trim() : '';
}

function msgTenantFromDetail() {
  if (typeof currentTenantIdx === 'undefined' || !INNAGO_TENANTS[currentTenantIdx]) return;
  var t = INNAGO_TENANTS[currentTenantIdx];
  if (typeof openInboxThread === 'function') {
    openInboxThread(t.name);
  } else {
    openMsgModal(t.name, t.email || '', t.phone || '', '', 'mtm');
  }
}

// ═══════════════════════════════════════════════════
//  UNIFIED CHANNEL SELECTOR — used across all message UIs
// ═══════════════════════════════════════════════════
window._MSG_CHANNELS = [
  {id:'app', label:'App', icon:'📱'},
  {id:'channel', label:'Channel', icon:'📢'},
  {id:'sms', label:'SMS', icon:'💬'},
  {id:'email', label:'Email', icon:'📧'},
  {id:'whatsapp', label:'WhatsApp', icon:'🟢'}
];

// Returns HTML string for channel selector buttons
window.buildChannelSelector = function(selectedId) {
  return '<div class="msg-channel-btns" style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px;">' +
    _MSG_CHANNELS.map(function(ch) {
      var cls = ch.id === (selectedId || 'app') ? ' active' : '';
      return '<button class="msg-ch-btn' + cls + '" data-channel="' + ch.id + '" onclick="selectMsgChannel(this)">' + ch.icon + ' ' + ch.label + '</button>';
    }).join('') + '</div>';
};

// Returns the currently selected channel id from a parent container
window.getSelectedChannel = function(container) {
  var btn = (container || document).querySelector('.msg-ch-btn.active');
  return btn ? btn.dataset.channel : 'app';
};

// Sends a message via the selected channel
window.sendViaChannel = function(channel, name, email, phone, body, opts) {
  opts = opts || {};
  if (channel === 'app') {
    // Insert into Supabase client_messages
    (async function() {
      try {
        var threadId = opts.threadId || (typeof crypto !== 'undefined' ? crypto.randomUUID() : Date.now().toString());
        var insert = { thread_id: threadId, resident_name: name, resident_email: email || '', resident_phone: phone || '', subject: opts.subject || 'Message', body: body, sender_type: 'management', read: false, created_at: new Date().toISOString() };
        if (opts.property) insert.property = opts.property;
        var res = await sb.from('client_messages').insert([insert]);
        if (res.error) throw res.error;
        toast('App message sent to ' + name, 'success');
        if (typeof _refreshClientMsgs === 'function') _refreshClientMsgs();
      } catch(e) { alert('Error sending app message: ' + e.message); }
    })();
  } else if (channel === 'sms') {
    if (!phone) { alert('No phone number available for SMS.'); return; }
    if (typeof sendSMS === 'function') sendSMS(phone, body);
    else window.open('sms:' + phone + '?body=' + encodeURIComponent(body));
  } else if (channel === 'email') {
    if (!email) { alert('No email available.'); return; }
    window.open('mailto:' + email + '?subject=' + encodeURIComponent(opts.subject || 'Message from Willow PA') + '&body=' + encodeURIComponent(body));
  } else if (channel === 'whatsapp') {
    if (!phone) { alert('No phone number available for WhatsApp.'); return; }
    var waPhone = phone.replace(/\D/g, '');
    window.open('https://wa.me/' + waPhone + '?text=' + encodeURIComponent(body), '_blank');
  } else if (channel === 'channel') {
    toast('Channel message queued for: ' + name, 'info');
  }
};

// ═══════════════════════════════════════════════════
//  MESSAGING MODAL — Send SMS/Email/WhatsApp/Channel
// ═══════════════════════════════════════════════════
function openMsgModal(name, email, phone, bookingId, type) {
  // type = 'short-term' | 'mtm' | 'long-term'
  document.getElementById('msgModalTitle').textContent = 'Message ' + (name || 'Guest');
  document.getElementById('msgRecipientName').textContent = name || '';
  document.getElementById('msgRecipientContact').textContent = [email, phone].filter(Boolean).join(' · ');
  document.getElementById('msgRecipientId').value = bookingId || '';
  document.getElementById('msgRecipientType').value = type || '';
  document.getElementById('msgBody').value = '';

  // Build channel buttons using shared selector
  document.getElementById('msgChannelBtns').innerHTML = buildChannelSelector('app');
  document.getElementById('msgOverlay').style.display = 'flex';
}

function closeMsgModal() {
  document.getElementById('msgOverlay').style.display = 'none';
}

function selectMsgChannel(btn) {
  btn.parentElement.querySelectorAll('.msg-ch-btn').forEach(function(b) { b.classList.remove('active'); });
  btn.classList.add('active');
}

function sendMsgFromModal() {
  var ch = getSelectedChannel(document.getElementById('msgOverlay'));
  var body = document.getElementById('msgBody').value.trim();
  if (!body) { alert('Please type a message.'); return; }

  var name = document.getElementById('msgRecipientName').textContent;
  var contact = document.getElementById('msgRecipientContact').textContent;

  // Extract email/phone from contact string
  var parts = contact.split(' · ');
  var email = '', phone = '';
  parts.forEach(function(p) {
    p = p.trim();
    if (p.indexOf('@') > -1) email = p;
    else if (p.match(/\d/)) phone = p;
  });

  sendViaChannel(ch, name, email, phone, body, {subject: 'Message from Willow PA'});
  closeMsgModal();
}

// ═══════════════════════════════════════════════════
//  ST DASHBOARD DRILL-DOWN — click tenant to go to detail
// ═══════════════════════════════════════════════════
function drillDownToTenant(apt, name) {
  // Try to find in pipeline bookings first
  if (typeof window.pipelineState !== 'undefined' && window.pipelineState.bookings) {
    var booking = window.pipelineState.bookings.find(function(b) {
      return (b.unit_apt === apt || b.unit_name === apt) && b.guest_name === name;
    });
    if (booking) {
      // Switch to pipeline and open detail
      switchModule('short-term');
      setTimeout(function() {
        var subTabs = document.querySelectorAll('#subNav .sub-tab');
        subTabs.forEach(function(t) {
          t.classList.remove('active');
          if (t.textContent.trim().indexOf('Pipeline') === 0) t.classList.add('active');
        });
        showSubPage('pipeline', null);
        setTimeout(function() {
          // Set selected booking in pipeline state and re-render
          if (typeof window.pipelineState !== 'undefined') {
            window.pipelineState.selectedBooking = booking;
            if (typeof window.renderPipeline === 'function') window.renderPipeline();
          }
        }, 300);
      }, 200);
      return;
    }
  }
  // Fallback: try unit drill-down
  var unit = data.find(function(u) { return u.apt === apt; });
  if (unit) {
    openDrillDown(unit, name);
  }
}

// ══════════════════════════════════════════════════════
//  CENTRALIZED MESSAGES — Dashboard Unified Inbox
//  Reads from: local data, pipelineState, FT_state,
//  AND Supabase channels/messages tables (shared with tenant portal)
// ══════════════════════════════════════════════════════
var _dashMsgFilter = 'all';
var _dashMsgShowAll = false;
var _sbChannelMessages = []; // cached Supabase channel messages

// Load Supabase channels for the unified inbox
function loadSbChannelMessages(){
  if(!SUPA_URL || !SUPA_KEY) return Promise.resolve([]);
  var url = SUPA_URL + '/rest/v1/channels?select=*&order=last_message_at.desc&limit=50';
  return fetch(url, {
    headers: { 'apikey': SUPA_KEY, 'Authorization': 'Bearer ' + SUPA_KEY }
  }).then(function(r){ return r.json(); }).then(function(channels){
    if(!Array.isArray(channels)) return [];
    _sbChannelMessages = channels.map(function(ch){
      return {
        id: 'sb-'+ch.id, name: ch.guest_name||'Tenant', apt: ch.unit_apt||'',
        source: (ch.platform==='willowpa'?'tenant-portal':ch.platform)||'tenant-portal',
        preview: ch.last_message_preview||'', time: ch.last_message_at||ch.created_at,
        phone: ch.guest_phone||'', email: ch.guest_email||'',
        bookingId: ch.booking_id||null, stage: '',
        channelId: ch.id, unread: ch.unread_count||0
      };
    });
    return _sbChannelMessages;
  }).catch(function(e){ console.warn('SB channels load failed:', e); return []; });
}

// Send admin reply to a Supabase channel
function sendAdminReply(channelId, text){
  if(!channelId || !text) return;
  var msgBody = { channel_id: channelId, sender: 'admin', sender_name: 'Willow Management', body: text, platform: 'willowpa', sent_at: new Date().toISOString() };
  fetch(SUPA_URL + '/rest/v1/messages', {
    method: 'POST',
    headers: { 'apikey': SUPA_KEY, 'Authorization': 'Bearer ' + SUPA_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify(msgBody)
  }).then(function(){
    // Update channel preview
    return fetch(SUPA_URL + '/rest/v1/channels?id=eq.' + channelId, {
      method: 'PATCH',
      headers: { 'apikey': SUPA_KEY, 'Authorization': 'Bearer ' + SUPA_KEY, 'Content-Type': 'application/json', 'Prefer': 'return=representation' },
      body: JSON.stringify({ last_message_preview: text.substring(0,100), last_message_at: new Date().toISOString(), unread_count: 0 })
    });
  }).then(function(){
    showToast('Reply sent');
    renderDashMessages(_dashMsgFilter);
  }).catch(function(e){ showToast('Send failed: '+e.message); });
}

// Open a Supabase channel thread in a detail panel
function openSbThread(channelId){
  if(!channelId) return;
  var url = SUPA_URL + '/rest/v1/messages?select=*&channel_id=eq.' + channelId + '&order=sent_at.asc';
  fetch(url, {
    headers: { 'apikey': SUPA_KEY, 'Authorization': 'Bearer ' + SUPA_KEY }
  }).then(function(r){ return r.json(); }).then(function(msgs){
    if(!Array.isArray(msgs)) msgs = [];
    var channel = _sbChannelMessages.find(function(m){ return m.channelId === channelId; });
    var name = channel ? channel.name : 'Tenant';
    var unit = channel ? channel.apt : '';

    var html = '<div class="dash-panel" style="max-width:520px;margin:0 auto;border-left:4px solid var(--accent)">';
    html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">';
    html += '<h3 style="margin:0;padding:0;border:none">💬 '+name+' — Unit '+unit+'</h3>';
    html += '<button class="btn btn-secondary btn-sm" onclick="document.getElementById(\'sbThreadPanel\').style.display=\'none\'">✕ Close</button>';
    html += '</div>';
    html += '<div style="max-height:400px;overflow-y:auto;margin-bottom:12px;display:flex;flex-direction:column;gap:6px;" id="sbThreadMsgs">';
    msgs.forEach(function(m){
      var isAdmin = m.sender==='admin';
      html += '<div style="max-width:80%;padding:8px 12px;border-radius:10px;font-size:12px;align-self:'+(isAdmin?'flex-end':'flex-start')+';background:'+(isAdmin?'var(--accent2);color:#fff':'var(--surface2);color:var(--text)')+'">';
      html += '<div style="font-size:10px;font-weight:600;margin-bottom:2px;opacity:.8">'+(m.sender_name||m.sender)+'</div>';
      html += m.body;
      html += '<div style="font-size:9px;opacity:.6;margin-top:3px">'+new Date(m.sent_at).toLocaleString('en-US',{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'})+'</div>';
      html += '</div>';
    });
    html += '</div>';
    html += '<div style="display:flex;gap:8px">';
    html += '<input id="sbReplyInput" style="flex:1;padding:8px 12px;border:1px solid var(--border);border-radius:8px;font-size:12px;font-family:inherit" placeholder="Reply as admin..." onkeydown="if(event.key===\'Enter\')sendAdminReply(\''+channelId+'\',this.value)">';
    html += '<button class="btn btn-sm" style="background:var(--accent2);color:#fff;border:none" onclick="sendAdminReply(\''+channelId+'\',document.getElementById(\'sbReplyInput\').value)">Send</button>';
    html += '</div></div>';

    var panel = document.getElementById('sbThreadPanel');
    if(!panel){
      panel = document.createElement('div');
      panel.id = 'sbThreadPanel';
      panel.style.cssText = 'position:fixed;top:0;right:0;bottom:0;width:500px;max-width:95vw;background:var(--bg);border-left:2px solid var(--border);z-index:600;padding:20px;overflow-y:auto;box-shadow:-4px 0 20px rgba(0,0,0,.1)';
      document.body.appendChild(panel);
    }
    panel.innerHTML = html;
    panel.style.display = 'block';
    var msgsDiv = document.getElementById('sbThreadMsgs');
    if(msgsDiv) msgsDiv.scrollTop = msgsDiv.scrollHeight;
  });
}

function buildDashMessages(){
  var msgs = [];
  var active = dedupActive();
  var bookings = (typeof window.pipelineState !== 'undefined' && window.pipelineState && window.pipelineState.bookings) ? window.pipelineState.bookings : [];
  var jobs = (typeof FT_state !== 'undefined' && FT_state && FT_state.jobs) ? FT_state.jobs : [];

  // Short-term bookings
  bookings.forEach(function(b){
    if(!b.guest_name && !b.name) return;
    var preview = '';
    if(b.stage==='inquiry') preview='New inquiry';
    else if(b.stage==='confirmed') preview='Booking confirmed';
    else if(b.stage==='checked_in'||b.stage==='in_stay') preview='Currently in-stay';
    else if(b.stage==='pre_arrival') preview='Pre-arrival prep';
    else preview = (b.stage||'booking')+' update';
    msgs.push({
      id:'bk-'+b.id, name:b.guest_name||b.name||'Guest', apt:b.unit_apt||b.unit_name||'',
      source:'short-stay', preview:preview, time:b.updated_at||b.created_at||b.check_in,
      phone:b.phone||'', email:b.email||'', bookingId:b.id, stage:b.stage||''
    });
  });

  // Long-term & MTM tenants
  active.forEach(function(r){
    if(r.type==='available'||!r.name||r.type==='short-stay') return;
    var lastNote = '';
    if(r.history && r.history.length) lastNote = r.history[r.history.length-1].text||'';
    var ctx = r.balance>0 ? 'Balance: $'+Number(r.balance).toLocaleString() : 'Active tenant';
    msgs.push({
      id:'lt-'+r.id, name:r.name, apt:r.apt, source:r.type,
      preview:lastNote||ctx, time:r.due||r.checkin||'',
      phone:parseNoteField(r.note,'Tel'), email:parseNoteField(r.note,'Email'),
      bookingId:null, stage:''
    });
  });

  // FieldTrack work orders
  jobs.forEach(function(j){
    if(!j.title && !j.description) return;
    var techName = '';
    if(j.techId && typeof FT_state !== 'undefined' && FT_state.technicians){
      var t = FT_state.technicians.find(function(x){ return x.id===+j.techId; });
      if(t) techName = t.name;
    }
    msgs.push({
      id:'ft-'+j.id, name:j.requestedBy||techName||'Tech Service', apt:j.unit||j.property||'',
      source:'fieldtrack', preview:(j.title||j.description||'Work order').substring(0,60),
      time:j.date||j.created||'', phone:'', email:'', bookingId:null,
      stage:(j.status||'open')+(j.priority==='urgent'?' · URGENT':'')
    });
  });

  // Add Supabase channel messages (from tenant portal)
  _sbChannelMessages.forEach(function(m){
    msgs.push({
      id: m.id, name: m.name, apt: m.apt,
      source: 'tenant-portal', preview: m.preview, time: m.time,
      phone: m.phone, email: m.email, bookingId: m.bookingId, stage: '',
      channelId: m.channelId, unread: m.unread
    });
  });

  // Sort by time descending
  msgs.sort(function(a,b){
    var ta = a.time ? new Date(a.time).getTime() : 0;
    var tb = b.time ? new Date(b.time).getTime() : 0;
    return tb - ta;
  });
  return msgs;
}

function dashMsgSrcBadge(source){
  var map = {
    'short-stay':{label:'Short Term',cls:'dmsg-src-st'},
    'long-term':{label:'Long Term',cls:'dmsg-src-lt'},
    'month-to-month':{label:'MTM',cls:'dmsg-src-mtm'},
    'fieldtrack':{label:'Tech',cls:'dmsg-src-ft'},
    'parking':{label:'Parking',cls:'dmsg-src-pk'},
    'delivery':{label:'Mailroom',cls:'dmsg-src-dl'},
    'tenant-portal':{label:'Portal',cls:'dmsg-src-tp'}
  };
  var m = map[source]||{label:source||'Other',cls:'dmsg-src-ot'};
  return '<span class="dmsg-src '+m.cls+'">'+m.label+'</span>';
}

function dashMsgTimeAgo(d){
  if(!d) return '';
  var diff = Date.now() - new Date(d).getTime();
  var m = Math.floor(diff/60000);
  if(m<1) return 'now';
  if(m<60) return m+'m';
  var h = Math.floor(m/60);
  if(h<24) return h+'h';
  var days = Math.floor(h/24);
  if(days<7) return days+'d';
  return new Date(d).toLocaleDateString('en-US',{month:'short',day:'numeric'});
}

function renderDashMessages(filter){
  _dashMsgFilter = filter || 'all';
  var el = document.getElementById('dashMsgList');
  if(!el) return;
  var msgs = buildDashMessages();
  var filtered = _dashMsgFilter==='all' ? msgs : msgs.filter(function(m){ return m.source===_dashMsgFilter; });
  var limit = _dashMsgShowAll ? filtered.length : 8;
  var shown = filtered.slice(0, limit);

  if(!shown.length){
    el.innerHTML = '<div class="dash-empty-state">No messages from this source</div>';
    return;
  }

  var html = '<div class="dmsg-grid">';
  shown.forEach(function(m){
    var initial = m.name ? m.name.charAt(0).toUpperCase() : '?';
    html += '<div class="dmsg-row" onclick="openDashMsgAction(\''+m.id+'\',\''+m.source+'\','+( m.bookingId?'\''+m.bookingId+'\'':'null')+')">';
    html += '<div class="dmsg-avatar">'+initial+'</div>';
    html += '<div class="dmsg-body">';
    html += '<div class="dmsg-top"><span class="dmsg-name">'+m.name+'</span><span class="dmsg-time">'+dashMsgTimeAgo(m.time)+'</span></div>';
    html += '<div class="dmsg-meta">'+m.apt+(m.stage?' · '+m.stage:'')+'</div>';
    html += '<div class="dmsg-preview">'+m.preview+'</div>';
    html += '</div>';
    html += '<div class="dmsg-src-wrap">'+dashMsgSrcBadge(m.source)+'</div>';
    html += '</div>';
  });
  html += '</div>';

  if(filtered.length > limit){
    html += '<div style="text-align:center;font-size:11px;color:var(--text3);margin-top:6px;">Showing '+limit+' of '+filtered.length+' messages</div>';
  }
  el.innerHTML = html;
}

function filterDashMessages(filter, btn){
  _dashMsgShowAll = false;
  document.querySelectorAll('.dash-msg-filter').forEach(function(b){ b.classList.remove('active'); });
  if(btn) btn.classList.add('active');
  renderDashMessages(filter);
}

function showAllDashMessages(){
  _dashMsgShowAll = true;
  renderDashMessages(_dashMsgFilter);
}

function openDashMsgAction(msgId, source, bookingId){
  // Supabase channel thread — open admin reply panel
  if(msgId.indexOf('sb-')===0){
    var chId = msgId.replace('sb-','');
    openSbThread(chId);
    return;
  }
  // If it's a booking, open pipeline detail
  if(bookingId && typeof window.pipelineState !== 'undefined'){
    var b = window.pipelineState.bookings.find(function(x){ return x.id == bookingId; });
    if(b){
      switchModule('short-term');
      setTimeout(function(){
        var subPipe = document.querySelector('.sub-tab[data-subtab="pipeline"]');
        if(subPipe) subPipe.click();
        setTimeout(function(){
          window.pipelineState.selectedBooking = b;
          if(typeof window.renderPipeline === 'function') window.renderPipeline();
        }, 200);
      }, 200);
      return;
    }
  }
  // Long-term: open tenant card
  if(msgId.indexOf('lt-')===0){
    var rid = parseInt(msgId.replace('lt-',''));
    var idx = (window.data||[]).findIndex(function(r){ return r.id===rid; });
    if(idx >= 0){
      var r = data[idx];
      if(r.type==='long-term'||r.type==='month-to-month'){
        switchModule('mtm-lt');
        setTimeout(function(){
          var tIdx = INNAGO_TENANTS.findIndex(function(t){ return t.name.includes(r.name.split(' ')[0]); });
          if(tIdx >= 0) openTenantCardFromLease(tIdx);
        }, 300);
        return;
      }
      // Short-stay: go to calendar detail
      openDetail(r.id);
    }
    return;
  }
  // FieldTrack: switch to techtrack
  if(msgId.indexOf('ft-')===0){
    switchModule('techtrack');
    return;
  }
}

