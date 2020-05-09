import React, { Component } from "react";
import { Row, Col } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  faImdb  } from '@fortawesome/free-brands-svg-icons';
import '../../node_modules/@fortawesome/fontawesome-free/css/brands.css'
import contentData from "../utils/contentData";
import axios from 'axios';
import { v3, v4 } from "@leonardocabeza/the-movie-db";

import '../style.css'
import IMDBlogo from "../assets/IMDBlogo.png";
import tomato from "../assets/tomato.png";
import badTomato from "../assets/badTomato.png";
import goodTomato from "../assets/goodTomato.png";
import { Auth0Context } from "../react-auth0-spa";


export class TVContent extends Component {
  static contextType = Auth0Context
  
  constructor(props) {
    super(props);

    this.state = { 
      loaded: "fa fa-cog fa-spin fa-lg",
      loadedfin :"d-none",
      movieData: [],
      ratingData: [],
      ratingData2: [],
      user: ""
    };

    this.codeNode = React.createRef();
  }

  
  componentDidMount() {
    if (this.context.user !== undefined){
    this.setState({user: this.context.user.email});
    }
    console.log(this.state)
    const v3ApiKey = 'a1714ea534415d9c121d381219e6129d';    
    const v3Client = v3(v3ApiKey);
    v3Client.tv.details(this.props.match.params.id)
    .then((data) => {
      // console.log(data)
      this.setState({movieData: data});

        var d = new Date(data.first_air_date);
        d = d.toLocaleString('default', { month: 'short' })
        data.first_air_date = d + ", " + data.first_air_date.substr(0, 4);
        data.loaded = "fa fa-spinner fa-spin fa-lg";
        data.loadedfin = "d-none";
        this.setState({movieData: data});
        // console.log(this.state)
        axios({
          "method":"GET",
          "url":"https://movie-database-imdb-alternative.p.rapidapi.com/",
          "headers":{
          "content-type":"application/octet-stream",
          "x-rapidapi-host":"movie-database-imdb-alternative.p.rapidapi.com",
          "x-rapidapi-key": "d1fa5ad8abmshb72575fba792b52p101767jsn5710fbc7a526"
          },"params":{
          "page":"1",
          "y":data.first_air_date.substr(0, 3),
          "r":"json",
          "type":"series",
          "s":data.name
          }
          })
          .then((response)=>{
              axios({
                "method":"GET",
                "url":"https://movie-database-imdb-alternative.p.rapidapi.com/",
                "headers":{
                "content-type":"application/octet-stream",
                "x-rapidapi-host":"movie-database-imdb-alternative.p.rapidapi.com",
                "x-rapidapi-key": "d1fa5ad8abmshb72575fba792b52p101767jsn5710fbc7a526"
                },"params":{
                "i":response.data.Search[0].imdbID,
                "r":"json"
                }
              })
              .then((response2) =>{
                // console.log(response2.data)
                this.setState({loaded: ""});
                this.setState({loadedfin: "d-flex"});
                // if (response2.data.Ratings.length == 0){
                // console.log("grr", response2)
                // this.setState({ ratingData: this.state.ratingData.concat('-') });
                // }
                  if (response2.data.Title == this.state.movieData.name) {
                    var compareState = this.state.movieData
                    compareState.IMDB = response2.data.Ratings[0].Value
                    compareState.RT = response2.data.Ratings[1].Value
                    compareState.RT.substr(0, 2) >= 60 ? compareState.RTimg = tomato : compareState.RTimg = badTomato;
                    compareState.loaded = ""
                    compareState.loadedfin = "d-flex"
                    this.setState({movieData: compareState});
                  } else if (response2.data.Title.substr(0, 3)== this.state.movieData.name.substr(0, 3)) {
                    var compareState = this.state.movieData
                    compareState.IMDB = response2.data.Ratings[0].Value
                    compareState.RT = response2.data.Ratings[1].Value
                    compareState.RT.substr(0, 2) >= 60 ? compareState.RTimg = tomato : compareState.RTimg = badTomato;
                    compareState.loaded = ""
                    compareState.loadedfin = "d-flex"
                    this.setState({movieData: compareState});
                  }
                
              })
              .catch((error)=>{
                console.log(error)
              })
          })
          .catch((error)=>{
            console.log(error)
          })


    // console.log("FINISHED")
    // If loading takes too long we stop the loading spinner
    setTimeout(() => { 
      console.log(this.state.movieData)
        var compareState2 = this.state.movieData
        if (this.state.movieData.IMDB == undefined) compareState2.IMDB = "~";
        if (this.state.movieData.RT == undefined) {
          compareState2.RT = "~"
          compareState2.RTimg = tomato;
        }
        compareState2.loaded = ""
        compareState2.loadedfin = "d-flex"
        this.setState({movieData: compareState2});
    }, 4200);
      // console.log(data.results[2])
      // this.setState({ loaded: true });
      // res.render('./weekly/allContacts',{ popularMovies: data.results })
    })
    .catch((error) => {
      console.log('error: ', error);
    });
    v3Client.tv.videos(this.props.match.params.id)
    .then((trailerData) => {
      var compareState = this.state.movieData
      compareState.youTube = trailerData.results[0].key
      this.setState({movieData: compareState});
      console.log(this.state)
      console.log(trailerData)
    })
    .catch((error) => {
      console.log('error: ', error);
    });
  }

  

  
  render() {

    const cardStyle = {
      marginTop: '4vh',
      padding: '0px',
      width: '19%',
      // backgroundColor: 'rgba(230, 230, 255, 0.2)',
      border: '0',
      marginLeft: '120px',
      marginBottom: '30px',
      borderStyle: 'solid',
      borderWidth: 'thin',
      marginBottom: '30px',
      borderRadius: '30px',
    };

    const descriptionStyle = {
      marginTop: '4vh',
      marginLeft: '30px',
      padding: '30px',
      width: '60%',
      height: '40%',
      backgroundColor: 'rgb(255, 255, 255)',
      borderRadius: '30px',
      borderStyle: 'solid',
      borderWidth: 'thin',
      marginBottom: '30px'
    };
    
    const ratingStyle = {
      width: '20px',
      height: '20px'

      // border: '1px',
      // borderStyle: 'solid'
      // backgroundColor: 'black'
    };

    const titleStyle = {
      marginTop: '10px',
      marginRight: '10px'
    };


    const mov = this.state.movieData

    const backgroundStyle = {
      backgroundImage: `url(https://image.tmdb.org/t/p/original` + mov.backdrop_path + `)`,
      backgroundSize: '100%', 
      backgroundRepeat: 'no-repeat',
      borderRadius: '100px',
      boxShadow: 'inset 0px 0px 277px 40px #060200'
    }
    
    // const { loaded } = this.state;

    // if (!loaded) {
    //   return null;
    // }
    
// console.log(this.state.ratingData)

return (

  <div className="opacityBackground" style={backgroundStyle} >
    <Row className="d-flex">
      {/* {console.log("wow", this.state.movieData[1])} */}
      <div className="card" style={cardStyle}>
      <img className="card-img-top" src={`https://image.tmdb.org/t/p/w500/${mov.poster_path}`} alt="Card image cap" style={{borderRadius: '6px', borderTopLeftRadius: '30px', borderTopRightRadius: '30px'}}></img> 
      <div className="card-body" style={{marginLeft: '-10px'}}>
      <i className={mov.loaded} style={{color: 'gray'}}/>
        <div className={mov.loadedfin}>
          {/* <FontAwesomeIcon icon={faImdb} className="fa-lg"/>  */}
          <a target="_blank" href={`https://www.imdb.com/title/${mov.imdb_id}`} className="rate-float">
        <img src={IMDBlogo} alt="IMDB" style={ratingStyle}></img>
        <span style={{marginRight: '10px'}}><b>{mov.IMDB}</b></span>
        <img src={mov.RTimg} alt="Rotten Tomatoes" style={ratingStyle}></img>
        <span><b>{mov.RT}</b></span>
        </a>
        </div>
        <h5 className="card-title" style={titleStyle}><b>{mov.name}</b></h5>
        <span>{mov.first_air_date}</span>
        <br></br>
        {mov.number_of_seasons == 1 &&
        <p style={{marginTop: '10px'}}><i>{mov.number_of_seasons} Season</i></p>
        }
        {mov.number_of_seasons > 1 &&
        <p style={{marginTop: '10px'}}><i>{mov.number_of_seasons} Seasons</i></p>
        }
      </div >
       
      </div>
      <div className="" style={descriptionStyle}>
      <h2 className="">{mov.name}</h2>
        {mov.overview}
        <div>
        <object style={{width: '100%', height: '400px', padding: '20px' }} data={`https://www.youtube.com/embed/${mov.youTube}`}></object>
      </div>
      </div>

    </Row>

  </div>
);
  }
}

export default TVContent;