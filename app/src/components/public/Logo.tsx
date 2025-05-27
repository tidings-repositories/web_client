import { useNavigate } from "react-router-dom";

function Logo() {
  const navigator = useNavigate();
  return (
    <button className="!p-0" onClick={() => navigator("/")}>
      <div className="flex">
        <img className="w-8 h-8" src="/assets/favicon.png" />
        <img className="w-24" src="/assets/stellagram_logo_b.svg" />
      </div>
    </button>
  );
}

export default Logo;
