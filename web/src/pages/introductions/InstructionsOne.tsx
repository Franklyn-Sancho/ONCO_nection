import { Link } from "react-router-dom";
import BottomNext from "../../components/BottomNext";
import Logo from "../../components/Logo";
import NavigationDots from "../../components/NavigationDots";
import MenuIcon from "../../components/MenuIcon";
import LogoIcon from "../../components/LogoIcon";

function InstructionOne() {
  return (
    <div className="instruction-one">
      <div className="w-90 flex justify-between mx-4 pt-3">
        <LogoIcon/>
        <MenuIcon/>
      </div>
      <div className="flex justify-center items-center mt-16 mb-24">
        <Logo />
      </div>
      <div className="h-48 flex flex-col m-6">
        <h3 className="font-roboto font-bold text-5xl mb-3 leading-tight">
          Be Hope, <br />
          Find Hope
        </h3>
        <p className="text-justify font-roboto text-sm font-light w-86 leading-snug">
          You can connect with those who share the same struggle and purpose.
          Find your support network with people who understand you
        </p>
      </div>
      <div className="w-86 flex justify-between mx-6 pt-16">
        <NavigationDots currentPage={1} />
        <Link to="/2">
          <BottomNext />
        </Link>
      </div>
    </div>
  );
}

export default InstructionOne;
