import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container py-24 text-center">
      <p className="heading-xl text-primary">404</p>
      <p className="body-text mt-2">Essa página não existe. Talvez tenha ficado pra trás na poeira.</p>
      <Link to="/"><Button className="mt-6">Voltar pro início</Button></Link>
    </div>
  );
}
