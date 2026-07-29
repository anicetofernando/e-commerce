import "dotenv/config";
import pg from "pg";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  PrismaClient,
  EquipmentType,
  Province,
  ProductCondition,
} from "../src/generated/prisma/client";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  max: Number(process.env.PG_POOL_MAX) || 5,
});
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

type CategorySeed = {
  key: string;
  name: string;
  description: string;
};

const CATEGORIES: CategorySeed[] = [
  { key: "motor", name: "Motor", description: "Peças de motor: juntas, pistões, bombas de água e componentes internos." },
  { key: "hidraulica", name: "Sistema Hidráulico", description: "Bombas, cilindros, válvulas e mangueiras hidráulicas de alta pressão." },
  { key: "transmissao", name: "Transmissão", description: "Caixas de velocidades, discos de embraiagem e componentes de transmissão." },
  { key: "eletrica", name: "Sistema Elétrico", description: "Baterias, alternadores, motores de arranque e componentes elétricos." },
  { key: "filtros", name: "Filtros", description: "Filtros de óleo, ar, combustível e hidráulicos para todas as marcas." },
  { key: "travoes", name: "Travões", description: "Discos, pastilhas, cilindros e kits de travagem." },
  { key: "arrefecimento", name: "Arrefecimento", description: "Radiadores, ventoinhas, termostatos e líquidos de arrefecimento." },
  { key: "rodagem", name: "Rodagem e Trem de Rolamento", description: "Correntes, roletes, rodas motrizes e componentes de rasto." },
  { key: "pneus", name: "Pneus e Rodas", description: "Pneus, câmaras de ar e jantes para equipamento pesado." },
  { key: "ferramentas", name: "Ferramentas e Acessórios", description: "Ferramentas manuais, pneumáticas e acessórios de oficina." },
  { key: "lubrificantes", name: "Lubrificantes e Fluidos", description: "Óleos, massas consistentes e fluidos para manutenção." },
  { key: "carroceria", name: "Carroçaria e Cabine", description: "Vidros, espelhos, assentos e componentes de cabine." },
];

type MachineSeed = {
  brand: string;
  origin: string;
  models: { name: string; type: EquipmentType; yearFrom: number; yearTo?: number }[];
};

const BRANDS: MachineSeed[] = [
  {
    brand: "Caterpillar",
    origin: "EUA",
    models: [
      { name: "320D", type: "ESCAVADORA", yearFrom: 2005, yearTo: 2015 },
      { name: "966H", type: "PA_CARREGADORA", yearFrom: 2004, yearTo: 2013 },
      { name: "D6T", type: "BULLDOZER", yearFrom: 2005, yearTo: 2018 },
      { name: "420F", type: "RETROESCAVADORA", yearFrom: 2013, yearTo: 2020 },
    ],
  },
  {
    brand: "Komatsu",
    origin: "Japão",
    models: [
      { name: "PC200-8", type: "ESCAVADORA", yearFrom: 2006, yearTo: 2015 },
      { name: "WA320", type: "PA_CARREGADORA", yearFrom: 2003, yearTo: 2016 },
      { name: "D65EX", type: "BULLDOZER", yearFrom: 2000, yearTo: 2014 },
    ],
  },
  {
    brand: "Volvo CE",
    origin: "Suécia",
    models: [
      { name: "EC210B", type: "ESCAVADORA", yearFrom: 2004, yearTo: 2012 },
      { name: "L120F", type: "PA_CARREGADORA", yearFrom: 2006, yearTo: 2016 },
      { name: "G946", type: "MOTONIVELADORA", yearFrom: 2008, yearTo: 2019 },
    ],
  },
  {
    brand: "JCB",
    origin: "Reino Unido",
    models: [
      { name: "3CX", type: "RETROESCAVADORA", yearFrom: 2000, yearTo: 2023 },
      { name: "4CX", type: "RETROESCAVADORA", yearFrom: 2005, yearTo: 2022 },
      { name: "220X", type: "ESCAVADORA", yearFrom: 2015, yearTo: 2023 },
    ],
  },
  {
    brand: "Case CE",
    origin: "EUA",
    models: [
      { name: "580N", type: "RETROESCAVADORA", yearFrom: 2010, yearTo: 2021 },
      { name: "621F", type: "PA_CARREGADORA", yearFrom: 2012, yearTo: 2022 },
    ],
  },
  {
    brand: "New Holland CE",
    origin: "Itália",
    models: [
      { name: "B95C", type: "RETROESCAVADORA", yearFrom: 2010, yearTo: 2020 },
      { name: "E215B", type: "ESCAVADORA", yearFrom: 2008, yearTo: 2017 },
    ],
  },
  {
    brand: "Bobcat",
    origin: "EUA",
    models: [
      { name: "S650", type: "PA_CARREGADORA", yearFrom: 2012, yearTo: 2023 },
      { name: "E50", type: "ESCAVADORA", yearFrom: 2014, yearTo: 2023 },
    ],
  },
  {
    brand: "Hyundai CE",
    origin: "Coreia do Sul",
    models: [
      { name: "R210LC-7", type: "ESCAVADORA", yearFrom: 2005, yearTo: 2014 },
      { name: "HL760-7", type: "PA_CARREGADORA", yearFrom: 2007, yearTo: 2016 },
    ],
  },
  {
    brand: "Doosan",
    origin: "Coreia do Sul",
    models: [{ name: "DX225LC", type: "ESCAVADORA", yearFrom: 2009, yearTo: 2019 }],
  },
  {
    brand: "Hitachi",
    origin: "Japão",
    models: [{ name: "ZX200-3", type: "ESCAVADORA", yearFrom: 2005, yearTo: 2015 }],
  },
  {
    brand: "Liebherr",
    origin: "Alemanha",
    models: [{ name: "L538", type: "PA_CARREGADORA", yearFrom: 2010, yearTo: 2020 }],
  },
  {
    brand: "John Deere",
    origin: "EUA",
    models: [{ name: "310L", type: "RETROESCAVADORA", yearFrom: 2008, yearTo: 2018 }],
  },
];

type ProductSeed = {
  category: string;
  name: string;
  sku: string;
  shortDescription: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  condition?: ProductCondition;
  oemNumber: string;
  crossRefs: string[];
  stock: number;
  weightKg: number;
  warrantyMonths: number;
  featured?: boolean;
  specs: [string, string][];
  compatibleBrands?: string[];
};

