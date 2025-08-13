import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

const Popular = (props) => {
  const { polularTags } = props;

  return (
    <div className="example-container text-white text-center text-base">
      <span className="inline-block">Tìm kiếm mới nhất: </span>
      <div className="inline-block">
        <ul className="flex ml-2">
          {polularTags &&
            polularTags.length > 0 &&
            polularTags.map((item, index) => {
              const { name, category } = item;
              const { slug } = category;
              return (
                <li className="mr-2" key={index}>
                  <Link to={`/danh-muc/${slug}?keyword=${name}`}>
                    {' '}
                    {name},{' '}
                  </Link>
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    polularTags: state.homepage.polularTags,
  };
};

export default connect(mapStateToProps, {})(Popular);
