import About from "./components/about/about";
import Home from "./components/home/home";


export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col justify-center  items-center">
      <Home />
      <About />
    </div>
  );
}