const PRODUCTS: ProductSeed[] = [
  // Motor
  {
    category: "motor",
    name: "Kit de Juntas do Motor Completo",
    sku: "ALB-MT-1001",
    shortDescription: "Kit completo de juntas para revisão geral do motor.",
    description:
      "Kit completo de juntas para revisão geral do motor, incluindo junta da cabeça, cárter e coletores. Fabricado com materiais resistentes a altas temperaturas e pressões, garantindo vedação perfeita e longa durabilidade.",
    price: 8500,
    oemNumber: "CAT-1234567",
    crossRefs: ["KOM-9988776", "AFT-GK-3301"],
    stock: 24,
    weightKg: 3.2,
    warrantyMonths: 6,
    featured: true,
    specs: [
      ["Material", "Grafite reforçado com aço"],
      ["Nº de Peças", "18"],
      ["Temperatura Máx.", "260°C"],
    ],
    compatibleBrands: ["Caterpillar", "Komatsu"],
  },
  {
    category: "motor",
    name: "Bomba de Água do Motor",
    sku: "ALB-MT-1002",
    shortDescription: "Bomba de água de substituição para sistema de arrefecimento do motor.",
    description:
      "Bomba de água robusta para circulação do líquido de arrefecimento, com corpo em ferro fundido e vedante cerâmico de alta durabilidade. Testada e aprovada para uso intensivo.",
    price: 6200,
    oemNumber: "CAT-2233445",
    crossRefs: ["KOM-4455667"],
    stock: 15,
    weightKg: 4.1,
    warrantyMonths: 6,
    specs: [
      ["Material do Corpo", "Ferro fundido"],
      ["Tipo de Vedante", "Cerâmico"],
      ["Caudal", "180 L/min"],
    ],
    compatibleBrands: ["Caterpillar"],
  },
  {
    category: "motor",
    name: "Kit de Pistões e Camisas",
    sku: "ALB-MT-1003",
    shortDescription: "Conjunto de pistões, aros e camisas para retificação de motor.",
    description:
      "Conjunto completo de pistões forjados, aros de compressão e camisas cilíndricas de alta precisão, indicado para retificação completa do motor.",
    price: 34500,
    compareAtPrice: 39900,
    oemNumber: "KOM-5566778",
    crossRefs: ["CAT-6677889"],
    stock: 8,
    weightKg: 12.4,
    warrantyMonths: 12,
    featured: true,
    specs: [
      ["Nº de Cilindros", "6"],
      ["Material", "Aço forjado"],
      ["Diâmetro", "108 mm"],
    ],
    compatibleBrands: ["Komatsu"],
  },
  {
    category: "motor",
    name: "Turbocompressor Sobrealimentador",
    sku: "ALB-MT-1004",
    shortDescription: "Turbocompressor para motores diesel de equipamento pesado.",
    description:
      "Turbocompressor de alta performance, reconstruído segundo especificações originais, com balanceamento dinâmico e teste de estanqueidade a 100%.",
    price: 52000,
    condition: "RECONDICIONADO",
    oemNumber: "CAT-7788990",
    crossRefs: ["HOL-3344556"],
    stock: 5,
    weightKg: 9.8,
    warrantyMonths: 6,
    specs: [
      ["Pressão Máx.", "2.4 bar"],
      ["Condição", "Recondicionado e testado"],
      ["Rotação Máx.", "120 000 rpm"],
    ],
    compatibleBrands: ["Caterpillar", "New Holland CE"],
  },

  // Hidráulica
  {
    category: "hidraulica",
    name: "Bomba Hidráulica Principal de Engrenagens",
    sku: "ALB-HD-2001",
    shortDescription: "Bomba hidráulica de engrenagens de alta pressão.",
    description:
      "Bomba hidráulica principal de engrenagens, concebida para sistemas de alta pressão em escavadoras e pás carregadoras. Corpo em alumínio de alta resistência.",
    price: 68000,
    oemNumber: "CAT-3322110",
    crossRefs: ["KOM-1122334"],
    stock: 6,
    weightKg: 18.5,
    warrantyMonths: 12,
    featured: true,
    specs: [
      ["Pressão Máxima", "320 bar"],
      ["Caudal Nominal", "120 L/min"],
      ["Material", "Alumínio de alta resistência"],
    ],
    compatibleBrands: ["Caterpillar", "Komatsu"],
  },
  {
    category: "hidraulica",
    name: "Cilindro Hidráulico de Elevação da Lança",
    sku: "ALB-HD-2002",
    shortDescription: "Cilindro hidráulico para elevação de lança de escavadora.",
    description:
      "Cilindro hidráulico de dupla ação para elevação de lança, com haste cromada e vedantes de poliuretano de alta durabilidade, resistente a condições extremas.",
    price: 95000,
    oemNumber: "VOL-4433221",
    crossRefs: ["CAT-5544332"],
    stock: 4,
    weightKg: 42,
    warrantyMonths: 12,
    specs: [
      ["Curso", "1150 mm"],
      ["Diâmetro da Haste", "90 mm"],
      ["Pressão de Teste", "350 bar"],
    ],
    compatibleBrands: ["Volvo CE", "Caterpillar"],
  },
  {
    category: "hidraulica",
    name: "Válvula de Controlo Hidráulico Principal",
    sku: "ALB-HD-2003",
    shortDescription: "Válvula distribuidora multi-secção para controlo hidráulico.",
    description:
      "Válvula de controlo hidráulico multi-secção, permite comando independente de múltiplos atuadores com precisão e resposta rápida.",
    price: 78500,
    oemNumber: "KOM-6655443",
    crossRefs: ["CAT-7766554"],
    stock: 3,
    weightKg: 22,
    warrantyMonths: 6,
    specs: [
      ["Nº de Secções", "6"],
      ["Pressão Máxima", "310 bar"],
      ["Tipo de Comando", "Piloto hidráulico"],
    ],
    compatibleBrands: ["Komatsu"],
  },
  {
    category: "hidraulica",
    name: "Mangueira Hidráulica de Alta Pressão 3/4\"",
    sku: "ALB-HD-2004",
    shortDescription: "Mangueira hidráulica reforçada com trança de aço, 3/4 polegada.",
    description:
      "Mangueira hidráulica de alta pressão com dupla trança de aço, terminais prensados incluídos. Ideal para substituição em sistemas de escavadoras e retroescavadoras.",
    price: 3200,
    oemNumber: "GEN-8877665",
    crossRefs: ["PAR-2200110"],
    stock: 60,
    weightKg: 1.6,
    warrantyMonths: 3,
    specs: [
      ["Diâmetro Interno", "19 mm (3/4\")"],
      ["Pressão de Rutura", "1000 bar"],
      ["Comprimento", "1.5 m"],
    ],
  },
  {
    category: "hidraulica",
    name: "Filtro Hidráulico de Retorno",
    sku: "ALB-HD-2005",
    shortDescription: "Elemento filtrante para linha de retorno do óleo hidráulico.",
    description:
      "Filtro hidráulico de retorno de alta eficiência, remove contaminantes finos e prolonga a vida útil da bomba e válvulas do sistema hidráulico.",
    price: 1850,
    oemNumber: "CAT-9988001",
    crossRefs: ["KOM-3300112"],
    stock: 40,
    weightKg: 0.9,
    warrantyMonths: 3,
    specs: [
      ["Micragem", "10 microns"],
      ["Tipo", "Retorno"],
      ["Eficiência", "Beta 200"],
    ],
  },

  // Transmissão
  {
    category: "transmissao",
    name: "Kit de Reparação de Caixa de Velocidades",
    sku: "ALB-TR-3001",
    shortDescription: "Kit de rolamentos, vedantes e sincronizadores para caixa de velocidades.",
    description:
      "Kit completo para reparação de caixa de velocidades, incluindo rolamentos, vedantes, anéis sincronizadores e juntas. Compatível com várias transmissões de equipamento pesado.",
    price: 28000,
    oemNumber: "CAT-1100223",
    crossRefs: ["ZF-4400556"],
    stock: 7,
    weightKg: 6.5,
    warrantyMonths: 12,
    featured: true,
    specs: [
      ["Nº de Peças", "32"],
      ["Compatibilidade", "Transmissões powershift"],
    ],
    compatibleBrands: ["Caterpillar"],
  },
  {
    category: "transmissao",
    name: "Disco de Embraiagem Reforçado",
    sku: "ALB-TR-3002",
    shortDescription: "Disco de embraiagem de alta resistência para transmissão pesada.",
    description:
      "Disco de embraiagem com material de fricção cerâmico-metálico, oferece maior resistência ao desgaste e capacidade de torque superior.",
    price: 14500,
    oemNumber: "KOM-2211334",
    crossRefs: ["CAT-3322556"],
    stock: 12,
    weightKg: 5.2,
    warrantyMonths: 6,
    specs: [
      ["Material de Fricção", "Cerâmico-metálico"],
      ["Diâmetro", "330 mm"],
    ],
    compatibleBrands: ["Komatsu"],
  },
  {
    category: "transmissao",
    name: "Eixo de Transmissão Cardan",
    sku: "ALB-TR-3003",
    shortDescription: "Eixo cardan de transmissão para tração integral.",
    description:
      "Eixo de transmissão cardan balanceado, com juntas universais de alta resistência para transmissão de potência em sistemas de tração integral.",
    price: 22000,
    oemNumber: "JCB-4433667",
    crossRefs: ["GEN-5544778"],
    stock: 9,
    weightKg: 14,
    warrantyMonths: 6,
    specs: [
      ["Comprimento", "980 mm"],
      ["Nº de Juntas Universais", "2"],
    ],
    compatibleBrands: ["JCB"],
  },

  // Elétrica
  {
    category: "eletrica",
    name: "Bateria 12V 200Ah Alta Descarga",
    sku: "ALB-EL-4001",
    shortDescription: "Bateria de arranque de 200Ah para equipamento pesado.",
    description:
      "Bateria de chumbo-ácido de alta capacidade, concebida para arranque em condições extremas de trabalho e temperatura, com terminais reforçados.",
    price: 12500,
    oemNumber: "GEN-6677889",
    crossRefs: ["BOS-1122445"],
    stock: 30,
    weightKg: 54,
    warrantyMonths: 12,
    featured: true,
    specs: [
      ["Capacidade", "200 Ah"],
      ["Tensão", "12V"],
      ["Corrente de Arranque a Frio", "1100 A"],
    ],
  },
  {
    category: "eletrica",
    name: "Alternador 24V 90A",
    sku: "ALB-EL-4002",
    shortDescription: "Alternador de 24V e 90A para sistemas elétricos de equipamento pesado.",
    description:
      "Alternador robusto de 24V/90A, com rolamentos selados e regulador de tensão integrado. Testado a 100% antes do envio.",
    price: 9800,
    oemNumber: "CAT-7788112",
    crossRefs: ["BOS-2233556"],
    stock: 18,
    weightKg: 6.8,
    warrantyMonths: 6,
    specs: [
      ["Tensão", "24V"],
      ["Corrente Máxima", "90A"],
      ["Tipo de Regulador", "Integrado"],
    ],
    compatibleBrands: ["Caterpillar"],
  },
  {
    category: "eletrica",
    name: "Motor de Arranque 24V",
    sku: "ALB-EL-4003",
    shortDescription: "Motor de arranque reforçado de 24V para motores diesel.",
    description:
      "Motor de arranque de alta performance para motores diesel de grande cilindrada, com bendix reforçado e maior torque de arranque a frio.",
    price: 11200,
    oemNumber: "KOM-8899223",
    crossRefs: ["DEN-3344667"],
    stock: 14,
    weightKg: 8.9,
    warrantyMonths: 6,
    specs: [
      ["Tensão", "24V"],
      ["Potência", "5.5 kW"],
    ],
    compatibleBrands: ["Komatsu"],
  },
  {
    category: "eletrica",
    name: "Chicote Elétrico Principal do Motor",
    sku: "ALB-EL-4004",
    shortDescription: "Chicote de cablagem principal para sistema elétrico do motor.",
    description:
      "Chicote elétrico completo para o compartimento do motor, com conectores originais e isolamento resistente a óleo e altas temperaturas.",
    price: 15800,
    oemNumber: "CAT-9900334",
    crossRefs: [],
    stock: 6,
    weightKg: 2.1,
    warrantyMonths: 3,
    specs: [
      ["Isolamento", "Resistente a óleo e calor"],
      ["Nº de Conectores", "24"],
    ],
    compatibleBrands: ["Caterpillar"],
  },
  {
    category: "eletrica",
    name: "Farol de Trabalho LED 6\" 60W",
    sku: "ALB-EL-4005",
    shortDescription: "Farol de trabalho LED de alta luminosidade para máquinas.",
    description:
      "Farol de trabalho LED de 60W, à prova de água e vibração, ideal para operações noturnas em obra. Feixe de luz combinado (flood/spot).",
    price: 2400,
    oemNumber: "GEN-1100556",
    crossRefs: [],
    stock: 45,
    weightKg: 0.6,
    warrantyMonths: 12,
    specs: [
      ["Potência", "60W"],
      ["Fluxo Luminoso", "6000 lm"],
      ["Proteção", "IP68"],
    ],
  },

  // Filtros
  {
    category: "filtros",
    name: "Filtro de Óleo do Motor",
    sku: "ALB-FL-5001",
    shortDescription: "Filtro de óleo de rosca para motores diesel de equipamento pesado.",
    description:
      "Filtro de óleo de alta eficiência com válvula anti-retorno e capacidade de retenção superior, prolongando a vida útil do motor.",
    price: 980,
    oemNumber: "CAT-1p7-9372",
    crossRefs: ["FLE-LF9009", "DON-P550777"],
    stock: 120,
    weightKg: 0.9,
    warrantyMonths: 3,
    featured: true,
    specs: [
      ["Tipo de Rosca", "1-1/2\"-16 UN"],
      ["Micragem", "15 microns"],
    ],
    compatibleBrands: ["Caterpillar"],
  },
  {
    category: "filtros",
    name: "Filtro de Ar Primário",
    sku: "ALB-FL-5002",
    shortDescription: "Filtro de ar primário para sistema de admissão do motor.",
    description:
      "Filtro de ar primário de papel plissado de alta densidade, garante máxima filtragem de partículas em ambientes com muito pó.",
    price: 1650,
    oemNumber: "KOM-6008471",
    crossRefs: ["DON-P181045"],
    stock: 85,
    weightKg: 1.4,
    warrantyMonths: 3,
    specs: [
      ["Eficiência de Filtragem", "99.9%"],
      ["Material", "Papel plissado"],
    ],
    compatibleBrands: ["Komatsu"],
  },
  {
    category: "filtros",
    name: "Filtro de Combustível Separador de Água",
    sku: "ALB-FL-5003",
    shortDescription: "Filtro separador de água e partículas para sistema de combustível.",
    description:
      "Filtro de combustível com separador de água integrado, protege o sistema de injeção contra contaminação e humidade.",
    price: 1200,
    oemNumber: "CAT-3260113",
    crossRefs: ["FLE-FS19924"],
    stock: 95,
    weightKg: 0.7,
    warrantyMonths: 3,
    specs: [
      ["Separação de Água", "Até 98%"],
      ["Micragem", "10 microns"],
    ],
    compatibleBrands: ["Caterpillar"],
  },
  {
    category: "filtros",
    name: "Filtro Hidráulico de Sucção",
    sku: "ALB-FL-5004",
    shortDescription: "Filtro de sucção para reservatório de óleo hidráulico.",
    description:
      "Filtro de sucção instalado no reservatório hidráulico, protege a bomba contra partículas grandes e detritos.",
    price: 2100,
    oemNumber: "VOL-7711224",
    crossRefs: [],
    stock: 38,
    weightKg: 1.1,
    warrantyMonths: 3,
    specs: [
      ["Micragem", "125 microns"],
      ["Posição", "Sucção"],
    ],
    compatibleBrands: ["Volvo CE"],
  },
  {
    category: "filtros",
    name: "Filtro de Cabine com Carvão Ativado",
    sku: "ALB-FL-5005",
    shortDescription: "Filtro de ar de cabine com carvão ativado para conforto do operador.",
    description:
      "Filtro de ar de cabine com camada de carvão ativado, reduz odores e partículas finas, melhorando a qualidade do ar para o operador.",
    price: 1450,
    oemNumber: "JCB-9911335",
    crossRefs: [],
    stock: 50,
    weightKg: 0.5,
    warrantyMonths: 3,
    specs: [
      ["Tipo", "Carvão ativado"],
      ["Substituição Recomendada", "500 horas"],
    ],
    compatibleBrands: ["JCB"],
  },

  // Travões
  {
    category: "travoes",
    name: "Disco de Travão Dianteiro Ventilado",
    sku: "ALB-TV-6001",
    shortDescription: "Disco de travão ventilado de alta resistência térmica.",
    description:
      "Disco de travão ventilado, fabricado em ferro fundido de alta qualidade, com tratamento anticorrosivo e excelente dissipação térmica.",
    price: 5400,
    oemNumber: "CAT-2200667",
    crossRefs: ["ZF-3311889"],
    stock: 20,
    weightKg: 9.5,
    warrantyMonths: 6,
    specs: [
      ["Diâmetro", "380 mm"],
      ["Espessura", "32 mm"],
      ["Material", "Ferro fundido ventilado"],
    ],
    compatibleBrands: ["Caterpillar"],
  },
  {
    category: "travoes",
    name: "Kit de Pastilhas de Travão",
    sku: "ALB-TV-6002",
    shortDescription: "Kit de pastilhas de travão semi-metálicas de alta durabilidade.",
    description:
      "Kit de pastilhas de travão semi-metálicas, oferece frenagem consistente e menor desgaste em condições de trabalho pesado.",
    price: 3200,
    oemNumber: "KOM-4411778",
    crossRefs: [],
    stock: 42,
    weightKg: 2.8,
    warrantyMonths: 6,
    specs: [
      ["Material de Fricção", "Semi-metálico"],
      ["Nº de Peças no Kit", "4"],
    ],
    compatibleBrands: ["Komatsu"],
  },
  {
    category: "travoes",
    name: "Cilindro Mestre de Travão",
    sku: "ALB-TV-6003",
    shortDescription: "Cilindro mestre hidráulico para sistema de travagem.",
    description:
      "Cilindro mestre de travão com vedantes de borracha de alta resistência, garante pressão hidráulica constante e resposta imediata.",
    price: 6800,
    oemNumber: "VOL-5522990",
    crossRefs: [],
    stock: 16,
    weightKg: 2.2,
    warrantyMonths: 6,
    specs: [
      ["Diâmetro do Pistão", "28.6 mm"],
      ["Material", "Alumínio fundido"],
    ],
    compatibleBrands: ["Volvo CE"],
  },
  {
    category: "travoes",
    name: "Cinta de Travão de Estacionamento",
    sku: "ALB-TV-6004",
    shortDescription: "Cinta de travão de estacionamento reforçada.",
    description:
      "Cinta de travão de estacionamento com material de fricção de alta resistência, assegura retenção segura da máquina em rampas.",
    price: 4100,
    oemNumber: "CAT-6633001",
    crossRefs: [],
    stock: 22,
    weightKg: 3.5,
    warrantyMonths: 6,
    specs: [
      ["Largura", "120 mm"],
      ["Material", "Fricção orgânica reforçada"],
    ],
    compatibleBrands: ["Caterpillar"],
  },

  // Arrefecimento
  {
    category: "arrefecimento",
    name: "Radiador de Arrefecimento do Motor",
    sku: "ALB-AR-7001",
    shortDescription: "Radiador de alumínio para sistema de arrefecimento do motor.",
    description:
      "Radiador de arrefecimento em alumínio brasado, alta capacidade de dissipação térmica, indicado para trabalho contínuo em climas quentes.",
    price: 24500,
    oemNumber: "CAT-8844112",
    crossRefs: ["KOM-9955223"],
    stock: 9,
    weightKg: 16.8,
    warrantyMonths: 12,
    featured: true,
    specs: [
      ["Material", "Alumínio brasado"],
      ["Capacidade", "38 Litros"],
    ],
    compatibleBrands: ["Caterpillar", "Komatsu"],
  },
  {
    category: "arrefecimento",
    name: "Ventoinha de Arrefecimento 24 Pás",
    sku: "ALB-AR-7002",
    shortDescription: "Ventoinha de arrefecimento de alta eficiência.",
    description:
      "Ventoinha de arrefecimento com 24 pás em polímero reforçado, reduz ruído e maximiza o fluxo de ar através do radiador.",
    price: 4800,
    oemNumber: "KOM-1122885",
    crossRefs: [],
    stock: 25,
    weightKg: 3.4,
    warrantyMonths: 6,
    specs: [
      ["Nº de Pás", "24"],
      ["Diâmetro", "710 mm"],
    ],
    compatibleBrands: ["Komatsu"],
  },
  {
    category: "arrefecimento",
    name: "Termostato do Motor 82°C",
    sku: "ALB-AR-7003",
    shortDescription: "Termostato de regulação da temperatura do motor.",
    description:
      "Termostato de precisão que regula a temperatura de funcionamento do motor, garantindo eficiência e proteção contra sobreaquecimento.",
    price: 950,
    oemNumber: "CAT-2211990",
    crossRefs: [],
    stock: 55,
    weightKg: 0.3,
    warrantyMonths: 3,
    specs: [
      ["Temperatura de Abertura", "82°C"],
      ["Material", "Latão e cera"],
    ],
    compatibleBrands: ["Caterpillar"],
  },
  {
    category: "arrefecimento",
    name: "Mangueira Superior do Radiador",
    sku: "ALB-AR-7004",
    shortDescription: "Mangueira flexível reforçada para circuito de arrefecimento.",
    description:
      "Mangueira em borracha reforçada com malha têxtil, resistente a altas temperaturas e pressão do circuito de arrefecimento.",
    price: 1350,
    oemNumber: "GEN-3300771",
    crossRefs: [],
    stock: 48,
    weightKg: 0.5,
    warrantyMonths: 3,
    specs: [
      ["Diâmetro Interno", "55 mm"],
      ["Temperatura Máxima", "130°C"],
    ],
  },

  // Rodagem
  {
    category: "rodagem",
    name: "Corrente de Rasto (Track Chain) - Par",
    sku: "ALB-RD-8001",
    shortDescription: "Par de correntes de rasto para escavadora de esteiras.",
    description:
      "Par de correntes de rasto (track chains) fabricadas em aço tratado termicamente, alta resistência ao desgaste em terrenos abrasivos.",
    price: 185000,
    oemNumber: "CAT-4400889",
    crossRefs: ["ITR-9911002"],
    stock: 3,
    weightKg: 620,
    warrantyMonths: 12,
    featured: true,
    specs: [
      ["Nº de Elos", "45 por lado"],
      ["Material", "Aço tratado termicamente"],
    ],
    compatibleBrands: ["Caterpillar"],
  },
  {
    category: "rodagem",
    name: "Roda Motriz (Sprocket)",
    sku: "ALB-RD-8002",
    shortDescription: "Roda motriz para sistema de tração de esteiras.",
    description:
      "Roda motriz (sprocket) segmentada, resistente a impactos e desgaste, garante transmissão eficiente de potência para a corrente de rasto.",
    price: 42000,
    oemNumber: "KOM-5511667",
    crossRefs: [],
    stock: 8,
    weightKg: 85,
    warrantyMonths: 6,
    specs: [
      ["Tipo", "Segmentada"],
      ["Nº de Dentes", "21"],
    ],
    compatibleBrands: ["Komatsu"],
  },
  {
    category: "rodagem",
    name: "Roldana Tensora (Idler)",
    sku: "ALB-RD-8003",
    shortDescription: "Roldana tensora dianteira para trem de rolamento.",
    description:
      "Roldana tensora (idler) dianteira, com vedação de longa duração e tratamento superficial que reduz o desgaste prematuro.",
    price: 38500,
    oemNumber: "VOL-6622334",
    crossRefs: [],
    stock: 7,
    weightKg: 78,
    warrantyMonths: 6,
    specs: [
      ["Posição", "Dianteira"],
      ["Diâmetro", "480 mm"],
    ],
    compatibleBrands: ["Volvo CE"],
  },
  {
    category: "rodagem",
    name: "Rolo Superior de Esteira",
    sku: "ALB-RD-8004",
    shortDescription: "Rolo superior para suporte da corrente de esteira.",
    description:
      "Rolo superior de esteira com rolamentos selados, reduz atrito e prolonga a vida útil de toda a rodagem.",
    price: 12500,
    oemNumber: "CAT-7733556",
    crossRefs: [],
    stock: 14,
    weightKg: 22,
    warrantyMonths: 6,
    specs: [
      ["Posição", "Superior"],
      ["Vedação", "Selada de fábrica"],
    ],
    compatibleBrands: ["Caterpillar"],
  },
  {
    category: "rodagem",
    name: "Rolo Inferior de Esteira",
    sku: "ALB-RD-8005",
    shortDescription: "Rolo inferior de trem de rolamento para escavadora.",
    description:
      "Rolo inferior de esteira em aço forjado, concebido para suportar cargas elevadas e condições severas de operação.",
    price: 15800,
    oemNumber: "KOM-8844221",
    crossRefs: [],
    stock: 11,
    weightKg: 34,
    warrantyMonths: 6,
    specs: [
      ["Posição", "Inferior"],
      ["Material", "Aço forjado"],
    ],
    compatibleBrands: ["Komatsu"],
  },

  // Pneus
  {
    category: "pneus",
    name: "Pneu Sólido 23.5-25",
    sku: "ALB-PN-9001",
    shortDescription: "Pneu sólido para pá carregadora, medida 23.5-25.",
    description:
      "Pneu sólido de borracha vulcanizada, elimina o risco de furos e é ideal para operações em terrenos com detritos cortantes.",
    price: 38500,
    oemNumber: "GEN-1100992",
    crossRefs: [],
    stock: 10,
    weightKg: 210,
    warrantyMonths: 6,
    featured: true,
    specs: [
      ["Medida", "23.5-25"],
      ["Tipo", "Sólido"],
    ],
  },
  {
    category: "pneus",
    name: "Pneu Pneumático 17.5-25",
    sku: "ALB-PN-9002",
    shortDescription: "Pneu pneumático para pá carregadora, medida 17.5-25.",
    description:
      "Pneu pneumático de piso profundo (L-3), oferece boa tração e resistência ao corte em obras e pedreiras.",
    price: 22800,
    oemNumber: "GEN-2211003",
    crossRefs: [],
    stock: 18,
    weightKg: 95,
    warrantyMonths: 6,
    specs: [
      ["Medida", "17.5-25"],
      ["Padrão de Piso", "L-3"],
    ],
  },
  {
    category: "pneus",
    name: "Câmara de Ar Reforçada 17.5-25",
    sku: "ALB-PN-9003",
    shortDescription: "Câmara de ar reforçada para pneus de equipamento pesado.",
    description:
      "Câmara de ar em borracha butílica reforçada, garante melhor retenção de pressão e resistência a furos.",
    price: 3400,
    oemNumber: "GEN-3322114",
    crossRefs: [],
    stock: 32,
    weightKg: 8,
    warrantyMonths: 3,
    specs: [
      ["Medida", "17.5-25"],
      ["Material", "Borracha butílica"],
    ],
  },
  {
    category: "pneus",
    name: "Jante de Aço 25 Polegadas",
    sku: "ALB-PN-9004",
    shortDescription: "Jante de aço para pneus de 25 polegadas.",
    description:
      "Jante de aço de alta resistência com tratamento anticorrosivo, compatível com pneus de 25 polegadas de equipamento pesado.",
    price: 18500,
    oemNumber: "GEN-4433225",
    crossRefs: [],
    stock: 9,
    weightKg: 68,
    warrantyMonths: 12,
    specs: [
      ["Diâmetro", "25\""],
      ["Material", "Aço tratado"],
    ],
  },

  // Ferramentas
  {
    category: "ferramentas",
    name: "Chave de Impacto Pneumática 1\"",
    sku: "ALB-FT-1101",
    shortDescription: "Chave de impacto pneumática profissional de 1 polegada.",
    description:
      "Chave de impacto pneumática de alto torque, ideal para desmontagem de rodas e componentes pesados em oficina.",
    price: 9500,
    oemNumber: "GEN-5544336",
    crossRefs: [],
    stock: 15,
    weightKg: 4.5,
    warrantyMonths: 12,
    featured: true,
    specs: [
      ["Torque Máximo", "2100 Nm"],
      ["Encaixe", "1\""],
    ],
  },
  {
    category: "ferramentas",
    name: "Macaco Hidráulico de Garrafa 20T",
    sku: "ALB-FT-1102",
    shortDescription: "Macaco hidráulico de garrafa com capacidade de 20 toneladas.",
    description:
      "Macaco hidráulico de garrafa de alta capacidade, construção robusta em aço, ideal para elevação de equipamento pesado em oficina.",
    price: 6200,
    oemNumber: "GEN-6655447",
    crossRefs: [],
    stock: 20,
    weightKg: 12,
    warrantyMonths: 12,
    specs: [
      ["Capacidade", "20 toneladas"],
      ["Curso", "225 mm"],
    ],
  },
  {
    category: "ferramentas",
    name: "Kit de Chaves Combinadas 8-32mm",
    sku: "ALB-FT-1103",
    shortDescription: "Kit profissional de chaves combinadas em aço crómio-vanádio.",
    description:
      "Kit de 20 chaves combinadas fabricadas em aço crómio-vanádio, com acabamento cromado resistente à corrosão.",
    price: 4800,
    oemNumber: "GEN-7766558",
    crossRefs: [],
    stock: 26,
    weightKg: 3.8,
    warrantyMonths: 12,
    specs: [
      ["Material", "Crómio-vanádio"],
      ["Nº de Peças", "20"],
    ],
  },
  {
    category: "ferramentas",
    name: "Extintor de Incêndio Veicular 6kg",
    sku: "ALB-FT-1104",
    shortDescription: "Extintor de pó químico ABC para cabine de equipamento pesado.",
    description:
      "Extintor de incêndio de pó químico ABC, com suporte de fixação para cabine, essencial para segurança em obra.",
    price: 2100,
    oemNumber: "GEN-8877669",
    crossRefs: [],
    stock: 40,
    weightKg: 6.5,
    warrantyMonths: 24,
    specs: [
      ["Capacidade", "6 kg"],
      ["Classe de Fogo", "ABC"],
    ],
  },

  // Lubrificantes
  {
    category: "lubrificantes",
    name: "Óleo de Motor 15W40 - Bidão 20L",
    sku: "ALB-LB-1201",
    shortDescription: "Óleo mineral 15W40 para motores diesel de serviço pesado.",
    description:
      "Óleo lubrificante 15W40 formulado para motores diesel de trabalho pesado, oferece proteção superior contra desgaste e depósitos.",
    price: 4200,
    oemNumber: "GEN-9988770",
    crossRefs: [],
    stock: 65,
    weightKg: 18,
    warrantyMonths: 0,
    featured: true,
    specs: [
      ["Viscosidade", "15W40"],
      ["Volume", "20 Litros"],
      ["Especificação", "API CI-4"],
    ],
  },
  {
    category: "lubrificantes",
    name: "Óleo Hidráulico ISO 68 - Bidão 20L",
    sku: "ALB-LB-1202",
    shortDescription: "Óleo hidráulico ISO 68 para sistemas de alta pressão.",
    description:
      "Óleo hidráulico com aditivos anti-desgaste, formulado para uso em sistemas hidráulicos de alta pressão de equipamento pesado.",
    price: 3900,
    oemNumber: "GEN-1100881",
    crossRefs: [],
    stock: 58,
    weightKg: 18,
    warrantyMonths: 0,
    specs: [
      ["Viscosidade", "ISO 68"],
      ["Volume", "20 Litros"],
    ],
  },
  {
    category: "lubrificantes",
    name: "Óleo de Transmissão 80W90 - Bidão 20L",
    sku: "ALB-LB-1203",
    shortDescription: "Óleo de transmissão e diferencial 80W90.",
    description:
      "Óleo de engrenagens 80W90 para transmissões manuais, diferenciais e caixas de redução de equipamento pesado.",
    price: 4600,
    oemNumber: "GEN-2211992",
    crossRefs: [],
    stock: 44,
    weightKg: 18,
    warrantyMonths: 0,
    specs: [
      ["Viscosidade", "80W90"],
      ["Volume", "20 Litros"],
    ],
  },
  {
    category: "lubrificantes",
    name: "Massa Consistente de Lítio - Balde 5kg",
    sku: "ALB-LB-1204",
    shortDescription: "Massa lubrificante de lítio multiuso para pontos de articulação.",
    description:
      "Massa consistente à base de lítio, indicada para lubrificação de pinos, buchas e articulações sujeitas a cargas elevadas.",
    price: 1850,
    oemNumber: "GEN-3322003",
    crossRefs: [],
    stock: 70,
    weightKg: 5,
    warrantyMonths: 0,
    specs: [
      ["Tipo", "Lítio Multiuso"],
      ["Volume", "5 kg"],
    ],
  },
  {
    category: "lubrificantes",
    name: "Líquido de Arrefecimento Concentrado 5L",
    sku: "ALB-LB-1205",
    shortDescription: "Líquido de arrefecimento concentrado à base de etilenoglicol.",
    description:
      "Líquido de arrefecimento concentrado, protege contra corrosão e congelamento, compatível com motores de alumínio e ferro fundido.",
    price: 1400,
    oemNumber: "GEN-4433114",
    crossRefs: [],
    stock: 52,
    weightKg: 5.4,
    warrantyMonths: 0,
    specs: [
      ["Base", "Etilenoglicol"],
      ["Volume", "5 Litros"],
    ],
  },

  // Carroçaria e cabine
  {
    category: "carroceria",
    name: "Assento de Operador Suspenso Pneumático",
    sku: "ALB-CB-1301",
    shortDescription: "Assento de operador com suspensão pneumática ajustável.",
    description:
      "Assento de operador com suspensão pneumática, apoios de braço ajustáveis e revestimento resistente, proporciona conforto em jornadas longas.",
    price: 18500,
    oemNumber: "GEN-5544225",
    crossRefs: [],
    stock: 10,
    weightKg: 22,
    warrantyMonths: 12,
    featured: true,
    specs: [
      ["Suspensão", "Pneumática"],
      ["Revestimento", "Tecido resistente"],
    ],
  },
  {
    category: "carroceria",
    name: "Vidro Frontal de Cabine Temperado",
    sku: "ALB-CB-1302",
    shortDescription: "Vidro frontal temperado para cabine de escavadora.",
    description:
      "Vidro de segurança temperado para cabine, resistente a impactos e variações térmicas, com furação original de fábrica.",
    price: 9800,
    oemNumber: "CAT-3300556",
    crossRefs: [],
    stock: 8,
    weightKg: 14,
    warrantyMonths: 6,
    specs: [
      ["Tipo", "Vidro temperado"],
      ["Espessura", "6 mm"],
    ],
    compatibleBrands: ["Caterpillar"],
  },
  {
    category: "carroceria",
    name: "Espelho Retrovisor de Cabine",
    sku: "ALB-CB-1303",
    shortDescription: "Espelho retrovisor externo para cabine de máquina pesada.",
    description:
      "Espelho retrovisor com braço ajustável e superfície anti-embaciamento, melhora a visibilidade e segurança do operador.",
    price: 1650,
    oemNumber: "GEN-6655336",
    crossRefs: [],
    stock: 28,
    weightKg: 1.2,
    warrantyMonths: 6,
    specs: [
      ["Tipo", "Convexo anti-embaciamento"],
      ["Fixação", "Braço ajustável"],
    ],
  },
  {
    category: "carroceria",
    name: "Manípulo de Comando Joystick",
    sku: "ALB-CB-1304",
    shortDescription: "Joystick de comando hidráulico para cabine de escavadora.",
    description:
      "Manípulo de comando joystick ergonómico, com botões programáveis e resposta precisa para controlo dos movimentos hidráulicos.",
    price: 12800,
    oemNumber: "KOM-7766449",
    crossRefs: [],
    stock: 6,
    weightKg: 1.8,
    warrantyMonths: 6,
    specs: [
      ["Tipo", "Piloto hidráulico proporcional"],
      ["Botões Programáveis", "4"],
    ],
    compatibleBrands: ["Komatsu"],
  },
];

