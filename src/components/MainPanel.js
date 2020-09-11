import React from 'react';

import WeatherResults from './WeatherResults';
import SearchBar from './SearchBar'
import HTTPRequest from '../util/HTTPRequest'
import LoadingIndicator from './LoadingIndicator'

class MainPanel extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            loading: false
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
        window.removeEventListener('resize', this.resizeListener);
    }

    get recentSearches()
    {
        try {
            var recentString = window.localStorage.getItem("recentSearches");
            return recentString ? JSON.parse(recentString) : []; 
        } 
        catch {
            return [];
        }
    }

    set recentSearches(searches)
    {
        window.localStorage.setItem("recentSearches", JSON.stringify(searches));
    }

    storeRecentSearch(cityData)
    {
        var recentSearches = this.recentSearches.filter(search => {
            return (search.cty != cityData.cty ||
            search.sid != cityData.sid);
        });
        
        recentSearches.unshift(cityData);

        this.recentSearches = recentSearches;
    }

    submitCity(cityData)
    {
        this.setState({error: null, queryString: null, queryResults: null, loading: true});

        HTTPRequest.fetchBackend("one_call", cityData)
        .then((res) => {

            if (res.error) {

                this.setState({error: res.error, loading: false});
            
            } else {

                this.storeRecentSearch(cityData);

                this.setState({
                    queryResults : res.results,
                    queryString : res.query.cty + ", " + res.query.sid,
                    loading: false
                });
            }
        });
    }

    submitUserLocation()
    {
        window.navigator.geolocation.getCurrentPosition(position => {

            var lat = position.coords.latitude;
            var lon = position.coords.longitude;

            this.submitCity({
                lat : lat,
                lon : lon,
                cty : lat.toFixed(3),
                sid : lon.toFixed(3)
            })

        }, err => {
          alert("Please use the local version to enable this feature.")  
        });
    }

    renderRecentSearches()
    {
        const recentList = this.recentSearches.map((cityData,index) => {
            
            var onClick = () => {
                this.submitCity(cityData);
            };

            return (<div key={index} className="button" onClick={onClick}>
                    {cityData.cty}, {cityData.sid}
                </div>);
        });

        return (
            <div className="recent-searches">
                <div key={-1} className="button" onClick={this.submitUserLocation.bind(this)}>My Location</div>
                {recentList}
            </div>
        );
    }

    renderResults()
    {
        return (
        <WeatherResults layout={this.state.layout} 
            queryResults={this.state.queryResults} cityString={this.state.queryString}/>
        );
    }

    render()
    {
        var mainBody;
        var heroClass = "hero";

        if (this.state.error)
        {
            mainBody = <div className="page-chunk error"> Error: Information is unavailable for your search. </div>
        } 
        else if (this.state.queryResults)
        {
            heroClass += " docked";
            mainBody = this.renderResults();
        } 
        else if (this.state.loading)
        {
            heroClass += " docked";
            mainBody = (
            <div className="weather-results flex-vertical">
                <LoadingIndicator/>
            </div>);
        }
        else
        {
            mainBody = this.renderRecentSearches();
        }

        return (
        <div className = "main-panel">
            <div className={heroClass}>
                <span className="title" onClick={() => window.location.reload(false)}>tmwa.</span>
                <span className="subtitle">Tastefully Minimal Weather App</span>
                <SearchBar submitCity = {this.submitCity.bind(this)}/>
            </div>
            {mainBody}
        </div>);
    }
}

export default MainPanel