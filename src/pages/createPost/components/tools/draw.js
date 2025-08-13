import { Slider } from "primereact/slider";
import React, { useEffect, useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
// import MarkerIconUrl from '../../../../assets/images/editor/marker.svg';
// import PenIconUrl from '../../../../assets/images/editor/pen.svg';
// import PencilIconUrl from '../../../../assets/images/editor/pencil.svg';
const Draw = ({ editor }) => {
  const [color, setColor] = useState('#000000')
  const [width, setWidth] = useState(2)
  const [selected, setSelected] = useState(null)
  const onDrawing = () => {
    editor.canvas.freeDrawingBrush.width = width;
    editor.canvas.freeDrawingBrush.color = color;
    editor.canvas.isDrawingMode = true;
  };
  const onChangeColor = (value) => {
    setColor(value)
    onDrawing()
  }
  const onChangeWidth = (value) => {
    setWidth(value)
    onDrawing()
  }
  const onSelectOption = (idx, width, color) => {
    setSelected(idx)
    setWidth(width)
    setColor(color)

  }
  const lists = [
    {
      name: 'Bút',
      // icon: <img src={PenIconUrl} alt="Pen" width="24" height="24" />,
      width: 2,
      color: '#525CEB'
    },
    {
      name: 'Bút chì',
      // icon: <img src={PencilIconUrl} alt="Pencil" width="24" height="24" />,
      width: 3,
      color: '#333333'
    },
    {
      name: 'Bút lông',
      // icon: <img src={MarkerIconUrl} alt="Marker" width="24" height="24" />,
      width: 20,
      color: '#fff000'
    },
  ]
  useEffect(() => {
    onDrawing()
  }, [color, width])

  return (
    <div>
      <div className="flex items-center gap-5">
        <div className="w-1/2">
          <span className='font-bold mb-3'>Chọn màu</span>
          <div className="h-16 flex items-center">
            <input type='color' className='w-full h-10 mt-3 rounded-md' value={color} onChange={(e) => onChangeColor(e.target.value)} />
          </div>
        </div>
        <div className="w-1/2">
          <span className='font-bold'>Kích thước ({width}px)</span>
          <div className="h-16 flex items-center">
            <Slider value={width} onChange={(e) => onChangeWidth(e.value)} className="w-full mt-3" />
          </div>
        </div>
      </div>

      <PerfectScrollbar
        className="flex flex-wrap mt-3"
        style={{ maxHeight: '70vh' }}
      >
        {
          lists.map((_elt, index) => (
            <div className={`w-1/2 flex flex-col mb-5 items-center h-20 justify-center cursor-pointer hover:bg-gray-800 rounded-md duration-200 ease-out py-2 ${selected === index && 'bg-gray-800'}`} onClick={() => onSelectOption(index, _elt.width, _elt.color)} key={index}>
              <div>
                {_elt.icon}
              </div>
              <p className='mt-3 font-bold'>{_elt.name}</p>
            </div>
          ))
        }
      </PerfectScrollbar>
    </div>
  )
}

export default Draw