import React, { useState } from 'react'
import { Slider } from "primereact/slider";
import { RiFullscreenExitLine, RiFullscreenFill } from 'react-icons/ri';

const ToolBarBottom = ({ canvas }) => {
    const [isFullScreen, setFullScreen] = useState(false);
    const [zoom, setZoom] = useState(50)
    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().then(() => setFullScreen(true));
        } else {
            document.exitFullscreen().then(() => setFullScreen(false));
        }
    };
    const onChangeZoom = (value) => {
        setZoom(value)
        const zoomPercentage = parseInt(value, 10);

        // Calculate zoom factor based on percentage
        const zoomFactor = zoomPercentage / 100;

        // Set canvas zoom
        canvas.setZoom(zoomFactor);
        canvas.renderAll();
    }
    return (
        <div className="flex justify-center gap-3 mt-4">
            <div className='flex items-center gap-3'>
                <span className='font-bold'>{zoom}%</span>
                <Slider value={zoom} onChange={(e) => onChangeZoom(e.value)} className="w-60" max={100} min={10} />
                <span className='font-bold'>100%</span>
            </div>
            <div
                onClick={() => toggleFullScreen()}
                className="item"
                color="#2d1be4"
                title="Phóng to"
            >
                {
                    isFullScreen ? <RiFullscreenExitLine className='cursor-pointer' size="35" />
                        : <RiFullscreenFill className='cursor-pointer' size="35" />
                }

            </div>
        </div>
    )
}

export default ToolBarBottom