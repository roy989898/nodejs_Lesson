/**
 * Created by User on 6/9/2016.
 */

var rect = require("./rectangle-2");
rect.perimeter(10, 6, function (error, p) {

    if (error)
        console.log(error);
    else
        console.log(p);

})
