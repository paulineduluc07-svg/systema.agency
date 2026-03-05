import { Switch, Route } from "wouter";
import Landing from "@/pages/Landing";
import Reading from "@/pages/Reading";
import Book from "@/pages/Book";
import Guide from "@/pages/Guide";

export default function App() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/reading" component={Reading} />
      <Route path="/book" component={Book} />
      <Route path="/guide" component={Guide} />
    </Switch>
  );
}
