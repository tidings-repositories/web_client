import { useNavigate } from "react-router-dom";

function Logo() {
  const navigator = useNavigate();
  return (
    <button className="!p-0" onClick={() => navigator("/")}>
      <div id="logo" className="flex items-center">
        <img className="min-w-8 max-w-8 min-h-8 max-h-8" src="/favicon.png" />
        <img
          id="typography"
          className="min-w-24 max-w-24 max-h-8"
          src="/stellagram_logo_b.svg"
        />
      </div>
    </button>
  );
}

export default Logo;
