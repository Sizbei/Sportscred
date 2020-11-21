import React, {useEffect, useState, useContext} from 'react';
import '../styling/Histogram.css';
import LineGraph from 'react-line-graph'

export default function Histogram(props) {
  const data = Array(props.data.length).fill(0).map((el, i) => props.data[i]);
  const xScale = "xScale" in props ? props.xScale : 1.0;
  const yScale = "yScale" in props ? props.yScale : 1.0;
  
  const r = 0.90;
  const k = 0.03;
  
  const nonZero = (function() {
    for (let i = 0; i < data.length; i++) {
      // console.log(data[i]);
      if (Math.abs(data[i]) > 0.01) {
        return true;
      }
    }
    return false;
  }());

  // squash
  if (nonZero) {
    const sum = data.reduce((total, num) => total + num, 0);
    for (let i = 0; i < data.length; i++) {
      data[i] /= sum;
    }
  }
  
  const totalmul = (function() {
    let s = 0;

    for (let i = -100; i <= 200; i++) {
      s += Math.pow(r, k * Math.pow(i, 2))
    }
    console.log("total mul", s);
    return s;
  }());

  const multiplier = Array(data.length).fill(0).map((el, j) => {
    let weight = 0;
    data.forEach((_, i) => {
      weight += Math.pow(r, k * Math.pow(i - j, 2));
    })
    return totalmul / weight;
  })

  // console.log("multipler", multiplier);

  const transform = Array(data.length).fill(0).map((el, j) => {
    let total = 0;
    data.forEach((_, i) => {
      total += data[i] * Math.pow(r, k * Math.pow(i - j, 2));
    })
    return (total * multiplier[j]).toFixed(6);
  })

  // console.log("transform", transform);
  
  // set the min x axis
  // const append = transform.concat([Math.min(...transform) / 1.05]);
  const append = transform.concat([0, 1.3 * Math.max(...transform)]);

  const lineGraphProps = {
    data: append,
    smoothing: 0,
    height: '109.5%', // hide overflow y
    width: '105.36%', // hide overflow x (from append)
    accent: 'palevioletred',
    fillBelow: 'rgba(200,67,23,0.1)',
  };

  const style = {
    height: 4.7368 * yScale + "vw",
    width: 5.2632 * xScale + "vw",
  }
  
  return (
    <div className="histogram-div" style={style}>
      {nonZero ? <LineGraph {...lineGraphProps}/> : null}
    </div>
  )
}