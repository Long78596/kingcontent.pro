import {Helmet} from "react-helmet";
import Categories from '../components/Categories';

const CategoriesPage = () => {
	return (
		<>
			<Helmet>
				<title>Danh mục content</title>
			</Helmet>
			<Categories />
		</>
	);
};

export default (CategoriesPage);
