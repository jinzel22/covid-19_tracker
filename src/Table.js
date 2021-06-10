import React from 'react';
import "./Table.css";
import numeral from "numeral";
import {FastCounter} from 'react-smooth-counter';

function Table ({countries}) {
  return (
    <div className="table">
      {countries.map(({country, cases}) =>(
        <tr>
          <td>
            {country}
          </td>
          <td>
            <strong>
              <FastCounter
                delay={0}
                startNumber={0}
                to={cases}
              />

            </strong>
          </td>
        </tr>
      ))}
    </div>
  )
}

export default Table;
