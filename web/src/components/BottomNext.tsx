import { ArrowRightIcon } from '@heroicons/react/24/solid'

function BottomNext() {
  return (
    <button className="flex items-center font-roboto font-bold text-sm space-x-1 text-white hover:text-blue-700 focus:outline-none">
      <span>NEXT</span>
      <ArrowRightIcon className="h-5 w-5" />
    </button>
  );
}

export default BottomNext;

