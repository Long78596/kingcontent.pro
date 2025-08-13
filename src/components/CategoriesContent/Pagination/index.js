import React, { useEffect, useState } from 'react';
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from '@heroicons/react/solid';
import { Link, useParams } from 'react-router-dom';

const range = (from, to) => {
  let i = from;
  const range = [];
  while (i <= to) {
    range.push(i);
    i += 1;
  }
  return range;
};
const LEFT_PAGE = 'LEFT';
const RIGHT_PAGE = 'RIGHT';

const Pagination = (props) => {
  const {
    pageNeighbours,
    onPageChanged,
    totalPages,
    currentPage,
    setCurrentPage,
    loading,
  } = props;
  let { slug } = useParams();

  const fetchPageNumbers = () => {
    const totalNumbers = pageNeighbours * 2 + 3;
    const totalBlocks = totalNumbers + 2;

    if (totalPages > totalBlocks) {
      const startPage = Math.max(2, currentPage - pageNeighbours);
      const endPage = Math.min(totalPages - 1, currentPage + pageNeighbours);
      let pages = range(startPage, endPage);

      const hasLeftButton = startPage > 2;
      const hasRightButton = totalPages - endPage > 1;
      const buttonOffset = totalNumbers - (pages.length + 1);

      switch (true) {
        case hasLeftButton && !hasRightButton:
          {
            const extraPages = range(startPage - buttonOffset, startPage - 1);
            pages = [LEFT_PAGE, ...extraPages, ...pages];
          }
          break;

        case !hasLeftButton && hasRightButton:
          {
            const extraPages = range(endPage + 1, endPage + buttonOffset);
            pages = [...pages, ...extraPages, RIGHT_PAGE];
          }
          break;

        case hasLeftButton && hasRightButton:
        default: {
          pages = [LEFT_PAGE, ...pages, RIGHT_PAGE];
          break;
        }
      }
      return [1, ...pages, totalPages];
    }
    return range(1, totalPages);
  };

  const pages = fetchPageNumbers();

  const gotoPage = (page) => {
    const currentPage = Math.max(0, Math.min(page, totalPages));
    onPageChanged(currentPage);
    setCurrentPage(currentPage);
  };

  const handleClick = (page) => (evt) => {
    evt.preventDefault();
    gotoPage(page);
  };

  const handleMoveLeft = (evt) => {
    evt.preventDefault();
    gotoPage(currentPage - pageNeighbours * 2 - 1);
  };

  const handleMoveRight = (evt) => {
    evt.preventDefault();
    gotoPage(currentPage + pageNeighbours * 2 + 1);
  };

  return (
    <div className="bg-white px-2 py-2 mb-1 border-t border-gray-200 sm:px-6 z-10 mt-3 rounded-lg">
      <div className="flex items-center flex-col mb-2">
        <div>
          <p className=" text-sm text-gray-700">
            {' '}
            Hiển thị trang
            <span className="font-medium"> {currentPage} </span> /
            <span className="font-medium"> {totalPages} </span> trang
          </p>
        </div>

        <div>
          <nav
            className="relative inline-flex rounded-md shadow-sm -space-x-px"
            aria-label="Pagination"
          >
            {pages.map((page, index) => {
              if (page === LEFT_PAGE)
                return (
                  <button
                    key={index}
                    className="relative inline-flex items-center px-2 py-2 cursor-pointer border border-gray-300 bg-white font-medium text-gray-500 hover:bg-gray-100 hover:text-indigo-600 transition-all duration-200 ease-linear"
                    aria-label="Previous"
                    disabled={loading}
                    onClick={handleMoveLeft}
                    // to = {`/danh-muc/${slug}?page_${Math.max(0, Math.min((currentPage - pageNeighbours * 2 - 1), totalPages))}`}
                  >
                    <ChevronDoubleLeftIcon
                      className="h-5 w-5"
                      aria-hidden="true"
                    />
                  </button>
                );

              if (page === RIGHT_PAGE)
                return (
                  <button
                    key={index}
                    className="relative inline-flex items-center px-2 py-2 cursor-pointer border border-gray-300 bg-white font-medium text-gray-500 hover:bg-gray-100 hover:text-indigo-600 transition-all duration-200 ease-linear"
                    aria-label="Next"
                    disabled={loading}
                    onClick={handleMoveRight}
                    // to = {`/danh-muc/${slug}?page_${Math.max(0, Math.min((currentPage + pageNeighbours * 2 + 1), totalPages))}`}
                  >
                    <ChevronDoubleRightIcon
                      className="h-5 w-5"
                      aria-hidden="true"
                    />
                  </button>
                );

              return (
                <button
                  className={`relative inline-flex items-center px-4 py-2 cursor-pointer border ${
                    currentPage === page
                      ? 'border-indigo-300 text-indigo-600 bg-indigo-300 font-semibold z-10'
                      : 'border-gray-300'
                  } bg-white font-medium text-gray-500 hover:bg-gray-100 hover:text-indigo-600 transition-all duration-200 ease-linear`}
                  // to = {`/danh-muc/${slug}?page_${page}`}
                  key={index}
                  disabled={loading}
                  onClick={handleClick(page)}
                >
                  {page}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Pagination);
