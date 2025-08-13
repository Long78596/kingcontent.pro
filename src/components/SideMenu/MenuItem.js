import React from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom'

const MenuItem = (props) => {

	const location = useLocation();

	const pathname = location.pathname;

	const Class = (pathname == props.to) ? 'bg-blue-50 text-blue-600 active' : 'hover:bg-gray-50';

	return (
		<li className={'relative block w-64' + Class}>
			<Link {...props} className="flex items-center justify-start flex-row py-2 px-2 hover:bg-blue-100 transform transition-all duration-200 w-64">
				{props.children}
			</Link>
		</li>				
	);

}

export default MenuItem;