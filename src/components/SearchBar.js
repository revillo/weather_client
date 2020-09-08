import React from 'react';
import HTTPRequest from '../util/HTTPRequest'

class SearchBar extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            suggestionIndex : 0,
            hasFocus : false,
            input : ""
        }
    }

    renderIcon()
    {
        return (<svg className="search-icon" viewBox="0 0 128 128" width="128px" height="128px">
              <circle cx="40" cy="40" r="35" stroke="black" fill="transparent" strokeWidth="7"/>
              <line x1="70" x2="110" y1="70" y2="110" stroke="black" strokeWidth="12"/>
        </svg>);
    }

    render()
    {

        var suggestionList;
        if (this.hasSuggestions && this.state.hasFocus)
        {
            const inputLength = this.state.input.length;

            const listItems = this.suggestedCities.map((city,i) => {
                
                const displayText = city.cty + ", " + city.sid;
                const boldPart = displayText.substr(0, inputLength);
                const rest = displayText.substr(inputLength);

                var className = "";
                className += i === this.state.suggestionIndex ? " selected" : "";

                function onClick()
                {
                    this.submitSuggestion(i);
                }

                return (
                <li key = {i} className = {className} ref = {this.itemRefs[i]}
                onMouseDown = {onClick.bind(this)}>
                    <b>{boldPart}</b>{rest}
                </li>
                );
            });
            
            suggestionList = 
            <div  className="search-dropdown">
                <ul className="suggestions">{listItems}</ul>
            </div>
        }

        return (
        <div className="search-area">
            <div className="search-bar-row">
                <input className="search-bar" autoComplete="off" type="text" name="location" value={this.state.input}
                    placeholder="Search US Cities"
                    onBlur = {this.handleBlur.bind(this)}
                    onFocus = {this.handleFocus.bind(this)}
                    onChange = {this.handleInput.bind(this)} 
                    onKeyDown = {this.handleKeyDown.bind(this)}/>
                {this.renderIcon()}
            </div>
            {suggestionList}
        </div>
        )
    }

    handleFocus()
    {
        this.setState({hasFocus: true, input:""});
    }

    handleBlur()
    {
        this.setState({hasFocus: false});
    }

    handleInput(event)
    {
        const input = event.target.value;
        this.setState({ input : input, suggestionIndex:0 });
        fetch(HTTPRequest.formatGetRequest(`${window.location.hostname}:4000/match_location`, {location:input}))
            .then(body => body.json())
            .then(res => {

                this.itemRefs = [];
                res.cities.forEach(city => {
                    this.itemRefs.push(React.createRef());
                });
                
                this.setState({suggestions: res, suggestionIndex: 0})
                this.scrollToSuggestion();

            })
            .catch(err => {
                console.log(err)
            });

    }

    get suggestedCities()
    {
        if (this.hasSuggestions)
            return this.state.suggestions.cities;
        return [];
    }

    get hasSuggestions()
    {
        if (this.state.suggestions == null) {
            return false;
        }

        if (this.state.suggestions.cities.length == 0)
        {
            return false;
        }

        return true;
    }

    submitSuggestion(index)
    {
        index = index || this.state.suggestionIndex;
        const cityInfo = this.suggestedCities[index];
        var queryText = [cityInfo.cty, cityInfo.sid].join(", ");
        this.setState({input: queryText, suggestions : null});
        this.props.submitCity(cityInfo);
    }

    scrollToSuggestion()
    {
        this.itemRefs[this.state.suggestionIndex].current.scrollIntoView({
            behavior : 'smooth'
        });
    }

    handleKeyDown(event)
    {
        if (event.key === 'Enter') 
        {
            if (this.hasSuggestions)
            {
              this.submitSuggestion();
            } else {
                //todo
            }
            /*
            else if (this.state.input)
            {
                this.props.onSubmit(this.state.input);
            }*/
        }

        if (event.key === 'ArrowDown' && this.state.suggestions)
        {
            event.preventDefault();
            let suggestionIndex = Math.min(this.suggestedCities.length - 1, this.state.suggestionIndex + 1);
            this.setState({suggestionIndex : suggestionIndex});
            this.scrollToSuggestion();
        }

        if (event.key === 'ArrowUp' && this.state.suggestions)
        {
            event.preventDefault();
            let suggestionIndex = Math.max(0, this.state.suggestionIndex - 1);
            this.setState({suggestionIndex : suggestionIndex});
            this.scrollToSuggestion();
        }
    }
}

export default SearchBar