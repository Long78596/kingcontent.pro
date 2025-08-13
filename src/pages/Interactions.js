import React from 'react';
import {Helmet} from "react-helmet";
import Interaction from '../components/Interactions';

const Interactions = (props) => {
	return (
		<>
			<Helmet>
				<title>Nhiều tương tác</title>
			</Helmet>
			<Interaction />
		</>
	);
};

export default React.memo(Interactions);
