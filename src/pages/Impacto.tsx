import { Droplets } from "lucide-react";

const DESTAQUES = [
  {
    year: "2022",
    text: "Gestão de resíduos na Vila Sertão de Palmas (TO) e entrega de 60 filtros de água à Comunidade Quilombola Boa Esperança, em Mateiros (TO).",
  },
  {
    year: "2023",
    text: "Palestras ambientais, hortas pedagógicas com composteiras e centrais de distribuição de água em escolas de Petrolina (PE) e Cruz (CE), somando 340 estudantes. 250 kits de filtro entregues a famílias de Petrolina (PE), Porto da Barra (AL), Crato, Camocim e Preá (CE). Edição certificada como evento Resíduo Zero.",
  },
  {
    year: "2026",
    text: "Parceria com a Conasa Infraestrutura distribuiu 520 filtros ConÁgua a famílias de comunidades ao longo da rota, em Goiás e Tocantins.",
  },
];

const PARCEIROS = ["SAS Brasil", "Rally da Educação", "Carência Menstrual", "Conasa Infraestrutura", "Monaro Sports", "Usual Brinquedos"];

export default function Impacto() {
  return (
    <div className="container py-6 max-w-lg">
      <p className="label-text text-primary mb-1 flex items-center gap-1.5">
        <Droplets className="h-3.5 w-3.5" /> Impacto socioambiental
      </p>
      <h1 className="heading-lg">Instituto Sertões</h1>
      <p className="body-text !text-sm mt-2">
        Organização sem fins lucrativos criada em 2022 pela Plataforma Sertões, com foco em impacto
        social e econômico através do esporte: atendimento em saúde, projetos educacionais e
        ações de conscientização ambiental nas comunidades ao longo da rota do rally.
      </p>

      <div className="surface-card rounded-lg p-4 mt-4">
        <p className="label-text mb-1.5">Como começou</p>
        <p className="body-text !text-sm">
          Em 2021, o piloto Mario Marcondes Neto teve problemas com o carro no interior do Piauí
          durante a competição e viu de perto a falta de água potável na região, com moradores
          filtrando água em filtro de café. Foi o ponto de partida das ações que, em 2022, viraram o
          Instituto Sertões.
        </p>
      </div>

      <div className="mt-5">
        <p className="label-text mb-2">Na prática</p>
        <div className="space-y-2">
          {DESTAQUES.map((d) => (
            <div key={d.year} className="surface-card rounded-lg p-3 flex gap-3">
              <span className="font-display font-black italic text-lg text-primary shrink-0 leading-tight">{d.year}</span>
              <p className="body-text !text-sm">{d.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="surface-card rounded-lg p-4 mt-5">
        <p className="label-text mb-1.5">Parceiros do Instituto</p>
        <div className="flex flex-wrap gap-1.5">
          {PARCEIROS.map((p) => (
            <span key={p} className="rounded-sm bg-muted/40 px-2 py-1 caption-text !text-xs">{p}</span>
          ))}
        </div>
      </div>

      <div className="surface-elevated rounded-lg p-4 mt-5">
        <p className="body-text !text-sm italic">
          "O Instituto chegou para potencializar o lado social do Sertões. Queremos ser o rally da
          transformação social, tendo o esporte como fio condutor, e fomentar projetos que deixem um
          legado para as pessoas e comunidades."
        </p>
        <p className="caption-text !text-xs mt-2">Leonora Guedes, Presidente do Instituto Sertões</p>
      </div>

      <div className="mt-6 space-y-1">
        <p className="caption-text !text-[10px] text-muted-foreground/60">
          Fontes:{" "}
          <a
            href="https://www.vidamaissustentavel.com.br/2026/08/22/empresa-entregara-520-filtros-solidarios-durante-o-sertoes-2026/"
            target="_blank"
            rel="noreferrer"
            className="text-primary underline underline-offset-2"
          >
            Vida Mais Sustentável
          </a>{" "}
          e{" "}
          <a
            href="https://sertoes.pressroom.com.br/4290755a8f/instituto-sertoes-transforma-realidades-pela-rota-do-rally.html"
            target="_blank"
            rel="noreferrer"
            className="text-primary underline underline-offset-2"
          >
            press room oficial do Instituto Sertões
          </a>
          .
        </p>
        <p className="caption-text !text-[10px] text-muted-foreground/60">
          Página não oficial, feita por fã. Não tem vínculo com a organização do rally.
        </p>
      </div>
    </div>
  );
}
