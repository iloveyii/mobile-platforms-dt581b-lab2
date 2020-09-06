import React from 'react';
import {Grid} from "@material-ui/core";
import Left from './Left';
import Right from './Right';


export default props =>
    <Grid container>
        <Grid item sm>
            <Left/>
        </Grid>
        <Grid item sm>
            <Right/>
        </Grid>
    </Grid>
