import React from 'react';
import Temperature from "../util/temperature";
import Symbols from '../util/symbols'
import DateTime from '../util/datetime'

class WeatherResults extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = {
        };
    }

    renderIcon(weatherData)
    {
        const imgUrl =`http://openweathermap.org/img/wn/${weatherData.icon}@2x.png`;
        return <img className="weather-icon" src={imgUrl} alt={weatherData.description}></img>
    }

    renderTemperature(kelvin)
    {
        var fahrenheit = Temperature.kelvinToFahrenheit(kelvin).toFixed(0);
        return <span className="temperature">{fahrenheit}{Symbols.degrees}</span>
    }

    renderCurrent()
    {
        const current = this.results.current;

        if (!current)
        {
            return null;
        }

        const currentWeather = current.weather[0];

        const momentTime = DateTime.momentFromUnix(current.dt, this.results.timezone);

        const timeAndDate = (
            <React.Fragment>
            <h2>{momentTime.format("h:mm A")}</h2>
            <h4>{momentTime.format("dddd, MMM Do YYYY")}</h4>
            </React.Fragment>
        );

        const weatherSummary = (
            <React.Fragment>
                <div className="flex-vertical">
                    <div className="flex-horizontal">
                        {this.renderIcon(currentWeather)}
                        {this.renderTemperature(current.temp)}
                    </div>
                    <span className="description">{currentWeather.description}</span>
                </div>
            </React.Fragment>
        );

        if (this.props.layout == "landscape")
        {
            return (
                <React.Fragment>
                <h2>{this.props.cityString}</h2>
                <span className="chunk-title">Current Time & Weather</span>
                <div className = "current-weather flex-horizontal page-chunk">
                    {weatherSummary}
                    {timeAndDate}
                </div>
                </React.Fragment>
            )
        } else {
            return (
                <React.Fragment>
                <h2>{this.props.cityString}</h2>
                <span className="chunk-title">Current Time & Weather</span>
                <div className = "current-weather flex-horizontal page-chunk">
                    {weatherSummary}
                </div>
                <div className = "flex-horizontal page-chunk">
                    {timeAndDate}
                </div>
                </React.Fragment>
            )
        }
    }

    get results()
    {
        return this.props.queryResults;
    }

    renderHourly()
    {

        const hourlyWeather = this.results.hourly;
        
        if (!hourlyWeather)
        {
            return null;
        }

        const timezone = this.results.timezone;

        const hourDisplays = hourlyWeather.map(hour => {

            const date = DateTime.momentFromUnix(hour.dt, timezone);

            const hourWeather = hour.weather[0];

            return (
                <div key={hour.dt} className="hour-display">
                    <b>{DateTime.formatHour(date.hours())}</b>
                    {this.renderTemperature(hour.temp)}
                    {this.renderIcon(hourWeather)}
                </div>
            )
        });

        return (
            <React.Fragment>
                <span className="chunk-title">48 Hour Forecast</span>
                <div className = "hourly-weather page-chunk">
                    <div className = "weather-graph">
                        {hourDisplays}
                    </div>
                </div>
            </React.Fragment>
        )
    }

    renderDaily()
    {
        const dailyWeather = this.results.daily;

        if (!dailyWeather)
        {
            return null;
        }

        const timezone = this.results.timezone;

        const dayDisplays = dailyWeather.map(day => {

            const date = DateTime.momentFromUnix(day.dt, timezone);

            const dayWeather = day.weather[0];

            return (
                <div key={day.dt} className="hour-display flex-vertical">
                    <b><span>{date.format("ddd")}</span></b>
                    <span>
                        <span className="tiny-text">hi</span>
                        {this.renderTemperature(day.temp.max)}
                    </span>
                    <span>
                        <span className="tiny-text">lo</span>
                        {this.renderTemperature(day.temp.min)}
                    </span>
                    {this.renderIcon(dayWeather)}
                </div>
            )
        });

        return (
            <React.Fragment>
                <span className="chunk-title">7 Day Forecast</span>
                <div className = "daily-weather page-chunk">
                    <div className = "weather-graph">
                        {dayDisplays}
                    </div>
                 </div>
            </React.Fragment>
        )
    }

    render()
    {
        return(
        <div className = "weather-results">
            {this.renderCurrent()}
            {this.renderHourly()}
            {this.renderDaily()}
        </div>
        );
    }
}

export default WeatherResults