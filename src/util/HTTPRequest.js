export default {

    formatGetRequest: function(endpoint, params)
    {
        var path = Object.entries(params).map(pair => {
            return [pair[0], pair[1]].join("=");
        }).join("&")

        return "http://" + endpoint + "?" + path; 
    }

}