import React, { useEffect } from 'react'
import PerfectScrollbar from 'react-perfect-scrollbar';
import { RiCheckboxBlankCircleFill } from "react-icons/ri";
import { MdRectangle } from "react-icons/md";
import { FaArrowDown, FaArrowLeft, FaArrowRight, FaArrowUp, FaHeart, FaSquareFull } from "react-icons/fa";
import { FiArrowDownRight } from "react-icons/fi";
import { FaGripLines } from "react-icons/fa";
import { useDispatch } from 'react-redux';
import { AddElement } from '../../../../store/actions/createContent';
import { uniqueId } from 'lodash';
import { IoTriangleSharp } from "react-icons/io5";
import { MdHexagon } from "react-icons/md";
import { FaStar } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";

const ClipPath = ({ editor, canvas, fabric }) => {
    const dispatch = useDispatch()
    const addCircel = () => {
        const id = uniqueId()

        const circle = new fabric.Circle({
            radius: 100,
            fill: '#000000',
            left: 200,
            top: 150,
            customId: id,
            iType: 'circle'

        });
        editor.canvas.add(circle);
        dispatch(AddElement(circle))

    }
    const addRectangle = () => {
        const id = uniqueId()

        const rectangle = new fabric.Rect({
            width: 175,
            height: 150,
            fill: '#000000',
            left: 300,
            top: 100,
            customId: id,
            iType: 'rectangle'

        });
        editor.canvas.add(rectangle);
        dispatch(AddElement(rectangle))

    }
    const addSquare = () => {
        const id = uniqueId()

        const square = new fabric.Rect({
            width: 175,
            height: 175,
            fill: '#000000',
            left: 300,
            top: 100,
            customId: id,
            iType: 'square'


        });
        editor.canvas.add(square);
        dispatch(AddElement(square))

    }
    function drawArrow(canvas, fromx, fromy, tox, toy) {
        var angle = Math.atan2(toy - fromy, tox - fromx);

        var headlen = 15; // arrow head size

        // bring the line end back some to account for arrow head.
        tox = tox - headlen * Math.cos(angle);
        toy = toy - headlen * Math.sin(angle);

        // calculate the points.
        var points = [
            {
                x: fromx, // start point
                y: fromy
            },
            {
                x: fromx - (headlen / 4) * Math.cos(angle - Math.PI / 2),
                y: fromy - (headlen / 4) * Math.sin(angle - Math.PI / 2)
            },
            {
                x: tox - (headlen / 4) * Math.cos(angle - Math.PI / 2),
                y: toy - (headlen / 4) * Math.sin(angle - Math.PI / 2)
            },
            {
                x: tox - headlen * Math.cos(angle - Math.PI / 2),
                y: toy - headlen * Math.sin(angle - Math.PI / 2)
            },
            {
                x: tox + headlen * Math.cos(angle), // tip
                y: toy + headlen * Math.sin(angle)
            },
            {
                x: tox - headlen * Math.cos(angle + Math.PI / 2),
                y: toy - headlen * Math.sin(angle + Math.PI / 2)
            },
            {
                x: tox - (headlen / 4) * Math.cos(angle + Math.PI / 2),
                y: toy - (headlen / 4) * Math.sin(angle + Math.PI / 2)
            },
            {
                x: fromx - (headlen / 4) * Math.cos(angle + Math.PI / 2),
                y: fromy - (headlen / 4) * Math.sin(angle + Math.PI / 2)
            },
            {
                x: fromx,
                y: fromy
            }
        ];
        const id = uniqueId()

        var pline = new fabric.Polyline(points, {
            fill: ' #000000',
            opacity: 1,
            with: 5,
            originX: "right",
            originY: "bottom",
            selectable: true,
            customId: id,
            iType: 'arrow'

        });

        canvas.add(pline);
        dispatch(AddElement(pline))


        canvas.renderAll();
    }
    const addArrow = () => {
        drawArrow(editor.canvas, 100, 100, 150, 150);
    }
    const addLine = () => {
        const id = uniqueId()

        const line = new fabric.Line([50, 50, 200, 200], {

            stroke: "#000000",
            strokeWidth: 5,
            selectable: true,
            customId: id,
            iType: 'line'

        });
        editor.canvas.add(line);
        dispatch(AddElement(line))
        editor.canvas.renderAll();
    }
    const addTriangle = () => {
        const triangle = new fabric.Triangle({
            width: 100,
            height: 100,
            fill: 'blue',
            left: 50,
            top: 50,
            fill: "#000000"
        });

        editor.canvas.add(triangle);
        dispatch(AddElement(triangle))
        editor.canvas.renderAll();
    }
    const addHexagon = () => {
        // Define the coordinates of the hexagon's vertices
        const hexagonVertices = [
            { x: 100, y: 50 },
            { x: 150, y: 25 },
            { x: 200, y: 50 },
            { x: 200, y: 100 },
            { x: 150, y: 125 },
            { x: 100, y: 100 },
        ];

        // Create a hexagon using the fabric.Polygon class
        const hexagon = new fabric.Polygon(hexagonVertices, {
            fill: '#000000',
            left: 50,
            top: 50,
        });
        editor.canvas.add(hexagon);
        dispatch(AddElement(hexagon))
        editor.canvas.renderAll();
    }
    const addStar = () => {
        const starPoints = [
            { x: 0, y: -50 },
            { x: 14, y: -14 },
            { x: 50, y: 0 },
            { x: 14, y: 14 },
            { x: 0, y: 50 },
            { x: -14, y: 14 },
            { x: -50, y: 0 },
            { x: -14, y: -14 },
        ];
        // Create a star as a polygon
        const star = new fabric.Polygon(starPoints, {
            left: 100,
            top: 100,
            fill: 'yellow',
            stroke: '#000000',
            strokeWidth: 2,
            originX: 'center',
            originY: 'center',
        });

        // Add the star to the canvas
        editor.canvas.add(star);

    }
    const addPlus = () => {
        // Create a horizontal rectangle for the plus sign
        const horizontalRect = new fabric.Rect({
            left: 100,
            top: 100,
            width: 50,
            height: 10,
            fill: '#000000',
            originX: 'center',
            originY: 'center',
        });

        // Create a vertical rectangle for the plus sign
        const verticalRect = new fabric.Rect({
            left: 100,
            top: 100,
            width: 10,
            height: 50,
            fill: '#000000',
            originX: 'center',
            originY: 'center',
        });

        // Add the rectangles to the canvas
        editor.canvas.add(horizontalRect, verticalRect);
    }
    const addHeart = () => {

        // Define the SVG path data for a heart
        const heartPathData = 'M 300 75 Q 400 75, 450 150 Q 500 225, 400 300 Q 300 375, 200 300 Q 100 225, 150 150 Q 200 75, 300 75 Z';

        // Create a heart shape using fabric.Path
        const heart = new fabric.Path(heartPathData, {
            left: 100,
            top: 100,
            fill: 'red',
            originX: 'center',
            originY: 'center',
        });
        editor.canvas.add(heart)
    }
    const addArrowUp = () => {
        // Set arrow properties
        const arrowOptions = {
            fill: '#000000',
            stroke: '#000000',
            strokeWidth: 2
        };

        // Create the arrow
        const arrow = new fabric.Path('M50 70 L100 20 L150 70 L125 70 L125 130 L75 130 L75 70 L50 70 Z');
        arrow.set(arrowOptions);

        // Add the arrow to the canvas
        editor.canvas.add(arrow);
    }
    const addArrowDown = () => {
        // Define the SVG path data for an arrow pointing down
        const arrowPathData = 'M50 70 L100 20 L150 70 L125 70 L125 130 L75 130 L75 70 L50 70 Z';

        // Create an arrow shape using fabric.Path
        const arrow = new fabric.Path(arrowPathData, {
            left: 100,
            top: 100,
            fill: '#000000',
            originX: 'center',
            originY: 'center',
        });

        // Rotate the arrow to point down
        arrow.set('angle', 180);

        // Add the arrow to the canvas
        editor.canvas.add(arrow);
    }
    const addArrowLeft = () => {
        // Define the SVG path data for an arrow pointing down
        const arrowPathData = 'M50 70 L100 20 L150 70 L125 70 L125 130 L75 130 L75 70 L50 70 Z';

        // Create an arrow shape using fabric.Path
        const arrow = new fabric.Path(arrowPathData, {
            left: 100,
            top: 100,
            fill: '#000000',
            originX: 'center',
            originY: 'center',
        });

        // Rotate the arrow to point down
        arrow.set('angle', -90);

        // Add the arrow to the canvas
        editor.canvas.add(arrow);
    }
    const addArrowRight = () => {
        // Define the SVG path data for an arrow pointing down
        const arrowPathData = 'M50 70 L100 20 L150 70 L125 70 L125 130 L75 130 L75 70 L50 70 Z';

        // Create an arrow shape using fabric.Path
        const arrow = new fabric.Path(arrowPathData, {
            left: 100,
            top: 100,
            fill: '#000000',
            originX: 'center',
            originY: 'center',
        });

        // Rotate the arrow to point down
        arrow.set('angle', 90);

        // Add the arrow to the canvas
        editor.canvas.add(arrow);
    }

    return (
        <div>
            <PerfectScrollbar
                className="flex flex-wrap mt-3"
                style={{ maxHeight: '70vh' }}
            >
                <div className={`w-1/2 flex flex-col mb-5 items-center h-20 justify-center cursor-pointer hover:bg-gray-800 rounded-md duration-200 ease-out py-2`} onClick={addCircel}>
                    <RiCheckboxBlankCircleFill size={50} />
                </div>
                <div className={`w-1/2 flex flex-col mb-5 items-center h-20 justify-center cursor-pointer hover:bg-gray-800 rounded-md duration-200 ease-out py-2`} onClick={addRectangle}>
                    <MdRectangle size={50} />
                </div>
                <div className={`w-1/2 flex flex-col mb-5 items-center h-20 justify-center cursor-pointer hover:bg-gray-800 rounded-md duration-200 ease-out py-2`} onClick={addSquare}>
                    <FaSquareFull size={50} />
                </div>
                <div className={`w-1/2 flex flex-col mb-5 items-center h-20 justify-center cursor-pointer hover:bg-gray-800 rounded-md duration-200 ease-out py-2`} onClick={addArrow}>
                    <FiArrowDownRight size={50} />
                </div>
                <div className={`w-1/2 flex flex-col mb-5 items-center h-20 justify-center cursor-pointer hover:bg-gray-800 rounded-md duration-200 ease-out py-2`} onClick={addLine}>
                    <FaGripLines size={50} />
                </div>
                <div className={`w-1/2 flex flex-col mb-5 items-center h-20 justify-center cursor-pointer hover:bg-gray-800 rounded-md duration-200 ease-out py-2`} onClick={addTriangle}>
                    <IoTriangleSharp size={50} />
                </div>
                <div className={`w-1/2 flex flex-col mb-5 items-center h-20 justify-center cursor-pointer hover:bg-gray-800 rounded-md duration-200 ease-out py-2`} onClick={addHexagon}>
                    <MdHexagon size={50} />
                </div>
                <div className={`w-1/2 flex flex-col mb-5 items-center h-20 justify-center cursor-pointer hover:bg-gray-800 rounded-md duration-200 ease-out py-2`} onClick={addStar}>
                    <FaStar size={50} />
                </div>
                <div className={`w-1/2 flex flex-col mb-5 items-center h-20 justify-center cursor-pointer hover:bg-gray-800 rounded-md duration-200 ease-out py-2`} onClick={addPlus}>
                    <FaPlus size={50} />
                </div>
                <div className={`w-1/2 flex flex-col mb-5 items-center h-20 justify-center cursor-pointer hover:bg-gray-800 rounded-md duration-200 ease-out py-2`} onClick={addArrowUp}>
                    <FaArrowUp size={50} />
                </div>
                <div className={`w-1/2 flex flex-col mb-5 items-center h-20 justify-center cursor-pointer hover:bg-gray-800 rounded-md duration-200 ease-out py-2`} onClick={addArrowDown}>
                    <FaArrowDown size={50} />
                </div>
                <div className={`w-1/2 flex flex-col mb-5 items-center h-20 justify-center cursor-pointer hover:bg-gray-800 rounded-md duration-200 ease-out py-2`} onClick={addArrowLeft}>
                    <FaArrowLeft size={50} />
                </div>
                <div className={`w-1/2 flex flex-col mb-5 items-center h-20 justify-center cursor-pointer hover:bg-gray-800 rounded-md duration-200 ease-out py-2`} onClick={addArrowRight}>
                    <FaArrowRight size={50} />
                </div>
            </PerfectScrollbar>

        </div>
    )
}

export default ClipPath