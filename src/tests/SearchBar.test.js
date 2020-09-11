import React from 'react';
import { render, fireEvent, waitForDomChange} from '@testing-library/react';
import SearchBar from '../components/SearchBar'

describe ("SearchBar", () => {

    it("Renders without crashing", () => {

        function submitCity()
        {}

        const {getByPlaceholderText } = render(<SearchBar submitCity={submitCity}/>);
        
        expect(getByPlaceholderText("Search US Cities")).toBeInTheDocument();

    })

    it("Displays matching cities and can submit query", async (done) => {

        function submitCity(cityData)
        {
            expect(cityData.cty).toBe("Atlanta");
            done();
        }

        //Mock results for fetching matching city names
        jest.spyOn(global, 'fetch').mockImplementation(() => {
            return Promise.resolve(
                {
                    json : () => {
                        return Promise.resolve({cities:[{"cty":"Atlanta","sid":"GA","pop":5228750,"lat":33.7627,"lon":-84.4225}]});
                    }
                })
            });

        const { getByText,  getByPlaceholderText } = render(<SearchBar submitCity={submitCity} />);
        const input = getByPlaceholderText("Search US Cities");  

        //Wait a second for search bar to display results
        setTimeout(() => {

            expect(getByText("tlanta, GA")).toBeInTheDocument()
            
            //Press enter key
            //TODO test other input methods as well
            input.focus();
            fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

        }, 1000);
        
        input.focus();
        fireEvent.change(input,  { target: { value: 'a' }}  );
        expect(input.value).toBe('a');

    });
});