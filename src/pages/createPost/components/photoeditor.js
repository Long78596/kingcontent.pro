import { fabric } from 'fabric';

import { FabricJSCanvas, useFabricJSCanvas } from 'fabricjs-react';

import { saveAs } from 'file-saver';
import React, { useEffect,  useState } from 'react';
import { BsFillCircleFill } from 'react-icons/bs';
import { CgTemplate } from 'react-icons/cg';
import { CiText } from 'react-icons/ci';
import { FaFileDownload } from 'react-icons/fa';
import { Tooltip } from 'primereact/tooltip';
import { MdOutlineKeyboardDoubleArrowLeft } from 'react-icons/md';
import { MdDraw, MdInsertEmoticon } from 'react-icons/md';
import { RiImageAddLine } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import {
  KEY_EDITOR_IMAGE,
  KEY_ELEMENTS_IMAGES,
  KEY_INDEX_IMAGE_SELECT,
} from '../../../reducers/createContent';
import { REDUX_NAME_CREATE_POST } from '../../../utils/utilityFunc';

import { MdOutlinePhotoSizeSelectSmall } from 'react-icons/md';
import {
  CLIP_PATH,
  DOWNLOAD,
  DRAW,
  ICON,
  DESIGNS,
  LAYER,
  SIZE,
  TEMPLATE,
  TEXT_TOOL,
  IMAGE,
  _dashed_border,
  base64ToFile,
  customIconRotation,
  safeSvgEncode,
  ImgCursorRotation,
} from '../utility';

