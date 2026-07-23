import { LuBookOpen, LuCircle, LuMinus, LuArrowRight, LuLock, LuHourglass } from "react-icons/lu";
import "./Modal.css";

const cards = [
  {
    icon: <LuCircle size={20} />,
    title: "La place",
    text: "Représentée par un cercle, une place décrit un état ou une condition possible du système (une ressource disponible, une machine libre, une file d'attente...). Le nombre de jetons qu'elle contient — son marquage — indique combien de fois cette condition est actuellement vraie.",
  },
  {
    icon: <LuMinus size={20} />,
    title: "La transition",
    text: "Représentée par une barre, une transition modélise un événement qui fait évoluer le système : le démarrage d'une opération, la libération d'une ressource, un changement d'état. Elle relie des places d'entrée à des places de sortie.",
  },
  {
    icon: <LuArrowRight size={20} />,
    title: "L'arc et le franchissement",
    text: "Un arc relie toujours une place à une transition ou une transition à une place, jamais deux places ou deux transitions entre elles. Une transition est franchissable dès que chacune de ses places d'entrée contient au moins autant de jetons que le poids de l'arc correspondant.",
  },
  {
    icon: <LuLock size={20} />,
    title: "Blocage et famine",
    text: "Un réseau est bloqué lorsque, dans un marquage donné, aucune transition n'est franchissable : le système ne peut plus évoluer. La famine désigne le cas où une transition reste indéfiniment non franchissable alors que d'autres continuent de s'exécuter autour d'elle.",
  },
  {
    icon: <LuHourglass size={20} />,
    title: "Réseaux généralisés et à capacité",
    text: "Dans un réseau généralisé, chaque arc porte un poids (au lieu de 1 par défaut), qui indique le nombre de jetons consommés ou produits à chaque franchissement. Un réseau à capacité limite en plus le nombre maximal de jetons qu'une place peut contenir.",
  },
];

function Theorie() {
  return (
    <div className="th-page">
      <div className="th-header">
        <LuBookOpen size={20} />
        <h2>Théorie — Réseaux de Petri</h2>
      </div>

      <div className="th-grid">
        {cards.map((c) => (
          <article key={c.title} className="th-card">
            <div className="th-icon">{c.icon}</div>
            <h3>{c.title}</h3>
            <p>{c.text}</p>
          </article>
        ))}
      </div>

      <div className="th-formula-card">
        <h3>Matrices et évolution du marquage</h3>
        <p>
          Un réseau se décrit formellement par le quadruplet (P, T, Pré, Post), où Pré et Post
          sont deux matrices places × transitions. Pré(p, t) indique le poids de l'arc entrant de
          la place p vers la transition t, Post(p, t) celui de l'arc sortant de t vers p.
        </p>
        <p>La matrice d'incidence résume les deux à la fois :</p>
        <div className="th-formula">W = Post − Pré</div>
        <p>
          Le tirage d'une transition t depuis un marquage M<sub>i</sub> se traduit alors par une
          simple opération vectorielle, où S est le vecteur indicateur de la transition tirée :
        </p>
        <div className="th-formula">M<sub>k</sub> = M<sub>i</sub> + W · S<sup>T</sup></div>
        <p>
          C'est exactement le calcul qu'effectue la page <strong>Simulateur</strong> à chaque clic
          sur une transition, et que la page <strong>Matrices</strong> retrace pas à pas.
        </p>
      </div>
    </div>
  );
}

export default Theorie;
