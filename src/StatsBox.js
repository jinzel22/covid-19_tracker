import React from 'react';
import "./StatsBox.css";
import {Card, CardContent, Typography} from "@material-ui/core";


function StatsBox({title, cases, total, isRed, active, ...props}) {
  return (
    <Card className={`statsBox ${active && 'statsBox--selected'} ${isRed && 'statsBox--red'}`}
          onClick={props.onClick}
          >
      <CardContent>
        <Typography className="statsbox__title" color="textSecondary">
        {title}
        </Typography>

        <h2 className={`statsbox__cases ${!isRed && 'statsbox__cases--green'}`}>
        Today: {cases}
        </h2>

        <Typography className="statsbox__total" color="textSecondary">
        Total: {total}
        </Typography>

      </CardContent>
    </Card>
  )
}

export default StatsBox;
