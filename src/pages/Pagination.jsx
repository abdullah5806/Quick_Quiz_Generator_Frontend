import React from "react";

const Pagination = ({currentPage, totalPages, onPageChange}) => {
    if(totalPages <= 1) {
        return null;
    }

    const handlePrevious = () => {
        if(currentPage > 1){
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if(currentPage < totalPages){
            onPageChange(currentPage + 1);
        }
    };

    const handlePageClick = (page) => {
        if(page !== currentPage){
            onPageChange(page);
        }
    };

    return(
        <div className="flex justify-center items-center gap-2 mt-6">
            <button 
                type="button"
                onClick={handlePrevious}
                disabled={currentPage == 1}
                className="px-4 py-2 border rounded-lg bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Previous
            </button>

            {Array.from( 
                { length: totalPages }, 
                (_, index) => index + 1 
            ).map((page) => ( 
                <button 
                    type="button" 
                    key={page} 
                    onClick={() => handlePageClick(page)} 
                    className={`px-4 py-2 border rounded-lg ${ currentPage === page ? "bg-blue-600 text-white" : "bg-white hover:bg-gray-100" }`} 
                > 
                    {page} 
                </button> 
            ))} 
            <button 
                type="button" 
                onClick={handleNext} 
                disabled={currentPage === totalPages} 
                className="px-4 py-2 border rounded-lg bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed" 
            > 
                Next 
            </button>
        </div>
    );
};

export default Pagination;