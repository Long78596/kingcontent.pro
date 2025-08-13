import { useEffect, useState } from "react";
import { connect } from "react-redux";

const Charts = (props) => {
    const {charts} = props;
    const [chartImg1, setChartImg1] = useState('')
    const [chartImg2, setChartImg2] = useState('')
    const [chartImg3, setChartImg3] = useState('')

    useEffect(() => {
        if(charts && charts.length > 0){
            const chart = charts[0] || false;
            if(chart){
                setChartImg1(chart.chart_img1)
                setChartImg2(chart.chart_img2)
                setChartImg3(chart.chart_img3)
            }
        }
    }, [charts])

    return (
        <div className="100-don-charts flex w-full gap-1">
            <div className="flex-1">
                <img src={`data:image/jpeg;base64, ${chartImg1}`} />
            </div>
            <div className="flex-1">
                <img src={`data:image/jpeg;base64, ${chartImg2}`} />
            </div>
            <div className="flex-1">
                <img src={`data:image/jpeg;base64, ${chartImg3}`} />
            </div>
        </div>
    )
}


const mapStateToProps = (state) => {
    return {
        charts: state.editor.charts,
    };
};

export default connect(mapStateToProps, null)(Charts);