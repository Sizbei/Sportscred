import React, {useEffect, useRef, useState} from 'react';
import '../styling/BracketView.css';
import TeamBox from './TeamBox';
import PlayOffPrediction from './PlayOffPrediction';

export default function BracketView(props) {
  const { height, width } = useWindowDimensions();

  return (
    <div>
      <Bracket {...props} width={width * 0.85} height={(height - 117.3) * 0.9} />
    </div>
  );
}

// Get window dimensions. Source:
// https://stackoverflow.com/a/36862446
function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}

function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}

function Bracket(props) {
  const canvasRef = useRef(null);
  const onBracketClick = props.onBracketClick;
  const onPredictionClick = props.onPredictionClick;
  const slots = props.slots;
  const predictions = props.predictions;
  const results = props.results;
  const playOffPrediction = props.playOffPrediction;

  // constants
  const color = '#FFFFFF';
  const boxDim = {
    width: props.width / 7,
    height: props.height / 10,
  }
  const minHeightDiff = 10;
  const lineWidth = 1;
  const pairHeight = 2 * boxDim.height + lineWidth;

  // constants regarding connecting lines
  const minTurn = 10;
  const minLineGap = 5;

  // canvas width/height
  const minWidth = 7 * boxDim.width + 6 * (2 * (minTurn + minLineGap) + lineWidth);
  const minHeight = 4 * minHeightDiff + 4 * pairHeight;
  const canvasWidth = Math.max(minWidth, props.width);
  const canvasHeight = Math.max(minHeight, props.height);
  
  const [objects, setObjects] = useState([]);
  const [images, setImages] = useState({});

  const round = (n) => {
    const m = Math.floor(n);
    return m + 0.5;
  }

  // ctx.lineTo and ctx.stroke() will draw a line where the current point is right on the center of the line. 
  // It's easier when we work with the corners of lines, so these functions will be an adapter
  const moveTo = (desx, desy) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.moveTo(round(desx), round(desy));
  }

  const drawLineTo = (desx, desy) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.lineTo(round(desx), round(desy));
    ctx.stroke();
  }

  const drawLine = (srcx, desx, srcy, desy) => {
    if (srcy == desy) { // horizontal
      moveTo(round(srcx), round(srcy + lineWidth));
      drawLineTo(round(desx - lineWidth / 2), round(desy + lineWidth)); // a bandaid fix...
    } else { // vertical
      moveTo(round(srcx), round(srcy + lineWidth));
      drawLineTo(round(desx), round(desy + lineWidth));
    }
  }

  /* Draw the connecting lines for this:
        a--
          |
          -----c
          |
        b--

        minimum distance before the line turns is defined by the variable minTurn
    */
  const drawT = (a, b, c) => {
    // Determine the direction
    if (a.x < c.x) {
      drawLine(a.x, a.x + minTurn, a.y, a.y);
      drawLine(b.x, b.x + minTurn, b.y, b.y);
      drawLine(a.x + minTurn - lineWidth / 2, a.x + minTurn - lineWidth / 2, a.y, b.y);
      drawLine(a.x + minTurn - lineWidth / 2, a.x + minTurn - lineWidth / 2, a.y, c.y);
      drawLine(a.x + minTurn, c.x, c.y, c.y);
    } else {
      drawLine(a.x - minTurn, a.x, a.y, a.y);
      drawLine(b.x - minTurn, b.x, b.y, b.y);
      drawLine(a.x - minTurn - lineWidth / 2, a.x - minTurn - lineWidth / 2, a.y, b.y);
      drawLine(a.x - minTurn - lineWidth / 2, a.x - minTurn - lineWidth / 2, a.y, c.y);
      drawLine(c.x, a.x - minTurn, c.y, c.y);
    }
  }

  const getRect = (i, marginLeft, marginTop) => {
    let image = "";
    if (slots[i] !== null) {
      image = images[slots[i]];
    }

    return <Rect key={"rect" + i} index={i} slot={slots[i]} image={image} {...boxDim} marginLeft={round(marginLeft)} marginTop={round(marginTop)} onClick={onBracketClick} />
  }

  const getPair = (i, marginLeft, marginTop) => {
    const newObjects = []
    newObjects.push(getRect(i, marginLeft, marginTop));
    newObjects.push(getRect(i + 1, marginLeft, marginTop + boxDim.height + lineWidth));
    return newObjects;
  }

  const draw = () => {
    const canvas = canvasRef.current;
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;

    const newObjects = [];
    const heightGap = Math.max((height - 4 * pairHeight) / 3, minHeightDiff);
    const heightBlock = pairHeight + heightGap;

    const widthGap = (width - 7 * boxDim.width) / 6;
    const widthBlock = boxDim.width + widthGap;

    let index = 0;

    // Western Conference Round 1
    Array(4).fill(0).forEach((el, i) => {
      newObjects.push(getPair(index, 0, i * heightBlock))
      index += 2;
    })

    // Western Conference Semi Finals
    let sfHeights = [];
    Array(2).fill(0).forEach((el, i) => {
      const sfHeight = 2 * i * heightBlock + (heightBlock + pairHeight) / 2;
      sfHeights.push(sfHeight);
      newObjects.push(getPair(index, widthBlock, sfHeight - boxDim.height));
      drawT({x: boxDim.width + minLineGap, y: 2 * i * heightBlock + boxDim.height}, {x: boxDim.width + minLineGap, y: (2 * i + 1) * heightBlock +  + boxDim.height}, {x: widthBlock - minLineGap, y: sfHeight})
      index += 2;
    })
    
    // Western Conference Finals
    const fHeight = (3 * heightBlock + pairHeight) / 2;
    newObjects.push(getPair(index, 2 * widthBlock, fHeight - boxDim.height));
    drawT({x: widthBlock + boxDim.width + minLineGap, y: sfHeights[0]}, {x: widthBlock + boxDim.width + minLineGap, y: sfHeights[1]}, {x: 2 * widthBlock - minLineGap, y: fHeight})
    index += 2;

    // Finals
    newObjects.push(getPair(index, 3 * widthBlock, fHeight - boxDim.height));
    drawLine(2 * widthBlock + boxDim.width + minLineGap, 3 * widthBlock - minLineGap, fHeight, fHeight);
    drawLine(3 * widthBlock + boxDim.width + minLineGap, 4 * widthBlock - minLineGap, fHeight, fHeight);
    index += 2;

    // Eastern Conference Finals
    newObjects.push(getPair(index, 4 * widthBlock, fHeight - boxDim.height));
    drawT({x: 5 * widthBlock - minLineGap, y: sfHeights[0]}, {x: 5 * widthBlock - minLineGap, y: sfHeights[1]}, {x: 4 * widthBlock + boxDim.width + minLineGap, y: fHeight})
    index += 2;

    // Eastern Conference Semi Finals
    Array(2).fill(0).forEach((el, i) => {
      const sfHeight = sfHeights[i];
      newObjects.push(getPair(index, 5 * widthBlock, sfHeight - boxDim.height));
      drawT({x: 6 * widthBlock - minLineGap, y: 2 * i * heightBlock + boxDim.height}, {x: 6 * widthBlock - minLineGap, y: (2 * i + 1) * heightBlock +  + boxDim.height}, {x: 5 * widthBlock + boxDim.width + minLineGap, y: sfHeight})
      index += 2;
    })

    // Eastern Conference Round 1
    Array(4).fill(0).forEach((el, i) => {
      newObjects.push(getPair(index, width - boxDim.width, i * heightBlock));
      index += 2;
    })

    // Champion
    newObjects.push(getRect(index, 3 * widthBlock, heightBlock / 2));
    index += 2;

    setObjects(newObjects);
  }    

  // draw again whenever props changes
  useEffect(() => {
    draw();
  }, [JSON.stringify(props), JSON.stringify(images)])

  // initial fetch for team logos
  useEffect(() => {
    fetch('/teams').then(res => res.json())
      .then(data => {
        const map = {}
        data.forEach(el => {
          map[el.name] = el.image;
        })
        console.log("MAP", map);
        setImages(map);
      })
      .catch(err => { console.log('ERROR') });
  }, [])
    
  return (
    <div className="bracketview-center">
      <div className="bracketview-div">  
        <canvas id="bracket" ref={canvasRef} width={canvasWidth} height={canvasHeight}></canvas>
        {objects}
        {playOffPrediction !== null ? <PlayOffPrediction data={playOffPrediction} results={results} predictions={predictions} onClick={onPredictionClick} images={images}></PlayOffPrediction> : null}
      </div> 
    </div>
  )
}

function Rect(props) {
  const index = props.index;
  const slot = props.slot;
  const image = props.image;
  const width = props.width;
  const height = props.height;
  const marginLeft = props.marginLeft;
  const marginTop = props.marginTop;
  const onClick = props.onClick;

  const type = (function() {
    if (index == 30) {
      return "left";
    } else if (index < 15) {
      return "left";
    } else {
      return "right";
    }
  }());

  const style = {
    width: width + "px",
    height: height + "px",
    marginLeft: marginLeft + "px",
    marginTop: marginTop + "px"
  }

  return (
    <div className="rect" style={style} onClick={() => onClick(index)}>
      {slot != null ? <TeamBox name={slot} image={image} type={type} width={width + "px"} height={height + "px"} scale={5}></TeamBox> : null}
    </div>
  )
}