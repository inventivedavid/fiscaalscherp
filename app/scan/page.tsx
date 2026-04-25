import { redirect } from "next/navigation";

// Het dossier ís het hoofdkanaal. /scan blijft bestaan voor oude links,
// maar leidt direct door naar de cockpit-flow.
export default function ScanRedirect() {
  redirect("/");
}
