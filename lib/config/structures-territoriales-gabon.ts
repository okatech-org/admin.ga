/**
 * Structures Territoriales de la République Gabonaise
 * 9 Provinces et 52 Départements
 */

export interface Province {
  id: string;
  code: string;
  nom: string;
  chef_lieu: string;
  superficie_km2: number;
  population_estimee: number;
  gouverneur?: string;
  prefet_coordonnateur?: string;
  departements: Departement[];
}

export interface Departement {
  id: string;
  code: string;
  nom: string;
  chef_lieu: string;
  superficie_km2: number;
  population_estimee: number;
  prefet?: string;
  province_id: string;
  communes?: string[];
}

// LES 9 PROVINCES DU GABON
export const PROVINCES_GABON: Province[] = [
  {
    id: "PROV_ESTUAIRE",
    code: "EST",
    nom: "Estuaire",
    chef_lieu: "Libreville",
    superficie_km2: 20740,
    population_estimee: 870000,
    gouverneur: "Jeanne-Françoise NDOUTOUME",
    departements: [
      {
        id: "DEPT_KOMO_MONDAH",
        code: "KM",
        nom: "Komo-Mondah",
        chef_lieu: "Ntoum",
        superficie_km2: 4307,
        population_estimee: 95000,
        prefet: "Marie-Claire OBAME",
        province_id: "PROV_ESTUAIRE",
        communes: ["Ntoum", "Kango"]
      },
      {
        id: "DEPT_KOMO_OCEAN",
        code: "KO",
        nom: "Komo-Océan",
        chef_lieu: "Cocobeach",
        superficie_km2: 7495,
        population_estimee: 18000,
        prefet: "Jean-Pierre MINKO",
        province_id: "PROV_ESTUAIRE",
        communes: ["Cocobeach"]
      },
      {
        id: "DEPT_NOYA",
        code: "NY",
        nom: "Noya",
        chef_lieu: "Akanda",
        superficie_km2: 538,
        population_estimee: 32000,
        prefet: "Paul ESSONO",
        province_id: "PROV_ESTUAIRE",
        communes: ["Akanda", "Owendo"]
      },
      {
        id: "DEPT_LIBREVILLE",
        code: "LBV",
        nom: "Libreville",
        chef_lieu: "Libreville",
        superficie_km2: 189,
        population_estimee: 725000,
        prefet: "Christine MBOUMBA",
        province_id: "PROV_ESTUAIRE",
        communes: ["Libreville"]
      }
    ]
  },

  {
    id: "PROV_HAUT_OGOOUE",
    code: "HO",
    nom: "Haut-Ogooué",
    chef_lieu: "Franceville",
    superficie_km2: 36547,
    population_estimee: 250000,
    gouverneur: "Arsène BONGOUANDE",
    departements: [
      {
        id: "DEPT_DJOUORI_AGUILLI",
        code: "DA",
        nom: "Djouori-Aguilli",
        chef_lieu: "Onga",
        superficie_km2: 3940,
        population_estimee: 8000,
        prefet: "Michel NGOUA",
        province_id: "PROV_HAUT_OGOOUE",
        communes: ["Onga"]
      },
      {
        id: "DEPT_LEKOKO_DEMBO",
        code: "LD",
        nom: "Lékoko-Dembo",
        chef_lieu: "Bakoumba",
        superficie_km2: 4995,
        population_estimee: 15000,
        prefet: "Pierre OBIANG",
        province_id: "PROV_HAUT_OGOOUE",
        communes: ["Bakoumba", "Lékoko"]
      },
      {
        id: "DEPT_LEMBOUMBI_LEYOU",
        code: "LL",
        nom: "Lemboumbi-Leyou",
        chef_lieu: "Moanda",
        superficie_km2: 7940,
        population_estimee: 75000,
        prefet: "André MENGUE",
        province_id: "PROV_HAUT_OGOOUE",
        communes: ["Moanda", "Bongoville"]
      },
      {
        id: "DEPT_MPASSA",
        code: "MP",
        nom: "Mpassa",
        chef_lieu: "Franceville",
        superficie_km2: 19672,
        population_estimee: 152000,
        prefet: "Marie NDONG",
        province_id: "PROV_HAUT_OGOOUE",
        communes: ["Franceville", "Okondja"]
      }
    ]
  },

  {
    id: "PROV_MOYEN_OGOOUE",
    code: "MO",
    nom: "Moyen-Ogooué",
    chef_lieu: "Lambaréné",
    superficie_km2: 18535,
    population_estimee: 70000,
    gouverneur: "Calixte NTOUTOUME",
    departements: [
      {
        id: "DEPT_ABANGA_BIGNE",
        code: "AB",
        nom: "Abanga-Bigné",
        chef_lieu: "Ndjolé",
        superficie_km2: 11526,
        population_estimee: 15000,
        prefet: "Jean MOUELE",
        province_id: "PROV_MOYEN_OGOOUE",
        communes: ["Ndjolé"]
      },
      {
        id: "DEPT_OGOOUE_LACS",
        code: "OL",
        nom: "Ogooué-et-des-Lacs",
        chef_lieu: "Lambaréné",
        superficie_km2: 7009,
        population_estimee: 55000,
        prefet: "Claire BIYOGHE",
        province_id: "PROV_MOYEN_OGOOUE",
        communes: ["Lambaréné", "Fougamou"]
      }
    ]
  },

  {
    id: "PROV_NGOUNIE",
    code: "NG",
    nom: "Ngounié",
    chef_lieu: "Mouila",
    superficie_km2: 37750,
    population_estimee: 100000,
    gouverneur: "Roger MBA",
    departements: [
      {
        id: "DEPT_BOUMI_LOUETSI",
        code: "BL",
        nom: "Boumi-Louetsi",
        chef_lieu: "Mbigou",
        superficie_km2: 9510,
        population_estimee: 18000,
        prefet: "Alain KOUMBA",
        province_id: "PROV_NGOUNIE",
        communes: ["Mbigou"]
      },
      {
        id: "DEPT_DOUYA_ONOYE",
        code: "DO",
        nom: "Douya-Onoye",
        chef_lieu: "Sindara",
        superficie_km2: 9940,
        population_estimee: 12000,
        prefet: "Marie MOUISSI",
        province_id: "PROV_NGOUNIE",
        communes: ["Sindara"]
      },
      {
        id: "DEPT_DOLA",
        code: "DL",
        nom: "Dola",
        chef_lieu: "Yeno",
        superficie_km2: 6980,
        population_estimee: 8000,
        prefet: "Paul NZIENGUI",
        province_id: "PROV_NGOUNIE",
        communes: ["Yeno"]
      },
      {
        id: "DEPT_LOUETSI_WANO",
        code: "LW",
        nom: "Louetsi-Wano",
        chef_lieu: "Lébamba",
        superficie_km2: 8790,
        population_estimee: 22000,
        prefet: "Sophie ELLA",
        province_id: "PROV_NGOUNIE",
        communes: ["Lébamba", "Koulamoutou"]
      },
      {
        id: "DEPT_TSAMBA_MAGOTSI",
        code: "TM",
        nom: "Tsamba-Magotsi",
        chef_lieu: "Fougamou",
        superficie_km2: 2530,
        population_estimee: 10000,
        prefet: "Bernard ABESSOLO",
        province_id: "PROV_NGOUNIE",
        communes: ["Fougamou"]
      },
      {
        id: "DEPT_LOUETSI_BIBAKA",
        code: "LB",
        nom: "Louetsi-Bibaka",
        chef_lieu: "Mouila",
        superficie_km2: 4000,
        population_estimee: 30000,
        prefet: "Jeanne MOUNDOUNGA",
        province_id: "PROV_NGOUNIE",
        communes: ["Mouila", "Yombi"]
      }
    ]
  },

  {
    id: "PROV_NYANGA",
    code: "NY",
    nom: "Nyanga",
    chef_lieu: "Tchibanga",
    superficie_km2: 21285,
    population_estimee: 52000,
    gouverneur: "Yolande BIRINDA",
    departements: [
      {
        id: "DEPT_BASSE_BANIO",
        code: "BB",
        nom: "Basse-Banio",
        chef_lieu: "Gamba",
        superficie_km2: 7150,
        population_estimee: 15000,
        prefet: "Michel OYONO",
        province_id: "PROV_NYANGA",
        communes: ["Gamba", "Mayumba"]
      },
      {
        id: "DEPT_DOUIGNY",
        code: "DG",
        nom: "Douigny",
        chef_lieu: "Doussala",
        superficie_km2: 5950,
        population_estimee: 8000,
        prefet: "Claude BEKALE",
        province_id: "PROV_NYANGA",
        communes: ["Doussala"]
      },
      {
        id: "DEPT_MONGO",
        code: "MG",
        nom: "Mongo",
        chef_lieu: "Ndendé",
        superficie_km2: 6665,
        population_estimee: 22000,
        prefet: "Anne NKOGHE",
        province_id: "PROV_NYANGA",
        communes: ["Ndendé", "Moabi"]
      },
      {
        id: "DEPT_MOUGOUTSI",
        code: "MT",
        nom: "Mougoutsi",
        chef_lieu: "Tchibanga",
        superficie_km2: 1520,
        population_estimee: 7000,
        prefet: "François NTOUTOUME",
        province_id: "PROV_NYANGA",
        communes: ["Tchibanga"]
      }
    ]
  },

  {
    id: "PROV_OGOOUE_IVINDO",
    code: "OI",
    nom: "Ogooué-Ivindo",
    chef_lieu: "Makokou",
    superficie_km2: 46075,
    population_estimee: 64000,
    gouverneur: "Alphonse ENGONGA",
    departements: [
      {
        id: "DEPT_IVINDO",
        code: "IV",
        nom: "Ivindo",
        chef_lieu: "Makokou",
        superficie_km2: 21329,
        population_estimee: 35000,
        prefet: "Marie ESSONO",
        province_id: "PROV_OGOOUE_IVINDO",
        communes: ["Makokou", "Ovan"]
      },
      {
        id: "DEPT_LOPE",
        code: "LP",
        nom: "Lopé",
        chef_lieu: "Booué",
        superficie_km2: 10956,
        population_estimee: 15000,
        prefet: "Jean BOUSSOUGOU",
        province_id: "PROV_OGOOUE_IVINDO",
        communes: ["Booué", "Lopé"]
      },
      {
        id: "DEPT_MVOUNG",
        code: "MV",
        nom: "Mvoung",
        chef_lieu: "Minvoul",
        superficie_km2: 10690,
        population_estimee: 12000,
        prefet: "Pierre MAPANGOU",
        province_id: "PROV_OGOOUE_IVINDO",
        communes: ["Minvoul"]
      },
      {
        id: "DEPT_ZADIÉ",
        code: "ZD",
        nom: "Zadié",
        chef_lieu: "Mékambo",
        superficie_km2: 3100,
        population_estimee: 2000,
        prefet: "André MINTSA",
        province_id: "PROV_OGOOUE_IVINDO",
        communes: ["Mékambo"]
      }
    ]
  },

  {
    id: "PROV_OGOOUE_LOLO",
    code: "OL",
    nom: "Ogooué-Lolo",
    chef_lieu: "Koulamoutou",
    superficie_km2: 25380,
    population_estimee: 65000,
    gouverneur: "Prosper NZIENGUI",
    departements: [
      {
        id: "DEPT_LOLO_BOUENGUIDI",
        code: "LBG",
        nom: "Lolo-Bouenguidi",
        chef_lieu: "Pana",
        superficie_km2: 11500,
        population_estimee: 8000,
        prefet: "Catherine MOUSSAVOU",
        province_id: "PROV_OGOOUE_LOLO",
        communes: ["Pana"]
      },
      {
        id: "DEPT_LOMBO_BOUENGUIDI",
        code: "LMBG",
        nom: "Lombo-Bouenguidi",
        chef_lieu: "Lastoursville",
        superficie_km2: 7880,
        population_estimee: 12000,
        prefet: "Marc NGUEMA",
        province_id: "PROV_OGOOUE_LOLO",
        communes: ["Lastoursville"]
      },
      {
        id: "DEPT_OFFOUE_ONOYE",
        code: "OO",
        nom: "Offoué-Onoye",
        chef_lieu: "Iboundji",
        superficie_km2: 6000,
        population_estimee: 7000,
        prefet: "Rose OBAME",
        province_id: "PROV_OGOOUE_LOLO",
        communes: ["Iboundji", "Mulundu"]
      }
    ]
  },

  {
    id: "PROV_OGOOUE_MARITIME",
    code: "OM",
    nom: "Ogooué-Maritime",
    chef_lieu: "Port-Gentil",
    superficie_km2: 22890,
    population_estimee: 157000,
    gouverneur: "Patrick OYABI",
    departements: [
      {
        id: "DEPT_BENDJE",
        code: "BD",
        nom: "Bendjé",
        chef_lieu: "Port-Gentil",
        superficie_km2: 940,
        population_estimee: 125000,
        prefet: "Juliette MADOUNGOU",
        province_id: "PROV_OGOOUE_MARITIME",
        communes: ["Port-Gentil"]
      },
      {
        id: "DEPT_ETIMBOUE",
        code: "ET",
        nom: "Etimboué",
        chef_lieu: "Omboué",
        superficie_km2: 6510,
        population_estimee: 12000,
        prefet: "Vincent NZUE",
        province_id: "PROV_OGOOUE_MARITIME",
        communes: ["Omboué", "Iguela"]
      },
      {
        id: "DEPT_KOMO_KANGO",
        code: "KK",
        nom: "Komo-Kango",
        chef_lieu: "Kango",
        superficie_km2: 2950,
        population_estimee: 8000,
        prefet: "Daniel BIYOGHE",
        province_id: "PROV_OGOOUE_MARITIME",
        communes: ["Kango"]
      },
      {
        id: "DEPT_NDOUGOU",
        code: "ND",
        nom: "Ndougou",
        chef_lieu: "Gamba",
        superficie_km2: 7490,
        population_estimee: 7000,
        prefet: "Marie BOUKOUMOU",
        province_id: "PROV_OGOOUE_MARITIME",
        communes: ["Gamba"]
      },
      {
        id: "DEPT_OGOOUE_DELTA",
        code: "OD",
        nom: "Ogooué-Delta",
        chef_lieu: "Lambaréné",
        superficie_km2: 5000,
        population_estimee: 5000,
        prefet: "Philippe MOUBAMBA",
        province_id: "PROV_OGOOUE_MARITIME",
        communes: ["Lambaréné"]
      }
    ]
  },

  {
    id: "PROV_WOLEU_NTEM",
    code: "WN",
    nom: "Woleu-Ntem",
    chef_lieu: "Oyem",
    superficie_km2: 38465,
    population_estimee: 154000,
    gouverneur: "Germain NKOGHE",
    departements: [
      {
        id: "DEPT_HAUT_COMO",
        code: "HC",
        nom: "Haut-Como",
        chef_lieu: "Médouneu",
        superficie_km2: 5405,
        population_estimee: 8000,
        prefet: "Sylvie ENGONGA",
        province_id: "PROV_WOLEU_NTEM",
        communes: ["Médouneu"]
      },
      {
        id: "DEPT_HAUT_NTEM",
        code: "HN",
        nom: "Haut-Ntem",
        chef_lieu: "Minvoul",
        superficie_km2: 9950,
        population_estimee: 18000,
        prefet: "Gaston MBADINGA",
        province_id: "PROV_WOLEU_NTEM",
        communes: ["Minvoul", "Sam"]
      },
      {
        id: "DEPT_OKANO",
        code: "OK",
        nom: "Okano",
        chef_lieu: "Mitzic",
        superficie_km2: 4970,
        population_estimee: 15000,
        prefet: "Monique ONDO",
        province_id: "PROV_WOLEU_NTEM",
        communes: ["Mitzic"]
      },
      {
        id: "DEPT_WOLEU",
        code: "WL",
        nom: "Woleu",
        chef_lieu: "Oyem",
        superficie_km2: 18140,
        population_estimee: 113000,
        prefet: "Ernest NGOUA",
        province_id: "PROV_WOLEU_NTEM",
        communes: ["Oyem", "Bitam", "Ebolowa"]
      }
    ]
  }
];