const DEMO_REVIEWS = [
  { rating: 5, title: "Excelente qualidade", comment: "Peça original, chegou bem embalada e encaixou perfeitamente na nossa máquina." },
  { rating: 4, title: "Muito bom custo-benefício", comment: "Boa relação qualidade-preço, entrega dentro do prazo combinado." },
  { rating: 5, title: "Recomendo a Albimaq", comment: "Já é a segunda compra e continuam com o mesmo nível de qualidade e atendimento." },
  { rating: 4, title: "Cumpriu o esperado", comment: "Produto conforme descrito, equipa sempre disponível para esclarecer dúvidas técnicas." },
];

const BLOG_POSTS = [
  {
    title: "Como escolher o filtro de óleo certo para a sua máquina",
    slug: "como-escolher-filtro-oleo-certo",
    excerpt: "Guia prático para identificar o filtro de óleo correto e evitar avarias no motor.",
    content:
      "Escolher o filtro de óleo correto é essencial para a longevidade do motor da sua máquina. Neste artigo explicamos como identificar o número de peça correto, a importância da micragem e a periodicidade recomendada de substituição para equipamento de trabalho pesado.",
    coverImageUrl: "/images/categories/filtros.svg",
    author: "Equipa Técnica Albimaq",
  },
  {
    title: "Manutenção preventiva do sistema hidráulico",
    slug: "manutencao-preventiva-sistema-hidraulico",
    excerpt: "Dicas essenciais para prolongar a vida útil de bombas, cilindros e válvulas hidráulicas.",
    content:
      "O sistema hidráulico é o coração de qualquer máquina de escavação ou carga. Neste artigo abordamos as boas práticas de manutenção preventiva, desde a troca regular de óleo hidráulico até à inspeção de mangueiras e vedantes.",
    coverImageUrl: "/images/categories/hidraulica.svg",
    author: "Equipa Técnica Albimaq",
  },
  {
    title: "Sinais de desgaste no trem de rolamento",
    slug: "sinais-desgaste-trem-de-rolamento",
    excerpt: "Aprenda a identificar os principais sinais de desgaste em correntes, roletes e rodas motrizes.",
    content:
      "O trem de rolamento é um dos componentes mais dispendiosos de substituir numa máquina de esteiras. Saiba como identificar sinais precoces de desgaste em correntes, roletes e rodas motrizes para planear a manutenção com antecedência.",
    coverImageUrl: "/images/categories/rodagem.svg",
    author: "Equipa Técnica Albimaq",
  },
];