import { uniqueId } from 'lodash';
import { confirmAlert } from 'react-confirm-alert';
import { RiCursorFill } from 'react-icons/ri';
import { toast } from 'react-toastify';
import WebFont from 'webfontloader';
import { ResourcesService } from '../../../services/resources';
import {
  AddElement,
  DeleteElement,
  ResetCanvasLayer,
  updateProps,
} from '../../../store/actions/createContent';
import ClipPath from './tools/clipPath';
import Draw from './tools/draw';
import Elements from './tools/elements';
import Icon from './tools/icon';
import Images from './tools/images';
import Size from './tools/size';
import Template from './tools/template';
import Text from './tools/text';
import ToolBarBottom from './tools/toolBarBottom';
import ToolBarTopRightButton from './tools/toolBarTopRightButton';
import TopBarTool from './tools/topBarTool';
import Download from './tools/download';
import { OK } from '../../../configs';
// height: ${(p) => p.height && `${p.height}px`};
const EditorP = styled(FabricJSCanvas)`
  overflow: hidden;
  max-width: 980px;
  background-color: ${(p) => p.backgroundColor};
  height: ${(p) => p.height && `${p.height}px`};
  width: ${(p) => p.width && `${p.width}px`};
  max-height: 100%;
  max-width: 100%;
  border-radius: 10px;
  display: block;
  /* position: absolute; */
`;
const CanvasContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;
const PhotoEditor = ({
  setIsEditor,
  images,
  setImages,
  isRightImage = false,
}) => {
  const dispatch = useDispatch();
  const [isSaveImage, setIsSaveImage] = useState(false);
  const [layerStatus, setLayerStatus] = useState(false);
  const [canvasWidth, setCanvasWidth] = useState(1300);
  const [canvasHeight, setCanvasHeight] = useState(500);
  const [showSecondTool, setShowSecondTool] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [allFonts, setAllFonts] = useState([]);
  const [googleFonts, setGoogleFonts] = useState([]);
  const [toolSelect, setToolSelect] = useState('CURSOR');
  const state = {
    lastAngleRotation: null,
  };
  const {
    [KEY_EDITOR_IMAGE]: initalImage,
    [KEY_INDEX_IMAGE_SELECT]: indexImageSelect,
    [KEY_ELEMENTS_IMAGES]: elements,
  } = useSelector((state) => state[REDUX_NAME_CREATE_POST]);
  const { editor, onReady } = useFabricJSCanvas();
  const [toggle, setToggle] = useState(0);

  var canvas = (window._canvas = new fabric.Canvas('c'));
  function initAligningGuidelines(canvas) {
    var ctx = canvas.getSelectionContext(),
      aligningLineOffset = 5,
      aligningLineMargin = 4,
      aligningLineWidth = 1,
      aligningLineColor = 'rgb(0,255,0)',
      viewportTransform,
      zoom = 1;

    function drawVerticalLine(coords) {
      drawLine(
        coords.x + 0.5,
        coords.y1 > coords.y2 ? coords.y2 : coords.y1,
        coords.x + 0.5,
        coords.y2 > coords.y1 ? coords.y2 : coords.y1
      );
    }

    function drawHorizontalLine(coords) {
      drawLine(
        coords.x1 > coords.x2 ? coords.x2 : coords.x1,
        coords.y + 0.5,
        coords.x2 > coords.x1 ? coords.x2 : coords.x1,
        coords.y + 0.5
      );
    }

    function drawLine(x1, y1, x2, y2) {
      ctx.save();
      ctx.lineWidth = aligningLineWidth;
      ctx.strokeStyle = aligningLineColor;
      ctx.beginPath();
      ctx.moveTo(
        (x1 + viewportTransform[4]) * zoom,
        (y1 + viewportTransform[5]) * zoom
      );
      ctx.lineTo(
        (x2 + viewportTransform[4]) * zoom,
        (y2 + viewportTransform[5]) * zoom
      );
      ctx.stroke();
      ctx.restore();
    }

    function isInRange(value1, value2) {
      value1 = Math.round(value1);
      value2 = Math.round(value2);
      for (
        var i = value1 - aligningLineMargin, len = value1 + aligningLineMargin;
        i <= len;
        i++
      ) {
        if (i === value2) {
          return true;
        }
      }
      return false;
    }

    var verticalLines = [],
      horizontalLines = [];

    canvas.on('mouse:down', function () {
      viewportTransform = canvas.viewportTransform;
      zoom = canvas.getZoom();
    });

    canvas.on('object:moving', function (e) {
      var activeObject = e.target,
        canvasObjects = canvas.getObjects(),
        activeObjectCenter = activeObject.getCenterPoint(),
        activeObjectLeft = activeObjectCenter.x,
        activeObjectTop = activeObjectCenter.y,
        activeObjectBoundingRect = activeObject.getBoundingRect(),
        activeObjectHeight =
          activeObjectBoundingRect.height / viewportTransform[3],
        activeObjectWidth =
          activeObjectBoundingRect.width / viewportTransform[0],
        horizontalInTheRange = false,
        verticalInTheRange = false,
        transform = canvas._currentTransform;

      if (!transform) return;

      // It should be trivial to DRY this up by encapsulating (repeating) creation of x1, x2, y1, and y2 into functions,
      // but we're not doing it here for perf. reasons -- as this a function that's invoked on every mouse move

      for (var i = canvasObjects.length; i--; ) {
        if (canvasObjects[i] === activeObject) continue;

        var objectCenter = canvasObjects[i].getCenterPoint(),
          objectLeft = objectCenter.x,
          objectTop = objectCenter.y,
          objectBoundingRect = canvasObjects[i].getBoundingRect(),
          objectHeight = objectBoundingRect.height / viewportTransform[3],
          objectWidth = objectBoundingRect.width / viewportTransform[0];

        // snap by the horizontal center line
        if (isInRange(objectLeft, activeObjectLeft)) {
          verticalInTheRange = true;
          verticalLines.push({
            x: objectLeft,
            y1:
              objectTop < activeObjectTop
                ? objectTop - objectHeight / 2 - aligningLineOffset
                : objectTop + objectHeight / 2 + aligningLineOffset,
            y2:
              activeObjectTop > objectTop
                ? activeObjectTop + activeObjectHeight / 2 + aligningLineOffset
                : activeObjectTop - activeObjectHeight / 2 - aligningLineOffset,
          });
          activeObject.setPositionByOrigin(
            new fabric.Point(objectLeft, activeObjectTop),
            'center',
            'center'
          );
        }

        // snap by the left edge
        if (
          isInRange(
            objectLeft - objectWidth / 2,
            activeObjectLeft - activeObjectWidth / 2
          )
        ) {
          verticalInTheRange = true;
          verticalLines.push({
            x: objectLeft - objectWidth / 2,
            y1:
              objectTop < activeObjectTop
                ? objectTop - objectHeight / 2 - aligningLineOffset
                : objectTop + objectHeight / 2 + aligningLineOffset,
            y2:
              activeObjectTop > objectTop
                ? activeObjectTop + activeObjectHeight / 2 + aligningLineOffset
                : activeObjectTop - activeObjectHeight / 2 - aligningLineOffset,
          });
          activeObject.setPositionByOrigin(
            new fabric.Point(
              objectLeft - objectWidth / 2 + activeObjectWidth / 2,
              activeObjectTop
            ),
            'center',
            'center'
          );
        }

        // snap by the right edge
        if (
          isInRange(
            objectLeft + objectWidth / 2,
            activeObjectLeft + activeObjectWidth / 2
          )
        ) {
          verticalInTheRange = true;
          verticalLines.push({
            x: objectLeft + objectWidth / 2,
            y1:
              objectTop < activeObjectTop
                ? objectTop - objectHeight / 2 - aligningLineOffset
                : objectTop + objectHeight / 2 + aligningLineOffset,
            y2:
              activeObjectTop > objectTop
                ? activeObjectTop + activeObjectHeight / 2 + aligningLineOffset
                : activeObjectTop - activeObjectHeight / 2 - aligningLineOffset,
          });
          activeObject.setPositionByOrigin(
            new fabric.Point(
              objectLeft + objectWidth / 2 - activeObjectWidth / 2,
              activeObjectTop
            ),
            'center',
            'center'
          );
        }

        // snap by the vertical center line
        if (isInRange(objectTop, activeObjectTop)) {
          horizontalInTheRange = true;
          horizontalLines.push({
            y: objectTop,
            x1:
              objectLeft < activeObjectLeft
                ? objectLeft - objectWidth / 2 - aligningLineOffset
                : objectLeft + objectWidth / 2 + aligningLineOffset,
            x2:
              activeObjectLeft > objectLeft
                ? activeObjectLeft + activeObjectWidth / 2 + aligningLineOffset
                : activeObjectLeft - activeObjectWidth / 2 - aligningLineOffset,
          });
          activeObject.setPositionByOrigin(
            new fabric.Point(activeObjectLeft, objectTop),
            'center',
            'center'
          );
        }

        // snap by the top edge
        if (
          isInRange(
            objectTop - objectHeight / 2,
            activeObjectTop - activeObjectHeight / 2
          )
        ) {
          horizontalInTheRange = true;
          horizontalLines.push({
            y: objectTop - objectHeight / 2,
            x1:
              objectLeft < activeObjectLeft
                ? objectLeft - objectWidth / 2 - aligningLineOffset
                : objectLeft + objectWidth / 2 + aligningLineOffset,
            x2:
              activeObjectLeft > objectLeft
                ? activeObjectLeft + activeObjectWidth / 2 + aligningLineOffset
                : activeObjectLeft - activeObjectWidth / 2 - aligningLineOffset,
          });
          activeObject.setPositionByOrigin(
            new fabric.Point(
              activeObjectLeft,
              objectTop - objectHeight / 2 + activeObjectHeight / 2
            ),
            'center',
            'center'
          );
        }

        // snap by the bottom edge
        if (
          isInRange(
            objectTop + objectHeight / 2,
            activeObjectTop + activeObjectHeight / 2
          )
        ) {
          horizontalInTheRange = true;
          horizontalLines.push({
            y: objectTop + objectHeight / 2,
            x1:
              objectLeft < activeObjectLeft
                ? objectLeft - objectWidth / 2 - aligningLineOffset
                : objectLeft + objectWidth / 2 + aligningLineOffset,
            x2:
              activeObjectLeft > objectLeft
                ? activeObjectLeft + activeObjectWidth / 2 + aligningLineOffset
                : activeObjectLeft - activeObjectWidth / 2 - aligningLineOffset,
          });
          activeObject.setPositionByOrigin(
            new fabric.Point(
              activeObjectLeft,
              objectTop + objectHeight / 2 - activeObjectHeight / 2
            ),
            'center',
            'center'
          );
        }
      }

      if (!horizontalInTheRange) {
        horizontalLines.length = 0;
      }

      if (!verticalInTheRange) {
        verticalLines.length = 0;
      }
    });

    canvas.on('before:render', function () {
      canvas.clearContext(canvas.contextTop);
    });

    canvas.on('after:render', function () {
      for (var i = verticalLines.length; i--; ) {
        drawVerticalLine(verticalLines[i]);
      }
      for (var i = horizontalLines.length; i--; ) {
        drawHorizontalLine(horizontalLines[i]);
      }

      verticalLines.length = horizontalLines.length = 0;
    });

    canvas.on('mouse:up', function () {
      verticalLines.length = horizontalLines.length = 0;
      canvas.renderAll();
    });
  }

  function initCenteringGuidelines(canvas) {
    var canvasWidth = canvas.getWidth(),
      canvasHeight = canvas.getHeight(),
      canvasWidthCenter = canvasWidth / 2,
      canvasHeightCenter = canvasHeight / 2,
      canvasWidthCenterMap = {},
      canvasHeightCenterMap = {},
      centerLineMargin = 4,
      centerLineColor = 'red',
      centerLineWidth = 1,
      ctx = canvas.getSelectionContext(),
      viewportTransform;

    for (
      var i = canvasWidthCenter - centerLineMargin,
        len = canvasWidthCenter + centerLineMargin;
      i <= len;
      i++
    ) {
      canvasWidthCenterMap[Math.round(i)] = true;
    }
    for (
      var i = canvasHeightCenter - centerLineMargin,
        len = canvasHeightCenter + centerLineMargin;
      i <= len;
      i++
    ) {
      canvasHeightCenterMap[Math.round(i)] = true;
    }

    function showVerticalCenterLine() {
      showCenterLine(
        canvasWidthCenter + 0.5,
        0,
        canvasWidthCenter + 0.5,
        canvasHeight
      );
    }

    function showHorizontalCenterLine() {
      showCenterLine(
        0,
        canvasHeightCenter + 0.5,
        canvasWidth,
        canvasHeightCenter + 0.5
      );
    }
    function showCenterLine(x1, y1, x2, y2) {
      ctx.save();
      ctx.strokeStyle = centerLineColor;
      ctx.lineWidth = centerLineWidth;
      ctx.beginPath();
      ctx.moveTo(x1 * viewportTransform[0], y1 * viewportTransform[3]);
      ctx.lineTo(x2 * viewportTransform[0], y2 * viewportTransform[3]);
      ctx.stroke();
      ctx.restore();
    }

    var afterRenderActions = [],
      isInVerticalCenter,
      isInHorizontalCenter;

    canvas.on('mouse:down', function () {
      viewportTransform = canvas.viewportTransform;
    });

    canvas.on('object:moving', function (e) {
      var object = e.target,
        objectCenter = object.getCenterPoint(),
        transform = canvas._currentTransform;

      if (!transform) return;

      // (isInVerticalCenter = Math.round(objectCenter.x) in canvasWidthCenterMap),
      //   (isInHorizontalCenter =
      //     Math.round(objectCenter.y) in canvasHeightCenterMap);

      if (isInHorizontalCenter || isInVerticalCenter) {
        object.setPositionByOrigin(
          new fabric.Point(
            isInVerticalCenter ? canvasWidthCenter : objectCenter.x,
            isInHorizontalCenter ? canvasHeightCenter : objectCenter.y
          ),
          'center',
          'center'
        );
      }
    });

    canvas.on('before:render', function () {
      canvas.clearContext(canvas.contextTop);
    });

    canvas.on('after:render', function () {
      if (isInVerticalCenter) {
        showVerticalCenterLine();
      }
      if (isInHorizontalCenter) {
        showHorizontalCenterLine();
      }
    });

    canvas.on('mouse:up', function () {
      // clear these values, to stop drawing guidelines once mouse is up
      isInVerticalCenter = isInHorizontalCenter = null;
      canvas.renderAll();
    });
  }
  initCenteringGuidelines(canvas);
  initAligningGuidelines(canvas);

  function mouseRotateIcon(angle) {
    const relativeAngle = angle - 90;
    const pos = {
        '-90': '9.25 5.25',
        '-75': '9.972 3.863',
        '-60': '10.84 1.756',
        '-45': '11.972 -1.716',
        '-30': '18.83 0.17',
        '-15': '28.49 -9.49',
        15: '-7.985 46.77',
        30: '-0.415 27.57',
        45: '2.32 21.713',
        60: '3.916 18.243',
        75: '4.762 16.135',
        90: '5.25 14.75',
        105: '5.84 13.617',
        120: '6.084 12.666',
        135: '6.317 12.01',
        150: '6.754 11.325',
        165: '7.06 10.653',
        180: '7.25 10',
        195: '7.597 9.43',
        210: '7.825 8.672',
        225: '7.974 7.99',
        240: '8.383 7.332',
        255: '8.83 6.441',
      },
      defaultPos = '7.25 10';
    const transform =
      relativeAngle === 0
        ? 'translate(9.5 3.5)'
        : `rotate(${relativeAngle} ${pos[relativeAngle] || defaultPos})`;
    
    try {
      const svgString = ImgCursorRotation(transform);
      const imgCursor = safeSvgEncode(svgString);
      return `url("data:image/svg+xml;charset=utf-8,${imgCursor}") 12 12, crosshair`;
    } catch (error) {
      return 'crosshair';
    }
  }

  function treatAngle(angle) {
    return angle - (angle % 15);
  }

  // Custom icon control
  let rotateIcon;
  try {
    const svgRotateIcon = safeSvgEncode(customIconRotation);
    rotateIcon = `data:image/svg+xml;utf8,${svgRotateIcon}`;
  } catch (error) {
    // Fallback to simple rotate icon
    const fallbackSvg = '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="9" cy="9" r="8" fill="white" stroke="black"/><text x="9" y="9" text-anchor="middle" dy="0.3em" font-size="10">R</text></svg>';
    rotateIcon = `data:image/svg+xml;utf8,${safeSvgEncode(fallbackSvg)}`;
  }
  const imgIcon = document.createElement('img');
  imgIcon.src = rotateIcon;

  // Changing rotation control properties
  fabric.Object.prototype.controls.mtr = new fabric.Control({
    x: 0,
    y: -0.5,
    offsetX: 0,
    offsetY: -40,
    // cursorStyleHandler: rotationStyleHandler,
    actionHandler: fabric.controlsUtils.rotationWithSnapping,
    actionName: 'rotate',
    render: renderIcon,
    cornerSize: 38,
    withConnection: true,
  });

  // Defining how the rendering action will be
  function renderIcon(ctx, left, top, styleOverride, fabricObject) {
    var size = this.cornerSize;
    ctx.save();
    ctx.translate(left, top);
    ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
    ctx.drawImage(imgIcon, -size / 2, -size / 2, size, size);
    ctx.restore();
  }

  // Define how the cursor will be
  // function rotationStyleHandler(eventData, control, fabricObject) {
  //   if (fabricObject.lockRotation) {
  //     return NOT_ALLOWED_CURSOR;
  //   }
  //   const angle = treatAngle(fabricObject.angle);
  //   state.lastAngleRotation = angle;
  //   return mouseRotateIcon(angle);
  // }

  canvas.on('object:rotating', function (e) {
    const angle = treatAngle(e.target.angle);
    if (state.lastAngleRotation !== angle) {
      canvas.setCursor(mouseRotateIcon(angle));
      state.lastAngleRotation = angle;
    }
  });
  const onChangeToolStatus = (type) => {
    turnOffDraw();
    setToolSelect(type);
    if (!showSecondTool || type !== 'CURSOR') {
      setShowSecondTool(true);
    }
  };
  const turnOffDraw = () => {
    editor.canvas.isDrawingMode = false;
  };
  const onChangeBackgroundColor = (e) => {
    setBackgroundColor(e.target.value);
    editor.canvas.backgroundImage = null;
    editor.canvas.backgroundColor = `${e.target.value}`;
    editor.canvas.renderAll();
  };
  const removeObject = (i) => {
    // Get the list of active objects
    const activeObjects = editor.canvas.getActiveObjects();
    // Check if there are active objects
    if (activeObjects.length > 0) {
      // Remove the active objects from the canvas
      activeObjects.forEach((object) => {
        editor.canvas.remove(object);
        dispatch(DeleteElement(object.customId));
      });
      // Clear the selection
      editor.canvas.discardActiveObject();
      // Render the canvas
      editor.canvas.requestRenderAll();
    }
  };
  const canvasToJson = (i) => {
    setToggle(i);
    editor.canvas.backgroundColor = `${backgroundColor}`;
    const base64image = editor.canvas.toDataURL();
    let blob = new Blob(
      [
        JSON.stringify({
          data: editor.canvas.toJSON(),
          width: canvasWidth,
          height: canvasHeight,
          thunail: base64image,
        }),
      ],
      {
        type: 'application/json',
      }
    );

    saveAs(blob, 'export.json');
  };

  const renderItemForTool = () => {
    switch (toolSelect) {
      case TEMPLATE:
        return (
          <Template
            canvasFromJson={canvasFromJson}
            setCanvasHeight={setCanvasHeight}
            setCanvasWidth={setCanvasWidth}
            editor={editor}
          />
        );
      case 'CURSOR':
        return null;
      case ICON:
        return <Icon editor={editor} setToggle={setToggle} fabric={fabric} />;
      case SIZE:
        return <Size onChangeSizeCanvas={onChangeSizeCanvas} />;
      case IMAGE:
        return (
          <Images
            onUploadImage={onUploadImage}
            fabric={fabric}
            editor={editor}
          />
        );
      case TEXT_TOOL:
        return (
          <Text
            editor={editor}
            allFonts={allFonts}
            setAllFonts={setAllFonts}
            googleFonts={googleFonts}
            setGoogleFonts={setGoogleFonts}
          />
        );
      case DRAW:
        return (
          <Draw
            editor={editor}
            canvas={canvas}
            removeObject={removeObject}
            setLayerStatus={setLayerStatus}
          />
        );
      case CLIP_PATH:
        return (
          <ClipPath
            editor={editor}
            canvas={canvas}
            removeObject={removeObject}
            setLayerStatus={setLayerStatus}
            fabric={fabric}
          />
        );
      case DOWNLOAD:
        return (
          <Download
            editor={editor}
            canvas={canvas}
            fabric={fabric}
            canvasToJson={canvasToJson}
            downloadImage={downloadImage}
          />
        );

      default:
        break;
    }
  };
  const canvasFromJson = (data) => {
    editor.canvas.loadFromJSON(data);
  };
  const resetCanvas = () => {
    confirmAlert({
      title: 'Thông báo',
      message: 'Bạn có chắc chắn muốn tạo mới , dữ liệu cũ sẽ bị mất ?',
      buttons: [
        {
          label: 'Có',
          onClick: () => {
            if (initalImage) {
              dispatch(
                updateProps([
                  {
                    prop: KEY_EDITOR_IMAGE,
                    value: null,
                  },
                ])
              );
            }
            editor.canvas.clear();
            dispatch(ResetCanvasLayer());
          },
        },
        {
          label: 'Không',
          onClick: () => {},
        },
      ],
    });
  };
  const handleSaveEdit = async () => {
    setIsSaveImage(true);
    const base64Image = editor.canvas.toDataURL({
      format: 'jpg', // You can specify the format ('png', 'jpeg', etc.)
      quality: 1.0, // Image quality (0.0 - 1.0)
    });
    // Do something with the base64Image, such as displaying it or sending it to the server
    const id = uniqueId();
    const filename = `edit_image_${id}.jpg`;
    const mimeType = 'image/jpeg';
    const file = base64ToFile(base64Image, filename, mimeType);
    
    // Validate indexImageSelect
    if (indexImageSelect === null || indexImageSelect === undefined || indexImageSelect >= images.length) {
      toast.error('Không thể xác định ảnh để cập nhật');
      setIsSaveImage(false);
      return;
    }
    
    //if is right image => post image to API
    if (isRightImage) {
      try {
        const formData = new FormData();
        formData.append('files[]', file, file.name);
        const res = await ResourcesService.uploadFile(formData);
        if (res.status === OK) {
          setIsSaveImage(false);
          const _images = [...images];
          _images[indexImageSelect]['url'] = res.data.data[0].url;
          _images[indexImageSelect]['full_url'] = res.data.data[0].url;
          _images[indexImageSelect]['data_url'] = base64Image;
          _images[indexImageSelect]['json_data'] = {
            data: editor.canvas.toJSON(),
            width: canvasWidth,
            height: canvasHeight,
          };
          
          // Update both local state and redux store
          setImages(_images);
          dispatch(
            updateProps([
              {
                prop: 'imageSelect',
                value: _images,
              },
            ])
          );
          
          toast.success('Lưu ảnh thành công!');
          setIsEditor(false);
        }
      } catch (error) {
        setIsSaveImage(false);
        setIsEditor(true);
        toast.error(error.message);
      }
    } else {
      const _images = [...images];
      _images[indexImageSelect]['data_url'] = base64Image;
      _images[indexImageSelect]['file'] = file;
      _images[indexImageSelect]['json_data'] = {
        data: editor.canvas.toJSON(),
        width: canvasWidth,
        height: canvasHeight,
      };
      
      setImages(_images);
      toast.success('Lưu ảnh thành công!');
      setIsSaveImage(false);
      setIsEditor(false);
    }
  };

  const handleAddToEditor = async () => {
    if (!Array.isArray(images)) {
      console.warn("Images không phải là mảng:", images);
      return;
    }
    // save image and add to list images
    setIsSaveImage(true);
    const base64Image = editor.canvas.toDataURL({
      format: 'jpg', // You can specify the format ('png', 'jpeg', etc.)
      quality: 1.0, // Image quality (0.0 - 1.0)
    });
    const id = uniqueId();
    const filename = `edit_image_${id}.jpg`;
    const mimeType = 'image/jpeg';
    const file = base64ToFile(base64Image, filename, mimeType);
    const _images = [...images];
    _images.push({
      url: base64Image,
      data_url: base64Image,
      file: file,
      json_data: {
        data: editor.canvas.toJSON(),
        width: canvasWidth,
        height: canvasHeight,
      },
    });
    setImages(_images);
    dispatch(updateProps([{ prop: 'imageSelect', value: _images }]));
    setIsSaveImage(false);
    setIsEditor(false);
  };

  const onAddBackground = (e) => {
    if (e) {
      const image = e.target.files[0];
      fabric.Image.fromURL(URL.createObjectURL(image), (img) => {
        editor.canvas.setBackgroundImage(img);
        editor.canvas.renderAll();
      });
    }
  };

  const onUploadImage = (e, i) => {
    setToggle(i);
    if (e.target.files[0]) {
      const file = e.target.files[0];
      if (file) {
        // Read the file as a data URL
        const reader = new FileReader();
        reader.onload = function (e) {
          // 'e.target.result' contains the base64-encoded string
          const base64String = e.target.result;
          fabric.Image.fromURL(base64String, (img) => {
            img.scaleToWidth(500); // Adjust the width as needed
            img.scaleToHeight(500); // Adjust the width as needed
            editor.canvas.add(img);
            editor.canvas.sendToBack(img);
            editor.canvas.renderAll();
          });
        };

        reader.readAsDataURL(file);
      }
    }
  };
  const onChangeSizeCanvas = (width, height, type) => {
    if (width) {
      const maxWidth = width; // 80% of screen width
      const newWidth = Math.min(width, maxWidth);
      setCanvasWidth(newWidth);
      editor.canvas.setWidth(newWidth);
    }
    if (height) {
      const maxHeight = height; // 80% of screen height

      const newHeight = Math.min(height, maxHeight);

      setCanvasHeight(newHeight);

      editor.canvas.setHeight(newHeight);
    }
    editor.canvas.renderAll();
  };
  const downloadImage = (i) => {
    setToggle(i);
    editor.canvas.backgroundColor = `${backgroundColor}`;
    const ext = 'jpg';
    const base64 = editor.canvas.toDataURL({
      format: ext,
      enableRetinaScaling: true,
    });
    const link = document.createElement('a');
    link.href = base64;
    link.download = `image_name.${ext}`;
    link.click();
  };
  const changeModeCursor = () => {
    setToolSelect('CURSOR');
    editor.canvas.isDrawingMode = false;
    editor.canvas.discardActiveObject();
    editor.canvas.renderAll();
    setShowSecondTool(false);
  };
  useEffect(() => {
    if (
      window.location.pathname !== '/chinh-sua-anh'
 &&
      initalImage &&
      editor &&
      editor.canvas.getObjects().length === 0
    ) {
      dispatch(
        updateProps([
          {
            prop: KEY_ELEMENTS_IMAGES,
            value: [],
          },
        ])
      );
      if (typeof initalImage === 'object') {
        // get current screen width and height
        const maxWidth = window.innerWidth;
        const maxHeight = window.innerHeight;
        let itemHeight = initalImage.height;
        let itemWidth = initalImage.width;
        // auto resize image
        if (itemHeight > maxHeight || itemWidth > maxWidth) {
          initalImage.scaleToWidth(maxWidth);
          initalImage.scaleToHeight(maxHeight);
          itemHeight = maxHeight;
          itemWidth = maxWidth;
        }
        editor.canvas.setWidth(itemWidth);
        editor.canvas.setHeight(itemHeight);
        const _data = { ...initalImage.data };
        _data['objects'] = initalImage.data.objects.map((_elt) => {
          const id = uniqueId();
          const item = {
            ..._elt,
            customId: id,
          };
          dispatch(AddElement(item));
          return item;
        });
        canvasFromJson(_data);
        canvas.renderAll();
        dispatch(
          updateProps([
            {
              prop: KEY_EDITOR_IMAGE,
              value: null,
            },
          ])
        );
        return;
      } else {
        fabric.Image.fromURL(
          initalImage,
          (img) => {
            const id = uniqueId();
            img.set({
              customId: id,
              imageData: initalImage,
              left: 0,
              top: 0,
            });
            // get current screen width and height
            const maxWidth = window.innerWidth * 0.8;
            const maxHeight = window.innerHeight * 0.8;
            let itemHeight = img.height;
            let itemWidth = img.width;
            // auto resize image
            if (itemHeight > maxHeight || itemWidth > maxWidth) {
              img.scaleToHeight(maxHeight);
              img.scaleToWidth(maxWidth);
              itemHeight = maxHeight;
              itemWidth = maxWidth;
            }
            if (editor.canvas.isEmpty()) {
              setCanvasHeight(itemHeight);
              setCanvasWidth(itemWidth);
              editor.canvas.setWidth(itemWidth);
              editor.canvas.setHeight(itemHeight);
              editor.canvas.add(img);
              // Add the image to the canvas
              dispatch(AddElement(img));
              canvas.renderAll();
            }
          },
          { crossOrigin: 'anonymous' }
        );
      }
    }
  }, [initalImage, editor]);

  useEffect(() => {
    if (editor && toolSelect !== DRAW) {
      editor.canvas.isDrawingMode = false;
    }
    if (editor) {
    }
  }, [toolSelect]);

  useEffect(() => {
    const fetchGoogleFonts = async () => {
      try {
        const response = await fetch(
          'https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyCsZ8WMHQLP4rH-Mv0RKzz6I9v7reBfOLo'
        );
        const data = await response.json();

        if (data.items) {
          setAllFonts(data.items.map((font) => font.family));
          setGoogleFonts(data.items.slice(0, 10).map((font) => font.family));
        }
      } catch (error) {
        // Error fetching Google Fonts
      }
    };
    fetchGoogleFonts();
  }, []);

  useEffect(() => {
    if (googleFonts.length === 0) return;
    WebFont.load({
      google: {
        families: googleFonts.map((font) => `${font}:400,700`),
      },
      active: () => {
        // Create a fabric.js canvas after the fonts have been loaded
        const canvas = new fabric.Canvas('myCanvas', {
          width: 400,
          height: 200,
        });
        // Set the default font family for the entire canvas
        canvas.defaultFontFamily = googleFonts[0];
        canvas.renderAll();
      },
    });
  }, [googleFonts]);
  return (
    <div className="flex bg-white rounded-lg P-1 mb-5 absolute left-0 top-0 w-full z-9999">
      <div className="menu w-1/10 bg-gray-700 text-white px-3 py-3 border-r-2 border-white">
        <div className="list">
          <Tooltip target=".cursor-tool">
            <span>Con trỏ</span>
          </Tooltip>
          <div
            onClick={changeModeCursor}
            className={`${
              toolSelect === 'CURSOR' && 'bg-indigo-600'
            } cursor-tool flex justify-center cursor-pointer mb-5 p-1 hover:bg-indigo-600 rounded-md`}
            color="#2d1be4"
            title="Mẫu"
          >
            <RiCursorFill color="#fff" size={35} />
          </div>
          <Tooltip target=".template-tool">
            <span>Mẫu tạo sẵn</span>
          </Tooltip>
          <div
            onClick={() => {
              onChangeToolStatus(TEMPLATE);
            }}
            className={`${
              toolSelect === TEMPLATE && 'bg-indigo-600'
            } template-tool flex justify-center cursor-pointer mb-5 p-1 hover:bg-indigo-600 rounded-md hidden`}
            color="#2d1be4"
            title="Mẫu"
          >
            <CgTemplate color="#fff" size={35} />
          </div>
          <Tooltip target=".text-tool">
            <span>Văn bản</span>
          </Tooltip>
          <div
            onClick={() => {
              onChangeToolStatus(TEXT_TOOL);
              // onAddText1(1)
            }}
            className={`${
              toolSelect === TEXT_TOOL && 'bg-indigo-600'
            } text-tool flex justify-center cursor-pointer mb-5 p-1 hover:bg-indigo-600 rounded-md`}
            color="#2d1be4"
            title="Text"
          >
            <CiText className="" size={35} />
          </div>
          <Tooltip target=".size-tool">
            <span>Kích thước</span>
          </Tooltip>
          <div
            onClick={() => {
              onChangeToolStatus(SIZE);
            }}
            className={`${
              toolSelect === SIZE && 'bg-indigo-600'
            } size-tool flex justify-center cursor-pointer mb-5 p-1 hover:bg-indigo-600 rounded-md`}
            color="#2d1be4"
            title="Kích thước"
          >
            <MdOutlinePhotoSizeSelectSmall size={35} />
          </div>
          <Tooltip target=".icon-tool">
            <span>Icon</span>
          </Tooltip>
          <div
            onClick={() => {
              onChangeToolStatus(ICON);
            }}
            className={`${
              toolSelect === ICON && 'bg-indigo-600'
            } flex icon-tool justify-center cursor-pointer mb-5 p-1 hover:bg-indigo-600 rounded-md`}
            color="#2d1be4"
            title="Icon"
          >
            <MdInsertEmoticon size={35} />
          </div>
          <Tooltip target=".draw-tool">
            <span>Vẽ</span>
          </Tooltip>
          <div
            onClick={() => onChangeToolStatus(DRAW)}
            className={`${
              toolSelect === DRAW && 'bg-indigo-600'
            } draw-tool flex justify-center cursor-pointer mb-5 p-1 hover:bg-indigo-600 rounded-md`}
            color="#2d1be4"
            title="Vẽ"
          >
            <MdDraw size={35} />
          </div>
          <Tooltip target=".image-tool">
            <span>Hình ảnh</span>
          </Tooltip>
          <div
            onClick={() => {
              onChangeToolStatus(IMAGE);
            }}
            className={`${
              toolSelect === DESIGNS && 'bg-indigo-600'
            } image-tool flex justify-center cursor-pointer mb-5 p-1 hover:bg-indigo-600 rounded-md`}
            color="#2d1be4"
            title="Icon"
          >
            <RiImageAddLine size={35} />
          </div>
          <Tooltip target=".path-tool">
            <span>Khối</span>
          </Tooltip>
          <div
            onClick={() => {
              onChangeToolStatus(CLIP_PATH);
            }}
            className={`${
              toolSelect === CLIP_PATH && 'bg-indigo-600'
            } path-tool flex justify-center cursor-pointer mb-5 p-1 hover:bg-indigo-600 rounded-md`}
            color="#2d1be4"
            title="Icon"
          >
            <BsFillCircleFill size={35} />
          </div>
          {editor && editor.canvas.getObjects().length > 0 && (
            <>
              <Tooltip target=".template-download-tool">
                <span>Tải xuống</span>
              </Tooltip>
              <div
                onClick={() => onChangeToolStatus(DOWNLOAD)}
                className={`flex template-download-tool justify-center cursor-pointer mb-5 p-1 hover:bg-indigo-600 rounded-md`}
                color="#2d1be4"
                title="Tải xuống"
              >
                <FaFileDownload size={35} />
              </div>
            </>
          )}
          <div className="flex justify-center">
            <input
              type="color"
              className="w-8 cursor-pointer"
              value={backgroundColor}
              onChange={onChangeBackgroundColor}
            />
          </div>
        </div>
      </div>
      {showSecondTool && (
        <div className="menu w-96 relative bg-gray-700 text-white px-3 overflow-hidden">
          <div className="flex justify-between items-center py-2">
            <h3 className="font-bold text-base text-white">
              {toolSelect === SIZE
                ? 'Thay đổi kích thước'
                : toolSelect === TEMPLATE
                ? 'Mẫu tạo sẵn'
                : toolSelect === TEXT_TOOL
                ? 'Văn bản'
                : toolSelect === DESIGNS
                ? 'Hình ảnh'
                : toolSelect === LAYER
                ? 'Thành phần'
                : toolSelect === DRAW
                ? 'Vẽ'
                : toolSelect === CLIP_PATH
                ? 'Khối'
                : toolSelect === 'CURSOR'
                ? 'Con trỏ'
                : toolSelect === DOWNLOAD
                ? 'Tải xuống'
                : 'Icon'}
            </h3>
            <button
              className="bg-white w-7 h-7 rounded-full flex justify-center items-center hover:bg-red-500 duration-300 ease-linear hover:text-white"
              onClick={() => setShowSecondTool(false)}
            >
              <MdOutlineKeyboardDoubleArrowLeft color="#000" size={20} />
            </button>
          </div>
          <div className={`${_dashed_border} mb-3`}></div>
          {renderItemForTool()}
        </div>
      )}

      <div className="w-full  h-15">
        <div className="bg-white mb-2 p-2 flex items-center justify-between gap-5">
          <TopBarTool
            editor={editor}
            type={toolSelect}
            allFonts={allFonts}
            setLayerStatus={setLayerStatus}
            layerStatus={layerStatus}
          />
          <ToolBarTopRightButton
            editor={editor}
            canvas={canvas}
            removeObject={removeObject}
            setLayerStatus={setLayerStatus}
            layerStatus={layerStatus}
            handleSaveEdit={handleSaveEdit}
            handleAddToEditor={handleAddToEditor}
            resetCanvas={resetCanvas}
            downloadImage={downloadImage}
            backgroundColor={backgroundColor}
            canvasWidth={canvasWidth}
            canvasHeight={canvasHeight}
            canvasFromJson={canvasFromJson}
            setCanvasHeight={setCanvasHeight}
            setCanvasWidth={setCanvasWidth}
            isSaveImage={isSaveImage}
            setIsEditor={setIsEditor}
          />
        </div>
        <div
          style={{ backgroundColor: '#ebecf0' }}
          className="py-5 h-screen overflow-auto"
        >
          <CanvasContainer className="flex justify-center items-center">
            <EditorP
              onReady={onReady}
              width={canvasWidth}
              height={canvasHeight}
              backgroundColor={backgroundColor}
            />
          </CanvasContainer>
          <ToolBarBottom canvas={editor?.canvas} />
        </div>
      </div>
      {layerStatus && (
        <Elements
          editor={editor}
          canvas={canvas}
          removeObject={removeObject}
          setLayerStatus={setLayerStatus}
          backgroundColor={backgroundColor}
          canvasWidth={canvasWidth}
          canvasHeight={canvasHeight}
          canvasFromJson={canvasFromJson}
          setCanvasHeight={setCanvasHeight}
          setCanvasWidth={setCanvasWidth}
        />
      )}
    </div>
  );
};

export default PhotoEditor;
