//https://www.thoughtco.com/chemistry-temperature-conversion-table-4012466


export default {
    kelvinToFahrenheit: function (kelvin) {
        return 1.8 * (kelvin - 273.15) + 32;
    },

    kelvinToCelsius: function(kelvin) {
        return (kelvin - 273.15);
    }
}