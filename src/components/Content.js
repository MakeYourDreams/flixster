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

class Content extends Component {

  
  constructor(props) {
    super(props);

    this.state = { 
      loaded: "fa fa-cog fa-spin fa-lg",
      loadedfin :"d-none",
      movieData: [],
      ratingData: [],
      ratingData2: []
    };

    this.codeNode = React.createRef();
  }

  componentDidMount() {
    const v3ApiKey = 'a1714ea534415d9c121d381219e6129d';    
    const v3Client = v3(v3ApiKey);
    v3Client.movie.popular()
    .then((data) => {

      this.setState({movieData: data.results});

      for (const [i, v] of data.results.entries()) {
        var d = new Date(v.release_date);
        d = d.toLocaleString('default', { month: 'short' })
        data.results[i].release_date = d + ", " + v.release_date[0] + v.release_date[1] + v.release_date[2] + v.release_date[3];
        data.results[i].loaded = "fa fa-cog fa-spin fa-lg";
        data.results[i].loadedfin = "d-none";
        this.setState({movieData: data.results});
      // console.log(props)
        axios({
          "method":"GET",
          "url":"https://movie-database-imdb-alternative.p.rapidapi.com/",
          "headers":{
          "content-type":"application/octet-stream",
          "x-rapidapi-host":"movie-database-imdb-alternative.p.rapidapi.com",
          "x-rapidapi-key": "1mAVi8jSwlmsh07ghuCUnNKdyw9ip15YyMJjsng8L9nsfQVPyn"
          },"params":{
          "page":"1",
          "y":v.release_date.substr(0, 3),
          "r":"json",
          "type":"movie",
          "s":data.results[i].title
          }
          })
          .then((response)=>{
              axios({
                "method":"GET",
                "url":"https://movie-database-imdb-alternative.p.rapidapi.com/",
                "headers":{
                "content-type":"application/octet-stream",
                "x-rapidapi-host":"movie-database-imdb-alternative.p.rapidapi.com",
                "x-rapidapi-key": "1mAVi8jSwlmsh07ghuCUnNKdyw9ip15YyMJjsng8L9nsfQVPyn"
                },"params":{
                "i":response.data.Search[0].imdbID,
                "r":"json"
                }
              })
              .then((response2) =>{
                console.log(response2.data)
                this.setState({loaded: ""});
                this.setState({loadedfin: "d-flex"});
                // if (response2.data.Ratings.length == 0){
                // console.log("grr", response2)
                // this.setState({ ratingData: this.state.ratingData.concat('-') });
                // }
                for (const [i, v] of this.state.movieData.entries()) {
                  if (response2.data.Title == this.state.movieData[i].title) {
                    var compareState = this.state.movieData
                    compareState[i].IMDB = response2.data.Ratings[0].Value
                    compareState[i].RT = response2.data.Ratings[1].Value
                    compareState[i].loaded = ""
                    compareState[i].loadedfin = "d-flex"
                    this.setState({movieData: compareState});
                  } else if (response2.data.Title.substr(0, 3)== this.state.movieData[i].title.substr(0, 3)) {
                    var compareState = this.state.movieData
                    compareState[i].IMDB = response2.data.Ratings[0].Value
                    compareState[i].RT = response2.data.Ratings[1].Value
                    compareState[i].loaded = ""
                    compareState[i].loadedfin = "d-flex"
                    this.setState({movieData: compareState});
                  }
              //  this.setState({ ratingData: this.state.ratingData.concat(response2.data.Ratings[0].Value) });
              //  this.setState({ ratingData2: this.state.ratingData2.concat(response2.data.Ratings[1].Value) });
                }
                console.log(this.state)
              })
              .catch((error)=>{
                console.log(error)
              })
          })
          .catch((error)=>{
            console.log(error)
          })
    }

    // console.log("FINISHED")
    // If loaded takes too long we stop the loading spinner
    setTimeout(() => { 
      for (const [i, v] of this.state.movieData.entries()) {
        var compareState2 = this.state.movieData
        if (this.state.movieData[i].IMDB == undefined) compareState2[i].IMDB = "~"
        if (this.state.movieData[i].RT == undefined) compareState2[i].RT = "~"
        compareState2[i].loaded = ""
        compareState2[i].loadedfin = "d-flex"
        this.setState({movieData: compareState2});
        }
    }, 5000);
      // console.log(data.results[2])
      // this.setState({ loaded: true });
      // res.render('./weekly/allContacts',{ popularMovies: data.results })
    })
    .catch((error) => {
      console.log('error: ', error);
    });
  }

  

  
  render() {

    const cardStyle = {
      marginTop: '4vh',
      padding: '2px',
      width: '20%'
    };

    
    const ratingStyle = {
      width: '26px'
      // border: '1px',
      // borderStyle: 'solid'
      // backgroundColor: 'black'
    };

    // const { loaded } = this.state;

    // if (!loaded) {
    //   return null;
    // }
    
// console.log(this.state.ratingData)

    return (
      <div className="next-steps my-5">
                <h2 className="my-5 text-center">Top movies of the week</h2>
        <Row className="d-flex justify-content-between">
          {/* {console.log("wow", this.state.movieData[1])} */}
          
          {this.state.movieData.map((mov, i) => (
          <div className="card" style={cardStyle}>
          <img className="card-img-top" src={`https://image.tmdb.org/t/p/w500/${mov.poster_path}`} alt="Card image cap"></img> 
          <div className="card-body">
            <h5 className="card-title"><b>{mov.title}</b></h5>
            <i className={mov.loaded}/>
            
            <div className={mov.loadedfin}>
              {/* <FontAwesomeIcon icon={faImdb} className="fa-lg"/>  */}
            <img src={IMDBlogo} alt="IMDB" style={{width: '26px'}}></img>
            <span style={{marginRight: '10px'}}><b>{mov.IMDB}</b></span>
            <img src={tomato} alt="Rotten Tomatoes" style={{width: '26px'}}></img>
            <span><b>{mov.RT}</b></span>
            </div>
            <span></span>
          </div >
          <ul className="list-group list-group-flush">
            <li className="list-group-item">{mov.release_date}</li>
            <li className="list-group-item"></li>
            <li className="list-group-item"></li>
          </ul>
          <div className="card-body">
            <a href="users/profile/{{this._id}}" className="card-link">See details</a>
          </div>
          </div>
          ))}
        </Row>
      </div>
    );
  }
}

export default Content;
