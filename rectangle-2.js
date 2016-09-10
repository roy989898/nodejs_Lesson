/**
 * Created by User on 6/9/2016.
 */

exports.perimeter = function (x, y, callback) {
    try {
        if (x < 0 || y < 0) {
            throw new Error("x or y is <0");
        } else {
            callback(null, (x + y) * 2);
        }

    } catch (error) {
        callback(error, null);
    }

}
