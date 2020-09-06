import React from 'react';

import WeatherResults from './WeatherResults';
import SearchBar from './SearchBar'

class MainPanel extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = {
        }
    }

    queryLocation(locationText)
    {
        fetch("http://localhost:4000/get_weather?location=" + locationText)
        //fetch("http://localhost:4000/sample_result")
        .then((res) => res.json())
        .then((res) => {

            if (res.error) {
                
            } else {
                this.setState({
                    queryResults : res
                });
            }

        });
    }
 
    render()
    {

        var mainBody;
        var heroClass = "hero";

        if (this.state.queryResults)
        {
            heroClass += " docked";
            mainBody = <WeatherResults queryResults={this.state.queryResults}></WeatherResults>
        }

        return (
        <div className = "main-panel">
            <div className={heroClass}>
            <span className="title" onClick={() => window.location.reload(false)}>tmwa.</span>
            <span className="subtitle">Tastefully Minimal Weather App</span>
            <SearchBar onSubmit = {this.queryLocation.bind(this)}></SearchBar>
            </div>
            {mainBody}
        </div>)
    }
}

export default MainPanel