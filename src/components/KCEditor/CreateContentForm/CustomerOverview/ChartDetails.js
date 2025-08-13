import { connect } from "react-redux";
import PerfectScrollbar from 'react-perfect-scrollbar';

const ChartDetails = (props) => {
    const {chartDetails} = props;
    return (
        <PerfectScrollbar className="p-1 max-h-96 100-don-details mt-2">
            <table className="table-auto bg-white p-2" cellPadding="5">
                <thead>
                    <tr className="p-1 bg-gray-100">
                        <th>Ảnh</th>
                        <th>Tên page</th>
                        <th>Danh mục</th>
                        <th>Lượt thích</th>
                        <th>Được thích</th>
                        <th>Độ hấp dẫn</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        chartDetails.map((item, index) => {
                            const {picture, name, category, likes, interest, affinity} = item
                            return (
                                <tr key={index} className={`${index%2>0 ? 'bg-gray-100':''} p-1`}>
                                    <td dangerouslySetInnerHTML={{__html: picture}}></td>
                                    <td>{name}</td>
                                    <td>{category}</td>
                                    <td>{likes}</td>
                                    <td dangerouslySetInnerHTML={{__html: interest}}></td>
                                    <td>{affinity}</td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </PerfectScrollbar>
    )
}

const mapStateToProps = (state) => {
    return {
        chartDetails: state.editor.chartDetails,
    };
};

export default connect(mapStateToProps, null)(ChartDetails);