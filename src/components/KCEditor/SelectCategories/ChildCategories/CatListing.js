import CatItem from "./CatItem";

const CatListing = (props) => {
    const {childCategories} = props
    return (
        <div className="grid xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4">
            {childCategories && childCategories.length > 0 && childCategories.map((cat, index) => (
                <CatItem key={index} category={cat} />
            ))}
        </div>
    )
}

export default CatListing