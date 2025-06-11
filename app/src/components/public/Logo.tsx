import { useNavigate } from "react-router-dom";

function Logo() {
  const navigator = useNavigate();
  return (
    <button className="!p-0" onClick={() => navigator("/")}>
      <div id="logo" className="flex items-center">
        <img className="w-8 h-8" src="/favicon.png" />
        <img id="typography" className="w-24" src="/stellagram_logo_b.svg" />
      </div>
    </button>
  );
}

export default Logo;
