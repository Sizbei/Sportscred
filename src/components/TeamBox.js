import React, {useState,  useEffect} from "react"
import '../styling/TeamBox.css'
 
/* 
<TeamBoxLeft name="Atlanta Hawks" color='black'></TeamBoxLeft>
<TeamBoxLeft name="Boston Celtics" color='#008248'></TeamBoxLeft>
<TeamBoxLeft name="Brooklyn Nets" color='#FF6E00'></TeamBoxLeft>
<TeamBoxLeft name="Charlotte Hornets" color='#00788C'></TeamBoxLeft>
<TeamBoxLeft name="Chicago Bulls" color='#C4001E'></TeamBoxLeft>
<TeamBoxLeft name="Cleveland Chandeliers" color='#6F2633'></TeamBoxLeft>
<TeamBoxLeft name="Dallas Mavericks" color='#007DC5'></TeamBoxLeft>
<TeamBoxLeft name="Denver Nuggets" color='#001E3E'></TeamBoxLeft>
<TeamBoxLeft name="Detroit Pistons" color='#1D428A'></TeamBoxLeft>
<TeamBoxLeft name="Golden State Warriors" color='#FDB927'></TeamBoxLeft>
<TeamBoxLeft name="Houston Rockets" color='#F00840'></TeamBoxLeft>
<TeamBoxLeft name="Indiana Pacers" color='#002D62'></TeamBoxLeft>
<TeamBoxLeft name="Los Angeles Lakers" color='#552583'></TeamBoxLeft>
<TeamBoxLeft name="Los Angeles Clippers" color='#5B91F2'></TeamBoxLeft>
<TeamBoxLeft name="Memphis Grizzles" color='#305168'></TeamBoxLeft>
<TeamBoxLeft name="Miami Heat" color='#D00000'></TeamBoxLeft>
<TeamBoxLeft name="Milwaukee Bucks" color='#00471B'></TeamBoxLeft>
<TeamBoxLeft name="Minnesota Timberwolves" color='#78BE20'></TeamBoxLeft>
<TeamBoxLeft name="New Orleans Pelicans" color='#E31837'></TeamBoxLeft>
<TeamBoxLeft name="New York Knicks" color='#006BB6'></TeamBoxLeft>
<TeamBoxLeft name="OKC City Thunder" color='#FDBB30'></TeamBoxLeft>
<TeamBoxLeft name="Utah Jazz" color='#00471B'></TeamBoxLeft>
<TeamBoxLeft name="Orlando Magic" color='#0B77BD'></TeamBoxLeft>
<TeamBoxLeft name="Phoenix Suns" color='#D75F06'></TeamBoxLeft>
<TeamBoxLeft name="Portland Trail Blazers" color='black'></TeamBoxLeft>     
<TeamBoxLeft name="Sacramento Kings" color='#5A2D80'></TeamBoxLeft>     
<TeamBoxLeft name="San Antonio Spurs" color='#181A21'></TeamBoxLeft>     
<TeamBoxLeft name="Toronto Raptors" color='black'></TeamBoxLeft>     
<TeamBoxLeft name="Washington Wizards" color='#004C9E'></TeamBoxLeft> 
*/ 

const defaultColor = {
  "Atlanta Hawks": "black",
  "Boston Celtics": '#008248',
  "Brooklyn Nets": '#FF6E00',
  "Charlotte Hornets": '#00788C',
  "Chicago Bulls": '#C4001E',
  "Cleveland Chandeliers": '#6F2633',
  "Dallas Mavericks": '#007DC5',
  "Denver Nuggets": '#001E3E',
  "Detroit Pistons": '#1D428A',
  "Golden State Warriors": '#FDB927',
  "Houston Rockets": '#F00840',
  "Indiana Pacers": '#002D62',
  "Los Angeles Lakers": '#552583',
  "Los Angeles Clippers": '#5B91F2',
  "Memphis Grizzles": '#305168',
  "Miami Heat": '#D00000',
  "Milwaukee Bucks": '#00471B',
  "Minnesota Timberwolves": '#78BE20',
  "New Orleans Pelicans": '#E31837',
  "New York Knicks": '#006BB6',
  "OKC City Thunder": '#FDBB30',
  "Oklahoma City Thunder": '#FDBB30',
  "Utah Jazz": '#00471B',
  "Orlando Magic": '#0B77BD',
  "Phoenix Suns": '#D75F06',
  "Portland Trail Blazers": 'black',
  "Philadelphia 76ers": '#5B91F2',
  "Sacramento Kings": '#5A2D80',
  "San Antonio Spurs": '#181A21',
  "Toronto Raptors": 'black',
  "Washington Wizards": '#004C9E',
}

/*
  Usage:
  - required: a team name
  - props.type: left or right. default: left
  - provide props.image for faster loads. Prefetch all images with the /teams route. Otherwise the fetches are slow
  - provide props.color for custom color
  - provide props.height for custom height (must specify the unit)
  - provide props.width for custom width (must specify the unit)

  Feel free to add more custom and default values.
  */
export default function TeamBox(props) {
    var givenTeamName = props.name;
    var boxType = "type" in props ? props.type : "left";
    var backgroundColor = "color" in props ? props.color : (givenTeamName in defaultColor ? defaultColor[givenTeamName] : "black");
    const propsImage = "image" in props ? props.image : "";
    const [fetchImage, setFetchImage] = useState("");
    var height = "height" in props ? props.height : 5;
    var fontSize;
    var width;
    const scaleFactor = "scale" in props ? props.scale : 3;
    const fontFactor = 4;

    width = height * scaleFactor;
    fontSize = height / fontFactor;

    var TeamBoxStyle = { 
        "background-color": backgroundColor,
        "height": "height" in props ? props.height : height + "vw",
        "width": "width" in props ? props.width : width + "vw" 
    };

    var FontStyle = {
        "font-size": fontSize + "vw"
    }

    useEffect(() => {
      fetch('/teams').then(res => res.json())
          .then(data => {
          data.forEach(function(team) { 
              if(team.name === givenTeamName.replace(/\s/g, "")) {
                  setFetchImage(team.image);
              }
          }); 
          })
          .catch(err => { console.log('ERROR') }) ; 
    }, [props.name])

    const imgSrc = propsImage != "" ? propsImage : fetchImage;

    if (boxType === "left") {
      return (
        <div className='TeamBox' style={TeamBoxStyle}>
            <div className='TB-teamImage'>
                <img src={imgSrc} className='TB-image'/>
            </div>
            <div className='TB-teamName-left'>
                <label className='TB-name-left' style={FontStyle}>{givenTeamName}</label>
            </div>
        </div>
      );
    } else if (boxType === "right") {
      return (
        <div className='TeamBox' style={TeamBoxStyle}>
            <div className='TB-teamName-right'>
                <label className='TB-name-right' style={FontStyle}>{givenTeamName}</label>
            </div>
            <div className='TB-teamImage'>
                <img src={imgSrc} className='TB-image'/>
            </div>
        </div>
      )
    }
}
    

  