async function main() {
  // Wake up a possibly-suspended serverless Postgres compute (e.g. Neon) before
  // opening a transaction, so the transaction's own acquisition timeout doesn't
  // race the cold-start latency.
  await prisma.$queryRawUnsafe("SELECT 1");

  console.log("A limpar dados existentes...");
  await prisma.$transaction(
    [
      prisma.orderItem.deleteMany(),
      prisma.order.deleteMany(),
      prisma.review.deleteMany(),
      prisma.wishlistItem.deleteMany(),
      prisma.productCompatibility.deleteMany(),
      prisma.productSpec.deleteMany(),
      prisma.productImage.deleteMany(),
      prisma.product.deleteMany(),
      prisma.machineModel.deleteMany(),
      prisma.brand.deleteMany(),
      prisma.category.deleteMany(),
      prisma.address.deleteMany(),
      prisma.contactMessage.deleteMany(),
      prisma.newsletterSubscriber.deleteMany(),
      prisma.blogPost.deleteMany(),
      prisma.user.deleteMany(),
    ],
    { maxWait: 20000, timeout: 20000 },
  );

  console.log("A criar categorias...");
  const categoryByKey = new Map<string, string>();
  for (let i = 0; i < CATEGORIES.length; i++) {
    const c = CATEGORIES[i];
    const category = await prisma.category.create({
      data: {
        name: c.name,
        slug: c.key,
        description: c.description,
        imageUrl: `/images/categories/${c.key}.svg`,
        position: i,
      },
    });
    categoryByKey.set(c.key, category.id);
  }

  console.log("A criar marcas e modelos de máquinas...");
  const modelByBrandAndName = new Map<string, string>();
  for (const b of BRANDS) {
    const brand = await prisma.brand.create({
      data: {
        name: b.brand,
        slug: b.brand.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
        origin: b.origin,
      },
    });
    for (const m of b.models) {
      const model = await prisma.machineModel.create({
        data: {
          brandId: brand.id,
          name: m.name,
          type: m.type,
          yearFrom: m.yearFrom,
          yearTo: m.yearTo,
        },
      });
      modelByBrandAndName.set(`${b.brand}::${m.name}`, model.id);
    }
  }
  const modelIdsByBrand = new Map<string, string[]>();
  for (const [key, id] of modelByBrandAndName.entries()) {
    const [brand] = key.split("::");
    modelIdsByBrand.set(brand, [...(modelIdsByBrand.get(brand) ?? []), id]);
  }

  console.log(`A criar ${PRODUCTS.length} produtos...`);
  const demoUsers: { id: string }[] = [];

  const passwordHash = await bcrypt.hash("Albimaq@2026", 10);
  const demoCustomer = await prisma.user.create({
    data: {
      name: "Carlos Machava",
      email: "cliente@demo.com",
      passwordHash,
      phone: "+258840000001",
      company: "Construções Machava, Lda",
      role: "CUSTOMER",
      addresses: {
        create: {
          label: "Escritório",
          recipientName: "Carlos Machava",
          phone: "+258840000001",
          province: Province.MAPUTO_CIDADE,
          city: "Maputo",
          neighborhood: "Sommerschield",
          street: "Av. Julius Nyerere, 1234",
          isDefault: true,
        },
      },
    },
  });
  demoUsers.push(demoCustomer);

  await prisma.user.create({
    data: {
      name: "Administrador Albimaq",
      email: "admin@albimaq.co.mz",
      passwordHash: await bcrypt.hash("Admin@2026", 10),
      role: "ADMIN",
    },
  });

  let reviewCursor = 0;
  for (let i = 0; i < PRODUCTS.length; i++) {
    const p = PRODUCTS[i];
    const categoryId = categoryByKey.get(p.category);
    if (!categoryId) throw new Error(`Categoria desconhecida: ${p.category}`);

    const slug = p.sku.toLowerCase();
    const shouldReview = i % 3 === 0;

    const product = await prisma.product.create({
      data: {
        sku: p.sku,
        name: p.name,
        slug,
        shortDescription: p.shortDescription,
        description: p.description,
        categoryId,
        price: p.price,
        compareAtPrice: p.compareAtPrice,
        condition: p.condition ?? ProductCondition.NOVO,
        oemNumber: p.oemNumber,
        crossReferenceNumbers: p.crossRefs,
        stockQuantity: p.stock,
        weightKg: p.weightKg,
        warrantyMonths: p.warrantyMonths,
        isFeatured: Boolean(p.featured),
        averageRating: shouldReview ? 4.5 : 0,
        reviewCount: shouldReview ? 2 : 0,
        images: {
          create: [
            {
              url: `/images/categories/${p.category}.svg`,
              alt: p.name,
              position: 0,
            },
          ],
        },
        specs: {
          create: p.specs.map(([label, value], idx) => ({ label, value, position: idx })),
        },
      },
    });

    if (p.compatibleBrands?.length) {
      for (const brandName of p.compatibleBrands) {
        const ids = modelIdsByBrand.get(brandName) ?? [];
        for (const machineModelId of ids) {
          await prisma.productCompatibility.create({
            data: { productId: product.id, machineModelId },
          });
        }
      }
    }

    if (shouldReview) {
      const r1 = DEMO_REVIEWS[reviewCursor % DEMO_REVIEWS.length];
      const r2 = DEMO_REVIEWS[(reviewCursor + 1) % DEMO_REVIEWS.length];
      reviewCursor++;
      await prisma.review.createMany({
        data: [
          { productId: product.id, userId: demoCustomer.id, rating: r1.rating, title: r1.title, comment: r1.comment },
          { productId: product.id, userId: demoCustomer.id, rating: r2.rating, title: r2.title, comment: r2.comment },
        ],
      });
    }
  }

  console.log("A criar artigos do blog...");
  for (const post of BLOG_POSTS) {
    await prisma.blogPost.create({ data: post });
  }

  console.log("Seed concluído com sucesso.");
  console.log(`Utilizador de teste: cliente@demo.com / Albimaq@2026`);
  console.log(`Utilizador admin: admin@albimaq.co.mz / Admin@2026`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
