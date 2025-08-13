import { SearchIcon } from '@heroicons/react/outline';
import { useCallback } from 'react';

const SearchBar = (props) => {
    const {handleSearchCat} = props;
    return (
        <div className="bg-white searchForm flex border w-full rounded-md">
            <input
                className="italic text-gray-700 leading-tight focus:outline-none border-0 w-full"
                id="search-child-cat"
                type="text"
                placeholder="Tìm kiếm"
                onChange={(evt) => handleSearchCat(evt)}
            />
            <div className="p-0">
                <button
                className="p-2 flex items-center justify-center hover:text-blue-700 transition-all duration-350"
                >
                    <SearchIcon className="w-6 h-6" />
                </button>
            </div>
        </div>
    )
}

export default SearchBar;