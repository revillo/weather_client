import React from 'react';
import Symbols from '../util/symbols'

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

    render()
    {

        var suggestionList;
        if (this.hasSuggestions && this.state.hasFocus)
        {
            const inputLength = this.state.input.length;

            const listItems = this.suggestedCities.map((cityState,i) => {
                
                const displayText = cityState.join(", ");
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
                onClick = {onClick.bind(this)}>
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
            <input className="search-bar" type="text" name="location" value={this.state.input}
                placeholder="Search US Cities"
                onBlur = {this.handleBlur.bind(this)}
                onFocus = {this.handleFocus.bind(this)}
                onChange = {this.handleInput.bind(this)} 
                onKeyDown = {this.handleKeyDown.bind(this)}/>
            {Symbols.magnifyingGlass}
            {suggestionList}
        </div>
        )
    }

    handleFocus()
    {
        this.setState({hasFocus: true});
    }

    handleBlur()
    {
        //this.setState({hasFocus: false});
    }

    handleInput(event)
    {
        const input = event.target.value;
        this.setState({ input : input });

        fetch("http://localhost:4000/match_location?location=" + input)
            .then(body => body.json())
            .then(res => {

                this.itemRefs = [];
                res.cities.forEach(city => {
                    this.itemRefs.push(React.createRef());
                });
                
                this.setState({suggestions: res, suggestionIndex: 0})
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
        return this.state.suggestions;
    }

    submitSuggestion(index)
    {
        index = index || this.state.suggestionIndex;
        var queryText = this.suggestedCities[index].join(", ");
        this.setState({input: queryText, suggestions : null});
        this.props.onSubmit(queryText + ", USA");
    }

    handleKeyDown(event)
    {
        if (event.key === 'Enter') 
        {
            if (this.hasSuggestions)
            {
              this.submitSuggestion();
            }
            else if (this.state.input)
            {
                this.props.onSubmit(this.state.input);
            }
        }

        if (event.key === 'ArrowDown' && this.state.suggestions)
        {
            event.preventDefault();
            let suggestionIndex = Math.min(this.suggestedCities.length - 1, this.state.suggestionIndex + 1);
            this.setState({suggestionIndex : suggestionIndex});
            this.itemRefs[suggestionIndex].current.scrollIntoView({
                behavior : 'smooth'
            });
        }

        if (event.key === 'ArrowUp' && this.state.suggestions)
        {
            event.preventDefault();
            let suggestionIndex = Math.max(0, this.state.suggestionIndex - 1);
            this.setState({suggestionIndex : suggestionIndex});
            this.itemRefs[suggestionIndex].current.scrollIntoView({
                behavior : 'smooth'
            });
        }
    }
}

export default SearchBar