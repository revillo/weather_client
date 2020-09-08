import React from 'react';

import WeatherResults from './WeatherResults';
import SearchBar from './SearchBar'
import HTTPRequest from '../util/HTTPRequest'

class MainPanel extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = {
        }
    }

    onResize()
    {
        this.setState({layout : window.innerHeight > window.innerWidth ? "portrait" : "landscape"});
    }

    componentDidMount()
    {
        this.onResize();
        this.resizeListener = window.addEventListener('resize', this.onResize.bind(this));
    }

    componentWillUnmount()
    {
        window.removeEventListener(this.resizeListener);
    }

    queryCity(cityData)
    {

        console.log(cityData.cty);
        fetch(HTTPRequest.formatGetRequest(`${window.location.hostname}:4000/one_call`, cityData))
        //fetch(HTTPRequest.formatGetRequest("http://192.168.10.106:4000/sample_one_call", cityData))
        .then((res) => res.json())
        .then((res) => {

            
            if (res.error) {
                console.log("error", res.error)
            } else {
                this.setState({
                    queryResults : res.results,
                    queryString : res.query.cty + ", " + res.query.sid
                });
            }

            console.log(res);

        });
    }
 
    render()
    {

        var mainBody;
        var heroClass = "hero";

        if (this.state.queryResults)
        {
            heroClass += " docked";
            mainBody = <WeatherResults layout={this.state.layout} queryResults={this.state.queryResults} cityString={this.state.queryString}></WeatherResults>
        }

        return (
        <div className = "main-panel">
            <div className={heroClass}>
            <span className="title" onClick={() => window.location.reload(false)}>tmwa.</span>
            <span className="subtitle">Tastefully Minimal Weather App</span>
            <SearchBar 
                submitCity = {this.queryCity.bind(this)}>
            </SearchBar>
            </div>
            {mainBody}
        </div>)
    }
}

export default MainPanel