// Obtenir une province par son code
export function getProvinceByCode(code: string): Province | undefined {
  return PROVINCES_GABON.find(p => p.code === code);
}

// Obtenir tous les départements d'une province
export function getDepartementsByProvince(provinceId: string): Departement[] {
  const province = PROVINCES_GABON.find(p => p.id === provinceId);
  return province?.departements || [];
}

// Obtenir un département par son code
export function getDepartementByCode(code: string): Departement | undefined {
  for (const province of PROVINCES_GABON) {
    const dept = province.departements.find(d => d.code === code);
    if (dept) return dept;
  }
  return undefined;
}

// Statistiques territoriales
export const STATS_TERRITORIALES = {
  total_provinces: PROVINCES_GABON.length,
  total_departements: PROVINCES_GABON.reduce((acc, p) => acc + p.departements.length, 0),
  superficie_totale_km2: PROVINCES_GABON.reduce((acc, p) => acc + p.superficie_km2, 0),
  population_totale_estimee: PROVINCES_GABON.reduce((acc, p) => acc + p.population_estimee, 0),
  densite_moyenne: 0 // Calculé dynamiquement
};

STATS_TERRITORIALES.densite_moyenne = Math.round(
  STATS_TERRITORIALES.population_totale_estimee / STATS_TERRITORIALES.superficie_totale_km2 * 100
) / 100;
