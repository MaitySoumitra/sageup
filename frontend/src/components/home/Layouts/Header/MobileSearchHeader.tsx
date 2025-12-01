import { forwardRef } from 'react';
import { MagnifyingGlass } from '@phosphor-icons/react';

type MobileSearchHeaderProps = {
  isSticky?: boolean;
};

const MobileSearchHeader = forwardRef<HTMLDivElement, MobileSearchHeaderProps>(
  ({ isSticky = false }, ref) => {
    return (
      <div
        ref={ref}
        className={`
          flex flex-col md:hidden bg-white px-4 py-3 sticky z-40 gap-y-3 
          border-b border-gray-100 transition-all duration-300
          ${isSticky ? 'top-0' : 'top-[80px]'}
        `}
      >
        <div className="relative flex items-center">
          <MagnifyingGlass
            size={20}
            weight="regular"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600"
          />
          <a className="block w-full" href="/search">
            <input
              type="text"
              placeholder="Search for Products"
              readOnly
              className="w-full pl-10 pr-3 h-11 text-sm bg-white border border-blue-500 rounded-md shadow-sm focus:outline-none placeholder:text-gray-900 text-gray-900 cursor-pointer"
            />
          </a>
        </div>
      </div>
    );
  }
);

export default MobileSearchHeader;
