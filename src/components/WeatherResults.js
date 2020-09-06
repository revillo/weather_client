import React from 'react';
import Temperature from "../util/temperature";
import Symbols from '../util/symbols'

class WeatherResults extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = {
        };
    }

    render()
    {
        const weatherData = this.props.queryResults;
        var fahrenheit = Temperature.kelvinToFahrenheit(weatherData.main.temp).toFixed(0);

        const currentWeather = weatherData.weather[0];

        const imgUrl = `http://openweathermap.org/img/wn/${currentWeather.icon}@2x.png`;

        return (
            <div className = "current-weather">
                <h1>{fahrenheit}{Symbols.degrees}F</h1>
                <img src={imgUrl}></img>
                <h3>{currentWeather.description}</h3>
                <h1>{weatherData.name}</h1>
            </div>
        )
    }
}

export default WeatherResults