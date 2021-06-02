import React from 'react';
import {Card, CardContent, Typography} from "@material-ui/core"

function StatsBox({title, cases, total}) {
  return (
    <Card className="statsBox">
      <CardContent>
        <Typography className="statsbox__title" color="textSecondary">
        {title}
        </Typography>

        <h2 className="statsbox__cases">
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
