
function formatGetRequest(endpoint, params)
{
    var path = Object.entries(params).map(pair => {
        return [pair[0], pair[1]].join("=");
    }).join("&")

    return "http://" + endpoint + "?" + path; 
}


export default {

    formatGetRequest: formatGetRequest,

    //Make an AJAX get request 
    fetchBackend: function(api_name, params)
    {
        //For now just assume front and backend are on the same server
        return fetch(formatGetRequest(`${window.location.hostname}:2052/${api_name}`, params))
            .then(body => body.json());        
    }

}