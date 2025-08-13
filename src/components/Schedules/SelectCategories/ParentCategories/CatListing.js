import CatItem from './CatItem';

const CatListing = (props) => {
  const { parentCategories } = props;
  return (
    <div className="grid xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4">
      {parentCategories &&
        parentCategories.length > 0 &&
        parentCategories.map((cat, index) => (
          <CatItem key={index} category={cat} />
        ))}
    </div>
  );
};

export default CatListing;
